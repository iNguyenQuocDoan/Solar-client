import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

/**
 * Chiều cao khung nhìn (px), cập nhật khi đổi cỡ cửa sổ. Đọc clientHeight của <html> thay vì innerHeight: trên điện thoại
 * nó không đổi khi thanh địa chỉ ẩn / hiện lúc cuộn, nên hình vẽ cao theo khung nhìn không nhảy cỡ giữa chừng.
 */
export function useViewportHeight() {
  return useSyncExternalStore(subscribe, () => document.documentElement.clientHeight)
}
