import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button, Card, IconButton, Input, PageHeader, SearchInput, Select, StatusBadge } from '@/components/common/stitch-ui'
import { DeleteProductDialog } from '@/features/products/components/DeleteProductDialog'
import { ProductFormDialog } from '@/features/products/components/ProductFormDialog'
import { ProductsTable } from '@/features/products/components/ProductsTable'
import { PRODUCT_SORT_OPTIONS, isProductActive, parseSort } from '@/features/products/components/productDisplay'
import { useChangeProductStatusMutation, useProductsQuery } from '@/features/products/hooks/useProducts'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { errorMessage } from '@/services/api/errors'
import type { ProductResponse } from '@/types/res/adminProductsRes'

/*
 * Quản lý sản phẩm: đọc GET /api/products (lọc, sắp xếp, phân trang phía server),
 * thêm / sửa / xoá / đổi trạng thái qua /api/admin/products.
 */

const PAGE_SIZE = 20
const breadcrumb = [{ label: 'Quản trị' }, { label: 'Sản phẩm' }]

type Filter = { search: string; productType: string; brand: string; sort: string }
const defaultFilter: Filter = { search: '', productType: '', brand: '', sort: PRODUCT_SORT_OPTIONS[0]!.value }

export function ProductsPage() {
  const [filter, setFilter] = useState<Filter>(defaultFilter)
  const [page, setPage] = useState(1)
  const [form, setForm] = useState<{ open: boolean; product: ProductResponse | null }>({ open: false, product: null })
  const [deleting, setDeleting] = useState<ProductResponse | null>(null)

  const search = useDebouncedValue(filter.search.trim())
  const productType = useDebouncedValue(filter.productType.trim())
  const brand = useDebouncedValue(filter.brand.trim())
  const query = useProductsQuery({
    Search: search,
    ProductType: productType,
    Brand: brand,
    Page: page,
    PageSize: PAGE_SIZE,
    ...parseSort(filter.sort),
  })
  const statusMutation = useChangeProductStatusMutation()

  const products = useMemo(() => query.data?.items ?? [], [query.data])
  const total = query.data?.totalItems ?? 0
  const isFiltering = filter.search !== '' || filter.productType !== '' || filter.brand !== ''

  // Gợi ý cho ô loại / nhóm trong form: các giá trị đang có trên trang hiện tại.
  const suggestions = useMemo(() => {
    const unique = (values: (string | null | undefined)[]) => [...new Set(values.filter((v): v is string => Boolean(v)))].sort()
    return { productTypes: unique(products.map((p) => p.productType)), categories: unique(products.map((p) => p.category)) }
  }, [products])

  const updateFilter = (patch: Partial<Filter>) => {
    setFilter((prev) => ({ ...prev, ...patch }))
    setPage(1)
  }

  const toggleStatus = async (product: ProductResponse) => {
    if (!product.id) return
    const next = isProductActive(product.status) ? 'INACTIVE' : 'ACTIVE'
    try {
      await statusMutation.mutateAsync({ id: product.id, body: { status: next } })
      toast.success(next === 'ACTIVE' ? `Đã mở bán lại ${product.name}` : `Đã ngừng bán ${product.name}`)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <>
      <PageHeader
        breadcrumb={breadcrumb}
        title="Sản phẩm"
        actions={
          <Button size="md" iconLeft="add_circle" onClick={() => setForm({ open: true, product: null })}>
            Thêm sản phẩm
          </Button>
        }
      />

      <Card padding="md" className="mb-space-md">
        <div className="flex flex-col gap-space-sm lg:flex-row lg:items-center">
          <SearchInput
            size="md"
            aria-label="Tìm sản phẩm"
            placeholder="Tìm theo tên, SKU, model…"
            value={filter.search}
            onChange={(e) => updateFilter({ search: e.target.value })}
            className="flex-1"
          />
          <div className="flex flex-wrap items-center gap-space-xs sm:flex-nowrap">
            <Input
              aria-label="Loại sản phẩm"
              placeholder="Loại sản phẩm"
              value={filter.productType}
              onChange={(e) => updateFilter({ productType: e.target.value })}
              className="sm:w-44"
            />
            <Input
              aria-label="Hãng"
              placeholder="Hãng"
              value={filter.brand}
              onChange={(e) => updateFilter({ brand: e.target.value })}
              className="sm:w-40"
            />
            <Select
              size="md"
              aria-label="Sắp xếp"
              options={PRODUCT_SORT_OPTIONS}
              value={filter.sort}
              onChange={(e) => updateFilter({ sort: e.target.value })}
              className="min-w-[180px]"
            />
            <IconButton
              icon="filter_alt_off"
              label="Xoá bộ lọc"
              size="md"
              disabled={!isFiltering}
              onClick={() => updateFilter({ search: '', productType: '', brand: '' })}
              className="h-11 w-11"
            />
          </div>
        </div>
      </Card>

      {query.isError ? (
        <Card padding="lg" className="flex flex-col items-start gap-space-sm">
          <p role="alert" className="text-body-md text-error">
            {errorMessage(query.error, 'Không tải được danh sách sản phẩm.')}
          </p>
          <Button variant="tonal" size="md" iconLeft="refresh" onClick={() => query.refetch()}>
            Thử lại
          </Button>
        </Card>
      ) : (
        <ProductsTable
          products={products}
          busyId={statusMutation.isPending ? statusMutation.variables?.id : null}
          onEdit={(product) => setForm({ open: true, product })}
          onToggleStatus={toggleStatus}
          onDelete={setDeleting}
          emptyMessage={
            query.isPending ? 'Đang tải sản phẩm…' : isFiltering ? 'Không có sản phẩm nào khớp bộ lọc' : 'Chưa có sản phẩm nào. Bấm "Thêm sản phẩm" để tạo.'
          }
          toolbar={
            <div className="flex items-center gap-space-xs">
              <span className="text-headline-md text-on-surface">Danh mục</span>
              <StatusBadge variant="neutral" size="sm" dot={false}>
                {total} sản phẩm
              </StatusBadge>
              {query.isFetching && !query.isPending && <span className="text-label-sm text-outline">Đang cập nhật…</span>}
            </div>
          }
          pagination={
            total > 0
              ? { page, pageSize: PAGE_SIZE, total, visibleCount: products.length, onPageChange: setPage, itemLabel: 'sản phẩm' }
              : undefined
          }
        />
      )}

      <ProductFormDialog
        open={form.open}
        product={form.product}
        suggestions={suggestions}
        onOpenChange={(open) => setForm((prev) => ({ ...prev, open }))}
      />
      <DeleteProductDialog product={deleting} onOpenChange={(open) => !open && setDeleting(null)} />
    </>
  )
}
