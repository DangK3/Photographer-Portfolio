// src/app/admin/settings/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Save, Globe, Loader2, Database } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../../lib/supabase';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State quản lý cấu hình
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // State cho các trường khác (Placeholder)
  const [siteInfo, setSiteInfo] = useState({
    title: 'Oni Studio - Professional Photography',
    hotline: '0909 000 000',
    email: 'contact@onistudio.com'
  });

  // 1. Lấy cấu hình từ Supabase khi vào trang
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'is_demo_mode')
          .single();

        if (error) {
          // Nếu chưa có key này trong DB (lỗi PGRST116), mặc định là false (Dùng Data Thật)
          if (error.code !== 'PGRST116') {
            console.error('Lỗi tải setting:', error);
            toast.error('Không thể tải cấu hình hệ thống');
          }
        } else if (data) {
          // Chuyển string 'true'/'false' thành boolean
          setIsDemoMode(data.value === 'true');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 2. Xử lý bật/tắt Demo Mode
  const handleToggleDemo = async (checked: boolean) => {
    // Optimistic Update: Cập nhật UI ngay lập tức
    const previousState = isDemoMode;
    setIsDemoMode(checked);

    const toastId = toast.loading('Đang cập nhật cấu hình...');

    try {
      // Lưu vào DB dưới dạng chuỗi 'true' hoặc 'false'
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          key: 'is_demo_mode', 
          value: String(checked),
          description: 'Bật tắt chế độ Demo (Dữ liệu mẫu)'
        });

      if (error) throw error;

      toast.success(
        checked 
          ? 'Đã BẬT chế độ Demo. Website đang dùng dữ liệu mẫu.' 
          : 'Đã TẮT chế độ Demo. Website đang dùng dữ liệu thật từ Database.', 
        { id: toastId }
      );

    } catch (error) {
      console.error(error);
      toast.error('Cập nhật thất bại', { id: toastId });
      setIsDemoMode(previousState); // Hoàn tác nếu lỗi
    }
  };

  const handleSaveGeneralInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.info('Lưu thông tin thành công (Mô phỏng)');
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[var(--admin-primary)]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-[var(--admin-fg)]">Cài đặt Hệ thống</h1>
        <p className="text-[var(--admin-sub)] text-sm">Cấu hình chung cho Website và Studio.</p>
      </div>

      {/* --- PHẦN QUAN TRỌNG: CHẾ ĐỘ DỮ LIỆU --- */}
      <div className="p-4 md:p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-[var(--admin-border)] pb-4">
          <Database className="text-purple-500" />
          <h2 className="text-lg font-semibold text-[var(--admin-fg)]">Nguồn Dữ liệu</h2>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--admin-bg)] rounded-lg border border-[var(--admin-border)]">
          <div className="max-w-[80%]">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-[var(--admin-fg)]">Chế độ Demo</h3>
              {isDemoMode ? (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded uppercase border border-amber-200">Đang bật</span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded uppercase border border-green-200">Live Data</span>
              )}
            </div>
            <p className="text-xs text-[var(--admin-sub)] leading-relaxed">
              <span className="font-semibold">BẬT:</span> Hiển thị dữ liệu mẫu (Project tĩnh trong code). <br/>
              <span className="font-semibold">TẮT:</span> Hiển thị dữ liệu thật từ Supabase (Dự án bạn thêm trong Admin).
            </p>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isDemoMode}
              onChange={(e) => handleToggleDemo(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--admin-primary)]"></div>
          </label>
        </div>
      </div>

      {/* --- PHẦN: THÔNG TIN WEBSITE --- */}
      <form onSubmit={handleSaveGeneralInfo}>
        <div className="p-4 md:p-6 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--admin-border)] pb-4">
            <Globe className="text-[var(--admin-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--admin-fg)]">Thông tin chung</h2>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--admin-fg)]">Tiêu đề Website</label>
              <input 
                type="text" 
                value={siteInfo.title}
                onChange={e => setSiteInfo({...siteInfo, title: e.target.value})}
                className="w-full p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] outline-none transition-all text-[var(--admin-fg)]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--admin-fg)]">Hotline</label>
                <input 
                  type="text" 
                  value={siteInfo.hotline}
                  onChange={e => setSiteInfo({...siteInfo, hotline: e.target.value})}
                  className="w-full p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] outline-none transition-all text-[var(--admin-fg)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--admin-fg)]">Email Liên hệ</label>
                <input 
                  type="email" 
                  value={siteInfo.email}
                  onChange={e => setSiteInfo({...siteInfo, email: e.target.value})}
                  className="w-full p-3 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] outline-none transition-all text-[var(--admin-fg)]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-500/30 font-medium w-full sm:w-auto disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={20} />
                Lưu Thay Đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}