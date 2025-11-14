// app/thuong-mai/page.tsx
import type { Metadata } from 'next';
import Container from '@/components/Container';
import { allProjects } from '@/data/projects-master-data';
// Sửa import để khớp với kiểu dữ liệu mới trong seed-helpers
import ProjectGrid from '../../components/project-grid';
 import { 
  IS_DEMO_MODE, 
  DESIRED_PROJECT_COUNT, 
  SLUG_CATE_COMMERCIAL 
} from '@/lib/constants';
import { seedProjectsByCategory } from '@/lib/seed-helpers';

export const metadata: Metadata = {
  title: 'Dự án Thương Mại | Oni Studio',
  description: 'Các dự án nhiếp ảnh thương mại, sản phẩm và quảng cáo.',
};

function getCommercialProjects() {
  // Lấy dự án thật trước
  const realProjects = allProjects.filter(
    (p) => p.cateSlug === SLUG_CATE_COMMERCIAL
  );

  // Nếu IS_DEMO_MODE = true, và chúng ta có dự án thật để làm mẫu...
  if (IS_DEMO_MODE && realProjects.length > 0) {
    // ...thì dùng hàm seed của bạn để nhân bản chúng
    return seedProjectsByCategory(
      realProjects, // Dùng mảng dự án thật làm "hạt giống"
      'Thương mại', // Tên category
      DESIRED_PROJECT_COUNT // Số lượng mong muốn
    );
  }

  // Nếu IS_DEMO_MODE = false, chỉ trả về dự án thật
  return realProjects;
}

export default function ThuongMaiPage() {
  const projectsToDisplay = getCommercialProjects();

  return (
    <Container className="py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter text-[var(--foreground)]">
          Thương Mại
        </h1>
        <p className="text-lg mt-4 text-[var(--glow-color)]">
          Dự án quảng cáo, sản phẩm và sự kiện cho thương hiệu.
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