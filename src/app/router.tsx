import { createBrowserRouter } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { AdminLayout } from '@/layouts/AdminLayout'
import { TechLayout } from '@/layouts/TechLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { ProductsPage } from '@/pages/admin/ProductsPage'
import { RolesPage } from '@/pages/admin/RolesPage'
import { UsersPage } from '@/pages/admin/UsersPage'
import { HomePage } from '@/pages/home-page'
import { RouteErrorPage } from '@/pages/RouteErrorPage'
import { StyleguidePage } from '@/pages/StyleguidePage'
import { InstallationChecklistPage } from '@/pages/tech/InstallationChecklistPage'
import { InstallationTaskPage } from '@/pages/tech/InstallationTaskPage'
import { MaintenanceTaskPage } from '@/pages/tech/MaintenanceTaskPage'
import { SurveyPhotosPage } from '@/pages/tech/SurveyPhotosPage'
import { SurveyTaskPage } from '@/pages/tech/SurveyTaskPage'
import { SurveyVerificationPage } from '@/pages/tech/SurveyVerificationPage'
import { TaskDetailPage } from '@/pages/tech/TaskDetailPage'
import { TasksPage } from '@/pages/tech/TasksPage'
import { TechDashboardPage } from '@/pages/tech/TechDashboardPage'
import { WarrantyRequestPage } from '@/pages/tech/WarrantyRequestPage'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.STYLEGUIDE,
    element: <StyleguidePage />,
  },
  {
    path: ROUTES.ADMIN.DASHBOARD,
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'roles', element: <RolesPage /> },
      { path: 'products', element: <ProductsPage /> },
    ],
  },
  {
    path: ROUTES.TECH.DASHBOARD,
    element: <TechLayout />,
    children: [
      { index: true, element: <TechDashboardPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'tasks/:id', element: <TaskDetailPage />, errorElement: <RouteErrorPage /> },
      // Các route có [id]: notFound() ném Response 404, RouteErrorPage render trong Outlet của TechLayout.
      { path: 'surveys/:id', element: <SurveyTaskPage />, errorElement: <RouteErrorPage /> },
      { path: 'surveys/:id/verify', element: <SurveyVerificationPage />, errorElement: <RouteErrorPage /> },
      { path: 'surveys/:id/photos', element: <SurveyPhotosPage />, errorElement: <RouteErrorPage /> },
      { path: 'installations/:id', element: <InstallationTaskPage />, errorElement: <RouteErrorPage /> },
      {
        path: 'installations/:id/checklist',
        element: <InstallationChecklistPage />,
        errorElement: <RouteErrorPage />,
      },
      { path: 'maintenance/:id', element: <MaintenanceTaskPage />, errorElement: <RouteErrorPage /> },
      { path: 'warranty/:id', element: <WarrantyRequestPage />, errorElement: <RouteErrorPage /> },
    ],
  },
])
