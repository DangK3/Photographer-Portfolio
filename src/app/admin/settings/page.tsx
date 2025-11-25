// src/app/admin/settings/page.tsx
import { getSettings } from '@/lib/actions';
import SettingsForm from '@/components/admin/SettingsForm';
import { Settings } from 'lucide-react';


export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--admin-fg)] flex items-center gap-3">
          <Settings className="text-[var(--admin-primary)]" size={32} />
          Cài đặt chung
        </h1>
        <p className="text-[var(--admin-sub)] mt-2">
          Quản lý các thông số cấu hình toàn cục của hệ thống.
        </p>
      </div>

      {/* Form */}
      <SettingsForm initialSettings={settings} />
    </div>
  );
}