// src/components/ContactSection.tsx
'use client'; // Bắt buộc vì dùng hook (useState)

import React, { useState } from 'react';
import Container from '@/components/Container';
import BrandScroller from "@/components/BrandScroller";

export default function ContactSection() {
  const email = 'hello@onistudio.com';
  const [copyText, setCopyText] = useState(email);
  const noiseOpacity = 0.05; // Điều chỉnh độ đậm/nhạt của noise

  // Hàm xử lý copy email (giữ nguyên)
  const handleCopy = () => {
    navigator.clipboard.writeText(email).then(
      () => {
        setCopyText('Đã sao chép!');
        setTimeout(() => {
          setCopyText(email);
        }, 2000);
      },
      (err) => {
        console.error('Không thể sao chép: ', err);
        setCopyText('Lỗi khi sao chép');
      }
    );
  };

  return (
<section
      id="contact"
      className="relative pt-12 pb-6 overflow-hidden 
                 bg-linear-to-b dark:to-gray-950 dark:from-gray-950 to-[#dadada] from-[#ebebeb] 
                 dark:text-white text-black" 
      style={{ minHeight: 0, fontSize: 'initial' }}
    >
      {/* 2. LỚP NỀN (GRID + MASK) */}
      <div
        className="absolute bottom-0 left-0 right-0 top-0 z-0
                   bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] 
                   bg-size-[35px_34px] 
                   mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      ></div>

      {/* 3. LỚP NỀN (NOISE) */}
      <div
        className="absolute top-0 left-0 w-full h-full content-[''] z-10 
                   pointer-events-none 
                   bg-[url('https://www.ui-layouts.com/noise.gif')]"
        style={{ opacity: noiseOpacity }}
      ></div>

      {/* 4. NỘI DUNG (đặt z-index cao hơn) */}
      <Container className="relative z-20 mt-16 mb-12 lg:mt-24 lg:mb-14">
        <div className="relative md:border-l-1 border-black dark:border-white">
       {/* 1. THAY ĐỔI: TIÊU ĐỀ DỌC (Chỉ hiện từ 'md' trở lên) */}
          <div className="hidden md:flex absolute top-0 -left-16 md:-left-24 w-16 md:w-24 h-full items-center justify-center pointer-events-none">
            <h2
              className="transform -rotate-90 whitespace-nowrap text-4xl md:text-5xl 
                         font-light tracking-widest uppercase 
                         text-black/20 dark:text-white/20"
            >
              Liên Hệ
            </h2>
          </div>

          {/* 2. THÊM MỚI: TIÊU ĐỀ NGANG (Chỉ hiện trên di động) */}
          <div className="md:hidden text-center mb-12">
            <h2 className="text-4xl font-light tracking-tighter">
              Liên Hệ
            </h2>
          </div>

          {/* 3. THAY ĐỔI: NỘI DUNG CHÍNH (Bỏ padding trái trên di động) */}
          <div className="pl-0 md:pl-16 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 max-w-4xl mx-auto">
            
            {/* CỘT 1: FORM */}
            <div>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Nếu bạn thích điền form:
              </p>
              {/* ... (phần form giữ nguyên) ... */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Chức năng gửi form đang được phát triển!');
                }}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email của bạn
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="block w-full p-3 bg-transparent 
                               border border-black/30 dark:border-white/30
                               focus:ring-0 focus:border-black dark:focus:border-white
                               transition-colors"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1"
                  >
                    Lời nhắn
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="block w-full p-3 bg-transparent 
                               border border-black/30 dark:border-white/30
                               focus:ring-0 focus:border-black dark:focus:border-white
                               transition-colors"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="py-3 px-8 bg-transparent 
                               border border-black dark:border-white 
                               text-black dark:text-white 
                               hover:bg-black hover:text-[#ebebeb] 
                               dark:hover:bg-white dark:hover:text-gray-950
                               transition-colors duration-300"
                  >
                    Gửi Lời Nhắn
                  </button>
                </div>
              </form>
            </div>

            {/* CỘT 2: EMAIL COPY */}
            <div>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Hoặc nhấn để sao chép email:
              </p>
              {/* ... (phần nút copy giữ nguyên) ... */}
              <button
                onClick={handleCopy}
                className="w-full text-left p-4 bg-transparent 
                           border border-black/30 dark:border-white/30
                           text-lg md:text-xl font-mono 
                           hover:border-black dark:hover:border-white
                           transition-all duration-300"
              >
                {copyText}
              </button>
            </div>
          </div>
        </div>
      </Container>
  {/* 4. Đặt BrandScroller VÀO ĐÂY (Sau Container, trong Section) */}
      {/* Phải có relative z-20 để nổi lên trên nền */}
      <div className="relative z-20 mt-10 md:mt-4">
        <BrandScroller />
      </div>
    </section>
   


  );
}