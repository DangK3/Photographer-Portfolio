import React from 'react';
import { getProjects } from '@/lib/actions';
import { Metadata } from 'next';
import Container from '@/components/Container';
import ProjectMasonryGrid from '@/components/ProjectMasonryGrid';

export const metadata: Metadata = {
  title: 'Dự án Thời Trang | Oni Studio',
  description: 'Các dự án editorial, lookbook và nhiếp ảnh thời trang.',
};

export const revalidate = 3600; // 1 hour
export default async function FashionPage() {
  const projects = await getProjects('thoi-trang'); // <-- Slug của danh mục

  return (
    <Container className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-8xl mx-auto">
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] tracking-tighter mb-4">
            Thời Trang
          </h1>
          <p className="text-[var(--sub-text)] text-lg max-w-xl">
            Khám phá các dự án thời trang, lookbook và editorial.
          </p>
        </div>

        {projects.length === 0 && (
          <div className="py-20 text-center text-[var(--sub-text)] border-y border-[var(--foreground)]/10">
            Chưa có dự án nào trong danh mục này.
          </div>
        )}

      <ProjectMasonryGrid projects={projects} variant="staggered" />

      </div>
    </Container>
  );
}