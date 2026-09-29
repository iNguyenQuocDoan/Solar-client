import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/common/ui/button'
import { Input } from '@/components/common/ui/field'
import { PORTALS } from '@/config/portals'
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
            <span className="sr-only">Tìm khách hàng, khách tiềm năng hoặc báo giá</span>
            <Input size="sm" type="search" placeholder="Tìm khách hàng, khách tiềm năng, báo giá" className="text-meta" />
          </label>
          <Button variant="primary" size="sm">
            Yêu cầu mới
          </Button>
        </>
      }
    >
      {children ?? <Outlet />}
    </AppShell>
  )
}
