// src/app/admin/page.tsx
import { BarChart3, Users, Image as ImageIcon, ArrowUpRight, TrendingUp } from 'lucide-react';
import { getDashboardStats, getGrowthChartData } from '@/lib/actions';
import DashboardActions from '@/components/admin/DashboardActions';
import GrowthChart from '@/components/admin/GrowthChart';
import DashboardFilter from '@/components/admin/DashboardFilter'; // Import bộ lọc

export const dynamic = 'force-dynamic';
interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendLabel: string;
  icon: React.ReactNode;
  colorClass: string; // Thêm class màu để tùy biến icon background
}
// Nhận searchParams từ URL
interface PageProps {
  searchParams: Promise<{ range?: string }>;
}

export default async function AdminDashboard({ searchParams }: PageProps) {
  // 1. Lấy range từ URL (mặc định 30d)
  const { range } = await searchParams;
  const currentRange = range || '30d';

  // 2. Gọi hàm lấy dữ liệu với range
  const [stats, chartData] = await Promise.all([
    getDashboardStats(currentRange),
    getGrowthChartData(currentRange)
  ]);

  // Helper để hiển thị text trend
  const getTrendLabel = () => {
    if (currentRange === '7d') return 'trong tuần qua';
    if (currentRange === '30d') return 'trong tháng này';
    if (currentRange === '90d') return 'trong quý này';
    if (currentRange === '12m') return 'trong năm nay';
    return 'từ trước đến nay';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--admin-fg)]">Tổng quan</h2>
          <p className="text-[var(--admin-sub)] mt-1">Báo cáo hoạt động của Oni Studio.</p>
        </div>
        
        <div className="flex gap-3">
          {/* --- BỘ LỌC THỜI GIAN --- */}
          <DashboardFilter />
          
          <DashboardActions />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Tổng Dự án" 
          value={stats.totalProjects.toString()} 
          // Trend bây giờ phản ánh số lượng tăng thêm trong khoảng thời gian đã chọn
          trend={`+${stats.newProjects}`} 
          trendLabel={getTrendLabel()}
          icon={<ImageIcon size={24} className="text-blue-600 dark:text-blue-400" />}
          colorClass="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard 
          title="Tổng Nhân sự" 
          value={stats.totalStaff.toString()} 
          trend="Active" 
          trendLabel="đang hoạt động"
          icon={<Users size={24} className="text-purple-600 dark:text-purple-400" />}
          colorClass="bg-purple-50 dark:bg-purple-900/20"
        />
        <StatCard 
          title="Hiệu suất Server" 
          value="Stable" 
          trend="Good" 
          trendLabel="trạng thái hệ thống"
          icon={<BarChart3 size={24} className="text-emerald-600 dark:text-emerald-400" />}
          colorClass="bg-emerald-50 dark:bg-emerald-900/20"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--admin-primary)]/10 rounded-lg text-[var(--admin-primary)]">
                    <TrendingUp size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[var(--admin-fg)]">Tăng trưởng Dự án</h3>
                    <p className="text-xs text-[var(--admin-sub)]">Số liệu {getTrendLabel()}.</p>
                </div>
            </div>
        </div>
        
        {/* Nếu không có dữ liệu thì hiện thông báo */}
        {chartData.length > 0 ? (
           <GrowthChart data={chartData} />
        ) : (
           <div className="h-[300px] flex items-center justify-center text-[var(--admin-sub)] italic">
             Chưa có dữ liệu tăng trưởng trong khoảng thời gian này.
           </div>
        )}
      </div>
    </div>
  );
}





// Component Card (Server Component OK)
function StatCard({ title, value, trend, trendLabel, icon, colorClass }: StatCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-[var(--admin-card)] border border-[var(--admin-border)] shadow-sm hover:shadow-md transition-all duration-300 group">
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
        <p className="text-xs text-[var(--admin-sub)]/80 mt-2">{trendLabel}</p>
      </div>
    </div>
  );
}