'use client'


interface Room {
  room_id: number;
  name: string;
  code: string;
}

interface CalendarSidebarProps {
  rooms: Room[];
  onCreateClick: () => void;
}

export default function CalendarSidebar({ rooms, onCreateClick }: CalendarSidebarProps) {
  // Mockup Mini Calendar (Chỉ giao diện)
  const days = Array.from({ length: 35 }, (_, i) => i + 1)

  return (
    <aside className="w-[256px] flex-shrink-0 flex flex-col gap-6 pr-4 border-r border-[var(--admin-border)] bg-[var(--admin-bg)] h-full overflow-y-auto pt-4 pl-2">
      
      {/* 1. Nút TẠO (FAB Style) */}
      <div>
        <button 
          onClick={onCreateClick}
          className="flex items-center gap-3 bg-[var(--admin-card)] text-[var(--admin-fg)] px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all border border-[var(--admin-border)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="fill-current text-[var(--admin-primary)]">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          <span className="font-medium">Tạo lịch hẹn</span>
        </button>
      </div>

      {/* 2. Mini Calendar (Mockup) */}
      <div className="px-2">
        <div className="flex justify-between mb-4 text-sm font-semibold text-[var(--admin-fg)]">
          <span>Tháng 12 2025</span>
          <div className="flex gap-2">
            <button className="hover:bg-[var(--admin-hover)] rounded-full p-1">‹</button>
            <button className="hover:bg-[var(--admin-hover)] rounded-full p-1">›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center text-xs gap-y-3 text-[var(--admin-sub)]">
          <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
          {days.map(d => (
            <span key={d} className={`
              cursor-pointer h-7 w-7 flex items-center justify-center rounded-full hover:bg-[var(--admin-hover)]
              ${d === 1 ? 'bg-[var(--admin-primary)] text-white' : ''}
            `}>
              {d > 31 ? d - 31 : d}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Lịch của tôi (Filters) */}
      <div className="px-2">
        <h3 className="text-xs font-medium text-[var(--admin-sub)] uppercase mb-3 flex justify-between">
          Phòng Studio
          <button className="hover:bg-[var(--admin-hover)] p-1 rounded">
             ^
          </button>
        </h3>
        <ul className="space-y-2">
          {rooms.map(room => (
            <li key={room.room_id} className="flex items-center gap-2">
              <input 
                type="checkbox" 
                defaultChecked 
                className="w-4 h-4 rounded text-[var(--admin-primary)] focus:ring-0 cursor-pointer"
                style={{ accentColor: 'var(--admin-primary)' }}
              />
              <span className="text-sm text-[var(--admin-fg)] truncate">{room.name}</span>
            </li>
          ))}
          {/* Hardcode thêm mục Dọn dẹp */}
          <li className="flex items-center gap-2">
              <input 
                type="checkbox" 
                defaultChecked 
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: '#7f8c8d' }}
              />
              <span className="text-sm text-[var(--admin-fg)]">🧹 Lịch Dọn dẹp</span>
            </li>
        </ul>
      </div>
    </aside>
  )
}