'use client'

import { 
  Calendar, 
  momentLocalizer, 
  Views, 
  View, 
  EventProps, 
  SlotInfo,
  EventPropGetter,
} from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/vi'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import React, { useState, useMemo, useCallback } from 'react'
import CustomToolbar from './CustomToolbar'
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import { ROOM_COLORS } from '@/lib/constants';

// Cấu hình Moment tiếng Việt
moment.locale('vi')
const localizer = momentLocalizer(moment)

// --- TYPE DEFINITIONS ---
interface BookingInfo {
  booking_id: number; // Đảm bảo field này tồn tại nếu bạn dùng nested
  status: string | null;
  customers: {
    full_name: string | null;
  } | null;
}

export interface BookingItem {
  booking_item_id: number;
  // QUAN TRỌNG: Thêm booking_id vào đây (FK từ bảng booking_items)
  booking_id: number; 
  start_dt: string;
  end_dt: string;
  room_id: number;
  bookings: BookingInfo | null;
}

export interface CalendarResource {
  id: number;
  title: string;
}

interface Room {
  room_id: number;
  name: string | null;
  code: string | null;
  status: 'available' | 'maintenance' | 'inactive';
  is_equipment_room?: boolean;
}

export interface CalendarEvent {
  id: string | number;
  title: string;       
  start: Date;
  end: Date;
  resourceId: number;  
  type: 'booking' | 'cleanup';
  status?: string;
  allDay?: boolean;
  resource?: { 
    bookingId?: number; 
  };
}

interface BookingCalendarProps {
  bookings: BookingItem[]; 
  rooms: Room[];
  date: Date;
  cleanupMinutes?: number;
  onNavigate: (newDate: Date) => void;
  onSelectSlot?: (info: { start: Date; end: Date; resourceId: number }) => void;
  // Prop quan trọng để nhận sự kiện click
  onSelectEvent?: (event: CalendarEvent) => void; 
  onEventDrop?: (args: EventInteractionArgs<CalendarEvent>) => void;
  onEventResize?: (args: EventInteractionArgs<CalendarEvent>) => void;
}

const DnDCalendar = withDragAndDrop<CalendarEvent, CalendarResource>(Calendar)

// --- CUSTOM EVENT COMPONENT ---
const CustomEvent = ({ event }: EventProps<CalendarEvent>) => {
  return (
    <div className="h-full w-full flex flex-col px-1.5 py-0.5 leading-snug overflow-hidden relative group">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-black/20"></div>
      
      {event.type === 'cleanup' ? (
        <div className="flex items-center gap-1 text-[10px] italic opacity-75">
          <span>🧹</span> <span>Dọn dẹp</span>
        </div>
      ) : (
        <>
          <div className="font-bold text-[11px] truncate mt-0.5">
            {event.title}
          </div>
          <div className="text-[10px] opacity-90 truncate flex items-center gap-1">
             <span className={`w-1.5 h-1.5 rounded-full ${event.status === 'confirmed' ? 'bg-white' : 'bg-white/50'}`}></span>
             <span className="capitalize">{event.status === 'confirmed' ? 'Đã cọc' : event.status}</span>
          </div>
        </>
      )}
    </div>
  )
}

export default function BookingCalendar({ 
  bookings,
  rooms,
  date, 
  cleanupMinutes = 60,
  onNavigate,
  onSelectSlot,
  onSelectEvent, // 1. Nhận prop này từ cha
  onEventDrop, 
  onEventResize 
}: BookingCalendarProps) {
  
  const [view, setView] = useState<View>(Views.DAY)

  // Mapping Events
  const events: CalendarEvent[] = useMemo(() => {
    const list: CalendarEvent[] = []
    bookings.forEach((b) => {
      // 2. SỬA LOGIC LẤY BOOKING ID
      // Lấy trực tiếp b.booking_id (FK) thay vì b.bookings?.booking_id (Nested) để chắc chắn có dữ liệu
      const bookingId = b.booking_id || b.bookings?.booking_id;

      list.push({
        id: b.booking_item_id,
        title: b.bookings?.customers?.full_name || 'Khách vãng lai', 
        start: new Date(b.start_dt),
        end: new Date(b.end_dt),
        resourceId: b.room_id, 
        type: 'booking',
        status: b.bookings?.status || 'unknown',
        allDay: false,
        // Lưu bookingId vào đây
        resource: { bookingId: bookingId } 
      })

      // Logic Cleanup
      const cleanupStart = new Date(b.end_dt);
      const cleanupEnd = moment(b.end_dt).add(cleanupMinutes, 'minutes').toDate();

      list.push({
        id: `cleanup-${b.booking_item_id}`,
        title: `Dọn dẹp (${cleanupMinutes}p)`,
        start: cleanupStart,
        end: cleanupEnd,
        resourceId: b.room_id,
        type: 'cleanup',
        allDay: false
      })
    })
    return list
  }, [bookings, cleanupMinutes])

  const resources: CalendarResource[] = useMemo(() => {
    return rooms
    .filter(r => r.status === 'available' && !r.is_equipment_room)
    .map(r => ({ id: r.room_id, title: r.name || `Room ${r.code}` }))
  }, [rooms])

  // Styling logic
  const eventStyleGetter: EventPropGetter<CalendarEvent> = useCallback((event) => {
    const resourceIndex = resources.findIndex(r => r.id === event.resourceId);
    let color = resourceIndex >= 0 ? ROOM_COLORS[resourceIndex % ROOM_COLORS.length] : '#6b7280';

    // Logic màu OT
    const now = new Date();
    if (event.status === 'checked_in' && now > event.end) {
        color = 'var(--admin-ot)'; 
    } else if (event.status === 'completed') {
        color = 'var(--status-completed)';
    }

    if (event.type === 'cleanup') {
      return {
        style: {
          backgroundColor: 'var(--admin-bg)',
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 10px)',
          color: 'var(--admin-sub)',
          border: '1px dashed var(--admin-border)',
          fontSize: '10px',
          pointerEvents: 'none',
          cursor: 'default',
          borderRadius: '4px',
          zIndex: 1
        }
      }
    }

    return {
      style: {
        backgroundColor: color,
        border: 'none',
        color: '#fff',
        borderRadius: '4px',
        opacity: event.status === 'cancelled' ? 0.5 : 1, 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 10,
        cursor: 'pointer' // Thêm cursor pointer để biết click được
      }
    }
  }, [resources])

  const handleSelectSlotInternal = useCallback((slotInfo: SlotInfo) => {
    if (!slotInfo.resourceId) return
    if (onSelectSlot) {
      onSelectSlot({
        start: slotInfo.start as Date,
        end: slotInfo.end as Date,
        resourceId: Number(slotInfo.resourceId)
      })
    }
  }, [onSelectSlot])

  return (
    <div className="h-full w-full bg-[var(--admin-card)] text-[var(--admin-fg)] font-sans">
      <DnDCalendar
        localizer={localizer}
        events={events}
        resources={view === Views.DAY ? resources : undefined} 
        resourceIdAccessor={(r: CalendarResource) => r.id}
        resourceTitleAccessor={(r: CalendarResource) => r.title}
        view={view}
        onView={setView}
        date={date}
        onNavigate={onNavigate}
        components={{
          toolbar: CustomToolbar,
          event: CustomEvent,
          resourceHeader: ({ label }) => (
             <div className="text-sm font-bold text-[var(--admin-fg)] py-1">{label}</div>
          )
        }}
        eventPropGetter={eventStyleGetter}
        selectable
        onSelectSlot={handleSelectSlotInternal}
        onSelectEvent={onSelectEvent} 
        draggableAccessor={() => true} 
        resizable 
        onEventDrop={onEventDrop}     
        onEventResize={onEventResize} 
        step={30} 
        timeslots={2} 
        min={new Date(0, 0, 0, 0, 0, 0)} 
        max={new Date(0, 0, 0, 23, 59, 59)} 
        views={[Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA]} 
        defaultView={Views.DAY} 
      />
    </div>
  )
}