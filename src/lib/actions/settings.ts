// src/lib/actions/settings.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface SettingItem {
  key: string;
  value: string;
  description?: string;
}

// 1. Lấy danh sách Settings
export async function getSettings() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('key');

    if (error) throw error;
    return data as SettingItem[];
  } catch (error: unknown) {
    console.error("Error fetching settings:", error);
    return [];
  }
}

// 2. Lấy giá trị Setting Cleanup
export async function getCleanupMinutes() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'CLEANUP_GAP_MINUTES')
    .single()

  if (error || !data) return 60; 
  return Number(data.value) || 60;
}

// 3. Cập nhật Setting Cleanup
export async function updateCleanupMinutes(minutes: number) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('settings')
    .upsert({
      key: 'CLEANUP_GAP_MINUTES',
      value: minutes.toString(),
      description: 'Thời gian dọn dẹp (phút)',
      updated_at: new Date().toISOString()
    })

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/settings')
  return { success: true }
}

// 4. Cập nhật Nhiều Settings (Được chuyển từ actions.ts sang & tối ưu hóa)
export async function updateSettings(updates: { key: string; value: string }[]) {
  const supabase = await createClient();

  // 1. Check quyền Admin (Giữ nguyên logic cũ)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (profile?.role !== 'Admin') {
    return { success: false, error: 'Forbidden' };
  }

  // 2. THAY ĐỔI: Dùng upsert thay vì update
  try {
    const promises = updates.map(item => 
      supabase
        .from('settings')
        .upsert({ 
          key: item.key, // upsert cần key để biết dòng nào cần sửa
          value: item.value,
          description: item.key === 'CLEANUP_GAP_MINUTES' ? 'Thời gian dọn dẹp (phút)' : undefined, // Optional: giữ description không bị null nếu tạo mới
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' }) // Quan trọng: xác định trùng lặp dựa trên cột 'key'
    );

    const results = await Promise.all(promises);

    // Kiểm tra xem có lệnh nào bị lỗi không
    const errors = results.filter(r => r.error).map(r => r.error?.message);
    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }

    revalidatePath('/', 'layout'); 
    return { success: true };
  } catch (error: unknown) {
    let message = 'Lỗi không xác định';
    if (error instanceof Error) message = error.message;
    else if (typeof error === 'string') message = error;
    
    return { success: false, error: message };
  }
}