import { toast } from 'sonner'
import { Button } from '@/components/common/stitch-ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/stitch-ui/Dialog'
import { useDeleteProductMutation } from '@/features/products/hooks/useProducts'
import { errorMessage } from '@/services/api/errors'
import type { ProductResponse } from '@/types/res/adminProductsRes'

/* Xác nhận trước khi gọi DELETE /api/admin/products/{id}. */

export type DeleteProductDialogProps = {
  product: ProductResponse | null
  onOpenChange: (open: boolean) => void
}

export function DeleteProductDialog({ product, onOpenChange }: DeleteProductDialogProps) {
  const mutation = useDeleteProductMutation()

  const confirm = async () => {
    if (!product?.id) return
    try {
      await mutation.mutateAsync(product.id)
      toast.success(`Đã xoá ${product.name}`)
      onOpenChange(false)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <Dialog open={Boolean(product)} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Xoá sản phẩm?</DialogTitle>
          <DialogDescription>
            {product?.name} ({product?.sku}) sẽ bị xoá khỏi danh mục. Nếu chỉ muốn tạm ẩn, hãy chuyển sang Ngừng bán.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button variant="ghost" size="md">
              Hủy
            </Button>
          </DialogClose>
          <Button size="md" iconLeft="delete" className="bg-error hover:bg-error" disabled={mutation.isPending} onClick={confirm}>
            {mutation.isPending ? 'Đang xoá…' : 'Xoá'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
