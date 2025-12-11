// src/app/admin/calendar/page.tsx
import { getBookingsForCalendar } from '@/lib/actions/bookings'
import { getRooms, getServices } from '@/lib/actions/studio'
import DashboardCalendar from '@/components/admin/DashboardCalendar'; 
import { getCurrentUserProfile } from '../../../lib/actions/users';
import { getCustomers } from '@/lib/actions/customers';
import { getCleanupMinutes } from '@/lib/actions/settings';

export default async function CalendarPage() {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString()

  const bookings = await getBookingsForCalendar(startOfMonth, endOfMonth)
  const rooms = await getRooms()
  const services = await getServices()
  const customers = await getCustomers()
  const userProfile = await getCurrentUserProfile()
  const cleanupMinutes = await getCleanupMinutes();
  return (
    // h-full để tràn viền container cha
    <div className="h-full w-full bg-[var(--admin-card)] rounded-xl 
     shadow-sm overflow-hidden">
        {/* Truyền full data vào, không cần sidebar wrapper nữa */}
        <DashboardCalendar 
          rooms={rooms} 
          bookings={bookings} 
          services={services}
          customers={customers}
          currentUserId={Number(userProfile?.user_id || 0)} 
          cleanupMinutes={cleanupMinutes}
        />
    </div>
  )
}