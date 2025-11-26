// src/components/PortfolioSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// 1. Thêm StaticImageData vào import
import Image, { StaticImageData } from 'next/image'; 
import Link from 'next/link';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { getProjects } from '@/lib/actions'; 
import { ProjectData } from '@/data/projects-master-data'; 
import Container from './Container';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'thoi-trang', label: 'Thời trang' },
  { id: 'thuong-mai', label: 'Thương mại' },
  { id: 'ca-nhan', label: 'Cá nhân' },
];

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allData = await getProjects();
        // Chỉ lấy dự án Featured
        const featuredOnly = allData.filter(p => p.isFeatured === true);
        setProjects(featuredOnly);
      } catch (error) {
        console.error("Lỗi tải dự án:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === 'all') return true;
    return project.category === activeCategory;
  });

  // 2. Sửa Helper Function: Dùng Union Type chuẩn xác
  const getImageSrc = (img: string | StaticImageData) => {
    return typeof img === 'string' ? img : img.src;
  };

  return (
    <Container className="py-20 px-4 md:px-8 bg-[var(--background)]">
      <div className="max-w-8xl mx-auto">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] tracking-tighter mb-4">
              Dự án Nổi bật
            </h2>
            <p className="text-[var(--sub-text)] max-w-md">
              Tuyển tập các dự án tiêu biểu, nơi ánh sáng và cảm xúc giao thoa.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]'
                    : 'bg-transparent text-[var(--sub-text)] border-[var(--sub-text)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-[var(--sub-text)]" size={32} />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProjects.length === 0 && (
          <div className="text-center py-20 text-[var(--sub-text)] border border-dashed border-[var(--sub-text)]/30 rounded-xl">
            <p>Chưa có dự án nổi bật nào trong danh mục này.</p>
            <Link href="/admin/projects" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
              Vào Admin để thêm dự án hoặc điều chỉnh dự án <strong>Nổi bật</strong>
            </Link>
          </div>
        )}

        {/* Grid Display */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px] md:auto-rows-[400px]"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={project.id}
                className="relative group overflow-hidden bg-gray-100 dark:bg-neutral-900 cursor-pointer"
                style={{
                  gridColumn: `span ${project.colSpan}`,
                  gridRow: `span ${project.rowSpan}`
                }}
              >
                <Link href={`/du-an/${project.slug}`} className="block h-full w-full">
                  {/* Image */}
                  <Image
                    src={getImageSrc(project.image)}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Overlay Info */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-xs font-medium text-white/80 uppercase tracking-wider mb-2 block">
                        {project.categoryName} — {project.year}
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
                  
                  {/* Badge Nổi Bật */}
                  <div className="absolute top-4 right-4 bg-[var(--foreground)] text-[var(--background)] text-[10px] font-bold uppercase px-2 py-1 rounded shadow-sm z-10">
                    Nổi bật
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </Container>
  );
}