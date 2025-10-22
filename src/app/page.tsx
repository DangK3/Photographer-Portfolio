import HeroSection from "@/components/HeroSection"; 
import Container from '@/components/Container'; // 1. Import Container
import PortfolioGrid from '@/components/PortfolioGrid'; // 2. Import component mới


export default function HomePage() {
  return (
    <main>
      <HeroSection /> {/* Sử dụng HeroSection thay cho section 1 cũ */}

      <section
        id="portfolio"
        className="py-16 md:py-24 bg-[--background] text-[--foreground]"
        style={{ minHeight: 0, fontSize: 'initial' }} // Ghi đè CSS cũ
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
          
          {/* 3. Sử dụng component lưới */}
          <PortfolioGrid />
        </Container>
      </section>

      <section>
        <h1>Section 4 — About</h1>
      </section>

      <section>
        <h1>Section 5 — Contact</h1>
      </section>
    </main>
  );
}
