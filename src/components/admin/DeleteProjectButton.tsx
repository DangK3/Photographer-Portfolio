// src/components/admin/DeleteProjectButton.tsx
'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProject } from '@/lib/actions';
import { createBrowserClient } from '@supabase/ssr';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function DeleteProjectButton({ projectId, projectTitle }: { projectId: number, projectTitle: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleDelete = async () => {
    const confirmMsg = `CẢNH BÁO: Bạn có chắc chắn muốn xóa dự án "${projectTitle}"?\nHành động này không thể hoàn tác!`;
    if (!window.confirm(confirmMsg)) return;

    setIsDeleting(true);
    const toastId = toast.loading('Đang xóa...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Không tìm thấy phiên đăng nhập. Vui lòng F5.', { id: toastId });
        setIsDeleting(false);
        setShowModal(false);
        return;
      }

      // 4. GỌI SERVER ACTION
      const res = await deleteProject(session.access_token, projectId);

      if (res.success) {
        toast.success('Đã xóa dự án', { id: toastId });
        setShowModal(false)
        // Refresh cứng để đảm bảo danh sách cập nhật sạch sẽ
        setTimeout(() => {
            window.location.reload(); 
        }, 500);
      } else {
        toast.error(`Lỗi: ${res.error}`, { id: toastId });
        setIsDeleting(false);
      }
    } catch (error) {
        const msg = error instanceof Error ? error.message : 'Có lỗi xảy ra';
        toast.error(msg, { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
  <>
      {/* Nút thùng rác (Chỉ mở Modal) */}
      <button 
        onClick={() => setShowModal(true)}
        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        title="Xóa dự án"
      >
        <Trash2 size={18} />
      </button>

      {/* Modal xác nhận */}
      <ConfirmModal 
        isOpen={showModal}
        onClose={() => !isDeleting && setShowModal(false)} // Không cho đóng khi đang xóa dở
        onConfirm={handleDelete}
        title="Xóa dự án này?"
        description={`Bạn có chắc chắn muốn xóa dự án "${projectTitle}"? Hành động này sẽ xóa vĩnh viễn toàn bộ thông tin và hình ảnh liên quan. Không thể hoàn tác.`}
        confirmText={isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
        cancelText="Hủy bỏ"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}