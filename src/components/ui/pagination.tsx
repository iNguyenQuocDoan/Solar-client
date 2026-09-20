import { cx } from '@/lib/cx'

/*
  Page numbers as quiet text (only the current one below md); it sits on a tinted field so the
  one solid button on a list page stays free for the page's real action.
*/
export function Pagination({
  page,
  pages,
  onChange,
  className,
}: {
  page: number
  pages: number
  onChange?: (page: number) => void
  className?: string
}) {
  const shown = pages <= 5 ? Array.from({ length: pages }, (_, i) => i + 1) : [1, 2, 3, null, pages]
  const item = 'press h-11 min-w-11 items-center justify-center rounded-control px-2 text-body lg:h-8 lg:min-w-8'
  return (
    <nav aria-label="Pagination" className={cx('flex items-center gap-1', className)}>
      <button
        type="button"
        className={cx(item, 'inline-flex px-3 text-fg-2 hover:text-fg disabled:text-fg-3')}
        disabled={page <= 1}
        onClick={() => onChange?.(page - 1)}
      >
        Previous
      </button>
      {shown.map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className="hidden px-1 text-fg-3 md:inline" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => onChange?.(p)}
            className={cx('tnum', item, p === page ? 'inline-flex bg-surface-2 font-semibold text-fg' : 'hidden text-fg-2 hover:text-fg md:inline-flex')}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className={cx(item, 'inline-flex px-3 text-fg-2 hover:text-fg disabled:text-fg-3')}
        disabled={page >= pages}
        onClick={() => onChange?.(page + 1)}
      >
        Next
      </button>
    </nav>
  )
}
