import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { ButtonLink } from '@/components/common/ui/button'
import { PlaceholderLink } from '@/components/common/ui/placeholder-link'
import { PORTALS } from '@/config/portals'
import { ROUTES } from '@/routes/paths'
import { property } from '@/data/customer'

/* Children replace the Outlet while the first page module is still loading, so the rail never pops in late. */
export function CustomerLayout({ children }: { children?: ReactNode }) {
  return (
    <AppShell
      portal={PORTALS.customer}
      context={
        <>
          <p className="font-medium text-fg">{property.name}</p>
          <p className="tnum">Đang phát {property.liveOutputKw} kW</p>
        </>
      }
      tools={
        <>
          <ButtonLink to={ROUTES.customer.assessment} variant="primary" size="sm">
            Đánh giá mới
          </ButtonLink>
          <p className="text-body text-fg-2">
            <PlaceholderLink className="tap underline-offset-4 hover:text-fg hover:underline">
              3 thông báo chưa đọc
            </PlaceholderLink>
          </p>
        </>
      }
    >
      {children ?? <Outlet />}
    </AppShell>
  )
}
