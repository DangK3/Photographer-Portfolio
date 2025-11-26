// src/components/admin/StaffTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Search, Mail, ArrowUpDown, UserX, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { StaffUser, toggleStaffStatus } from '@/lib/actions'; 
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
// 1. IMPORT MODAL
import ConfirmModal from '@/components/ui/ConfirmModal';

interface StaffTableProps {
  initialStaff: StaffUser[];
  currentUserRole: string;
  currentUserId: number;
}

type SortKey = 'full_name' | 'role' | 'email' | 'is_active';

export default function StaffTable({ initialStaff, currentUserRole, currentUserId }: StaffTableProps) {
  const [staffList, setStaffList] = useState(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'full_name', direction: 'asc' });
  
  // State cho Loading & Modal
  const [isLoading, setIsLoading] = useState(false); // Loading chung cho modal
  
  // 2. STATE QUẢN LÝ MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);

  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // --- LOGIC SORT & FILTER (Giữ nguyên) ---
  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const processedStaff = useMemo(() => {
    let data = [...staffList];
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      data = data.filter(
        (s) =>
          s.full_name?.toLowerCase().includes(lowerQuery) ||
          s.email?.toLowerCase().includes(lowerQuery) ||
          s.role?.toLowerCase().includes(lowerQuery)
      );
    }
    data.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [staffList, searchQuery, sortConfig]);

  // --- 3. HÀM MỞ MODAL ---
  const openConfirmModal = (staff: StaffUser) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  // --- 4. HÀM XỬ LÝ CHÍNH (CHẠY KHI BẤM CONFIRM TRONG MODAL) ---
  const handleConfirmToggle = async () => {
    if (!selectedStaff) return;

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Hết phiên đăng nhập');
        return;
      }

      const res = await toggleStaffStatus(session.access_token, selectedStaff.user_id, selectedStaff.is_active);

      if (res.success) {
        toast.success(`Đã ${selectedStaff.is_active ? 'khóa' : 'mở khóa'} tài khoản thành công!`);
        
        // Optimistic Update
        setStaffList((prev) =>
          prev.map((s) => (s.user_id === selectedStaff.user_id ? { ...s, is_active: !s.is_active } : s))
        );
        
        setIsModalOpen(false); // Đóng modal
        setSelectedStaff(null);
        router.refresh();
      } else {
        toast.error(`Lỗi: ${res.error}`);
      }
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Lỗi hệ thống';
        toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const SortableHeader = ({ label, colKey, className = "" }: { label: string; colKey: SortKey; className?: string }) => (
    <th 
      className={`px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-[var(--admin-hover)] transition-colors select-none group ${className}`}
      onClick={() => handleSort(colKey)}
    >
      <div className="flex items-center gap-2">
        {label}
        <ArrowUpDown size={14} className={`text-[var(--admin-sub)] transition-opacity ${sortConfig.key === colKey ? 'opacity-100 text-[var(--admin-primary)]' : 'opacity-0 group-hover:opacity-50'}`} />
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Search Bar (Giữ nguyên) */}
      <div className="flex items-center gap-4 bg-[var(--admin-card)] p-4 rounded-xl border border-[var(--admin-border)] shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-sub)]" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên, email, vai trò..." 
            className="w-full pl-10 pr-4 py-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] text-[var(--admin-fg)] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-[var(--admin-sub)]">
            Tổng: <strong>{processedStaff.length}</strong> nhân sự
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--admin-card)] rounded-xl border border-[var(--admin-border)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="bg-[var(--admin-bg)] text-[var(--admin-sub)] uppercase text-xs font-semibold border-b border-[var(--admin-border)]">
              <tr>
                <SortableHeader label="Họ và Tên" colKey="full_name" />
                <SortableHeader label="Vai trò" colKey="role" />
                <th className="px-6 py-4 whitespace-nowrap">Liên hệ</th>
                <SortableHeader label="Trạng thái" colKey="is_active" />
                <th className="px-6 py-4 text-right whitespace-nowrap">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {processedStaff.length === 0 ? (
                 <tr><td colSpan={5} className="p-8 text-center text-[var(--admin-sub)] italic">Không tìm thấy nhân viên nào.</td></tr>
              ) : (
                processedStaff.map((staff) => (
                  <tr key={staff.user_id} className={`transition-colors ${staff.is_active ? 'hover:bg-[var(--admin-hover)]' : 'bg-gray-50 dark:bg-neutral-900/50 opacity-70'}`}>
                    {/* ... (Các cột hiển thị thông tin giữ nguyên) ... */}
                    <td className="px-6 py-4 font-medium text-[var(--admin-fg)]">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm ${staff.role === 'Admin' ? 'bg-indigo-500' : 'bg-pink-500'}`}>
                          {staff.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                            <div className="whitespace-nowrap font-semibold">{staff.full_name}</div>
                            {staff.role === 'Admin' && <span className="text-[10px] text-[var(--admin-primary)] font-bold border border-[var(--admin-primary)] px-1 rounded">SUPER ADMIN</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--admin-sub)] whitespace-nowrap font-medium">{staff.role}</td>
                    <td className="px-6 py-4 text-[var(--admin-sub)] space-y-1 whitespace-nowrap">
                      <div className="flex items-center gap-2"><Mail size={14}/> {staff.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        staff.is_active 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-red-100 text-red-600 border-red-200'
                      }`}>
                        {staff.is_active ? 'Đang hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {/* CỘT HÀNH ĐỘNG */}
                     {currentUserRole === 'Admin' && staff.user_id !== currentUserId && (
                        <button 
                          onClick={() => openConfirmModal(staff)} 
                          className={`p-2 rounded-lg transition-colors group cursor-pointer ${
                              staff.is_active 
                              ? 'text-red-500 hover:bg-red-50' 
                              : 'text-green-500 hover:bg-green-50'
                          }`}
                          title={staff.is_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                        >
                          {staff.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                      )}
                      {staff.user_id === currentUserId && (
                        <span className="text-xs text-[var(--admin-sub)] italic px-2">Bạn</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. RENDER MODAL */}
      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        onConfirm={handleConfirmToggle}
        isLoading={isLoading}
        
        // Logic hiển thị động dựa trên trạng thái nhân viên
        title={selectedStaff?.is_active ? "Khóa tài khoản này?" : "Mở khóa tài khoản?"}
        
        description={selectedStaff?.is_active 
            ? `Bạn có chắc muốn khóa quyền truy cập của "${selectedStaff.full_name}"? Họ sẽ không thể đăng nhập vào hệ thống nữa.` 
            : `Bạn có chắc muốn kích hoạt lại tài khoản cho "${selectedStaff?.full_name}"? Họ sẽ có thể đăng nhập và làm việc bình thường.`
        }
        
        confirmText={selectedStaff?.is_active ? "Khóa tài khoản" : "Kích hoạt lại"}
        cancelText="Hủy bỏ"
        
        // Đổi màu sắc: Khóa = Đỏ, Mở = Xanh/Info
        variant={selectedStaff?.is_active ? 'danger' : 'info'} 
      />
    </div>
  );
}