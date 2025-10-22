//PortfolioGrid.tsx
'use client';

import Image, { StaticImageData } from 'next/image';
import { useState } from 'react'; 
// 1. Import ảnh trực tiếp
import img01 from '@/assets/portfolio/Portfolio_01.png'; // Giả sử bạn đặt ảnh ở đây
import img02 from '@/assets/portfolio/Portfolio_02.png';
import img03 from '@/assets/portfolio/Portfolio_03.png';
import img04 from '@/assets/portfolio/Portfolio_04.png';
import img05 from '@/assets/portfolio/Portfolio_05.png';
import img06 from '@/assets/portfolio/Portfolio_06.png';
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
  isActive: boolean;
  onItemClick: (id: number) => void;
}
// 2. Component Con (Grid Item)
// Tạo component con để giữ code sạch sẽ
function GridItem({ item, isActive, onItemClick }: GridItemProps) {
  return (
    <div
      className={`
        relative group cursor-pointer overflow-hidden rounded-lg 
        h-80 md:h-auto ${item.colSpan} ${item.rowSpan}
      `}
      // h-80: Đặt chiều cao cố định trên mobile (khi chỉ có 1 cột)
      onClick={(e) => {
        e.stopPropagation(); // Ngăn sự kiện "chạm" lan ra ngoài
        onItemClick(item.id);
      }}
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
                  ${
                    isActive
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }
                `}
      />
      {/* Đường viền mỏng bên trong khi hover */}
      {/* <div className="absolute inset-3 md:inset-4 rounded-2xl rounded-md */}
      {/* border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
      <div
        className={`
          absolute inset-3 md:inset-4 border border-white/50 
          transition-opacity duration-300 rounded-md
          ${
            isActive
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100'
          }
        `}
      />
      {/* Nội dung text khi hover (đáp ứng đúng yêu cầu của bạn) */}
      {/* <div
        className="
          absolute bottom-4 left-4 md:bottom-6 md:left-6 
          text-white 
          opacity-0 translate-y-3 
          group-hover:opacity-100 group-hover:translate-y-0 
          transition-all duration-300 z-10
        "
      > */}
      <div
        className={`
          absolute bottom-4 left-4 md:bottom-6 md:left-6 
          text-white 
          transition-all duration-300 z-10
          ${
            isActive
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0'
          }
        `} // 5. SỬA LOGIC HIỂN THỊ
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
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleItemClick = (id: number) => {
    // Nếu click vào item đang active, hãy đóng nó lại
    // Nếu click vào item mới, hãy mở nó ra
    setActiveId(activeId === id ? null : id);
  };

  return (
    // 7. Thêm onClick vào wrapper để xử lý "chạm ra ngoài"
    <div
      className="
        grid grid-cols-2 
        md:grid-cols-4 
        md:auto-rows-[350px] 
        gap-2 md:gap-4
      "
      onClick={() => setActiveId(null)} // Click ra ngoài grid sẽ đóng (reset)
    >
      {portfolioItems.map((item) => (
        <GridItem
          key={item.id}
          item={item}
          isActive={item.id === activeId} // 8. Truyền trạng thái active
          onItemClick={handleItemClick} // 9. Truyền hàm xử lý click
        />
      ))}
    </div>
  );
}