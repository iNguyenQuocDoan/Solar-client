import { createBrowserRouter, Navigate } from 'react-router'
import { ROUTES, withId } from '@/constants/routes'
import { CustomerLayout } from '@/pages/customer/layout'
import { FieldLayout } from '@/pages/field/layout'
import { ManageLayout } from '@/pages/manage/layout'
import { OpsLayout } from '@/pages/ops/layout'
import { PlaceholderPage } from '@/pages/placeholder-page'
import { PageSkeleton } from '@/components/ui/states'
import { NotFoundPage } from '@/pages/not-found-page'

const customer = ROUTES.customer
const ops = ROUTES.ops
const field = ROUTES.field
const manage = ROUTES.manage

export const router = createBrowserRouter([
  {
    path: customer.home,
    element: <CustomerLayout />,
    errorElement: <NotFoundPage />,
    hydrateFallbackElement: (
      <CustomerLayout>
        <PageSkeleton />
      </CustomerLayout>
    ),
    children: [
      { index: true, lazy: () => import('@/pages/customer/overview-page').then((m) => ({ Component: m.OverviewPage })) },
      { path: customer.assessment, lazy: () => import('@/pages/customer/assessment-page').then((m) => ({ Component: m.AssessmentPage })) },
      { path: customer.estimate, lazy: () => import('@/pages/customer/estimate-page').then((m) => ({ Component: m.EstimatePage })) },
      /* The homeowner has one open record per stage, so the list routes open it directly. */
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
  {
    path: ops.home,
    element: <OpsLayout />,
    errorElement: <NotFoundPage />,
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
  {
    path: field.home,
    element: <FieldLayout />,
    errorElement: <NotFoundPage />,
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
  {
    path: manage.home,
    element: <ManageLayout />,
    errorElement: <NotFoundPage />,
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
  { path: '*', element: <NotFoundPage /> },
])
