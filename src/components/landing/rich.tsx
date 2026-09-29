import { Fragment } from 'react'
import type { Copy, Rich as RichValue } from '@/lib/mock/landing'

/** Chỗ chưa có dữ kiện thật. Màu warn vì đây là việc phải làm trước khi công bố, không phải trang trí. */
export function NeedMark({ children }: { children: string }) {
  return <span className="text-warn">[CẦN: {children}]</span>
}

/** Chữ lấy từ mock: chuỗi thường hoặc `{ need }`, có thể trộn trong một câu. */
export function Rich({ value }: { value: RichValue }) {
  const parts: Copy[] = Array.isArray(value) ? value : [value]
  return (
    <>
      {parts.map((part, i) =>
        typeof part === 'string' ? <Fragment key={i}>{part}</Fragment> : <NeedMark key={i}>{part.need}</NeedMark>,
      )}
    </>
  )
}
