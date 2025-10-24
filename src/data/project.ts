import type { StaticImageData } from 'next/image'; // Import kiểu này
import btsImage1 from '../assets/section_04/bts_01.jpg'; 
import btsImage2 from '../assets/section_04/bts_02.jpg'; 
import btsImage3 from '../assets/section_04/bts_03.jpg'; 
import btsImage4 from '../assets/section_04/bts_04.jpg'; 
import btsImage5 from '../assets/section_04/bts_05.jpg'; 
import btsImage6 from '../assets/section_04/bts_06.jpg'; 

export interface Project {
  slug: string;
  title: string;
  imageUrl: StaticImageData | string;
  description: string;
  client?: string; // client có thể không bắt buộc
  year?: string;
  location?: string;
}
const projects: Project[] = 
[
{
    slug: 'su-thuc-tinh-cua-ve-nu',
    title: 'Sự Thức Tỉnh Của Vệ Nữ',
    imageUrl: btsImage1, 
    description: 'Đây là một concept "Vệ Nữ tái sinh" đầy tham vọng, thực hiện 100% trong studio. Thử thách lớn nhất là phải "thổi hồn" vào một bối cảnh hoàn toàn nhân tạo, kết hợp phông nền in khổ lớn với mô hình vỏ sò điêu khắc. Cái khó nhất là làm chủ chuyển động: một chiếc quạt công suất lớn (thấy ở tiền cảnh) được dùng liên tục để tạo hiệu ứng tóc và tà váy bay lượn. Ekip đã phải "đóng băng" khoảnh khắc đó, trong khi chuyên gia (như trong ảnh) liên tục tinh chỉnh từng chi tiết nhỏ để đạt độ hoàn hảo nhất.',
    client: 'Tạp chí Harper\'s Bazaar',
    year: '2024',
    location: 'Oni Studio, TP.HCM',
  },
  {
    slug: 'chuyen-dong-toi-gian',
    title: 'Chuyển Động Tối Giản',
    imageUrl: btsImage2, 
    description: 'Concept là một bộ lookbook thời trang tối giản. Thử thách lớn nhất với phông nền xám trơn là làm sao để chủ thể và trang phục không bị "phẳng" hay nhàm chán. Ánh sáng chính là chìa khóa. Chúng tôi dùng một set-up 3 đèn: một key-light lớn (bên trái) để tạo khối, một fill-light nhẹ (bên phải, như trợ lý đang giữ) để làm mềm bóng đổ. Mấu chốt là một đèn rim-light (đèn viền) từ phía sau để tách người mẫu khỏi nền, làm nổi bật chi tiết lông vũ trên tay áo. Cả ekip đã làm việc liên tục để tìm ra những dáng pose sắc sảo nhất.',
    client: 'Zara Studio Lookbook',
    year: '2024',
    location: 'Oni Studio, TP.HCM',
  },
  {
    slug: 'chien-binh-co-khi',
    title: 'Chiến Binh Cơ Khí',
    imageUrl: btsImage3,
    description: 'Thử thách lớn nhất khi chụp sản phẩm cơ khí, đặc biệt là một chiếc Harley, là kiểm soát sự phản chiếu. Bề mặt chrome và sơn bóng loáng như một tấm gương. Chúng tôi phải di chuyển xe vào studio một cách cẩn thận và set up nhiều nguồn sáng khuếch tán lớn (như softbox trong ảnh) để "vẽ" nên những đường highlight mềm mại, làm nổi bật đường cong của xe mà không tạo ra các điểm cháy sáng gắt. Cả ekip đã phải tỉ mỉ xoay đèn từng chút một để đảm bảo mọi chi tiết từ động cơ đến ống xả đều hiện lên sắc nét.',
    client: 'Harley-Davidson Vietnam',
    year: '2023',
    location: 'Oni Studio, TP.HCM',
  },
  {
    slug: 'phong-van-high-key',
    title: 'Phỏng Vấn "High-Key"',
    imageUrl: btsImage4,
    description: 'Đây là một buổi quay phỏng vấn/ talkshow với set-up "high-key" (nền trắng sáng). Cái khó của kỹ thuật này là phải chiếu sáng phông nền trắng phía sau thật đều và cháy sáng hơn chủ thể, trong khi vẫn phải giữ chi tiết và ánh sáng đẹp trên nhân vật. Như trong ảnh, ekip đang tinh chỉnh nhiều nguồn sáng: một softbox (key-light) cho chủ thể và các đèn khác cho nền. Chúng tôi cũng sử dụng một máy tạo khói nhẹ (bên phải) để tạo không khí, giúp ánh sáng có chiều sâu hơn và không gian trắng không bị "bằng phẳng".',
    client: 'Chương trình "Insight" - VTV',
    year: '2023',
    location: 'Oni Studio, TP.HCM',
  },
  {
    slug: 'ky-thuat-ghost-mannequin',
    title: 'Kỹ Thuật "Ghost Mannequin"',
    imageUrl: btsImage5,
    description: 'Đây là một buổi chụp sản phẩm e-commerce đòi hỏi kỹ thuật cao. Mục tiêu là làm chiếc áo "vô hình" người mặc để giữ nguyên phom dáng. Thử thách là phải treo sản phẩm bằng sợi cước siêu mỏng (như trong ảnh) và đảm bảo áo không bị xoay. Ánh sáng phải thật đều để thể hiện đúng chất liệu vải. Chúng tôi dùng một softbox parabol lớn (bên phải) làm đèn chính và một đèn phụ từ trên cao (gắn trên boom) để làm nổi bật chi tiết vai áo, giúp khâu hậu kỳ ghép ảnh (chụp trong, chụp ngoài) dễ dàng hơn.',
    client: 'Uniqlo Vietnam',
    year: '2023',
    location: 'Oni Studio, TP.HCM',
  },
  {
    slug: 've-dep-tinh-khiet',
    title: 'Vẻ Đẹp Tinh Khiết',
    imageUrl: btsImage6,
    description: 'Chụp sản phẩm mỹ phẩm luôn là một thử thách về kiểm soát ánh sáng. Cái khó nhất là xử lý bề mặt chai lọ bóng, dễ bị phản chiếu lộn xộn. Chúng tôi đã phải tạo một "lều" ánh sáng mini (hộp trắng ở giữa) để bao bọc sản phẩm. Ánh sáng được set-up tỉ mỉ: một softbox lớn (bên trái) cho ánh sáng chính, một tấm hắt sáng vàng (bên phải) để tạo viền ấm áp cho sản phẩm, và một đèn top-light (trên cao) để làm nổi bật nắp chai. Cả ekip (như bạn thấy) đang theo dõi trực tiếp qua máy tính (tethering) để tinh chỉnh từng milimet.',
    client: 'Cỏ Mềm HomeLab',
    year: '2023',
    location: 'Oni Studio, TP.HCM',
  }
];

export default projects;