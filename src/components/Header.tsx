'use client'; // Bắt buộc để dùng useState

import { useState, useEffect } from 'react'; // Import hook
import Container from "./Container";
import localFont from 'next/font/local'; 
import Link from 'next/link';

// 2. Cấu hình và tải font tùy chỉnh
const logoFont = localFont({
  src: '../fonts/cameliya-regular.ttf',
  display: 'swap', // Chiến lược hiển thị font
  variable: '--font-logo', // Tạo một biến CSS tên là --font-logo
});

export default function Header() {
  // State để quản lý việc mở/đóng menu di động
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. Hook để khóa cuộn body khi menu mở
  useEffect(() => {
    if (isMenuOpen) {
      // Khi menu mở: Ẩn thanh cuộn và khóa cuộn của trang
      document.body.style.overflow = 'hidden';
    } else {
      // Khi menu đóng: Hiển thị lại thanh cuộn
      document.body.style.overflow = 'auto';
    }
    // Cleanup: Đảm bảo cuộn được trả lại khi component bị hủy
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]); // Hook này sẽ chạy lại mỗi khi state 'isMenuOpen' thay đổi
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };
  return (
    // Thêm 'relative' để menu di động có thể định vị 'absolute' so với header
   <header
      className={`border-b py-4 relative z-50 
                 animate-fade-in-up backdrop-blur-lg`} // <-- Thêm animation
      style={{ animationDelay: '0.1s' }} // <-- Xuất hiện sớm
    >
      <Container>
        <div className="flex items-center justify-between">
          <h1
            className={`text-xl font-semibold tracking-widest cursor-pointer ${logoFont.className}`}
          >
           {/* 3. THAY ĐỔI: Logo trỏ về trang chủ */}
            <Link href="/" className="menu-link-glow">
              Oni Studio
            </Link>
          </h1>

          {/* 4. THAY ĐỔI: Navigation cho Desktop (dùng <Link>) */}
          <nav className="hidden md:flex space-x-6 text-md">
            <Link href="/thuong-mai" className="menu-link-glow">
              Thương mại
            </Link>
            <Link href="/thoi-trang" className="menu-link-glow">
              Thời trang
            </Link>
            <Link href="/ca-nhan" className="menu-link-glow">
              Cá nhân
            </Link>
            <Link href="/dich-vu" className="menu-link-glow">
              Dịch Vụ
            </Link>
            <Link href="/gioi-thieu" className="menu-link-glow">
              Giới thiệu
            </Link>
          </nav>

          {/* 2. Nút Hamburger cho Di động (chỉ hiện trên di động) */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? (
              // Icon 'X' (Đóng)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Icon 'Hamburger' (Mở)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {/* 3. Menu thả xuống cho Di động */}
      <div
        className={`fixed ::web left-0 right-0 top-full h-screen bg-gray-900/75 backdrop-blur-lg border-b shadow-lg md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'block opacity-100' : 'hidden opacity-0'
        }`}
      >
       <nav className="flex flex-col ps-10 space-y-8 p-5 text-4xl font-bold text-white mt-5">
          <Link href="/thuong-mai" className="menu-link-glow" onClick={handleLinkClick}>
            Thương mại
          </Link>
          <Link href="/thoi-trang" className="menu-link-glow" onClick={handleLinkClick}>
            Thời trang
          </Link>
          <Link href="/ca-nhan" className="menu-link-glow" onClick={handleLinkClick}>
            Cá nhân
          </Link>
          <Link href="/dich-vu" className="menu-link-glow" onClick={handleLinkClick}>
            Dịch Vụ
          </Link>
          <Link href="/gioi-thieu" className="menu-link-glow" onClick={handleLinkClick}>
            Giới thiệu
          </Link>
        </nav>
      </div>
    </header>
  );
}