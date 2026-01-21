// src/components/admin/DashboardCalendar.tsx
'use client'

import { useEffect, useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { RoomWithBranch, ServiceItem } from '@/lib/actions/studio';
import { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop';
import { useCalendar } from '@/context/CalendarContext'; 
import moment from 'moment';
import BookingDetailModal from './calendar/BookingDetailModal';
import BookingCalendar, { BookingItem, CalendarEvent } from './calendar/BookingCalendar'; 
import BookingCreateModal from './calendar/BookingCreateModal';
import { updateBookingTime } from '@/lib/actions/bookings';

interface DashboardCalendarProps {
  rooms: RoomWithBranch[];
  bookings: BookingItem[]; 
  services: ServiceItem[];
  currentUserId: number;
  cleanupMinutes: number; 
}

export default function DashboardCalendar({
  rooms,
  bookings: initialBookings,
  services,
  currentUserId,
  cleanupMinutes
}: DashboardCalendarProps) {
  

   const { 
      date, setDate, 
      visibleRoomIds, setVisibleRoomIds, 
      isCreateModalOpen, setCreateModalOpen
  } = useCalendar();

  const availableRooms = useMemo(() => {
    return rooms.filter(r => r.status === 'available' && !r.is_equipment_room);
  }, [rooms]);

  // --- SYNC VISIBLE ROOMS LẦN ĐẦU (Nếu Nav chưa chạy kịp) ---
  useEffect(() => {
      // Dùng logic set 1 lần (Bulk Set) thay vì forEach loop
      if (availableRooms.length > 0 && visibleRoomIds.length === 0) {
          const allIds = availableRooms.map(r => r.room_id);
          setVisibleRoomIds(allIds);
      }
  }, [availableRooms, visibleRoomIds.length, setVisibleRoomIds]);

  // 3. STATE LOCAL DATA
  const [localBookings, setLocalBookings] = useState<BookingItem[]>(initialBookings);
  useEffect(() => {
    setLocalBookings(initialBookings);
  }, [initialBookings]);

  // 4. LỌC DỮ LIỆU HIỂN THỊ
  // Lọc Booking: Chỉ hiện booking của các phòng được check
  const filteredBookings = localBookings.filter(b => visibleRoomIds.includes(b.room_id));
  
  // Lọc Cột Phòng: Chỉ hiện các cột được check (cho giao diện Day view đỡ rối)
  const filteredRooms = rooms.filter(r => visibleRoomIds.includes(r.room_id));

  // State local cho slot được chọn (để truyền vào Modal)
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
    roomId: number;
  } | null>(null);

  // --- LOGIC EVENT HANDLERS (Drag, Drop, Resize) ---
  const handleEventChange = useCallback(async ({ event, start, end, resourceId }: EventInteractionArgs<CalendarEvent>) => {
    const lockedStatuses = ['checked_in', 'checked_out', 'completed', 'paid', 'cancelled'];  
    if (event.status && lockedStatuses.includes(event.status)) {
    toast.error(`Không thể sửa lịch khi trạng thái là ${event.status}`);
    return;
    }
    const bookingItemId = Number(event.id);
      if (isNaN(bookingItemId)) return;

      const newStartDate = new Date(start);
      const newEndDate = new Date(end);
      const newRoomId = resourceId ? Number(resourceId) : event.resourceId;

      // Optimistic Update
      setLocalBookings((prev) => prev.map((b) => {
        if (b.booking_item_id === bookingItemId) {
          return { ...b, start_dt: newStartDate.toISOString(), end_dt: newEndDate.toISOString(), room_id: newRoomId };
        }
        return b;
      }));

      try {
        const res = await updateBookingTime(bookingItemId, newStartDate.toISOString(), newEndDate.toISOString(), newRoomId);
        if (res.success) toast.success("Đã cập nhật lịch!");
        else {
            toast.error(res.error);
            setLocalBookings(initialBookings);
        }
      } catch (error) { 
          toast.error("Lỗi kết nối" + (error instanceof Error ? error.message : ""));
          setLocalBookings(initialBookings);
      }
  }, [initialBookings]); 

  // --- CLICK EMPTY SLOT ---
  const handleSlotSelect = ({ start, end, resourceId }: { start: Date; end: Date; resourceId: number }) => {
    setSelectedSlot({ start, end, roomId: resourceId });
    setCreateModalOpen(true); // Mở Modal thông qua Context
  };

  // --- MAPPING DATA CHO CALENDAR ---
  const calendarRooms = filteredRooms.map(r => ({
    room_id: r.room_id,
    name: r.name,
    code: r.code,
    status: r.status
  }));

  const defaultStartTime = useMemo(() => {
    const now = new Date();
    if (now.getMinutes() > 0) {
        now.setMinutes(now.getMinutes() + (15 - now.getMinutes() % 15)); // Làm tròn lên 15p
    }
    now.setSeconds(0);
    now.setMilliseconds(0);
    return now;
  }, []);
  // Initial Data cho Modal (Xử lý trường hợp mở từ nút "Tạo mới" ở Widget -> chưa có slot)
  const modalInitialData = useMemo(() => {
    if (selectedSlot) {
      return {
        start: selectedSlot.start,
        end: selectedSlot.end,
        roomId: selectedSlot.roomId
      };
    }
    // Nếu tạo mới thủ công: Dùng mốc thời gian cố định
    return {
      start: defaultStartTime, 
      end: moment(defaultStartTime).add(1, 'hours').toDate(),
      roomId: rooms[0]?.room_id || 0
    };
  }, [selectedSlot, rooms, defaultStartTime]);

  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Handler khi click vào event
  const handleSelectEvent = (event: CalendarEvent) => {
      if (event.type === 'cleanup') return;
      
      // Lấy booking_id từ field resource ta đã thêm ở BookingCalendar
      const bId = event.resource?.bookingId;
      if (bId) {
          setSelectedBookingId(bId);
          setIsDetailOpen(true);
      }
  };

  return (
    <div className="h-full overflow-hidden shadow-sm flex flex-col">
      <div className="flex-1 min-h-0">
        <BookingCalendar 
            bookings={filteredBookings} 
            rooms={calendarRooms} 
            date={date} 
            cleanupMinutes={cleanupMinutes} // 3. TRUYỀN XUỐNG
            onNavigate={setDate} 
            onSelectSlot={handleSlotSelect} 
            onEventDrop={(args) => handleEventChange(args)}   
            onEventResize={(args) => handleEventChange(args)}
            onSelectEvent={handleSelectEvent}
        />
      </div>
      <BookingDetailModal 
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            bookingId={selectedBookingId}
            servicesList={services} // Truyền list dịch vụ để chọn OT/Phí
        />
      <BookingCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        initialData={modalInitialData}
        rooms={rooms}
        services={services}
        currentUserId={currentUserId}
      />
    </div>
  );
}