import { Link } from 'react-router'
import { Icon } from '@/components/stitch-ui/Icon'
import { cn } from '@/lib/cn'

/* "Governance Quick Launchpads" trong admin_dashboard: nav phụ dạng thẻ bấm được. */
export type QuickLaunchTone = 'primary' | 'secondary' | 'primary-container' | 'tertiary'

const toneClasses: Record<QuickLaunchTone, { icon: string; iconHover: string; title: string; cta: string }> = {
  primary: {
    icon: 'text-primary',
    iconHover: 'group-hover:bg-primary group-hover:text-on-primary',
    title: 'group-hover:text-primary',
    cta: 'text-primary',
  },
  secondary: {
    icon: 'text-secondary',
    iconHover: 'group-hover:bg-secondary group-hover:text-on-secondary',
    title: 'group-hover:text-secondary',
    cta: 'text-secondary',
  },
  'primary-container': {
    icon: 'text-primary-container',
    iconHover: 'group-hover:bg-primary-container group-hover:text-on-primary',
    title: 'group-hover:text-primary',
    cta: 'text-primary',
  },
  tertiary: {
    icon: 'text-tertiary-container',
    iconHover: 'group-hover:bg-tertiary-container group-hover:text-on-primary',
    title: 'group-hover:text-tertiary-container',
    cta: 'text-tertiary-container',
  },
}

export type QuickLaunchCardProps = {
  icon: string
  tone?: QuickLaunchTone
  title: string
  description: string
  ctaLabel: string
  href: string
  className?: string
}

export function QuickLaunchCard({
  icon,
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
        'group flex flex-col justify-between rounded-2xl border border-outline-card bg-surface-container-lowest p-space-lg shadow-level-1 transition-all hover:shadow-level-2',
        className,
      )}
    >
      <div>
        <div
          className={cn(
            'mb-space-md flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container transition-colors',
            t.icon,
            t.iconHover,
          )}
        >
          <Icon name={icon} className="text-[24px]" />
        </div>
        <h3 className={cn('text-body-lg font-semibold text-on-surface transition-colors', t.title)}>{title}</h3>
        <p className="mt-1 text-body-sm text-on-surface-variant">{description}</p>
      </div>
      <div className={cn('mt-space-lg flex items-center gap-1 text-label-md font-semibold', t.cta)}>
        <span>{ctaLabel}</span>
        <Icon name="arrow_forward" className="text-[16px] transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
