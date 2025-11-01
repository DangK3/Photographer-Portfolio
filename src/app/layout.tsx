import type { Metadata } from "next";
import "./globals.css";
import ScrollToTopButton from '@/components/ScrollToTopButton';
import LayoutWrapper from '@/components/LayoutWrapper';


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "Oni Studio",
  description: "Showcase of professional photography projects.",
  openGraph: {
    title: 'Oni Studio',
    description: 'Mô tả mặc định...',
    images: ['/default-og-image.jpg'], // Một ảnh đại diện mặc định
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-background text-gray-900 antialiased flex flex-col min-h-screen">
       {/* 3. Bọc 'children' bằng 'LayoutWrapper' */}
        <LayoutWrapper>{children}</LayoutWrapper>
        <ScrollToTopButton />
      </body>
    </html>
  );
}
