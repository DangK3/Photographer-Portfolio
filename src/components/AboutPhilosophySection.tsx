// src/components/AboutPhilosophySection.tsx

import Image from 'next/image';
import Container from '@/components/Container';

// 1. IMPORT component mới
import ScrollBaseAnimation from '@/components/scroll-text-marque';

// GIẢ ĐỊNH: Import ảnh chân dung của bạn
import ProfileImage from '../assets/about/avatar.jpg'; 


export default function AboutPhilosophySection() {

  return (
    <section
      id="philosophy"
      className="relative py-24 md:py-32 overflow-hidden bg-gray-100 dark:bg-gray-900"
    >
      {/* LỚP 1: NỀN (HIỆU ỨNG SCROLL TEXT) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center 
                      opacity-10 dark:opacity-5 
                      pointer-events-none gap-4 md:gap-8">
        
        {/* 2. SỬ DỤNG COMPONENT MỚI */}
        {/*
          baseVelocity={-3} -> Chạy sang trái (chậm)
          baseVelocity={3} -> Chạy sang phải (chậm)
          Lưu ý: Tôi đã sửa 'clasname' thành 'className'
        */}
        <ScrollBaseAnimation
          baseVelocity={-3}
          className="text-6xl font-bold uppercase whitespace-nowrap"
        >
          THƯƠNG MẠI • THỜI TRANG • CÁ NHÂN •
        </ScrollBaseAnimation>
        
        <ScrollBaseAnimation
          baseVelocity={3}
          className="text-9xl font-bold uppercase whitespace-nowrap text-center"
        >
          KHOẢNH KHẮC • SÁNG TẠO • ONI STUDIO •
        </ScrollBaseAnimation>
        
        <ScrollBaseAnimation
          baseVelocity={-2}
          className="text-6xl font-bold uppercase whitespace-nowrap"
        >
          LOOKBOOK • PORTRAIT • PHOTOGRAPHY •
        </ScrollBaseAnimation>

      </div>


      {/* LỚP 2: NỘI DUNG (ẢNH & TRIẾT LÝ) */}
      <Container className="relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-center">
          
          {/* CỘT TRÁI (Ảnh) */}
          <div className="md:col-span-2">
            <Image
              src={ProfileImage} 
              alt="Chân dung Oni, nhiếp ảnh gia Oni Studio"
              width={600}
              height={800}
              className="rounded-lg object-cover aspect-[3/4] shadow-lg"
              placeholder="blur"
            />
          </div>

          {/* CỘT PHẢI (Text) */}
          <div className="md:col-span-3">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-6">
              Triết Lý Của Tôi
            </h2>
            <div className="text-lg md:text-xl space-y-6 text-gray-700 dark:text-gray-300">
              <p>
                Đối với tôi, nhiếp ảnh không phải là ghi lại, mà là kiến tạo. 
                Đó là khoảnh khắc mà ánh sáng, cảm xúc và câu chuyện giao thoa.
              </p>
              <p>
                Mỗi dự án, dù là thương mại hay cá nhân, đều là một hành trình 
                tìm kiếm vẻ đẹp tiềm ẩn, biến những ý tưởng trừu tượng thành 
                những khung hình sống động và chân thực nhất.
              </p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}