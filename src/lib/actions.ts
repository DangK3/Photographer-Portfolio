// src/lib/actions.ts
'use server';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { PROJECTS_MASTER_DATA, ProjectData, ArticleBlock } from '@/data/projects-master-data';
import { revalidatePath } from 'next/cache';
// 1. Định nghĩa Interface CHÍNH XÁC khớp với Database
interface ProjectRow {
  project_id: number;
  title: string;
  client_name: string | null;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
  slug: string;
  col_span: number | null;
  row_span: number | null;
  is_featured: boolean;
  
  // QUAN TRỌNG: Cột chứa nội dung bài viết
  content: ArticleBlock[] | null; 
  credits: { label: string; value: string }[] | null;

  // Join bảng categories
  portfolio_categories: {
    name: string;
    slug: string;
  } | null;
  
  // Join bảng ảnh cũ (Fallback)
  project_images: {
    image_url: string;
    display_order: number;
  }[];
}

// 2. Hàm lấy danh sách dự án, có thể lọc theo categorySlug
export async function getProjects(categorySlug?: string): Promise<ProjectData[]> {
  try {
    // --- CHECK DEMO MODE ---
    const { data: setting } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'is_demo_mode')
      .single();

    const isDemo = setting?.value === 'true';

    if (isDemo) {
      let data = PROJECTS_MASTER_DATA;
      if (categorySlug && categorySlug !== 'all') {
        data = data.filter(p => p.category === categorySlug);
      }
      return data;
    }

    // --- FETCH DATA TỪ SUPABASE ---
    let query = supabase
      .from('projects')
      .select(`
        *,
        portfolio_categories!inner ( name, slug ),
        project_images ( image_url, display_order )
      `)
      .order('display_order', { ascending: true }) 
      .order('created_at', { ascending: false });

    if (categorySlug && categorySlug !== 'all') {
      query = query.eq('portfolio_categories.slug', categorySlug);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Lỗi Supabase:', error);
      return [];
    }

    const projectsRaw = data as unknown as ProjectRow[];

    // 3. Map dữ liệu
    return projectsRaw.map((p) => {
      
      // A. Xử lý nội dung bài viết (Article Body)
      let articleBody: ArticleBlock[] = [];

      // Ưu tiên 1: Lấy từ cột 'content' (Dự án mới tạo bằng Admin Builder)
      if (p.content && Array.isArray(p.content) && p.content.length > 0) {
        articleBody = p.content;
      } 
      // Ưu tiên 2: Fallback cho dự án cũ (Tự tạo từ bảng project_images)
      else {
        const galleryImages = p.project_images
          ?.sort((a, b) => a.display_order - b.display_order)
          .map(img => img.image_url) || [];

        if (galleryImages.length > 0) {
          // Gom ảnh thành các row (mỗi row 2-3 ảnh tùy logic, ở đây để đơn giản là 1 row chứa hết)
          articleBody.push({
            type: 'imageRow',
            images: galleryImages
          });
        } else if (p.description) {
           // Nếu không có ảnh, ít nhất hiện mô tả
           articleBody.push({
             type: 'paragraph',
             content: p.description
           });
        }
      }

      // B. Trả về ProjectData chuẩn
      return {
        id: p.project_id,
        title: p.title,
        client_name: p.client_name || '',
        description: p.description || '',
        category: p.portfolio_categories?.slug || 'uncategorized',
        categoryName: p.portfolio_categories?.name || 'Chưa phân loại',
        image: p.thumbnail_url || '', 
        year: new Date(p.created_at).getFullYear().toString(),
        slug: p.slug,
        colSpan: p.col_span || 1,
        rowSpan: p.row_span || 1,
        isFeatured: p.is_featured || false,
        
        credits: p.credits || [],
        articleBody: articleBody, 
      };
    });

  } catch (error) {
    console.error('Lỗi không xác định khi lấy dự án:', error);
    return [];
  }
}

// Định nghĩa kiểu cho cập nhật layout lưới dự án
export interface ProjectGridUpdate {
  id: number;
  colSpan: number;
  rowSpan: number;
  displayOrder: number;
}

// Cập nhật layout lưới dự án
export async function updatePortfolioLayout(token: string, updates: ProjectGridUpdate[]) {
  try {
    // 1. Tạo Supabase Client với Token của người dùng đang đăng nhập
    // Điều này giúp vượt qua RLS (Row Level Security) một cách hợp lệ
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    console.log(`--> Đang cập nhật layout cho ${updates.length} dự án...`);

    // 2. Thực hiện Update từng dự án (Dùng Promise.all cho nhanh)
    const promises = updates.map(async (project) => {
      const { error } = await supabase
        .from('projects')
        .update({
          col_span: project.colSpan,
          row_span: project.rowSpan,
          display_order: project.displayOrder,
        })
        .eq('project_id', project.id);

      if (error) throw error;
    });

    await Promise.all(promises);

    // 3. Xóa Cache để Frontend cập nhật ngay lập tức
    revalidatePath('/'); 
    revalidatePath('/admin/portfolio-grid');

    return { success: true };
 } catch (error: unknown) { // Fix lỗi: đổi 'any' thành 'unknown'
    console.error("Lỗi update layout:", error);
    
    // Xử lý thông báo lỗi an toàn
    let message = 'Lỗi không xác định';
    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    }

    return { success: false, error: message };
  }
}

// Lấy chi tiết dự án theo ID
export async function getProjectById(id: number) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('project_id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

// Xóa dự án theo ID
export async function deleteProject(token: string, projectId: number) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('project_id', projectId);

    if (error) throw error;

    // Xóa cache để danh sách cập nhật ngay
    revalidatePath('/');
    revalidatePath('/admin/projects');
    revalidatePath('/admin/portfolio-grid');

    return { success: true };
  } catch (error: unknown) {
    console.error("Delete error:", error);
    return { success: false, error: 'Không thể xóa dự án này.' };
  }
}

// --- QUẢN LÝ SETTINGS ---

export interface SettingItem {
  key: string;
  value: string;
  description?: string;
}

export async function getSettings() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('key'); // Sắp xếp để hiển thị ổn định

    if (error) throw error;
    return data as SettingItem[];
  } catch (error) {
    console.error("Error fetching settings:", error);
    return [];
  }
}

export async function updateSettings(token: string, updates: { key: string; value: string }[]) {
  try {
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
      }
    );

    console.log("--> Updating settings:", updates);

    // Chạy update song song
    const promises = updates.map(item => 
      supabaseClient
        .from('settings')
        .update({ 
          value: item.value,
          updated_at: new Date().toISOString()
        })
        .eq('key', item.key)
    );

    await Promise.all(promises);

    // Revalidate toàn bộ trang web để setting mới áp dụng ngay
    revalidatePath('/', 'layout'); 
    
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi update settings';
    console.error(msg);
    return { success: false, error: msg };
  }
}


export interface StaffUser {
  user_id: number;
  email: string;
  full_name: string;
  role: 'Admin' | 'Staff';
  is_active: boolean;
  created_at: string;
  auth_id: string;
}

// 1. Lấy danh sách nhân viên
export async function getStaffList() {
  try {
    // Dùng client thường (anon) cũng được nếu đã set Policy Public Read
    // Hoặc dùng Service Role để chắc chắn lấy được hết
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as StaffUser[];
  } catch (error) {
    console.error("Error fetching staff:", error);
    return [];
  }
}

// 2. Đổi trạng thái (Khóa/Mở khóa)
export async function toggleStaffStatus(token: string, userId: number, currentStatus: boolean) {
  try {
    // Cần token của Admin đang đăng nhập để xác thực quyền
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );

    const { error } = await supabaseClient
      .from('users')
      .update({ is_active: !currentStatus })
      .eq('user_id', userId);

    if (error) throw error;
    
    revalidatePath('/admin/staff');
    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi update settings';
    console.error(msg);
    return { success: false, error: msg };
  }
}

// 3. Tạo nhân viên mới (Dùng quyền tối cao Service Role)
export async function createStaffAccount(data: { email: string; password: string; fullName: string; role: string }) {
  try {
    // A. Kiểm tra Key
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return { success: false, error: "Server chưa cấu hình Service Role Key (Kiểm tra .env.local)" };
    }

    // B. Tạo Client Admin (Bypass mọi RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // C. Tạo User bên hệ thống Auth (Tự động Confirm email)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Quan trọng: User đăng nhập được ngay không cần check mail
      user_metadata: { full_name: data.fullName }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Không tạo được Auth User");

    // D. Lưu thông tin vào bảng public.users
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        email: data.email,
        username: data.email, // Tạm dùng email làm username (unique)
        full_name: data.fullName,
        role: data.role,
        auth_id: authData.user.id, // Link với Auth ID vừa tạo
        is_active: true
      });

    if (dbError) {
      // Nếu lưu DB thất bại -> Xóa luôn user bên Auth để tránh rác data
      console.error("Lỗi lưu DB, đang rollback xóa Auth User...");
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw dbError;
    }

    // Refresh lại trang danh sách
    revalidatePath('/admin/staff');
    return { success: true };

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi tạo nhân viên';
    console.error("Create staff error:", msg);
    return { success: false, error: msg };
  }
}