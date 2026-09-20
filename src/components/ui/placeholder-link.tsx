import type { HTMLAttributes } from 'react'
import { cx } from '@/lib/cx'

/*
  A link whose destination is not part of this build. It keeps the look and the
  inline flow of the link it stands in for, is reachable from the keyboard,
  announces itself, and does nothing when pressed (the same convention as
  reserved entries in the rail). A span, not a button: buttons cannot sit inline in a sentence.
*/
export function PlaceholderLink({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span role="link" aria-disabled="true" tabIndex={0} title="Not available in this build" className={cx('cursor-pointer', className)} {...rest}>
      {children}
    </span>
  )
}
