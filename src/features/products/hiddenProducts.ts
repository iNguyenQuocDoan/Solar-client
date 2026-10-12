import { useSyncExternalStore } from 'react'

/*
 * Sản phẩm admin đã chuyển sang Ngừng bán từ trình duyệt này.
 *
 * Backend ẩn sản phẩm INACTIVE khỏi GET /api/products và cả GET /api/products/{id}, kể cả với admin
 * (dò 08/10/2026: ngừng bán xong, danh sách và trang chi tiết đều không còn sản phẩm đó), nên giao diện
 * không tự tìm lại được để mở bán. PATCH .../status theo id vẫn chạy, vì vậy lưu id + tên ở đây để còn
 * "Mở bán lại". Chỉ có trên trình duyệt đã bấm ngừng bán; khi backend có cách liệt kê sản phẩm ngừng bán
 * thì bỏ file này.
 *
 * Từ 12/10/2026 ngừng bán nằm ở trang chi tiết, mục "Đã ngừng bán" ở trang danh sách: hai trang đọc chung một kho
 * (useSyncExternalStore), nên bấm "Hoàn tác" trên toast lúc đã về danh sách thì mục đó đổi theo ngay. Tab khác
 * của cùng trình duyệt nghe sự kiện storage.
 */

const KEY = 'smartsolar.hidden-products'

export type HiddenProduct = { id: string; name: string; sku: string; hiddenAt: string }

function isHiddenProduct(value: unknown): value is HiddenProduct {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return typeof v.id === 'string' && typeof v.name === 'string' && typeof v.sku === 'string' && typeof v.hiddenAt === 'string'
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

let snapshot = readHiddenProducts()
const listeners = new Set<() => void>()

function setSnapshot(next: HiddenProduct[]) {
  snapshot = next
  writeHiddenProducts(next)
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return
    snapshot = readHiddenProducts()
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Ghi nhớ TRƯỚC khi gọi API ngừng bán: tải lại trang lúc đang chờ thì sản phẩm vẫn còn để mở bán lại. */
export function rememberHidden(entry: HiddenProduct) {
  setSnapshot([entry, ...snapshot.filter((h) => h.id !== entry.id)])
}

export function forgetHidden(id: string) {
  if (snapshot.some((h) => h.id === id)) setSnapshot(snapshot.filter((h) => h.id !== id))
}

export function useHiddenProducts() {
  return useSyncExternalStore(subscribe, () => snapshot)
}
