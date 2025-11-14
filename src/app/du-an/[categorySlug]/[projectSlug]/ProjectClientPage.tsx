// src/app/du-an/[slug]/ProjectClientPage.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useInView } from 'react-intersection-observer';
import { Project } from '../../../../data/projects-master-data';
import ProjectNavigation from '@/components/ProjectNavigation';
import styles from '../../../styles/ProjectArticle.module.css';

// --- LIGHTBOX IMPORTS (Giữ nguyên) ---
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// --- 1. (CẬP NHẬT) Component con render ảnh ---
interface ArticleImageProps {
  image: StaticImageData;
  onClick: () => void;
  imageCount: number; // (MỚI) Thêm prop đếm số lượng ảnh
}

const ArticleImage = React.memo(
  ({ image, onClick, imageCount }: ArticleImageProps) => {
    
    // (MỚI) Hàm helper để quyết định class width
    const getWidthClass = (count: number): string => {
      switch (count) {
        case 1:
          return 'w-full'; // 1 ảnh -> Luôn full-width
        case 2:
          return 'w-full md:w-[48.75%]'; // 2 ảnh -> 1 cột (mobile), 2 cột (desktop)
        case 3:
          return 'w-full md:w-[32%]'; // 3 ảnh -> 1 cột (mobile), 3 cột (desktop)
        case 4:
          return 'w-full md:w-[24%]'; // 4 ảnh -> 2 cột (mobile), 4 cột (desktop)
        default:
          // Mặc định cho 5+ ảnh, hoặc lỗi
          return 'w-full md:w-[24%]'; 
      }
    };

    const widthClass = getWidthClass(imageCount);

    return (
      <div
        // (CẬP NHẬT) Sử dụng `widthClass` động thay vì class cứng
        className={`${widthClass} flex-shrink-0 cursor-pointer overflow-hidden rounded-sm shadow-xs transition-all duration-300 hover:shadow-md`}
        onClick={onClick}
      >
        <Image
          src={image}
          alt="Project detail image"
          placeholder="blur"
          className="max-w-full h-auto transition-opacity duration-300 hover:opacity-95"
          quality={90}
          sizes={
            imageCount === 1 ? '100vw' : 
            imageCount === 2 ? '(max-width: 768px) 100vw, 50vw' :
            imageCount === 3 ? '(max-width: 768px) 100vw, 33vw' :
            '(max-width: 768px) 50vw, 25vw'
          } // (CẬP NHẬT) Tối ưu sizes
        />
      </div>
    );
  }
);
ArticleImage.displayName = 'ArticleImage';

// --- 2. Component chính (Chỉ cập nhật phần render) ---
interface ProjectClientPageProps {
  project: Project;
  prevProjectLink: string | null;
  nextProjectLink: string | null;
}

export default function ProjectClientPage({
  project,
  prevProjectLink,
  nextProjectLink,
}: ProjectClientPageProps) {
  // ... (Tất cả state, memo, callback... giữ nguyên) ...
  const [navRef, navInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const locationCredit = useMemo(
    () => project.credits?.find((c) => c.label === 'Location'),
    [project.credits]
  );

  const allProjectImages = useMemo(() => {
    return (
      project.articleBody
        ?.filter((block) => block.type === 'imageRow')
        .flatMap((block) => (block as { images: StaticImageData[] }).images) || []
    );
  }, [project.articleBody]);

  const lightboxSlides = useMemo(
    () => allProjectImages.map((img) => ({ src: img.src })),
    [allProjectImages]
  );

  const handleImageClick = useCallback(
    (clickedImage: StaticImageData) => {
      const index = allProjectImages.findIndex((img) => img.src === clickedImage.src);
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
        <h1 className={styles.articleTitle}>{project.title}</h1>
        <div className={styles.creditsBar}>
         <ul className={styles.creditsList}>
          {locationCredit && (
            <li>
              <strong className="mr-1">Location:</strong> {locationCredit.value}
            </li>
          )}
        </ul>
        </div>
        <div className={styles.textWrap}>
          <p>{project.description}</p>
        </div>

        {/* ARTICLE BODY (Cập nhật logic render) */}
        <div className="space-y-8 md:space-y-12">
          {project.articleBody?.map((block, index) => {
            switch (block.type) {
              case 'heading':
                return (
                  <div key={index} className={styles.highlightWrap}>
                    <h2>{block.content}</h2>
                  </div>
                );
              case 'paragraph':
                return (
                  <div key={index} className={styles.textWrap}>
                    <p>{block.content}</p>
                  </div>
                );
              case 'imageRow':
                // (MỚI) Đếm số lượng ảnh trong hàng này
                const imageCount = block.images.length;
                return (
                  <div key={index} className={styles.imageRow}>
                    {block.images.map((img, imgIndex) => (
                      <ArticleImage
                        key={`${index}-${imgIndex}`}
                        image={img}
                        onClick={() => handleImageClick(img)}
                        imageCount={imageCount} // (MỚI) Truyền số lượng vào
                      />
                    ))}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* ... (FOOTER CREDITS, NAVIGATION, LIGHTBOX giữ nguyên) ... */}
        {project.credits && project.credits.length > 0 && (
          <div className="mt-16 md:mt-24 pt-8 border-t border-[var(--foreground)]/20">
            <h3 className="text-xl md:text-2xl font-light mb-6 text-center text-[var(--foreground)]">
              Credits
            </h3>
            <ul className="grid grid-cols-1 gap-y-2 max-w-md mx-auto">
              {project.credits.map((credit, index) => (
                <li key={index} className="flex text-sm md:text-base">
                  <span className="w-1/2 text-right pr-4 font-semibold opacity-70">
                    {credit.label}
                  </span>
                  <span className="w-1/2 text-left opacity-90">{credit.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          ref={navRef}
          className={`mt-16 md:mt-24 ${
            navInView ? styles.fade_in_visible : styles.fade_in_hidden
          }`}
        >
          <ProjectNavigation
            prevProjectLink={prevProjectLink}
            nextProjectLink={nextProjectLink}
          />
        </div>
      </article>

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
      />
    </>
  );
}