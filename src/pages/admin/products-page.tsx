import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import { Badge } from '@/components/common/ui/badge'
import { Button } from '@/components/common/ui/button'
import { SearchInput, Select } from '@/components/common/ui/field'
import { FilterBar } from '@/components/common/ui/filter-bar'
import { PageHeader } from '@/components/common/ui/page-header'
import { Pagination } from '@/components/common/ui/pagination'
import { EmptyState, ErrorState, Skeleton } from '@/components/common/ui/states'
import { formatDateTime } from '@/features/pre-surveys/utils/preSurveyDisplay'
import { DeleteProductDialog } from '@/features/products/components/DeleteProductDialog'
import { HideProductDialog } from '@/features/products/components/ProductActions'
import { ProductFormDialog } from '@/features/products/components/ProductFormDialog'
import { ProductsTable } from '@/features/products/components/ProductsTable'
import {
  PRODUCT_SORT_OPTIONS,
  SOLAR_PANEL_QUERY,
  panelSpecGaps,
  parseSort,
  productTypeLabel,
} from '@/features/products/components/productDisplay'
import { useHiddenProducts } from '@/features/products/hiddenProducts'
import { useProductOptions } from '@/features/products/hooks/useProductOptions'
import { useProductStatusActions } from '@/features/products/hooks/useProductStatusActions'
import { useProductsQuery } from '@/features/products/hooks/useProducts'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { ROUTES, withId } from '@/routes/paths'
import { errorMessage } from '@/services/api/errors'
import type { ProductResponse } from '@/types/res/adminProductsRes'
import { cx } from '@/utils/cx'

// Quản lý sản phẩm: danh sách đọc GET /api/products, bấm dòng mở trang chi tiết
// API này không trả sản phẩm ngừng bán nên cuối trang có mục "Đã ngừng bán" (hiddenProducts.ts)
// Bộ lọc và trang lưu trên URL để Back quay lại đúng chỗ

const PAGE_SIZE = 20
const DEFAULT_SORT = PRODUCT_SORT_OPTIONS[0]!.value

export function AdminProductsPage() {
  const location = useLocation()
  const [params, setParams] = useSearchParams()
  const urlSearch = params.get('q') ?? ''
  const filter = {
    productType: params.get('loai') ?? '',
    brand: params.get('hang') ?? '',
    sort: params.get('sapxep') ?? DEFAULT_SORT,
  }
  const page = Math.max(1, Number.parseInt(params.get('trang') ?? '', 10) || 1)
  // Ô tìm gõ vào state riêng; giá trị đã ngừng gõ mới ghi lên địa chỉ (và mới gọi API).
  const [searchText, setSearchText] = useState(urlSearch)
  const search = useDebouncedValue(searchText.trim())

  const [form, setForm] = useState<{ open: boolean; product: ProductResponse | null }>({ open: false, product: null })
  const [deleting, setDeleting] = useState<ProductResponse | null>(null)
  const [hiding, setHiding] = useState<ProductResponse | null>(null)
  const hidden = useHiddenProducts()
  const { hide, reopen, pendingStatus } = useProductStatusActions()
  const listRef = useRef<HTMLElement>(null)
  const hiddenHeadingRef = useRef<HTMLHeadingElement>(null)
  // Nhận focus khi dialog đóng, vì dòng chứa nút vừa bấm đã mất
  const focusAfterDialog = useRef<HTMLElement | null>(null)
  const restoreFocus = () => {
    focusAfterDialog.current?.focus()
    focusAfterDialog.current = null
  }

  /** Ghi các tham số lên địa chỉ; chuỗi rỗng là bỏ tham số. */
  const setUrl = useCallback(
    (patch: Record<string, string>) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(patch)) {
            if (value) next.set(key, value)
            else next.delete(key)
          }
          return next
        },
        { replace: true },
      ),
    [setParams],
  )

  // Ghi từ khoá lên URL khi ngừng gõ
  useEffect(() => {
    if (search !== searchText.trim() || search === urlSearch) return
    setUrl({ q: search, trang: '' })
  }, [search, searchText, urlSearch, setUrl])

  const query = useProductsQuery({
    Search: urlSearch,
    ProductType: filter.productType,
    Brand: filter.brand,
    Page: page,
    PageSize: PAGE_SIZE,
    ...parseSort(filter.sort),
  })
  const options = useProductOptions()
  // Cảnh báo tính trên toàn bộ tấm pin, không chỉ trang đang xem
  const panels = useProductsQuery(SOLAR_PANEL_QUERY)
  const incompletePanels = (panels.data?.items ?? []).filter((p) => {
    const gaps = panelSpecGaps(p)
    return gaps.power || gaps.size
  }).length

  const products = useMemo(() => query.data?.items ?? [], [query.data])
  const total = query.data?.totalItems ?? 0
  const pages = query.data?.totalPages ?? 0
  const isFiltering = searchText.trim() !== '' || filter.productType !== '' || filter.brand !== ''
  // Đang giữ trang cũ mà trang cũ trống thì coi như đang tải
  const loading = query.isPending || (query.isPlaceholderData && products.length === 0)

  // Trang trên URL vượt quá số trang thì lùi về trang cuối còn dữ liệu
  const lastPage = Math.max(1, pages)
  const overflow = Boolean(query.data && !query.isFetching && !query.isPlaceholderData && page > lastPage)
  useEffect(() => {
    if (overflow) setUrl({ trang: lastPage > 1 ? String(lastPage) : '' })
  }, [overflow, lastPage, setUrl])

  const updateFilter = (patch: { loai?: string; hang?: string; sapxep?: string }) => setUrl({ ...patch, trang: '' })
  const setPage = (p: number) => setUrl({ trang: p > 1 ? String(p) : '' })
  const clearFilters = () => {
    setSearchText('')
    setUrl({ q: '', loai: '', hang: '', trang: '' })
  }

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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </label>
        {/* Backend chỉ lọc khớp đúng cả chuỗi nên dùng danh sách chọn */}
        <label className="w-full sm:w-52">
          <span className="sr-only">Loại sản phẩm</span>
          <Select
            name="productType"
            active={filter.productType !== ''}
            value={filter.productType}
            onChange={(e) => updateFilter({ loai: e.target.value })}
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
          <Select
            name="brand"
            active={filter.brand !== ''}
            value={filter.brand}
            onChange={(e) => updateFilter({ hang: e.target.value })}
          >
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
          <Select
            name="sort"
            value={filter.sort}
            onChange={(e) => updateFilter({ sapxep: e.target.value === DEFAULT_SORT ? '' : e.target.value })}
          >
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

      <section
        ref={listRef}
        tabIndex={-1}
        aria-label="Danh sách sản phẩm"
        aria-live="polite"
        aria-busy={query.isFetching}
      >
        {query.isError ? (
          <ErrorState
            message={errorMessage(query.error, 'Không tải được danh sách sản phẩm.')}
            onRetry={() => query.refetch()}
          />
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
            action={
              isFiltering ? (
                <Button variant="ghost" icon="filter_alt_off" onClick={clearFilters}>
                  Xoá bộ lọc
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className={cx(query.isFetching && 'opacity-70')}>
            <ProductsTable
              products={products}
              detailPath={(id) => withId(ROUTES.ADMIN.PRODUCT, id)}
              // Trang chi tiết quay về đúng địa chỉ này (bộ lọc + trang) sau khi ngừng bán / xoá.
              linkState={{ backTo: `${location.pathname}${location.search}` }}
              pending={pendingStatus}
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
            {hidden.map((h) => {
              // Nhãn theo đúng việc đang chờ: vừa ngừng bán (đang gọi API) thì chưa mở bán lại được.
              const busy = pendingStatus.get(h.id)
              return (
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
                    disabled={busy !== undefined}
                    onClick={() =>
                      void reopen(h).then((ok) => {
                        // Dòng vừa mở bán biến khỏi mục này: đưa focus về danh sách thay vì rơi về đầu trang.
                        if (ok) requestAnimationFrame(() => listRef.current?.focus())
                      })
                    }
                  >
                    {busy === 'hide' ? 'Đang ngừng bán…' : busy === 'reopen' ? 'Đang mở bán…' : 'Mở bán lại'}
                  </Button>
                </li>
              )
            })}
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
        busy={Boolean(hiding?.id && pendingStatus.has(hiding.id))}
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
