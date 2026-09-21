import { useState, type ReactNode } from 'react'
import { Sidebar, type SidebarProps } from '@/components/layout/Sidebar'
import { TopHeader, type TopHeaderProps } from '@/components/layout/TopHeader'
import { cn } from '@/lib/cn'

export type AppShellProps = {
  sidebar: SidebarProps
  header: TopHeaderProps
  /** Padding <main>: admin_dashboard dùng space-lg, my_tasks_1 dùng space-xl */
  mainPadding: 'lg' | 'xl'
  children: ReactNode
}

/*
 * Desktop (lg+): sidebar cố định w-72 bên trái, header cố định h-16, <main> nền surface.
 * Dưới lg: sidebar ẩn, mở thành drawer bằng nút menu trong header; bấm overlay hoặc chọn mục thì đóng.
 * Thiết kế không đặt max-width cho <main>; nội dung trải hết chiều rộng còn lại.
 */
export function AppShell({ sidebar, header, mainPadding, children }: AppShellProps) {
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
      <div className="flex min-h-screen flex-col lg:pl-72">
        <TopHeader {...header} onMenuClick={() => setDrawerOpen(true)} />
        <main
          className={cn(
            'w-full flex-1 bg-surface pt-16',
            mainPadding === 'lg' ? 'px-space-lg pb-space-lg' : 'px-space-xl pb-space-xl',
          )}
        >
          <div className="flex w-full flex-col">{children}</div>
        </main>
      </div>
    </div>
  )
}
