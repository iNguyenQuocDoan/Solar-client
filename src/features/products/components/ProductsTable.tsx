import type { ReactNode } from 'react'
import { IconButton } from '@/components/common/stitch-ui/Button'
import { DataTable, type DataTableColumn } from '@/components/common/stitch-ui/DataTable'
import type { PaginationProps } from '@/components/common/stitch-ui/Pagination'
import { StatusBadge } from '@/components/common/stitch-ui/StatusBadge'
import { formatMoney } from '@/utils/format'
import { formatPower, isProductActive, productStatusMeta } from '@/features/products/components/productDisplay'
import type { ProductResponse } from '@/types/res/adminProductsRes'

/* Bảng sản phẩm của /admin/products, dữ liệu lấy từ GET /api/products. */

export type ProductsTableProps = {
  products: ProductResponse[]
  onEdit: (product: ProductResponse) => void
  onToggleStatus: (product: ProductResponse) => void
  onDelete: (product: ProductResponse) => void
  /** id sản phẩm đang chờ đổi trạng thái / xoá, để khoá nút của đúng dòng đó */
  busyId?: string | null
  toolbar?: ReactNode
  pagination?: PaginationProps
  emptyMessage?: string
  className?: string
}

function buildColumns(): DataTableColumn<ProductResponse>[] {
  return [
    {
      key: 'product',
      header: 'Sản phẩm / SKU',
      render: (product) => (
        <div className="flex min-w-0 items-center gap-space-sm">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-lg bg-surface-container-low object-cover" />
          ) : (
            <span aria-hidden className="h-10 w-10 shrink-0 rounded-lg bg-surface-container-low" />
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-label-lg font-semibold text-on-surface">{product.name}</span>
            <span className="truncate text-label-sm text-outline">{product.sku}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Loại / nhóm',
      render: (product) => (
        <div className="flex flex-col">
          <span className="text-label-md text-on-surface">{product.productType}</span>
          {product.category && <span className="text-label-sm text-on-surface-variant">{product.category}</span>}
        </div>
      ),
    },
    {
      key: 'brand',
      header: 'Hãng / model',
      render: (product) => (
        <div className="flex flex-col">
          <span className="text-label-md text-on-surface">{product.brand}</span>
          {product.model && <span className="text-label-sm text-on-surface-variant">{product.model}</span>}
        </div>
      ),
    },
    {
      key: 'power',
      header: 'Công suất',
      align: 'right',
      render: (product) => <span className="text-label-md text-on-surface">{formatPower(product.ratedPowerW) ?? '—'}</span>,
    },
    {
      key: 'price',
      header: 'Đơn giá',
      align: 'right',
      render: (product) => (
        <div className="flex flex-col items-end">
          <span className="whitespace-nowrap text-label-lg font-semibold text-on-surface">
            {formatMoney(product.unitPrice, product.currency)}
          </span>
          {product.unit && <span className="text-label-sm text-on-surface-variant">/ {product.unit}</span>}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (product) => {
        const meta = productStatusMeta(product.status)
        return (
          <StatusBadge variant={meta.variant} size="sm" className="font-semibold">
            {meta.label}
          </StatusBadge>
        )
      },
    },
  ]
}

const columns = buildColumns()

export function ProductsTable({
  products,
  onEdit,
  onToggleStatus,
  onDelete,
  busyId,
  toolbar,
  pagination,
  emptyMessage = 'Chưa có sản phẩm nào',
  className,
}: ProductsTableProps) {
  return (
    <DataTable
      size="compact"
      columns={columns}
      rows={products}
      rowKey={(product) => product.id ?? product.sku ?? ''}
      toolbar={toolbar}
      pagination={pagination}
      emptyMessage={emptyMessage}
      className={className}
      actions={(product) => {
        const active = isProductActive(product.status)
        const busy = busyId === product.id
        return (
          <>
            <IconButton icon="edit" label={`Sửa ${product.name ?? ''}`} onClick={() => onEdit(product)} />
            <IconButton
              icon={active ? 'visibility_off' : 'visibility'}
              label={active ? 'Ngừng bán' : 'Mở bán lại'}
              disabled={busy}
              onClick={() => onToggleStatus(product)}
            />
            <IconButton
              icon="delete"
              label={`Xoá ${product.name ?? ''}`}
              disabled={busy}
              onClick={() => onDelete(product)}
              className="hover:text-error"
            />
          </>
        )
      }}
    />
  )
}
