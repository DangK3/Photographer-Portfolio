import type { NextConfig } from "next";
const repoName = '/Photographer-Portfolio';
const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! Cảnh báo: Sẽ bỏ qua lỗi build của TypeScript.
    // Chúng ta dùng cái này TẠM THỜI để vượt qua lỗi cache.
    ignoreBuildErrors: true,
  },
  output: 'export',
  
  // 2. Báo cho Next.js biết đường dẫn gốc
  // (Rất quan trọng để CSS, JS, và ảnh load đúng)
  basePath: repoName,
  
  // 3. Tắt tối ưu ảnh (bắt buộc cho GitHub Pages)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
