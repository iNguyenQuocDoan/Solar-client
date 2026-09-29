import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { SAMPLE_LABEL } from '@/lib/mock/landing'

/*
  Khung tài khoản – kiểu khung duy nhất của trang. Bên trong là một phần màn portal khách hàng
  dựng lại bằng primitive thật (Table, KeyValueList, Progress) với dữ liệu minh hoạ, không gọi API.
  Chữ bên trong giữ thang portal (13 / 15 / 18) để phân biệt chữ của sản phẩm với chữ của trang.
*/
export function AccountFrame({
  screen,
  caption,
  className,
  children,
}: {
  screen: string
  caption?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <figure className={cx('min-w-0', className)}>
      <div className="rounded-container border border-line bg-canvas">
        <div className="flex min-h-10 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-2 text-meta lg:px-6">
          <span className="font-medium text-fg-2">{screen}</span>
          <span className="text-fg-3">{SAMPLE_LABEL}</span>
        </div>
        <div className="p-4 text-body lg:p-6">{children}</div>
      </div>
      {caption && <figcaption className="mt-3 max-w-copy ld-body text-fg-2">{caption}</figcaption>}
    </figure>
  )
}
