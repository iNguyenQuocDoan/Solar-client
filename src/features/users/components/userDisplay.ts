import type { Tone } from '@/components/common/ui/badge'
import type { ActivationState, AdminUserListItem } from '@/types/res/adminUsersRes'

// Nhãn vai trò / trạng thái tài khoản. Mã lạ thì in nguyên văn

export const ROLE_OPTIONS = [
  { value: 'CUSTOMER', label: 'Khách hàng' },
  { value: 'SALES', label: 'Kinh doanh' },
  { value: 'TECHNICIAN', label: 'Kỹ thuật viên' },
  { value: 'MANAGER', label: 'Quản lý' },
  { value: 'ADMIN', label: 'Quản trị viên' },
] as const

export function roleLabel(code: string) {
  return ROLE_OPTIONS.find((r) => r.value === code)?.label ?? code
}

export function rolesText(codes: readonly string[]) {
  return codes.length ? codes.map(roleLabel).join(', ') : '—'
}

export const STATUS_OPTIONS = [
  { value: 'PENDING_VERIFICATION', label: 'Chờ kích hoạt' },
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'SUSPENDED', label: 'Tạm khoá' },
  { value: 'DISABLED', label: 'Vô hiệu' },
] as const

const STATUS_TONES: Record<string, Tone> = {
  PENDING_VERIFICATION: 'info',
  ACTIVE: 'ok',
  SUSPENDED: 'warn',
  DISABLED: 'neutral',
}

export function userStatusMeta(u: Pick<AdminUserListItem, 'status' | 'deletedAt'>): { label: string; tone: Tone } {
  if (u.deletedAt) return { label: 'Đã xoá', tone: 'neutral' }
  return {
    label: STATUS_OPTIONS.find((s) => s.value === u.status)?.label ?? u.status,
    tone: STATUS_TONES[u.status] ?? 'neutral',
  }
}

/** `ok` là link đã thật sự được đưa vào hàng đợi gửi */
export function activationMessage(a: ActivationState): { ok: boolean; text: string } {
  const what =
    a.status === 'PENDING_ACCOUNT_SETUP'
      ? 'link đặt mật khẩu lần đầu'
      : a.status === 'PENDING_EMAIL_VERIFICATION'
        ? 'link xác minh email'
        : 'link đặt lại mật khẩu'
  if (a.emailDelivery === 'QUEUED') return { ok: true, text: `Đã gửi ${what} tới email của tài khoản.` }
  if (a.emailDelivery === 'EMAIL_DELIVERY_DISABLED')
    return {
      ok: false,
      text: `Môi trường này chưa bật gửi email nên ${what} CHƯA được gửi. Bật gửi email rồi bấm "Gửi link" để gửi lại.`,
    }
  return { ok: false, text: `Không gửi được ${what} (hàng đợi email lỗi). Bấm "Gửi link" để thử lại.` }
}
