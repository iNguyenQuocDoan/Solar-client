import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

/*
  One shape for every list page: search and selects on the first line,
  stage tabs beneath, then a fixed step before the table or list.
*/
export function FilterBar({ children, tabs, className }: { children?: ReactNode; tabs?: ReactNode; className?: string }) {
  return (
    <div className={cx('mb-6 space-y-4', className)}>
      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
      {tabs}
    </div>
  )
}
