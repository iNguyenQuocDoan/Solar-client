import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { PORTALS } from '@/config/portals'

/* Bọc mọi route /tech/*. Dùng chung shell của portal kit; kỹ thuật viên chưa có API riêng nên dùng danh mục sản phẩm. */
export function TechLayout({ children }: { children?: ReactNode }) {
  return <AppShell portal={PORTALS.tech}>{children ?? <Outlet />}</AppShell>
}
