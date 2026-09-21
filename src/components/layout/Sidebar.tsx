import { Link, NavLink } from 'react-router'
import { Icon } from '@/components/stitch-ui/Icon'
import { cn } from '@/lib/cn'
import type { NavItem } from '@/lib/nav'

export type SidebarVariant = 'admin' | 'technician'

export type SidebarProps = {
  variant: SidebarVariant
  brand: { title: string; subtitle: string; logoSrc: string }
  /** Admin: nhãn nhóm menu ("Platform Governance"). Technician: chip trạng thái sync. */
  eyebrow: string
  items: NavItem[]
  /** href của mục dashboard – chỉ active khi khớp chính xác */
  rootHref: string
  user: { name: string; title: string; icon: string; href: string }
  /** Chỉ technician: Alerts / Settings ở cuối sidebar */
  footerLinks?: NavItem[]
  /** Gọi khi chọn một link – AppShell dùng để đóng drawer trên mobile */
  onNavigate?: () => void
  className?: string
}

/*
 * Class lấy từ <aside> của admin_dashboard/code.html và my_tasks_1/code.html.
 * Hai bản khác nhau ở nền, padding, radius và cỡ icon nên tách theo variant.
 */
const styles = {
  admin: {
    aside: 'overflow-y-auto bg-surface-container-lowest',
    brandRow: 'bg-surface-container-low/40 px-space-md',
    brandTitle: 'tracking-tight',
    brandSubtitle: 'text-[9px] font-semibold leading-tight',
    nav: 'gap-1 px-space-xs',
    item: 'gap-space-sm rounded-lg px-space-sm py-2',
    itemActive: 'bg-primary-container font-semibold text-on-primary shadow-sm',
    icon: 'text-[20px]',
  },
  technician: {
    aside: 'bg-surface-container-low',
    brandRow: 'bg-surface-container-lowest px-space-lg',
    brandTitle: 'font-bold',
    brandSubtitle: 'text-label-sm',
    nav: 'gap-space-2xs overflow-y-auto px-space-md py-space-xs',
    item: 'justify-between rounded-xl px-space-md py-space-sm text-label-lg',
    itemActive:
      'bg-primary-container font-bold text-on-primary shadow-[0_2px_8px_-2px_rgba(13,92,58,0.2)]',
    icon: 'text-[22px]',
  },
} as const

const itemInactive = 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'

export function Sidebar({
  variant,
  brand,
  eyebrow,
  items,
  rootHref,
  user,
  footerLinks = [],
  onNavigate,
  className,
}: SidebarProps) {
  const s = styles[variant]
  const isAdmin = variant === 'admin'

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)]',
        s.aside,
        className,
      )}
    >
      <div className="flex flex-col">
        {/* Logo + tiêu đề + subtitle */}
        <div className={cn('flex h-16 items-center gap-space-sm', s.brandRow)}>
          <img src={brand.logoSrc} alt="" className="h-8 w-auto object-contain" />
          <div className="flex min-w-0 flex-col">
            <span className={cn('truncate text-headline-md leading-none text-primary', s.brandTitle)}>
              {brand.title}
            </span>
            <span
              className={cn(
                'mt-1 truncate uppercase tracking-wider text-on-surface-variant',
                s.brandSubtitle,
              )}
            >
              {brand.subtitle}
            </span>
          </div>
        </div>

        {/* Nhãn nhóm (admin) hoặc chip sync (technician) */}
        {isAdmin ? (
          <div className="px-space-md py-space-xs">
            <p className="px-space-xs py-space-xs text-[9px] font-bold uppercase tracking-widest text-outline">
              {eyebrow}
            </p>
          </div>
        ) : (
          <div className="px-space-md py-space-sm">
            <div className="flex items-center gap-space-xs rounded-lg bg-surface-container px-space-sm py-space-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-label-sm font-semibold text-on-surface">{eyebrow}</span>
            </div>
          </div>
        )}

        <nav className={cn('flex flex-col', s.nav)}>
          {items.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === rootHref}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn('flex items-center transition-all', s.item, isActive ? s.itemActive : itemInactive)
              }
            >
              {isAdmin ? (
                <>
                  <Icon name={item.icon} className={s.icon} />
                  <span className="text-label-lg">{item.label}</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-space-sm">
                    <Icon name={item.icon} className={s.icon} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="rounded-full bg-surface-container-highest px-2 py-0.5 text-label-sm text-on-surface">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Khối user cuối sidebar */}
      {isAdmin ? (
        <div className="mx-space-xs mb-space-xs rounded-xl bg-surface-container-low/60 p-space-xs">
          <Link
            to={user.href}
            onClick={onNavigate}
            className="flex items-center gap-space-sm rounded-lg p-space-xs text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface"
          >
            <Icon name={user.icon} className="text-[20px]" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-label-md text-on-surface">{user.name}</span>
              <span className="truncate text-[10px] text-outline">{user.title}</span>
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-space-xs bg-surface-container-low p-space-md">
          <div className="flex items-center gap-space-sm rounded-xl bg-surface-container-lowest p-space-sm shadow-[0_2px_8px_-2px_rgba(13,92,58,0.04)]">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
              <Icon name={user.icon} className="text-[20px] text-on-primary" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-label-md font-semibold text-on-surface">{user.name}</span>
              <span className="truncate text-label-sm text-on-surface-variant">{user.title}</span>
            </div>
          </div>
          <div className="flex items-center justify-between px-space-xs pt-space-xs">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={onNavigate}
                className="flex items-center gap-space-xs text-label-sm text-on-surface-variant hover:text-on-surface"
              >
                <Icon name={link.icon} className="text-[18px]" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
