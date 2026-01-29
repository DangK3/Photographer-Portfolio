import { NextResponse } from 'next/server';
import { createBooking } from '@/lib/actions/bookings';

export async function GET() {
  // 1. Giả lập dữ liệu Booking
  const payload = {
    customerId: 1, // Đảm bảo ID này có trong DB
    staffId: 1,    // Đảm bảo ID này có trong DB
    deposit: 0,
    discount: 0,
    notes: "Test Race Condition",
    items: [
      {
        roomId: 1, // Đảm bảo ID này có trong DB
        startDt: "2026-05-20T08:00:00+07:00", // Chọn ngày xa hẳn để tránh trùng dữ liệu cũ
        endDt: "2026-05-20T10:00:00+07:00",
        price: 500000
      }
    ],
    services: []
  };

  console.log("🚀 Bắt đầu Race Condition Test...");

  // 2. Định nghĩa mảng Requests
  // Việc tách biến 'requests' giúp TS hiểu đây là mảng động, không phải Tuple cố định
  const requests = [
    createBooking(payload),
    createBooking(payload)
  ];

  // Chạy song song
  const results = await Promise.all(requests);

  // 3. Phân tích kết quả
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return NextResponse.json({
    message: "Test hoàn tất",
    summary: {
      success: successCount,
      fail: failCount,
      conclusion: successCount === 1 && failCount === 1 
        ? "✅ TEST PASSED: Hệ thống đã chặn được trùng lịch!" 
        : "❌ TEST FAILED: Cả 2 đơn đều lọt (Lỗi dữ liệu) hoặc cả 2 đều tạch."
    },
    // Trả về chi tiết để debug nếu cần
    details: results 
  });
}
