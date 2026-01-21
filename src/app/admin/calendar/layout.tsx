export default async function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Lấy dữ liệu phòng từ Server để render Sidebar

  return (
<div className="flex h-[calc(100vh-136px)] bg-[var(--admin-card-opa50)] rounded-3xl">
  <main className="flex-1 flex flex-col min-w-0 shadow-sm relative">
    <div className="flex-1 overflow-y-auto min-h-0 rounded-3xl
    no-scrollbar">
       {children}
    </div>
  </main>
</div>
  )
}