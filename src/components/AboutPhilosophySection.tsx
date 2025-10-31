'use client';// src/components/AboutPhilosophySection.tsx

import Image from 'next/image';
import Container from '@/components/Container';
import { motion } from 'framer-motion';
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
         <div className="md:col-span-2 flex justify-center items-center p-4">
            <motion.div
              /* 2. THAY ĐỔI: Xóa 'md:col-span-2' ra khỏi đây.
              */
             className="w-full max-w-sm md:max-w-none bg-black dark:bg-white/80 p-2 md:p-3 shadow-2xl rounded-2xl"
              // 3. THAY ĐỔI: Animation lơ lửng (giữ nguyên)
              animate={{
                translateY: [0, -10, 0], 
                rotate: [-2, 1.5, -2]      
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <Image
                src={ProfileImage} 
                alt="Chân dung Oni, nhiếp ảnh gia Oni Studio"
                width={600}
                height={800}
                className="rounded-xl object-cover aspect-[3/4]"
                placeholder="blur"
              />
            </motion.div>
          </div>
          {/* CỘT PHẢI (Text) */}
          <div className="md:col-span-3">
            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-6">
              Triết Lý Của Tôi
            </h2>
            <div className="text-lg md:text-xl space-y-6 text-gray-700 dark:text-gray-300">
            <p>
              Ánh sáng là nền tảng của công việc. Niềm say mê bất tận nằm ở việc khai thác 
              cách ánh sáng điêu khắc, làm nổi bật, và tôn vinh một chủ thể. 
              Đó vừa là công cụ, là ngôn ngữ, vừa là nguồn cảm hứng chính.
            </p>
            <p>
              Tôi tin rằng một bức ảnh thành công là sự giao thoa hài hòa giữa tầm nhìn nghệ thuật và kỹ thuật chính xác. 
              Từ dự án thương mại phức tạp đến một bức chân dung tối giản, mục tiêu luôn là 
              sự chỉn chu trong từng chi tiết, mang lại giá trị vượt trên cả mong đợi.
            </p>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}