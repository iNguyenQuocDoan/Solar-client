import type { DialogHTMLAttributes, ReactNode, Ref } from 'react'
import { cx } from '@/lib/cx'

/*
  Native <dialog>, opened with ref.current.showModal(). The only floating layer
  in the product, so the only place --shadow-pop is used.
*/
export function Dialog({ ref, className, children, ...rest }: DialogHTMLAttributes<HTMLDialogElement> & { ref: Ref<HTMLDialogElement> }) {
  return (
    <dialog
      ref={ref}
      className={cx(
        'm-auto w-[calc(100%-2rem)] max-w-md rounded-container border border-line bg-canvas p-6 text-fg shadow-pop backdrop:bg-fg/40',
        className,
      )}
      {...rest}
    >
      {children}
    </dialog>
  )
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-title font-semibold">{children}</h2>
}

/* Right-aligned actions; the primary action goes last. */
export function DialogFooter({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mt-6 flex flex-wrap justify-end gap-3', className)}>{children}</div>
}
