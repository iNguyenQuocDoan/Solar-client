import { cx } from '@/utils/cx'
import type { Shot } from '@/data/landing'

// Có `src` thì hiện ảnh, chưa có thì hiện khung đúng tỷ lệ ghi cần ảnh gì
export function LandingPhoto({
  shot,
  sizes,
  priority = false,
  className,
}: {
  shot: Shot
  sizes?: string
  /** Ảnh LCP (hero): tải ngay, ưu tiên cao */
  priority?: boolean
  className?: string
}) {
  if (shot.src) {
    return (
      <img
        src={shot.src}
        srcSet={shot.srcSet}
        sizes={sizes}
        width={shot.width}
        height={shot.height}
        alt={shot.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={cx('block h-full w-full object-cover', className)}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={`${shot.alt} – ảnh cần bổ sung`}
      className={cx('flex h-full w-full items-end bg-surface-3 p-4 lg:p-6', className)}
    >
      <span className="max-w-72 ld-meta text-fg-2">Ảnh cần bổ sung: {shot.need}</span>
    </div>
  )
}
