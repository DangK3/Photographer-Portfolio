// src/components/ProjectShowcase.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getProjects } from '@/lib/actions';
import { ProjectData } from '@/data/projects-master-data';

// --- Component Con: ProjectItem ---
function ProjectItem({ project, index }: { project: ProjectData; index: number }) {
  const isImageRight = index % 2 !== 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-24 md:mb-32 ${
        isImageRight ? 'md:flex-row-reverse' : ''
      }`}
    >
      {/* Image Side */}
      <div className="w-full md:w-3/5 relative group cursor-pointer overflow-hidden rounded-lg shadow-2xl">
        <Link href={`/du-an/${project.slug}`}>
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={typeof project.image === 'string' ? project.image : project.image.src}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            
            {/* Badge Danh mục nổi bật */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--foreground)] rounded">
              {project.categoryName}
            </div>
          </div>
        </Link>
      </div>

      {/* Text Side */}
      <div className="w-full md:w-2/5 text-center md:text-left space-y-6">
        <span className="inline-block text-xs font-bold tracking-[0.2em] text-[var(--sub-text)] uppercase border-b border-[var(--glow-color)] pb-1">
          Dự án mới nhất
        </span>
        
        <h3 className="text-3xl md:text-5xl font-bold text-[var(--foreground)] leading-tight">
          <Link href={`/du-an/${project.slug}`} className="hover:text-[var(--sub-text)] transition-colors">
            {project.title}
          </Link>
        </h3>

        {project.description && (
          <p className="text-[var(--sub-text)] text-lg font-light leading-relaxed line-clamp-3">
            {project.description}
          </p>
        )}
        {project.credits && project.credits.length > 0 && (
          <ul className="mt-5 space-y-2 text-sm text-[var(--sub-text)] border-l border-[var(--foreground)]/20 pl-4 text-left">
            {project.credits.slice(0, 3).map((credit, idx) => (
              <li key={idx}>
                <strong className="font-semibold text-[var(--foreground)]">
                  {credit.label}:
                </strong> {credit.value}
              </li>
            ))}
          </ul>
        )}
        <div className="pt-4">
          <Link 
            href={`/du-an/${project.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-[var(--foreground)] hover:gap-4 transition-all duration-300 group/link"
          >
            Xem dự án <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// --- Component Chính ---
export default function ProjectShowcase() {
  const [showcaseProjects, setShowcaseProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        const all = await getProjects();
        
        // 1. Lấy tất cả dự án Featured
        const allFeatured = all.filter(p => p.isFeatured);

        // 2. Lọc: Mỗi danh mục chỉ lấy 1 đại diện MỚI NHẤT
        // Danh sách các category slug cần lấy
        const targetCategories = ['thoi-trang', 'thuong-mai', 'ca-nhan'];
        
        const uniqueFeatured: ProjectData[] = [];

        targetCategories.forEach(catSlug => {
          // Tìm dự án Featured mới nhất của danh mục này
          const bestProject = allFeatured.find(p => p.category === catSlug);
          if (bestProject) {
            uniqueFeatured.push(bestProject);
          }
        });

        // Nếu thiếu (ví dụ chưa có dự án Cá nhân nào Featured), có thể lấy bù từ danh sách chung
        // (Ở đây mình giữ logic chặt: Không có thì không hiện)
        
        setShowcaseProjects(uniqueFeatured);
      } catch (error) {
        console.error("Lỗi tải showcase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndFilter();
  }, []);

  if (isLoading || showcaseProjects.length === 0) return null;

  return (
    <div className="max-w-8xl mx-auto px-4 md:px-8 py-20 border-t border-[var(--foreground)]/10">
      {showcaseProjects.map((project, index) => (
        <ProjectItem key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}