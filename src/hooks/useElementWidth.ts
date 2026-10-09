import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Bề rộng nội dung của một phần tử, cập nhật khi khung đổi cỡ (ResizeObserver). Dùng cho hình SVG vẽ bằng pixel
 * (mặt bằng mặt lắp, biểu đồ) để chữ giữ đúng 13px thay vì co giãn theo viewBox.
 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.clientWidth)
    const observer = new ResizeObserver(([entry]) => setWidth(entry!.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}
