// src/components/admin/ProjectTable.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Eye, Trash2, Search, Loader2, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer'; // Cần cài: npm install react-intersection-observer
import { toast } from 'sonner';
import { deleteProject, UserProfile } from '@/lib/actions';
import { createBrowserClient } from '@supabase/ssr';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { ProjectData } from '@/data/projects-master-data';

interface ProjectTableProps {
  initialProjects: ProjectData[];
  itemsPerPage: number;
  userProfile: UserProfile | null;
}
// Định nghĩa các kiểu sort
type SortKey = 'id' | 'title' | 'categoryName' | 'isFeatured';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}

export default function ProjectTable({ initialProjects, itemsPerPage, userProfile }: ProjectTableProps) {
  // State Data
  const [projects, setProjects] = useState<ProjectData[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  // State Sort
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'desc' });
  // State Pagination
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const { ref, inView } = useInView(); // Ref để gắn vào element đáy trang

  // State Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{ id: number, title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Hàm xử lý sắp xếp
  const handleSort = (key: SortKey) => {
    setSortConfig((current) => {
      if (current.key === key) {
        // Nếu đang click cột hiện tại -> Đảo chiều
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      // Nếu click cột mới -> Mặc định tăng dần (A-Z)
      return { key, direction: 'asc' };
    });
  };
  // 3. LOGIC LỌC & SẮP XẾP (Dùng useMemo để tối ưu)
  const processedProjects = useMemo(() => {
    // A. Lọc theo Search
    const result = projects.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // B. Sắp xếp
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Xử lý trường hợp null/undefined
      if (aValue === undefined || aValue === null) return 1;
      if (bValue === undefined || bValue === null) return -1;

      // So sánh
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [projects, searchQuery, sortConfig]);

  // 2. Cắt danh sách để hiển thị (Infinite Scroll)
  const visibleProjects = processedProjects.slice(0, visibleCount);

  // 3. Tự động load thêm khi cuộn xuống đáy
  useEffect(() => {
    if (inView && visibleCount < processedProjects.length) {
      // Delay nhẹ để tạo cảm giác đang load (optional)
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + itemsPerPage);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [inView, visibleCount, processedProjects.length, itemsPerPage]);

  // Reset pagination khi search thay đổi
  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [searchQuery, itemsPerPage]);

  // 4. Logic Xóa Dự án
  const openDeleteModal = (id: number, title: string) => {
    setProjectToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Hết phiên đăng nhập");
        return;
      }

      const res = await deleteProject(session.access_token, projectToDelete.id);
      if (res.success) {
        toast.success("Đã xóa dự án");
        // Cập nhật UI ngay lập tức (Không cần reload trang)
        setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
        setDeleteModalOpen(false);
      } else {
        toast.error(res.error);
      }
    } catch (error) {
        const msg = error instanceof Error ? error.message : "Lỗi hệ thống";
        toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };
  // Component Header nhỏ để tái sử dụng
  const SortableHeader = ({ label, colKey, className = "" }: { label: string, colKey: SortKey, className?: string }) => {
    const isActive = sortConfig.key === colKey;
    return (
      <th 
        className={`p-4 cursor-pointer hover:bg-[var(--admin-hover)] transition-colors group select-none ${className}`}
        onClick={() => handleSort(colKey)}
      >
        <div className={`flex items-center gap-2 ${className.includes('text-center') ? 'justify-center' : ''}`}>
          {label}
          <span className={`text-[var(--admin-sub)] transition-opacity ${isActive ? 'opacity-100 text-[var(--admin-primary)]' : 'opacity-0 group-hover:opacity-50'}`}>
            {isActive ? (
              sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
            ) : (
              <ArrowUpDown size={14} />
            )}
          </span>
        </div>
      </th>
    );
  };
  return (
    <div className="space-y-6">
      
      {/* Toolbar */}
      <div className="flex gap-3 p-1 bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] p-4 shadow-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-sub)]" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm dự án, khách hàng..." 
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-sm outline-none focus:border-[var(--admin-primary)] text-[var(--admin-fg)] transition-all" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className="text-sm text-[var(--admin-sub)] flex items-center px-3 bg-[var(--admin-bg)] rounded-lg border border-[var(--admin-border)]">
            {processedProjects.length} kết quả
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--admin-bg)] border-b border-[var(--admin-border)] text-[var(--admin-sub)] text-xs uppercase tracking-wider">
                {/* 4. ÁP DỤNG SORTABLE HEADER */}
                <SortableHeader label="#ID" colKey="id" className="w-20 font-mono" />
                <th className="p-4 w-24">Ảnh</th>
                <SortableHeader label="Tên Dự Án" colKey="title" />
                <SortableHeader label="Danh Mục" colKey="categoryName" />
                <SortableHeader label="Trạng Thái" colKey="isFeatured" className="text-center" />
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {visibleProjects.length === 0 ? (
                <tr>
                    <td colSpan={6} className="p-12 text-center text-[var(--admin-sub)] italic">
                        Không tìm thấy dự án nào.
                    </td>
                </tr>
              ) : (
                visibleProjects.map((project, index) => (
                  <tr key={project.id} className="hover:bg-[var(--admin-hover)] transition-colors group animate-fade-in-row"
                    // 3. TÍNH TOÁN ĐỘ TRỄ (STAGGER DELAY)
                    // index % itemsPerPage giúp reset delay khi qua trang mới (nếu có pagination) 
                    // hoặc chỉ đơn giản là index * 50ms
                    style={{ 
                      animationDelay: `${(index % itemsPerPage) * 0.05}s` 
                    }}>
                    <td className="p-4 text-xs text-[var(--admin-sub)] font-mono">#{project.id}</td>
                    <td className="p-4">
                      <div className="relative w-16 h-10 bg-gray-200 rounded overflow-hidden border border-[var(--admin-border)]">
                        {project.image ? (
                           <Image 
                             src={typeof project.image === 'string' ? project.image : project.image.src} 
                             alt={project.title} 
                             fill 
                             className="object-cover" 
                           />
                        ) : <div className="w-full h-full flex items-center justify-center text-[8px]">NO IMG</div>}
                      </div>
                    </td>
                    <td className="p-4">
                      <Link href={`/admin/projects/${project.id}`} className="font-medium text-[var(--admin-fg)] hover:text-[var(--admin-primary)] transition-colors block mb-0.5">
                        {project.title}
                      </Link>
                      <span className="text-xs text-[var(--admin-sub)]">{project.client_name}</span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-fg)]">
                        {project.categoryName}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {project.isFeatured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm">
                          NỔI BẬT
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/du-an/${project.slug}`} 
                          target="_blank"
                          className="p-2 text-[var(--admin-sub)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-card)] rounded-lg"
                          title="Xem trang web"
                        >
                          <Eye size={18} />
                        </Link>
                        
                        <Link 
                          href={`/admin/projects/${project.id}`} 
                          className="p-2 text-blue-500 hover:bg-[var(--admin-edit)] rounded-lg"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </Link>
                        {/* CHỈ ADMIN MỚI THẤY */}
                        {userProfile?.role === 'Admin' && (
                          <>
                            <button 
                              onClick={() => openDeleteModal(Number(project.id), project.title)}
                              className="p-2 text-red-500 hover:bg-[var(--admin-delete)] rounded-lg cursor-pointer"
                              title="Xóa"
                            >
                              <Trash2 size={18} />
                            </button>
                           </>
                        )}
                        
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* LOADER DƯỚI CÙNG ĐỂ KÍCH HOẠT LOAD MORE */}
          {visibleProjects.length < processedProjects.length && (
             <div ref={ref} className="p-4 flex justify-center">
                <Loader2 className="animate-spin text-[var(--admin-sub)]" />
             </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal 
        isOpen={deleteModalOpen}
        onClose={() => !isDeleting && setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Xóa dự án này?"
        description={`Bạn có chắc chắn muốn xóa dự án "${projectToDelete?.title}"? Hành động này sẽ xóa vĩnh viễn toàn bộ thông tin và hình ảnh liên quan.`}
        confirmText={isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
        cancelText="Đóng"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}