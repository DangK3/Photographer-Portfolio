'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createClient as createSupabaseClient } from '@supabase/supabase-js' // Chỉ dùng cho Service Role

export interface UserProfile {
  user_id: number;
  email: string;
  full_name: string;
  role: 'Admin' | 'Staff';
}

export interface StaffUser extends UserProfile {
  is_active: boolean;
  created_at: string;
  auth_id: string;
}

async function requireAdmin() {
  const supabase = await createClient(); // Sử dụng client từ @supabase/ssr

  // 1. Lấy User từ Session (Tự động đọc Cookie)
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new Error("Unauthorized: Bạn chưa đăng nhập.");
  }

  // 2. Check Role trong DB
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (profile?.role !== 'Admin') {
    throw new Error("Forbidden: Chỉ Admin mới có quyền này.");
  }

  // (Optional) Trả về user hiện tại để hàm gọi dùng tiếp đỡ phải query lại
  return user;
}


// 1. Lấy thông tin user hiện tại
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('users')
      .select('user_id, email, full_name, role')
      .eq('auth_id', user.id)
      .single();

    return profile as UserProfile;
  } catch (error) {
    console.error("Lỗi thông tin người dùng hiện tại:", error);
    return null;
  }
}

// 2. Lấy danh sách nhân viên
export async function getStaffList() {
  const supabase = await createClient();
  try {
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

// 3. Khóa/Mở khóa tài khoản
export async function toggleStaffStatus(userId: number, currentStatus: boolean) {
  try {
    // 1. Check quyền (Không cần truyền token nữa)
    const currentUser = await requireAdmin(); 

    // 2. Tạo client để thực hiện update
    const supabase = await createClient(); //

    // 3. Logic nghiệp vụ (Giữ nguyên logic cũ của bạn)
    // Lấy thông tin người bị khóa (Target) để check không tự khóa mình
    const { data: targetUser } = await supabase
      .from('users')
      .select('auth_id')
      .eq('user_id', userId)
      .single();

    if (targetUser && currentUser.id === targetUser.auth_id) {
      throw new Error("Bạn không thể tự khóa tài khoản của chính mình.");
    }

    const { error } = await supabase
      .from('users')
      .update({ is_active: !currentStatus })
      .eq('user_id', userId);

    if (error) throw error;
    
    // Revalidate nếu cần (nhớ import revalidatePath)
    // revalidatePath('/admin/staff');

    return { success: true };
  } catch (error: unknown) {
    console.error("Toggle staff error:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Lỗi hệ thống' };
  }
}

// 4. Tạo tài khoản nhân viên (Dùng Service Role)
export async function createStaffAccount(data: { email: string; password: string; fullName: string; role: string }) {
  // Service Role Key cần thiết để tạo user trong Auth mà không cần confirm email thủ công
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !projectUrl) {
    return { success: false, error: "Server chưa cấu hình Service Role Key" };
  }

  try {
    // Tạo Client quyền Admin
    const supabaseAdmin = createSupabaseClient(projectUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Tạo User bên Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Không tạo được Auth User");

    // Lưu vào bảng public.users
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        email: data.email,
        username: data.email, 
        full_name: data.fullName,
        role: data.role,
        auth_id: authData.user.id,
        is_active: true
      });

    if (dbError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id); // Rollback
      throw dbError;
    }

    revalidatePath('/admin/staff');
    return { success: true };

  } catch (error: unknown) {
    
    // Xử lý type safe
    let message = 'Lỗi không xác định';
    
    if (error instanceof Error) {
      message = error.message; // Lấy message từ Error object
    } else if (typeof error === 'string') {
      message = error; // Nếu throw "chuỗi"
    }

    // Trả về string cho Client hiển thị
    return { success: false, error: message };
  }
}

