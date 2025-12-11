'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/supabase'

export type CustomerRow = Database['public']['Tables']['customers']['Row']

// ==============================================================================
// 1. LẤY DANH SÁCH & TÌM KIẾM
// ==============================================================================

export async function getCustomers(query: string = '', limit: number = 20) {
  const supabase = await createClient()

  let dbQuery = supabase
    .from('customers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  // Tìm kiếm theo Tên hoặc SĐT
  if (query) {
    dbQuery = dbQuery.or(`full_name.ilike.%${query}%,phone.ilike.%${query}%`)
  }

  const { data, error } = await dbQuery

  if (error) {
    console.error('Error fetching customers:', error)
    return []
  }
  return data
}

export async function getCustomerById(id: number) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('customer_id', id)
    .single()

  if (error) return null
  return data
}

// ==============================================================================
// 2. TẠO & CẬP NHẬT
// ==============================================================================

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    full_name: formData.get('full_name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string || null,
    cccd: formData.get('cccd') as string || null,
    company_name: formData.get('company_name') as string || null,
    tax_code: formData.get('tax_code') as string || null,
    address: formData.get('address') as string || null,
    customer_type: formData.get('customer_type') as 'regular' | 'vip' | 'corporate' || 'regular',
    discount_rate: Number(formData.get('discount_rate') || 0),
    note: formData.get('note') as string || null
  }

  const { data, error } = await supabase
    .from('customers')
    .insert(rawData)
    .select()
    .single()

  if (error) {
    // Xử lý lỗi trùng SĐT thân thiện hơn
    if (error.code === '23505') { // Mã lỗi Unique Violation của Postgres
      return { success: false, error: 'Số điện thoại này đã tồn tại trong hệ thống.' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/customers')
  return { success: true, data }
}

export async function updateCustomer(customerId: number, formData: FormData) {
  const supabase = await createClient()

  const rawData = {
    full_name: formData.get('full_name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    cccd: formData.get('cccd') as string,
    company_name: formData.get('company_name') as string,
    tax_code: formData.get('tax_code') as string,
    address: formData.get('address') as string,
    customer_type: formData.get('customer_type') as 'regular' | 'vip' | 'corporate',
    discount_rate: Number(formData.get('discount_rate') || 0),
    note: formData.get('note') as string
  }

  const { error } = await supabase
    .from('customers')
    .update(rawData)
    .eq('customer_id', customerId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/customers')
  return { success: true }
}

// ==============================================================================
// 3. LỊCH SỬ GIAO DỊCH (CRM)
// ==============================================================================

export async function getCustomerHistory(customerId: number) {
  const supabase = await createClient()
  
  // Lấy danh sách booking của khách này
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      users (full_name) 
    `)
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}