// src/app/du-an/[slug]/ProjectClientPage.tsx
'use client'; 
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image
import { useInView } from 'react-intersection-observer';
import { Project } from '../../../data/projects-master-data'; 
// *** XÓA: ProjectDetailImage và ProjectInfo ***
import ProjectNavigation from '@/components/ProjectNavigation';
// *** THAY ĐỔI: Dùng CSS Module mới ***
import styles from '../../styles/ProjectArticle.module.css'; // Chúng ta sẽ dùng file CSS mới

// Component con để render ảnh (giống trang Gucci)
const ArticleImage: React.FC<{ image: Project['src'] }> = ({ image }) => (
  // Dùng w-full (trên mobile) và md:w-[48.75%] (giống Gucci)
  <div className="w-full md:w-[48.75%] flex-shrink-0">
    <Image
      src={image}
      alt={image.src.toString()} // Dùng src làm alt tạm
      width={image.width}
      height={image.height}
      className="max-w-full h-auto rounded-lg shadow-md"
      quality={85}
    />
  </div>
);

interface ProjectClientPageProps {
  project: Project;
  prevProjectSlug: string | null;
  nextProjectSlug: string | null;
}

export default function ProjectClientPage({
  project,
  prevProjectSlug,
  nextProjectSlug,
}: ProjectClientPageProps) {

  const [navRef, navInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [currentTime, setCurrentTime] = useState<string>('');

  // Hook để cập nhật thời gian mỗi giây
  useEffect(() => {
    // Hàm lấy thời gian hiện tại theo múi giờ của location (tạm thời dùng múi giờ máy khách hoặc mặc định)
    // Để chính xác hơn, bạn cần biết múi giờ của từng location.
    // Ví dụ đơn giản: hiển thị giờ địa phương của người dùng
    const updateTime = () => {
      const now = new Date();
      // Định dạng: HH:mm:ss DD/MM/YYYY
      const formattedTime = now.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      setCurrentTime(formattedTime);
    };

    updateTime(); // Gọi ngay lập tức
    const timer = setInterval(updateTime, 1000); // Cập nhật mỗi giây

    return () => clearInterval(timer); // Dọn dẹp khi component unmount
  }, []);

  return (
    // *** THAY ĐỔI: Bố cục layout "Tạp chí" (max-w-3xl) ***
    <article className={styles.articleContainer}>
      
      {/* 1. TIÊU ĐỀ */}
      <h1 className={styles.articleTitle}>
        {project.title}
      </h1>

      <div className={styles.creditsBar}>
        <ul className={styles.creditsList}>
          {location && (
            <li>
              {currentTime && <span className="opacity-70 ml-2">({currentTime})</span>}
            </li>
          )}
        </ul>
      </div>

      {/* 3. ĐOẠN MỞ ĐẦU (Intro) */}
      <div className={styles.textWrap}>
        <p>{project.description}</p>
      </div>

      {/* 4. NỘI DUNG "DÀI" (Render từ 'articleBody') */}
      <div className="space-y-8 md:space-y-12">
        {project.articleBody?.map((block, index) => {
          
          if (block.type === 'heading') {
            return (
              <div key={index} className={styles.highlightWrap}>
                <h2>{block.content}</h2>
              </div>
            );
          }
          
          if (block.type === 'paragraph') {
            return (
              <div key={index} className={styles.textWrap}>
                <p>{block.content}</p>
              </div>
            );
          }

          if (block.type === 'imageRow') {
            return (
              <div key={index} className={styles.imageRow}>
                {block.images.map((img, imgIndex) => (
                  <ArticleImage key={imgIndex} image={img} />
                ))}
              </div>
            );
          }

          
          return null;
        })}
      </div>
        {project.credits && project.credits.length > 0 && (
        <div className="mt-16 md:mt-24 pt-8 border-t border-[var(--foreground)]/20">
          <h3 className="text-xl md:text-2xl font-light mb-6 text-center text-[var(--foreground)]">
            Credits
          </h3>
          {/* Container cho danh sách: Dùng Grid 2 cột trên Desktop để tiết kiệm diện tích */}
          <ul className="grid grid-cols-1 gap-x-12 gap-y-3 max-w-4xl mx-auto">
            {project.credits.map((credit, index) => (
              <li key={index} className="flex items-baseline text-sm md:text-base">
                {/* LABEL: Chiếm 40% chiều rộng, căn phải.
                  Thêm 'pr-3' để tạo khoảng cách (gap) an toàn với phần giá trị.
                */}
                <strong className="w-[50%] text-right pr-3 font-semibold text-[var(--foreground)] opacity-80 shrink-0">
                  {credit.label}
                </strong>
                
                {/* VALUE: Chiếm 60% còn lại, căn trái.
                */}
                <span className="w-[50%] text-left text-[var(--foreground)] opacity-90">
                  {credit.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* 5. ĐIỀU HƯỚNG (Giữ nguyên) */}
      <div
        ref={navRef}
        className={`mt-16 md:mt-24 ${
          navInView ? styles.fade_in_visible : styles.fade_in_hidden
        }`}
      >
        <ProjectNavigation
          prevProjectSlug={prevProjectSlug}
          nextProjectSlug={nextProjectSlug}
        />
      </div>
    </article>
  );
}