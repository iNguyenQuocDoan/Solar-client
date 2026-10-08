import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { NotFoundPage } from '@/pages/not-found-page'
import { protectedRoutes } from '@/routes/protectedRoutes'
import { publicRoutes } from '@/routes/publicRoutes'

/*
  Điều hướng:
    /            landing công khai, /login … /verify-email, /403, /coming-soon
    /customer    khách hàng        (role customer)
    /ops         kinh doanh        (role sales)
    /admin       quản trị viên     (role admin)
    /tech        kỹ thuật viên     (role technician; /field chuyển về đây)
    /manage      quản lý           (role manager)
  Mọi portal dùng chung shell portal kit (components/layout/app-shell.tsx).
  Sau đăng nhập, homePathForRole (src/config/roles.ts) đưa mỗi vai trò về portal của mình.
*/
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [...publicRoutes, ...protectedRoutes, { path: '*', element: <NotFoundPage /> }],
  },
])
