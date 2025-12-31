'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation';
import { CalendarIcon, ChevronDown, Check, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from 'date-fns';
import { useCalendar } from '@/context/CalendarContext';
import { ROOM_COLORS } from '@/lib/constants'; //

interface Room {
  room_id: number;
  name: string | null;
  status?: 'available' | 'maintenance' | 'inactive';
  is_equipment_room?: boolean | null;
}

export default function NavCalendarWidget({ rooms }: { rooms: Room[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true); 
  
  const { 
    date, 
    setDate, 
    setCreateModalOpen, 
    visibleRoomIds, 
    toggleRoomVisibility,
    setVisibleRoomIds
  } = useCalendar();


  const availableRooms = useMemo(() => {
    return rooms.filter(r => 
        r.status === 'available' && 
        !(r.is_equipment_room === true)
    );
  }, [rooms]);

  // Khởi tạo: Mặc định chọn tất cả phòng khi mới load
  useEffect(() => {
    if (availableRooms.length > 0 && visibleRoomIds.length === 0) {
        const allIds = availableRooms.map(r => r.room_id);
        setVisibleRoomIds(allIds);
    }
  }, [availableRooms, visibleRoomIds.length, setVisibleRoomIds]);

  // Logic chuyển trang
  const navigateToCalendar = () => {
    if (pathname !== '/admin/calendar') {
        router.push('/admin/calendar');
    }
  };

  // Logic Mini Calendar
  const currentMonthStart = startOfMonth(date);
  const currentMonthEnd = endOfMonth(date);
  const daysInMonth = eachDayOfInterval({ start: currentMonthStart, end: currentMonthEnd });
  const startDayOfWeek = getDay(currentMonthStart); 
  const paddingCount = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const paddingDays = Array.from({ length: paddingCount });

  const handleDateClick = (d: Date) => {
    setDate(d);
    navigateToCalendar();
    if (!isExpanded) setIsExpanded(true);
  };

  const handleQuickCreate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCreateModalOpen(true);
    navigateToCalendar(); 
  };

  return (
    <div className="my-1">
      {/* Header Button */}
      <div className="flex items-stretch gap-[1px]"> 
        <button 
          onClick={() => { navigateToCalendar() }}
          className={`flex-1 flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-l-lg cursor-pointer transition-all duration-200 
            ${pathname === '/admin/calendar' 
              ? 'bg-[var(--admin-bg)] text-[var(--admin-primary)] shadow-md shadow-gray-500/20' 
              : 'text-[var(--admin-sub)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-fg)]'
            }`}
        >
            <CalendarIcon size={20} />
            <span className="truncate ">Lịch Studio</span>
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className="w-8 flex items-center justify-center cursor-pointer rounded-r-lg transition-all duration-200 text-[var(--admin-sub)] hover:bg-[var(--admin-hover)]"
        >
           <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expandable Content */}
      <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="min-h-0 space-y-4">
            
            {/* Nút Tạo Nhanh */}
            <button 
                onClick={handleQuickCreate}
                className="w-full flex items-center justify-center gap-2 bg-[var(--admin-card)] 
                border border-[var(--admin-primary)] text-[var(--admin-fg)] text-xs font-bold py-2 
                rounded-lg hover:bg-[var(--admin-primary)] hover:text-[var(--admin-bg)] transition-all cursor-pointer shadow-sm"
            >
                <Plus size={14} /> TẠO BOOKING
            </button>

            {/* Mini Calendar */}
            <div className="bg-[var(--admin-card)] p-3 rounded-lg border border-[var(--admin-border)] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setDate(subMonths(date, 1))} className="hover:bg-[var(--admin-hover)] p-1 rounded text-[var(--admin-sub)] text-xs">‹</button>
                    <div className="text-[11px] font-bold text-[var(--admin-fg)] uppercase tracking-wider">
                        Tháng {format(date, 'MM/yyyy')}
                    </div>
                    <button onClick={() => setDate(addMonths(date, 1))} className="hover:bg-[var(--admin-hover)] p-1 rounded text-[var(--admin-sub)] text-xs">›</button>
                </div>
                
                <div className="grid grid-cols-7 text-center text-[9px] gap-y-2 text-[var(--admin-sub)] font-medium mb-1">
                    <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span className="text-red-400">CN</span>
                </div>
                
                <div className="grid grid-cols-7 text-center text-[10px] gap-1">
                    {paddingDays.map((_, i) => <span key={`pad-${i}`} />)}
                    {daysInMonth.map(d => {
                        const isSelected = isSameDay(d, date);
                        return (
                            <span 
                                key={d.toString()} 
                                onClick={(e) => { e.stopPropagation(); handleDateClick(d); }}
                                className={`
                                    cursor-pointer h-6 w-6 flex items-center justify-center rounded-full transition-all
                                    ${isSelected 
                                        ? 'bg-[var(--admin-primary)] text-[var(--admin-primary-fg)] font-bold shadow-md' 
                                        : 'text-[var(--admin-fg)] hover:bg-[var(--admin-hover)]'
                                    }
                                `}
                            >
                                {format(d, 'd')}
                            </span>
                        )
                    })}
                </div>
            </div>

            {/* Bộ lọc phòng */}
            <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                     <p className="text-[10px] font-bold text-[var(--admin-sub)] uppercase">Hiển thị phòng:</p>
                     <button 
                        onClick={() => setVisibleRoomIds(availableRooms.map(r => r.room_id))}
                        className="text-[9px] text-[var(--admin-primary)] hover:underline cursor-pointer hover:text-[var(--admin-fg)]"
                     >
                        Tất cả
                     </button>
                </div>
                
                <div className="max-h-[200px] overflow-y-auto no-scrollbar space-y-1">
                    {availableRooms.length > 0 ? (
                        availableRooms.map((room, index) => {
                            const isChecked = visibleRoomIds.includes(room.room_id);
                            // Lấy màu dựa trên index của mảng đã lọc
                            const color = ROOM_COLORS[index % ROOM_COLORS.length]; 

                            return (
                                <div 
                                    key={room.room_id} 
                                    onClick={() => toggleRoomVisibility(room.room_id)}
                                    className="flex items-center gap-3 cursor-pointer group py-1.5 px-2 hover:bg-[var(--admin-hover)] rounded-md transition-colors"
                                >
                                    <div 
                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'border-transparent' : 'border-[var(--admin-sub)] bg-transparent'}`}
                                        style={{ backgroundColor: isChecked ? color : undefined }}
                                    >
                                        {isChecked && <Check size={10} className="text-white" />}
                                    </div>

                                    <span className={`text-xs truncate transition-opacity ${isChecked ? 'text-[var(--admin-fg)] font-medium' : 'text-[var(--admin-sub)] opacity-70'}`}>
                                        {room.name || `Phòng ${room.room_id}`}
                                    </span>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-xs text-[var(--admin-sub)] text-center py-2 italic">
                            Không có phòng trống
                        </p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}