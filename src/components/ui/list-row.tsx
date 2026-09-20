import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

/*
  One record inside a list of many (approval queue, alert stream, work orders).
  Rows are separated by hairlines from the parent `divide-y`; a tone paints a rule
  in the left margin, and the selected row sits on a tinted field.
*/
export function ListRow({
  tone,
  selected,
  className,
  children,
}: {
  tone?: 'danger' | 'warn' | 'accent'
  selected?: boolean
  className?: string
  children: ReactNode
}) {
  const rule = tone === 'danger' ? 'border-l-danger' : tone === 'warn' ? 'border-l-warn' : tone === 'accent' ? 'border-l-accent' : undefined
  return (
    <li
      aria-current={selected ? 'true' : undefined}
      className={cx(
        'py-6',
        tone && cx('border-l-2 pl-4', rule),
        selected && '-mx-4 rounded-container bg-surface-2 px-4',
        className,
      )}
    >
      {children}
    </li>
  )
}

/* Actions sit under the record, one step closer than the gap between records. */
export function ListRowActions({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mt-4 flex flex-wrap items-center gap-3', className)}>{children}</div>
}
