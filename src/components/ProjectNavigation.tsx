// src/components/ProjectNavigation.tsx
import React from 'react';
import Link from 'next/link';
import styles from '../app/ProjectDetail.module.css';

interface ProjectNavigationProps {
  prevProjectSlug: string | null; // Có thể là string hoặc null
  nextProjectSlug: string | null; // Có thể là string hoặc null
}

const ProjectNavigation: React.FC<ProjectNavigationProps> = ({ prevProjectSlug, nextProjectSlug }) => {
  return (
    <div className={styles.projectNavigation}>
      {/* Nút Previous */}
      {prevProjectSlug ? (
        <Link href={`/projects/${prevProjectSlug}`} className={styles.navLink}>
          &larr; Previous Project
        </Link>
      ) : (
        // Hiển thị nút mờ đi nếu không có dự án trước đó
        <span className={`${styles.navLink} ${styles.disabled}`}>&larr; Previous Project</span>
      )}

      {/* Nút Next */}
      {nextProjectSlug ? (
        <Link href={`/projects/${nextProjectSlug}`} className={styles.navLink}>
          Next Project &rarr;
        </Link>
      ) : (
        // Hiển thị nút mờ đi nếu không có dự án tiếp theo
        <span className={`${styles.navLink} ${styles.disabled}`}>Next Project &rarr;</span>
      )}
    </div>
  );
};

export default ProjectNavigation;