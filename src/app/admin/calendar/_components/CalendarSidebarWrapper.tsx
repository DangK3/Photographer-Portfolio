'use client'
import CalendarSidebar from '@/components/admin/calendar/CalendarSidebar'

// Định nghĩa Type tối thiểu mà Sidebar cần
interface RoomBasic {
  room_id: number;
  name: string | null;
  code: string | null;
  // Cho phép nhận thêm các trường thừa khác (như branch_id...) mà không báo lỗi
  [key: string]: unknown; 
}

// Thay any[] bằng RoomBasic[]
export default function CalendarSidebarWrapper({ rooms }: { rooms: RoomBasic[] }) {
  return (
    <CalendarSidebar 
      // Ép kiểu rooms về dạng Sidebar cần (nếu CalendarSidebarProps bên trong chặt chẽ hơn)
      // Nhưng thường thì RoomBasic[] là đủ an toàn rồi.
      rooms={rooms.map(r => ({
          room_id: r.room_id,
          name: r.name || 'Không tên', // Xử lý null tại đây
          code: r.code || 'NO-CODE'
      }))} 
      onCreateClick={() => {
        const title = prompt("Tạo booking nhanh:");
        if(title) alert("Đã tạo: " + title);
      }} 
    />
  )
}