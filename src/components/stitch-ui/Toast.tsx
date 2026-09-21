import { Icon } from '@/components/stitch-ui/Icon'
import { cn } from '@/lib/cn'

export type ToastProps = {
  open: boolean
  message: string
  icon?: string
  className?: string
}

/* Thông báo góc phải dưới theo roles_permissions: nền inverse-surface, trượt lên khi mở. */
export function Toast({ open, message, icon = 'check_circle', className }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-6 right-6 z-50 flex items-center gap-space-sm rounded-xl bg-inverse-surface px-space-md py-3 text-inverse-on-surface shadow-level-3 transition-all duration-300',
        open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-20 opacity-0',
        className,
      )}
    >
      <Icon name={icon} className="text-[20px] text-tertiary-fixed" />
      <span className="text-label-md">{message}</span>
    </div>
  )
}
