import { createBrowserRouter } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { RequireRole } from '@/lib/auth/AuthProvider'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { RootLayout } from '@/layouts/RootLayout'
import { TechLayout } from '@/layouts/TechLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { ProductsPage } from '@/pages/admin/ProductsPage'
import { RolesPage } from '@/pages/admin/RolesPage'
import { UsersPage } from '@/pages/admin/UsersPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage'
import { ComingSoonPage } from '@/pages/ComingSoonPage'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { LandingPage } from '@/pages/public/LandingPage'
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
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: ROUTES.HOME, element: <LandingPage /> },
          { path: ROUTES.COMING_SOON, element: <ComingSoonPage /> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: ROUTES.LOGIN, element: <LoginPage /> },
          { path: ROUTES.REGISTER, element: <RegisterPage /> },
          { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
          { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
          { path: ROUTES.VERIFY_EMAIL, element: <VerifyEmailPage /> },
          { path: ROUTES.FORBIDDEN, element: <ForbiddenPage /> },
        ],
      },
      {
        path: ROUTES.STYLEGUIDE,
        element: <StyleguidePage />,
      },
      {
        path: ROUTES.ADMIN.DASHBOARD,
        element: (
          <RequireRole role="admin">
            <AdminLayout />
          </RequireRole>
        ),
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'roles', element: <RolesPage /> },
          { path: 'products', element: <ProductsPage /> },
        ],
      },
      {
        path: ROUTES.TECH.DASHBOARD,
        element: (
          <RequireRole role="technician">
            <TechLayout />
          </RequireRole>
        ),
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
    ],
  },
])
