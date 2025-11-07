// src/app/du-an/[slug]/ProjectClientPage.tsx
'use client'; 

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

  // Giải nén 'credits'
  const client = project.credits?.find(c => c.label === 'Client' || c.label === 'Magazine' || c.label === 'Concept')?.value;
  const year = project.credits?.find(c => c.label === 'Year')?.value;
  const location = project.credits?.find(c => c.label === 'Location')?.value;

  return (
    // *** THAY ĐỔI: Bố cục layout "Tạp chí" (max-w-3xl) ***
    <article className={styles.articleContainer}>
      
      {/* 1. TIÊU ĐỀ */}
      <h1 className={styles.articleTitle}>
        {project.title}
      </h1>

      {/* 2. THÔNG TIN (Credits) */}
      <div className={styles.creditsBar}>
        <ul className={styles.creditsList}>
          {client && <li><strong>{project.credits?.find(c => c.label.includes('Client'))?.label || 'Client'}:</strong> {client}</li>}
          {year && <li><strong>Year:</strong> {year}</li>}
          {location && <li><strong>Location:</strong> {location}</li>}
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