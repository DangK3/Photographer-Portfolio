// app/thuong-mai/page.tsx
import type { Metadata } from 'next';
import Container from '@/components/Container';
import PortfolioGrid from '@/components/PortfolioGrid'; 

import { allProjects } from '@/data/projects-master-data';


export const metadata: Metadata = {
  title: 'Dự án Thương Mại | Oni Studio',
  description: 'Các dự án nhiếp ảnh thương mại, sản phẩm và quảng cáo.',
};

export default function ThuongMaiPage() {
  // *** THAY ĐỔI 3: Lọc (filter) theo category ***
  const commercialGridData = allProjects.filter(
    (project) => project.category === 'Thương mại'
  );

  return (
    <Container className="py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter">
          Thương Mại
        </h1>
        <p className="text-lg mt-4 text-[var(--glow-color)]">
          Dự án quảng cáo, sản phẩm và sự kiện cho thương hiệu.
        </p>
      </div>
      
      {/* Truyền data vào Grid. Grid này được hardcode 4 cột */}
      <PortfolioGrid projects={commercialGridData} />
    </Container>
  );
}