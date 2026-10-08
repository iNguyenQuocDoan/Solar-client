import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { CustomerShell } from '@/components/layout/customer-shell'

/*
  Cổng khách hàng dùng khung riêng (customer-shell: thanh trên kiểu website công khai), không dùng rail của các portal
  nhân viên (08/10/2026). Children replace the Outlet while the first page module is still loading.
*/
export function CustomerLayout({ children }: { children?: ReactNode }) {
  return <CustomerShell>{children ?? <Outlet />}</CustomerShell>
}
