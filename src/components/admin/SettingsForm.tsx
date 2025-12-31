// src/components/admin/SettingsForm.tsx
'use client';

import { useState } from 'react'; // Bỏ useTransition vì không dùng nút riêng nữa
import { toast } from 'sonner';
import { Save, RotateCcw, Monitor, List, Database, Minus, Plus, Loader2, Clock } from 'lucide-react';
import { SettingItem, updateSettings } from '@/lib/actions/settings';

interface SettingsFormProps {
  initialSettings: SettingItem[];
  initialCleanupMinutes: number;
}

export default function SettingsForm({ initialSettings, initialCleanupMinutes }: SettingsFormProps) {
  // State chung
  const [settings, setSettings] = useState<SettingItem[]>(initialSettings);
  // State riêng cho cleanup (để bind vào input number)
  const [cleanupTime, setCleanupTime] = useState(initialCleanupMinutes);
  
  const [isSaving, setIsSaving] = useState(false);

  // Helper lấy value từ state chung
  const getValue = (key: string) => settings.find(s => s.key === key)?.value || '';

  // Helper update state chung
  const updateLocalSetting = (key: string, newValue: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newValue } : s));
  };

  // Logic tăng giảm số lượng (giữ nguyên)
  const handleNumberChange = (key: string, type: 'increase' | 'decrease') => {
    const currentVal = parseInt(getValue(key) || '10');
    let newVal = currentVal;
    if (type === 'increase') {
        newVal = currentVal < 5 ? 5 : currentVal + 5;
    } else {
        newVal = currentVal <= 5 ? 1 : currentVal - 5;
    }
    newVal = Math.max(1, Math.min(100, newVal));
    updateLocalSetting(key, newVal.toString());
  };

  // --- HÀM LƯU TỔNG HỢP (QUAN TRỌNG NHẤT) ---
  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Đang lưu cấu hình...');

    try {
      // 1. Tạo payload từ danh sách settings hiện tại
      // Lọc bỏ key 'CLEANUP_GAP_MINUTES' cũ nếu lỡ nó có nằm trong mảng settings (để tránh trùng lặp)
      const baseUpdates = settings
        .filter(s => s.key !== 'CLEANUP_GAP_MINUTES')
        .map(s => ({ key: s.key, value: s.value }));

      // 2. Gộp giá trị Cleanup Time hiện tại vào payload
      const finalUpdates = [
        ...baseUpdates,
        { key: 'CLEANUP_GAP_MINUTES', value: cleanupTime.toString() }
      ];

      // 3. Gửi 1 request duy nhất update tất cả
      const res = await updateSettings(finalUpdates);

      if (res.success) {
        toast.success('Đã lưu tất cả cấu hình!', { id: toastId });
        // Dispatch event nếu cần
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('settings:updated'));
        }
      } else {
        toast.error(`Lỗi: ${res.error}`, { id: toastId });
      }
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Có lỗi xảy ra';
        toast.error(msg, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* CARD 0: VẬN HÀNH STUDIO */}
      <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--admin-border)] pb-4">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--admin-fg)]">Vận hành Studio</h3>
            <p className="text-xs text-[var(--admin-sub)]">Quản lý thời gian và quy trình.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
                <label className="block text-sm font-medium text-[var(--admin-sub)] mb-2">
                    Thời gian dọn dẹp (Phút)
                </label>
                <input
                    type="number" step="15" min="0"
                    value={cleanupTime}
                    onChange={(e) => setCleanupTime(Number(e.target.value))}
                    disabled
                    className="w-full max-w-[200px] p-2 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-fg)] focus:ring-2 focus:ring-[var(--admin-primary)] outline-none"
                />
                <p className="text-[10px] text-[var(--admin-sub)] mt-2">
                    * Giá trị này sẽ được lưu cùng nút Lưu cấu hình bên dưới.
                </p>
            </div>
        </div>
      </div>

      {/* CARD 1: HIỂN THỊ */}
      <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--admin-border)] pb-4">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <List size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--admin-fg)]">Hiển thị & Danh sách</h3>
            <p className="text-xs text-[var(--admin-sub)]">Điều chỉnh số lượng dữ liệu trên bảng và trang chủ.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* ITEMS PER PAGE CONTROL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--admin-fg)]">Số dự án mỗi lần tải (Admin Table)</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[var(--admin-border)] rounded-lg bg-[var(--admin-bg)]">
                <button 
                  onClick={() => handleNumberChange('items_per_page', 'decrease')}
                  className="p-3 hover:bg-[var(--admin-hover)] text-[var(--admin-sub)]
                   hover:text-[var(--admin-fg)] border-r border-[var(--admin-border)] cursor-pointer"
                >
                  <Minus size={16} />
                </button>
                <input 
                  type="number" 
                  className="w-16 text-center bg-transparent outline-none font-bold text-[var(--admin-fg)]"
                  value={getValue('items_per_page')}
                  readOnly 
                />
                <button 
                  onClick={() => handleNumberChange('items_per_page', 'increase')}
                  className="p-3 hover:bg-[var(--admin-hover)] text-[var(--admin-sub)] 
                  hover:text-[var(--admin-fg)] border-l border-[var(--admin-border)] cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-xs text-[var(--admin-sub)]">dự án / trang</span>
            </div>
            <p className="text-[10px] text-[var(--admin-sub)] mt-1">
                * Mặc định là 10.
            </p>
          </div>
        </div>
      </div>

      {/* CARD 2: THÔNG TIN WEBSITE */}
      <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--admin-border)] pb-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Monitor size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--admin-fg)]">Thông tin Website</h3>
            <p className="text-xs text-[var(--admin-sub)]">Các thông tin hiển thị trên thanh tiêu đề trình duyệt.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--admin-fg)]">Tiêu đề trang (Site Title)</label>
            <input 
              type="text" 
              className="w-full p-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg outline-none focus:border-[var(--admin-primary)] text-[var(--admin-fg)] transition-all"
              value={getValue('site_title')}
              onChange={(e) => updateLocalSetting('site_title', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* CARD 3: HỆ THỐNG */}
      <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl p-6 shadow-sm opacity-90 space-y-4">
        <div className="flex items-center gap-3 mb-6 border-b border-[var(--admin-border)] pb-4">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
            <Database size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[var(--admin-fg)]">Cấu hình Hệ thống</h3>
            <p className="text-xs text-[var(--admin-sub)]">Các thiết lập nâng cao.</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-[var(--admin-bg)] rounded-lg border border-[var(--admin-border)]">
          <div>
            <span className="font-medium text-[var(--admin-fg)] block">Chế độ Demo</span>
            <span className="text-xs text-[var(--admin-sub)]">Nếu bật, website sẽ hiển thị dữ liệu giả thay vì từ Database.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={getValue('is_demo_mode') === 'true'}
              onChange={(e) => updateLocalSetting('is_demo_mode', e.target.checked ? 'true' : 'false')}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-[var(--admin-primary)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
          </label>
        </div>
        <div className="flex items-center justify-between p-4 bg-[var(--admin-bg)] rounded-lg border border-[var(--admin-border)]">
            <div>
              <span className="font-medium text-[var(--admin-fg)] block">Tự động Đăng xuất</span>
              <span className="text-xs text-[var(--admin-sub)]">Hệ thống sẽ khóa phiên làm việc nếu không có hoạt động chuột/phím.</span>
            </div>
            
            <div className="flex items-center border border-[var(--admin-border)] rounded-lg bg-[var(--admin-card)]">
              <button 
                onClick={() => handleNumberChange('idle_timeout_minutes', 'decrease')}
                className="p-2 hover:bg-[var(--admin-hover)] text-[var(--admin-sub)] 
                border-r border-[var(--admin-border)] disabled:opacity-50 cursor-pointer"
                disabled={parseInt(getValue('idle_timeout_minutes')) <= 5}
              >
                <Minus size={16} />
              </button>
              
              <div className="w-20 text-center font-mono font-bold text-[var(--admin-fg)] flex items-center justify-center gap-1">
                 {getValue('idle_timeout_minutes') || '60'} <span className="text-[10px] font-normal text-[var(--admin-sub)]">phút</span>
              </div>
              
              <button 
                onClick={() => handleNumberChange('idle_timeout_minutes', 'increase')}
                className="p-2 hover:bg-[var(--admin-hover)] text-[var(--admin-sub)] 
                border-l border-[var(--admin-border)] cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
      </div>

      {/* ACTION BAR - NÚT LƯU DUY NHẤT */}
      <div className="flex justify-end gap-4 sticky bottom-4 pt-4 bg-gradient-to-t from-[var(--admin-bg)] to-transparent pb-4 z-10">
        <button 
          onClick={() => {
              setSettings(initialSettings);
              setCleanupTime(initialCleanupMinutes);
          }}
          className="px-4 py-2 rounded-lg bg-[var(--admin-card)] border border-[var(--admin-border)] 
          text-[var(--admin-sub)] hover:bg-[var(--admin-hover)] flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <RotateCcw size={18} /> Khôi phục
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 rounded-lg bg-[var(--admin-primary)] text-[var(--admin-bg)] font-medium 
          hover:opacity-90 flex items-center gap-2 shadow-lg shadow-indigo-500/30 disabled:opacity-70 cursor-pointer"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Lưu tất cả cấu hình
        </button>
      </div>
    </div>
  );
}