import { cx } from '@/lib/cx'

/*
  Khung chờ ảnh thật: đúng tỷ lệ và ý đồ crop của ảnh sẽ đặt vào, ghi rõ cần ảnh gì.
  Trang không dùng ảnh stock hay ảnh ngẫu nhiên để lấp chỗ.
*/
export function PhotoSlot({ need, className }: { need: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Chưa có ảnh: ${need}`}
      className={cx(
        'flex aspect-4/3 items-center justify-center rounded-container border border-dashed border-line-2 bg-surface-2 p-4 text-center ld-meta',
        className,
      )}
    >
      <span aria-hidden className="max-w-64 text-warn">
        [CẦN ẢNH: {need}]
      </span>
    </div>
  )
}
