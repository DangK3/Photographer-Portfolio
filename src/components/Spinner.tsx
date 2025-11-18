// src/components/Spinner.tsx

/**
 * Một component spinner đơn giản dùng Tailwind.
 */
export default function Spinner() {
  return (
    <div className="loader">
      <span className="sr-only">Đang tải...</span>
    </div>
  );
}