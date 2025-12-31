'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/supabase'

// Định nghĩa lại các Type trả về cho UI dễ dùng
// Kỹ thuật: Lấy Type dòng (Row) từ Database và mở rộng thêm quan hệ
export type RoomWithBranch = Database['public']['Tables']['rooms']['Row'] & {
  branches: { name: string; branch_code: string } | null
}

export interface ServiceItem {
  service_id: number;
  name: string;
  price: number;
  unit: string | null;
  is_active: boolean | null;
  type: 'service' | 'surcharge' | 'compensation';
  // --- THÊM DÒNG NÀY ---
  // Định nghĩa category khớp với các Tab bạn đang dùng
  category?: 'equipment' | 'fnb' | 'surcharge' | string; 
}

// ==============================================================================
// 1. CHI NHÁNH (BRANCHES)
// ==============================================================================

export async function getBranches() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('branches')
    .select('*')
    .eq('is_active', true)
    .order('created_at')

  if (error) {
    console.error('Error fetching branches:', error)
    return []
  }
  return data
}

// ==============================================================================
// 2. PHÒNG (ROOMS)
// ==============================================================================

export async function getRooms(): Promise<RoomWithBranch[]> {
  const supabase = await createClient()
  
  // Lấy phòng kèm thông tin chi nhánh (Join bảng)
  const { data, error } = await supabase
    .from('rooms')
    .select(`
      *,
      branches (
        name,
        branch_code
      )
    `)
    .order('branch_id')
    .order('code')

  if (error) {
    console.error('Error fetching rooms:', error)
    return []
  }
  
  // Ép kiểu về RoomWithBranch để TypeScript hiểu cấu trúc Join
  return data as unknown as RoomWithBranch[]
}

export async function createRoom(formData: FormData) {
  const supabase = await createClient()

  // Lấy dữ liệu từ Form
  // Lưu ý: DB v2 đã bỏ cột cleanup_minutes, dùng Global Setting nên không cần gửi lên
  const rawData = {
    branch_id: Number(formData.get('branch_id')),
    code: formData.get('code') as string,
    name: formData.get('name') as string,
    capacity: Number(formData.get('capacity') || 0),
    is_rentable: formData.get('is_rentable') === 'on',
    is_equipment_room: formData.get('is_equipment_room') === 'on',
    status: 'available' as const // ENUM: available | maintenance | inactive
  }

  const { error } = await supabase.from('rooms').insert(rawData)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/rooms')
  return { success: true }
}

export async function toggleRoomStatus(roomId: number, currentStatus: string) {
  const supabase = await createClient()
  
  // Logic đơn giản: switch giữa available <-> maintenance
  const newStatus = currentStatus === 'available' ? 'maintenance' : 'available'

  const { error } = await supabase
    .from('rooms')
    .update({ status: newStatus as 'available' | 'maintenance' | 'inactive' })
    .eq('room_id', roomId)

  if (error) return { success: false, error: error.message }
  
  revalidatePath('/admin/rooms')
  return { success: true }
}

// ==============================================================================
// 3. DỊCH VỤ & PHỤ THU (SERVICES)
// ==============================================================================

export async function getServices() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('type') // Gom nhóm theo: service, surcharge, compensation
    .order('name')

  if (error) return []
  return data
}

export async function createService(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    name: formData.get('name') as string,
    price: Number(formData.get('price')),
    // Ép kiểu ENUM service_type
    type: formData.get('type') as 'service' | 'surcharge' | 'compensation',
    unit: formData.get('unit') as string || 'item'
  }

  const { error } = await supabase.from('services').insert(rawData)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/services')
  return { success: true }
}

export async function deleteService(serviceId: number) {
    const supabase = await createClient()
    
    // Soft delete: Chỉ tắt active chứ không xóa vĩnh viễn để giữ lịch sử booking
    const { error } = await supabase
      .from('services')
      .update({ is_active: false })
      .eq('service_id', serviceId)
  
    if (error) return { success: false, error: error.message }
  
    revalidatePath('/admin/services')
    return { success: true }
}