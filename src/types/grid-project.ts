// src/types/grid-project.ts
import { StaticImageData } from 'next/image';

/**
 * Đây là cấu trúc dữ liệu mà PortfolioGrid sẽ nhận.
 * Nó bao gồm cả dữ liệu hiển thị (title, src)
 * và dữ liệu layout (colSpan, rowSpan)
 * và dữ liệu hành vi (slug).
 */
export interface GridProject {
  id: number | string;
  src: StaticImageData | string;
  title: string;
  category: string;
  
  // Dành cho layout
  colSpan: string;
  rowSpan: string;
  
  // Dành cho link chi tiết
  slug: string; 
}