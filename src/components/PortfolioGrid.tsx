//PortfolioGrid.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import type { Slide } from "yet-another-react-lightbox"; 
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
// Import CSS (bắt buộc)
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
// Import GridProject
import { GridProject } from '@/types/grid-project';

interface GridItemProps {
  item: GridProject;
  onClick: () => void;
}
// 2. Component Con (Grid Item)
// Tạo component con để giữ code sạch sẽ
function GridItem({ item, onClick }: GridItemProps) {
  return (
    <div
      className={`
        relative group cursor-pointer overflow-hidden 
        h-80 md:h-auto ${item.colSpan} ${item.rowSpan}
      `}
      // h-80: Đặt chiều cao cố định trên mobile (khi chỉ có 1 cột)
      onClick={onClick}
    >
      <Image
        src={item.src}
        alt={item.title}
        layout="fill"
        objectFit="cover"
        quality={85}
        className="transition-transform duration-500 ease-in-out group-hover:scale-105" // Zoom nhẹ khi hover
      />

      {/* Lớp phủ gradient nhẹ từ dưới lên (để chữ dễ đọc) */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
          transition-opacity duration-300
          opacity-100 md:opacity-0 md:group-hover:opacity-100
        `}
      />
      {/* Đường viền mỏng bên trong khi hover */}
      {/* <div className="absolute inset-3 md:inset-4 rounded-2xl rounded-md */}
      {/* border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      <div
        className={`
          absolute inset-3 md:inset-4 border border-white/30 
          transition-opacity duration-300 rounded-md
          opacity-100 md:opacity-0 md:group-hover:opacity-100
        `} // 5. THAY ĐỔI: Logic hiển thị (luôn hiện trên mobile, chỉ hiện khi hover trên desktop)
      />
      <div
        className={`
          absolute bottom-4 left-4 md:bottom-6 md:left-6 
          text-white 
          transition-all duration-300 z-10
          opacity-100 translate-y-0 
          md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0
        `} // 6. THAY ĐỔI: Logic hiển thị (luôn hiện trên mobile, chỉ hiện khi hover trên desktop)
      >
        <span className="text-xs md:text-sm uppercase tracking-widest opacity-80">
          {item.category}
        </span>
        <h3 className="text-base md:text-xl font-light flex items-center mt-1">
          {item.title}
          {/* Icon mũi tên ↗ */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 md:w-5 md:h-5 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </h3>
      </div>
    </div>
  );
}

interface CustomSlide extends Slide {
  slug?: string; // slug là tùy chọn
}
interface PortfolioGridProps {
  projects: GridProject[];
  showDetailLink?: boolean; // "Công tắc" của chúng ta (mặc định là false)
}
// 4. Component Lưới Chính (Main Grid)
export default function PortfolioGrid({ 
  projects, 
}: PortfolioGridProps) {
  // 6. Thêm State để lưu ID của item đang active
  const [index, setIndex] = useState(-1);
  const slides: CustomSlide[] = projects.map((item) => ({
    src: typeof item.src === 'string' ? item.src : item.src.src,
    title: item.title,
    description: item.category,
    slug: item.slug, // Truyền slug vào cho Lightbox
  }));

  return (
    <>
      {/* 7. Thêm onClick vào wrapper để xử lý "chạm ra ngoài" */}
    <div
      className="
        grid grid-cols-2 
        md:grid-cols-4 
        md:auto-rows-[350px] 
        gap-2 md:gap-4
      "
    >
      {projects.map((item, i) => (
        <GridItem
          key={item.id}
          item={item}
         onClick={() => setIndex(i)}// 9. Truyền hàm xử lý click
        />
      ))}
    </div>
    <Lightbox
        open={index > -1}
        close={() => setIndex(-1)}
        index={index}
        slides={slides}
        plugins={[Captions, Thumbnails]}
        captions={{
          showToggle: true,
          descriptionTextAlign: 'center',
        }} 

        thumbnails={{
          position: 'bottom',
        }}
      />
    </>
  );
}