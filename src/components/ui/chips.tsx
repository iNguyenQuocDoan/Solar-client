import { cx } from '@/lib/cx'

export type Chip<T extends string> = { value: T; label: string; count?: number }

/* Filters are tabs on a rule, not pills. They scroll sideways instead of wrapping, so the rule stays one line.
   The rule is an inset hairline (not a border) so the active tab's 2px line can sit exactly on it inside the scroller. */
export function FilterChips<T extends string>({
  chips,
  value,
  onChange,
  label,
  className,
}: {
  chips: Chip<T>[]
  value: T
  onChange: (v: T) => void
  label: string
  className?: string
}) {
  return (
    <div role="tablist" aria-label={label} className={cx('scroll-x flex gap-x-6 shadow-[inset_0_-1px_0_var(--color-line)] [scrollbar-width:none]', className)}>
      {chips.map((c) => {
        const active = c.value === value
        return (
          <button
            key={c.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(c.value)}
            className={cx(
              'inline-flex h-11 shrink-0 items-baseline gap-2 border-b-2 text-body whitespace-nowrap focus-visible:outline-offset-[-2px] lg:h-10',
              active ? 'border-fg font-semibold text-fg' : 'border-transparent text-fg-2 hover:text-fg',
            )}
          >
            {c.label}
            {c.count !== undefined && <span className="tnum text-meta text-fg-3">{c.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
