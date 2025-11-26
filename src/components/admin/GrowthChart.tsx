// src/components/admin/GrowthChart.tsx
'use client';

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { MonthlyStat } from '@/lib/actions';

export default function GrowthChart({ data }: { data: MonthlyStat[] }) {
  return (
    <div className="w-full h-[350px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            {/* Gradient màu tím đẹp mắt */}
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="name" 
            stroke="var(--admin-sub)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="var(--admin-sub)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            allowDecimals={false} // Chỉ hiện số nguyên
          />
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
          
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--admin-card)', 
              borderColor: 'var(--admin-border)', 
              borderRadius: '8px',
              color: 'var(--admin-fg)'
            }}
            itemStyle={{ color: 'var(--admin-primary)' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="var(--admin-primary)" 
            fillOpacity={1} 
            fill="url(#colorTotal)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}