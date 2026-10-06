import { useId, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button, IconButton, Input, PageHeader, SearchInput, Select } from '@/components/common/stitch-ui'
import { DeleteProductDialog } from '@/features/products/components/DeleteProductDialog'
import { ProductFormDialog } from '@/features/products/components/ProductFormDialog'
import { ProductsTable } from '@/features/products/components/ProductsTable'
import { PRODUCT_SORT_OPTIONS, SOLAR_PANEL_TYPE, isProductActive, parseSort } from '@/features/products/components/productDisplay'
import { useChangeProductStatusMutation, useProductsQuery } from '@/features/products/hooks/useProducts'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { errorMessage } from '@/services/api/errors'
import type { ProductResponse } from '@/types/res/adminProductsRes'

/*
 * Quản lý sản phẩm: đọc GET /api/products (lọc, sắp xếp, phân trang phía server),
 * thêm / sửa / xoá / đổi trạng thái qua /api/admin/products.
 */

const PAGE_SIZE = 20

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

  // Gợi ý cho ô loại / nhóm (bộ lọc và form): giá trị đang có trên trang hiện tại, luôn kèm SOLAR_PANEL
  // vì backend kiểm tra riêng mã này và mô phỏng 3D chỉ dùng tấm pin mang mã này.
  const suggestions = useMemo(() => {
    const unique = (values: (string | null | undefined)[]) => [...new Set(values.filter((v): v is string => Boolean(v)))].sort()
    return {
      productTypes: unique([SOLAR_PANEL_TYPE, ...products.map((p) => p.productType)]),
      categories: unique(products.map((p) => p.category)),
    }
  }, [products])
  const typesListId = useId()

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
        title="Sản phẩm"
        actions={
          <Button size="md" iconLeft="add_circle" onClick={() => setForm({ open: true, product: null })}>
            Thêm sản phẩm
          </Button>
        }
      />

      {/* Một khối: bộ lọc là thanh công cụ của bảng, không tách thành thẻ riêng. Lỗi hiện trong bảng để bộ lọc vẫn dùng được. */}
      <ProductsTable
        products={query.isError ? [] : products}
        busyId={statusMutation.isPending ? statusMutation.variables?.id : null}
        onEdit={(product) => setForm({ open: true, product })}
        onToggleStatus={toggleStatus}
        onDelete={setDeleting}
        emptyMessage={
          query.isError ? (
            <div role="alert" className="flex flex-col items-center gap-space-sm">
              <span className="text-error">{errorMessage(query.error, 'Không tải được danh sách sản phẩm.')}</span>
              <Button variant="tonal" size="sm" iconLeft="refresh" onClick={() => query.refetch()}>
                Thử lại
              </Button>
            </div>
          ) : query.isPending ? (
            'Đang tải sản phẩm…'
          ) : isFiltering ? (
            'Không có sản phẩm nào khớp bộ lọc'
          ) : (
            'Chưa có sản phẩm nào. Bấm "Thêm sản phẩm" để tạo.'
          )
        }
        toolbar={
          <div className="flex w-full flex-col gap-space-xs lg:flex-row lg:items-center">
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
                list={typesListId}
                value={filter.productType}
                onChange={(e) => updateFilter({ productType: e.target.value })}
                className="sm:w-44"
              />
              <datalist id={typesListId}>
                {suggestions.productTypes.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
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
        }
        pagination={
          !query.isError && total > 0
            ? { page, pageSize: PAGE_SIZE, total, visibleCount: products.length, onPageChange: setPage, itemLabel: 'sản phẩm' }
            : undefined
        }
      />

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
