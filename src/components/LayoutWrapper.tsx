// src/components/LayoutWrapper.tsx
'use client'; 
import { useState, useEffect, useRef, ReactNode } from 'react';
import Header from '@/components/Header'; 
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  // State để quyết định có hiển thị header fixed hay không
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  // State để lưu chiều cao của header gốc
  const [headerHeight, setHeaderHeight] = useState(0);
  // Ref để tham chiếu đến header gốc và đo chiều cao
  const originalHeaderRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  // Kiểm tra xem trang hiện tại có phải là Admin không
  const isAdminPage = pathname?.startsWith('/admin');
  const isAdminLoginPage = pathname === '/login';

  // 1. Đo chiều cao của header gốc sau khi component mount
  useEffect(() => {
    if (originalHeaderRef.current) {
      setHeaderHeight(originalHeaderRef.current.offsetHeight);
    }
  }, []); // Chỉ chạy 1 lần

  // 2. Thêm listener để theo dõi sự kiện cuộn
  useEffect(() => {
    // Chỉ chạy logic nếu đã đo được chiều cao (headerHeight > 0)
    if (headerHeight === 0) return;

    const handleScroll = () => {
      // Nếu vị trí cuộn (window.scrollY) lớn hơn chiều cao của header
      // -> hiển thị header fixed
      if (window.scrollY > headerHeight) {
        setShowFixedHeader(true);
      } else {
        setShowFixedHeader(false);
      }
    };

    // Đăng ký sự kiện
    window.addEventListener('scroll', handleScroll);

    // Hủy đăng ký sự kiện khi component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerHeight]); // Chạy lại mỗi khi headerHeight thay đổi
  if (isAdminPage || isAdminLoginPage) {
    return <>{children}</>;
  }
  return (
    <>
      {/* 1. HEADER GỐC (Static) */}
      {/* z-20: Nằm dưới header fixed (z-30) */}
      <div ref={originalHeaderRef} className="relative z-20">
        <Header />
      </div>

      {/* 2. HEADER MỚI (Fixed) */}
      {/* Header này luôn ở đó, nhưng được ẩn/hiện bằng 'translate' */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-[var(--background)] 
                      text-[var(--foreground)] border-b border-[var(--foreground)]
                   transition-transform duration-300 ease-in-out 
                   ${
                     showFixedHeader ? 'translate-y-0' : '-translate-y-full'
                   }`}
      >
        <Header />
      </div>

      <main className="flex-1">{children}</main>

      <Footer />
    </>
  );
}