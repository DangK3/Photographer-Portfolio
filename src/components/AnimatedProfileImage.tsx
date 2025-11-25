// src/components/AnimatedProfileImage.tsx
'use client'; 

import { motion } from 'framer-motion';
import React from 'react';

export default function AnimatedProfileImage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="w-full max-w-sm md:max-w-none bg-[var(--background)] shadow-2x"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}