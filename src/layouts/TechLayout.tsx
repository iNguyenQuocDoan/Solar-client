import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { ROUTES } from '@/constants/routes'
import { technicianSession } from '@/lib/mock/session'
import { technicianFooterNav, technicianNav } from '@/lib/nav'

/** Tương đương app/(technician)/layout.tsx – bọc mọi route /tech/* */
export function TechLayout() {
  return (
    <AppShell
      sidebar={{
        variant: 'technician',
        brand: { title: 'Smart Solar', subtitle: 'Field Operations', logoSrc: '/placeholders/logo.svg' },
        eyebrow: technicianSession.syncStatus,
        items: technicianNav,
        rootHref: ROUTES.TECH.DASHBOARD,
        user: { ...technicianSession.user, href: ROUTES.TECH.SETTINGS },
        footerLinks: technicianFooterNav,
      }}
      header={{
        variant: 'technician',
        location: technicianSession.location,
        telemetry: technicianSession.telemetry,
        hasUnreadAlerts: technicianSession.hasUnreadAlerts,
        alertsHref: ROUTES.TECH.ALERTS,
        profileHref: ROUTES.TECH.SETTINGS,
      }}
      mainPadding="xl"
    >
      <Outlet />
    </AppShell>
  )
}
