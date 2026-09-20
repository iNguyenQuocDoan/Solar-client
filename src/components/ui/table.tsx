import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'

/*
  A table takes the width of its container; columns decide their own wrapping
  (numbers and actions set whitespace-nowrap, text is allowed to wrap). When it
  still overflows, the wrapper scrolls and shades the clipped edge so the
  overflow is visible. Secondary columns hide from md up with `hidden md:table-cell`.

  `stack`: below lg every row becomes a block of label/value pairs, using each
  cell's `label` (rendered as data-label). Hidden columns come back in that
  layout, so a phone or tablet sees every field instead of a sideways scroll.
*/
export function Table({ stack, className, ...rest }: HTMLAttributes<HTMLTableElement> & { stack?: boolean }) {
  return (
    <div className="scroll-x relative -mx-4 px-4 [scrollbar-width:thin] md:mx-0 md:px-0">
      <table className={cx('w-full border-collapse text-body', stack && 'table-stack', className)} {...rest} />
    </div>
  )
}

export function Th({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cx('border-b border-line-2 px-3 pb-2 text-left align-bottom text-meta font-medium whitespace-nowrap text-fg-2 first:pl-0 last:pr-0', className)}
      {...rest}
    />
  )
}

export function Td({ label, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement> & { label?: string }) {
  return <td data-label={label} className={cx('border-b border-line px-3 py-3 align-top first:pl-0 last:pr-0', className)} {...rest} />
}

export function Tr({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={className} {...rest} />
}
