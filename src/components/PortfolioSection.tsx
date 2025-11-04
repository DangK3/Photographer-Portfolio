// src/components/PortfolioSection.tsx

import Container from '@/components/Container';
import PortfolioGrid from '@/components/PortfolioGrid';

export default function PortfolioSection() {
  return (
    <section
      id="portfolio"
      className="py-16 md:py-24 bg-[--background]" // Giữ nguyên - đã dùng biến
      style={{ minHeight: 0, fontSize: 'initial' }}
    >
      <Container>
        {/* Tiêu đề cho Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl text-[var(--foreground)] font-light tracking-tighter">
            Bộ Sưu Tập
          </h2>
          <p className="text-lg md:text-xl text-[var(--glow-color)] mt-2">
            Những dự án và khoảnh khắc chọn lọc.
          </p>
        </div>
        <PortfolioGrid />
      </Container>
    </section>
  );
}