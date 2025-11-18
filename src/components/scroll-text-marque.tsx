// src/components/ui/scroll-text-marque.tsx
'use client';

import React from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  wrap,
} from 'framer-motion';
import { cn } from '@/lib/utils'; // Giả định bạn đã có file này

interface ScrollBaseAnimationProps {
  children: React.ReactNode;
  baseVelocity: number;
  className?: string;
  delay?: number; // Prop 'delay' từ ví dụ của bạn
}

export default function ScrollBaseAnimation({
  children,
  baseVelocity = 100, // Tốc độ mặc định
  className,
}: ScrollBaseAnimationProps) {
  // useMotionValue để lưu giá trị 'x'
  const baseX = useMotionValue(0);

  // useAnimationFrame là một vòng lặp (loop) được tối ưu hóa
  // Nó chạy liên tục, cập nhật giá trị 'x'
  useAnimationFrame((time, delta) => {
    // Tính toán quãng đường di chuyển dựa trên velocity
    // (delta là thời gian kể từ frame cuối, ~16ms)
    
    // SỬA LỖI: Đổi 'let' thành 'const' vì nó không bao giờ được gán lại
    const moveBy = baseVelocity * (delta / 1000);
    
    // 'wrap' là một hàm của Framer Motion giúp lặp lại giá trị
    // Khi 'x' đạt -50%, nó sẽ reset về 0, tạo vòng lặp vô tận
    baseX.set(wrap(0, -50, baseX.get() + moveBy));
  });

  // Chuyển giá trị số (ví dụ: -10) thành đơn vị CSS (ví dụ: "-10%")
  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    // 'overflow-hidden' là bắt buộc để "cắt" phần text bị ẩn
    <div
      className="relative w-full overflow-hidden whitespace-nowrap"
    >
      {/* 'motion.div' sẽ di chuyển theo giá trị 'x' */}
      <motion.div
        className={cn('flex', className)} // Áp dụng className (font-bold, etc.) ở đây
        style={{ x }}
      >
        {/* Chúng ta lặp lại nội dung 4 lần để đảm bảo
          luôn lấp đầy màn hình, tạo hiệu ứng liền mạch
        */}
        <span className="inline-block mr-8">{children}</span>
        <span className="inline-block mr-8">{children}</span>
        <span className="inline-block mr-8">{children}</span>
        <span className="inline-block mr-8">{children}</span>
      </motion.div>
    </div>
  );
}