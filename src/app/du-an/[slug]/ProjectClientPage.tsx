// src/app/du-an/[slug]/ProjectClientPage.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useInView } from 'react-intersection-observer';
import { ProjectData } from '@/data/projects-master-data'; 
import ProjectNavigation from '@/components/ProjectNavigation';
// Lưu ý: Đảm bảo đường dẫn CSS đúng với dự án của bạn
import styles from '../../styles/ProjectArticle.module.css';

// --- LIGHTBOX ---
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// --- 1. Component Ảnh Chi Tiết ---
interface ArticleImageProps {
  image: StaticImageData | string;
  onClick: () => void;
  imageCount: number;
}

const ArticleImage = React.memo(({ image, onClick, imageCount }: ArticleImageProps) => {
  // Logic chia cột thông minh
  const getWidthClass = (count: number): string => {
    switch (count) {
      case 1: return 'w-full'; // 1 ảnh -> Full
      case 2: return 'w-full md:w-[49%]'; // 2 ảnh -> 50%
      case 3: return 'w-full md:w-[32%]'; // 3 ảnh -> 33%
      default: return 'w-full md:w-[49%]'; // 4+ ảnh -> 50%
    }
  };

  const widthClass = getWidthClass(imageCount);

  return (
    <div
      className={`${widthClass} relative aspect-[3/4] flex-shrink-0 cursor-pointer overflow-hidden rounded-sm shadow-sm transition-all duration-500 hover:shadow-xl hover:scale-[1.01]`}
      onClick={onClick}
    >
      <Image
        src={image} 
        alt="Project detail"
        fill
        className="object-cover transition-opacity duration-300 hover:opacity-90"
        quality={90}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
});
ArticleImage.displayName = 'ArticleImage';

// --- 2. Component Chính ---
interface ProjectClientPageProps {
  project: ProjectData;
  prevProjectLink: string | null;
  nextProjectLink: string | null;
}

export default function ProjectClientPage({
  project,
  prevProjectLink,
  nextProjectLink,
}: ProjectClientPageProps) {
  
  const [navRef, navInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Lấy thông tin Location & Client để hiển thị nổi bật
  const locationCredit = useMemo(() => project.credits?.find((c) => c.label.toLowerCase().includes('location')), [project.credits]);
  const clientCredit = useMemo(() => project.credits?.find((c) => c.label.toLowerCase().includes('client')), [project.credits]);

  // Gom toàn bộ ảnh để dùng cho Lightbox
  const allProjectImages = useMemo(() => {
    return (
      project.articleBody
        ?.filter((block) => block.type === 'imageRow')
        .flatMap((block) => (block as { images: (StaticImageData | string)[] }).images) || []
    );
  }, [project.articleBody]);

  const lightboxSlides = useMemo(
    () => allProjectImages.map((img) => ({ 
      src: typeof img === 'string' ? img : img.src 
    })),
    [allProjectImages]
  );

  const handleImageClick = useCallback(
    (clickedImage: StaticImageData | string) => {
      const clickedSrc = typeof clickedImage === 'string' ? clickedImage : clickedImage.src;
      const index = allProjectImages.findIndex((img) => {
        const imgSrc = typeof img === 'string' ? img : img.src;
        return imgSrc === clickedSrc;
      });

      if (index !== -1) {
        setLightboxIndex(index);
        setLightboxOpen(true);
      }
    },
    [allProjectImages]
  );

  return (
    <>
      <article className={styles.articleContainer}>
        
        {/* --- HEADER BÀI VIẾT --- */}
        <header className="mb-12 md:mb-20 text-center">
          {/* Category & Year */}
          <div className="flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] text-[var(--sub-text)] uppercase mb-4">
            <span>{project.categoryName}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--sub-text)]"></span>
            <span>{project.year}</span>
          </div>

          {/* Title */}
          <h1 className={styles.articleTitle}>{project.title}</h1>

          {/* Meta Info (Client / Location) */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm font-medium text-[var(--foreground)]">
            {clientCredit && (
              <div className="flex items-center gap-2">
                <span className="text-[var(--sub-text)]">Client:</span>
                <span>{clientCredit.value}</span>
              </div>
            )}
            {locationCredit && (
              <div className="flex items-center gap-2">
                <span className="text-[var(--sub-text)]">Location:</span>
                <span>{locationCredit.value}</span>
              </div>
            )}
          </div>
        </header>

        {/* --- HERO THUMBNAIL (Nếu muốn hiển thị lại ảnh bìa) --- */}
        {/* <div className="w-full aspect-[16/9] relative mb-16 rounded-lg overflow-hidden shadow-lg">
           <Image src={project.image} alt={project.title} fill className="object-cover" priority />
        </div> */}

        {/* --- INTRO DESCRIPTION --- */}
        {project.description && (
          <div className={styles.textWrap}>
            <p className="text-lg md:text-xl leading-relaxed font-light italic text-[var(--sub-text)] border-l-2 border-[var(--foreground)] pl-6">
              {project.description}
            </p>
          </div>
        )}

        {/* --- MAIN CONTENT BODY --- */}
        <div className="space-y-12 md:space-y-20 mt-16">
          {project.articleBody?.map((block, index) => {
            switch (block.type) {
              case 'heading':
                return (
                  <div key={index} className={styles.highlightWrap}>
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mt-8 mb-4">
                      {block.content}
                    </h2>
                  </div>
                );
              case 'paragraph':
                return (
                  <div key={index} className={styles.textWrap}>
                    <p className="text-base md:text-lg leading-loose text-[var(--sub-text)]">
                      {block.content}
                    </p>
                  </div>
                );
              case 'imageRow':
                const imageCount = block.images.length;
                return (
                  <div key={index} className={`${styles.imageRow} flex flex-wrap gap-2 md:gap-4 justify-center`}>
                    {block.images.map((img, imgIndex) => (
                      <ArticleImage
                        key={`${index}-${imgIndex}`}
                        image={img}
                        onClick={() => handleImageClick(img)}
                        imageCount={imageCount}
                      />
                    ))}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* --- FOOTER CREDITS --- */}
        {project.credits && project.credits.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[var(--foreground)]/10">
            <h3 className="text-md text-center uppercase font-bold tracking-widest mb-8 text-[var(--foreground)]">
              Credit
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-2xl mx-auto">
              {project.credits.map((credit, index) => (
                <div key={index} className="flex justify-between items-baseline text-sm border-b border-dashed border-[var(--sub-text)]/20 pb-2">
                  <span className="font-semibold text-[var(--sub-text)] opacity-80">
                    {credit.label}
                  </span>
                  <span className="text-right text-[var(--foreground)] font-medium">
                    {credit.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- NAVIGATION --- */}
        <div
          ref={navRef}
          className={`mt-24 transition-opacity duration-1000 ${
            navInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <ProjectNavigation
            prevProjectLink={prevProjectLink}
            nextProjectLink={nextProjectLink}
          />
        </div>
      </article>

      {/* --- LIGHTBOX COMPONENT --- */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom, Thumbnails, Captions]}
        animation={{ fade: 300, swipe: 250 }}
        carousel={{ finite: false }}
        controller={{ closeOnBackdropClick: true }}
        zoom={{ maxZoomPixelRatio: 3 }}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, .95)" } }}
      />
    </>
  );
}