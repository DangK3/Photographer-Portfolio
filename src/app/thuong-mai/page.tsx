import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProjects } from '@/lib/actions';
import { ArrowUpRight } from 'lucide-react';
import { Metadata } from 'next';
import Container from '@/components/Container';

// Metadata cho SEO
export const metadata: Metadata = {
  title: 'Dự án Thương mại | Oni Studio',
  description: 'Các dự án Commercial, Editorial và Lookbook thực hiện bởi Oni Studio.',
};

export default async function CommercialPage() {
  // 1. Gọi dữ liệu thật từ Supabase (hoặc Demo)
  const projects = await getProjects('thuong-mai'); // <-- Slug của danh mục

  return (
    <Container className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-8xl mx-auto">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] tracking-tighter mb-4">
            Thương mại
          </h1>
          <p className="text-[var(--sub-text)] text-lg max-w-xl">
            Những chiến dịch quảng cáo và bộ ảnh thương mại được thực hiện với sự chỉn chu và sáng tạo.
          </p>
        </div>

        {/* Empty State */}
        {projects.length === 0 && (
          <div className="py-20 text-center text-[var(--sub-text)] border-y border-[var(--foreground)]/10">
            Chưa có dự án nào trong danh mục này.
          </div>
        )}

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px] md:auto-rows-[400px]">
          {projects.map((project) => (
            <Link 
              key={project.id}
              href={`/du-an/${project.slug}`}
              className={`relative group overflow-hidden rounded-lg transition-all duration-300
                md:col-span-1 md:row-span-1
                ${project.isFeatured ? 'ring-2 ring-offset-2  shadow-xl z-10' : 'opacity-90 hover:opacity-100'}
              `} // <-- Logic highlight ở đây
              // style={{
              //   gridColumn: `span ${project.colSpan}`,
              //   gridRow: `span ${project.rowSpan}`
              // }}
            >
              {/* Badge Nổi Bật (Chỉ hiện nếu là Featured) */}
              {project.isFeatured && (
                <div className="absolute top-3 right-3 z-20 bg-[var(--foreground)] text-[var(--background)] text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">
                  Nổi bật
                </div>
              )}

              {/* Image */}
              <Image
                src={typeof project.image === 'string' ? project.image : project.image.src}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs font-medium text-white/80 uppercase tracking-wider mb-2 block">
                    {project.year}
                  </span>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white">
                      {project.title}
                    </h3>
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                      <ArrowUpRight className="text-white w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            ))}
          </div>
      </div>
    </Container>
  );
}