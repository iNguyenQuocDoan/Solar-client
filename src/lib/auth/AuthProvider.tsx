import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { ROUTES } from '@/constants/routes'
import * as authApi from '@/lib/api/auth'
import { SESSION_EXPIRED_EVENT, refreshAccessToken } from '@/lib/api/client'
import { ApiError } from '@/lib/api/errors'
import { fetchCurrentUser } from '@/lib/api/me'
import { clearTokens, getAccessToken, getRefreshToken, hasRefreshToken, saveTokens } from '@/lib/api/tokens'
import { emailFromToken, nameFromToken, roleFromToken, userIdFromToken } from '@/lib/auth/jwt'
import { homePathForRole, type UserRole } from '@/lib/auth/roles'

/*
 * Phiên đăng nhập thật (API .NET ở /api/auth/*).
 *
 * - accessToken nằm trong bộ nhớ, refreshToken trong storage (xem lib/api/tokens.ts).
 * - Mở app: còn refreshToken thì gọi /auth/refresh để khôi phục phiên; trong lúc chờ
 *   status = 'loading' để RequireRole không đá người dùng về /login quá sớm.
 * - Không còn bộ đếm 30 phút giả lập: modal hết hạn mở khi client.ts bắn
 *   sự kiện "session-expired" (refresh thất bại).
 */

export type AuthUser = {
  name: string
  email: string
  role: UserRole
  userId?: string
}

export type AuthStatus = 'loading' | 'ready'

export type AuthContextValue = {
  user: AuthUser | null
  status: AuthStatus
  isAuthenticated: boolean
  /** Đăng nhập; ném ApiError nếu sai thông tin. */
  signIn: (email: string, password: string, remember?: boolean) => Promise<AuthUser>
  /** Đăng xuất: gọi API rồi xoá phiên; lỗi mạng vẫn xoá phía client. */
  signOut: () => Promise<void>
  /** Xoá phiên tại chỗ (dùng khi backend thu hồi phiên sau đổi mật khẩu). */
  clearSession: () => void
  sessionExpired: boolean
  dismissSessionExpired: () => void
  /** Ép phiên hết hạn – chỉ dùng cho ô demo ở /login khi chạy DEV. */
  expireSession: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Dựng AuthUser từ accessToken (+ /me nếu backend đã có).
 * Không đọc được vai trò thì coi như đăng nhập hỏng – tốt hơn là đoán bừa.
 */
async function buildUser(accessToken: string, fallbackEmail?: string): Promise<AuthUser> {
  const profile = await fetchCurrentUser().catch(() => null)

  const role = profile?.role ?? roleFromToken(accessToken)
  if (!role) {
    throw new ApiError({
      status: 0,
      message: 'Không đọc được vai trò trong token đăng nhập. Vui lòng liên hệ quản trị viên.',
    })
  }

  const email = profile?.email ?? emailFromToken(accessToken) ?? fallbackEmail ?? ''
  const name = profile?.name ?? nameFromToken(accessToken) ?? email

  return {
    name,
    email,
    role,
    userId: profile?.userId ?? userIdFromToken(accessToken) ?? undefined,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>(() => (hasRefreshToken() ? 'loading' : 'ready'))
  const [sessionExpired, setSessionExpired] = useState(false)

  // Mở app: còn refreshToken thì khôi phục phiên trước khi render route bảo vệ.
  useEffect(() => {
    let cancelled = false

    // Không có refreshToken thì status đã là 'ready' ngay từ useState khởi tạo.
    if (!hasRefreshToken()) return

    void (async () => {
      try {
        const accessToken = await refreshAccessToken()
        const restored = await buildUser(accessToken)
        if (!cancelled) setUser(restored)
      } catch {
        // refreshToken hỏng/hết hạn khi mở app: dọn im lặng, không bật modal.
        clearTokens()
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setStatus('ready')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  // client.ts bắn sự kiện này khi refresh thất bại giữa chừng.
  useEffect(() => {
    const onExpired = () => {
      setUser(null)
      setSessionExpired(true)
    }
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [])

  const signIn = useCallback(async (email: string, password: string, remember = true) => {
    const tokens = await authApi.login({ email, password })
    if (!tokens.accessToken || !tokens.refreshToken) {
      throw new ApiError({ status: 0, message: 'Máy chủ không trả về token đăng nhập.' })
    }

    saveTokens(
      {
        accessToken: tokens.accessToken,
        accessTokenExpiresAt: tokens.accessTokenExpiresAt,
        refreshToken: tokens.refreshToken,
        refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
        tokenType: tokens.tokenType ?? undefined,
        userId: tokens.userId,
      },
      remember,
    )

    try {
      const next = await buildUser(tokens.accessToken, email)
      setSessionExpired(false)
      setUser(next)
      setStatus('ready')
      return next
    } catch (error) {
      // Token không dùng được (thiếu role…) → không giữ phiên dở dang.
      clearTokens()
      throw error
    }
  }, [])

  const clearSession = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  const signOut = useCallback(async () => {
    const refreshToken = getRefreshToken()
    try {
      if (refreshToken) await authApi.logout({ refreshToken })
    } catch {
      // Lỗi mạng / token đã bị thu hồi: vẫn xoá phiên phía client.
    } finally {
      clearTokens()
      setUser(null)
      setSessionExpired(false)
    }
  }, [])

  const expireSession = useCallback(() => {
    clearTokens()
    setUser(null)
    setSessionExpired(true)
  }, [])

  const dismissSessionExpired = useCallback(() => setSessionExpired(false), [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: user !== null && getAccessToken() !== null,
      signIn,
      signOut,
      clearSession,
      sessionExpired,
      dismissSessionExpired,
      expireSession,
    }),
    [user, status, signIn, signOut, clearSession, sessionExpired, dismissSessionExpired, expireSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth phải dùng bên trong <AuthProvider>')
  return context
}

export { homePathForRole }

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
