// src/components/AnimatedProfileImage.tsx
'use client'; // 1. BẮT BUỘC: Đánh dấu đây là Client Component

import { motion } from 'framer-motion';
import React from 'react';

// 2. Nhận 'children' (sẽ là component <Image> từ server)
export default function AnimatedProfileImage({ children }: { children: React.ReactNode }) {
  return (
    // 3. Di chuyển toàn bộ logic <motion.div> vào đây
    <motion.div
      className="w-full max-w-sm md:max-w-none bg-[var(--background)] shadow-2x"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.3 }} // Chỉ chạy 1 lần khi cuộn tới
    >
      {children} {/* 4. Render component <Image> đã được truyền vào */}
    </motion.div>
  );
}