import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cx } from '@/lib/cx'

export function PageHeader({
  title,
  description,
  meta,
  actions,
  back,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  back?: { to: string; label: string }
  className?: string
}) {
  return (
    <div className={cx('mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-5', className)}>
      <div className="min-w-0 max-w-[64ch]">
        {back && (
          <Link to={back.to} className="mb-3 inline-block text-[13px] text-fg-2 underline-offset-4 hover:text-fg hover:underline">
            {back.label}
          </Link>
        )}
        {meta && <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-fg-2">{meta}</div>}
        <h1 className="text-[30px] leading-9 font-semibold tracking-tight md:text-[36px] md:leading-[42px]">{title}</h1>
        {description && <p className="mt-3 text-[15px] leading-6 text-fg-2">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  )
}
