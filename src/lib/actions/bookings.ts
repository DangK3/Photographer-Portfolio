// src/lib/actions/bookings.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCleanupMinutes } from './settings' 
import { getErrorMessage } from '@/lib/utils'; 
import { Database } from '../../../types/supabase';
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
  booking_id: number; // Đảm bảo trường này có
  start_dt: string;
  end_dt: string;
  room_id: number;
  cleanup_minutes?: number | null;
  rooms: { 
    name: string | null; 
    code: string | null; 
  } | null;
  bookings: {
    booking_id: number;
    status: Database['public']['Enums']['booking_status'] | null; // Dùng Enum chuẩn
    customer_id: number | null;
    deposit_amount: number | null; // Thêm trường này nếu dùng trong Calendar
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
  const supabase = await createClient();

  try {
    // Gọi RPC (Stored Procedure)
    const { data: bookingId, error } = await supabase.rpc('create_booking_transaction', {
      p_customer_id: payload.customerId,
      p_created_by: payload.staffId,
      p_deposit_amount: payload.deposit,
      p_discount_amount: payload.discount,
      p_notes: payload.notes,
      p_items: payload.items.map(i => ({
        room_id: i.roomId,
        start_dt: i.startDt,
        end_dt: i.endDt,
        price: i.price
      })),
      p_services: payload.services?.map(s => ({
        service_id: s.serviceId,
        quantity: s.quantity,
        price: s.price,
        type: s.type
      })) || []
    });

    if (error) {
        // Lỗi từ Trigger DB sẽ được trả về đây
        // Ví dụ: 'Lỗi đặt phòng: Vi phạm thời gian dọn dẹp hoặc trùng lịch.'
        throw error;
    }

    revalidatePath('/admin/bookings');
    revalidatePath('/admin/calendar');
    
    // Ép kiểu về number vì RPC trả về BIGINT (có thể là string hoặc number tuỳ driver)
    return { success: true, bookingId: Number(bookingId) };

  } catch (error: unknown) { 
    console.error("Booking RPC Failed:", error);
    return { success: false, error: getErrorMessage(error) };
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
      bookings!inner ( 
        status, 
        customer_id, 
        deposit_amount,
        customers ( full_name, phone )
      )
    `)
    .lt('start_dt', endStr)
    .gt('end_dt', startStr);

  if (error) {
    console.error("Error fetching calendar bookings:", JSON.stringify(error, null, 2));
    return [];
  }
  
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