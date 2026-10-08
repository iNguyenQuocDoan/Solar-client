import type { ReactNode } from 'react'
import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { PORTALS } from '@/config/portals'
import { useAuth } from '@/context/AuthProvider'
import { useProductsQuery } from '@/features/products/hooks/useProducts'
import { ROUTES } from '@/routes/paths'

/*
  Bọc mọi route /admin/*. Dùng chung shell của portal kit với khách hàng và sales (08/10/2026) để cả web một kiểu.
  Tổng số sản phẩm cạnh mục menu: cùng API với trang Sản phẩm, PageSize 1 vì chỉ cần totalItems.
*/
export function AdminLayout({ children }: { children?: ReactNode }) {
  // Layout còn là khung chờ trước RequireRole: chỉ gọi khi phiên admin đã khôi phục xong.
  const isAdmin = useAuth().user?.role === 'admin'
  const productTotal = useProductsQuery({ PageSize: 1 }, { enabled: isAdmin }).data?.totalItems
  return (
    <AppShell portal={PORTALS.admin} badges={{ [ROUTES.ADMIN.PRODUCTS]: { value: productTotal } }}>
      {children ?? <Outlet />}
    </AppShell>
  )
}
