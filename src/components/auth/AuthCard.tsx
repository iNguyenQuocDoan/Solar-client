import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type AuthCardProps = {
  className?: string
  children: ReactNode
}

/** Card trắng bên phải AuthLayout – theo `.auth-view` trong auth_portal/code.html. */
export function AuthCard({ className, children }: AuthCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-xl bg-surface-container-lowest p-space-lg shadow-sm md:p-space-2xl',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Dấu * đỏ sau nhãn trường bắt buộc. */
export function RequiredMark() {
  return <span className="text-error">*</span>
}
