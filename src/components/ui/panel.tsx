import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cx'

/*
  A Panel is a section of the document, not a box: no fill, no border box.
  Consecutive panels in the same column are separated by one hairline.
*/
export function Panel({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cx('border-t border-line pt-6 first:border-t-0 first:pt-0', className)} {...rest}>
      {children}
    </section>
  )
}

export function PanelHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <header className={cx('mb-4 flex items-baseline justify-between gap-6', className)}>
      <div className="min-w-0">
        <h2 className="text-lg leading-6 font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-[15px] leading-6 text-fg-2">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </header>
  )
}

export function PanelBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={className}>{children}</div>
}

export function PanelFooter({ className, children }: { className?: string; children: ReactNode }) {
  return <footer className={cx('mt-5 flex flex-wrap items-center gap-3', className)}>{children}</footer>
}
