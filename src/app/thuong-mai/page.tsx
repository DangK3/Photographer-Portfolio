// app/thuong-mai/page.tsx
import type { Metadata } from 'next';
import Container from '@/components/Container';
import PortfolioGrid from '@/components/PortfolioGrid'; 
import { GridProject } from '@/types/grid-project';

// Import ảnh thumbnail (ví dụ)
import imgCom01 from '@/assets/section_04/bts_03.jpg'; // Harley
import imgCom02 from '@/assets/section_04/bts_05.jpg'; // Uniqlo
import imgCom03 from '@/assets/section_04/bts_06.jpg'; // Cỏ Mềm
import imgCom04 from '@/assets/section_02/Portfolio_02.png'; // Zara Lookbook

export const metadata: Metadata = {
  title: 'Dự án Thương Mại | Oni Studio',
  description: 'Các dự án nhiếp ảnh thương mại, sản phẩm và quảng cáo.',
};

// Data cho Grid Sạch (Tất cả item đều là 1x1)
const commercialGridData: GridProject[] = [
  {
    id: 'comm1', src: imgCom01, title: 'Harley-Davidson', category: 'Commercial',
    colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1',
    slug: 'chien-binh-co-khi', 
  },
  {
    id: 'comm2', src: imgCom02, title: 'Uniqlo E-commerce', category: 'Commercial',
    colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1',
    slug: 'ky-thuat-ghost-mannequin',
  },
  {
    id: 'comm3', src: imgCom03, title: 'Cỏ Mềm HomeLab', category: 'Commercial',
    colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1',
    slug: 've-dep-tinh-khiet',
  },
  {
    id: 'comm4', src: imgCom04, title: 'Zara Lookbook', category: 'Commercial',
    colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1',
    slug: 'chuyen-dong-toi-gian',
  },
  // ... Thêm 4 ảnh nữa (đều là 1x1) để lấp đầy 2 hàng
];

export default function ThuongMaiPage() {
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