// src/app/login/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// 1. XÓA dòng import supabase cũ này đi
// import { supabase } from '@/lib/supabase'; 

// 2. THÊM import này để tạo client hỗ trợ Cookie
import { createBrowserClient } from '@supabase/ssr';

import { toast } from 'sonner';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import localFont from 'next/font/local'; 

const logoFont = localFont({
  src: '../../fonts/cameliya-regular.ttf',
  display: 'swap',
  variable: '--font-logo',
});
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 3. Khởi tạo Supabase Client có khả năng ghi Cookie
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check login
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Refresh router để đảm bảo Server Component nhận được cookie mới
        router.refresh();
        router.replace('/admin');
      }
    };
    checkUser();
  }, [router, supabase]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast.success('Đăng nhập thành công');
      
      const nextUrl = searchParams.get('next');
      
      // 4. QUAN TRỌNG: Refresh Router để Middleware nhận diện Cookie mới
      router.refresh(); 
      router.replace(nextUrl || '/admin');
      
     } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Lỗi xác thực';
      toast.error('Đăng nhập thất bại: ' + msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (PHẦN GIAO DIỆN RETURN GIỮ NGUYÊN KHÔNG ĐỔI) ...
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)] p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl shadow-xl p-8 animate-fade-in-up">
        
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className={`w-12 h-12 bg-[var(--admin-primary)] rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-indigo-500/30 ${logoFont.className}`}>
            O
          </div>
          <h1 className="text-2xl font-bold text-[var(--admin-fg)]">Oni Studio Admin</h1>
          <p className="text-[var(--admin-sub)] mt-2">Đăng nhập để quản lý hệ thống</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--admin-fg)] mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-[var(--admin-sub)]" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-fg)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] focus:border-transparent outline-none transition-all"
                placeholder="admin@onistudio.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--admin-fg)] mb-1.5">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-[var(--admin-sub)]" />
              </div>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-fg)] rounded-lg focus:ring-2 focus:ring-[var(--admin-primary)] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 cursor-pointer bg-[var(--admin-primary)] text-[var(--admin-primary-fg)] rounded-lg font-medium hover:opacity-90 transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Đang xác thực...
              </>
            ) : (
              <>
                Đăng nhập
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Text */}
        <div className="mt-6 text-center text-xs text-[var(--admin-sub)]">
          <p>Chỉ dành cho nhân viên được cấp quyền.</p>
        </div>
      </div>
    </div>
  );
}

// === COMPONENT CHÍNH (WRAPPER ĐỂ FIX LỖI BUILD) ===
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-950">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}