// src/app/admin/projects/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../../../lib/supabase';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Loader2,
  ImageIcon
} from 'lucide-react';


interface ProjectCategory {
  name: string;
}
// Định nghĩa kiểu dữ liệu cho Project
interface Project {
  project_id: number;
  title: string;
  client_name: string;
  category_id: number;
  thumbnail_url: string | null;
  is_featured: boolean;
  created_at: string;
  // Join bảng categories để lấy tên
  portfolio_categories: ProjectCategory | null;
};

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Hàm lấy dữ liệu từ Supabase
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          portfolio_categories ( name )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data as unknown as Project[]); // Ép kiểu tạm để bypass check lồng nhau
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Lỗi không xác định';
      toast.error('Lỗi tải danh sách dự án: ' + msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xóa dự án
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này không? Hành động này không thể hoàn tác.')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('project_id', id);

      if (error) throw error;
      
      toast.success('Đã xóa dự án thành công');
      // Cập nhật lại danh sách sau khi xóa
      setProjects(prev => prev.filter(p => p.project_id !== id));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Lỗi không xác định';
      toast.error('Xóa thất bại: ' + msg);
    }
  };

  // Chạy lần đầu
  useEffect(() => {
    fetchProjects();
  }, []);

  // Lọc dự án theo từ khóa tìm kiếm
  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header: Tiêu đề + Nút Thêm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-fg)]">Dự án Portfolio</h1>
          <p className="text-[var(--admin-sub)] text-sm">Quản lý tất cả các bộ ảnh đã thực hiện.</p>
        </div>
        <Link 
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-all shadow-md shadow-indigo-500/20 font-medium"
        >
          <Plus size={18} />
          Thêm Dự án mới
        </Link>
      </div>

      {/* Toolbar: Tìm kiếm + Filter */}
      <div className="flex items-center gap-4 bg-[var(--admin-card)] p-4 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-sub)]" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên dự án hoặc khách hàng..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-fg)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table View */}
      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--admin-bg)] text-[var(--admin-sub)] uppercase text-xs font-semibold border-b border-[var(--admin-border)]">
              <tr>
                <th className="px-6 py-4">Hình ảnh</th>
                <th className="px-6 py-4">Tên Dự án</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              
              {/* Loading State */}
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--admin-sub)]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" />
                      Đang tải dữ liệu...
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty State */}
              {!isLoading && filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--admin-sub)]">
                    Chưa có dự án nào. Hãy thêm dự án đầu tiên!
                  </td>
                </tr>
              )}

              {/* Data Rows */}
              {!isLoading && filteredProjects.map((project) => (
                <tr key={project.project_id} className="hover:bg-[var(--admin-hover)] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-16 h-12 relative rounded-md overflow-hidden bg-[var(--admin-bg)] border border-[var(--admin-border)]">
                      {project.thumbnail_url ? (
                         <Image 
                           src={project.thumbnail_url} 
                           alt={project.title}
                           fill
                           className="object-cover"
                         />
                      ) : (
                        <div className="flex items-center justify-center h-full text-[var(--admin-sub)]">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[var(--admin-fg)]">{project.title}</div>
                    <div className="text-xs text-[var(--admin-sub)]">{project.client_name || 'Khách lẻ'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                      {project.portfolio_categories?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {project.is_featured && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-100 dark:border-amber-800">
                        Nổi bật
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-[var(--admin-sub)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-bg)] rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(project.project_id)}
                        className="p-2 text-[var(--admin-sub)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}