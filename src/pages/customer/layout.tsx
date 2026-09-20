import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { ButtonLink } from '@/components/ui/button'
import { PORTALS } from '@/constants/nav'
import { ROUTES } from '@/constants/routes'
import { property } from '@/data/customer'

export function CustomerLayout() {
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
          <p className="text-[14px] text-fg-2">
            <a href="#" className="underline-offset-4 hover:text-fg hover:underline">
              3 unread notifications
            </a>
          </p>
        </>
      }
    >
      <Outlet />
    </AppShell>
  )
}
