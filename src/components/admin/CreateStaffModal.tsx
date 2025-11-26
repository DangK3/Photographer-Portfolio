// src/components/admin/CreateStaffModal.tsx
'use client';

import React, { useState } from 'react';
import { Loader2, Mail, User, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { createStaffAccount } from '@/lib/actions';
// Import ModalPortal mới
import ModalPortal from '@/components/ui/ModalPortal';

interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateStaffModal({ isOpen, onClose }: CreateStaffModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '123@123',
    role: 'Staff'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await createStaffAccount(formData);
      if (res.success) {
        toast.success('Tạo tài khoản nhân viên thành công!');
        setFormData({ fullName: '', email: '', password: '', role: 'Staff' }); 
        onClose(); 
      } else {
        toast.error(`Lỗi: ${res.error}`);
      }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Có lỗi xảy ra.';
        toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Dùng ModalPortal bao bọc Form
  return (
    <ModalPortal 
      isOpen={isOpen} 
      onClose={isLoading ? () => {} : onClose} 
      title="Thêm Nhân viên Mới"
      className="max-w-md" // Chỉnh độ rộng ở đây
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Input Họ tên */}
          <div>
            <label className="block text-xs font-bold text-[var(--admin-sub)] uppercase mb-1.5">Họ và Tên</label>
            <div className="relative group">
                <User className="absolute left-3 top-2.5 text-[var(--admin-sub)] group-focus-within:text-[var(--admin-primary)] transition-colors" size={18} />
                <input required className="w-full pl-10 p-2.5 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-fg)] focus:ring-2 focus:ring-[var(--admin-primary)]/20 focus:border-[var(--admin-primary)] outline-none transition-all" 
                    value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="VD: Nguyễn Văn A"
                />
            </div>
          </div>

          {/* Input Email */}
          <div>
            <label className="block text-xs font-bold text-[var(--admin-sub)] uppercase mb-1.5">Email Đăng nhập</label>
            <div className="relative group">
                <Mail className="absolute left-3 top-2.5 text-[var(--admin-sub)] group-focus-within:text-[var(--admin-primary)] transition-colors" size={18} />
                <input required type="email" className="w-full pl-10 p-2.5 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-fg)] focus:ring-2 focus:ring-[var(--admin-primary)]/20 focus:border-[var(--admin-primary)] outline-none transition-all" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="nhanvien@onistudio.com"
                />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-xs font-bold text-[var(--admin-sub)] uppercase mb-1.5">Mật khẩu mặc định</label>
            <div className="relative group">
                <Lock className="absolute left-3 top-2.5 text-[var(--admin-sub)] group-focus-within:text-[var(--admin-primary)] transition-colors" size={18} />
                <input required type="text" className="w-full pl-10 p-2.5 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-fg)] focus:ring-2 focus:ring-[var(--admin-primary)]/20 focus:border-[var(--admin-primary)] outline-none font-mono transition-all" 
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Tối thiểu 6 ký tự" minLength={6}
                />
            </div>
            <p className="text-[10px] text-[var(--admin-sub)] mt-1.5 ml-1">* Nhân viên có thể đổi mật khẩu sau.</p>
          </div>

          {/* Input Role */}
          <div>
            <label className="block text-xs font-bold text-[var(--admin-sub)] uppercase mb-1.5">Vai trò</label>
            <div className="relative group">
                <Shield className="absolute left-3 top-2.5 text-[var(--admin-sub)] group-focus-within:text-[var(--admin-primary)] transition-colors" size={18} />
                <select className="w-full pl-10 p-2.5 rounded-lg bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-fg)] focus:ring-2 focus:ring-[var(--admin-primary)]/20 focus:border-[var(--admin-primary)] outline-none appearance-none cursor-pointer transition-all"
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                >
                    <option value="Staff">Staff (Nhân viên)</option>
                    <option value="Admin">Admin (Quản trị viên)</option>
                </select>
            </div>
          </div>

          {/* Button Submit */}
          <div className="pt-4">
            <button type="submit" disabled={isLoading} className="w-full py-3 bg-[var(--admin-primary)] text-white rounded-lg font-bold hover:opacity-90 transition-all shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Tạo Tài Khoản'}
            </button>
          </div>

      </form>
    </ModalPortal>
  );
}