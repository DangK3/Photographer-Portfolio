// src/components/admin/SettingsForm.tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Save, RotateCcw, Monitor, List, Database, Minus, Plus, Loader2 } from 'lucide-react';
import { SettingItem, updateSettings } from '@/lib/actions';
// 1. THAY ĐỔI IMPORT: Dùng thư viện hỗ trợ Cookie
import { createBrowserClient } from '@supabase/ssr';

interface SettingsFormProps {
  initialSettings: SettingItem[];
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  // 2. KHỞI TẠO CLIENT ĐÚNG CHUẨN (Đọc Token từ Cookie)
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  const [settings, setSettings] = useState<SettingItem[]>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const getValue = (key: string) => settings.find(s => s.key === key)?.value || '';

  const updateLocalSetting = (key: string, newValue: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value: newValue } : s));
  };

  const handleNumberChange = (key: string, type: 'increase' | 'decrease') => {
    const currentVal = parseInt(getValue(key) || '10');
    let newVal = currentVal;

    if (type === 'increase') {
      // Nếu đang < 5 (tức là 1), nhảy cóc lên 5
      if (currentVal < 5) {
        newVal = 5;
      } else {
        // Ngược lại cứ cộng 5
        newVal = currentVal + 5;
      }
    } else {
      // Nếu đang <= 5, nhảy cóc về 1
      if (currentVal <= 5) {
        newVal = 1;
      } else {
        // Ngược lại cứ trừ 5
        newVal = currentVal - 5;
      }
    }

    // Giới hạn Min 1, Max 100
    newVal = Math.max(1, Math.min(100, newVal));
    
    updateLocalSetting(key, newVal.toString());
  };

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Đang lưu cấu hình...');

    try {
      // 3. LẤY SESSION TỪ COOKIE (Bây giờ sẽ thành công)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Không tìm thấy phiên đăng nhập. Vui lòng F5.', { id: toastId });
        return;
      }

      const updates = settings.map(s => ({ key: s.key, value: s.value }));
      
      // Truyền token lấy được lên Server Action
      const res = await updateSettings(session.access_token, updates);

      if (res.success) {
        toast.success('Lưu thành công! Đã áp dụng cho toàn trang.', { id: toastId });
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
      
      {/* CARD 1: CẤU HÌNH HIỂN THỊ */}
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
                  className="p-3 hover:bg-[var(--admin-hover)] text-[var(--admin-sub)] hover:text-[var(--admin-fg)] border-r border-[var(--admin-border)]"
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
                  className="p-3 hover:bg-[var(--admin-hover)] text-[var(--admin-sub)] hover:text-[var(--admin-fg)] border-l border-[var(--admin-border)]"
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
      <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl p-6 shadow-sm opacity-90">
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
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[var(--admin-primary)]"></div>
          </label>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex justify-end gap-4 sticky bottom-4 pt-4">
        <button 
          onClick={() => setSettings(initialSettings)}
          className="px-4 py-2 rounded-lg bg-[var(--admin-card)] border border-[var(--admin-border)] text-[var(--admin-sub)] hover:bg-[var(--admin-hover)] flex items-center gap-2 shadow-sm"
        >
          <RotateCcw size={18} /> Khôi phục
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 rounded-lg bg-[var(--admin-primary)] text-white font-medium hover:opacity-90 flex items-center gap-2 shadow-lg shadow-indigo-500/30 disabled:opacity-70"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Lưu cấu hình
        </button>
      </div>
    </div>
  );
}