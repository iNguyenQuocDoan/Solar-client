import { cx } from '@/utils/cx'

/* `accent`: chữ cái đầu của người đang đăng nhập (nút tài khoản), nền màu thương hiệu nhạt. */
export function Avatar({
  name,
  size = 'md',
  tone = 'neutral',
  className,
}: {
  name: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'neutral' | 'accent'
  className?: string
}) {
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
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        tone === 'accent' ? 'bg-accent-muted text-accent-fg' : 'bg-surface-3 text-fg-2',
        dims,
        className,
      )}
    >
      {initials}
    </span>
  )
}
