// src/components/PortfolioSection.tsx

import Container from '@/components/Container';
import PortfolioGrid from '@/components/PortfolioGrid';
import { GridProject } from '@/types/grid-project';

// 1. Import ảnh trực tiếp
import img01 from '../assets/section_02/Portfolio_01.png'; // Giả sử bạn đặt ảnh ở đây
import img02 from '../assets/section_02//Portfolio_02.png';
import img03 from '../assets/section_02//Portfolio_03.png';
import img04 from '../assets/section_02//Portfolio_04.png';
import img05 from '../assets/section_02//Portfolio_05.png';
import img06 from '../assets/section_02//Portfolio_06.png';

const homePageGridData: GridProject[] = [
  {
    id: 1,
    src: img01, 
    title: 'Thanh xuân vườn trường',
    category: 'Fashion',
    colSpan: 'md:col-span-2', // Chiếm 2 cột trên desktop
    rowSpan: 'md:row-span-2', // Chiếm 2 hàng trên desktop
    slug: 'thanh-xuan-vuon-truong',
  },
  {
    id: 2,
    src: img02, 
    title: 'Chủ mô hình',
    category: 'Commercial',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    slug: 'chu-mo-hinh',
  },
  {
    id: 3,
    src: img03, 
    title: 'Cá nhân',
    category: 'Personal',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    slug: 'ca-nhan',
  },
  {
    id: 4,
    src: img04, 
    title: 'Vườn sao băng',
    category: 'Fashion',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    slug: 'vuon-sao-bang',
  },
  {
    id: 5,
    src: img06, 
    title: 'Mẫu',
    category: 'Commercial',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    slug: 'mau',
  },
  {
    id: 6,
    src: img05, 
    title: 'Cá nhân',
    category: 'Magazine',
    colSpan: 'md:col-span-2', // Chiếm 2 cột trên desktop
    rowSpan: 'md:row-span-1',
    slug: 'ca-nhan-magazine',
  },
    {
    id: 7,
    src: img01, 
    title: 'Vườn sao băng',
    category: 'Fashion',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    slug: 'vuon-sao-bang',
  },
  {
    id: 8,
    src: img02, 
    title: 'Chủ mô hình',
    category: 'Commercial',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    slug: 'chu-mo-hinh-2',
  }
  // ...Thêm các ảnh khác nếu muốn
];
export default function PortfolioSection() {
  return (
    <section
      id="portfolio"
      className="py-16 md:py-24 bg-[--background]" // Giữ nguyên - đã dùng biến
      style={{ minHeight: 0, fontSize: 'initial' }}
    >
      <Container>
        {/* Tiêu đề cho Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl text-[var(--foreground)] font-light tracking-tighter">
            Bộ Sưu Tập
          </h2>
          <p className="text-lg md:text-xl text-[var(--glow-color)] mt-2">
            Những dự án và khoảnh khắc chọn lọc.
          </p>
        </div>
        <PortfolioGrid projects={homePageGridData} />
      </Container>
    </section>
  );
}