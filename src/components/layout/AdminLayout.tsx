import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { ROUTES } from '@/routes/paths'
import { adminNav } from '@/config/nav'
import { roleLabels } from '@/config/roles'
import { useAuth } from '@/context/AuthProvider'

/** Tương đương app/(admin)/layout.tsx – bọc mọi route /admin/* */
export function AdminLayout() {
  const { user } = useAuth()
  const name = user?.name ?? ''
  const role = roleLabels.admin

  return (
    <AppShell
      sidebar={{
        variant: 'admin',
        brand: { title: 'Smart Solar', subtitle: 'Quản trị hệ thống', logoSrc: '/placeholders/logo.svg' },
        eyebrow: 'Quản trị nền tảng',
        items: adminNav,
        rootHref: ROUTES.ADMIN.DASHBOARD,
        user: { name, title: role, icon: 'account_circle' },
      }}
      header={{ logoSrc: '/placeholders/logo.svg', user: { name, role } }}
    >
      <Outlet />
    </AppShell>
  )
}
