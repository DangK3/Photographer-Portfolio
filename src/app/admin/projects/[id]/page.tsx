// src/app/admin/projects/[id]/page.tsx
import { getProjectById } from '@/lib/actions';
import ProjectForm, { ProjectInitialData, BlockDB } from '@/components/admin/ProjectForm';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  
  // 1. Lấy dữ liệu từ DB
  const projectRaw = await getProjectById(parseInt(id));

  if (!projectRaw) {
    notFound(); // Trả về trang 404 nếu không tìm thấy
  }

  // 2. Chuyển đổi format DB -> Format Form
  // Cần ép kiểu cẩn thận vì Supabase trả về JSON object thô
  const formattedData: ProjectInitialData = {
    id: projectRaw.project_id,
    title: projectRaw.title,
    client_name: projectRaw.client_name || '',
    description: projectRaw.description || '',
    category_id: projectRaw.category_id?.toString() || '',
    is_featured: projectRaw.is_featured || false,
    thumbnail_url: projectRaw.thumbnail_url || '',
    credits: Array.isArray(projectRaw.credits) ? projectRaw.credits : [],
    content: Array.isArray(projectRaw.content) ? (projectRaw.content as BlockDB[]) : []
  };

  // 3. Render Form
  return <ProjectForm mode="edit" initialData={formattedData} />;
}