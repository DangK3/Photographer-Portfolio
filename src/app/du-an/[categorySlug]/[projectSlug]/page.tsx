// src/app/du-an/[categorySlug]/[projectSlug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
// Đảm bảo đường dẫn này trỏ đúng đến file data của bạn
import { allProjects as projects } from '../../../../data/projects-master-data';
// Đường dẫn này trỏ ra ngoài 1 cấp để lấy ProjectClientPage
import ProjectClientPage from '@/app/du-an/[categorySlug]/[projectSlug]/ProjectClientPage';
import { cache } from 'react';

// 1. Cập nhật kiểu (type) cho params
type Props = {
  params: {
    categorySlug: string;
    projectSlug: string;
  };
};

// 2. generateStaticParams (Giữ nguyên)
export async function generateStaticParams() {
  return projects.map((project) => ({
    categorySlug: project.cateSlug,
    projectSlug: project.slug,
  }));
}

// 3. (CẬP NHẬT) hàm getProjectData với logic lọc category
const getProjectData = cache(
  async (categorySlug: string, projectSlug: string) => {
    
    // ----- BẮT ĐẦU LOGIC MỚI -----

    // 1. LỌC: Lấy *chỉ* các dự án trong category này
    const categoryProjects = projects.filter(
      (p) => p.cateSlug === categorySlug
    );

    // 2. TÌM INDEX: Tìm index của dự án hiện tại TRONG danh sách đã lọc
    const projectIndexInCategory = categoryProjects.findIndex(
      (p) => p.slug === projectSlug
    );

    // 3. KIỂM TRA: Nếu không tìm thấy, trả về null
    if (projectIndexInCategory === -1) {
      return null;
    }

    // 4. LẤY DỮ LIỆU: Lấy dự án, dự án trước, dự án sau TỪ danh sách đã lọc
    const project = categoryProjects[projectIndexInCategory];

    const prevProject =
      projectIndexInCategory > 0
        ? categoryProjects[projectIndexInCategory - 1]
        : null;

    const nextProject =
      projectIndexInCategory < categoryProjects.length - 1
        ? categoryProjects[projectIndexInCategory + 1]
        : null;
    
    // ----- KẾT THÚC LOGIC MỚI -----


    // 5. BUILD LINK: (Logic này giữ nguyên từ trước)
    // Nó tự động đúng vì `prevProject` và `nextProject` giờ đã cùng category
    const prevProjectLink = prevProject
      ? `/du-an/${prevProject.cateSlug}/${prevProject.slug}`
      : null;
    const nextProjectLink = nextProject
      ? `/du-an/${nextProject.cateSlug}/${nextProject.slug}`
      : null;

    return {
      project,
      prevProjectLink,
      nextProjectLink,
    };
  }
);

// 4. generateMetadata (Giữ nguyên)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Dùng cả 2 params để lấy data
  const data = await getProjectData(params.categorySlug, params.projectSlug);
  if (!data) {
    return { title: 'Project Not Found' };
  }

  const ogUrl =
    typeof data.project.src === 'string'
      ? data.project.src
      : data.project.src.src;

  return {
    title: `${data.project.title} - Oni Studio`,
    description: data.project.description?.substring(0, 150),
    openGraph: {
      title: `${data.project.title} - Oni Studio`,
      description: data.project.description?.substring(0, 150),
      images: [
        {
          url: ogUrl,
          width: data.project.src.width,
          height: data.project.src.height,
          alt: data.project.title,
        },
      ],
    },
  };
}

// 5. Component Trang chính (Giữ nguyên)
export default async function ProjectDetailPage({ params }: Props) {
  // Dùng cả 2 params
  const data = await getProjectData(params.categorySlug, params.projectSlug);

  if (!data) {
    notFound();
  }

  return (
    <ProjectClientPage
      project={data.project}
      prevProjectLink={data.prevProjectLink}
      nextProjectLink={data.nextProjectLink}
    />
  );
}