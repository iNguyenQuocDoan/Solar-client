import type { ReactNode } from 'react'
import { cx } from '@/utils/cx'

/*
  Figures in a row share three subgrid tracks (label, value, note), so a label
  that wraps never pushes its figure out of line with the others. No dividers:
  the gap does the separating, the figures are not tiles.
  Columns: 2 on phones, 4 on md; pass `md:grid-cols-3` or `xl:grid-cols-6` when the data calls for it.
*/
/*
  `framed`: các số gom trong một khung có viền, mỗi số một ô cách nhau bằng đường kẻ mảnh (nền đường kẻ lộ qua khe 1px).
  Dùng khi dải số đứng một mình trên trang rộng: không khung thì 4 số rải hết bề ngang, trông rời rạc (lịch theo ngày,
  người dùng chê 12/10/2026).
*/
export function StatRow({ children, className, framed = false }: { children: ReactNode; className?: string; framed?: boolean }) {
  return (
    <dl
      className={cx(
        'grid grid-cols-2 content-start md:grid-cols-4',
        framed
          ? 'gap-px overflow-hidden rounded-container border border-line bg-line *:bg-canvas *:px-4 *:py-3'
          : 'gap-x-8 gap-y-6',
        className,
      )}
    >
      {children}
    </dl>
  )
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
  const valueTone = tone === 'danger' ? 'text-danger' : tone === 'warn' ? 'text-warn' : 'text-fg'
  return (
    <div className={cx('row-span-3 grid min-w-0 grid-rows-subgrid gap-y-1', className)}>
      <dt className="text-meta text-fg-2">{label}</dt>
      <dd className="flex flex-wrap items-baseline gap-x-2">
        <span className={cx('tnum font-semibold', size === 'lg' ? 'text-display' : 'text-figure', valueTone)}>{value}</span>
        {unit && <span className="text-body text-fg-3">{unit}</span>}
      </dd>
      <dd className="text-meta text-fg-3">{note}</dd>
    </div>
  )
}
