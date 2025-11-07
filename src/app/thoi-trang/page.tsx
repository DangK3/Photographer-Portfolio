// app/thoi-trang/page.tsx
import type { Metadata } from 'next';
import Container from '@/components/Container';
import PortfolioGrid from '@/components/PortfolioGrid'; 

import { allProjects } from '@/data/projects-master-data';


export const metadata: Metadata = {
  title: 'Dự án Thời Trang | Oni Studio',
  description: 'Các dự án editorial, lookbook và nhiếp ảnh thời trang.',
};

export default function ThoiTrangPage() {
  
  // *** THAY ĐỔI 3: Lọc (filter) theo category ***
  const fashionGridData = allProjects.filter(
    (project) => project.category === 'Thời trang'
  );

  return (
    <Container className="py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter">
          Thời Trang
        </h1>
        <p className="text-lg mt-4 text-[var(--glow-color)]">
          Editorial, lookbook và các chiến dịch thời trang.
        </p>
      </div>
      
      {/* Truyền dữ liệu đã lọc vào Grid */}
      <PortfolioGrid projects={fashionGridData} />
    </Container>
  );
}