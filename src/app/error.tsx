// src/app/error.tsx

'use client'; // File này BẮT BUỘC phải là Client Component

import { useEffect } from 'react';
import Container from '@/components/Container'; // Tái sử dụng Container
import Link from 'next/link';
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log lỗi ra console để debug
    // (Bạn cũng có thể gửi lỗi này đến các dịch vụ như Sentry)
    console.error(error);
  }, [error]);

  return (
    <Container>
      {/* Layout tương tự trang 404 */}
      <div className="flex flex-col items-center justify-center text-center py-24 md:py-32 min-h-[calc(100vh_-_250px)]">
        
        {/* Mã lỗi */}
        <span className="text-7xl md:text-9xl font-light tracking-tighter text-[var(--foreground)]">
          Lỗi
        </span>
        
        {/* Tiêu đề */}
        <h1 className="mt-4 text-3xl md:text-4xl font-light tracking-tight">
          Đã có lỗi xảy ra
        </h1>
        
        {/* Mô tả */}
        <p className="mt-2 text-lg text-[var(--sub-text)]">
          Rất tiếc, đã có sự cố ngoài ý muốn. Bạn có thể thử lại.
        </p>

        {/* Nút "Thử Lại"
          Hàm reset() sẽ cố gắng render lại trang một lần nữa.
        */}
        <div className="mt-10 flex flex-col md:flex-row justify-center gap-4">
          
          {/* Nút 1: Thử Lại (Đã xóa mt-10) */}
          <button
            onClick={() => reset()}
            className="py-3 px-8 bg-transparent 
                       border border-[var(--foreground)] 
                       text-[var(--foreground)] 
                       hover:bg-[var(--foreground)] hover:text-[var(--background)] 
                       transition-colors duration-300 cursor-pointer"
          >
            Thử Lại
          </button>
          
          {/* Nút 2: Trang chủ (Đã xóa mt-10) */}
          <Link
            href="/"
            className="py-3 px-8 bg-transparent 
                       border border-[var(--foreground)] 
                       text-[var(--foreground)] 
                       hover:bg-[var(--foreground)] hover:text-[var(--background)] 
                       transition-colors duration-300 cursor-pointer"
          >
            Quay về Trang chủ
          </Link>

        </div>
        {/* ============================================== */}
        
      </div>
    </Container>
  );
}