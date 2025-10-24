// src/components/BtsSection.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Container from './Container'; // Tận dụng Container bạn đã có
import projects from '../data/project'; // Import dữ liệu Section 04
import styles from '../app/styles/BtsSection.module.css'; // File CSS module mới

// Component con cho từng "cảnh" text
interface SceneProps {
  project: (typeof projects)[0];
  onVisible: () => void; // Hàm callback khi scene này active
  isActive: boolean;
}

const Scene: React.FC<SceneProps> = ({ project, onVisible, isActive }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Kích hoạt khi scene đi vào giữa màn hình
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onVisible(); // Gọi hàm callback để cập nhật activeIndex
        }
      },
      {
        threshold: 0.5, // Kích hoạt khi 50% nội dung lọt vào
        rootMargin: '0px 0px -40% 0px', // Thu hẹp vùng trigger vào giữa
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onVisible]);

  return (
      // Scene bây giờ là một "màn hình" full-height
      <div ref={ref} className={styles.scene}>
        {/* Bọc nội dung text trong Container để giữ chiều rộng */}
        <Container>
          <div className={`${styles.sceneContent} ${isActive ? styles.sceneActive : ''}`}>
            <span className={styles.sceneCategory}>
              {project.client} / {project.year}
            </span>
            <h3 className={styles.sceneTitle}>{project.title}</h3>
            <p className={styles.sceneDescription}>{project.description}</p>
            <a href={`/projects/${project.slug}`} className={styles.sceneLink}>
              Xem chi tiết dự án &rarr;
            </a>
          </div>
        </Container>
      </div>
    );
};

export default function BtsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const btsProjects = projects.slice(0, 6);

  return (
    <section id="case-studies" className={styles.btsSection}>
      {/* 1. PHẦN HÌNH ẢNH (STICKY Ở NỀN) */}
      <div className={styles.stickyImageWrapper}>
        {btsProjects.map((project, index) => (
          <div
            key={project.slug}
            className={`${styles.imageContainer} ${
              activeIndex === index ? styles.imageActive : ''
            }`}
          >
            <Image
              src={project.imageUrl} // Ảnh ngang của bạn
              alt={project.title}
              fill
              objectFit="cover" // object-fit: cover bây giờ sẽ hoạt động TỐT
              quality={90}
              priority={index === 0}
              className={styles.image}
            />
            <div className={styles.imageOverlay} /> {/* Thêm lớp phủ mờ */}
          </div>
        ))}
      </div>

      {/* 2. PHẦN NỘI DUNG (CUỘN LÊN TRÊN) */}
      {/* Tiêu đề cho Section (cuộn bình thường) */}
      <div className={styles.sectionHeader}>
        <Container>
          <h2 className={styles.sectionTitle}>Hậu trường</h2>
          <p className={styles.sectionSubtitle}>
            Câu chuyện và bối cảnh đằng sau những tác phẩm chọn lọc.
          </p>
        </Container>
      </div>

      {/* Cột text cuộn (đè lên trên ảnh) */}
      <div className={styles.textColumn}>
        {btsProjects.map((project, index) => (
          <Scene
            key={project.slug}
            project={project}
            onVisible={() => setActiveIndex(index)}
            isActive={activeIndex === index}
          />
        ))}
      </div>
    </section>
  );
}