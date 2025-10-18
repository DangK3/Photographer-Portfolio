import type { Metadata } from "next";
import "./globals.css";
import ScrollToTopButton from '@/components/ScrollToTopButton';
import LayoutWrapper from '@/components/LayoutWrapper';


export const metadata: Metadata = {
  title: "Oni Studio",
  description: "Showcase of professional photography projects.",
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
