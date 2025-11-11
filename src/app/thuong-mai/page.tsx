// app/thuong-mai/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/Container';
import { allProjects } from '@/data/projects-master-data';
// Sửa import để khớp với kiểu dữ liệu mới trong seed-helpers
import { seedProjectsByCategory, Project } from '@/lib/seed-helpers';

// 2. Định nghĩa số lượng bạn muốn hiển thị
const DESIRED_PROJECT_COUNT = 24;
const CATEGORY_SLUG = 'Thương mại';
export const metadata: Metadata = {
  title: 'Dự án Thương Mại | Oni Studio',
  description: 'Các dự án nhiếp ảnh thương mại, sản phẩm và quảng cáo.',
};



export default function ThuongMaiPage() {
  // 1. Lọc lấy các dự án thuộc danh mục 'Cá nhân'
  // const commercialProjects = allProjects.filter(
  //   (project) => project.category === 'Thương mại'
  // );
const compatibleProjects = allProjects as Project[];

  const commercialProjects = seedProjectsByCategory(
    compatibleProjects,        // Danh sách gốc (chỉ 2-3 dự án 'thuong-mai')
    CATEGORY_SLUG,       // Lọc theo danh mục này
    DESIRED_PROJECT_COUNT  // Tạo ra 25 dự án
  );
  return (
    <Container className="py-16 md:py-24">
      {/* --- PHẦN HEADER --- */}
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter text-[var(--foreground)]">
          Thương Mại
        </h1>
        <p className="text-lg mt-4 text-[var(--glow-color)]">
          Dự án quảng cáo, sản phẩm và sự kiện cho thương hiệu.
        </p>
      </div>

      {/* --- PHẦN GRID LAYOUT MỚI --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[300px] gap-3 md:gap-4">
        {commercialProjects.map((project, index) => (
          <Link
            key={project.id}
            href={`/du-an/${project.originalSlug}`}
            // Áp dụng class col-span và row-span từ data của bạn
            className={`relative group rounded-sm ${
              index % 2 !== 0 ? 'top-[24px]' : ''
            }`}
          >
            {/* Ảnh Thumbnail */}
            <Image
              src={project.src}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />

            {/* Lớp phủ tối khi hover để làm nổi bật chữ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Thông tin dự án (chỉ hiện khi hover trên desktop) */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="text-[10px] md:text-xs text-white/80 uppercase tracking-widest mb-2">
                {project.category || 'Project'} {/* Hiển thị năm hoặc text mặc định */}
              </span>
              <h3 className="text-white text-lg md:text-xl font-medium flex items-center gap-2">
                {project.title}
                {/* Mũi tên điều hướng nhỏ */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}