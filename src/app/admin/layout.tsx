// src/app/admin/layout.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  LayoutTemplate 
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import localFont from 'next/font/local'; 
import ConfirmModal from '@/components/ui/ConfirmModal';
import { getCurrentUserProfile } from '@/lib/actions';
import { getRooms, type RoomWithBranch } from '@/lib/actions/studio'; 
import NavCalendarWidget from '@/components/admin/calendar/NavCalendarWidget';
import { CalendarProvider } from '@/context/CalendarContext';

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
// Type cho thông tin user hiển thị
interface UserProfile {
  full_name: string;
  role: string;
  email: string;
}
// Giá trị mặc định nếu chưa cấu hình trong DB
const DEFAULT_TIMEOUT = 60; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false); 
  // Supabase Client
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));
  // State quản lý menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('--:--:--');

  // State lưu thời gian timeout thực tế (Lấy từ DB)
  const [idleTimeoutMinutes, setIdleTimeoutMinutes] = useState(DEFAULT_TIMEOUT);

  // Ref lưu thời điểm hoạt động cuối cùng
  const lastActivityRef = useRef<number>(Date.now());
  
  // Ref lưu giá trị timeout để dùng trong setInterval mà không cần restart interval
  const timeoutRef = useRef(idleTimeoutMinutes);

  // --- THÊM LOGIC LẤY DANH SÁCH PHÒNG ---
  const [rooms, setRooms] = useState<RoomWithBranch[]>([]);

  useEffect(() => {
    // Fetch phòng để hiển thị trong Sidebar Calendar Widget
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách phòng:", error);
      }
    };
    fetchRooms();
  }, []); // Chỉ chạy 1 lần khi mount

  // State lưu thông tin user
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  // --- 1. ĐỒNG BỘ REF VỚI STATE ---
  useEffect(() => {
    timeoutRef.current = idleTimeoutMinutes;
  }, [idleTimeoutMinutes]);

// --- 2. LẤY CẤU HÌNH TỪ DATABASE (CÓ LẮNG NGHE SỰ KIỆN) ---
  useEffect(() => {
    // Hàm lấy dữ liệu (Tách ra để tái sử dụng)
    const fetchSettings = async () => {
      try {
        const { data } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'idle_timeout_minutes')
          .single();
        
        if (data?.value) {
          const dbValue = parseInt(data.value);
          if (!isNaN(dbValue) && dbValue > 0) {
            setIdleTimeoutMinutes(dbValue);
            // Cập nhật luôn vào ref để timer nhận ngay lập tức mà không đợi vòng lặp sau
            timeoutRef.current = dbValue; 
          }
        }
      } catch (error) {
        console.error("Lỗi fetch setting:", error);
      }
    };

    // Gọi lần đầu khi load trang
    fetchSettings();

    // Lắng nghe sự kiện 'settings:updated' từ trang SettingsForm
    const handleSettingsUpdate = () => {
      console.log("Phát hiện thay đổi cài đặt -> Cập nhật lại Layout...");
      fetchSettings();
    };

    window.addEventListener('settings:updated', handleSettingsUpdate);

    // Dọn dẹp khi component unmount
    return () => {
      window.removeEventListener('settings:updated', handleSettingsUpdate);
    };
  }, [supabase]);
  // --- 3. HÀM GHI NHẬN HOẠT ĐỘNG ---
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // --- 4. LOGIC CHÍNH (CHECK AUTH & TIMER) ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const setupActivityListeners = () => {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      window.addEventListener('click', resetTimer);
      window.addEventListener('scroll', resetTimer);
      window.addEventListener('touchstart', resetTimer);
    };

    const cleanupActivityListeners = () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
    };

    const checkAuthAndStartTimer = async () => {
      try {
        // 1. Lấy Session Auth
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.replace('/login');
          return;
        }

        // 2. (MỚI) Lấy thông tin chi tiết từ bảng public.users
        // Dùng auth_id (uid) để đối chiếu
        const profile = await getCurrentUserProfile();

        if (profile) {
          setUserProfile(profile);
        } else {
          // Fallback chỉ khi không tìm thấy profile trong DB
          setUserProfile({
            full_name: session.user.email?.split('@')[0] || 'Admin',
            role: 'Staff', // Mặc định an toàn là Staff nếu lỗi
            email: session.user.email || ''
          });
        }
        // 3. Khởi động Timer
        setupActivityListeners();
        setIsCheckingAuth(false);

        intervalId = setInterval(() => {
          const now = Date.now();
          const timeSinceLastActivity = now - lastActivityRef.current;
          const currentTimeoutMs = timeoutRef.current * 60 * 1000; 
          const timeRemaining = currentTimeoutMs - timeSinceLastActivity;

          if (timeRemaining <= 0) {
            clearInterval(intervalId);
            cleanupActivityListeners();
            supabase.auth.signOut().then(() => {
              toast.warning(`Đã đăng xuất do không hoạt động quá ${timeoutRef.current} phút.`);
              router.replace('/login');
            });
            return;
          }

          const h = Math.floor(timeRemaining / (1000 * 60 * 60));
          const m = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((timeRemaining % (1000 * 60)) / 1000);
          
          setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
          
        }, 1000);

      } catch (error) {
        console.error("Auth error:", error);
        router.replace('/login');
      }
    };

    checkAuthAndStartTimer();

    return () => {
      if (intervalId) clearInterval(intervalId);
      cleanupActivityListeners();
    };
  }, [router, supabase, resetTimer]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Đăng xuất thành công!!");
      router.replace('/login');
      router.refresh();
    } catch (error) {
      const msg = (error as Error)?.message || "Lỗi không xác định";
      toast.error(msg);
    }
  };

  const handleLinkClick = () => setIsMobileMenuOpen(false);
  // Helper lấy chữ cái đầu
  const getInitials = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : 'A';
  };
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-primary)]"></div>
      </div>
    );
  }

  return (
    <CalendarProvider>
      <div className="flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-fg)] transition-colors duration-300 font-sans">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[var(--admin-card)] border-r border-[var(--admin-border)] transform transition-transform duration-300 ease-in-out shadow-xl md:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex md:flex-col`}>
          <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--admin-border)]">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-[var(--admin-primary)] rounded-lg flex items-center justify-center text-white font-bold ${logoFont.className}`}>O</div>
              <span className={`${logoFont.variable} text-xl font-bold tracking-widest text-[var(--admin-fg)] ${logoFont.className}`}>Oni Admin</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-[var(--admin-sub)]"><X size={24} /></button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
            <div className="text-xs font-bold text-[var(--admin-sub)] uppercase tracking-wider mb-3 px-4 mt-2">Studio</div>
            <NavLink href="/admin" title="Đi tới trang Tổng quan" icon={<LayoutDashboard size={20} />} label="Tổng quan" isActive={pathname === '/admin'} onClick={handleLinkClick} />
            <NavCalendarWidget rooms={rooms} />
            <NavLink href="/admin/projects" title="Quản lý dự án" icon={<ImageIcon size={20} />} label="Dự án" isActive={pathname === '/admin/projects' || pathname === '/admin/projects/new' || pathname.startsWith('/admin/projects/')} onClick={handleLinkClick} />
            <NavLink href="/admin/grid" title="Bố cục Portfolio" icon={<LayoutTemplate size={20} />} label="Bố cục Portfolio" isActive={pathname.startsWith('/admin/grid')} onClick={handleLinkClick} />
            {userProfile?.role === 'Admin' && (
              <>
                <NavLink href="/admin/staff" title="Quản lý nhân sự" icon={<Users size={20} />} label="Nhân sự" isActive={pathname.startsWith('/admin/staff')} onClick={handleLinkClick} />
              </>
            )}
          </nav>

          <div className="p-4 border-t border-[var(--admin-border)] space-y-2">
            {userProfile?.role === 'Admin' && (
              <>
                <div className="text-xs font-bold text-[var(--admin-sub)] uppercase tracking-wider mt-8 mb-3 px-4">Hệ thống</div>
                <NavLink href="/admin/settings" title="Cài đặt chung" icon={<Settings size={20} />} label="Cài đặt chung" isActive={pathname.startsWith('/admin/settings')} onClick={handleLinkClick} />
              </>
            )}
            <Link href="/" className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-[var(--admin-sub)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-fg)] rounded-lg transition-colors"><Home size={20} /> Xem Website</Link>
            <button onClick={() => setShowModal(true)} className="flex cursor-pointer items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><LogOut size={20} /> Đăng xuất</button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-[var(--admin-card)]/80 backdrop-blur-md border-b border-[var(--admin-border)] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-[var(--admin-sub)] rounded-lg"><Menu size={24} /></button>
              <h1 className="font-semibold text-lg text-[var(--admin-fg)] hidden sm:block">{getPageTitle(pathname)}</h1>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-full text-xs font-mono font-medium text-[var(--admin-sub)]" title="Tự động đăng xuất nếu không hoạt động">
                <Clock size={14} className="text-[var(--admin-primary)] animate-pulse" />
                <span>{timeLeft}</span>
              </div>
              <div className="h-6 w-px bg-[var(--admin-border)] hidden sm:block"></div>
              <ThemeToggle isAdmin={true}/>
              <div className="flex items-center gap-3 pl-2">
                  <div className="hidden md:block text-sm text-right">
                    <p className="font-medium text-[var(--admin-fg)] leading-tight">
                      {userProfile?.full_name || 'Đang tải...'}
                    </p>
                    <p className="text-[10px] text-[var(--admin-sub)] uppercase tracking-wider">
                      {userProfile?.role || '...'}
                    </p>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[var(--admin-primary)] to-purple-600 border-2 border-[var(--admin-card)] shadow-sm flex items-center justify-center text-white font-bold text-xs">
                    {getInitials(userProfile?.full_name)}
                  </div>
                </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 overflow-auto table-scrollbar">
            <ConfirmModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={handleLogout} title="Đăng xuất?" description="Bạn có chắc chắn muốn đăng xuất?" confirmText="Đăng xuất" cancelText="Hủy bỏ" variant="danger" />
            <div className="mx-auto max-w-7xl animate-fade-in-up">{children}</div>
          </main>
        </div>
      </div>
    </CalendarProvider>
  );
}

function NavLink({ href, icon, label, isActive, onClick, title }: NavLinkProps & { title?: string }) {
  return (
    <Link href={href} onClick={onClick} title={title} className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 mb-1 ${isActive ? 'bg-[var(--admin-primary)] text-[var(--admin-primary-fg)] shadow-md shadow-indigo-500/20' : 'text-[var(--admin-sub)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-fg)]'}`}>{icon}{label}</Link>
  );
}

function getPageTitle(pathname: string) {
  if (pathname === '/admin') return 'Bảng tổng quan';
  if (pathname.startsWith('/admin/grid')) return 'Bố cục Portfolio';
  if (pathname.startsWith('/admin/projects')) return 'Quản lý Dự án';
  if (pathname.startsWith('/admin/staff')) return 'Nhân sự';
  if (pathname.startsWith('/admin/settings')) return 'Cài đặt hệ thống';
  return 'Bảng điều khiển';
}