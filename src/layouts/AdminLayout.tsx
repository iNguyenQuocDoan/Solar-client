import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { ROUTES } from '@/constants/routes'
import { adminSession } from '@/lib/mock/session'
import { adminNav } from '@/lib/nav'

/** Tương đương app/(admin)/layout.tsx – bọc mọi route /admin/* */
export function AdminLayout() {
  return (
    <AppShell
      sidebar={{
        variant: 'admin',
        brand: { title: 'Smart Solar', subtitle: 'Quản trị hệ thống', logoSrc: '/placeholders/logo.svg' },
        eyebrow: 'Quản trị nền tảng',
        items: adminNav,
        rootHref: ROUTES.ADMIN.DASHBOARD,
        user: { ...adminSession.user, href: ROUTES.ADMIN.PROFILE },
      }}
      header={{
        variant: 'admin',
        logoSrc: '/placeholders/logo.svg',
        searchPlaceholder: adminSession.searchPlaceholder,
        environment: adminSession.environment,
        systemStatus: adminSession.systemStatus,
        unreadNotifications: adminSession.unreadNotifications,
        user: { name: adminSession.user.name, status: adminSession.user.status },
      }}
      mainPadding="lg"
    >
      <Outlet />
    </AppShell>
  )
}
