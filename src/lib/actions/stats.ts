// src/lib/actions/stats.ts
'use server'

import { createClient } from '@/lib/supabase/server'

// Định nghĩa Type chung cho Chart
export interface MonthlyStat {
  name: string;
  total: number;
}
interface ChartSourceItem {
  start_dt?: string;    // Có khi query bảng bookings
  created_at?: string;  // Có khi query bảng projects
}
// Helper tính ngày bắt đầu
function getStartDate(range: string) {
  const now = new Date();
  // Reset giờ để tính chính xác mốc 00:00
  now.setHours(0, 0, 0, 0); 
  
  if (range === 'today') {
    return now;
  }
  if (range === '7d') {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    return d;
  }
  if (range === '30d') {
    const d = new Date(now);
    d.setDate(d.getDate() - 30);
    return d;
  }
  if (range === '90d') {
    const d = new Date(now);
    d.setDate(d.getDate() - 90);
    return d;
  }
  if (range === '12m') {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() - 1);
    return d;
  }
  return new Date(0); // All time
}

export async function getDashboardStats(range: string = '30d') {
  const supabase = await createClient();
  try {
    const startDate = getStartDate(range).toISOString();
    
    // Range cho "Hôm nay"
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { count: totalProjects } = await supabase.from('projects').select('*', { count: 'exact', head: true });
    
    const { count: newProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate);

    const { count: totalStaff } = await supabase.from('users').select('*', { count: 'exact', head: true });

    const { count: todayBookings } = await supabase
      .from('booking_items')
      .select('*', { count: 'exact', head: true })
      .gte('start_dt', todayStart.toISOString())
      .lte('start_dt', todayEnd.toISOString());

    return {
      totalProjects: totalProjects || 0,
      newProjects: newProjects || 0,
      totalStaff: totalStaff || 0,
      todayBookings: todayBookings || 0
    };
  } catch (error) {
    console.error("Lỗi dashboard stats:", error);
    return { totalProjects: 0, newProjects: 0, totalStaff: 0, todayBookings: 0 };
  }
}

export async function getTodaySchedule() {
  const supabase = await createClient();
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('booking_items')
      .select(`
        booking_item_id,
        start_dt,
        end_dt,
        rooms ( name, code ),
        bookings ( 
          status,
          customers ( full_name, phone )
        )
      `)
      .gte('start_dt', todayStart.toISOString())
      .lte('start_dt', todayEnd.toISOString())
      .order('start_dt', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Lỗi lấy lịch hôm nay:", error);
    return [];
  }
}

// --- HÀM NÀY ĐÃ ĐƯỢC CẬP NHẬT ---
export async function getGrowthChartData(range: string = '30d', type: 'bookings' | 'projects' = 'bookings') {
    const supabase = await createClient();
    try {
        const startDate = getStartDate(range);
        let query;

        if (type === 'bookings') {
            query = supabase
                .from('booking_items')
                .select('start_dt')
                .gte('start_dt', startDate.toISOString())
                .order('start_dt', { ascending: true });
        } else {
            query = supabase
                .from('projects')
                .select('created_at')
                .gte('created_at', startDate.toISOString())
                .order('created_at', { ascending: true });
        }

        const { data, error } = await query;

        if (error || !data) {
            return [];
        }

        // 2. ÉP KIỂU TƯỜNG MINH (FIX LỖI ANY)
        // Chúng ta cho TS biết 'data' này chắc chắn là mảng các object có start_dt hoặc created_at
        const typedData = data as unknown as ChartSourceItem[];

        const isDaily = range === '7d' || range === '30d' || range === 'today';
        const statsMap = new Map<string, number>();

        // Giờ 'item' sẽ có kiểu ChartSourceItem, không còn là any
        typedData.forEach((item) => {
            const dateVal = type === 'bookings' ? item.start_dt : item.created_at;
            
            if (!dateVal) return;
            
            const date = new Date(dateVal);
            let key = '';

            if (isDaily) {
                key = `${date.getDate()}/${date.getMonth() + 1}`;
            } else {
                key = `T${date.getMonth() + 1}`;
            }
            
            statsMap.set(key, (statsMap.get(key) || 0) + 1);
        });

        return Array.from(statsMap, ([name, total]) => ({ name, total }));
    } catch (error) {
        console.error("Lỗi lấy thống kê biểu đồ:", error);
        return [];
    }
}