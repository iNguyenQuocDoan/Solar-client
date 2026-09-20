import { cx } from '@/lib/cx'

export function Avatar({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter((p) => /^\p{L}/u.test(p))
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
  const dims = size === 'sm' ? 'size-7 text-meta' : size === 'lg' ? 'size-12 text-body' : 'size-9 text-meta'
  return (
    <span
      aria-hidden
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-surface-3 font-medium text-fg-2',
        dims,
        className,
      )}
    >
      {initials}
    </span>
  )
}
