import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { ROUTES } from '@/routes/paths'
import { technicianNav } from '@/config/nav'
import { roleLabels } from '@/config/roles'
import { useAuth } from '@/context/AuthProvider'

/** Tương đương app/(technician)/layout.tsx – bọc mọi route /tech/* */
export function TechLayout() {
  const { user } = useAuth()
  const name = user?.name ?? ''
  const role = roleLabels.technician

  return (
    <AppShell
      sidebar={{
        variant: 'technician',
        brand: { title: 'Smart Solar', subtitle: 'Kỹ thuật hiện trường', logoSrc: '/placeholders/logo.svg' },
        items: technicianNav,
        rootHref: ROUTES.TECH.DASHBOARD,
        user: { name, title: role, icon: 'engineering' },
      }}
      header={{ user: { name, role } }}
    >
      <Outlet />
    </AppShell>
  )
}
