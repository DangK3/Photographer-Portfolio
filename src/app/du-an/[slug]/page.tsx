// src/app/projects/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import projects from '../../../data/project';
import ProjectClientPage from './ProjectClientPage';
import { cache } from 'react';

// 1. DÙNG TYPE 'Props' CHUẨN
type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

const getProjectData = cache(async (slug: string) => {
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  
  if (projectIndex === -1) {
    return null;
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

// 2. SỬA HÀM METADATA
export async function generateMetadata(
  { params }: Props): Promise<Metadata> {
  
  // ⛔ BẠN PHẢI XÓA DÒNG "await params" Ở ĐÂY ⛔
  // const awaitedParams = await params; // <--- XÓA DÒNG NÀY
  const data = await getProjectData(params.slug); // Dùng trực tiếp params.slug

  if (!data) {
    return { title: 'Project Not Found' };
  }

  // Sửa lỗi StaticImageData
  let ogUrl: string;
  let ogWidth: number = 1200;
  let ogHeight: number = 630;

  if (typeof data.project.imageUrl === 'string') {
    ogUrl = data.project.imageUrl;
  } else {
    ogUrl = data.project.imageUrl.src;
    ogWidth = data.project.imageUrl.width;
    ogHeight = data.project.imageUrl.height;
  }
  
  return {
    title: `${data.project.title} - Oni Studio`,
    description: data.project.description.substring(0, 150),
    openGraph: {
      title: `${data.project.title} - Oni Studio`,
      description: data.project.description.substring(0, 150),
      images: [
        {
          url: ogUrl,
          width: ogWidth,
          height: ogHeight,
          alt: data.project.title,
        },
      ],
    },
  };
}

// 4. SỬA COMPONENT TRANG
export default async function ProjectDetailPage({ params }: Props) { // Dùng Props
  
  // ⛔ BẠN PHẢI XÓA DÒNG "await params" Ở ĐÂY ⛔
  // const awaitedParams = await params; // <--- XÓA DÒNG NÀY
  const data = await getProjectData(params.slug); // Dùng trực tiếp params.slug

  if (!data) {
    notFound();
  }

  return (
    <ProjectClientPage
      project={data.project}
      prevProjectSlug={data.prevProjectSlug}
      nextProjectSlug={data.nextProjectSlug}
    />
  );
}