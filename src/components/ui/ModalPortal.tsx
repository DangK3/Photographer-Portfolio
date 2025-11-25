// src/components/ui/ModalPortal.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalPortalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string; // Để custom width tùy ý (sm, md, lg, xl)
}

export default function ModalPortal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  className = "max-w-md" // Mặc định độ rộng
}: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Khóa cuộn trang khi mở Modal
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Chỉ render khi đã mount client-side và isOpen = true
  if (!mounted || !isOpen) return null;

  // Dùng createPortal để đẩy Modal ra tận body
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      
      {/* 1. Backdrop (Nền tối mờ toàn màn hình) */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in" 
        onClick={onClose}
      />

      {/* 2. Modal Container (Nổi lên trên cùng) */}
      <div className={`relative w-full ${className} bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-zoom-in z-50`}>
        
        {/* Header (Nếu có title thì hiện, không thì thôi) */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[var(--admin-border)] bg-[var(--admin-bg)]/50">
            <h3 className="text-lg font-bold text-[var(--admin-fg)]">{title}</h3>
            <button 
              onClick={onClose}
              className="text-[var(--admin-sub)] hover:text-[var(--admin-fg)] p-2 hover:bg-[var(--admin-hover)] rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Nút đóng nhanh nếu không có header */}
        {!title && (
           <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[var(--admin-sub)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-hover)] rounded-full transition-colors z-10"
          >
            <X size={20} />
          </button>
        )}

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>,
    document.body // Gắn vào body
  );
}