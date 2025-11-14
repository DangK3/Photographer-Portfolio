// src/components/ProjectNavigation.tsx
import React from 'react';
import Link from 'next/link';
import styles from '../app/styles/ProjectArticle.module.css';

interface ProjectNavigationProps {
  prevProjectLink: string | null; // <-- ĐỔI TÊN
  nextProjectLink: string | null; // <-- ĐỔI TÊN
}

const ProjectNavigation: React.FC<ProjectNavigationProps> = ({
  prevProjectLink,
  nextProjectLink,
}) => {
  return (
    <div className={styles.projectNavigation}>
      {/* Nút Previous */}
      {prevProjectLink ? (
        // Trường hợp 1: Có dự án trước -> Dùng link đã build
        <Link href={prevProjectLink} className={styles.navLink}>
          &larr; Dự án trước
        </Link>
      ) : (
        // Trường hợp 2: Đã ở đầu -> Link về Trang chủ
        <Link href="/" className={styles.navLink} title="Về trang chủ">
          &larr; Trang chủ
        </Link>
      )}

      {/* Nút Next */}
      {nextProjectLink ? (
        // Trường hợp 1: Có dự án tiếp theo -> Dùng link đã build
        <Link href={nextProjectLink} className={styles.navLink}>
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