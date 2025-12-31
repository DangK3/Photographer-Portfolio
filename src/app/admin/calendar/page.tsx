import React from "react";
import { getBookingsForCalendar } from '@/lib/actions/bookings';
import { getRooms, getServices } from '@/lib/actions/studio';
import { getCurrentUserProfile } from '@/lib/actions/users'; 
import { getCleanupMinutes } from '@/lib/actions/settings';
import DashboardCalendar from '@/components/admin/DashboardCalendar'; 

// Helper interface mapping để hứng dữ liệu từ DB
interface ServiceFromDB {
  service_id: number;
  name: string;
  category: string | null;
  type: "service" | "surcharge" | "compensation";
  unit: string | null;
  price: number;
  is_active: boolean | null;
}

export default async function CalendarPage() {
  // 1. Chuẩn bị khoảng thời gian
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 30);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 30);

  const startStr = startDate.toISOString();
  const endStr = endDate.toISOString();

  // 2. Fetch dữ liệu song song
  const [rooms, rawBookings, rawServices, userProfile, cleanupMinutes] = await Promise.all([
    getRooms(),
    getBookingsForCalendar(startStr, endStr),
    getServices(),
    getCurrentUserProfile(),
    getCleanupMinutes(),
  ]);

  // 3. XỬ LÝ DỮ LIỆU SERVICES (Quan trọng)
  const services = (rawServices as ServiceFromDB[]).map((service) => ({
    ...service,
    // FIX QUAN TRỌNG: 
    // 'category' trong interface là optional (?) nên bắt buộc phải là 'undefined', không chịu 'null'
    category: service.category ?? undefined, 

    // 'unit' trong interface là 'string | null', nên giữ nguyên 'null', không ép về undefined
    unit: service.unit,

    is_active: service.is_active ?? true,
  }));

  // 4. Xử lý dữ liệu Bookings
  const bookings = rawBookings.map((item) => ({
    ...item,
    booking_id: item.bookings?.booking_id || 0,
  }));

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Lịch Đặt Phòng</h1>
      </div>

      <div className="flex-1 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <DashboardCalendar
          rooms={rooms}
          bookings={bookings} 
          services={services} 
          currentUserId={Number(userProfile?.user_id ?? 0)}
          cleanupMinutes={cleanupMinutes}
        />
      </div>
    </div>
  );
}