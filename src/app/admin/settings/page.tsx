// src/app/admin/settings/page.tsx
import { getSettings } from '@/lib/actions';
import SettingsForm from '@/components/admin/SettingsForm';
import { Settings } from 'lucide-react';
import { createServerClient } from '@supabase/ssr'; 
import { cookies } from 'next/headers'; 
import { redirect } from 'next/navigation'; 

export default async function AdminSettingsPage() {
  // 1. Check quyền ngay tại Server Page
  const cookieStore = await cookies(); // Await cookies() (Next.js 15)
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {} // Server Component không set cookie
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

  // Nếu không phải Admin -> Đá về trang chủ Admin
  if (profile?.role !== 'Admin') {
    redirect('/admin');
  }
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