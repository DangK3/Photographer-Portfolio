// src/components/ProjectNavigation.tsx
import React from 'react';
import Link from 'next/link';
import styles from '../app/styles/ProjectArticle.module.css'; 

interface ProjectNavigationProps {
  prevProjectSlug: string | null;
  nextProjectSlug: string | null;
}

const ProjectNavigation: React.FC<ProjectNavigationProps> = ({ prevProjectSlug, nextProjectSlug }) => {
  return (
    <div className={styles.projectNavigation}>
      {/* Nút Previous */}
      {prevProjectSlug ? (
        // Trường hợp 1: Có dự án trước -> Link bình thường
        <Link href={`/du-an/${prevProjectSlug}`} className={styles.navLink}>
          &larr; Dự án trước
        </Link>
      ) : (
        // Trường hợp 2: Đã ở đầu -> Link về Trang chủ
        <Link href="/" className={styles.navLink} title="Về trang chủ">
          &larr; Trang chủ
        </Link>
      )}

      {/* Nút Next */}
      {nextProjectSlug ? (
        // Trường hợp 1: Có dự án tiếp theo -> Link bình thường
        <Link href={`/du-an/${nextProjectSlug}`} className={styles.navLink}>
          Dự án tiếp theo &rarr;
        </Link>
      ) : (
        // Trường hợp 2: Đã ở cuối -> Link về Trang chủ
        <Link href="/" className={styles.navLink} title="Về trang chủ">
          Trang chủ &rarr;
        </Link>
      )}
    </div>
  );
};

export default ProjectNavigation;