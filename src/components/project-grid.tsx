// app/thoi-trang/project-grid.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/lib/seed-helpers';
import Spinner from '@/components/Spinner';
import {
  INITIAL_LOAD_COUNT,
  LOAD_MORE_COUNT,
  SLUG_CATE_PERSONAL,
  SLUG_CATE_COMMERCIAL,
  SLUG_CATE_FASHION,
} from '@/lib/constants';

interface ProjectGridProps {
  allProjects: Project[];
}

export default function ProjectGrid({ allProjects }: ProjectGridProps) {
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>(
    allProjects.slice(0, INITIAL_LOAD_COUNT)
  );
  // ... (các state khác giữ nguyên) ...
  const [currentIndex, setCurrentIndex] = useState(INITIAL_LOAD_COUNT);
  const [hasMore, setHasMore] = useState(
    allProjects.length > INITIAL_LOAD_COUNT
  );
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // ... (hàm loadMoreProjects giữ nguyên) ...
  const loadMoreProjects = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      const nextIndex = currentIndex + LOAD_MORE_COUNT;
      const newProjects = allProjects.slice(currentIndex, nextIndex);
      setDisplayedProjects((prev) => [...prev, ...newProjects]);
      setCurrentIndex(nextIndex);
      setHasMore(nextIndex < allProjects.length);
      setIsLoading(false);
    }, 500);
  }, [isLoading, hasMore, currentIndex, allProjects]);

  // ... (useEffect cho IntersectionObserver giữ nguyên) ...
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !isLoading) {
          loadMoreProjects();
        }
      },
      { threshold: 1.0 }
    );
    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }
    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, loadMoreProjects]);

  // 3. (MỚI) Lấy category của grid này
  // (Giả định tất cả project trong `allProjects` đều cùng 1 category)
  const gridCategory = allProjects[0]?.cateSlug;

  // 4. (MỚI) Helper function để lấy class cho item <Link>
  const getLinkClassName = (project: Project, index: number): string => {
    const baseClasses = 'relative group rounded-sm';

    switch (gridCategory) {
      case SLUG_CATE_FASHION:
        // Logic cho 'thoi-trang': thêm top-[24px] cho ảnh chẵn
        const fashionClass = index % 2 !== 0 ? 'top-[24px]' : '';
        return `${baseClasses} ${fashionClass}`;

      case SLUG_CATE_PERSONAL:
        const colSpan = project.colSpan || 'col-span-1'; // Fallback
        const rowSpan = project.rowSpan || 'row-span-1'; // Fallback
        return `${baseClasses} ${colSpan} ${rowSpan}`;

      case SLUG_CATE_COMMERCIAL:
      default:
        // 'thuong-mai' và mặc định: không có class đặc biệt
        return baseClasses;
    }
  };

  // 5. (MỚI) Helper function để lấy class cho grid wrapper <div>
  const getGridWrapperClassName = (category: string | undefined): string => {
    const baseGap = 'gap-3 md:gap-4';

    switch (category) {
      case SLUG_CATE_PERSONAL:
      case SLUG_CATE_FASHION:
      case SLUG_CATE_COMMERCIAL:
      default:
        // Layout 4 cột, auto-rows như cũ
        return `grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[300px] ${baseGap}`;
    }
  };

  // 6. Render
  return (
    <>
      {/* (CẬP NHẬT) Dùng class wrapper động */}
      <div className={getGridWrapperClassName(gridCategory)}>
        {displayedProjects.map((project, index) => {
          let imageSizes: string;
          const colSpan = project.colSpan || '';

          if (gridCategory === SLUG_CATE_PERSONAL) {
            // Logic cho grid 'ca-nhan' (12 cột)
            if (colSpan.includes('md:col-span-6')) { // 6/12 cột
              imageSizes = '(max-width: 768px) 50vw, 50vw';
            } else if (colSpan.includes('md:col-span-4')) { // 4/12 cột
              imageSizes = '(max-width: 768px) 50vw, 33vw';
            } else {
              imageSizes = '(max-width: 768px) 50vw, 25vw'; // Fallback
            }
          } else {
            // Logic cho 'thoi-trang' và 'thuong-mai' (4 cột)
            // (Hiện tại layout 2 trang này đơn giản, nên dùng chung 1 sizes)
            imageSizes = '(max-width: 768px) 50vw, 25vw';
          }

          return (
          <Link
            key={project.id}
            href={`/du-an/${project.cateSlug}/${project.originalSlug || project.slug}`}
            // (CẬP NHẬT) Dùng class item động
            className={getLinkClassName(project, index)}
          >
            <Image
              src={project.src}
              alt={project.title}
              fill
              sizes={imageSizes}
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-[10px] md:text-xs text-white/80 uppercase tracking-widest mb-2">
                {project.category || 'Project'}
              </span>
              <h3 className="text-white text-lg md:text-xl font-medium flex items-center gap-2">
                {project.title}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </h3>
            </div>
            {/* --- Hết nội dung bên trong Link --- */}
          </Link>
        );
      })}
      </div>

      {/* --- PHẦN LOADER (Giữ nguyên) --- */}
      <div
        ref={loaderRef}
        className="col-span-2 md:col-span-4 h-24 flex justify-center items-center"
      >
        {hasMore && <Spinner />}
        {!hasMore && (
          <p className="text-[var(--sub-text)]">Đã tải hết dự án.</p>
        )}
      </div>
    </>
  );
}