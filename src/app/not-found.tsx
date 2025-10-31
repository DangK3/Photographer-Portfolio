// src/app/not-found.tsx

import Link from 'next/link';
import Container from '@/components/Container'; // Tái sử dụng Container
import type { Metadata } from 'next';

// Metadata (SEO) riêng cho trang 404
export const metadata: Metadata = {
  title: '404 - Không tìm thấy | Oni Studio',
  description: 'Trang bạn đang tìm kiếm không tồn tại.',
};

export default function NotFound() {
  return (
    <Container>
      {/* Chúng ta dùng min-h (chiều cao tối thiểu) để đẩy nội dung
        vào giữa màn hình, trừ đi khoảng trống của Header và Footer.
        Bạn có thể điều chỉnh '250px' cho phù hợp.
      */}
      <div className="flex flex-col items-center justify-center text-center py-24 md:py-32 min-h-[calc(100vh_-_250px)]">
        
        {/* Mã lỗi 404 */}
        <span className="text-7xl md:text-9xl font-light tracking-tighter text-black/80 dark:text-white/80">
          404
        </span>
        
        {/* Tiêu đề */}
        <h1 className="mt-4 text-3xl md:text-4xl font-light tracking-tight">
          Không tìm thấy trang
        </h1>
        
        {/* Mô tả */}
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Rất tiếc, chúng tôi không thể tìm thấy trang bạn yêu cầu.
        </p>

        {/* Nút bấm quay về trang chủ.
          Styling được sao chép từ nút "Gửi Lời Nhắn"
          trong ContactSection để đảm bảo nhất quán.
        */}
        <Link
          href="/"
          className="mt-10 py-3 px-8 bg-transparent 
                     border border-black dark:border-white 
                     text-black dark:text-white 
                     hover:bg-black hover:text-[#ebebeb] 
                     dark:hover:bg-white dark:hover:text-gray-950
                     transition-colors duration-300 cursor-pointer"
        >
          Quay về Trang chủ
        </Link>
      </div>
    </Container>
  );
}