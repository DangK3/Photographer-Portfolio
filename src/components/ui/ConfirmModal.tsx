// src/components/ui/ConfirmModal.tsx
'use client';

import React, { useEffect } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  isLoading = false,
  variant = 'danger'
}: ConfirmModalProps) {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    // Khóa cuộn trang khi mở Modal
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // 1. Container FIXED bao trùm toàn màn hình, Z-Index cực cao
    <div className="fixed inset-0 z-[9999] flex items-baseline justify-center p-4 sm:p-6">
      
      {/* 2. Backdrop (Nền tối) */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={isLoading ? undefined : onClose} 
      />

      {/* 3. Modal Content */}
      <div className="relative w-full max-w-md bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl shadow-2xl transform transition-all animate-fade-in-up flex flex-col overflow-hidden z-[10000]">
        
        {/* Close Button (Nằm tuyệt đối góc phải, không đè nội dung) */}
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 text-[var(--admin-sub)] hover:text-[var(--admin-fg)] hover:bg-[var(--admin-bg)] rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Header Area */}
        <div className="p-6 pb-2 flex gap-5">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            variant === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 
            variant === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
          }`}>
            <AlertTriangle size={24} />
          </div>
          
          <div className="flex-1 pt-1 pr-6"> {/* Padding phải để tránh nút X */}
            <h3 className="text-lg font-bold text-[var(--admin-fg)] leading-tight mb-2">
              {title}
            </h3>
            <p className="text-sm text-[var(--admin-sub)] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 pt-6 flex justify-end gap-3 bg-[var(--admin-bg)]/50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--admin-fg)] border border-[var(--admin-border)] hover:bg-[var(--admin-hover)] transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              px-5 py-2.5 rounded-xl text-sm font-medium text-white shadow-lg flex items-center gap-2 transition-all hover:translate-y-[-1px]
              ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-indigo-600 hover:bg-indigo-700'}
              disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
            `}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}