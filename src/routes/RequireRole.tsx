import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import type { UserRole } from '@/config/roles'
import { useAuth } from '@/context/AuthProvider'
import { ROUTES } from '@/routes/paths'

export type RequireRoleProps = {
  role: UserRole
  children: ReactNode
}

/** Đang khôi phục phiên → màn chờ; chưa đăng nhập → /login; sai vai trò → /403. */
export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <AuthLoadingScreen />
  if (!user) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location.pathname }} />
  if (user.role !== role) return <Navigate to={ROUTES.FORBIDDEN} replace state={{ required: role }} />
  return <>{children}</>
}

/** Màn chờ toàn trang trong lúc gọi /auth/refresh lúc mở app. */
export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-space-sm bg-surface">
      <span className="material-symbols animate-spin text-[32px] text-primary">progress_activity</span>
      <p className="text-body-md text-on-surface-variant">Đang khôi phục phiên đăng nhập…</p>
    </div>
  )
}
