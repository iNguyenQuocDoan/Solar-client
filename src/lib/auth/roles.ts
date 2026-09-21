import { ROUTES } from '@/constants/routes'

/** 5 vai trò của hệ thống. */
export const USER_ROLES = ['customer', 'technician', 'sales', 'manager', 'admin'] as const

export type UserRole = (typeof USER_ROLES)[number]

/** Nhãn tiếng Việt – dùng cho chip vai trò và trang /403. */
export const roleLabels: Record<UserRole, string> = {
  customer: 'Khách hàng',
  technician: 'Kỹ thuật viên',
  sales: 'Kinh doanh',
  manager: 'Quản lý',
  admin: 'Quản trị viên',
}

/*
 * Giá trị claim `role` trong JWT → vai trò của web.
 * So khớp không phân biệt hoa thường; thêm vài biến thể hay gặp phía .NET.
 * Nếu backend phát giá trị khác, bổ sung vào bảng này (chỉ sửa 1 chỗ).
 */
const ROLE_ALIASES: Record<string, UserRole> = {
  customer: 'customer',
  user: 'customer',
  homeowner: 'customer',
  technician: 'technician',
  tech: 'technician',
  sales: 'sales',
  salesperson: 'sales',
  manager: 'manager',
  admin: 'admin',
  administrator: 'admin',
  systemadmin: 'admin',
}

/** Khi JWT có nhiều role, lấy vai trò quyền cao nhất theo thứ tự này. */
const ROLE_PRIORITY: UserRole[] = ['admin', 'manager', 'sales', 'technician', 'customer']

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[\s_-]/g, '')
}

/** Đổi một giá trị claim thành UserRole; không nhận ra thì trả null. */
export function parseRole(value: unknown): UserRole | null {
  if (typeof value === 'string') return ROLE_ALIASES[normalize(value)] ?? null

  if (Array.isArray(value)) {
    const found = value
      .map((item) => parseRole(item))
      .filter((role): role is UserRole => role !== null)
    if (found.length === 0) return null
    return ROLE_PRIORITY.find((role) => found.includes(role)) ?? found[0] ?? null
  }

  return null
}

/** Trang đích sau đăng nhập theo vai trò. */
export function homePathForRole(role: UserRole): string {
  if (role === 'admin') return ROUTES.ADMIN.DASHBOARD
  if (role === 'technician') return ROUTES.TECH.DASHBOARD
  return ROUTES.COMING_SOON
}
