import React from 'react';
import { getProjects } from '@/lib/actions';
import { Metadata } from 'next';
import Container from '@/components/Container';
import ProjectMasonryGrid from '@/components/ProjectMasonryGrid';

export const metadata: Metadata = {
  title: 'Dự án Thương mại | Oni Studio',
  description: 'Các dự án Commercial, Editorial và Lookbook thực hiện bởi Oni Studio.',
};
export const revalidate = 3600; // 1 hour
export default async function CommercialPage() {
  const projects = await getProjects('thuong-mai'); // <-- Slug của danh mục

  return (
    <Container className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-8xl mx-auto">
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] tracking-tighter mb-4">
            Thương mại
          </h1>
          <p className="text-[var(--sub-text)] text-lg max-w-xl">
            Những chiến dịch quảng cáo và bộ ảnh thương mại được thực hiện với sự chỉn chu và sáng tạo.
          </p>
        </div>

        {projects.length === 0 && (
          <div className="py-20 text-center text-[var(--sub-text)] border-y border-[var(--foreground)]/10">
            Chưa có dự án nào trong danh mục này.
          </div>
        )}

        {/* Project Grid */}
        <ProjectMasonryGrid projects={projects} variant="flat" />
      </div>
    </Container>
  );
}