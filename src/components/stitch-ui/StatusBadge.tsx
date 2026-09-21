import type { ComponentProps } from 'react'
import { Icon } from '@/components/stitch-ui/Icon'
import { cn } from '@/lib/cn'

/*
 * 5 variant đầu theo bảng "Status & Lifecycle Palette" trong DESIGN.md (token status-* trong globals.css).
 * Các variant còn lại là cặp màu lặp lại nhiều nhất trong 16 code.html.
 */
export type StatusVariant =
  | 'submitted'
  | 'review'
  | 'scheduled'
  | 'in-progress'
  | 'complete'
  | 'error'
  | 'neutral'
  | 'primary'
  | 'warning'
  | 'success'
  | 'active'
  | 'positive'
  | 'solid'
  | 'ready'
  | 'pending'

const variantClasses: Record<StatusVariant, { pill: string; dot: string }> = {
  submitted: { pill: 'bg-status-submitted-bg text-status-submitted', dot: 'bg-status-submitted-dot' },
  review: { pill: 'bg-status-review-bg text-status-review', dot: 'bg-status-review-dot' },
  scheduled: { pill: 'bg-status-scheduled-bg text-status-scheduled', dot: 'bg-status-scheduled-dot' },
  'in-progress': {
    pill: 'bg-status-in-progress-bg text-status-in-progress',
    dot: 'bg-status-in-progress-dot',
  },
  complete: { pill: 'bg-status-complete-bg text-status-complete', dot: 'bg-status-complete-dot' },
  error: { pill: 'bg-error-container text-on-error-container', dot: 'bg-error' },
  neutral: { pill: 'bg-surface-container-high text-on-surface-variant', dot: 'bg-outline' },
  primary: { pill: 'bg-surface-container-high text-primary', dot: 'bg-primary' },
  warning: { pill: 'bg-secondary-fixed text-on-secondary-fixed-variant', dot: 'bg-secondary-container' },
  success: { pill: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', dot: 'bg-tertiary-container' },
  active: { pill: 'bg-secondary-container text-on-secondary-container', dot: 'bg-secondary' },
  positive: { pill: 'bg-surface-container text-tertiary-container', dot: 'bg-tertiary-container' },
  solid: { pill: 'bg-primary-container text-on-primary', dot: 'bg-on-primary' },
  ready: { pill: 'bg-primary-fixed text-on-primary-fixed', dot: 'bg-primary' },
  pending: { pill: 'bg-surface-container-high text-on-surface-variant', dot: 'bg-secondary-container' },
}

const sizeClasses = {
  /** Spec DESIGN.md: py-1 px-3 */
  md: 'px-3 py-1',
  /** Bản gọn hay gặp trong bảng / card */
  sm: 'px-2.5 py-0.5',
} as const

export type StatusBadgeProps = ComponentProps<'span'> & {
  variant?: StatusVariant
  size?: keyof typeof sizeClasses
  /** Chấm 6px trước label (mặc định có) */
  dot?: boolean
  /** Chấm nhấp nháy cho trạng thái live */
  pulse?: boolean
  /** Icon Material Symbols thay/thêm cạnh chấm */
  icon?: string
}

export function StatusBadge({
  variant = 'neutral',
  size = 'md',
  dot = true,
  pulse = false,
  icon,
  className,
  children,
  ...rest
}: StatusBadgeProps) {
  const v = variantClasses[variant]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full text-label-sm',
        v.pill,
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {dot && <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', v.dot, pulse && 'animate-pulse')} />}
      {icon && <Icon name={icon} className="text-[14px]" />}
      {children}
    </span>
  )
}
