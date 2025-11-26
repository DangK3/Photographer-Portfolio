import { getStaffList } from '@/lib/actions';
import StaffTable from '@/components/admin/StaffTable';
import StaffPageHeader from '@/components/admin/StaffPageHeader';
import { createServerClient } from '@supabase/ssr'; // Dùng cái này cho Server Component
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function StaffPage() {
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

  // Lấy Role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  const currentRole = profile?.role || 'Staff';

  // Nếu là Staff -> Đá về Dashboard (Chặn truy cập trang này luôn)
  if (currentRole !== 'Admin') {
    redirect('/admin');
  }

  // 2. Lấy danh sách (Chỉ chạy nếu là Admin)
  const staffList = await getStaffList();

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-6">
      {/* Truyền role xuống nếu muốn ẩn hiện nút (tuy nhiên ta đã chặn cả trang rồi) */}
      <StaffPageHeader total={staffList.length} />
      <StaffTable initialStaff={staffList} currentUserRole={currentRole}/>
    </div>
  );
}