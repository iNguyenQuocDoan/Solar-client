import { useSyncExternalStore } from 'react'
import { toast } from 'sonner'
import { forgetHidden, rememberHidden, type HiddenProduct } from '@/features/products/hiddenProducts'
import { useChangeProductStatusMutation } from '@/features/products/hooks/useProducts'
import { errorMessage, isApiError } from '@/services/api/errors'
import type { ProductResponse } from '@/types/res/adminProductsRes'

// Ngừng bán / mở bán lại, dùng chung cho trang chi tiết và danh sách
// Lưu sản phẩm (hiddenProducts.ts) trước khi gọi API. Việc đang chờ lưu ở module để không gửi trùng
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
      // 4xx thì chắc chắn chưa đổi nên bỏ lưu, lỗi mạng / 5xx thì có thể đã đổi nên giữ lại
      if (isApiError(error) && error.status >= 400 && error.status < 500) forgetHidden(entry.id)
      toast.error(errorMessage(error))
      return false
    } finally {
      setPending(entry.id, null)
    }
  }

  return { hide, reopen, pendingStatus }
}
