import { Outlet } from 'react-router'
import { SessionExpiredModal } from '@/components/auth/SessionExpiredModal'

/*
 * Route gốc: bọc toàn bộ app để SessionExpiredModal nằm trong router context
 * (modal cần useNavigate) và hiển thị được ở mọi màn.
 */
export function RootLayout() {
  return (
    <>
      <Outlet />
      <SessionExpiredModal />
    </>
  )
}
