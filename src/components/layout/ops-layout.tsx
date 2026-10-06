import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { PORTALS } from '@/config/portals'

/* Children replace the Outlet while the first page module is still loading, so the rail never pops in late. */
export function OpsLayout({ children }: { children?: ReactNode }) {
  return <AppShell portal={PORTALS.ops}>{children ?? <Outlet />}</AppShell>
}
