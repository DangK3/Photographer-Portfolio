// src/components/HeroSection.tsx

'use client'; // 1. Bắt buộc để sử dụng thư viện animation

import Image from 'next/image';
import Container from './Container';
import Background from '../assets/section_01/hero-background.jpg';
import { TypeAnimation } from 'react-type-animation'; // 2. Import thư viện

export default function HeroSection() {
  return (
    <section
      id="welcome"
      className="relative h-screen flex items-center justify-center overflow-hidden text-white"
    >
      {/* Lớp chứa hình ảnh nền */}
      <div className="absolute inset-0 z-0">
        <Image
          src={Background}
          alt="Ảnh nền nghệ thuật của nhiếp ảnh gia"
          layout="fill"
          objectFit="cover"
          quality={90}
          priority
          className="ken-burns-effect"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      {/* Dải màu vàng trong suốt (ĐÃ THÊM MỚI) */}
      {/* <div
        className="absolute inset-0 z-10" // Đảm bảo nằm trên ảnh nền nhưng dưới slogan
      >
      <div
        className="absolute top-0 right-0 w-full h-full transform -rotate-30
                    bg-yellow-400 opacity-20
                    origin-top-right" // Tạo dải chéo từ trên phải xuống dưới trái
      ></div>
      </div> */}
      {/* Lớp chứa nội dung văn bản */}
      <Container className="relative z-10 text-center">
        {/* 3. Thay thế <h1> cũ bằng TypeAnimation */}
        <TypeAnimation
          // 'sequence' là mảng chứa các hành động
          // [Slogan 1, Dừng 2 giây, Slogan 2, Dừng 2 giây, Slogan 3, Dừng...]
          sequence={[
            'Chạm vào vẻ đẹp qua lăng kính ánh sáng.', // Slogan 1
            2000, // Dừng 2 giây
            'Uy tín trọn từng khoảnh khắc.', // Slogan 2 (thay thế Slogan 1)
            2000, // Dừng 2 giây
            'Bảo chứng khoảnh khắc bằng uy tín.', // Slogan 3
            2000, // Dừng 2 giây
          ]}
          wrapper="h1" // 4. Bắt buộc: Giữ thẻ <h1> để đảm bảo SEO
          cursor={true} // Có hiển thị con trỏ gõ chữ
          repeat={Infinity} // Lặp lại vô hạn
          // 5. Sao chép toàn bộ class của <h1> cũ,
          //    NHƯNG XÓA 'animate-fade-in-up'
          className="text-4xl md:text-6xl font-light tracking-tighter text-shadow-md text-gray-200"
        />

        {/* --- (PHƯƠNG ÁN THAY THẾ) ---
            Nếu bạn chỉ muốn 1 slogan lặp lại (gõ ra rồi xóa đi)
            Hãy dùng đoạn code bên dưới và xóa đoạn TypeAnimation ở trên */}

        {/* <TypeAnimation
          sequence={[
            'Uy tín trọn từng khoảnh khắc.',
            4000, // Dừng 4 giây
            '',     // Xóa đi
            1000, // Dừng 1 giây (trước khi gõ lại)
          ]}
          wrapper="h1"
          cursor={true}
          repeat={Infinity}
          className="text-4xl md:text-6xl font-light tracking-tighter text-shadow-md text-gray-200"
        /> */}
       
      </Container>

      {/* Chỉ báo cuộn xuống (Giữ nguyên) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-white/80"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
    </section>
  );
}