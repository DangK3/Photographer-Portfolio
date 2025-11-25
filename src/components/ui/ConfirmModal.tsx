// src/components/ui/ConfirmModal.tsx
'use client';

import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import ModalPortal from './ModalPortal';

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

  return (
    <ModalPortal isOpen={isOpen} onClose={isLoading ? () => {} : onClose} className="max-w-md">
        
        {/* Header Area */}
        <div className="p-6 pb-2 flex gap-5">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
            variant === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 
            variant === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
          }`}>
            <AlertTriangle size={24} />
          </div>
          
          <div className="flex-1 pt-1 pr-6">
            <h3 className="text-lg font-bold text-[var(--admin-fg)] leading-tight mb-2">
              {title}
            </h3>
            <p className="text-sm text-[var(--admin-sub)] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-6 pt-6 flex justify-end gap-3 bg-[var(--admin-bg)]/50 border-t border-[var(--admin-border)]">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--admin-fg)] border border-[var(--admin-border)] hover:bg-[var(--admin-hover)] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              px-5 py-2.5 rounded-xl text-sm font-medium text-white shadow-lg flex items-center gap-2 transition-all hover:translate-y-[-1px] cursor-pointer
              ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-indigo-600 hover:bg-indigo-700'}
              disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
            `}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
    </ModalPortal>
  );
}