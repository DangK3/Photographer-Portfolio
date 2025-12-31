// src/lib/actions/booking-details.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 1. Lấy chi tiết Booking
export async function getBookingDetails(bookingId: number) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      customers (*),
      booking_items (
        *, 
        rooms (name, code)
      ),
      booking_services (
        *, 
        services (name, price, unit, category)
      )
    `)
    .eq('booking_id', bookingId)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

// 2. Thêm dịch vụ
export async function addBookingService(bookingId: number, serviceId: number, quantity: number, price: number) {
  const supabase = await createClient();

  const { error } = await supabase.from('booking_services').insert({
    booking_id: bookingId,
    service_id: serviceId,
    quantity: quantity,
    unit_price_snapshot: price,
    computed_amount: quantity * price,
    type: 'surcharge' 
  });
  
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin');
  return { success: true };
}

// 3. Xóa dịch vụ
export async function removeBookingService(bookingServiceId: number) {
  const supabase = await createClient();
  const { error } = await supabase.from('booking_services').delete().eq('booking_service_id', bookingServiceId);
  
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin');
  return { success: true };
}

// Định nghĩa Type Status khớp với DB (Logic của App)
export type BookingStatus = 
  | "pending"       
  | "confirmed"     
  | "checked_in"    
  | "checked_out"   
  | "paid"          
  | "completed"     
  | "cancelled";    

// 4. CHECK-IN
export async function checkInCustomer(bookingId: number, roomId: number, bookedStart: string) {
  const supabase = await createClient();
  const now = new Date(); 

  const { data: settingData } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'EARLY_CHECKIN_GRACE_MINUTES')
    .single();
  const graceMinutes = Number(settingData?.value || 40);

  const bookedStartDate = new Date(bookedStart);
  const diffMinutes = (bookedStartDate.getTime() - now.getTime()) / 60000;

  if (diffMinutes > graceMinutes) {
      const { data: conflicts } = await supabase
        .from('booking_items')
        .select('booking_item_id')
        .eq('room_id', roomId)
        .neq('booking_id', bookingId) 
        .lt('start_dt', bookedStartDate.toISOString()) 
        .gt('end_dt', now.toISOString());

      if (conflicts && conflicts.length > 0) {
          return { success: false, error: "Không thể check-in sớm: Đang có khách khác sử dụng phòng." };
      }
  }

  const { error } = await supabase
    .from('bookings')
    .update({ 
        status: 'checked_in',
        check_in_at: now.toISOString()
    })
    .eq('booking_id', bookingId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin');
  return { success: true };
}

// 5. CHECK-OUT (FIX LỖI TYPE Ở ĐÂY)
export async function checkOutCustomer(bookingId: number) {
    const supabase = await createClient();
    const now = new Date();

    const { error } = await supabase
        .from('bookings')
        .update({ 
            status: 'checked_out', 
            check_out_at: now.toISOString() 
        })
        .eq('booking_id', bookingId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin');
    return { success: true };
}

// 6. CONFIRM PAYMENT (FIX LỖI TYPE Ở ĐÂY)
export async function confirmPayment(bookingId: number, totalActual: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('bookings')
        .update({ 
            // FIX: Ép kiểu 'as any'
            status: 'paid', 
            total_actual: totalActual
        })
        .eq('booking_id', bookingId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin');
    return { success: true };
}

// 7. FINALIZE
export async function finalizeBooking(bookingId: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('bookings')
        .update({ 
            status: 'completed' 
        })
        .eq('booking_id', bookingId);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin');
    return { success: true };
}

// 8. UPDATE STATUS CHUNG (FIX LỖI TYPE Ở ĐÂY)
export async function updateBookingStatus(bookingId: number, status: string, totalActual?: number) {
  const supabase = await createClient();
  
  const payload: { status: BookingStatus; total_actual?: number } = { 
    status: status as BookingStatus 
  };
  if (totalActual !== undefined) payload.total_actual = totalActual;
  
  // FIX: Ép kiểu payload 'as any' để Supabase client chấp nhận status mới
  const { error } = await supabase.from('bookings').update(payload).eq('booking_id', bookingId);
  
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin');
  return { success: true };
}