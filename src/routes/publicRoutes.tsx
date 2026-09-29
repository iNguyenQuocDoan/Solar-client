import type { RouteObject } from 'react-router'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ROUTES } from '@/routes/paths'

/* Route không cần đăng nhập: trang chủ, /coming-soon, các màn xác thực, /403 và /styleguide. */
export const publicRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME, lazy: () => import('@/pages/public/LandingPage').then((m) => ({ Component: m.LandingPage })) },
      { path: ROUTES.COMING_SOON, lazy: () => import('@/pages/ComingSoonPage').then((m) => ({ Component: m.ComingSoonPage })) },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: ROUTES.LOGIN, lazy: () => import('@/pages/auth/LoginPage').then((m) => ({ Component: m.LoginPage })) },
      { path: ROUTES.REGISTER, lazy: () => import('@/pages/auth/RegisterPage').then((m) => ({ Component: m.RegisterPage })) },
      { path: ROUTES.FORGOT_PASSWORD, lazy: () => import('@/pages/auth/ForgotPasswordPage').then((m) => ({ Component: m.ForgotPasswordPage })) },
      { path: ROUTES.RESET_PASSWORD, lazy: () => import('@/pages/auth/ResetPasswordPage').then((m) => ({ Component: m.ResetPasswordPage })) },
      { path: ROUTES.VERIFY_EMAIL, lazy: () => import('@/pages/auth/VerifyEmailPage').then((m) => ({ Component: m.VerifyEmailPage })) },
      { path: ROUTES.FORBIDDEN, lazy: () => import('@/pages/ForbiddenPage').then((m) => ({ Component: m.ForbiddenPage })) },
    ],
  },
  {
    path: ROUTES.STYLEGUIDE,
    lazy: () => import('@/pages/StyleguidePage').then((m) => ({ Component: m.StyleguidePage })),
  },
]
