import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { PORTALS } from '@/constants/nav'
import { opsContext } from '@/data/ops'

export function OpsLayout() {
  return (
    <AppShell
      portal={PORTALS.ops}
      context={<p className="font-medium text-fg">{opsContext.team}</p>}
      tools={
        <>
          <label className="block">
            <span className="sr-only">Jump to customer, lead or quotation</span>
            <input
              type="search"
              placeholder="Jump to customer, lead, quotation"
              className="h-9 w-full rounded-md border border-line bg-transparent px-3 text-[14px] text-fg placeholder:text-fg-3 focus:border-fg"
            />
          </label>
          <Button variant="primary" size="sm">
            New inquiry
          </Button>
        </>
      }
    >
      <Outlet />
    </AppShell>
  )
}
