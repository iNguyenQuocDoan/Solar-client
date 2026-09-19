import { Link } from 'react-router'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/*
 * Class lấy từ <header> của admin_dashboard/code.html và my_tasks_1/code.html.
 * Cả hai header trong thiết kế không có breadcrumb/title: breadcrumb nằm trong <main> của từng trang.
 * Dưới lg có thêm nút menu để mở sidebar dạng drawer.
 */
type MenuProps = {
  /** Có giá trị thì hiện nút menu (chỉ dưới lg) */
  onMenuClick?: () => void
}

export type TopHeaderProps = MenuProps &
  (
    | {
        variant: 'admin'
        logoSrc: string
        searchPlaceholder: string
        environment: string
        systemStatus: string
        unreadNotifications: number
        user: { name: string; status: string }
      }
    | {
        variant: 'technician'
        location: string
        telemetry: string
        hasUnreadAlerts: boolean
        alertsHref: string
        profileHref: string
      }
  )

const headerBase =
  'fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between bg-surface-container-lowest/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-72'

function MenuButton({ onClick }: { onClick?: () => void }) {
  if (!onClick) return null
  return (
    <button
      type="button"
      aria-label="Open navigation"
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container-high lg:hidden"
    >
      <Icon name="menu" className="text-[22px]" />
    </button>
  )
}

export function TopHeader(props: TopHeaderProps) {
  if (props.variant === 'admin') {
    return (
      <header className={cn(headerBase, 'px-space-lg')}>
        <div className="flex max-w-xl flex-1 items-center gap-space-md">
          <MenuButton onClick={props.onMenuClick} />
          <img src={props.logoSrc} alt="" className="hidden h-8 w-auto object-contain sm:block" />
          <div className="relative flex w-full items-center">
            <Icon name="search" className="absolute left-3 text-[18px] text-outline" />
            <input
              type="search"
              placeholder={props.searchPlaceholder}
              className="h-10 w-full rounded-xl bg-surface-container-low pl-9 pr-space-md text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-space-md">
          <div className="hidden items-center gap-space-xs rounded-full bg-surface-container-low px-3 py-1 text-on-surface-variant xl:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary-container" />
            <span className="text-label-sm font-semibold text-on-surface">{props.environment}</span>
          </div>
          <div className="hidden items-center gap-space-2xs rounded-full bg-surface-container-low px-3 py-1 text-on-surface-variant md:flex">
            <Icon name="verified" className="text-[14px] text-tertiary-container" />
            <span className="text-label-sm text-on-surface-variant">{props.systemStatus}</span>
          </div>
          <div className="relative flex items-center">
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              <Icon name="notifications" className="text-[20px]" />
            </button>
            {props.unreadNotifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-on-secondary">
                {props.unreadNotifications}
              </span>
            )}
          </div>
          <div className="flex items-center gap-space-sm pl-space-xs">
            <div className="hidden flex-col text-right lg:flex">
              <span className="text-label-md font-semibold leading-tight text-on-surface">
                {props.user.name}
              </span>
              <span className="text-[10px] font-medium text-tertiary-container">{props.user.status}</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Icon name="person" className="text-[18px] text-on-primary" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={cn(headerBase, 'px-space-md lg:px-space-xl')}>
      <div className="flex items-center gap-space-md">
        <MenuButton onClick={props.onMenuClick} />
        <div className="flex items-center gap-space-xs rounded-lg bg-surface-container-low px-space-sm py-1.5 text-label-sm text-on-surface-variant">
          <Icon name="pin_drop" className="text-[18px] text-primary" />
          <span>{props.location}</span>
        </div>
      </div>

      <div className="flex items-center gap-space-lg">
        <div className="hidden items-center gap-space-xs text-label-sm text-on-surface-variant sm:flex">
          <span className="h-2.5 w-2.5 rounded-full bg-primary-container" />
          <span>{props.telemetry}</span>
        </div>
        <div className="flex items-center gap-space-sm">
          <Link
            to={props.alertsHref}
            aria-label="Alerts"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
          >
            <Icon name="notifications" className="text-[20px]" />
            {props.hasUnreadAlerts && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary-container ring-2 ring-surface-container-lowest" />
            )}
          </Link>
          <Link to={props.profileHref} aria-label="Profile" className="flex items-center gap-space-xs pl-space-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Icon name="person" className="text-[18px] text-on-primary" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
