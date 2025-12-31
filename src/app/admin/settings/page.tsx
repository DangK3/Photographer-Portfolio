// src/app/admin/settings/page.tsx
import SettingsForm from '@/components/admin/SettingsForm';
import { Settings } from 'lucide-react';
import { createServerClient } from '@supabase/ssr'; 
import { cookies } from 'next/headers'; 
import { redirect } from 'next/navigation'; 
import { getSettings, getCleanupMinutes } from '@/lib/actions/settings';

export default async function AdminSettingsPage() {
  const cookieStore = await cookies(); 
  
  // 1. Fetch dữ liệu song song (Server Side)
  const [settings, cleanupMinutes] = await Promise.all([
    getSettings(),
    getCleanupMinutes()
  ]);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} 
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (profile?.role !== 'Admin') {
    redirect('/admin');
  }

  // --- XÓA DÒNG NÀY (Vì biến settings đã có ở trên dòng 14) ---
  // const settings = await getSettings(); 

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--admin-fg)] flex items-center gap-3">
          <Settings className="text-[var(--admin-primary)]" size={32} />
          Cài đặt chung
        </h1>
        <p className="text-[var(--admin-sub)] mt-2">
          Quản lý các thông số cấu hình toàn cục của hệ thống.
        </p>
      </div>

      <SettingsForm 
        initialSettings={settings} 
        initialCleanupMinutes={cleanupMinutes} // Giờ Props này sẽ hợp lệ sau khi sửa bước 2
      />
    </div>
  );
}