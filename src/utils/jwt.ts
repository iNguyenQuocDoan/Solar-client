import { jwtDecode } from 'jwt-decode'
import { parseRole, type UserRole } from '@/config/roles'

/*
 * Đọc claim trong accessToken.
 *
 * AuthTokensResponse của swagger không có role/tên người dùng, nên role lấy từ
 * claim `role` của JWT (đã xác nhận với backend). Tên hiển thị tạm lấy từ claim
 * name/fullName nếu có – khi backend cung cấp endpoint /me thì chuyển sang dùng
 * dữ liệu của /me (xem src/features/auth/services/me.ts).
 */

export type JwtClaims = {
  role?: unknown
  name?: unknown
  fullName?: unknown
  email?: unknown
  sub?: unknown
  exp?: number
  [claim: string]: unknown
}

export function decodeToken(token: string): JwtClaims | null {
  try {
    return jwtDecode<JwtClaims>(token)
  } catch {
    return null
  }
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

/** Claim role mặc định của ASP.NET Core (ClaimTypes.Role) khi backend không đổi tên thành `role`. */
const DOTNET_ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'

/** Vai trò lấy từ claim `role`, không có thì thử claim role của .NET. */
export function roleFromToken(token: string): UserRole | null {
  const claims = decodeToken(token)
  if (!claims) return null
  return parseRole(claims.role ?? claims[DOTNET_ROLE_CLAIM])
}

/** Email lấy từ claim `email`, không có thì thử các claim quen thuộc khác. */
export function emailFromToken(token: string): string | null {
  const claims = decodeToken(token)
  if (!claims) return null
  return (
    asString(claims.email) ??
    asString(claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'])
  )
}

/** Tên hiển thị lấy từ claim name/fullName nếu backend có phát. */
export function nameFromToken(token: string): string | null {
  const claims = decodeToken(token)
  if (!claims) return null
  return (
    asString(claims.fullName) ??
    asString(claims.name) ??
    asString(claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'])
  )
}

/** userId lấy từ claim `sub`. */
export function userIdFromToken(token: string): string | null {
  const claims = decodeToken(token)
  if (!claims) return null
  return asString(claims.sub) ?? asString(claims.nameid)
}
