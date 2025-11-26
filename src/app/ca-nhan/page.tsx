import React from 'react';
import { getProjects } from '@/lib/actions';
import { Metadata } from 'next';
import Container from '@/components/Container';
import ProjectMasonryGrid from '@/components/ProjectMasonryGrid';

// Metadata cho SEO
export const metadata: Metadata = {
  title: 'Dự án Cá nhân | Oni Studio',
  description: 'Những dự án thể hiện cái tôi cá nhân và thử nghiệm sáng tạo.',
};
export const revalidate = 3600; // 1 hour
export default async function PersonalPage() {
  // 1. Gọi dữ liệu thật từ Supabase (hoặc Demo)
  const projects = await getProjects('ca-nhan'); // <-- Slug của danh mục

  return (
    <Container className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-8xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] tracking-tighter mb-4">
            Cá nhân
          </h1>
          <p className="text-[var(--sub-text)] text-lg max-w-xl">
            Những thử nghiệm, cảm hứng và góc nhìn riêng.
          </p>
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="py-20 text-center text-[var(--sub-text)] border-y border-[var(--foreground)]/10">
            Chưa có dự án nào trong danh mục này.
          </div>
        )}

        {/* Project Grid */}
        <ProjectMasonryGrid projects={projects} variant="cascade" />
      </div>
    </Container>
  );
}