import { useMemo, useRef, useState } from 'react'
import { Badge } from '@/components/common/ui/badge'
import { Button } from '@/components/common/ui/button'
import { SearchInput, Select } from '@/components/common/ui/field'
import { FilterBar } from '@/components/common/ui/filter-bar'
import { PageHeader } from '@/components/common/ui/page-header'
import { Pagination } from '@/components/common/ui/pagination'
import { EmptyState, ErrorState, Skeleton } from '@/components/common/ui/states'
import { formatDateTime } from '@/features/pre-surveys/components/preSurveyDisplay'
import { DeleteProductDialog } from '@/features/products/components/DeleteProductDialog'
import { HideProductDialog } from '@/features/products/components/ProductActions'
import { ProductFormDialog } from '@/features/products/components/ProductFormDialog'
import { ProductsTable } from '@/features/products/components/ProductsTable'
import { PRODUCT_SORT_OPTIONS, SOLAR_PANEL_QUERY, panelSpecGaps, parseSort, productTypeLabel } from '@/features/products/components/productDisplay'
import { useHiddenProducts } from '@/features/products/hiddenProducts'
import { useProductOptions } from '@/features/products/hooks/useProductOptions'
import { useProductStatusActions } from '@/features/products/hooks/useProductStatusActions'
import { useProductsQuery } from '@/features/products/hooks/useProducts'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { ROUTES, withId } from '@/routes/paths'
import { errorMessage } from '@/services/api/errors'
import type { ProductResponse } from '@/types/res/adminProductsRes'
import { cx } from '@/utils/cx'

/*
  Quản lý sản phẩm (bộ portal kit): danh sách đọc GET /api/products (lọc, sắp xếp, phân trang phía server), bấm một dòng
  mở trang chi tiết /admin/products/:id. Sửa / Ngừng bán / Xoá có ngay trên từng dòng và ở trang chi tiết (12/10/2026);
  cuối trang là mục "Đã ngừng bán" để mở bán lại.
  Swagger không có API danh sách riêng cho admin nên dùng chung GET /api/products, và API đó không trả sản phẩm ngừng bán
  (xem hiddenProducts.ts): danh sách ở đây chỉ có sản phẩm đang bán.
*/

const PAGE_SIZE = 20

type Filter = { search: string; productType: string; brand: string; sort: string }
const defaultFilter: Filter = { search: '', productType: '', brand: '', sort: PRODUCT_SORT_OPTIONS[0]!.value }

export function AdminProductsPage() {
  const [filter, setFilter] = useState<Filter>(defaultFilter)
  const [page, setPage] = useState(1)
  const [form, setForm] = useState<{ open: boolean; product: ProductResponse | null }>({ open: false, product: null })
  const [deleting, setDeleting] = useState<ProductResponse | null>(null)
  const [hiding, setHiding] = useState<ProductResponse | null>(null)
  const hidden = useHiddenProducts()
  const { hide, reopen, pendingIds } = useProductStatusActions()
  const listRef = useRef<HTMLElement>(null)
  const hiddenHeadingRef = useRef<HTMLHeadingElement>(null)
  // Chỗ nhận focus khi hộp thoại (xoá / ngừng bán) đóng xong, vì dòng chứa nút vừa bấm biến khỏi bảng.
  const focusAfterDialog = useRef<HTMLElement | null>(null)
  const restoreFocus = () => {
    focusAfterDialog.current?.focus()
    focusAfterDialog.current = null
  }

  const search = useDebouncedValue(filter.search.trim())
  const query = useProductsQuery({
    Search: search,
    ProductType: filter.productType,
    Brand: filter.brand,
    Page: page,
    PageSize: PAGE_SIZE,
    ...parseSort(filter.sort),
  })
  const options = useProductOptions()
  // Cảnh báo ở đầu trang tính trên toàn bộ tấm pin, không chỉ trang đang xem (cùng cache với mô phỏng 3D).
  const panels = useProductsQuery(SOLAR_PANEL_QUERY)
  const incompletePanels = (panels.data?.items ?? []).filter((p) => {
    const gaps = panelSpecGaps(p)
    return gaps.power || gaps.size
  }).length

  const products = useMemo(() => query.data?.items ?? [], [query.data])
  const total = query.data?.totalItems ?? 0
  const pages = query.data?.totalPages ?? 0
  const isFiltering = filter.search !== '' || filter.productType !== '' || filter.brand !== ''
  // Trang cũ giữ trên màn hình trong lúc tải trang khác; nếu trang cũ trống thì coi như đang tải, đừng báo "chưa có".
  const loading = query.isPending || (query.isPlaceholderData && products.length === 0)

  // Trang hiện tại vượt quá số trang (vừa xoá hoặc ngừng bán dòng cuối, hoặc dữ liệu đổi ở nơi khác): backend vẫn
  // trả 200 với danh sách rỗng, nên tự lùi về trang cuối còn dữ liệu. Có điều kiện nên không lặp vô hạn.
  if (query.data && !query.isFetching && !query.isPlaceholderData && page > Math.max(1, pages)) setPage(Math.max(1, pages))

  const updateFilter = (patch: Partial<Filter>) => {
    setFilter((prev) => ({ ...prev, ...patch }))
    setPage(1)
  }
  const clearFilters = () => updateFilter({ search: '', productType: '', brand: '' })

  const from = (page - 1) * PAGE_SIZE + 1
  const to = from + products.length - 1

  return (
    <>
      <PageHeader
        title="Sản phẩm"
        description={
          incompletePanels > 0 ? (
            <Badge tone="danger" icon="warning">
              {incompletePanels} tấm pin thiếu công suất hoặc kích thước, chưa dùng được cho mô phỏng bố trí
            </Badge>
          ) : undefined
        }
        actions={
          <Button variant="primary" icon="add" onClick={() => setForm({ open: true, product: null })}>
            Thêm sản phẩm
          </Button>
        }
      />

      <FilterBar>
        <label className="min-w-0 flex-1 basis-64">
          <span className="sr-only">Tìm sản phẩm</span>
          <SearchInput
            name="search"
            placeholder="Tìm theo tên, SKU, hãng"
            value={filter.search}
            onChange={(e) => updateFilter({ search: e.target.value })}
          />
        </label>
        {/* Loại và hãng là danh sách chọn từ dữ liệu thật: backend chỉ lọc khớp đúng cả chuỗi. Đang lọc thì ô tô màu. */}
        <label className="w-full sm:w-52">
          <span className="sr-only">Loại sản phẩm</span>
          <Select
            name="productType"
            active={filter.productType !== ''}
            value={filter.productType}
            onChange={(e) => updateFilter({ productType: e.target.value })}
          >
            <option value="">Tất cả loại</option>
            {options.productTypes.map((type) => (
              <option key={type} value={type}>
                {productTypeLabel(type) === type ? type : `${productTypeLabel(type)} (${type})`}
              </option>
            ))}
          </Select>
        </label>
        <label className="w-full sm:w-44">
          <span className="sr-only">Hãng</span>
          <Select name="brand" active={filter.brand !== ''} value={filter.brand} onChange={(e) => updateFilter({ brand: e.target.value })}>
            <option value="">Tất cả hãng</option>
            {options.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </label>
        <label className="w-full sm:w-56">
          <span className="sr-only">Sắp xếp</span>
          <Select name="sort" value={filter.sort} onChange={(e) => updateFilter({ sort: e.target.value })}>
            {PRODUCT_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </label>
        {isFiltering && (
          <Button variant="ghost" icon="filter_alt_off" onClick={clearFilters}>
            Xoá bộ lọc
          </Button>
        )}
      </FilterBar>

      <section ref={listRef} tabIndex={-1} aria-label="Danh sách sản phẩm" aria-live="polite" aria-busy={query.isFetching}>
        {query.isError ? (
          <ErrorState message={errorMessage(query.error, 'Không tải được danh sách sản phẩm.')} onRetry={() => query.refetch()} />
        ) : loading ? (
          <div aria-label="Đang tải" className="space-y-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-14" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title={isFiltering ? 'Không có sản phẩm nào khớp bộ lọc' : 'Chưa có sản phẩm nào đang bán'}
            description={
              isFiltering
                ? 'Thử từ khoá khác hoặc bỏ bớt bộ lọc.'
                : hidden.length > 0
                  ? 'Sản phẩm đã ngừng bán nằm ở mục bên dưới.'
                  : 'Bấm "Thêm sản phẩm" để tạo sản phẩm đầu tiên.'
            }
            action={isFiltering ? <Button onClick={clearFilters}>Xoá bộ lọc</Button> : undefined}
          />
        ) : (
          <div className={cx(query.isFetching && 'opacity-70')}>
            <ProductsTable
              products={products}
              detailPath={(id) => withId(ROUTES.ADMIN.PRODUCT, id)}
              busyIds={pendingIds}
              onEdit={(product) => setForm({ open: true, product })}
              onHide={setHiding}
              onDelete={setDeleting}
            />
          </div>
        )}
      </section>

      {!query.isError && !loading && products.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="tnum text-meta text-fg-2">
            Hiển thị {from}–{to} trên {total} sản phẩm
          </p>
          {pages > 1 && <Pagination page={page} pages={pages} onChange={setPage} />}
        </div>
      )}

      {hidden.length > 0 && (
        <section className="mt-8 border-t border-line pt-4" aria-labelledby="hidden-products">
          <h2 ref={hiddenHeadingRef} id="hidden-products" tabIndex={-1} className="text-title font-semibold">
            Đã ngừng bán
          </h2>
          <p className="mt-1 max-w-prose text-body text-fg-2">
            Backend không trả sản phẩm ngừng bán trong danh sách. Đây là các sản phẩm đã ngừng bán từ trình duyệt này.
          </p>
          <ul className="mt-3 divide-y divide-line">
            {hidden.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-fg">{h.name || 'Sản phẩm chưa đặt tên'}</p>
                  <p className="tnum text-meta text-fg-3">
                    {h.sku}
                    {h.hiddenAt && `, ngừng bán lúc ${formatDateTime(h.hiddenAt)}`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="soft"
                  disabled={pendingIds.has(h.id)}
                  onClick={() =>
                    void reopen(h).then((ok) => {
                      // Dòng vừa mở bán biến khỏi mục này: đưa focus về danh sách thay vì rơi về đầu trang.
                      if (ok) requestAnimationFrame(() => listRef.current?.focus())
                    })
                  }
                >
                  {pendingIds.has(h.id) ? 'Đang mở bán…' : 'Mở bán lại'}
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ProductFormDialog
        open={form.open}
        product={form.product}
        suggestions={{ productTypes: options.productTypes, categories: options.categories }}
        onOpenChange={(open) => setForm((prev) => ({ ...prev, open }))}
      />
      <DeleteProductDialog
        product={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onDeleted={() => {
          focusAfterDialog.current = listRef.current
        }}
        onAfterClose={restoreFocus}
      />
      <HideProductDialog
        product={hiding}
        busy={Boolean(hiding?.id && pendingIds.has(hiding.id))}
        onClose={() => setHiding(null)}
        onAfterClose={restoreFocus}
        onConfirm={(product) =>
          void hide(product).then((ok) => {
            if (!ok) return
            // Dòng vừa ngừng bán chuyển xuống mục "Đã ngừng bán": đưa focus tới đó.
            focusAfterDialog.current = hiddenHeadingRef.current
            setHiding(null)
          })
        }
      />
    </>
  )
}
