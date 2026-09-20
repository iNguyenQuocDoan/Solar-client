import { cx } from '@/lib/cx'

export type Chip<T extends string> = { value: T; label: string; count?: number }

/* Filters are tabs on a rule, not pills. */
export function FilterChips<T extends string>({
  chips,
  value,
  onChange,
  label,
}: {
  chips: Chip<T>[]
  value: T
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-x-6 gap-y-1 border-b border-line">
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
              '-mb-px inline-flex h-9 items-baseline gap-1.5 border-b-2 text-[15px] whitespace-nowrap',
              active ? 'border-fg font-semibold text-fg' : 'border-transparent text-fg-2 hover:text-fg',
            )}
          >
            {c.label}
            {c.count !== undefined && <span className="tnum text-[13px] text-fg-3">{c.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
