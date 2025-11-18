// next.config.ts
import type { NextConfig } from "next";

// 1. Kiểm tra xem có đang chạy lệnh deploy không?
const isGithubPages = process.env.NEXT_PUBLIC_IS_GH_PAGES === 'true';

// 2. Tên repo của bạn (Thay thế đúng tên repo trên GitHub)
const repoName = '/Photographer-Portfolio'; 

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // TỰ ĐỘNG HÓA:
  // Nếu là deploy GitHub -> Dùng 'export'. Nếu local -> Dùng mặc định (undefined)
  output: isGithubPages ? 'export' : undefined,
  
  // Nếu là deploy GitHub -> Thêm tên repo. Nếu local -> Không thêm gì cả
  basePath: isGithubPages ? repoName : undefined,

  // Tắt tối ưu ảnh (GitHub Pages bắt buộc tắt cái này)
  images: {
    unoptimized: true, 
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;