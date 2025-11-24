// src/app/admin/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
// 1. XÓA IMPORT CŨ: import { supabase } from '../../../lib/supabase';
// 2. THÊM IMPORT MỚI:
import { createBrowserClient } from '@supabase/ssr';

import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Users,
  Menu,
  X,
  Home,
  Clock,
  LayoutTemplate // Icon cho menu Grid
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import localFont from 'next/font/local'; 

const logoFont = localFont({
  src: '../../fonts/cameliya-regular.ttf',
  display: 'swap',
  variable: '--font-logo',
});

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SESSION_DURATION_HOURS = 3; 
const SESSION_DURATION_MS = SESSION_DURATION_HOURS * 60 * 60 * 1000;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  // 3. KHỞI TẠO CLIENT SUPABASE HỖ TRỢ COOKIE
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('--:--:--');

  // --- LOGIC CHECK AUTH ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkAuth = async () => {
      try {
        // Lệnh này giờ sẽ đọc được Cookie do trang Login tạo ra
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Nếu không có session, đẩy về login
          router.replace('/login');
          return;
        }

        // --- Logic đếm ngược ---
        if (session.user?.last_sign_in_at) {
          const lastSignIn = new Date(session.user.last_sign_in_at).getTime();
          const expiryTime = lastSignIn + SESSION_DURATION_MS;

          const updateTimer = () => {
            const now = Date.now();
            const diff = expiryTime - now;

            if (diff <= 0) {
              clearInterval(intervalId);
              supabase.auth.signOut().then(() => {
                toast.warning('Phiên làm việc đã hết hạn.');
                router.replace('/login');
              });
              return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
          };

          updateTimer();
          intervalId = setInterval(updateTimer, 1000);
        }
        
        // QUAN TRỌNG: Phải set false để tắt Loading spinner
        setIsCheckingAuth(false);

      } catch (error) {
        console.error("Auth error:", error);
        router.replace('/login');
      }
    };

    checkAuth();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [router, supabase]); // Thêm supabase vào dependency

  const handleLogout = async () => {
    if (!confirm("Bạn có chắc chắn muốn đăng xuất?")) return;

    try {
      await supabase.auth.signOut();
      toast.success("Đăng xuất thành công!!");
      router.replace('/login');
      router.refresh(); // Refresh để xóa cache của Middleware
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Lỗi khi đăng xuất");
    }
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-fg)] transition-colors duration-300 font-sans">
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 
        bg-[var(--admin-card)] border-r border-[var(--admin-border)]
        transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex md:flex-col
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--admin-border)]">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-[var(--admin-primary)] rounded-lg flex items-center justify-center text-white font-bold ${logoFont.className}`}>
              O
            </div>
            <span className={`${logoFont.variable} text-xl font-bold tracking-widest text-[var(--admin-fg)] ${logoFont.className}`}>
              Oni Admin
            </span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-[var(--admin-sub)]">
            <X size={24} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-[var(--admin-sub)] uppercase tracking-wider mb-3 px-4 mt-2">Studio</div>
          <NavLink href="/admin" icon={<LayoutDashboard size={20} />} label="Tổng quan" isActive={pathname === '/admin'} onClick={handleLinkClick} />
          <NavLink href="/admin/projects" icon={<ImageIcon size={20} />} label="Dự án" isActive={pathname === '/admin/projects' || pathname === '/admin/projects/new' || pathname.startsWith('/admin/projects/')} onClick={handleLinkClick} />
          
          {/* Menu Grid Editor */}
          <NavLink 
            href="/admin/grid" 
            icon={<LayoutTemplate size={20} />} 
            label="Bố cục Portfolio" 
            isActive={pathname.startsWith('/admin/grid')} 
            onClick={handleLinkClick} 
          />

          <NavLink href="/admin/staff" icon={<Users size={20} />} label="Nhân sự" isActive={pathname.startsWith('/admin/staff')} onClick={handleLinkClick} />
          
          <div className="text-xs font-bold text-[var(--admin-sub)] uppercase tracking-wider mt-8 mb-3 px-4">Hệ thống</div>
          <NavLink href="/admin/settings" icon={<Settings size={20} />} label="Cài đặt chung" isActive={pathname.startsWith('/admin/settings')} onClick={handleLinkClick} />
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[var(--admin-border)] space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-[var(--admin-sub)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-fg)] rounded-lg transition-colors">
            <Home size={20} /> Xem Website
          </Link>
          <button onClick={handleLogout} className="flex cursor-pointer items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-[var(--admin-card)]/80 backdrop-blur-md border-b border-[var(--admin-border)] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-[var(--admin-sub)] rounded-lg">
              <Menu size={24} />
            </button>
            <h1 className="font-semibold text-lg text-[var(--admin-fg)] hidden sm:block">
              {getPageTitle(pathname)}
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-full text-xs font-mono font-medium text-[var(--admin-sub)]" title="Thời gian còn lại của phiên làm việc">
              <Clock size={14} className="text-[var(--admin-primary)] animate-pulse" />
              <span>{timeLeft}</span>
            </div>
            <div className="h-6 w-px bg-[var(--admin-border)] hidden sm:block"></div>
            <ThemeToggle isAdmin={true}/>
            <div className="flex items-center gap-3 pl-2">
              <div className="hidden md:block text-sm text-right">
                <p className="font-medium text-[var(--admin-fg)] leading-tight">Admin</p>
                <p className="text-[10px] text-[var(--admin-sub)] uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-purple-600 border-2 border-[var(--admin-card)] shadow-sm flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="mx-auto max-w-7xl animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper Components
function NavLink({ href, icon, label, isActive, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 mb-1
        ${isActive 
          ? 'bg-[var(--admin-primary)] text-[var(--admin-primary-fg)] shadow-md shadow-indigo-500/20' 
          : 'text-[var(--admin-sub)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-fg)]'
        }
      `}
    >
      {icon}
      {label}
    </Link>
  );
}

function getPageTitle(pathname: string) {
  if (pathname === '/admin') return 'Bảng tổng quan';
  if (pathname === '/admin/portfolio-grid') return 'Bố cục Grid';
  if (pathname.startsWith('/admin/projects')) return 'Quản lý Dự án';
  if (pathname.startsWith('/admin/staff')) return 'Nhân sự';
  if (pathname.startsWith('/admin/settings')) return 'Cài đặt hệ thống';
  return 'Bảng điều khiển';
}