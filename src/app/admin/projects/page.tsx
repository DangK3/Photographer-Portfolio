// src/app/admin/projects/page.tsx
import Link from 'next/link';
import { getProjects, getCurrentUserProfile } from '@/lib/actions';
import { Plus } from 'lucide-react';
import ProjectTable from '@/components/admin/ProjectTable';
import { createClient } from '@supabase/supabase-js'; 


export default async function ProjectsListPage() {
  const [projects, userProfile] = await Promise.all([
    getProjects('all'),
    getCurrentUserProfile(), // 2. Lấy thông tin user
  ]);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: setting } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'items_per_page')
    .single();
  const itemsLimit = setting?.value ? parseInt(setting.value) : 10;
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--admin-fg)]">Quản lý Dự án</h1>
          <p className="text-[var(--admin-sub)] mt-1">
            Quản lý danh mục dự án và chi tiết nội dung.
          </p>
        </div>
        {userProfile?.role === 'Admin' && (
          <Link 
            href="/admin/projects/new" 
            className="flex items-center gap-2 px-5 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-all shadow-lg shadow-indigo-500/30"
          >
            <Plus size={20} /> Thêm dự án mới
          </Link>
        )}
      </div>

      {/* Client Table Component (Xử lý Search & Infinite Scroll) */}
      <ProjectTable initialProjects={projects} itemsPerPage={itemsLimit} userProfile={userProfile} />
      
    </div>
  );
}