// src/components/admin/DashboardActions.tsx
'use client';

import { toast } from 'sonner';
import Link from 'next/link';
import { Printer, Plus } from 'lucide-react';

export default function DashboardActions() {
  return (
    <div className="flex gap-3">
      <button onClick={() => toast.info('Tính năng Xuất báo cáo đang phát triển')}
      className="
        flex-1 md:flex-none
        inline-flex items-center justify-center gap-2 
        bg-[var(--admin-card)] border border-[var(--admin-border)] 
        text-[var(--admin-fg)] hover:bg-[var(--admin-hover)] 
        px-4 py-2 rounded-md text-sm font-medium transition-colors
        whitespace-nowrap truncate
      ">
        <Printer size={16} />          {/* 2. Icon Máy in */}
        <span>Xuất báo cáo</span>
      </button>
      <Link 
        href="/admin/projects/new"
        className="flex-1 md:flex-none
        inline-flex items-center justify-center gap-2 
        bg-[var(--admin-primary)] text-[var(--admin-primary-fg)] 
        hover:opacity-90 px-4 py-2 rounded-md text-sm font-medium transition-colors 
        shadow-sm whitespace-nowrap truncate"
      >
        <Plus size={16} />
        <span>Tạo dự án mới</span>
      </Link>
    </div>
  );
}