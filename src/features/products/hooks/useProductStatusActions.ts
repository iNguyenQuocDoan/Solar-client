import { useSyncExternalStore } from 'react'
import { toast } from 'sonner'
import { forgetHidden, rememberHidden, type HiddenProduct } from '@/features/products/hiddenProducts'
import { useChangeProductStatusMutation } from '@/features/products/hooks/useProducts'
import { errorMessage, isApiError } from '@/services/api/errors'
import type { ProductResponse } from '@/types/res/adminProductsRes'

/*
  Ngừng bán / mở bán lại của admin, dùng chung cho trang chi tiết, từng dòng danh sách và mục "Đã ngừng bán". Backend ẩn
  sản phẩm ngừng bán khỏi mọi API đọc, nên ghi nhớ sản phẩm (hiddenProducts.ts) trước khi gọi API; toast ngừng bán có
  "Hoàn tác". Trả true / false để trang biết đóng hộp thoại và chuyển trang hay giữ nguyên.

  Việc đang chờ nằm trong một kho chung của module, không theo từng trang: "Hoàn tác" bấm sau khi trang chi tiết đã đóng
  (ngừng bán xong là về danh sách) vẫn làm nút "Mở bán lại" ở danh sách khoá lại và ghi đúng việc đang làm; bấm lần nữa khi
  sản phẩm đang chờ thì bỏ qua, không gửi trùng.
*/
export type PendingStatus = 'hide' | 'reopen'

let pending: ReadonlyMap<string, PendingStatus> = new Map()
const listeners = new Set<() => void>()

function setPending(id: string, action: PendingStatus | null) {
  const next = new Map(pending)
  if (action) next.set(id, action)
  else next.delete(id)
  pending = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useProductStatusActions() {
  const mutation = useChangeProductStatusMutation()
  const pendingStatus = useSyncExternalStore(subscribe, () => pending)

  const reopen = async (entry: HiddenProduct) => {
    if (pending.has(entry.id)) return false
    setPending(entry.id, 'reopen')
    try {
      await mutation.mutateAsync({ id: entry.id, body: { status: 'ACTIVE' } })
      forgetHidden(entry.id)
      toast.success(`Đã mở bán lại ${entry.name}`)
      return true
    } catch (error) {
      // 404: sản phẩm đã bị xoá hẳn, không còn gì để mở bán.
      if (isApiError(error) && error.status === 404) forgetHidden(entry.id)
      toast.error(errorMessage(error))
      return false
    } finally {
      setPending(entry.id, null)
    }
  }

  const hide = async (product: ProductResponse) => {
    if (!product.id || pending.has(product.id)) return false
    const entry: HiddenProduct = {
      id: product.id,
      name: product.name ?? '',
      sku: product.sku ?? '',
      hiddenAt: new Date().toISOString(),
    }
    setPending(entry.id, 'hide')
    rememberHidden(entry)
    try {
      await mutation.mutateAsync({ id: entry.id, body: { status: 'INACTIVE' } })
      toast.success(`Đã ngừng bán ${entry.name}`, { action: { label: 'Hoàn tác', onClick: () => void reopen(entry) } })
      return true
    } catch (error) {
      // 4xx: chắc chắn chưa đổi trạng thái thì bỏ ghi nhớ; lỗi mạng/5xx thì có thể đã đổi, giữ lại để còn mở bán lại.
      if (isApiError(error) && error.status >= 400 && error.status < 500) forgetHidden(entry.id)
      toast.error(errorMessage(error))
      return false
    } finally {
      setPending(entry.id, null)
    }
  }

  return { hide, reopen, pendingStatus }
}
