// src/lib/seed-helpers.ts
import { StaticImageData } from 'next/image';

// Định nghĩa lại Project để bao gồm 'originalSlug' (cho mục đích demo)
export interface Project {
  id: number;
  slug: string;
  title: string;
  description?: string;
  category: string;
  src: StaticImageData;
  credits?: { label: string; value: string }[];
  articleBody?: ArticleBlock[];
  
  // Thêm các trường tùy chọn cho demo
  isMock?: boolean;
  originalSlug?: string; // Sẽ lưu slug gốc ở đây
}

export type ArticleBlock =
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'imageRow'; images: StaticImageData[] };

export function seedProjectsByCategory(
  allActualProjects: Project[],
  category: string,
  targetCount: number
): Project[] {
  
  const sourceProjects = allActualProjects.filter(
    (p) => p.category === category
  );

  if (sourceProjects.length === 0) {
    console.warn(`[seedProjects] Không tìm thấy dự án nào cho danh mục: ${category}`);
    return [];
  }

  const seededList: Project[] = [];
  const numSourceProjects = sourceProjects.length;

  for (let i = 0; i < targetCount; i++) {
    const projectToCopy = sourceProjects[i % numSourceProjects];
    const mockId = 10000 + i;

    const newProject: Project = { // Sử dụng kiểu Project đã định nghĩa
      ...projectToCopy,
      
      // 1. Tạo ID và Slug GIẢ (chỉ để dùng làm 'key' trong React)
      id: mockId,
      slug: `${projectToCopy.slug}-${i}`, // Slug giả duy nhất (ví dụ: ca-nhan-01-0, ca-nhan-01-1)
      
      // 2. Lưu lại Slug GỐC (để dùng cho href)
      originalSlug: projectToCopy.slug, // Đây là slug thật (ví dụ: ca-nhan-01)
      
      isMock: true,
    };

    seededList.push(newProject);
  }

  return seededList;
}