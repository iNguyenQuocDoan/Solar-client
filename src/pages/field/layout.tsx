import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { PORTALS } from '@/constants/nav'
import { fieldContext } from '@/data/field'

/* Children replace the Outlet while the first page module is still loading, so the rail never pops in late. */
export function FieldLayout({ children }: { children?: ReactNode }) {
  return (
    <AppShell
      portal={PORTALS.field}
      context={
        <>
          <p className="font-medium text-fg">{fieldContext.team}</p>
          <p>{fieldContext.hub}</p>
        </>
      }
      tools={
        <Button variant="danger" size="sm">
          SOS dispatch
        </Button>
      }
    >
      {children ?? <Outlet />}
    </AppShell>
  )
}
