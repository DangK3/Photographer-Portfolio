export default async function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Lấy dữ liệu phòng từ Server để render Sidebar

  return (
    <div className="flex h-[calc(100vh-136px)] overflow-hidden bg-[var(--admin-bg)] ">
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden m-4 
       shadow-sm">
        {children}
      </main>
    </div>
  )
}