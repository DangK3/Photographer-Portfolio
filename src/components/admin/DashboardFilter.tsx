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
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const currentRange = searchParams.get('range') || '30d';
  const activeLabel = OPTIONS.find(opt => opt.value === currentRange)?.label || 'Chọn thời gian';

  const handleSelect = (value: string) => {
    setIsOpen(false);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('range', value);
      router.push(`?${params.toString()}`, { scroll: false });
      router.refresh(); 
    });
  };

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
    // [1] Container: w-full trên mobile, w-auto trên desktop
    <div className="relative w-full md:w-auto" ref={containerRef}>
      
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`
          flex items-center justify-between gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap
          text-sm font-medium bg-[var(--admin-card)] hover:bg-[var(--admin-hover)]
          
          /* [2] Button Width: Full mobile, Auto desktop */
          w-full md:w-auto

          ${isOpen 
            ? 'border-[var(--admin-primary)] ring-2 ring-[var(--admin-primary)]/10 text-[var(--admin-fg)]' 
            : 'border-[var(--admin-border)] text-[var(--admin-sub)] hover:text-[var(--admin-fg)]'
          }
          ${isPending ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        {/* Nhóm Icon + Text nằm bên trái */}
        <div className="flex items-center gap-2">
            {isPending ? (
            <Loader2 size={16} className="animate-spin text-[var(--admin-primary)]" />
            ) : (
            <CalendarDays size={16} className={isOpen ? 'text-[var(--admin-primary)]' : 'text-[var(--admin-sub)]'} />
            )}
            
            <span className="text-left">
            {isPending ? 'Đang tải...' : activeLabel}
            </span>
        </div>
        
        {/* Mũi tên luôn nằm bên phải cùng */}
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-200 ml-2 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="
            absolute right-0 mt-2 
            bg-[var(--admin-card)] border border-[var(--admin-border)] 
            rounded-xl shadow-xl z-50 
            animate-in fade-in zoom-in-95 duration-100 origin-top-right overflow-hidden
            
            /* [3] Dropdown Width: Full mobile (để khớp với nút), w-56 trên desktop */
            w-full md:w-56
        ">
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