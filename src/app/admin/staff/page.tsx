// src/app/admin/staff/page.tsx
import React from 'react';
import { getStaffList } from '@/lib/actions';
import StaffTable from '@/components/admin/StaffTable';
import StaffPageHeader from '@/components/admin/StaffPageHeader';

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
  // 1. Lấy dữ liệu từ DB
  const staffList = await getStaffList();

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-6">
      
      {/* Header & Button */}
      <StaffPageHeader total={staffList.length} />

      {/* Table List */}
      <StaffTable initialStaff={staffList} />
      
    </div>
  );
}