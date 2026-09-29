import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'
import { NotFoundPage } from '@/pages/not-found-page'
import { protectedRoutes } from '@/routes/protectedRoutes'
import { publicRoutes } from '@/routes/publicRoutes'

/*
  Điều hướng:
    /            landing công khai, /login … /verify-email, /403, /coming-soon
    /customer    khách hàng        (role customer)   src/components/common/ui
    /ops         kinh doanh        (role sales)      src/components/common/ui
    /field       kỹ thuật viên     (role technician) src/components/common/ui
    /manage      quản lý           (role manager)    src/components/common/ui
    /admin       quản trị viên     (role admin)      src/components/common/stitch-ui
    /tech        kỹ thuật viên     (role technician) src/components/common/stitch-ui
  Sau đăng nhập, homePathForRole (src/config/roles.ts) đưa mỗi vai trò về portal của mình.
*/
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [...publicRoutes, ...protectedRoutes, { path: '*', element: <NotFoundPage /> }],
  },
])
