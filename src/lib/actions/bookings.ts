// src/lib/actions/bookings.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCleanupMinutes } from './settings' 

// --- 1. ĐỊNH NGHĨA CÁC INTERFACE CẦN THIẾT ---

// Interface cho việc check trùng (đã có)
interface BookingCollisionCheck {
  booking_item_id: number;
  booking_id: number;
  start_dt: string;
  end_dt: string;
  cleanup_minutes: number | null;
}

interface ActiveBookingResult {
  booking_id: number;
  bookings: {
    status: string | null;
  } | null;
}

// Interface CHUẨN cho dữ liệu trả về Calendar (FIX LỖI SelectQueryError)
export interface CalendarBookingItem {
  booking_item_id: number;
  start_dt: string;
  end_dt: string;
  room_id: number;
  cleanup_minutes?: number | null; // Cột mới thêm
  rooms: { 
    name: string | null; 
    code: string | null; 
  } | null;
  bookings: {
    booking_id: number;
    status: string | null;
    customer_id: number | null;
    customers: { 
      full_name: string | null; 
      phone: string | null; 
    } | null;
  } | null;
}

export interface BookingItemInput {
  roomId: number;
  startDt: string; 
  endDt: string;   
  price: number;   
}

export interface ServiceInput {
  serviceId: number;
  quantity: number;
  price: number;   
  type: 'service' | 'surcharge' | 'compensation';
}

export interface CreateBookingDTO {
  customerId: number; 
  staffId: number;    
  deposit: number;    
  discount: number;   
  discountReason?: string;
  notes?: string;
  items: BookingItemInput[]; 
  services?: ServiceInput[]; 
}

// ==============================================================================
// 1. KIỂM TRA PHÒNG TRỐNG (CHECK AVAILABILITY)
// ==============================================================================
export async function checkRoomAvailability(roomId: number, startStr: string, endStr: string) {
  const supabase = await createClient()
  const currentGap = await getCleanupMinutes();

  const { data: rawData, error } = await supabase
    .from('booking_items')
    .select('booking_item_id, booking_id, start_dt, end_dt, cleanup_minutes') 
    .eq('room_id', roomId)
    .filter('start_dt', 'lt', new Date(new Date(endStr).getTime() + 120 * 60000).toISOString()) 
    .filter('end_dt', 'gt', new Date(new Date(startStr).getTime() - 120 * 60000).toISOString())

  if (error) return { valid: false, error: error.message }

  const data = rawData as unknown as BookingCollisionCheck[];

  if (data && data.length > 0) {
    const itemIds = data.map(i => i.booking_item_id)
    
    const { data: rawActiveBookings } = await supabase
      .from('booking_items')
      .select('booking_id, bookings!inner(status)')
      .in('booking_item_id', itemIds)
      .in('bookings.status', ['pending', 'confirmed', 'checked_in'])
    
    const activeBookings = rawActiveBookings as unknown as ActiveBookingResult[];
    
    if (activeBookings && activeBookings.length > 0) {
      const isOverlap = data.some(existingItem => {
        const isActive = activeBookings.find(ab => ab.booking_id === existingItem.booking_id);
        if (!isActive) return false;

        const oldStart = new Date(existingItem.start_dt).getTime();
        const oldEnd = new Date(existingItem.end_dt).getTime();
        const oldGap = (existingItem.cleanup_minutes || 60) * 60000; 

        const newStart = new Date(startStr).getTime();
        const newEnd = new Date(endStr).getTime();
        const newGap = currentGap * 60000;

        const clash1 = (newStart < oldEnd + oldGap) && (newEnd > oldStart);
        const clash2 = (oldStart < newEnd + newGap) && (oldEnd > newStart);

        return clash1 || clash2;
      });

      if (isOverlap) {
        return { valid: false, error: `Phòng bị trùng lịch hoặc vi phạm thời gian dọn dẹp.` }
      }
    }
  }

  return { valid: true }
}

// ==============================================================================
// 2. TẠO BOOKING (TRANSACTION)
// ==============================================================================

export async function createBooking(payload: CreateBookingDTO) {
  const supabase = await createClient()
  const currentCleanupMinutes = await getCleanupMinutes();

  // --- BƯỚC 1: TẠO HEADER ---
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      customer_id: payload.customerId,
      created_by: payload.staffId,
      status: 'confirmed', 
      deposit_amount: payload.deposit,
      deposit_paid: 0, 
      discount_amount: payload.discount,
      discount_reason: payload.discountReason,
      notes: payload.notes,
      vat_percent_snapshot: 8, 
      total_estimate: 0, 
      total_actual: 0
    })
    .select()
    .single()

  if (bookingError) return { success: false, error: 'Lỗi tạo đơn: ' + bookingError.message }
  
  // FIX: Thay thế 'any' bằng định nghĩa kiểu inline để tránh lỗi Linter
  const bookingId = (booking as { booking_id: number }).booking_id;

  // --- BƯỚC 2: TẠO ITEMS ---
  try {
    const itemsToInsert = payload.items.map(item => ({
      booking_id: bookingId,
      room_id: item.roomId,
      start_dt: item.startDt,
      end_dt: item.endDt,
      price_snapshot: item.price,
      cleanup_minutes: currentCleanupMinutes 
    }))

    const { error: itemsError } = await supabase
      .from('booking_items')
      .insert(itemsToInsert)

    if (itemsError) throw itemsError 

    // --- BƯỚC 3: TẠO SERVICES ---
    if (payload.services && payload.services.length > 0) {
      const servicesToInsert = payload.services.map(s => ({
        booking_id: bookingId,
        service_id: s.serviceId,
        quantity: s.quantity,
        type: s.type,
        unit_price_snapshot: s.price,
        computed_amount: s.quantity * s.price
      }))

      const { error: serviceError } = await supabase
        .from('booking_services')
        .insert(servicesToInsert)
      
      if (serviceError) throw serviceError
    }
    
    revalidatePath('/admin/bookings')
    revalidatePath('/admin/calendar')
    return { success: true, bookingId }

  } catch (error: unknown) {
    console.error("Booking Transaction Failed. Rolling back...", error)
    await supabase.from('bookings').delete().eq('booking_id', bookingId)
    
    const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
    return { success: false, error: 'Đặt phòng thất bại: ' + errMsg }
  }
}

// ==============================================================================
// 3. LẤY DANH SÁCH BOOKING (CHO CALENDAR)
// ==============================================================================

export async function getBookingsForCalendar(startStr: string, endStr: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('booking_items')
    .select(`
      *,
      cleanup_minutes, 
      rooms ( name, code ),
      bookings ( 
        status, 
        customer_id, 
        deposit_amount,
        customers ( full_name, phone )
      )
    `)
    .lt('start_dt', endStr)
    .gt('end_dt', startStr)
    .not('bookings.status', 'eq', 'cancelled')

  if (error) {
    console.error("Error fetching calendar bookings:", error);
    return [];
  }

  // FIX LỖI TypeScript: Ép kiểu 'data' (đang bị Supabase hiểu là lỗi) về Interface chuẩn
  // Kỹ thuật "Double Casting": (data as unknown) -> as CalendarBookingItem[]
  return (data as unknown) as CalendarBookingItem[];
}


// Hàm update thời gian & phòng khi kéo thả
export async function updateBookingTime(
  bookingItemId: number, 
  newStart: string, 
  newEnd: string, 
  newRoomId: number
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('booking_items')
    .update({
      start_dt: newStart,
      end_dt: newEnd,
      room_id: newRoomId
    })
    .eq('booking_item_id', bookingItemId);

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/admin'); 
  return { success: true };
}