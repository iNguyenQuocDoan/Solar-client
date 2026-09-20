import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

/*
  Figures in a row share three subgrid tracks (label, value, note), so a label
  that wraps never pushes its figure out of line with the others.
  Columns: 2 on phones, 4 on md; pass `md:grid-cols-3` or `xl:grid-cols-6` when the data calls for it.
*/
export function StatRow({ children, className }: { children: ReactNode; className?: string }) {
  return <dl className={cx('grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4', className)}>{children}</dl>
}

/* A figure with its label. Numbers only; a text value belongs in a KeyValueList. */
export function Stat({
  label,
  value,
  unit,
  note,
  tone,
  size = 'md',
  className,
}: {
  label: ReactNode
  value: ReactNode
  unit?: ReactNode
  note?: ReactNode
  tone?: 'default' | 'warn' | 'danger' | 'ok'
  size?: 'md' | 'lg'
  className?: string
}) {
  const valueTone =
    tone === 'danger' ? 'text-danger' : tone === 'warn' ? 'text-warn' : tone === 'ok' ? 'text-ok' : 'text-fg'
  return (
    <div
      className={cx(
        'row-span-3 grid min-w-0 grid-rows-subgrid gap-y-1 md:border-l md:border-line md:pl-6 md:first:border-0 md:first:pl-0',
        className,
      )}
    >
      <dt className="text-meta text-fg-2">{label}</dt>
      <dd className="flex flex-wrap items-baseline gap-x-2">
        <span className={cx('tnum font-semibold', size === 'lg' ? 'text-display' : 'text-figure', valueTone)}>{value}</span>
        {unit && <span className="text-body text-fg-3">{unit}</span>}
      </dd>
      <dd className="text-meta text-fg-3">{note}</dd>
    </div>
  )
}
