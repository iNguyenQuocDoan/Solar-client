import { Navigate, type RouteObject } from 'react-router'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { TechLayout } from '@/components/layout/TechLayout'
import { CustomerLayout } from '@/components/layout/customer-layout'
import { FieldLayout } from '@/components/layout/field-layout'
import { ManageLayout } from '@/components/layout/manage-layout'
import { OpsLayout } from '@/components/layout/ops-layout'
import { PageSkeleton } from '@/components/common/ui/states'
import { PlaceholderPage } from '@/pages/placeholder-page'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { ROUTES, withId } from '@/routes/paths'
import { RequireRole } from '@/routes/RequireRole'

const customer = ROUTES.customer
const ops = ROUTES.ops
const field = ROUTES.field
const manage = ROUTES.manage

/*
  Route cần đăng nhập, mỗi portal bọc trong <RequireRole role="…">:
  chưa đăng nhập → /login (nhớ trang đích), sai vai trò → /403.
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
      { index: true, lazy: () => import('@/pages/customer/overview-page').then((m) => ({ Component: m.OverviewPage })) },
      { path: customer.assessment, lazy: () => import('@/pages/customer/assessment-page').then((m) => ({ Component: m.AssessmentPage })) },
      { path: customer.estimate, lazy: () => import('@/pages/customer/estimate-page').then((m) => ({ Component: m.EstimatePage })) },
      /* Chủ hộ chỉ có một hồ sơ mở ở mỗi giai đoạn, nên route danh sách mở thẳng hồ sơ đó. */
      { path: customer.consultations, element: <Navigate to={withId(customer.consultation, 'CR-9042')} replace /> },
      { path: customer.consultation, lazy: () => import('@/pages/customer/consultation-page').then((m) => ({ Component: m.ConsultationPage })) },
      { path: customer.quotations, element: <Navigate to={withId(customer.quotation, 'QT-8821')} replace /> },
      { path: customer.quotation, lazy: () => import('@/pages/customer/quotation-page').then((m) => ({ Component: m.QuotationPage })) },
      { path: customer.projects, element: <Navigate to={withId(customer.project, 'SS-8842-CA')} replace /> },
      { path: customer.project, lazy: () => import('@/pages/customer/project-page').then((m) => ({ Component: m.ProjectPage })) },
      { path: customer.warranty, lazy: () => import('@/pages/customer/warranty-page').then((m) => ({ Component: m.WarrantyPage })) },
      { path: customer.warrantyRequest, lazy: () => import('@/pages/customer/warranty-request-page').then((m) => ({ Component: m.WarrantyRequestPage })) },
      { path: customer.assistant, lazy: () => import('@/pages/customer/assistant-page').then((m) => ({ Component: m.AssistantPage })) },
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
      { index: true, lazy: () => import('@/pages/ops/dashboard-page').then((m) => ({ Component: m.OpsDashboardPage })) },
      { path: ops.consultations, lazy: () => import('@/pages/ops/consultations-page').then((m) => ({ Component: m.OpsConsultationsPage })) },
      { path: ops.customers, element: <PlaceholderPage title="Customers" portal="ops" /> },
      { path: ops.surveys, element: <PlaceholderPage title="Surveys" portal="ops" /> },
      { path: ops.quotations, element: <PlaceholderPage title="Quotations" portal="ops" /> },
      { path: ops.contracts, element: <PlaceholderPage title="Contracts" portal="ops" /> },
      { path: ops.projects, element: <PlaceholderPage title="Projects" portal="ops" /> },
    ],
  },

  /* ---- Portal kỹ thuật viên (bộ ui) ---- */
  {
    path: field.home,
    element: (
      <RequireRole role="technician">
        <FieldLayout />
      </RequireRole>
    ),
    hydrateFallbackElement: (
      <FieldLayout>
        <PageSkeleton />
      </FieldLayout>
    ),
    children: [
      { index: true, lazy: () => import('@/pages/field/dashboard-page').then((m) => ({ Component: m.FieldDashboardPage })) },
      { path: field.tasks, lazy: () => import('@/pages/field/tasks-page').then((m) => ({ Component: m.FieldTasksPage })) },
      { path: field.surveys, element: <Navigate to={withId(field.survey, 'SS-PRJ-2024-089')} replace /> },
      { path: field.survey, lazy: () => import('@/pages/field/survey-page').then((m) => ({ Component: m.FieldSurveyPage })) },
      { path: field.installations, element: <Navigate to={withId(field.installation, 'SS-PRJ-2024-042')} replace /> },
      { path: field.installation, lazy: () => import('@/pages/field/installation-page').then((m) => ({ Component: m.FieldInstallationPage })) },
      { path: field.warranty, element: <PlaceholderPage title="Warranty & Maintenance" portal="field" /> },
      { path: field.schedule, element: <PlaceholderPage title="Schedule" portal="field" /> },
      { path: field.notifications, element: <PlaceholderPage title="Notifications" portal="field" /> },
      { path: field.profile, element: <PlaceholderPage title="Profile" portal="field" /> },
    ],
  },

  /* ---- Portal quản lý ---- */
  {
    path: manage.home,
    element: (
      <RequireRole role="manager">
        <ManageLayout />
      </RequireRole>
    ),
    hydrateFallbackElement: (
      <ManageLayout>
        <PageSkeleton />
      </ManageLayout>
    ),
    children: [
      { index: true, lazy: () => import('@/pages/manage/dashboard-page').then((m) => ({ Component: m.ManageDashboardPage })) },
      { path: manage.projects, lazy: () => import('@/pages/manage/portfolio-page').then((m) => ({ Component: m.ManagePortfolioPage })) },
      { path: manage.project, lazy: () => import('@/pages/manage/project-page').then((m) => ({ Component: m.ManageProjectPage })) },
      { path: manage.approvals, lazy: () => import('@/pages/manage/approvals-page').then((m) => ({ Component: m.ManageApprovalsPage })) },
      { path: manage.approval, lazy: () => import('@/pages/manage/approval-page').then((m) => ({ Component: m.ManageApprovalPage })) },
      { path: manage.operations, lazy: () => import('@/pages/manage/operations-page').then((m) => ({ Component: m.ManageOperationsPage })) },
      { path: manage.revenue, lazy: () => import('@/pages/manage/revenue-page').then((m) => ({ Component: m.ManageRevenuePage })) },
      { path: manage.alerts, lazy: () => import('@/pages/manage/alerts-page').then((m) => ({ Component: m.ManageAlertsPage })) },
      { path: manage.notifications, element: <PlaceholderPage title="Notifications" portal="manage" /> },
      { path: manage.profile, element: <PlaceholderPage title="Profile" portal="manage" /> },
    ],
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
      { index: true, lazy: () => import('@/pages/admin/AdminDashboardPage').then((m) => ({ Component: m.AdminDashboardPage })) },
      { path: 'users', lazy: () => import('@/pages/admin/UsersPage').then((m) => ({ Component: m.UsersPage })) },
      { path: 'roles', lazy: () => import('@/pages/admin/RolesPage').then((m) => ({ Component: m.RolesPage })) },
      { path: 'products', lazy: () => import('@/pages/admin/ProductsPage').then((m) => ({ Component: m.ProductsPage })) },
    ],
  },

  /* ---- Portal kỹ thuật viên (bộ stitch-ui) ---- */
  {
    path: ROUTES.TECH.DASHBOARD,
    element: (
      <RequireRole role="technician">
        <TechLayout />
      </RequireRole>
    ),
    children: [
      { index: true, lazy: () => import('@/pages/tech/TechDashboardPage').then((m) => ({ Component: m.TechDashboardPage })) },
      { path: 'tasks', lazy: () => import('@/pages/tech/TasksPage').then((m) => ({ Component: m.TasksPage })) },
      /* Route có :id ném Response 404 từ notFound(); RouteErrorPage render trong Outlet của TechLayout. */
      { path: 'tasks/:id', lazy: () => import('@/pages/tech/TaskDetailPage').then((m) => ({ Component: m.TaskDetailPage })), errorElement: <RouteErrorPage /> },
      { path: 'surveys/:id', lazy: () => import('@/pages/tech/SurveyTaskPage').then((m) => ({ Component: m.SurveyTaskPage })), errorElement: <RouteErrorPage /> },
      { path: 'surveys/:id/verify', lazy: () => import('@/pages/tech/SurveyVerificationPage').then((m) => ({ Component: m.SurveyVerificationPage })), errorElement: <RouteErrorPage /> },
      { path: 'surveys/:id/photos', lazy: () => import('@/pages/tech/SurveyPhotosPage').then((m) => ({ Component: m.SurveyPhotosPage })), errorElement: <RouteErrorPage /> },
      { path: 'installations/:id', lazy: () => import('@/pages/tech/InstallationTaskPage').then((m) => ({ Component: m.InstallationTaskPage })), errorElement: <RouteErrorPage /> },
      { path: 'installations/:id/checklist', lazy: () => import('@/pages/tech/InstallationChecklistPage').then((m) => ({ Component: m.InstallationChecklistPage })), errorElement: <RouteErrorPage /> },
      { path: 'maintenance/:id', lazy: () => import('@/pages/tech/MaintenanceTaskPage').then((m) => ({ Component: m.MaintenanceTaskPage })), errorElement: <RouteErrorPage /> },
      { path: 'warranty/:id', lazy: () => import('@/pages/tech/WarrantyRequestPage').then((m) => ({ Component: m.WarrantyRequestPage })), errorElement: <RouteErrorPage /> },
    ],
  },
]
