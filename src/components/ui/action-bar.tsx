import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

/*
  Sticky footer for multi-step work (assessment, survey, installation).
  It bleeds to the edges of the main column, matching the main padding
  (px-4 below md, px-12 from md), so its rule lines up with the page.
*/
export function ActionBar({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('sticky bottom-0 z-10 -mx-4 mt-8 border-t border-line bg-canvas/95 px-4 py-3 backdrop-blur md:-mx-12 md:px-12', className)}>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}
