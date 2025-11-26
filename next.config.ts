// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {


  images: {
    remotePatterns: [
      {
        protocol: 'https',

        hostname: '**.supabase.co',

      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },

  // Tắt strict mode nếu muốn (optional), nhưng nên để true
  reactStrictMode: true, 
  
  // Tắt cảnh báo ESLint lúc build để tránh fail build vì lỗi nhỏ (Optional)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;