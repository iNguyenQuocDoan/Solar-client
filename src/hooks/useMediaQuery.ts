import { useCallback, useSyncExternalStore } from 'react'

/** Media query đang khớp hay không, cập nhật khi đổi cỡ cửa sổ (ví dụ qua mốc lg của rail). */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
}
