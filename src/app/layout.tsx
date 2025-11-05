import type { Metadata } from "next";
import "./globals.css";
import ScrollToTopButton from '@/components/ScrollToTopButton';
import LayoutWrapper from '@/components/LayoutWrapper';
import { Providers } from './providers';

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
   <html lang="vi" suppressHydrationWarning>
     <body className="bg-[var(--background)] 
                      text-[var(--foreground)]
                       antialiased flex flex-col min-h-screen
                       transition-colors duration-300">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          <ScrollToTopButton />
        </Providers>
      </body>
    </html>
  );
}
