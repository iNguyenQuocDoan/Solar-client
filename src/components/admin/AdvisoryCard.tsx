import type { ReactNode } from 'react'
import { Icon } from '@/components/stitch-ui/Icon'
import { cn } from '@/lib/cn'

/* "Maintenance Advisory" trong admin_dashboard: thẻ cảnh báo nền surface-container. */
export type AdvisoryCardProps = {
  icon: string
  eyebrow: string
  title: string
  /** Nội dung, có thể chứa <strong> */
  children: ReactNode
  reference?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function AdvisoryCard({
  icon,
  eyebrow,
  title,
  children,
  reference,
  actionLabel,
  onAction,
  className,
}: AdvisoryCardProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col justify-between overflow-hidden rounded-2xl bg-surface-container p-space-lg shadow-level-1',
        className,
      )}
    >
      <div className="flex items-start gap-space-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-fixed text-on-secondary-fixed">
          <Icon name={icon} className="text-[20px]" />
        </div>
        <div>
          <span className="text-label-sm font-bold text-secondary">{eyebrow}</span>
          <h4 className="mt-0.5 text-body-lg font-semibold text-on-surface">{title}</h4>
          <p className="mt-1 text-body-sm text-on-surface-variant">{children}</p>
        </div>
      </div>
      {(reference || actionLabel) && (
        <div className="mt-space-md flex items-center justify-between pt-space-xs">
          {reference && <span className="whitespace-nowrap text-label-sm text-outline">{reference}</span>}
          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="rounded-lg bg-surface-container-lowest px-3 py-1.5 text-label-sm font-semibold text-on-surface transition-colors hover:bg-surface-bright"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
