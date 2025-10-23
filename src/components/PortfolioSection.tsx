// src/components/PortfolioSection.tsx

// 1. Import các component cần thiết
import Container from '@/components/Container';
import PortfolioGrid from '@/components/PortfolioGrid';

// 2. Định nghĩa component mới
export default function PortfolioSection() {
  return (
    <section
      id="portfolio"
      className="py-16 md:py-24 bg-[--background] text-[--foreground]"
      style={{ minHeight: 0, fontSize: 'initial' }} // Giữ nguyên
    >
      <Container>
        {/* Tiêu đề cho Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-light tracking-tighter">
            Bộ Sưu Tập
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-2">
            Những dự án và khoảnh khắc chọn lọc.
          </p>
        </div>

        {/* 3. Sử dụng component lưới (đã được import ở trên) */}
        <PortfolioGrid />
      </Container>
    </section>
  );
}