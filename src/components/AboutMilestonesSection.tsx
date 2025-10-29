// src/components/AboutMilestonesSection.tsx
'use client';

import Image from 'next/image';
import {
  SliderBtnGroup,
  ProgressSlider,
  SliderBtn,
  SliderContent,
  SliderWrapper,
} from '@/components/progressive-carousel'; // Đảm bảo đường dẫn này chính xác
import carousel_01_2020 from '../assets/about/carousel_01_2020.jpg';
import carousel_02_2022 from '../assets/about/carousel_02_2022.jpg';
import carousel_03_2024 from '../assets/about/carousel_03_2024.jpg';
import carousel_04_2025 from '../assets/about/carousel_04_2025.jpg';    
import Container from '@/components/Container';


// 1. DỮ LIỆU CÁC CỘT MỐC
// Chúng ta sẽ thay thế dữ liệu mẫu bằng nội dung câu chuyện của Oni Studio
const items = [
  {
    // Sử dụng đường dẫn ảnh từ thư mục /public
    img: carousel_01_2020,
    year: '2020',
    title: 'Phác Thảo Giấc Mơ',
    desc: 'Năm 2020, ý tưởng về Oni Studio được phác thảo, mang theo giấc mơ về một không gian sáng tạo kết hợp giữa studio và café.',
    sliderName: 'milestone-2020', // Tên định danh duy nhất
  },
  {
    img: carousel_02_2022,
    year: '2022',
    title: 'Không Gian Đầu Tiên',
    desc: 'Studio vật lý đầu tiên ra đời. Một không gian tối giản, tinh khôi, tập trung vào việc khai thác vẻ đẹp của ánh sáng tự nhiên.',
    sliderName: 'milestone-2022',
  },
  {
    img: carousel_03_2024,
    year: '2024',
    title: 'Nâng Cấp Toàn Diện',
    desc: 'Studio được mở rộng và trang bị chuyên nghiệp. Từ ánh sáng, phông nền đến thiết bị, tất cả sẵn sàng cho các dự án lớn và dịch vụ cho thuê.',
    sliderName: 'milestone-2024',
  },
  {
    img: carousel_04_2025,
    year: '2025',
    title: 'Định Hình Dịch Vụ',
    desc: 'Oni Studio khẳng định vị thế với dịch vụ cho thuê studio và thiết bị chuyên nghiệp, trở thành một địa chỉ tin cậy cho cộng đồng sáng tạo.',
    sliderName: 'milestone-2025',
  },
];

export default function AboutMilestonesSection() {
  return (
    // Bọc trong 1 <section> để dễ quản lý
    <section id="milestones" className="py-16 md:py-24">
    <Container>

 
        <div className="container mx-auto px-4 text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter">
            Hành Trình Của Oni
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
            Từ ý tưởng đến một studio chuyên nghiệp.
            </p>
        </div>

        {/* 2. ÁP DỤNG COMPONENT CAROUSEL */}
        {/* Đặt activeSlider mặc định là cột mốc đầu tiên */}
        <ProgressSlider vertical={false} activeSlider="milestone-2020">
            
            {/* PHẦN HIỂN THỊ HÌNH ẢNH */}
            <SliderContent>
            {items.map((item, index) => (
                <SliderWrapper key={index} value={item.sliderName}>
                <Image
                    // Đặt chiều cao cố định và object-cover để ảnh đồng đều
                    className="rounded-xl h-[400px] md:h-[700px] w-full object-cover"
                    src={item.img}
                    width={1920} // Giữ chiều rộng lớn
                    height={1080} // Giữ chiều cao lớn
                    alt={item.title} // Dùng title cho alt text
                    priority={index === 0} // Ưu tiên tải ảnh đầu tiên
                />
                </SliderWrapper>
            ))}
            </SliderContent>

            {/* PHẦN HIỂN THỊ NỘI DUNG (NÚT BẤM) */}
            {/* Tùy chỉnh styling từ code mẫu cho phù hợp */}
            <SliderBtnGroup className="relative md:absolute bottom-0 h-fit dark:text-white text-black dark:bg-black/40 bg-white/40 backdrop-blur-md overflow-hidden grid grid-cols-2 md:grid-cols-4 rounded-md mt-4 md:mt-0">
            {items.map((item, index) => (
                <SliderBtn
                key={index}
                value={item.sliderName}
                className="text-left p-4 md:p-6 border-r border-white/20"
                progressBarClass="dark:bg-gray-900 bg-black h-full" // Đổi màu thanh progress
                >
                {/* Sử dụng 'year' cho thẻ badge */}
                <h3 className="relative px-4 py-1 rounded-full w-fit dark:bg-white dark:text-black text-white bg-gray-900 mb-3 text-sm font-semibold">
                    {item.year}
                </h3>
                {/* Sử dụng 'title' cho tiêu đề chính */}
                <h2 className="text-lg md:text-xl font-semibold mb-1">
                    {item.title}
                </h2>
                {/* Sử dụng 'desc' cho mô tả */}
                <p className="text-sm font-medium line-clamp-3 md:line-clamp-2">
                    {item.desc}
                </p>
                </SliderBtn>
            ))}
            </SliderBtnGroup>
        </ProgressSlider>
    </Container>
  </section>
);
}