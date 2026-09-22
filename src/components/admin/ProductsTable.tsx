import { useMemo, type ReactNode } from 'react'
import { DataTable, type DataTableColumn } from '@/components/stitch-ui/DataTable'
import { Icon } from '@/components/stitch-ui/Icon'
import type { PaginationProps } from '@/components/stitch-ui/Pagination'
import { StatusBadge } from '@/components/stitch-ui/StatusBadge'
import { cn } from '@/lib/cn'
import { formatUsd } from '@/lib/format'
import type { ProductRecord } from '@/lib/mock/products'

/* Bảng "Qualified Equipment Inventory" trong product_catalogue; hàng đang chọn tô nhạt + mũi tên primary. */

function buildColumns(selectedId: string | null): DataTableColumn<ProductRecord>[] {
  return [
    {
      key: 'product',
      header: 'Sản phẩm / SKU',
      render: (product) => {
        const selected = product.id === selectedId
        return (
          <div className="flex items-center gap-space-sm">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                selected ? 'bg-surface-container-high text-primary' : 'bg-surface-container-low text-on-surface-variant',
              )}
            >
              <Icon name={product.icon} className="text-[20px]" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className={cn('truncate text-label-lg', selected ? 'font-bold text-primary' : 'font-semibold text-on-surface')}>
                {product.name}
              </span>
              <span className="truncate text-label-sm text-outline">{product.sku}</span>
            </div>
          </div>
        )
      },
    },
    {
      key: 'category',
      header: 'Nhóm hàng',
      render: (product) => (
        <span className="whitespace-nowrap rounded-full bg-surface-container px-2.5 py-1 text-label-sm text-on-surface-variant">
          {product.categoryLabel}
        </span>
      ),
    },
    {
      key: 'specs',
      header: 'Thông số chính',
      render: (product) => (
        <div className="flex flex-col">
          <span className="text-label-md font-medium text-on-surface">{product.specPrimary}</span>
          <span className="text-label-sm text-on-surface-variant">{product.specSecondary}</span>
        </div>
      ),
    },
    {
      key: 'cost',
      header: 'Giá gốc',
      align: 'right',
      render: (product) => <span className="text-label-lg font-semibold text-on-surface">{formatUsd(product.baseCost)}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      align: 'center',
      render: (product) => (
        <StatusBadge
          variant={product.status === 'active' ? 'positive' : product.status === 'draft' ? 'neutral' : 'error'}
          size="sm"
          className="font-semibold"
        >
          {product.status === 'active' ? 'Active' : product.status === 'draft' ? 'Draft' : 'Discontinued'}
        </StatusBadge>
      ),
    },
    {
      key: 'open',
      header: '',
      align: 'center',
      className: 'px-space-xs',
      headerClassName: 'px-space-xs',
      render: (product) => (
        <Icon
          name={product.id === selectedId ? 'arrow_forward' : 'chevron_right'}
          className={cn('text-[20px]', product.id === selectedId ? 'text-primary' : 'text-outline')}
        />
      ),
    },
  ]
}

export type ProductsTableProps = {
  products: ProductRecord[]
  selectedId: string | null
  onSelect: (product: ProductRecord) => void
  toolbar?: ReactNode
  pagination?: PaginationProps
  className?: string
}

export function ProductsTable({ products, selectedId, onSelect, toolbar, pagination, className }: ProductsTableProps) {
  const columns = useMemo(() => buildColumns(selectedId), [selectedId])
  const selectedKeys = useMemo(() => new Set(selectedId ? [selectedId] : []), [selectedId])
  return (
    <DataTable
      size="compact"
      columns={columns}
      rows={products}
      rowKey={(product) => product.id}
      selectedKeys={selectedKeys}
      onRowClick={onSelect}
      toolbar={toolbar}
      pagination={pagination}
      emptyMessage="No products match the current filters"
      className={className}
    />
  )
}
