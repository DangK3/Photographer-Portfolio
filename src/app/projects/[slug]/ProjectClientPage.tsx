// src/app/projects/[slug]/ProjectClientPage.tsx

'use client'; // Đánh dấu đây là Client Component

import { useInView } from 'react-intersection-observer';
import { Project } from '../../../data/project'; // Import kiểu dữ liệu
import ProjectDetailImage from '@/components/ProjectDetailImage';
import ProjectInfo from '@/components/ProjectInfo';
import ProjectNavigation from '@/components/ProjectNavigation';
import styles from '../../styles/ProjectDetail.module.css'; // Import CSS

// Props nhận từ Server Component (page.tsx)
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


 // Hook cho phần nội dung (description, credits)
  const [contentRef, contentInView] = useInView({
    triggerOnce: true, // Chỉ kích hoạt 1 lần
    threshold: 0.1,    // Kích hoạt khi 10% phần tử hiện ra
    delay: 200,        // Trễ 200ms
  });

  // Hook cho phần điều hướng (Prev/Next)
  const [navRef, navInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  console.log('Debugging imageUrl:', project.imageUrl); // Thêm dòng này
  return (
    <article className={styles.projectDetailContainer}>
      
      {/* Tiêu đề (cũng có thể thêm hiệu ứng fade-in nếu muốn) */}
      <h1 className={styles.projectTitle}>{project.title}</h1>

      {/* Ảnh chính */}
      <ProjectDetailImage
        imageUrl={project.imageUrl}
        altText={project.title}
      />

      {/* Nội dung (áp dụng ref và class động) */}
      <div
        ref={contentRef}
        className={`${styles.contentWrapper} ${
          contentInView ? styles.fade_in_visible : styles.fade_in
        }`}
      >
        <ProjectInfo
          description={project.description}
          client={project.client}
          year={project.year}
          location={project.location}
        />
      </div>

      {/* Điều hướng (áp dụng ref và class động) */}
      <div
        ref={navRef}
        className={`${
          navInView ? styles.fade_in_visible : styles.fade_in
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