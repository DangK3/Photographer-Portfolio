// src/components/ProjectMasonryGrid.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ProjectData } from '@/data/projects-master-data';

// Định nghĩa 3 kiểu Layout
type LayoutVariant = 'flat' | 'staggered' | 'cascade';

interface GridProps {
  projects: ProjectData[];
  variant?: LayoutVariant; // Prop mới để chọn kiểu
}

const distributeProjects = (items: ProjectData[], cols: number) => {
  const columns: ProjectData[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    columns[i % cols].push(item);
  });
  return columns;
};

export default function ProjectMasonryGrid({ projects, variant = 'staggered' }: GridProps) {
  const mobileProjects = projects;
  const tabletCols = distributeProjects(projects, 2);
  const desktopCols = distributeProjects(projects, 3);

  // --- LOGIC TÍNH TOÁN KHOẢNG CÁCH (PADDING TOP) ---
  
  // 1. Kiểu 'flat' (Thương mại): Thẳng tắp, không lệch
  const getFlatPadding = () => 'pt-0';

  // 2. Kiểu 'staggered' (Thời trang): Lệch cột giữa (So le)
  const getStaggeredPadding = (colIndex: number, totalCols: number) => {
    // Nếu 3 cột -> Cột giữa (index 1) lệch xuống 36px
    if (totalCols === 3 && colIndex === 1) return 'pt-[36px]';
    // Nếu 2 cột -> Cột phải (index 1) lệch xuống 36px
    if (totalCols === 2 && colIndex === 1) return 'pt-[36px]';
    return 'pt-0';
  };

  // 3. Kiểu 'cascade' (Cá nhân): Bậc thang (0 -> 40 -> 80px)
  const getCascadePadding = (colIndex: number) => {
    // Cột 1: 0px, Cột 2: 40px, Cột 3: 80px
    if (colIndex === 0) return 'pt-0';
    if (colIndex === 1) return 'pt-[40px]';
    if (colIndex === 2) return 'pt-[80px]';
    return 'pt-0';
  };

  // Hàm chọn style dựa trên variant
  const getPaddingClass = (colIndex: number, totalCols: number) => {
    if (variant === 'flat') return getFlatPadding();
    if (variant === 'cascade') return getCascadePadding(colIndex);
    return getStaggeredPadding(colIndex, totalCols);
  };

  // --- END LOGIC ---

  const ProjectCard = ({ project, priority = false }: { project: ProjectData, priority?: boolean }) => (
    <Link 
      href={`/du-an/${project.slug}`}
      className="relative block overflow-hidden bg-gray-100 dark:bg-neutral-900 group mb-6 transition-all duration-300 hover:shadow-xl"
    >
      {project.isFeatured && (
        <div className="absolute top-3 right-3 z-20 bg-[var(--foreground)] text-[var(--background)] text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm">
          Nổi bật
        </div>
      )}
      <Image
        src={typeof project.image === 'string' ? project.image : project.image.src}
        alt={project.title}
        width={0} height={0} sizes="(max-width: 768px) 100vw, 33vw"
        className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
        unoptimized
        priority={priority}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <span className="text-xs font-medium text-white/80 uppercase tracking-wider mb-2 block">{project.year}</span>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white line-clamp-2">{project.title}</h3>
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm shrink-0 ml-2"><ArrowUpRight className="text-white w-5 h-5" /></div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div>
        {/* MOBILE (1 Cột - Luôn thẳng) */}
        <div className="block md:hidden space-y-6">
          {mobileProjects.map((p, index) => <ProjectCard key={p.id} project={p} priority={index < 2}/>)}
        </div>

        {/* TABLET (2 Cột) */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 items-start">
          {tabletCols.map((colProjects, colIndex) => (
            <div key={colIndex} className={`flex flex-col ${getPaddingClass(colIndex, 2)}`}>
              {colProjects.map((p, index) => <ProjectCard key={p.id} project={p} priority={index === 0} />)}
            </div>
          ))}
        </div>

        {/* DESKTOP (3 Cột) */}
        <div className="hidden lg:grid grid-cols-3 gap-6 items-start">
          {desktopCols.map((colProjects, colIndex) => (
            <div key={colIndex} className={`flex flex-col ${getPaddingClass(colIndex, 3)}`}>
              {colProjects.map((p, index) => <ProjectCard key={p.id} project={p} priority={index === 0} />)}
            </div>
          ))}
        </div>
    </div>
  );
}