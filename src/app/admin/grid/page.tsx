// src/app/admin/grid/page.tsx
import { getProjects } from '@/lib/actions';
import PortfolioGridEditor from '@/components/admin/PortfolioGridEditor'; // Import component vừa tạo
import { LayoutTemplate, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Bắt buộc dòng này để Next.js không cache kết quả cũ
export const dynamic = 'force-dynamic';

export default async function PortfolioGridPage() {
  // 1. Lấy dữ liệu
  const allProjects = await getProjects('all');
  
  // 2. Lọc lấy các dự án Nổi bật (Featured)
  // Chỉ những dự án này mới xuất hiện ngoài Grid trang chủ
  const featuredProjects = allProjects.filter(p => p.isFeatured);

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--admin-fg)] flex items-center gap-3">
          <LayoutTemplate className="text-[var(--admin-primary)]" size={32} />
          Bố cục dự án Nổi bật
        </h1>
        <p className="text-[var(--admin-sub)] mt-2 max-w-2xl">
          Tinh chỉnh kích thước hiển thị cho các dự án <strong>Nổi bật</strong> trên trang chủ.
        </p>
      </div>

      {/* Main Content */}
      {featuredProjects.length > 0 ? (
        <PortfolioGridEditor initialProjects={featuredProjects} />
      ) : (
        // Empty State (Khi chưa chọn dự án nổi bật nào)
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[var(--admin-border)] rounded-2xl bg-[var(--admin-card)]/50">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-semibold text-[var(--admin-fg)]">Chưa có dự án Nổi bật</h3>
          <p className="text-[var(--admin-sub)] mt-2 mb-6 max-w-md">
            Bạn cần đánh dấu <strong>Nổi bật</strong> cho ít nhất một dự án để có thể sắp xếp bố cục.
          </p>
          <Link 
            href="/admin/projects" 
            className="px-6 py-2.5 bg-[var(--admin-primary)] text-white font-medium rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-500/30"
          >
            Đến danh sách dự án
          </Link>
        </div>
      )}
    </div>
  );
}