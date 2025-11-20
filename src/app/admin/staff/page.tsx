// src/app/admin/staff/page.tsx
'use client';

import React from 'react';
import { Plus, Search, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export default function StaffPage() {
  const dummyStaff = [
    { id: 1, name: 'Trần Hải Đăng', role: 'Admin', email: 'admin@onistudio.com', phone: '0909 123 456', status: 'active' },
    { id: 2, name: 'Nguyễn Văn A', role: 'Photographer', email: 'photo.a@onistudio.com', phone: '0912 345 678', status: 'active' },
    { id: 3, name: 'Lê Thị B', role: 'Makeup Artist', email: 'makeup.b@onistudio.com', phone: '0987 654 321', status: 'inactive' },
  ];

  return (
    <div className="space-y-6">
      {/* Header: Stack dọc trên mobile, ngang trên desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-fg)]">Nhân sự Studio</h1>
          <p className="text-[var(--admin-sub)] text-sm">Quản lý hồ sơ, vai trò và thông tin liên lạc.</p>
        </div>
        <button 
          onClick={() => toast.info('Tính năng đang phát triển')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-all shadow-md shadow-indigo-500/20 font-medium w-full sm:w-auto"
        >
          <Plus size={18} />
          Thêm Nhân viên
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-[var(--admin-card)] p-4 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-sub)]" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhân viên..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-fg)]"
          />
        </div>
      </div>

      {/* Table Container - RESPONSIVE FIX HERE */}
      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
        {/* Thêm overflow-x-auto để cuộn ngang trên mobile */}
        <div className="overflow-x-auto">
          {/* Thêm min-w để bảng không bị co rúm */}
          <table className="w-full text-sm text-left min-w-[800px]"> 
            <thead className="bg-[var(--admin-bg)] text-[var(--admin-sub)] uppercase text-xs font-semibold border-b border-[var(--admin-border)]">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Họ và Tên</th>
                <th className="px-6 py-4 whitespace-nowrap">Vai trò</th>
                <th className="px-6 py-4 whitespace-nowrap">Liên hệ</th>
                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {dummyStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-[var(--admin-hover)] transition-colors">
                  <td className="px-6 py-4 font-medium text-[var(--admin-fg)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--admin-bg)] flex items-center justify-center text-[var(--admin-sub)] font-bold shrink-0">
                        {staff.name.charAt(0)}
                      </div>
                      <span className="whitespace-nowrap">{staff.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-sub)] whitespace-nowrap">{staff.role}</td>
                  <td className="px-6 py-4 text-[var(--admin-sub)] space-y-1 whitespace-nowrap">
                    <div className="flex items-center gap-2"><Mail size={14}/> {staff.email}</div>
                    <div className="flex items-center gap-2"><Phone size={14}/> {staff.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      staff.status === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                        : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                    }`}>
                      {staff.status === 'active' ? 'Đang làm việc' : 'Nghỉ việc'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button className="p-2 text-[var(--admin-sub)] hover:bg-[var(--admin-bg)] rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}