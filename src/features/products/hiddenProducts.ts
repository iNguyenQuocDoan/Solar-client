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

/*
  `snapshot` chỉ là bản đọc cho useSyncExternalStore (cùng một mảng tới khi đổi). Nguồn thật là localStorage: mỗi lần ghi
  đều đọc lại localStorage rồi mới sửa, nên trang không theo dõi kho (trang chi tiết) cũng không ghi đè bằng bản cũ những gì
  tab khác vừa lưu – nếu không, sản phẩm tab kia vừa ngừng bán sẽ mất khỏi danh sách và không còn chỗ nào mở bán lại.
  Một listener `storage` cho cả module (gắn khi có người theo dõi đầu tiên), đọc lại một lần rồi báo mọi người theo dõi.
*/
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

/* `change` trả lại đúng mảng nhận vào khi không có gì đổi: khi đó không ghi, chỉ cập nhật bản đọc nếu nó đã cũ. */
function update(change: (list: HiddenProduct[]) => HiddenProduct[]) {
  const current = readHiddenProducts()
  const next = change(current)
  if (next !== current) writeHiddenProducts(next)
  if (JSON.stringify(next) !== JSON.stringify(snapshot)) publish(next)
}

/** Ghi nhớ TRƯỚC khi gọi API ngừng bán: tải lại trang lúc đang chờ thì sản phẩm vẫn còn để mở bán lại. */
export function rememberHidden(entry: HiddenProduct) {
  update((list) => [entry, ...list.filter((h) => h.id !== entry.id)])
}

export function forgetHidden(id: string) {
  update((list) => (list.some((h) => h.id === id) ? list.filter((h) => h.id !== id) : list))
}

export function useHiddenProducts() {
  return useSyncExternalStore(subscribe, () => snapshot)
}
