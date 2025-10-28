// src/app/page.tsx

import type { Metadata } from 'next';
import HomePageContent from '@/components/HomePageContent'; // 1. Import component Client

// 2. Export đối tượng Metadata (SEO)
//    (Bạn hãy thay đổi nội dung bên dưới cho phù hợp)
export const metadata: Metadata = {
  title: 'Oni Studio | Nhiếp ảnh Thương mại & Thời trang Chuyên nghiệp',
  description: 'Oni Studio - Chuyên cung cấp dịch vụ nhiếp ảnh thương mại, thời trang, và cá nhân chuyên nghiệp. Khám phá portfolio và liên hệ để hợp tác.',
  
  // Từ khóa (Tùy chọn)
  keywords: ['nhiếp ảnh gia', 'photographer', 'commercial photography', 'fashion photography', 'Oni Studio'],

  // Open Graph (cho Facebook, LinkedIn...)
  openGraph: {
    title: 'Oni Studio | Nhiếp ảnh Thương mại & Thời trang Chuyên nghiệp',
    description: 'Khám phá portfolio ảnh thương mại, thời trang, và cá nhân từ Oni Studio.',
    url: 'https://www.your-domain.com', // <-- THAY BẰNG DOMAIN CỦA BẠN
    siteName: 'Oni Studio',
    images: [
      {
        url: 'https://www.your-domain.com/og-image.png', // <-- THAY BẰNG LINK ẢNH OG
        width: 1200,
        height: 630,
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },

  // Twitter Card (cho Twitter)
  twitter: {
    card: 'summary_large_image',
    title: 'Oni Studio | Nhiếp ảnh Thương mại & Thời trang Chuyên nghiệp',
    description: 'Khám phá portfolio ảnh thương mại, thời trang, và cá nhân từ Oni Studio.',
    images: ['https://www.your-domain.com/twitter-image.png'], // <-- THAY BẰNG LINK ẢNH
  },
};

// 3. Render trang
//    (Đây là Server Component, chỉ render component Client)
export default function HomePage() {
  return (
    <HomePageContent />
  );
}