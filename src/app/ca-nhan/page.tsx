// app/ca-nhan/page.tsx
import type { Metadata } from 'next';
import Container from '@/components/Container';
import PortfolioGrid from '@/components/PortfolioGrid'; 
import { GridProject } from '@/types/grid-project';

// Import ảnh thumbnail (ví dụ)
import imgPer01 from '@/assets/section_02/Portfolio_03.png';
import imgPer02 from '@/assets/section_02/Portfolio_04.png';
import imgPer03 from '@/assets/section_02/Portfolio_05.png';
import imgPer04 from '@/assets/section_02/Portfolio_01.png';

export const metadata: Metadata = {
  title: 'Dự án Cá Nhân | Oni Studio',
  description: 'Những dự án thể hiện cái tôi cá nhân và thử nghiệm sáng tạo.',
};

// Data cho Grid Sạch (Tất cả item đều là 1x1)
const personalGridData: GridProject[] = [
  {
    id: 'per1', src: imgPer01, title: 'Dự án 1', category: 'Personal',
    colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1',
    slug: 'du-an-ca-nhan-1',
  },
  {
    id: 'per2', src: imgPer02, title: 'Ngọn lửa Tuyết', category: 'Personal',
    colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1',
    slug: 'ngon-lua-giua-tuyet', //
  },
  {
    id: 'per3', src: imgPer03, title: 'Hơi thở Golden Hour', category: 'Personal',
    colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1',
    slug: 'hoi-tho-golden-hour', //
  },
  {
    id: 'per4', src: imgPer04, title: 'Thanh xuân', category: 'Personal',
    colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1',
    slug: 'thanh-xuan-vuon-truong', //
  },
];

export default function CaNhanPage() {
  return (
    <Container className="py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter">
          Cá Nhân
        </h1>
        <p className="text-lg mt-4 text-[var(--glow-color)]">
          Những thử nghiệm, cảm hứng và các dự án cá nhân.
        </p>
      </div>
      
      {/* Truyền data (1x1) vào Grid 4 cột */}
      <PortfolioGrid projects={personalGridData} />
    </Container>
  );
}