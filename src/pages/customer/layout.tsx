import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { ButtonLink } from '@/components/ui/button'
import { PORTALS } from '@/constants/nav'
import { ROUTES } from '@/constants/routes'
import { property } from '@/data/customer'

/* Children replace the Outlet while the first page module is still loading, so the rail never pops in late. */
export function CustomerLayout({ children }: { children?: ReactNode }) {
  return (
    <AppShell
      portal={PORTALS.customer}
      context={
        <>
          <p className="font-medium text-fg">{property.name}</p>
          <p className="tnum">Generating {property.liveOutputKw} kW now</p>
        </>
      }
      tools={
        <>
          <ButtonLink to={ROUTES.customer.assessment} variant="primary" size="sm">
            New assessment
          </ButtonLink>
          <p className="text-body text-fg-2">
            <a href="#" className="underline-offset-4 hover:text-fg hover:underline">
              3 unread notifications
            </a>
          </p>
        </>
      }
    >
      {children ?? <Outlet />}
    </AppShell>
  )
}
