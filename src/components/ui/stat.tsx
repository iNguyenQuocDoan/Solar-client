import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

export function StatRow({ children, className }: { children: ReactNode; className?: string }) {
  return <dl className={cx('grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4', className)}>{children}</dl>
}

/* A figure with its label. Figures sit on the page; dividers separate them on wide screens. */
export function Stat({
  label,
  value,
  unit,
  note,
  tone,
  className,
}: {
  label: ReactNode
  value: ReactNode
  unit?: ReactNode
  note?: ReactNode
  tone?: 'default' | 'warn' | 'danger' | 'ok'
  className?: string
}) {
  const valueTone =
    tone === 'danger' ? 'text-danger' : tone === 'warn' ? 'text-warn' : tone === 'ok' ? 'text-ok' : 'text-fg'
  return (
    <div className={cx('min-w-0 md:border-l md:border-line md:pl-6 md:first:border-0 md:first:pl-0', className)}>
      <dt className="text-[13px] leading-5 text-fg-2">{label}</dt>
      <dd className="mt-1 flex flex-wrap items-baseline gap-x-1.5">
        <span className={cx('tnum text-[30px] leading-9 font-semibold tracking-tight', valueTone)}>{value}</span>
        {unit && <span className="text-[15px] text-fg-2">{unit}</span>}
      </dd>
      {note && <dd className="mt-1 text-[13px] leading-5 text-fg-3">{note}</dd>}
    </div>
  )
}
