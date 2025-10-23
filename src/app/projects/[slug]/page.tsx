// src/app/projects/[slug]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import projects from '../../../data/project'; // Import data
import ProjectClientPage from './ProjectClientPage'; // Import Client Component
import { cache } from 'react'; // Dùng cache để tối ưu

// Interface cho props (params từ URL)
interface ProjectPageParams {
  params: { slug: string };
}

// Hàm này thay thế getStaticPaths: Báo cho Next.js biết cần build tĩnh những slug nào
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Hàm lấy dữ liệu dự án (được cache lại)
const getProjectData = cache(async (slug: string) => {
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  
  if (projectIndex === -1) {
    return null; // Không tìm thấy
  }

  const project = projects[projectIndex];
  const prevProjectSlug = projectIndex > 0 ? projects[projectIndex - 1].slug : null;
  const nextProjectSlug = projectIndex < projects.length - 1 ? projects[projectIndex + 1].slug : null;

  return {
    project,
    prevProjectSlug,
    nextProjectSlug,
  };
});

// Hàm tạo Metadata (thay thế <Head>)
export async function generateMetadata({ params }: ProjectPageParams): Promise<Metadata> {
  const awaitedParams = await params; // await params ở đây
  const data = await getProjectData(awaitedParams.slug); // Sử dụng awaitedParams.slug

  if (!data) {
    return { title: 'Project Not Found' };
  }
  
  return {
    title: `${data.project.title} - Oni Studio`, // Tên studio của bạn
    description: data.project.description.substring(0, 150),
  };
}

// Component Trang (Server Component)
export default async function ProjectDetailPage({ params }: ProjectPageParams) {
  const awaitedParams = await params; // await params ở đây
  const data = await getProjectData(awaitedParams.slug); // Sử dụng awaitedParams.slug

  // Xử lý nếu không tìm thấy dự án
  if (!data) {
    notFound(); // Trả về trang 404
  }

  // Truyền dữ liệu xuống Client Component để render UI
  return (
    <ProjectClientPage
      project={data.project}
      prevProjectSlug={data.prevProjectSlug}
      nextProjectSlug={data.nextProjectSlug}
    />
  );
}