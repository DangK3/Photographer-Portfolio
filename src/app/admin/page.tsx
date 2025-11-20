// src/app/admin/page.tsx
'use client';

import { toast } from 'sonner';
import { BarChart3, Users, Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
// 1. Định nghĩa kiểu dữ liệu chuẩn cho Props
interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendLabel: string;
  icon: React.ReactNode; // Đây là kiểu chuẩn cho mọi component/icon trong React
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[var(--admin-fg)]">Tổng quan</h2>
          <p className="text-[var(--admin-sub)] mt-1">Báo cáo hoạt động của Oni Studio hôm nay.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => toast.info('Tính năng đang phát triển')}
            className="px-4 py-2 bg-[var(--admin-card)] border border-[var(--admin-border)] text-[var(--admin-fg)] hover:bg-[var(--admin-hover)] text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Xuất báo cáo
          </button>
          <Link 
            href="/admin/projects/new"
            onClick={() => toast.success('Chuyển đến trang tạo dự án mới')}
            className="px-4 py-2 bg-[var(--admin-primary)] text-[var(--admin-primary-fg)] hover:opacity-90 text-sm font-medium rounded-lg transition-all shadow-md shadow-indigo-500/20"
          >
            + Dự án mới
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Tổng Dự án" 
          value="12" 
          trend="+2" 
          trendLabel="tháng này"
          icon={<ImageIcon size={24} className="text-blue-500" />}
        />
        <StatCard 
          title="Lượt xem Demo" 
          value="1,234" 
          trend="+15%" 
          trendLabel="so với tuần trước"
          icon={<Users size={24} className="text-purple-500" />}
        />
        <StatCard 
          title="Hiệu suất" 
          value="98%" 
          trend="+5%" 
          trendLabel="tăng trưởng"
          icon={<BarChart3 size={24} className="text-emerald-500" />}
        />
      </div>

      {/* Content Area */}
      <div className="min-h-[400px] rounded-2xl border border-dashed border-[var(--admin-border)] flex flex-col items-center justify-center bg-[var(--admin-card)]/50">
        <div className="w-16 h-16 rounded-full bg-[var(--admin-bg)] flex items-center justify-center mb-4">
          <BarChart3 className="text-[var(--admin-sub)] opacity-50" size={32} />
        </div>
        <p className="text-[var(--admin-sub)] font-medium">Biểu đồ thống kê sẽ hiển thị tại đây</p>
        <p className="text-sm text-[var(--admin-sub)]/70 mt-2">Vui lòng kết nối dữ liệu thực tế.</p>
      </div>
    </div>
  );
}

// Component Card đẹp hơn
function StatCard({ title, value, trend, trendLabel, icon }: StatCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-[var(--admin-card)] border border-[var(--admin-border)] shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-[var(--admin-bg)] group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
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