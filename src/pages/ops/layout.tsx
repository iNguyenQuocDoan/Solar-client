import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/field'
import { PORTALS } from '@/constants/nav'
import { opsContext } from '@/data/ops'

/* Children replace the Outlet while the first page module is still loading, so the rail never pops in late. */
export function OpsLayout({ children }: { children?: ReactNode }) {
  return (
    <AppShell
      portal={PORTALS.ops}
      context={<p className="font-medium text-fg">{opsContext.team}</p>}
      tools={
        <>
          <label className="block">
            <span className="sr-only">Jump to customer, lead or quotation</span>
            <Input size="sm" type="search" placeholder="Jump to customer, lead, quotation" className="text-meta" />
          </label>
          <Button variant="primary" size="sm">
            New inquiry
          </Button>
        </>
      }
    >
      {children ?? <Outlet />}
    </AppShell>
  )
}
