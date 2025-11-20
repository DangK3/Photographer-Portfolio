// src/app/admin/settings/page.tsx
'use client';

import React from 'react';
import { Save, Globe, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã lưu cài đặt (Mô phỏng)');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-[var(--admin-fg)]">Cài đặt Hệ thống</h1>
        <p className="text-[var(--admin-sub)] text-sm">Cấu hình chung cho Website và Studio.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1 */}
        <div className="p-4 md:p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--admin-border)] pb-4">
            <Globe className="text-[var(--admin-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--admin-fg)]">Thông tin Website</h2>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-fg)]">Tiêu đề Website</label>
              <input 
                type="text" 
                defaultValue="Oni Studio - Professional Photography"
                className="w-full p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] outline-none transition-all"
              />
            </div>
            
            {/* Chuyển thành 1 cột trên mobile, 2 cột trên tablet/desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--admin-fg)]">Hotline</label>
                <input 
                  type="text" 
                  defaultValue="0909 000 000"
                  className="w-full p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--admin-fg)]">Email Liên hệ</label>
                <input 
                  type="email" 
                  defaultValue="contact@onistudio.com"
                  className="w-full p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 - Responsive Switch */}
        <div className="p-4 md:p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--admin-border)] pb-4">
            <Shield className="text-purple-500" />
            <h2 className="text-lg font-semibold text-[var(--admin-fg)]">Cấu hình Hệ thống</h2>
          </div>

          {/* Flex wrap để xuống dòng nếu text quá dài trên màn hình bé */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--admin-bg)] rounded-lg border border-[var(--admin-border)]">
            <div className="max-w-[80%]">
              <h3 className="font-medium text-[var(--admin-fg)]">Chế độ Demo</h3>
              <p className="text-xs text-[var(--admin-sub)]">Hiển thị dữ liệu mẫu trên trang chủ thay vì dữ liệu thật.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--admin-primary)]"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-500/30 font-medium w-full sm:w-auto"
          >
            <Save size={20} />
            Lưu Thay Đổi
          </button>
        </div>

      </form>
    </div>
  );
}