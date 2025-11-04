// src/components/Header.tsx
'use client'; 

import { useState, useEffect } from 'react'; 
import Container from "./Container";
import localFont from 'next/font/local'; 
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

const logoFont = localFont({
  src: '../fonts/cameliya-regular.ttf',
  display: 'swap',
  variable: '--font-logo',
});

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]); 

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };
  
  return (
   <header
      className={`border-b py-4 relative z-50 
                 animate-fade-in-up backdrop-blur-2xl bg-[var(--background)] 
                 border-[var(--foreground)]`} 
    >
      <Container>
        <div className="flex items-center justify-between">
          <h1
            className={`text-xl font-semibold tracking-widest cursor-pointer ${logoFont.className}`}
          >
            <Link href="/" className="menu-link-glow">
              Oni Studio
            </Link>
          </h1>

          <nav className="hidden md:flex items-center space-x-6 text-md">
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
            <ThemeToggle />
          </nav>

          {/* SỬA 2: Gộp ThemeToggle và Nút Hamburger vào chung 1 div */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            
            <button
              className="" // Đã xóa md:hidden vì div cha đã xử lý
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? (
                // Icon 'X'
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
                // Icon 'Hamburger'
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
        </div>
      </Container>

      {/* Menu di động (Giữ nguyên) */}
      <div
        className={`fixed left-0 right-0 top-full h-screen bg-gray-900/75 backdrop-blur-lg border-b shadow-lg md:hidden transition-all duration-300 ease-in-out ${
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