// src/components/HomePageContent.tsx

'use client'; // Bắt buộc, vì chúng ta dùng dynamic import và các component con đều là 'use client'

import dynamic from 'next/dynamic';

// 1. Tải ngay lập tức
import HeroSection from '@/components/HeroSection';

// 2. Tạo một component Loading (Trạng thái chờ)
const LoadingSpinner = () => (
  <div className="h-96 flex items-center justify-center">
    <p>Đang tải...</p>
  </div>
);

// 3. Tải lười (Dynamic Imports) cho các section bên dưới
const DynamicPortfolioSection = dynamic(
  () => import('@/components/PortfolioSection'), // Giả định component này tồn tại
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const DynamicProjectShowcase = dynamic(
  () => import('@/components/ProjectShowcase'), // Giả định component này tồn tại
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const DynamicBtsSection = dynamic(
  () => import('@/components/BtsSection'),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const DynamicContactSection = dynamic(
  () => import('@/components/ContactSection'),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

// 4. Đổi tên function (từ HomePage thành HomePageContent)
export default function HomePageContent() {
  return (
    <main>
      {/* Section 01 (Tải ngay) */}
      <HeroSection />

      {/* Section 02 (Tải lười) */}
      <section id="portfolio" className="py-16 md:py-24">
        <DynamicPortfolioSection />
      </section>

      {/* Section 03 (Tải lười) */}
      <section id="showcase" className="py-16 md:py-24">
        <DynamicProjectShowcase />
      </section>

      {/* Section 04 (Tải lười) */}
      <DynamicBtsSection />

      {/* Section 05 (Tải lười) */}
      <DynamicContactSection />
    </main>
  );
}