//PortfolioGrid.tsx
'use client';

import Image, { StaticImageData } from 'next/image';
import { useState } from 'react'; 
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
// 1. Import ảnh trực tiếp
import img01 from '../assets/section_02/Portfolio_01.png'; // Giả sử bạn đặt ảnh ở đây
import img02 from '../assets/section_02//Portfolio_02.png';
import img03 from '../assets/section_02//Portfolio_03.png';
import img04 from '../assets/section_02//Portfolio_04.png';
import img05 from '../assets/section_02//Portfolio_05.png';
import img06 from '../assets/section_02//Portfolio_06.png';
/* 1. DỮ LIỆU MẪU (MOCK DATA)
  - Bạn sẽ thay thế đường dẫn 'src' bằng ảnh thật của mình.
  - colSpan/rowSpan: Dùng class Tailwind để điều khiển bố cục.
    'col-span-1' / 'row-span-1': Ô tiêu chuẩn 1x1.
    'col-span-2' / 'row-span-2': Ô lớn chiếm 2 cột / 2 hàng.
*/
interface PortfolioItem {
  id: number;
  src: StaticImageData; // Sử dụng type từ 'next/image'
  title: string;
  category: string;
  colSpan: string;
  rowSpan: string;
}
const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    src: img01, 
    title: 'Thanh xuân vườn trường',
    category: 'Fashion',
    colSpan: 'md:col-span-2', // Chiếm 2 cột trên desktop
    rowSpan: 'md:row-span-2', // Chiếm 2 hàng trên desktop
  },
  {
    id: 2,
    src: img02, 
    title: 'Chủ mô hình',
    category: 'Commercial',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 3,
    src: img03, 
    title: 'Cá nhân',
    category: 'Personal',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 4,
    src: img04, 
    title: 'Vườn sao băng',
    category: 'Fashion',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 5,
    src: img06, 
    title: 'Mẫu',
    category: 'Commercial',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 6,
    src: img05, 
    title: 'Cá nhân',
    category: 'Magazine',
    colSpan: 'md:col-span-2', // Chiếm 2 cột trên desktop
    rowSpan: 'md:row-span-1',
  },
    {
    id: 7,
    src: img01, 
    title: 'Vườn sao băng',
    category: 'Fashion',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 8,
    src: img02, 
    title: 'Chủ mô hình',
    category: 'Commercial',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
  }
  // ...Thêm các ảnh khác nếu muốn
];
interface GridItemProps {
  item: PortfolioItem;
  onClick: () => void;
}
// 2. Component Con (Grid Item)
// Tạo component con để giữ code sạch sẽ
function GridItem({ item, onClick }: GridItemProps) {
  return (
    <div
      className={`
        relative group cursor-pointer overflow-hidden rounded-lg 
        h-80 md:h-auto ${item.colSpan} ${item.rowSpan}
      `}
      // h-80: Đặt chiều cao cố định trên mobile (khi chỉ có 1 cột)
      onClick={onClick}
    >
      <Image
        src={item.src}
        alt={item.title}
        layout="fill"
        objectFit="cover"
        quality={85}
        className="transition-transform duration-500 ease-in-out group-hover:scale-105" // Zoom nhẹ khi hover
      />

      {/* Lớp phủ gradient nhẹ từ dưới lên (để chữ dễ đọc) */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
          transition-opacity duration-300
          opacity-100 md:opacity-0 md:group-hover:opacity-100
        `}
      />
      {/* Đường viền mỏng bên trong khi hover */}
      {/* <div className="absolute inset-3 md:inset-4 rounded-2xl rounded-md */}
      {/* border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      <div
        className={`
          absolute inset-3 md:inset-4 border border-white/30 
          transition-opacity duration-300 rounded-md
          opacity-100 md:opacity-0 md:group-hover:opacity-100
        `} // 5. THAY ĐỔI: Logic hiển thị (luôn hiện trên mobile, chỉ hiện khi hover trên desktop)
      />
      <div
        className={`
          absolute bottom-4 left-4 md:bottom-6 md:left-6 
          text-white 
          transition-all duration-300 z-10
          opacity-100 translate-y-0 
          md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0
        `} // 6. THAY ĐỔI: Logic hiển thị (luôn hiện trên mobile, chỉ hiện khi hover trên desktop)
      >
        <span className="text-xs md:text-sm uppercase tracking-widest opacity-80">
          {item.category}
        </span>
        <h3 className="text-base md:text-xl font-light flex items-center mt-1">
          {item.title}
          {/* Icon mũi tên ↗ */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 md:w-5 md:h-5 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </h3>
      </div>
    </div>
  );
}


// 3. Component Lưới Chính (Main Grid)
// export default function PortfolioGrid() {
//   return (
//     <div
//       className="
//         grid grid-cols-1 
//         md:grid-cols-4 
//         md:auto-rows-[350px] 
//         gap-4 md:gap-6
//       "
//       // grid-cols-1: 1 cột trên mobile
//       // md:grid-cols-4: 4 cột trên desktop
//       // md:auto-rows-[350px]: Đặt chiều cao cơ sở cho mỗi hàng là 350px trên desktop
//       // gap-4 md:gap-6: Khoảng cách giữa các ảnh
//     >
//       {portfolioItems.map((item) => (
//         <GridItem key={item.id} item={item} />
//       ))}
//     </div>
//   );
// }
export default function PortfolioGrid() {
  // 6. Thêm State để lưu ID của item đang active
  const [index, setIndex] = useState(-1);
  const slides = portfolioItems.map((item) => ({
    src: item.src.src,
    title: item.title,
    description: item.category,
  }));

  return (
    <>
      {/* 7. Thêm onClick vào wrapper để xử lý "chạm ra ngoài" */}
    <div
      className="
        grid grid-cols-2 
        md:grid-cols-4 
        md:auto-rows-[350px] 
        gap-2 md:gap-4
      "
    >
      {portfolioItems.map((item, i) => (
        <GridItem
          key={item.id}
          item={item}
         onClick={() => setIndex(i)}// 9. Truyền hàm xử lý click
        />
      ))}
    </div>
    <Lightbox
        // Mở khi index >= 0
        open={index > -1}
        // Đóng bằng cách set index về -1
        close={() => setIndex(-1)}
        // Hiển thị slide tương ứng với index
        index={index}
        // Nguồn dữ liệu
        slides={slides}
        // Kích hoạt các plugin
        plugins={[Captions, Thumbnails]}
        // Tùy chỉnh (nếu muốn)
        captions={{
          showToggle: true,
          descriptionTextAlign: 'center',
        }}
        thumbnails={{
          position: 'bottom',
        }}
      />
    </>
  );
}