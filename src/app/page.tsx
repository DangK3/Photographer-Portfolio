// src/app/page.tsx

import type { Metadata } from 'next';
import HomePageContent from '@/components/HomePageContent';
export const revalidate = 3600; // 1 hour
export const metadata: Metadata = {
  title: 'Oni Studio',
  description: 'Oni Studio - Chuyên cung cấp dịch vụ nhiếp ảnh thương mại, thời trang, và cá nhân chuyên nghiệp. Khám phá portfolio và liên hệ để hợp tác.',
  keywords: ['nhiếp ảnh gia', 'photographer', 'commercial photography', 'fashion photography', 'Oni Studio'],

  openGraph: {
    title: 'Oni Studio',
    description: 'Khám phá portfolio ảnh thương mại, thời trang, và cá nhân từ Oni Studio.',
    url: 'https://www.your-domain.com', 
    siteName: 'Oni Studio',
    images: [
      {
        url: 'https://www.your-domain.com/og-image.png', 
        width: 1200,
        height: 630,
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Oni Studio | Nhiếp ảnh Thương mại & Thời trang Chuyên nghiệp',
    description: 'Khám phá portfolio ảnh thương mại, thời trang, và cá nhân từ Oni Studio.',
    images: ['https://www.your-domain.com/twitter-image.png'], 
  },
};

export default function HomePage() {
  return (
    <HomePageContent />
  );
}