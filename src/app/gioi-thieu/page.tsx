// src/app/gioi-thieu/page.tsx
import type { Metadata } from 'next';
import AboutMilestonesSection from '@/components/AboutMilestonesSection';
import AboutPhilosophySection from '@/components/AboutPhilosophySection';
import AboutBtsSection from '@/components/BtsSection';
import AboutContactSection from '@/components/ContactSection';

// 1. Thêm Metadata (SEO) cho trang Giới Thiệu
export const metadata: Metadata = {
  title: 'Giới Thiệu | Oni Studio',
  description: 'Tìm hiểu về hành trình, đội ngũ và triết lý sáng tạo đằng sau Oni Studio, từ những phác thảo đầu tiên đến một xưởng ảnh chuyên nghiệp.',
  openGraph: {
    title: 'Giới Thiệu | Oni Studio',
    description: 'Tìm hiểu về hành trình và triết lý sáng tạo của Oni Studio.',
    // Bạn nên thay thế bằng một ảnh đại diện cho trang Giới Thiệu
    images: ['/assets/about/carousel_04_2025.jpg'], 
  },
};

// 2. Nội dung trang
export default function GioiThieuPage() {
  return (
    <main>
      {/* Section 1: Hành trình (Carousel) */}
      <AboutMilestonesSection />

      <AboutPhilosophySection />

      <AboutBtsSection />

      <AboutContactSection />
    </main>
  );
}