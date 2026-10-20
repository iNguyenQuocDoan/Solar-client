import { Button, IconButton } from '@/components/common/ui/button'
import { DialogFooter, DialogTitle, ModalDialog } from '@/components/common/ui/dialog'
import { isProductActive } from '@/features/products/components/productDisplay'
import type { ProductResponse } from '@/types/res/adminProductsRes'
import { cx } from '@/utils/cx'

// Thao tác của admin trên một sản phẩm: Sửa, Ngừng bán, Xoá
// `compact` dùng trên dòng danh sách: nút nhỏ, Xoá chỉ có icon. Cụm nút nằm trên lớp link phủ dòng (z-10)
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
  // Dùng chữ ẩn thay cho aria-label để nhãn "Đang ngừng bán..." vẫn được đọc
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
        <IconButton
          size="sm"
          variant="danger"
          icon="delete"
          label={`Xoá ${name}`}
          tooltip="Xoá sản phẩm"
          disabled={busy}
          onClick={onDelete}
        />
      ) : (
        <Button variant="danger" icon="delete" disabled={busy} onClick={onDelete}>
          Xoá
        </Button>
      )}
    </div>
  )
}

// Hỏi lại trước khi ngừng bán vì backend ẩn sản phẩm khỏi mọi API đọc
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
