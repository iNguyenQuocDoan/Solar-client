import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '@/lib/cx'

/*
  A Panel is a section of the document, not a box: no fill, no border box.
  Consecutive panels in the same column are separated by one hairline.
  For repeated records inside one list use ListRow instead.
*/
export function Panel({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cx('border-t border-line pt-6 first:border-t-0 first:pt-0', className)} {...rest}>
      {children}
    </section>
  )
}

/* Title and action share a line; when the action is long they wrap instead of squeezing the title. */
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
    <header className={cx('mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2', className)}>
      <div className="min-w-0">
        <h2 className="text-title font-semibold">{title}</h2>
        {description && <p className="mt-1 max-w-prose text-body text-fg-2">{description}</p>}
      </div>
      {action && <div className="flex min-w-0 items-center gap-3 [&>a:not([class*=press])]:tap [&>button:not([class*=press])]:tap [&>span[role=link]]:tap">{action}</div>}
    </header>
  )
}

export function PanelBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={className}>{children}</div>
}

export function PanelFooter({ className, children }: { className?: string; children: ReactNode }) {
  return <footer className={cx('mt-6 flex flex-wrap items-center gap-3 [&>a:not([class*=press])]:tap [&>button:not([class*=press])]:tap [&>span[role=link]]:tap', className)}>{children}</footer>
}
