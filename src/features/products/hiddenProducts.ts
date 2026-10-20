import { useSyncExternalStore } from 'react'

// Sản phẩm đã ngừng bán từ trình duyệt này
// Backend ẩn sản phẩm INACTIVE khỏi mọi API đọc, nên phải lưu id + tên ở đây để còn "Mở bán lại"
// Bỏ file này khi backend có API liệt kê sản phẩm ngừng bán

const KEY = 'smartsolar.hidden-products'

export type HiddenProduct = { id: string; name: string; sku: string; hiddenAt: string }

function isHiddenProduct(value: unknown): value is HiddenProduct {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.sku === 'string' &&
    typeof v.hiddenAt === 'string'
  )
}

function readHiddenProducts(): HiddenProduct[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed.filter(isHiddenProduct) : []
  } catch {
    return []
  }
}

function writeHiddenProducts(list: HiddenProduct[]) {
  try {
    if (list.length) localStorage.setItem(KEY, JSON.stringify(list))
    else localStorage.removeItem(KEY)
  } catch {
    /* Trình duyệt chặn storage: vẫn ngừng bán được, chỉ không nhớ để mở bán lại. */
  }
}

// Nguồn thật là localStorage: mỗi lần ghi đều đọc lại trước, để không ghi đè thay đổi của tab khác
let snapshot = readHiddenProducts()
const listeners = new Set<() => void>()

function publish(next: HiddenProduct[]) {
  snapshot = next
  listeners.forEach((listener) => listener())
}

function onStorage(e: StorageEvent) {
  // key null: localStorage.clear() ở tab khác.
  if (e.key === KEY || e.key === null) publish(readHiddenProducts())
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) {
    // Trong lúc không ai theo dõi, tab khác có thể đã đổi danh sách: đọc lại trước khi gắn.
    snapshot = readHiddenProducts()
    window.addEventListener('storage', onStorage)
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('storage', onStorage)
  }
}

// Không có gì đổi thì không ghi
function update(change: (list: HiddenProduct[]) => HiddenProduct[]) {
  const current = readHiddenProducts()
  const next = change(current)
  if (next !== current) writeHiddenProducts(next)
  if (JSON.stringify(next) !== JSON.stringify(snapshot)) publish(next)
}

/** Lưu trước khi gọi API để tải lại trang giữa chừng vẫn còn sản phẩm */
export function rememberHidden(entry: HiddenProduct) {
  update((list) => [entry, ...list.filter((h) => h.id !== entry.id)])
}

export function forgetHidden(id: string) {
  update((list) => (list.some((h) => h.id === id) ? list.filter((h) => h.id !== id) : list))
}

export function useHiddenProducts() {
  return useSyncExternalStore(subscribe, () => snapshot)
}
