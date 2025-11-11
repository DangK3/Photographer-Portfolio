// src/lib/seed-helpers.ts

import { StaticImageData } from "next/image";


export interface Project {
  id: number; 
  slug: string;
  title: string;
  description?: string;
  category: string;
  src: StaticImageData; // Kiểu StaticImageData
  credits?: { label: string; value: string }[];
  articleBody?: ArticleBlock[];
  // Bất kỳ trường nào khác...
}
// 1. Định nghĩa kiểu cho nội dung bài viết
export type ArticleBlock = 
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'imageRow'; images: StaticImageData[] };

/**
 * Tạo một danh sách dự án "giả" cho một danh mục cụ thể.
 * Hàm này lặp lại các dự án thật trong danh mục đó cho đến khi
 * đạt được số lượng mong muốn (targetCount).
 *
 * @param allActualProjects Danh sách TẤT CẢ các dự án thật.
 * @param category Slug của danh mục (ví dụ: 'thoi-trang').
 * @param targetCount Số lượng dự án mong muốn cho danh mục này.
 * @returns Một mảng dự án mới đã được lặp lại.
 */
export function seedProjectsByCategory(
  allActualProjects: Project[],
  category: string,
  targetCount: number
): Project[] {
  
  // 1. Lọc ra các dự án thật thuộc danh mục này
  const sourceProjects = allActualProjects.filter(
    (p) => p.category === category
  );

  // Nếu không có dự án thật nào trong danh mục, trả về mảng rỗng
  if (sourceProjects.length === 0) {
    console.warn(`[seedProjects] Không tìm thấy dự án nào cho danh mục: ${category}`);
    return [];
  }

  const seededList: Project[] = [];
  const numSourceProjects = sourceProjects.length;

  // 2. Lặp từ 0 đến số lượng mong muốn
  for (let i = 0; i < targetCount; i++) {
    
    const projectToCopy = sourceProjects[i % numSourceProjects];

    // 2. THAY ĐỔI CÁCH TẠO ID MỚI
    // Chúng ta tạo một ID số duy nhất (ví dụ: 10000 + i)
    // để đảm bảo nó không trùng với các ID thật (thường là 1, 2, 3...)
    const mockId = 10000 + i;

    const newProject = {
      ...projectToCopy,
      // Tạo ID và Slug giả duy nhất
      id: mockId, // <-- Bây giờ là một 'number'
      slug: `${projectToCopy.slug}`, // Slug vẫn duy nhất
      isMock: true, 
    };

    seededList.push(newProject);
  }

  return seededList;
}