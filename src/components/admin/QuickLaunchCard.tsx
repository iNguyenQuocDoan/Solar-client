import { Link } from 'react-router'
import { cn } from '@/lib/cn'

/* "Governance Quick Launchpads" trong admin_dashboard: nav phụ dạng thẻ bấm được. */
export type QuickLaunchTone = 'primary' | 'secondary' | 'primary-container' | 'tertiary'

const toneClasses: Record<QuickLaunchTone, { title: string; cta: string }> = {
  primary: { title: 'group-hover:text-primary', cta: 'text-primary' },
  secondary: { title: 'group-hover:text-secondary', cta: 'text-secondary' },
  'primary-container': { title: 'group-hover:text-primary', cta: 'text-primary' },
  tertiary: { title: 'group-hover:text-tertiary-container', cta: 'text-tertiary-container' },
}

export type QuickLaunchCardProps = {
  /** Giữ trong dữ liệu để dùng lại nếu cần; thẻ hiện không vẽ ô icon. */
  icon?: string
  tone?: QuickLaunchTone
  title: string
  description: string
  ctaLabel: string
  href: string
  className?: string
}

export function QuickLaunchCard({
  tone = 'primary',
  title,
  description,
  ctaLabel,
  href,
  className,
}: QuickLaunchCardProps) {
  const t = toneClasses[tone]
  return (
    <Link
      to={href}
      className={cn(
        'group flex flex-col justify-between rounded-xl border border-outline-card bg-surface-container-lowest p-space-lg transition-colors hover:border-outline',
        className,
      )}
    >
      <div>
        <h3 className={cn('text-body-lg font-semibold text-on-surface transition-colors', t.title)}>{title}</h3>
        <p className="mt-1 text-body-sm text-on-surface-variant">{description}</p>
      </div>
      <span className={cn('mt-space-lg text-label-md font-semibold', t.cta)}>{ctaLabel}</span>
    </Link>
  )
}
