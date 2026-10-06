import { Navigate, type RouteObject } from 'react-router'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { TechLayout } from '@/components/layout/TechLayout'
import { CustomerLayout } from '@/components/layout/customer-layout'
import { FieldLayout } from '@/components/layout/field-layout'
import { ManageLayout } from '@/components/layout/manage-layout'
import { OpsLayout } from '@/components/layout/ops-layout'
import { PageSkeleton } from '@/components/common/ui/states'
import { PlaceholderPage } from '@/pages/placeholder-page'
import { ROUTES } from '@/routes/paths'
import { RequireRole } from '@/routes/RequireRole'

const customer = ROUTES.customer
const ops = ROUTES.ops
const field = ROUTES.field
const manage = ROUTES.manage

/** Mọi đường dẫn còn lại trong portal (màn mock đã ẩn, link cũ, gõ sai) về trang có dữ liệu thật. */
const fallback = (to: string): RouteObject => ({ path: '*', element: <Navigate to={to} replace /> })

/*
  Route cần đăng nhập, mỗi portal bọc trong <RequireRole role="…">:
  chưa đăng nhập → /login (nhớ trang đích), sai vai trò → /403.

  Chỉ màn đã đổ dữ liệu thật từ backend mới có route (05/10/2026). Màn mock vẫn nằm trong
  pages/<portal>/ và data/*.ts; nối API xong thì thêm lại route ở đây và mục menu trong
  config/portals.ts (portal kit) hoặc config/nav.ts (admin, technician).
*/
export const protectedRoutes: RouteObject[] = [
  /* ---- Portal khách hàng ---- */
  {
    path: customer.home,
    element: (
      <RequireRole role="customer">
        <CustomerLayout />
      </RequireRole>
    ),
    hydrateFallbackElement: (
      <CustomerLayout>
        <PageSkeleton />
      </CustomerLayout>
    ),
    children: [
      { index: true, element: <Navigate to={customer.assessment} replace /> },
      { path: customer.assessment, lazy: () => import('@/pages/customer/assessment-page').then((m) => ({ Component: m.AssessmentPage })) },
      { path: customer.products, lazy: () => import('@/pages/catalog-page').then((m) => ({ Component: m.CustomerCatalogPage })) },
      { path: customer.product, lazy: () => import('@/pages/catalog-product-page').then((m) => ({ Component: m.CustomerCatalogProductPage })) },
      fallback(customer.assessment),
    ],
  },

  /* ---- Portal kinh doanh ---- */
  {
    path: ops.home,
    element: (
      <RequireRole role="sales">
        <OpsLayout />
      </RequireRole>
    ),
    hydrateFallbackElement: (
      <OpsLayout>
        <PageSkeleton />
      </OpsLayout>
    ),
    children: [
      { index: true, element: <Navigate to={ops.surveys} replace /> },
      { path: ops.surveys, lazy: () => import('@/pages/ops/surveys-page').then((m) => ({ Component: m.OpsSurveysPage })) },
      { path: ops.survey, lazy: () => import('@/pages/ops/survey-request-page').then((m) => ({ Component: m.OpsSurveyRequestPage })) },
      { path: ops.products, lazy: () => import('@/pages/catalog-page').then((m) => ({ Component: m.OpsCatalogPage })) },
      { path: ops.product, lazy: () => import('@/pages/catalog-product-page').then((m) => ({ Component: m.OpsCatalogProductPage })) },
      fallback(ops.surveys),
    ],
  },

  /* ---- Portal kỹ thuật viên (bộ ui) – chưa có màn nào nối API ---- */
  {
    path: field.home,
    element: (
      <RequireRole role="technician">
        <FieldLayout />
      </RequireRole>
    ),
    children: [{ index: true, element: <PlaceholderPage /> }, fallback(field.home)],
  },

  /* ---- Portal quản lý – chưa có màn nào nối API ---- */
  {
    path: manage.home,
    element: (
      <RequireRole role="manager">
        <ManageLayout />
      </RequireRole>
    ),
    children: [{ index: true, element: <PlaceholderPage /> }, fallback(manage.home)],
  },

  /* ---- Portal quản trị viên (bộ stitch-ui) ---- */
  {
    path: ROUTES.ADMIN.DASHBOARD,
    element: (
      <RequireRole role="admin">
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <Navigate to={ROUTES.ADMIN.PRODUCTS} replace /> },
      { path: 'products', lazy: () => import('@/pages/admin/ProductsPage').then((m) => ({ Component: m.ProductsPage })) },
      fallback(ROUTES.ADMIN.PRODUCTS),
    ],
  },

  /* ---- Portal kỹ thuật viên (bộ stitch-ui) – chưa có màn nào nối API ---- */
  {
    path: ROUTES.TECH.DASHBOARD,
    element: (
      <RequireRole role="technician">
        <TechLayout />
      </RequireRole>
    ),
    children: [{ index: true, element: <PlaceholderPage /> }, fallback(ROUTES.TECH.DASHBOARD)],
  },
]
