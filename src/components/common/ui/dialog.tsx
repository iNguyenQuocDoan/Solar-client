import { useLayoutEffect, useRef, type DialogHTMLAttributes, type ReactNode, type Ref } from 'react'
import { cx } from '@/utils/cx'

/*
  Native <dialog>, opened with ref.current.showModal(). The only floating layer
  in the product, so the only place --shadow-pop is used.
*/
export function Dialog({ ref, className, children, ...rest }: DialogHTMLAttributes<HTMLDialogElement> & { ref: Ref<HTMLDialogElement> }) {
  return (
    <dialog
      ref={ref}
      className={cx(
        'm-auto w-[calc(100%-2rem)] rounded-container border border-line bg-canvas p-6 text-fg shadow-pop backdrop:bg-fg/40',
        // cx không gộp class: chỉ đặt bề rộng mặc định khi nơi gọi không tự đặt max-w-*.
        !/(^|\s)max-w-/.test(className ?? '') && 'max-w-md',
        className,
      )}
      {...rest}
    >
      {children}
    </dialog>
  )
}

/*
  Controlled variant for dialogs the parent opens with state. Children mount only while open, so a form
  inside starts fresh each time. Esc closes through onOpenChange unless `dismissible` is false (e.g. while saving).
*/
export function ModalDialog({
  open,
  onOpenChange,
  dismissible = true,
  onAfterClose,
  className,
  children,
  ...rest
}: Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open'> & {
  open: boolean
  onOpenChange: (open: boolean) => void
  dismissible?: boolean
  /**
   * Chạy ngay sau khi hộp thoại đóng, tức là SAU khi trình duyệt trả focus về nút đã mở nó. Dùng để chuyển focus
   * tới chỗ khác khi nút đó không còn (dòng vừa xoá / vừa ngừng bán biến khỏi bảng).
   */
  onAfterClose?: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  // Luôn gọi bản onAfterClose mới nhất mà không phải đưa nó vào deps (hàm mới mỗi lần render).
  const afterCloseRef = useRef(onAfterClose)
  useLayoutEffect(() => {
    afterCloseRef.current = onAfterClose
  })
  // Layout effect: đóng trước khi trình duyệt vẽ, nếu không sẽ loé một khung dialog rỗng (children đã gỡ).
  useLayoutEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) {
      dialog.close()
      afterCloseRef.current?.()
    }
  }, [open])
  return (
    <Dialog
      ref={ref}
      className={className}
      onCancel={(e) => {
        if (!dismissible) e.preventDefault()
      }}
      onClose={() => {
        // Chrome cho lần Esc thứ hai đóng hộp thoại dù sự kiện cancel đã bị chặn: đang bận thì mở lại ngay.
        if (!dismissible && open) {
          ref.current?.showModal()
          return
        }
        onOpenChange(false)
      }}
      {...rest}
    >
      {open && children}
    </Dialog>
  )
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-title font-semibold">{children}</h2>
}

/* Right-aligned actions; the primary action goes last. */
export function DialogFooter({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mt-6 flex flex-wrap justify-end gap-3', className)}>{children}</div>
}
