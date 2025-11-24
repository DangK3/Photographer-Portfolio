// src/app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    // attribute="class" -> báo cho next-themes thêm class "dark" vào <html>
    // defaultTheme="system" -> tự động chọn chế độ theo HĐH của người dùng
    <ThemeProvider attribute="class" storageKey="client-theme" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}