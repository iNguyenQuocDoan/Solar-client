import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { Notice } from '@/components/common/ui/lists'
import { DeleteProductDialog } from '@/features/products/components/DeleteProductDialog'
import { HideProductDialog, ProductActions } from '@/features/products/components/ProductActions'
import { ProductFormDialog } from '@/features/products/components/ProductFormDialog'
import { panelSpecGaps } from '@/features/products/components/productDisplay'
import { useProductOptions } from '@/features/products/hooks/useProductOptions'
import { useProductStatusActions } from '@/features/products/hooks/useProductStatusActions'
import { useProductQuery } from '@/features/products/hooks/useProducts'
import { CatalogProductPage } from '@/pages/catalog-product-page'
import { ROUTES } from '@/routes/paths'

// Chi tiết sản phẩm của admin: Sửa, Ngừng bán, Xoá
// Ngừng bán / xoá xong thì quay về danh sách vì backend ẩn sản phẩm ngừng bán
export function AdminProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = useProductQuery(id).data
  const [editing, setEditing] = useState(false)
  const options = useProductOptions({ enabled: editing })
  const { hide, pendingStatus } = useProductStatusActions()
  const [deleting, setDeleting] = useState(false)
  const [hiding, setHiding] = useState(false)
  const busy = Boolean(id && pendingStatus.has(id))
  // Quay về đúng danh sách đã mở (giữ bộ lọc và trang)
  const fromList = (useLocation().state as { backTo?: unknown } | null)?.backTo
  const backTo =
    typeof fromList === 'string' && fromList.startsWith(ROUTES.ADMIN.PRODUCTS) ? fromList : ROUTES.ADMIN.PRODUCTS
  const backToList = () => navigate(backTo, { replace: true })

  return (
    <>
      <CatalogProductPage
        admin
        action={(p) => (
          <ProductActions
            product={p}
            busy={busy}
            onEdit={() => setEditing(true)}
            onHide={() => setHiding(true)}
            onDelete={() => setDeleting(true)}
          />
        )}
        notice={(p) => {
          const gaps = panelSpecGaps(p)
          if (!gaps.power && !gaps.size) return null
          const missing = [gaps.power && 'công suất', gaps.size && 'kích thước'].filter(Boolean).join(' và ')
          return (
            <Notice tone="danger" title={`Thiếu ${missing}`} className="mb-6">
              Mô phỏng bố trí của khách chưa dùng được tấm pin này. Bấm &quot;Sửa&quot; để nhập thêm.
            </Notice>
          )
        }}
      />

      <ProductFormDialog
        open={editing}
        product={product ?? null}
        suggestions={{ productTypes: options.productTypes, categories: options.categories }}
        onOpenChange={setEditing}
      />
      <DeleteProductDialog
        product={deleting ? (product ?? null) : null}
        onOpenChange={(open) => !open && setDeleting(false)}
        onDeleted={backToList}
      />
      <HideProductDialog
        product={hiding ? (product ?? null) : null}
        busy={busy}
        onClose={() => setHiding(false)}
        onConfirm={(p) =>
          void hide(p).then((ok) => {
            if (!ok) return
            setHiding(false)
            backToList()
          })
        }
      />
    </>
  )
}
