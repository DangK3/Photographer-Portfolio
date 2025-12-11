'use client';

import { useEffect, useState } from 'react';
import { 
  getDashboardStats, 
  getTodaySchedule, 
  getGrowthChartData 
} from '@/lib/actions/stats';
import { 
  FolderOpen, 
  Image as ImageIcon, 
  Users, 
  CalendarCheck,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import Spinner from '@/components/Spinner';
import TodaySchedule from '@/components/admin/TodaySchedule';
import DashboardActions from '@/components/admin/DashboardActions';
import DashboardFilter from '@/components/admin/DashboardFilter';
import GrowthChart from '@/components/admin/GrowthChart';
import { useSearchParams } from 'next/navigation';

// --- 1. ĐỊNH NGHĨA TYPE CHUẨN ---

// Type cho biểu đồ (khớp với getGrowthChartData)
interface ChartItem {
  name: string;
  total: number;
}

// Type cho lịch trình (khớp với getTodaySchedule)
// Dựa trên query select trong stats.ts
export interface ScheduleItem {
  booking_item_id: number;
  start_dt: string;
  end_dt: string;
  rooms: { 
    name: string | null; 
    code: string | null; 
  } | null;
  bookings: {
    status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | null;
    customers: { 
      full_name: string | null; 
      phone: string | null; 
    } | null;
  } | null;
}

interface DashboardStats {
  totalProjects: number;
  newProjects: number;
  totalStaff: number;
  todayBookings: number;
}

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendLabel: string;
  icon: React.ReactNode;
  colorClass: string;
}

// --- 2. COMPONENT CHÍNH ---

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const currentRange = searchParams.get('range') || '30d';

  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    newProjects: 0,
    totalStaff: 0,
    todayBookings: 0
  });

  // --- ÁP DỤNG TYPE Ở ĐÂY ---
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]); 
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  // ---------------------------

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi song song để tối ưu tốc độ
        const [dashboardStats, schedule, chart] = await Promise.all([
          getDashboardStats(currentRange),
          getTodaySchedule(),
          getGrowthChartData(currentRange)
        ]);

        setStats(dashboardStats);
        
        // Ép kiểu an toàn (nếu DB trả về field null không mong muốn)
        setTodaySchedule(schedule as unknown as ScheduleItem[]);
        setChartData(chart);
        
      } catch (error) {
        console.error("Lỗi tải dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentRange]); // Re-fetch khi đổi filter

  // Helper hiển thị text
  const getTrendLabel = () => {
    if (currentRange === 'today') return 'hôm nay';
    if (currentRange === '7d') return 'trong tuần qua';
    if (currentRange === '30d') return 'trong tháng này';
    if (currentRange === '90d') return 'trong quý này';
    if (currentRange === '12m') return 'trong năm nay';
    return 'từ trước đến nay';
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--admin-fg)]">Dashboard</h1>
          <p className="text-[var(--admin-sub)]">Chào mừng trở lại, quản trị viên.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <DashboardFilter />
            <DashboardActions />
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Booking Hôm Nay"
          value={stats.todayBookings.toString()}
          trend="Today"
          trendLabel="ca chụp trong ngày"
          icon={<CalendarCheck size={24} className="text-orange-600 dark:text-orange-400" />}
          colorClass="bg-orange-50 dark:bg-orange-900/20"
        />
        <StatCard 
          title="Tổng Dự Án"
          value={stats.totalProjects.toString()}
          trend={`+${stats.newProjects}`}
          trendLabel={getTrendLabel()}
          icon={<FolderOpen size={24} className="text-blue-600 dark:text-blue-400" />}
          colorClass="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard 
          title="Dự Án Mới"
          value={stats.newProjects.toString()}
          trend="New"
          trendLabel={getTrendLabel()}
          icon={<ImageIcon size={24} className="text-green-600 dark:text-green-400" />}
          colorClass="bg-green-50 dark:bg-green-900/20"
        />
        <StatCard 
          title="Nhân Sự"
          value={stats.totalStaff.toString()}
          trend="Active"
          trendLabel="đang hoạt động"
          icon={<Users size={24} className="text-purple-600 dark:text-purple-400" />}
          colorClass="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI (2/3): Biểu đồ */}
        <div className="lg:col-span-2 bg-[var(--admin-card)] p-6 rounded-2xl border border-[var(--admin-border)] shadow-sm min-h-[400px]">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--admin-primary)]/10 rounded-lg text-[var(--admin-primary)]">
                  <TrendingUp size={20} />
              </div>
              <div>
                  <h3 className="text-lg font-bold text-[var(--admin-fg)]">Tăng trưởng Booking</h3>
                  <p className="text-xs text-[var(--admin-sub)]">Số liệu {getTrendLabel()}.</p>
              </div>
           </div>
           
           {chartData.length > 0 ? (
              <GrowthChart data={chartData} />
           ) : (
              <div className="h-[300px] flex items-center justify-center text-[var(--admin-sub)] italic">
                Chưa có dữ liệu trong khoảng thời gian này.
              </div>
           )}
        </div>

        {/* CỘT PHẢI (1/3): Lịch trình hôm nay */}
        <div className="bg-[var(--admin-card)] p-6 rounded-2xl border border-[var(--admin-border)] shadow-sm flex flex-col h-full max-h-[500px]">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[var(--admin-fg)] text-lg">Lịch trình hôm nay</h3>
              <span className="text-xs bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] px-2 py-1 rounded font-bold">
                {new Date().toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' })}
              </span>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-1 table-scrollbar">
              <TodaySchedule bookings={todaySchedule} />
           </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component StatCard (Giữ nguyên UI)
function StatCard({ title, value, trend, trendLabel, icon, colorClass }: StatCardProps) {
  return (
    <div className="bg-[var(--admin-card)] p-6 rounded-2xl border border-[var(--admin-border)] shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full border border-green-100 dark:border-green-900">
          <ArrowUpRight size={12} className="mr-1" />
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-medium text-[var(--admin-sub)]">{title}</h3>
        <div className="mt-1 text-3xl font-bold text-[var(--admin-fg)] tracking-tight">{value}</div>
        <p className="text-xs text-[var(--admin-sub)]/80 mt-2 capitalize">{trendLabel}</p>
      </div>
    </div>
  );
}