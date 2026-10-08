import type { ReactNode } from 'react'
import { Icon } from '@/components/common/stitch-ui/Icon'
import { cx } from '@/utils/cx'

export type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info' | 'accent'

/*
  Nhãn trạng thái (08/10/2026): mọi trạng thái là một nhãn nền nhạt cùng một hình dạng, màu theo nghĩa
  (xem vai trò màu trong globals.css), để quét một cột trạng thái là phân biệt được ngay:
    ok       đang hoạt động / đúng tiến độ (Đang bán, Đã hẹn khảo sát)
    info     đang xử lý (Đã nhận, Đang xem xét)
    danger   thông báo / yêu cầu cần xử lý (Chờ nhận, Chưa hẹn, Chờ hơn 1 ngày, thiếu thông số), lỗi
    warn     lưu ý không đòi làm ngay (Đã ngừng bán ở trang chi tiết)
    accent   thuộc về người đang xem (ít dùng)
    neutral  đã xong / không còn hoạt động (Ngừng bán, Hoàn tất, Đã huỷ)
  Màu không bao giờ là tín hiệu duy nhất: chữ nói cùng một điều. `icon` chỉ dùng cho thông báo cần làm ngay
  (đầu trang), không gắn icon cho mọi nhãn.
*/
const tones: Record<Tone, string> = {
  neutral: 'bg-surface-3 text-fg-2',
  ok: 'bg-ok-soft text-ok',
  info: 'bg-info-soft text-info',
  accent: 'bg-accent-soft text-accent-fg',
  warn: 'bg-warn-soft text-warn',
  danger: 'bg-danger-soft text-danger',
}

export function Badge({
  tone = 'neutral',
  icon,
  className,
  children,
}: {
  tone?: Tone
  /** Tên icon Material Symbols trước chữ, cho cảnh báo cần làm ngay. */
  icon?: string
  className?: string
  children: ReactNode
}) {
  return (
    <span className={cx('inline-flex min-h-6 items-center gap-1.5 rounded-control px-2 py-0.5 text-meta font-medium', tones[tone], className)}>
      {icon && <Icon name={icon} className="-ml-0.5 shrink-0 text-[16px]" />}
      {children}
    </span>
  )
}

/*
  A count beside a menu item or tab. `attention`: work waiting for the person looking at it
  (requests to claim, requests still to schedule), filled red like a notification count so it is the first
  thing the eye lands on (quyết định 08/10/2026: thông báo và yêu cầu đang chờ dùng màu đỏ); otherwise a quiet total
  for reference. The quiet fill is a tint of the text colour, so it shows on every surface (rail, selected row, tab).
*/
export function Count({ value, attention, className }: { value: number; attention?: boolean; className?: string }) {
  return (
    <span
      className={cx(
        'tnum inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-control px-1 text-meta font-semibold',
        attention ? 'bg-danger-fill text-on-danger' : 'bg-fg/8 text-fg-2',
        className,
      )}
    >
      {value}
    </span>
  )
}
