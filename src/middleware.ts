// src/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. Khởi tạo Response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Khởi tạo Supabase Client cho Middleware
  // Logic này giúp đọc/ghi cookie phiên đăng nhập một cách an toàn trên Server
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Kiểm tra User (Quan trọng: dùng getUser thay vì getSession để bảo mật hơn)
  // getUser sẽ xác thực lại với Auth Server xem token còn sống không
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // --- QUY TẮC BẢO MẬT ---

  // TRƯỜNG HỢP 1: Đang cố vào trang Admin (/admin/*)
  if (url.pathname.startsWith('/admin')) {
    // Nếu chưa đăng nhập -> Đá về trang Login
    if (!user) {
      url.pathname = '/login';
      // Lưu lại trang họ định vào để sau khi login xong thì redirect lại đó (Optional)
      url.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    
    // (Tùy chọn) Nếu bạn có phân quyền (VD: user thường vs admin)
    // Thì check thêm role ở đây. Nếu chỉ có 1 admin là bạn thì không cần.
  }

  // TRƯỜNG HỢP 2: Đang cố vào trang Login (/login)
  if (url.pathname === '/login') {
    // Nếu ĐÃ đăng nhập rồi -> Không cho vào login nữa, đá thẳng vào Admin
    if (user) {
      url.pathname = '/admin'; 
      return NextResponse.redirect(url);
    }
  }

  // Nếu hợp lệ, cho đi tiếp
  return response;
}

// Cấu hình để Middleware chỉ chạy trên các route cần thiết
// Giúp tối ưu hiệu năng, không chạy trên file ảnh, static file...
export const config = {
  matcher: [
    /*
     * Match tất cả request paths ngoại trừ:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};