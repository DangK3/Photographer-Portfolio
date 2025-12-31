'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import CreateStaffModal from './CreateStaffModal';

export default function StaffPageHeader({ total }: { total: number }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--admin-fg)]">Nhân sự Studio</h1>
          <p className="text-[var(--admin-sub)] mt-1">Tổng số: {total} thành viên</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--admin-primary)] text-[var(--admin-bg)] 
          rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-500/30 font-medium cursor-pointer"
        >
          <Plus size={20} /> Thêm Nhân viên
        </button>
      </div>

      <CreateStaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}