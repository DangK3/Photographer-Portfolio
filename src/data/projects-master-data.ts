// src/data/projects-master-data.ts
import { StaticImageData } from 'next/image';

// --- IMPORT ẢNH (Giữ nguyên) ---
import Fashion_01_thumnails from '../assets/project/thoi-trang/Fashion_01_thumnails.webp';
import Fashion_02_thumnails from '../assets/project/thoi-trang/Fashion_02_thumnails.webp';
import Fashion_03_thumnails from '../assets/project/thoi-trang/Fashion_03_thumnails.webp';

import Commercial_01_thumnails from '../assets/project/thuong-mai/Commercial_01_thumnails.webp';
import Commercial_02_thumnails from '../assets/project/thuong-mai/Commercial_02_thumnails.webp';
import Commercial_02_01 from '../assets/project/thuong-mai/Commercial_02_01.webp';
import Commercial_02_02 from '../assets/project/thuong-mai/Commercial_02_02.webp';
import Commercial_02_03 from '../assets/project/thuong-mai/Commercial_02_03.webp';

import Personal_01_thumnails from '../assets/project/ca-nhan/Personal_01_thumnails.webp';

import Personal_02_thumnails from '../assets/project/ca-nhan/Personal_02_thumnails.webp';
import Personal_02_02 from '../assets/project/ca-nhan/Personal_02_02.webp';
import Personal_02_03 from '../assets/project/ca-nhan/Personal_02_03.webp';
import Personal_02_04 from '../assets/project/ca-nhan/Personal_02_04.webp';
import Personal_02_05 from '../assets/project/ca-nhan/Personal_02_05.webp';
import Personal_02_06 from '../assets/project/ca-nhan/Personal_02_06.webp';
import Personal_02_07 from '../assets/project/ca-nhan/Personal_02_07.webp';
import Personal_02_08 from '../assets/project/ca-nhan/Personal_02_08.webp';
import Personal_02_09 from '../assets/project/ca-nhan/Personal_02_09.webp';

// --- 1. ĐỊNH NGHĨA TYPE CHUẨN (Khớp với Supabase Logic) ---

export type ArticleBlock = 
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'imageRow'; images: (StaticImageData | string)[] }; // Cho phép cả URL string và StaticImport

export interface ProjectData {
  id: number;
  slug: string;
  title: string;
  client_name?: string; // Tên hiển thị phụ (VD: Zara, Dior...)
  
  // Image: Cho phép cả StaticImageData (Demo) và string URL (Supabase)
  image: StaticImageData | string; 
  
  category: string;      // Slug danh mục (vd: thoi-trang)
  categoryName: string;  // Tên hiển thị (vd: Thời trang)
  
  year: string;
  
  // Grid Layout (Dùng số nguyên để tính toán logic kéo thả)
  colSpan: number; 
  rowSpan: number; 
  
  isFeatured: boolean;   // Thay cho featured?
  
  // Chi tiết bài viết
  description?: string;
  credits?: { label: string; value: string }[];
  articleBody?: ArticleBlock[];
  align?: 'left' | 'right';
}

// --- 2. DỮ LIỆU MASTER (Dùng cho Demo Mode) ---

export const PROJECTS_MASTER_DATA: ProjectData[] = [
  // ----------------------------------------------------
  // DỰ ÁN 1: THANH XUÂN
  // ----------------------------------------------------
  {
    id: 1,
    slug: 'thanh-xuan-vuon-truong',
    title: 'Thanh xuân vườn trường',
    client_name: 'Personal Project',
    image: Fashion_01_thumnails,
    category: 'thoi-trang',
    categoryName: 'Thời trang',
    year: '2023',
    colSpan: 2, // 2 cột
    rowSpan: 2, // 2 hàng
    isFeatured: false,
    description: "Vượt ra ngoài giới hạn của một bộ đồng phục, dự án này là một cuộc đối thoại với ký ức. Nó tái định nghĩa không gian quen thuộc của sân trường, biến nó thành một sàn diễn của hoài niệm.",
    credits: [
      { label: 'Producer', value: 'Thanh Hang - Choo Production' },
      { label: 'Art Director', value: 'Thien Nguyen' },
      { label: 'Photographer', value: 'Evis Tran' },
      { label: 'Location', value: 'Oni Studio' },
    ],
    articleBody: [
      { type: 'heading', content: 'Di sản của hoài niệm' },
      { type: 'imageRow', images: [Fashion_01_thumnails, Fashion_01_thumnails] },
      { type: 'paragraph', content: "Bối cảnh sân trường không chỉ là phông nền; nó là một nhân vật. Ánh sáng tự nhiên được lọc qua tán lá, tạo ra sự tương phản mềm mại." },
      { type: 'heading', content: 'Chi tiết và tĩnh lặng' },
      { type: 'imageRow', images: [Fashion_01_thumnails] },
      { type: 'paragraph', content: "Sự tập trung vào chi tiết biến bộ đồng phục từ một quy định trở thành một biểu tượng của cá tính." }
    ]
  },

  // ----------------------------------------------------
  // DỰ ÁN 2: CHỦ MÔ HÌNH (ZARA)
  // ----------------------------------------------------
  {
    id: 2,
    slug: 'chu-mo-hinh-zara',
    title: 'Chủ mô hình',
    client_name: 'ZARA',
    image: Commercial_01_thumnails,
    category: 'thuong-mai',
    categoryName: 'Thương mại',
    year: '2024',
    colSpan: 1,
    rowSpan: 1,
    isFeatured: false,
    description: "Trong lãnh địa của e-commerce, sự tối giản là tuyên ngôn tối thượng. Dự án này loại bỏ mọi chi tiết thừa để tập trung vào bản chất thuần túy.",
    credits: [
      { label: 'Client', value: 'ZARA' },
      { label: 'Photographer', value: 'Evis Tran' },
      { label: 'Location', value: 'Oni Studio' },
    ],
    articleBody: [
      { type: 'heading', content: 'Kiến trúc của ánh sáng' },
      { type: 'imageRow', images: [Commercial_01_thumnails] },
      { type: 'paragraph', content: "Ánh sáng được sử dụng như một 'con dao điêu khắc', tách chủ thể khỏi nền xám trơn." },
      { type: 'heading', content: 'Sự tĩnh lặng của chuyển động' },
      { type: 'imageRow', images: [Commercial_01_thumnails, Commercial_01_thumnails] },
      { type: 'paragraph', content: "Mỗi dáng pose là kết quả của kỷ luật, tạo ra những hình ảnh mạnh mẽ và trực diện." }
    ]
  },

  // ----------------------------------------------------
  // DỰ ÁN 3: CÁ NHÂN 01
  // ----------------------------------------------------
  {
    id: 3,
    slug: 'ca-nhan-01',
    title: 'Portrait Series 01',
    client_name: 'Cá nhân',
    image: Personal_01_thumnails,
    category: 'ca-nhan',
    categoryName: 'Cá nhân',
    year: '2023',
    colSpan: 1,
    rowSpan: 2,
    isFeatured: false,
    description: "Nhiếp ảnh chân dung không phải là ghi lại một khuôn mặt, mà là bắt giữ một thế giới nội tâm.",
    credits: [
      { label: 'Photographer', value: 'Evis Tran' },
      { label: 'Model', value: 'Mai Phuoc Tri' },
    ],
    articleBody: [
      { type: 'heading', content: 'Vẻ đẹp của Chiaroscuro' },
      { type: 'imageRow', images: [Personal_01_thumnails, Personal_01_thumnails, Personal_01_thumnails] },
      { type: 'paragraph', content: "Chúng tôi chọn ánh sáng cửa sổ duy nhất để tôn vinh nghệ thuật tương phản Chiaroscuro." }
    ]
  },

  // ----------------------------------------------------
  // DỰ ÁN 4: HOKKAIDO 
  // ----------------------------------------------------
  {
    id: 4,
    slug: 'ngon-lua-giua-tuyet',
    title: 'Ngọn lửa giữa Tuyết',
    client_name: 'Editorial',
    image: Fashion_02_thumnails,
    category: 'thoi-trang',
    categoryName: 'Thời trang',
    year: '2024',
    colSpan: 1,
    rowSpan: 2,
    isFeatured: false,
    description: "Dự án cá nhân này khám phá sự tương phản giữa cái lạnh buốt của ngoại cảnh và hơi ấm nội tâm.",
    credits: [
      { label: 'Location', value: 'Hokkaido, Japan' },
      { label: 'Photographer', value: 'Evis Tran' },
    ],
    articleBody: [
      { type: 'heading', content: 'Sức sống mỏng manh' },
      { type: 'imageRow', images: [Fashion_02_thumnails, Fashion_02_thumnails] },
      { type: 'paragraph', content: "Giữa khung cảnh bao la của tuyết trắng, ánh lửa đỏ cam trở thành tuyên ngôn duy nhất về sự tồn tại." }
    ]
  },

  // ----------------------------------------------------
  // DỰ ÁN 5: L'OFFICIEL 
  // ----------------------------------------------------
  {
    id: 5,
    slug: 'hoi-tho-golden-hour',
    title: "Hơi thở 'Golden Hour'",
    client_name: "L'Officiel Vietnam",
    image: Fashion_03_thumnails,
    category: 'thoi-trang',
    categoryName: 'Thời trang',
    year: '2023',
    colSpan: 2,
    rowSpan: 1,
    isFeatured: true,
    description: "Một bộ ảnh editorial khám phá sự kết nối giữa con người và thiên nhiên trong khoảnh khắc vàng.",
    credits: [
      { label: 'Client', value: "L'Officiel" },
      { label: 'Photographer', value: 'Evis Tran' },
    ],
    articleBody: [
      { type: 'heading', content: 'Đối thoại với hoàng hôn' },
      { type: 'imageRow', images: [Fashion_03_thumnails, Fashion_03_thumnails] },
      { type: 'paragraph', content: "Golden hour là khoảnh khắc ánh sáng không chỉ chiếu rọi, mà còn 'chạm' vào vạn vật." }
    ]
  },

  // ----------------------------------------------------
  // DỰ ÁN 6: DIOR 
  // ----------------------------------------------------
  {
    id: 6,
    slug: 'khoanh-khac-playful-dior',
    title: "Khoảnh khắc 'Playful' Dior",
    client_name: 'Dior Beauty',
    image: Commercial_02_thumnails,
    category: 'thuong-mai',
    categoryName: 'Thương mại',
    year: '2024',
    colSpan: 1,
    rowSpan: 1,
    isFeatured: true,
    description: "Nắm bắt tinh thần trẻ trung, phá cách tại sự kiện độc quyền của Dior.",
    credits: [
      { label: 'Client', value: 'Dior' },
      { label: 'Photographer', value: 'Evis Tran' },
    ],
    articleBody: [
      { type: 'heading', content: 'Tuyên ngôn của sự nổi loạn' },
      { type: 'imageRow', images: [Commercial_02_thumnails] },
      { type: 'imageRow', images: [Commercial_02_01, Commercial_02_02] },
      { type: 'imageRow', images: [Commercial_02_thumnails, Commercial_02_03] },
      { type: 'paragraph', content: "Khoảnh khắc 'playful' phá vỡ sự trang trọng của di sản Dior." }
    ]
  },

  // ----------------------------------------------------
  // DỰ ÁN 7: SG 1990 
  // ----------------------------------------------------
  {
    id: 7,
    slug: 'net-lang-du-sai-gon-thap-nien-90',
    title: "Nét Lãng Du Sài Gòn",
    client_name: 'Personal Project',
    image: Personal_02_thumnails,
    category: 'ca-nhan',
    categoryName: 'Cá nhân',
    year: '2022',
    colSpan: 1,
    rowSpan: 1,
    isFeatured: true,
    description: "Không khí hoài cổ, lãng mạn và có chút bụi bặm của Sài Gòn những năm 90.",
    credits: [
      { label: 'Concept', value: 'Saigon 1990' },
      { label: 'Photographer', value: 'Evis Tran' },
    ],
    articleBody: [
      { type: 'heading', content: 'Ý Tưởng & Chủ Đề' },
      { type: 'imageRow', images: [Personal_02_thumnails] },
      { type: 'imageRow', images: [Personal_02_02, Personal_02_03, Personal_02_04] },
      { type: 'imageRow', images: [Personal_02_05, Personal_02_06, Personal_02_07] },
      { type: 'imageRow', images: [Personal_02_thumnails, Personal_02_08, Personal_02_09] },
      { type: 'paragraph', content: "Tái hiện lại không khí hoài cổ, lãng mạn của Sài Gòn xưa." }
    ]
  },
];