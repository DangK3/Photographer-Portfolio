// src/components/admin/DashboardActions.tsx
'use client';

import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardActions() {
  return (
    <div className="flex gap-3">
      <button 
        onClick={() => toast.info('Tính năng Xuất báo cáo đang phát triển')}
        className="px-4 py-2 bg-[var(--admin-card)] border border-[var(--admin-border)] text-[var(--admin-fg)] hover:bg-[var(--admin-hover)] text-sm font-medium rounded-lg transition-colors shadow-sm"
      >
        Xuất báo cáo
      </button>
      <Link 
        href="/admin/projects/new"
        className="px-4 py-2 bg-[var(--admin-primary)] text-white hover:opacity-90 text-sm font-medium rounded-lg transition-all shadow-md shadow-indigo-500/20 flex items-center"
      >
        + Dự án mới
      </Link>
    </div>
  );
}