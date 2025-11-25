// src/components/PhilosophyBackground.tsx
'use client';

import ScrollBaseAnimation from '@/components/scroll-text-marque';

export default function PhilosophyBackground() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-center 
                    opacity-10 dark:opacity-5 
                    pointer-events-none gap-4 md:gap-8">

      <ScrollBaseAnimation
        baseVelocity={-3}
        className="text-6xl font-bold uppercase whitespace-nowrap"
      >
        THƯƠNG MẠI • THỜI TRANG • CÁ NHÂN •
      </ScrollBaseAnimation>

      <ScrollBaseAnimation
        baseVelocity={3}
        className="text-9xl font-bold uppercase whitespace-nowrap text-center"
      >
        KHOẢNH KHẮC • SÁNG TẠO • ONI STUDIO •
      </ScrollBaseAnimation>

      <ScrollBaseAnimation
        baseVelocity={-2}
        className="text-6xl font-bold uppercase whitespace-nowrap"
      >
        LOOKBOOK • PORTRAIT • PHOTOGRAPHY •
      </ScrollBaseAnimation>
    </div>
  );
}