// src/app/du-an/[slug]/ProjectClientPage.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';
import { useInView } from 'react-intersection-observer';
import { Project } from '../../../data/projects-master-data';
import ProjectNavigation from '@/components/ProjectNavigation';
import styles from '../../styles/ProjectArticle.module.css';

// --- LIGHTBOX IMPORTS ---
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

// --- 1. Component con render ảnh (Tối ưu với React.memo) ---
interface ArticleImageProps {
  image: StaticImageData;
  onClick: () => void;
}

const ArticleImage = React.memo(({ image, onClick }: ArticleImageProps) => (
  <div
    className="w-full md:w-[48.75%] flex-shrink-0 cursor-pointer overflow-hidden rounded-sm shadow-xs transition-all duration-300 hover:shadow-md"
    onClick={onClick}
  >
    <Image
      src={image}
      alt="Project detail image" // Alt text tốt hơn
      placeholder="blur" // Thêm hiệu ứng blur khi load
      className="max-w-full h-auto transition-opacity duration-300 hover:opacity-95"
      quality={90}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  </div>
));
ArticleImage.displayName = 'ArticleImage';

// --- 2. Component chính ---
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Lấy thông tin Location (nếu có)
  const locationCredit = useMemo(
    () => project.credits?.find((c) => c.label === 'Location'),
    [project.credits]
  );

  // Tạo danh sách tất cả ảnh cho Lightbox
  const allProjectImages = useMemo(() => {
    return (
      project.articleBody
        ?.filter((block) => block.type === 'imageRow')
        .flatMap((block) => (block as { images: StaticImageData[] }).images) || []
    );
  }, [project.articleBody]);

  // Tạo slides cho Lightbox
  const lightboxSlides = useMemo(
    () => allProjectImages.map((img) => ({ src: img.src })),
    [allProjectImages]
  );

  // Hàm xử lý click mở Lightbox (dùng useCallback để tối ưu)
  const handleImageClick = useCallback(
    (clickedImage: StaticImageData) => {
      // Tìm index chính xác của ảnh vừa click trong mảng tổng
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
        {/* HEADER */}
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

        {/* INTRO */}
        <div className={styles.textWrap}>
          <p>{project.description}</p>
        </div>

        {/* ARTICLE BODY */}
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
                return (
                  <div key={index} className={styles.imageRow}>
                    {block.images.map((img, imgIndex) => (
                      <ArticleImage
                        key={`${index}-${imgIndex}`}
                        image={img}
                        // Truyền hàm xử lý click thay vì index cứng
                        onClick={() => handleImageClick(img)}
                      />
                    ))}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* FOOTER CREDITS */}
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

        {/* NAVIGATION */}
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

      {/* LIGHTBOX */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Zoom, Thumbnails, Captions]}
        animation={{ fade: 300, swipe: 250 }} // Thêm hiệu ứng swipe mượt mà
        carousel={{ finite: false }} // Cho phép cuộn vô hạn
        controller={{ closeOnBackdropClick: true }} // Đóng khi click ra ngoài
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </>
  );
}