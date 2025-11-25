// src/app/du-an/[slug]/page.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getProjects } from '@/lib/actions';
import { Metadata } from 'next';
import ProjectClientPage from './ProjectClientPage';

// 1. Định nghĩa Props
interface PageProps {
  params: Promise<{ slug: string }>;
}

// 2. Sinh đường dẫn tĩnh (Quan trọng để không bị 404 khi deploy)
export async function generateStaticParams() {
  const projects = await getProjects();
  
  if (!Array.isArray(projects) || projects.length === 0) return [];

  return projects.map((project) => ({
    slug: project.slug, // Chỉ cần slug là đủ
  }));
}

// 3. SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return { title: 'Dự án không tồn tại' };

  const ogImage = typeof project.image === 'string' ? project.image : (project.image.src || '');

  return {
    title: `${project.title} | Oni Studio`,
    description: project.description || `Chi tiết dự án ${project.title}`,
    openGraph: {
      images: [ogImage],
    },
  };
}
export const revalidate = 3600; // 1 hour
// 4. Component Chính (Server Component)
export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = await getProjects();
  
  // Tìm dự án hiện tại
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound(); // Chuyển hướng sang trang 404 chuẩn
  }

  // Logic tìm bài Liên quan (Cùng danh mục) để điều hướng Next/Prev
  // Lọc danh sách chỉ gồm các bài cùng category
  const sameCategoryProjects = projects.filter(p => p.category === project.category);
  // Tìm vị trí của bài hiện tại trong danh sách đó
  const currentIndex = sameCategoryProjects.findIndex(p => p.id === project.id);
  
  // Lấy bài trước và sau
  const nextProject = sameCategoryProjects[currentIndex + 1] || null;
  const prevProject = sameCategoryProjects[currentIndex - 1] || null;

  // Tạo Link điều hướng
  const nextLink = nextProject ? `/du-an/${nextProject.slug}` : null;
  const prevLink = prevProject ? `/du-an/${prevProject.slug}` : null;

  return (
    <ProjectClientPage 
      project={project}
      prevProjectLink={prevLink}
      nextProjectLink={nextLink}
    />
  );
}