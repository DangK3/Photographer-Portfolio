//ScrollToTopButton.tsx
'use client'; // Bắt buộc vì dùng hooks

import { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // 1. Hook để theo dõi vị trí cuộn
  useEffect(() => {
    const toggleVisibility = () => {
      // Hiển thị nút khi cuộn qua 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    // Dọn dẹp listener khi component bị hủy
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []); // Chỉ chạy 1 lần khi mount

  // 2. Hàm xử lý khi click
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Cuộn mượt
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-30 p-3
                 bg-black/70 text-white rounded-full
                 shadow-lg cursor-pointer
                 transition-all duration-300 ease-in-out
                 hover:bg-black border-3 border-transparent hover:border-white
                 ${
                   isVisible
                     ? 'opacity-100 translate-y-0'
                     : 'opacity-0 translate-y-4 pointer-events-none'
                 }
                `}
      aria-label="Cuộn lên đầu trang"
    >
      {/* Đây là SVG mũi tên lên */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
  );
}