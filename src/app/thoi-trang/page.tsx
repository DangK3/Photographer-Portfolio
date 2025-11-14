// src/app/thoi-trang/page.tsx
import Container from '@/components/Container';
import { allProjects } from '@/data/projects-master-data';
import ProjectGrid from '../../components/project-grid'; // Đảm bảo import project-grid
import type { Metadata } from 'next';
import { 
  IS_DEMO_MODE, 
  DESIRED_PROJECT_COUNT, 
  SLUG_CATE_FASHION 
} from '@/lib/constants';
import { seedProjectsByCategory } from '@/lib/seed-helpers';

export const metadata: Metadata = {
  title: 'Dự án Thời Trang | Oni Studio',
  description: 'Các dự án editorial, lookbook và nhiếp ảnh thời trang.',
};
function getFashionProjects() {
  // Lấy dự án thật trước
  const realProjects = allProjects.filter(
    (p) => p.cateSlug === SLUG_CATE_FASHION
  );

  // Nếu IS_DEMO_MODE = true, và chúng ta có dự án thật để làm mẫu...
  if (IS_DEMO_MODE && realProjects.length > 0) {
    // ...thì dùng hàm seed của bạn để nhân bản chúng
    return seedProjectsByCategory(
      realProjects, // Dùng mảng dự án thật làm "hạt giống"
      'Thời trang', // Tên category
      DESIRED_PROJECT_COUNT // Số lượng mong muốn
    );
  }

  // Nếu IS_DEMO_MODE = false, chỉ trả về dự án thật
  return realProjects;
}

export default function FashionPage() {
  const projectsToDisplay = getFashionProjects();

  return (
    <Container className="py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter">
          Thời Trang
        </h1>
        <p className="text-lg md:text-xl text-[var(--sub-text)] mt-4">
          Khám phá các dự án thời trang, lookbook và editorial.
        </p>
      </div>

      {projectsToDisplay.length > 0 ? (
        <ProjectGrid allProjects={projectsToDisplay} />
      ) : (
        <p className="text-center text-[var(--sub-text)]">
          Chưa có dự án nào trong mục này.
        </p>
      )}
    </Container>
  );
}