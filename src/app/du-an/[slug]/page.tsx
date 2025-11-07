// src/app/du-an/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allProjects as projects } from '../../../data/projects-master-data'; 
import ProjectClientPage from './ProjectClientPage';
import { cache } from 'react';

type Props = {
  params: Promise<{ slug: string }>;
};

// Hàm này BÂY GIỜ sẽ đọc từ file "master" (allProjects)
export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Hàm này BÂY GIỜ sẽ đọc từ file "master" (allProjects)
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

// Hàm này BÂY GIỜ sẽ đọc từ file "master"
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Bắt buộc phải 'await params' trước
  const { slug } = await params; 
  
  const data = await getProjectData(slug); 

  if (!data) {
    return { title: 'Project Not Found' };
  }

  const ogUrl = typeof data.project.src === 'string' 
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

// Component Trang (Đã sửa)
export default async function ProjectDetailPage({ params }: Props) {
  // Bắt buộc phải 'await params' trước
  const { slug } = await params;

  const data = await getProjectData(slug);

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