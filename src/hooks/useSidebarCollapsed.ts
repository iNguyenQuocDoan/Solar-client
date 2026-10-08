import { useCallback, useState } from 'react'

const KEY = 'smartsolar.sidebar-collapsed'

function read() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Thu gọn sidebar trên desktop (từ lg), nhớ theo trình duyệt và dùng chung cho mọi portal.
 * Dưới lg sidebar luôn là drawer nên trạng thái này không có tác dụng.
 */
export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(read)
  const update = useCallback((next: boolean) => {
    setCollapsed(next)
    try {
      if (next) localStorage.setItem(KEY, '1')
      else localStorage.removeItem(KEY)
    } catch {
      /* Trình duyệt chặn storage: vẫn thu gọn được, chỉ không nhớ sau khi tải lại. */
    }
  }, [])
  return [collapsed, update] as const
}
