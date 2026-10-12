import { useState } from 'react'
import { toast } from 'sonner'
import { forgetHidden, rememberHidden, type HiddenProduct } from '@/features/products/hiddenProducts'
import { useChangeProductStatusMutation } from '@/features/products/hooks/useProducts'
import { errorMessage, isApiError } from '@/services/api/errors'
import type { ProductResponse } from '@/types/res/adminProductsRes'

/*
  Ngừng bán / mở bán lại của admin, dùng chung cho trang chi tiết (Ngừng bán) và trang danh sách (Mở bán lại trong mục
  "Đã ngừng bán"). Backend ẩn sản phẩm ngừng bán khỏi mọi API đọc, nên ghi nhớ sản phẩm (hiddenProducts.ts) trước khi
  gọi API; toast ngừng bán có "Hoàn tác". Một mutation cho nhiều sản phẩm, nên tự giữ các id đang chờ thay vì isPending.
  Trả true / false để trang biết đóng hộp thoại và chuyển trang hay giữ nguyên.
*/
export function useProductStatusActions() {
  const mutation = useChangeProductStatusMutation()
  const [pendingIds, setPendingIds] = useState<ReadonlySet<string>>(new Set())
  const mark = (id: string, on: boolean) =>
    setPendingIds((prev) => {
      const next = new Set(prev)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })

  const reopen = async (entry: HiddenProduct) => {
    mark(entry.id, true)
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
      mark(entry.id, false)
    }
  }

  const hide = async (product: ProductResponse) => {
    if (!product.id) return false
    const entry: HiddenProduct = { id: product.id, name: product.name ?? '', sku: product.sku ?? '', hiddenAt: new Date().toISOString() }
    rememberHidden(entry)
    mark(entry.id, true)
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
      mark(entry.id, false)
    }
  }

  return { hide, reopen, pendingIds }
}
