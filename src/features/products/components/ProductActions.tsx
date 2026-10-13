import { Button, IconButton } from '@/components/common/ui/button'
import { DialogFooter, DialogTitle, ModalDialog } from '@/components/common/ui/dialog'
import { isProductActive } from '@/features/products/components/productDisplay'
import type { ProductResponse } from '@/types/res/adminProductsRes'
import { cx } from '@/utils/cx'

/*
  Ba thao tác của admin trên một sản phẩm, màu theo việc chúng làm (12/10/2026): Sửa xanh, Ngừng bán vàng (hoàn tác được),
  Xoá đỏ. Dùng ở đầu trang chi tiết và trên từng dòng danh sách (người dùng hỏi "tại sao lại không để cái nút này ở ngoài
  luôn cho tiện"). `compact` cho dòng danh sách: nút nhỏ, Xoá chỉ có icon (tooltip "Xoá sản phẩm"), tên sản phẩm đi kèm nhãn
  đọc cho trình đọc màn hình. Cụm nút nằm trên lớp link phủ cả dòng (relative z-10), nên bấm nút không mở trang chi tiết.
*/
export function ProductActions({
  product,
  busy = false,
  compact = false,
  onEdit,
  onHide,
  onDelete,
  className,
}: {
  product: ProductResponse
  busy?: boolean
  compact?: boolean
  onEdit: () => void
  onHide: () => void
  onDelete: () => void
  className?: string
}) {
  const size = compact ? 'sm' : 'md'
  const name = product.name ?? ''
  // Trên dòng danh sách, tên sản phẩm đi kèm nhãn cho trình đọc màn hình bằng chữ ẩn (không dùng aria-label, để nhãn
  // "Đang ngừng bán…" lúc chờ vẫn được đọc).
  const forName = compact && name ? <span className="sr-only"> {name}</span> : null
  return (
    <div className={cx('relative z-10 flex flex-wrap items-center gap-2', className)}>
      <Button size={size} variant="soft" icon="edit" onClick={onEdit}>
        Sửa{forName}
      </Button>
      {isProductActive(product.status) && (
        <Button size={size} variant="warn" icon="visibility_off" disabled={busy} onClick={onHide}>
          {busy ? 'Đang ngừng bán…' : 'Ngừng bán'}
          {forName}
        </Button>
      )}
      {compact ? (
        <IconButton size="sm" variant="danger" icon="delete" label={`Xoá ${name}`} tooltip="Xoá sản phẩm" disabled={busy} onClick={onDelete} />
      ) : (
        <Button variant="danger" icon="delete" disabled={busy} onClick={onDelete}>
          Xoá
        </Button>
      )}
    </div>
  )
}

/* Hỏi lại trước khi ngừng bán: backend ẩn sản phẩm ngừng bán khỏi mọi API đọc, chỉ mở lại được từ trình duyệt này. */
export function HideProductDialog({
  product,
  busy,
  onConfirm,
  onClose,
  onAfterClose,
}: {
  product: ProductResponse | null
  busy: boolean
  onConfirm: (product: ProductResponse) => void
  onClose: () => void
  onAfterClose?: () => void
}) {
  return (
    <ModalDialog
      open={product !== null}
      onOpenChange={(open) => !open && onClose()}
      dismissible={!busy}
      onAfterClose={onAfterClose}
      aria-label="Ngừng bán sản phẩm"
    >
      <DialogTitle>Ngừng bán {product?.name}?</DialogTitle>
      <p className="mt-2 text-body text-fg-2">
        Sản phẩm ngừng bán bị ẩn khỏi mọi danh mục (backend không trả về nữa). Sau khi ngừng bán, sản phẩm nằm trong mục
        &quot;Đã ngừng bán&quot; cuối trang danh sách trên trình duyệt này để mở bán lại khi cần.
      </p>
      <DialogFooter>
        <Button variant="ghost" disabled={busy} onClick={onClose}>
          Huỷ
        </Button>
        <Button variant="warn" disabled={busy || !product} onClick={() => product && onConfirm(product)}>
          {busy ? 'Đang ngừng bán…' : 'Ngừng bán'}
        </Button>
      </DialogFooter>
    </ModalDialog>
  )
}
