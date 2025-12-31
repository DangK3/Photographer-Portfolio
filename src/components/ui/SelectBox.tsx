// src/components/ui/SelectBox.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  label: string;
  value: string | number;
}

interface SelectBoxProps {
  label?: string; // Label hiển thị bên trên (optional)
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode; // Icon trang trí bên trái
  className?: string;
}

export default function SelectBox({
  label,
  value,
  onChange,
  options,
  placeholder = "Chọn một tùy chọn",
  required = false,
  icon,
  className = ""
}: SelectBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tìm label của giá trị hiện tại
  const selectedLabel = options.find(opt => String(opt.value) === String(value))?.label;

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`space-y-2 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-[var(--admin-fg)]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button" // Quan trọng: type button để không submit form
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all
            bg-[var(--admin-bg)] text-left
            ${isOpen 
              ? 'border-[var(--admin-primary)] ring-2 ring-[var(--admin-primary)]/20' 
              : 'border-[var(--admin-border)] hover:border-[var(--admin-sub)]'
            }
          `}
        >
          <div className="flex items-center gap-2 truncate text-[var(--admin-fg)]">
            {icon}
            <span className={selectedLabel ? "" : "text-[var(--admin-sub)]"}>
              {selectedLabel || placeholder}
            </span>
          </div>
          <ChevronDown 
            size={18} 
            className={`text-[var(--admin-sub)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {/* DROPDOWN MENU */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden max-h-60 overflow-y-auto">
            <div className="p-1.5">
              {options.length === 0 ? (
                <div className="p-3 text-center text-sm text-[var(--admin-sub)] italic">
                  Không có dữ liệu
                </div>
              ) : (
                options.map((opt) => {
                  const isActive = String(opt.value) === String(value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(String(opt.value));
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 cursor-pointer
                        ${isActive 
                          ? 'bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] font-medium' 
                          : 'text-[var(--admin-fg)] hover:bg-[var(--admin-hover)]'
                        }
                      `}
                    >
                      <span>{opt.label}</span>
                      {isActive && <Check size={16} />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}