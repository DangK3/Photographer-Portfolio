// src/app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" storageKey="client-theme" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}