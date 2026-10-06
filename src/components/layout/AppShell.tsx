import { useState, type ReactNode } from 'react'
import { Sidebar, type SidebarProps } from '@/components/layout/Sidebar'
import { TopHeader, type TopHeaderProps } from '@/components/layout/TopHeader'
import { cn } from '@/utils/cn'

export type AppShellProps = {
  sidebar: SidebarProps
  header: TopHeaderProps
  children: ReactNode
}

/*
 * Desktop (lg+): sidebar cố định w-52 bên trái, không có header (sidebar đã có logo + tài khoản), <main> lề 24px.
 * Dưới lg: header cố định h-14; sidebar ẩn, mở thành drawer bằng nút menu trong header; bấm overlay
 * hoặc chọn mục thì đóng (bố cục gọn 05/10/2026).
 * Thiết kế không đặt max-width cho <main>; nội dung trải hết chiều rộng còn lại.
 */
export function AppShell({ sidebar, header, children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeDrawer = () => setDrawerOpen(false)

  return (
    <div className="min-h-screen bg-surface font-jakarta text-body-md text-on-surface antialiased">
      {drawerOpen && (
        <div
          aria-hidden="true"
          onClick={closeDrawer}
          className="fixed inset-0 z-45 bg-on-background/40 backdrop-blur-[2px] lg:hidden"
        />
      )}
      <Sidebar
        {...sidebar}
        onNavigate={closeDrawer}
        className={cn(
          'transition-transform duration-200 lg:translate-x-0',
          drawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      />
      <div className="flex min-h-screen flex-col lg:pl-52">
        <TopHeader {...header} onMenuClick={() => setDrawerOpen(true)} />
        <main className="w-full flex-1 bg-surface px-space-lg pt-14 pb-space-lg lg:pt-0">
          <div className="flex w-full flex-col pt-space-lg">{children}</div>
        </main>
      </div>
    </div>
  )
}
