'use client';

import { format } from 'date-fns';
import { Calendar, MapPin, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ScheduleItem {
  booking_item_id: number;
  start_dt: string;
  end_dt: string;
  rooms: { 
    name: string | null; 
    code: string | null; // <-- QUAN TRỌNG: Cho phép null
  } | null;
  bookings: {
    status: string | null;
    customers: { full_name: string | null; phone: string | null } | null;
  } | null;
}

export default function TodaySchedule({ bookings }: { bookings: ScheduleItem[] }) {
  if (bookings.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[var(--admin-sub)] opacity-70 min-h-[300px]">
        <Calendar size={48} strokeWidth={1} className="mb-2" />
        <p>Hôm nay không có lịch chụp nào.</p>
        <Link 
            href="/admin/calendar" 
            className="mt-4 text-sm text-[var(--admin-primary)] hover:underline flex items-center gap-1"
        >
            Tạo booking ngay <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((item) => {
        const startDate = new Date(item.start_dt);
        const endDate = new Date(item.end_dt);
        const status = item.bookings?.status || 'pending';
        
        // Màu sắc trạng thái
        let statusColor = 'bg-gray-100 text-gray-600';
        if (status === 'confirmed') statusColor = 'bg-blue-100 text-blue-600';
        if (status === 'completed') statusColor = 'bg-green-100 text-green-600';
        if (status === 'cancelled') statusColor = 'bg-red-100 text-red-600';

        return (
          <div key={item.booking_item_id} className="flex gap-4 p-3 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-bg)] hover:border-[var(--admin-primary)] transition-colors group">
            
            {/* Cột giờ */}
            <div className="flex flex-col items-center justify-center w-16 p-2 bg-[var(--admin-card)] rounded-lg border border-[var(--admin-border)] shrink-0">
              <span className="text-lg font-bold text-[var(--admin-fg)] leading-none">
                {format(startDate, 'HH:mm')}
              </span>
              <span className="text-[10px] text-[var(--admin-sub)] mt-1">
                đến {format(endDate, 'HH:mm')}
              </span>
            </div>

            {/* Thông tin chính */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-[var(--admin-fg)] truncate">
                  {item.bookings?.customers?.full_name || 'Khách vãng lai'}
                </h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColor}`}>
                  {status}
                </span>
              </div>
              
              <div className="mt-1 space-y-1">
                <div className="flex items-center gap-2 text-xs text-[var(--admin-sub)]">
                  <MapPin size={12} /> 
                  <span className="font-medium text-[var(--admin-fg)]">
                    {item.rooms?.name || item.rooms?.code || 'Chưa xếp phòng'}
                  </span>
                </div>
                {item.bookings?.customers?.phone && (
                    <div className="flex items-center gap-2 text-xs text-[var(--admin-sub)]">
                    <User size={12} /> {item.bookings.customers.phone}
                    </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="pt-2 text-center">
        <Link href="/admin/calendar" className="text-xs text-[var(--admin-sub)] hover:text-[var(--admin-primary)] hover:underline">
            Xem toàn bộ lịch trình &rarr;
        </Link>
      </div>
    </div>
  );
}