// src/data/projects-master-data.ts
import { StaticImageData } from 'next/image';

// Import TẤT CẢ ảnh thumbnail của bạn (từ /personal/)
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



// 1. Định nghĩa kiểu cho nội dung bài viết
export type ArticleBlock = 
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'imageRow'; images: StaticImageData[] };

// 2. Định nghĩa kiểu "Project" hoàn chỉnh
export interface Project {
  id: number;
  slug: string;
  title: string;
  src: StaticImageData; // Ảnh thumbnail
  category: 'Thời trang' | 'Thương mại' | 'Cá nhân';
  cateSlug: 'thoi-trang' | 'thuong-mai' | 'ca-nhan';
  colSpan: string;
  rowSpan: string;
  featured?: boolean;
  description: string; // Mô tả ngắn (intro)
  credits: { label: string; value: string }[];
  align?: 'left' | 'right';
  articleBody?: ArticleBlock[];
}

// 3. Tạo mảng dữ liệu "master" (ĐÃ CẬP NHẬT 6/6 DỰ ÁN)
export const allProjects: Project[] = [
  // ----------------------------------------------------
  // DỰ ÁN 1: THANH XUÂN
  // ----------------------------------------------------
  {
    id: 1,
    slug: 'thanh-xuan-vuon-truong',
    title: 'Thanh xuân vườn trường',
    src: Fashion_01_thumnails,
    category: 'Thời trang',
    cateSlug: 'thoi-trang',
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-2',
    featured: false, // Không phải dự án tiêu biểu
    description: "Vượt ra ngoài giới hạn của một bộ đồng phục, dự án này là một cuộc đối thoại với ký ức. Nó tái định nghĩa không gian quen thuộc của sân trường, biến nó thành một sàn diễn của hoài niệm, nơi sự ngây thơ và nét trưởng thành đầu tiên giao thoa.",
    credits: [
      { label: 'Producer', value: 'Thanh Hang - Choo Production' },
      { label: 'Art Director', value: 'Thien Nguyen' },
      { label: 'Photographer', value: 'Evis Tran' },
      { label: 'Model', value: 'Mai Phuoc Tri, Nguyễn Văn Long, Huế Hương, Fuka' },
      { label: 'Stylist', value: 'Bao Ngan' },
      { label: 'Stylist Assistant', value: 'Js Chucin' },
      { label: 'Lighting', value: 'An Pham, Huy Tran, Dat Ho Thanh' },
      { label: 'MUA', value: 'Hai Ngoc Nguyen, Tu Anh, Tu Linh' },
      { label: 'Set Designer', value: 'Harry Le, Long Tran' },
      { label: 'Accessories', value: 'Dat Duong' },
      { label: 'Support', value: 'Ngoc Ha' },
      { label: 'Location', value: 'Oni Studio' },
    ],
    articleBody: [
      {
        type: 'heading',
        content: 'Di sản của hoài niệm',
      },
      {
        type: 'imageRow',
        images: [Fashion_01_thumnails, Fashion_01_thumnails], 
      },
      {
        type: 'paragraph',
        content: "Bối cảnh sân trường không chỉ là phông nền; nó là một nhân vật. Ánh sáng tự nhiên được lọc qua tán lá, tạo ra sự tương phản mềm mại trên chất liệu vải kate, gợi lên sự tĩnh lặng của một buổi chiều tan học. Chúng tôi chủ đích tìm kiếm những khoảnh khắc 'in-between' – không phải tạo dáng, mà là sự tồn tại."
      },
      {
        type: 'heading',
        content: 'Chi tiết và tĩnh lặng',
      },
      {
        type: 'imageRow',
        images: [Fashion_01_thumnails], 
      },
      {
        type: 'paragraph',
        content: "Sự tập trung vào chi tiết – từ nếp gấp của chiếc cà vạt đến cái nhìn xa xăm – biến bộ đồng phục từ một quy định trở thành một biểu tượng của cá tính. Đây là sự sang trọng tĩnh lặng (quiet luxury) của tuổi trẻ, mạnh mẽ nhưng tiết chế, quen thuộc mà vẫn đầy kiêu hãnh."
      }
    ]
  },
  // ----------------------------------------------------
  // DỰ ÁN 2: CHỦ MÔ HÌNH (ZARA)
  // ----------------------------------------------------
  {
    id: 2,
    slug: 'chu-mo-hinh-zara',
    title: 'Chủ mô hình',
    src: Commercial_01_thumnails,
    category: 'Thương mại',
    cateSlug: 'thuong-mai',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    featured: false, // Không phải dự án tiêu biểu
    description: "Trong lãnh địa của e-commerce, sự tối giản là tuyên ngôn tối thượng. Dự án này loại bỏ mọi chi tiết thừa để tập trung vào bản chất thuần túy: hình thể, chất liệu, và ánh sáng. Đây không phải là chụp quần áo; đây là điêu khắc ánh sáng trên phom dáng.",
    credits: [
      { label: 'Producer', value: 'Thanh Hang - Choo Production' },
      { label: 'Art Director', value: 'Thien Nguyen' },
      { label: 'Photographer', value: 'Evis Tran' },
      { label: 'Model', value: 'Mai Phuoc Tri, Nguyễn Văn Long, Huế Hương, Fuka' },
      { label: 'Stylist', value: 'Bao Ngan' },
      { label: 'Stylist Assistant', value: 'Js Chucin' },
      { label: 'Lighting', value: 'An Pham, Huy Tran, Dat Ho Thanh' },
      { label: 'MUA', value: 'Hai Ngoc Nguyen, Tu Anh, Tu Linh' },
      { label: 'Set Designer', value: 'Harry Le, Long Tran' },
      { label: 'Accessories', value: 'Dat Duong' },
      { label: 'Support', value: 'Ngoc Ha' },
      { label: 'Location', value: 'Oni Studio' },
    ],
    articleBody: [
      {
        type: 'heading',
        content: 'Kiến trúc của ánh sáng',
      },
      {
        type: 'imageRow',
        images: [Commercial_01_thumnails], 
      },
      {
        type: 'paragraph',
        content: "Thử thách lớn nhất là làm việc với một phông nền xám trơn. Ánh sáng, vì thế, được sử dụng như một 'con dao điêu khắc'. Một đèn key-light lớn tạo khối, và một đèn rim-light (đèn viền) sắc nét từ phía sau để tách chủ thể khỏi nền, làm nổi bật đường nét vai áo và tạo ra một vầng hào quang tinh tế. Đây là sự cân bằng tuyệt đối giữa hiệu năng (performance) và phong cách (style)."
      },
      {
        type: 'heading',
        content: 'Sự tĩnh lặng của chuyển động',
      },
      {
        type: 'imageRow',
        images: [Commercial_01_thumnails, Commercial_01_thumnails], 
      },
      {
        type: 'imageRow',
        images: [Commercial_01_thumnails, Commercial_01_thumnails],
      },
      {
        type: 'imageRow',
        images: [Commercial_01_thumnails, Commercial_01_thumnails],
      },
      {
        type: 'paragraph',
        content: "Mỗi dáng pose không phải là sự ngẫu nhiên, mà là kết quả của kỷ luật. Chúng tôi tìm kiếm sự tĩnh lặng ngay trong chuyển động, một khoảnh khắc 'căng' về mặt thị giác. Kết quả là những hình ảnh mạnh mẽ, trực diện, nơi trang phục trở thành lớp vỏ thứ hai của cơ thể, sẵn sàng cho bất kỳ bối cảnh nào."
      }
    ]
  },
  // ----------------------------------------------------
  // DỰ ÁN 3: CÁ NHÂN 01
  // ----------------------------------------------------
  {
    id: 3,
    slug: 'ca-nhan-01',
    title: 'Cá nhân',
    src: Personal_01_thumnails,
    category: 'Cá nhân',
    cateSlug: 'ca-nhan',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-2',
    featured: false, // Không phải dự án tiêu biểu
    description: "Nhiếp ảnh chân dung không phải là ghi lại một khuôn mặt, mà là bắt giữ một thế giới nội tâm. Đây là một hành trình vào tĩnh lặng, nơi ánh sáng và bóng tối đối thoại trên bề mặt của cảm xúc, khám phá vẻ đẹp nằm ngay trong những điều không hoàn hảo.",
    credits: [
      { label: 'Producer', value: 'Thanh Hang - Choo Production' },
      { label: 'Art Director', value: 'Thien Nguyen' },
      { label: 'Photographer', value: 'Evis Tran' },
      { label: 'Model', value: 'Mai Phuoc Tri, Nguyễn Văn Long, Huế Hương, Fuka' },
      { label: 'Stylist', value: 'Bao Ngan' },
      { label: 'Stylist Assistant', value: 'Js Chucin' },
      { label: 'Lighting', value: 'An Pham, Huy Tran, Dat Ho Thanh' },
      { label: 'MUA', value: 'Hai Ngoc Nguyen, Tu Anh, Tu Linh' },
      { label: 'Set Designer', value: 'Harry Le, Long Tran' },
      { label: 'Accessories', value: 'Dat Duong' },
      { label: 'Support', value: 'Ngoc Ha' },
      { label: 'Location', value: 'Oni Studio' },
    ],
    articleBody: [
      {
        type: 'heading',
        content: 'Vẻ đẹp của Chiaroscuro',
      },
      {
        type: 'imageRow',
        images: [Personal_01_thumnails, Personal_01_thumnails, Personal_01_thumnails], 
      },
      {
        type: 'paragraph',
        content: "Thay vì một set-up studio hoàn hảo, chúng tôi chọn một nguồn sáng duy nhất: ánh sáng cửa sổ. Vẻ đẹp thực sự nằm ở 'chiaroscuro' – nghệ thuật tương phản gắt giữa sáng và tối. Bóng tối không phải là sự thiếu vắng ánh sáng; nó là công cụ để định hình, để che giấu, và để mời gọi sự tò mò. Nơi ánh sáng kết thúc cũng là nơi câu chuyện bắt đầu."
      },
      {
        type: 'heading',
        content: 'Sự thật trong kết cấu',
      },
      {
        type: 'imageRow',
        images: [Personal_01_thumnails, Personal_01_thumnails], 
      },
      {
        type: 'imageRow',
        images: [Personal_01_thumnails, Personal_01_thumnails], 
      },
      {
        type: 'imageRow',
        images: [Personal_01_thumnails, Personal_01_thumnails], 
      },
      {
        type: 'imageRow',
        images: [Personal_01_thumnails, Personal_01_thumnails], 
      },
      {
        type: 'paragraph',
        content: "Dự án này là một tuyên ngôn chống lại sự hoàn hảo kỹ thuật số. Chúng tôi tôn vinh kết cấu (texture) – sự thô ráp của da, sự mềm mại của tóc, sự gợn sóng của vải. Đó là những di sản của sự sống, được ánh sáng khắc họa một cách trung thực và đầy tự tin."
      }
    ]
  },
  // ----------------------------------------------------
  // DỰ ÁN 4: HOKKAIDO 
  // ----------------------------------------------------
  {
    id: 4,
    slug: 'ngon-lua-giua-tuyet',
    title: "Ngọn lửa giữa Tuyết",
    src: Fashion_02_thumnails,
    category: 'Thời trang',
    cateSlug: 'thoi-trang',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-2',
    featured: false, // <-- Đánh dấu là dự án "tiêu biểu"
    description: "Dự án cá nhân này khám phá sự tương phản giữa cái lạnh buốt của ngoại cảnh và hơi ấm nội tâm...",
    credits: [
      { label: 'Producer', value: 'Thanh Hang - Choo Production' },
      { label: 'Art Director', value: 'Thien Nguyen' },
      { label: 'Photographer', value: 'Evis Tran' },
      { label: 'Model', value: 'Mai Phuoc Tri, Nguyễn Văn Long, Huế Hương, Fuka' },
      { label: 'Stylist', value: 'Bao Ngan' },
      { label: 'Stylist Assistant', value: 'Js Chucin' },
      { label: 'Lighting', value: 'An Pham, Huy Tran, Dat Ho Thanh' },
      { label: 'MUA', value: 'Hai Ngoc Nguyen, Tu Anh, Tu Linh' },
      { label: 'Set Designer', value: 'Harry Le, Long Tran' },
      { label: 'Accessories', value: 'Dat Duong' },
      { label: 'Support', value: 'Ngoc Ha' },
      { label: 'Location', value: 'Oni Studio' },
    ],
    align: 'left',
    articleBody: [
      {
        type: 'heading',
        content: 'Sức sống mỏng manh',
      },
      {
        type: 'imageRow',
        images: [Fashion_02_thumnails, Fashion_02_thumnails, Fashion_02_thumnails, Fashion_02_thumnails, Fashion_02_thumnails, Fashion_02_thumnails, Fashion_02_thumnails, Fashion_02_thumnails], // <-- THAY THẾ BẰNG ẢNH GALLERY CỦA BẠN
      },
      {
        type: 'paragraph',
        content: "Ngọn lửa không chỉ là một đạo cụ; nó là nhân vật chính thứ hai. Giữa khung cảnh bao la, gần như đơn sắc của tuyết trắng, ánh lửa đỏ cam trở thành tuyên ngôn duy nhất về sự tồn tại. Đây là cuộc đối thoại giữa hai thái cực: sự vĩnh cửu của thiên nhiên và sự ngắn ngủi của khoảnh khắc."
      },
      {
        type: 'heading',
        content: 'Bản giao hưởng của kỷ luật',
      },
      {
        type: 'imageRow',
        images: [Fashion_02_thumnails], 
      },
      {
        type: 'paragraph',
        content: "Chụp trong điều kiện khắc nghiệt dưới 0 độ C đòi hỏi sự chuẩn bị kỹ thuật và một tinh thần kỷ luật. Hơi thở ngưng tụ trong không khí, ánh sáng yếu ớt của mùa đông, và sự tương phản màu sắc cực độ - tất cả góp phần tạo nên một trải nghiệm thị giác đầy nội lực, nơi sự thanh lịch được định nghĩa bằng sức mạnh."
      }
    ]
  },
  // ----------------------------------------------------
  // DỰ ÁN 5: L'OFFICIEL 
  // ----------------------------------------------------
  {
    id: 5,
    slug: 'hoi-tho-golden-hour',
    title: "Hơi thở 'Golden Hour'",
    src: Fashion_03_thumnails,
    category: 'Thời trang',
    cateSlug: 'thoi-trang',
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-1',
    featured: true, // <-- Đánh dấu là dự án "tiêu biểu"
    description: "Một bộ ảnh editorial khám phá sự kết nối giữa con người và thiên nhiên...",
    credits: [
      { label: 'Producer', value: 'Thanh Hang - Choo Production' },
      { label: 'Art Director', value: 'Thien Nguyen' },
      { label: 'Photographer', value: 'Evis Tran' },
      { label: 'Model', value: 'Mai Phuoc Tri, Nguyễn Văn Long, Huế Hương, Fuka' },
      { label: 'Stylist', value: 'Bao Ngan' },
      { label: 'Stylist Assistant', value: 'Js Chucin' },
      { label: 'Lighting', value: 'An Pham, Huy Tran, Dat Ho Thanh' },
      { label: 'MUA', value: 'Hai Ngoc Nguyen, Tu Anh, Tu Linh' },
      { label: 'Set Designer', value: 'Harry Le, Long Tran' },
      { label: 'Accessories', value: 'Dat Duong' },
      { label: 'Support', value: 'Ngoc Ha' },
      { label: 'Location', value: 'Oni Studio' },
    ],
    align: 'right',
    articleBody: [
      {
        type: 'heading',
        content: 'Đối thoại với hoàng hôn',
      },
      {
        type: 'imageRow',
        images: [Fashion_03_thumnails, Fashion_03_thumnails], 
      },
      {
        type: 'paragraph',
        content: "Chúng tôi không 'set-up' ánh sáng. Chúng tôi 'chờ đợi' nó. 'Golden hour' là một khoảnh khắc ngắn ngủi, nơi ánh sáng không chỉ chiếu rọi, mà còn 'chạm' vào vạn vật. Ánh sáng vàng óng, xuyên qua đồng cỏ lau, biến chất liệu vải thành một dòng chảy lụa là, và làn da trở nên mềm mại hơn bao giờ hết."
      },
      {
        type: 'heading',
        content: 'Sự sang trọng của tĩnh lặng',
      },
      {
        type: 'imageRow',
        images: [Fashion_03_thumnails, Fashion_03_thumnails,Fashion_03_thumnails], 
      },
      {
        type: 'imageRow',
        images: [Fashion_03_thumnails, Fashion_03_thumnails,Fashion_03_thumnails], 
      },
      {
        type: 'imageRow',
        images: [Fashion_03_thumnails, Fashion_03_thumnails,Fashion_03_thumnails], 
      },
      {
        type: 'imageRow',
        images: [Fashion_03_thumnails, Fashion_03_thumnails,Fashion_03_thumnails], 
      },
      {
        type: 'imageRow',
        images: [Fashion_03_thumnails, Fashion_03_thumnails,Fashion_03_thumnails], 
      },
      {
        type: 'paragraph',
        content: "Bối cảnh Đà Lạt không chỉ là một địa điểm, đó là một trạng thái tâm trí. Sự an yên tuyệt đối được thể hiện qua từng dáng pose thư thái, từng ánh nhìn mơ màng. Đây là 'quiet luxury in motion' – sự sang trọng của những người không cần phô diễn, nhưng ý thức mạnh mẽ về vẻ đẹp nội tại của mình."
      }
    ]
  },
  // ----------------------------------------------------
  // DỰ ÁN 6: DIOR 
  // ----------------------------------------------------
  {
    id: 6,
    slug: 'khoanh-khac-playful-dior',
    title: "Khoảnh khắc 'Playful' Dior",
    src: Commercial_02_thumnails,
    category: 'Thương mại',
    cateSlug: 'thuong-mai',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    featured: true, // <-- Đánh dấu là dự án "tiêu biểu"
    description: "Nắm bắt tinh thần trẻ trung, phá cách tại sự kiện độc quyền của Dior...",
    credits: [
      { label: 'Producer', value: 'Thanh Hang - Choo Production' },
      { label: 'Art Director', value: 'Thien Nguyen' },
      { label: 'Photographer', value: 'Evis Tran' },
      { label: 'Model', value: 'Mai Phuoc Tri, Nguyễn Văn Long, Huế Hương, Fuka' },
      { label: 'Stylist', value: 'Bao Ngan' },
      { label: 'Stylist Assistant', value: 'Js Chucin' },
      { label: 'Lighting', value: 'An Pham, Huy Tran, Dat Ho Thanh' },
      { label: 'MUA', value: 'Hai Ngoc Nguyen, Tu Anh, Tu Linh' },
      { label: 'Set Designer', value: 'Harry Le, Long Tran' },
      { label: 'Accessories', value: 'Dat Duong' },
      { label: 'Support', value: 'Ngoc Ha' },
      { label: 'Location', value: 'Oni Studio' },
    ],
    align: 'left',
    articleBody: [
      {
        type: 'heading',
        content: 'Tuyên ngôn của sự nổi loạn',
      },
      {
        type: 'imageRow',
        images: [Commercial_02_thumnails], 
      },
      {
        type: 'imageRow',
        images: [Commercial_02_01, Commercial_02_02], 
      },
      {
        type: 'paragraph',
        content: "Hình ảnh kẹo cao su không phải là một sự ngẫu hứng. Đó là một tuyên ngôn có chủ đích, một khoảnh khắc 'playful' phá vỡ sự trang trọng của di sản Dior. Nó là khoảnh khắc của sự tự do, một cú nháy mắt đầy thách thức, thể hiện tinh thần của một thế hệ mới không ngại tái định nghĩa sự sang trọng."
      },
      {
        type: 'heading',
        content: 'Ánh sáng và năng lượng',
      },
      {
        type: 'imageRow',
        images: [Commercial_02_02, Commercial_02_03], 
      },
       {
        type: 'imageRow',
        images: [Commercial_02_02, Commercial_02_03], 
      },
      {
        type: 'paragraph',
        content: "Để bắt trọn năng lượng này, ánh sáng flash sắc nét (hard light) được sử dụng để 'đóng băng' khoảnh khắc, tạo ra sự kịch tính và làm nổi bật màu sắc. Bối cảnh Pop-up Store, với kiến trúc hiện đại, trở thành một sân khấu cho cá tính, nơi mỗi bức ảnh là một tuyên ngôn về phong cách."
      }
    ]
  },
  // ----------------------------------------------------
  // DỰ ÁN 7: SG 1990 
  // ----------------------------------------------------
  {
    id: 7,
    slug: 'net-lang-du-sai-gon-thap-nien-90',
    title: "Nét Lãng Du Sài Gòn Thập Niên 90",
    src: Personal_02_thumnails,
    category: 'Cá nhân',
    cateSlug: 'ca-nhan',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    featured: true, // <-- Đánh dấu là dự án "tiêu biểu"
    description: "Không khí hoài cổ, lãng mạn và có chút bụi bặm của Sài Gòn những năm 90.",
    credits: [
      { label: 'Producer', value: 'Le Minh Phat' },
      { label: 'Art Director', value: 'Thien Nguyen' },
      { label: 'Photographer', value: 'Evis Tran' },
      { label: 'Model', value: 'Tran Hai Dang' },
      { label: 'Stylist', value: 'Bao Ngan' },
      { label: 'Stylist Assistant', value: 'Nguyen Phuong Vy' },
      { label: 'Lighting', value: 'An Pham, Huy Tran, Dat Ho Thanh' },
      { label: 'MUA', value: 'Hai Ngoc Nguyen, Tu Anh, Tu Linh' },
      { label: 'Set Designer', value: 'Harry Le, Long Tran' },
      { label: 'Accessories', value: 'Dat Duong' },
      { label: 'Support', value: 'Ngoc Ha' },
      { label: 'Location', value: 'Oni Studio' },
    ],
    align: 'right',
    articleBody: [
      {
        type: 'heading',
        content: 'Ý Tưởng & Chủ Đề',
      },
      {
        type: 'imageRow',
        images: [Personal_02_thumnails], 
      },
      {
        type: 'imageRow',
        images: [Personal_02_02, Personal_02_03, Personal_02_04, Personal_02_05], 
      },
      {
        type: 'paragraph',
        content: "Buổi chụp ảnh này sẽ tái hiện lại không khí hoài cổ, lãng mạn và có chút bụi bặm của Sài Gòn những năm 90. Chúng ta sẽ tập trung vào hình ảnh một chàng trai trẻ với phong cách thời trang 'high-fashion' nhưng vẫn giữ được nét thanh lịch, hòa mình vào khung cảnh đời thường của một con phố cũ. Bức ảnh sẽ mang đậm hơi thở của một tạp chí thời trang vintage, nơi sự giao thoa giữa quá khứ và hiện tại tạo nên một vẻ đẹp độc đáo."
      },
      {
        type: 'heading',
        content: 'Mục Tiêu & Phong Cách',
      },
      {
        type: 'imageRow',
        images: [Personal_02_06, Personal_02_07], 
      },
      {
        type: 'imageRow',
        images: [Personal_02_08, Personal_02_09], 
      },
      {
        type: 'paragraph',
        content: "Mục tiêu chính là tạo ra những bức ảnh chân dung toàn thân có tính nghệ thuật cao, lột tả được vẻ đẹp của thời trang và không gian. Phong cách ảnh sẽ là vintage với tông màu ấm, hơi ám vàng và hiệu ứng film fade để tăng tính hoài niệm. Ánh sáng tự nhiên kết hợp với chút ánh sáng nhân tạo (nếu cần) để tạo độ moody và sâu cho bức hình. Chàng trai sẽ thể hiện nhiều dáng pose tự nhiên, toát lên vẻ lãng tử, suy tư và cuốn hút."
      }
    ]
  },
];