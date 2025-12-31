'use client'

import { ToolbarProps, View, Views } from 'react-big-calendar'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { CalendarEvent } from './BookingCalendar'
import { useState, useRef, useEffect } from 'react'
import moment from 'moment'

export default function CustomToolbar({ 
  label, 
  date,
  onNavigate, 
  onView, 
  view, 
}: ToolbarProps<CalendarEvent, object>) {

  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsViewMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    onNavigate(action)
  }

  const handleViewChange = (v: View) => {
    onView(v)
    setIsViewMenuOpen(false)
  }

  // Label Mapping
  const viewLabels: Record<string, string> = {
    month: 'Tháng',
    week: 'Tuần',
    day: 'Ngày',
    agenda: 'Lịch biểu'
  }

  const getCustomLabel = () => {
    switch (view) {
      case 'day':
        // Format: 04 Tháng 12 2025
        return moment(date).format('DD [Tháng] MM, YYYY'); 
      case 'month':
        // Format: Tháng 12 2025
        return moment(date).format('[Tháng] MM, YYYY');
      case 'week':
        // View tuần thì dùng label mặc định của thư viện (xử lý khoảng ngày 01-07) sẽ tốt hơn
        return label; 
      default:
        return label;
    }
  }
  return (
    <div className="flex items-center justify-between px-4 py-3 
    border-b border-[var(--admin-border)] bg-[var(--admin-card)]">
      
      {/* LEFT: Logo/Title & Navigation */}
      <div className="flex items-center gap-6">
        {/* Nút Hôm nay */}
        <button
          onClick={() => navigate('TODAY')}
          className="px-4 py-2 text-sm font-medium 
          border border-[var(--admin-border)] rounded hover:bg-[var(--admin-hover)] 
          transition-colors text-[var(--admin-fg)] cursor-pointer"
        >
          Hôm nay
        </button>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-1 text-[var(--admin-fg)]">
          <button 
            onClick={() => navigate('PREV')}
            className="p-2 rounded-full hover:bg-[var(--admin-hover)] transition-colors"
            title="Trước"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => navigate('NEXT')}
            className="p-2 rounded-full hover:bg-[var(--admin-hover)] transition-colors"
            title="Sau"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Label (Tháng 12, 2025) */}
        <h2 className="text-xl font-normal text-[var(--admin-fg)] min-w-[150px]">
          {getCustomLabel()}
        </h2>
      </div>

      {/* RIGHT: View Switcher & Settings */}
      <div className="flex items-center gap-3">
        {/* Search & Settings Icons (Mockup UI) */}
        {/* <div className="flex items-center gap-2 text-[var(--admin-sub)] mr-2">
            <button className="p-2 hover:bg-[var(--admin-hover)] rounded-full"><span className="sr-only">Search</span>🔍</button>
            <button className="p-2 hover:bg-[var(--admin-hover)] rounded-full"><span className="sr-only">Settings</span>⚙️</button>
        </div> */}

        {/* View Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-[var(--admin-border)] rounded hover:bg-[var(--admin-hover)] transition-colors text-[var(--admin-fg)] bg-[var(--admin-card)] min-w-[100px] justify-between"
          >
            <span>{viewLabels[view] || view}</span>
            <ChevronDown size={14} className="opacity-70" />
          </button>

          {isViewMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-[var(--admin-card)] border border-[var(--admin-border)] rounded shadow-lg z-50 py-1">
              {[Views.DAY, Views.WEEK, Views.MONTH, Views.AGENDA].map((v) => (
                <button
                  key={v}
                  onClick={() => handleViewChange(v)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--admin-hover)] flex items-center justify-between
                    ${view === v ? 'bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]' : 'text-[var(--admin-fg)]'}
                  `}
                >
                   {viewLabels[v]}
                   {view === v && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}