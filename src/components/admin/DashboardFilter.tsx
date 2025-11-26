// src/components/admin/DashboardFilter.tsx
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarDays, ChevronDown, Check, Loader2 } from 'lucide-react';

const OPTIONS = [
  { value: '7d', label: '7 ngày qua (Tuần)' },
  { value: '30d', label: '30 ngày qua (Tháng)' },
  { value: '90d', label: '3 tháng qua (Quý)' },
  { value: '12m', label: '1 năm qua' },
  { value: 'all', label: 'Tất cả thời gian' },
];

export default function DashboardFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  // Thêm useTransition để quản lý trạng thái Loading khi chuyển đổi
  const [isPending, startTransition] = useTransition();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentRange = searchParams.get('range') || '30d';
  const activeLabel = OPTIONS.find(opt => opt.value === currentRange)?.label || 'Chọn thời gian';

  const handleSelect = (value: string) => {
    setIsOpen(false); // Đóng menu ngay lập tức

    // Bắt đầu chuyển đổi dữ liệu
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('range', value);
      
      // 1. Đẩy URL mới (scroll: false để không bị nhảy trang)
      router.push(`?${params.toString()}`, { scroll: false });
      
      // 2. QUAN TRỌNG: Bắt buộc Server Component nạp lại dữ liệu mới
      router.refresh(); 
    });
  };

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
    <div className="relative" ref={containerRef}>
      
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending} // Khóa nút khi đang load
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200
          text-sm font-medium bg-[var(--admin-card)] hover:bg-[var(--admin-hover)]
          ${isOpen 
            ? 'border-[var(--admin-primary)] ring-2 ring-[var(--admin-primary)]/10 text-[var(--admin-fg)]' 
            : 'border-[var(--admin-border)] text-[var(--admin-sub)] hover:text-[var(--admin-fg)]'
          }
          ${isPending ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        {/* Hiển thị Spinner xoay khi đang tải dữ liệu mới */}
        {isPending ? (
          <Loader2 size={16} className="animate-spin text-[var(--admin-primary)]" />
        ) : (
          <CalendarDays size={16} className={isOpen ? 'text-[var(--admin-primary)]' : 'text-[var(--admin-sub)]'} />
        )}
        
        <span className="min-w-[90px] text-left">
          {isPending ? 'Đang tải...' : activeLabel}
        </span>
        
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right overflow-hidden">
          <div className="p-1.5">
            <div className="px-3 py-2 text-[10px] font-bold text-[var(--admin-sub)] uppercase tracking-wider">
              Khoảng thời gian
            </div>
            {OPTIONS.map((opt) => {
              const isActive = opt.value === currentRange;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors
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
            })}
          </div>
        </div>
      )}
    </div>
  );
}