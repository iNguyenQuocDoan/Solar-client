import { useState } from 'react'
import { cx } from '@/lib/cx'
import type { Photo } from '@/lib/mock/landing'

/* Nơi đặt ảnh thật của trang chủ và các đuôi được thử theo thứ tự. */
const PHOTO_DIR = '/images/landing/'
const PHOTO_EXTS = ['jpg', 'png', 'webp'] as const

/*
  Khung ảnh: có file `public/images/landing/<photo.file>.{jpg,png,webp}` thì hiện ảnh, cắt đầy khung
  (object-cover, giữ tâm); chưa có thì là khung chờ đúng tỷ lệ, ghi rõ cần ảnh gì. Trang không dùng
  ảnh stock hay ảnh ngẫu nhiên để lấp chỗ.
  Tỷ lệ BẮT BUỘC truyền bằng class `aspect-*` từ ngoài: cx chỉ nối chuỗi, không gộp class trùng.
  `bleed`: ảnh tràn viền, không bo góc, không viền đứt.
  Chỉ có `need` (không `photo`) thì luôn là khung chờ.
*/
export function PhotoSlot({
  photo,
  need = photo?.need ?? '',
  bleed,
  className,
}: {
  photo?: Photo
  need?: string
  bleed?: boolean
  className?: string
}) {
  // Chỉ số đuôi đang thử; vượt hết danh sách nghĩa là chưa có ảnh.
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const ext = PHOTO_EXTS[attempt]
  const src = photo && ext ? `${PHOTO_DIR}${photo.file}.${ext}` : undefined

  if (src && loaded) {
    return (
      <div className={cx('relative overflow-hidden bg-surface-2', !bleed && 'rounded-container', className)}>
        <img src={src} alt={photo?.alt ?? ''} decoding="async" className="absolute inset-0 size-full object-cover" />
      </div>
    )
  }

  return (
    <div
      role="img"
      aria-label={`Chưa có ảnh: ${need}`}
      className={cx(
        'relative flex bg-surface-2 p-4 ld-meta lg:p-6',
        // Ảnh tràn viền có khối chữ chồng lên mép dưới, nên ghi chú đặt ở trên.
        bleed ? 'w-full items-start' : 'items-end rounded-container border border-dashed border-line-2',
        className,
      )}
    >
      <span aria-hidden className="max-w-80 text-warn">
        [CẦN ẢNH: {need}]
      </span>
      {/* Thử tải ngầm; tải được mới đổi sang ảnh, lỗi thì thử đuôi kế tiếp. */}
      {src && (
        <img
          src={src}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute size-px opacity-0"
          onLoad={() => setLoaded(true)}
          onError={() => setAttempt((n) => n + 1)}
        />
      )}
    </div>
  )
}
