// src/app/test-error/page.tsx

export default function TestErrorPage() {
  // Dòng này sẽ cố tình gây ra lỗi server
  throw new Error('Đây là lỗi server mô phỏng!');

  // (Code bên dưới sẽ không bao giờ chạy)
  return (
    <div>
      Trang này sẽ không bao giờ hiển thị
    </div>
  );
}