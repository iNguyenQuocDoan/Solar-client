import { Icon } from '@/components/common/stitch-ui/Icon'
import { cn } from '@/utils/cn'

/*
 * Class lấy từ <header> của admin_dashboard/code.html và my_tasks_1/code.html.
 * Cả hai header trong thiết kế không có breadcrumb/title: breadcrumb nằm trong <main> của từng trang.
 * Chỉ hiện dưới lg: nút mở sidebar dạng drawer, logo, người đăng nhập. Từ lg sidebar đã có đủ logo và khối
 * tài khoản nên header bị ẩn để lấy lại chiều cao (bố cục gọn 05/10/2026).
 * Ô tìm kiếm, chip môi trường/trạng thái hệ thống, vị trí, telemetry và chuông thông báo trong
 * thiết kế đã bỏ (05/10/2026): backend chưa có API nên chúng chỉ hiển thị dữ liệu giả.
 */
export type TopHeaderProps = {
  /** Chỉ admin: logo cạnh nút menu */
  logoSrc?: string
  /** Người đang đăng nhập: tên và nhãn vai trò */
  user: { name: string; role: string }
  /** Có giá trị thì hiện nút menu (chỉ dưới lg) */
  onMenuClick?: () => void
}

const headerBase =
  'fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-outline-variant/40 bg-surface-container-lowest lg:hidden'

function MenuButton({ onClick }: { onClick?: () => void }) {
  if (!onClick) return null
  return (
    <button
      type="button"
      aria-label="Mở menu"
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container-high lg:hidden"
    >
      <Icon name="menu" className="text-[22px]" />
    </button>
  )
}

export function TopHeader({ logoSrc, user, onMenuClick }: TopHeaderProps) {
  return (
    <header className={cn(headerBase, 'px-space-md lg:px-space-lg')}>
      <div className="flex items-center gap-space-md">
        <MenuButton onClick={onMenuClick} />
        {logoSrc && <img src={logoSrc} alt="" className="hidden h-8 w-auto object-contain sm:block" />}
      </div>

      <div className="flex items-center gap-space-sm pl-space-xs">
        <div className="hidden flex-col text-right sm:flex">
          <span className="text-label-md font-semibold leading-tight text-on-surface">{user.name}</span>
          <span className="text-label-sm text-on-surface-variant">{user.role}</span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
          <Icon name="person" className="text-[18px] text-on-primary" />
        </div>
      </div>
    </header>
  )
}
