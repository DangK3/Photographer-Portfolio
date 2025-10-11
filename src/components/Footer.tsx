'use client'; // Bắt buộc vì dùng hook client-side

import { useEffect, useRef, useState } from 'react';

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.2, // hiển thị khi 20% footer vào khung nhìn
      }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`w-full bg-black text-white text-center py-8 transition-all duration-700 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      © 2025 My Portfolio. All rights reserved.
    </footer>
  );
}
