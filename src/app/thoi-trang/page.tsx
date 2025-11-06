// app/thoi-trang/page.tsx
import type { Metadata } from 'next';
import Container from '@/components/Container';
import PortfolioGrid from '@/components/PortfolioGrid'; 
import { GridProject } from '@/types/grid-project';

// Import ảnh thumbnail (ví dụ)
import imgFas01 from '@/assets/section_04/bts_01.jpg'; // Vệ Nữ
import imgFas02 from '@/assets/section_02/Portfolio_01.png'; // Thanh xuân
import imgFas03 from '@/assets/section_02/Portfolio_06.png'; // Dior
import imgFas04 from '@/assets/section_02/Portfolio_05.png'; // L'Officiel

export const metadata: Metadata = {
  title: 'Dự án Thời Trang | Oni Studio',
  description: 'Các dự án editorial, lookbook và nhiếp ảnh thời trang.',
};

// Data cho Grid Tạp chí (Layout không đồng đều)
// Giống hệt data của PortfolioSection
const fashionGridData: GridProject[] = [
  {
    id: 'fas1', src: imgFas01, title: 'Vệ Nữ Thức Tỉnh', category: 'Fashion',
    colSpan: 'md:col-span-2', rowSpan: 'md:row-span-2', // Ô 2x2
    slug: 'su-thuc-tinh-cua-ve-nu', //
  },
  {
    id: 'fas2', src: imgFas02, title: 'Thanh xuân', category: 'Fashion',
    colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1', // Ô 1x1
    slug: 'thanh-xuan-vuon-truong', //
  },
  {
    id: 'fas3', src: imgFas03, title: 'Dior Playful', category: 'Fashion',
    colSpan: 'md:col-span-1', rowSpan: 'md:row-span-1', // Ô 1x1
    slug: 'khoanh-khac-playful-dior', //
  },
   {
    id: 'fas4', src: imgFas04, title: 'Hơi thở Golden Hour', category: 'Fashion',
    colSpan: 'md:col-span-2', rowSpan: 'md:row-span-1', // Ô 2x1
    slug: 'hoi-tho-golden-hour', //
  },
];

export default function ThoiTrangPage() {
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
      
      {/* Truyền data (layout masonry) vào Grid 4 cột */}
      <PortfolioGrid projects={fashionGridData} />
    </Container>
  );
}