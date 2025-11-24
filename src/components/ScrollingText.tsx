// // src/components/ui/ScrollingText.tsx
// 'use client';

// import { useRef, useState } from 'react';
// import {
//   motion,
//   useScroll,
//   useMotionValueEvent,
// } from 'framer-motion';

// // Định nghĩa props cho component
// interface ScrollingTextProps {
//   text: string;
//   className?: string;
//   direction?: 'left' | 'right'; 
//   speed?: number; // Tốc độ chạy (s), càng nhỏ càng nhanh
// }


// /**
//  * Component chính
//  */
// export const ScrollingText = ({
//   text,
//   className = '',
//   direction = 'left',
//   speed = 15, // Mặc định 15s cho 1 vòng
// }: ScrollingTextProps) => {
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   // 1. THEO DÕI HƯỚNG CUỘN
//   const { scrollY } = useScroll();
//   const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');

//   useMotionValueEvent(scrollY, 'change', (latest) => {
//     const previous = scrollY.getPrevious() ?? 0;
//     if (latest > previous) {
//       setScrollDirection('down');
//     } else {
//       setScrollDirection('up');
//     }
//   });

//   // 2. TẠO ANIMATION
//   // Dựa trên hướng cuộn, chúng ta đổi hướng chạy của chữ
//   const effectiveDirection =
//     scrollDirection === 'down' ? direction : direction === 'left' ? 'right' : 'left';


//   // Tạo giá trị 'from' và 'to' cho animation
//   const fromX = effectiveDirection === 'left' ? 0 : -2000;
//   const toX = effectiveDirection === 'left' ? -2000 : 0;

//   return (
//     <div
//       ref={containerRef}
//       className={`relative w-full overflow-hidden ${className}`}
//     >
//       <motion.div
//         className="relative"
//         // Sử dụng 'animate' và 'transition' của Framer Motion
//         animate={{ x: [fromX, toX] }}
//         transition={{
//           repeat: Infinity,
//           repeatType: 'loop',
//           duration: speed, // Dùng speed (giây) làm duration
//           ease: 'linear',
//         }}
//         style={{
//           width: '400%', // Gấp 4 lần vì có 4 bản sao
//           display: 'flex',
//         }}
//       >
//         {/* Render 4 bản sao. Đã xóa style 'speed' bị lỗi */}
//         <span className="block w-1/4 mr-8">{text}</span>
//         <span className="block w-1/4 mr-8">{text}</span>
//         <span className="block w-1/4 mr-8">{text}</span>
//         <span className="block w-1/4 mr-8">{text}</span>
//       </motion.div>
//     </div>
//   );
// };