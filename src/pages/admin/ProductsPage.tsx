import { useMemo, useState } from 'react'
import { ProductDetailPanel } from '@/components/admin/ProductDetailPanel'
import { ProductFilterBar, type ProductFilterValue } from '@/components/admin/ProductFilterBar'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { Button, IconButton, MetricCard, PageHeader, StatusBadge } from '@/components/ui'
import {
  inventoryPanel,
  productCategoryOptions,
  productOemOptions,
  productSearchPlaceholder,
  productStatusOptions,
  products as initialProducts,
  productsKpis,
  productsPageHeader,
  type ProductRecord,
} from '@/lib/mock/products'

/* Dựng từ product_catalogue/code.html + screen.png. Lọc client-side trên mock. */

const defaultFilter: ProductFilterValue = { search: '', category: 'all', oem: 'all', status: 'active' }

export function ProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>(initialProducts)
  const [filter, setFilter] = useState<ProductFilterValue>(defaultFilter)
  const [selectedId, setSelectedId] = useState<string | null>(initialProducts[0]?.id ?? null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const query = filter.search.trim().toLowerCase()
    const oemLabel = (oem: string) => productOemOptions.find((o) => o.value === oem)?.label ?? ''
    return products.filter(
      (product) =>
        (filter.category === 'all' || product.category === filter.category) &&
        (filter.oem === 'all' || product.oem === filter.oem) &&
        product.status === filter.status &&
        (query === '' ||
          [product.name, product.sku, product.specPrimary, product.specSecondary, oemLabel(product.oem)].some((text) =>
            text.toLowerCase().includes(query),
          )),
    )
  }, [products, filter])

  const isFiltering =
    filter.search.trim() !== '' || filter.category !== 'all' || filter.oem !== 'all' || filter.status !== 'active'
  const pageSize = inventoryPanel.pageSize
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)
  const total = isFiltering ? filtered.length : inventoryPanel.total
  const selected = products.find((product) => product.id === selectedId) ?? null

  const updateFilter = (next: ProductFilterValue) => {
    setFilter(next)
    setPage(1)
  }

  return (
    <>
      <div className="mb-space-lg flex flex-col gap-space-md">
        <PageHeader
          bottomSpacing="none"
          breadcrumb={productsPageHeader.breadcrumb}
          title={productsPageHeader.title}
          description={productsPageHeader.description}
          actions={
            <>
              <Button variant="tonal" size="md" iconLeft="currency_exchange">
                {productsPageHeader.actions.batch}
              </Button>
              <Button size="md" iconLeft="add_circle">
                {productsPageHeader.actions.add}
              </Button>
            </>
          }
        />
        <section className="mt-space-xs grid grid-cols-2 gap-space-md md:grid-cols-4">
          {productsKpis.map((kpi) => (
            <MetricCard key={kpi.label} layout="compact" {...kpi} />
          ))}
        </section>
      </div>

      <ProductFilterBar
        value={filter}
        onChange={updateFilter}
        onClear={() => updateFilter(defaultFilter)}
        options={{ categories: productCategoryOptions, oems: productOemOptions, statuses: productStatusOptions }}
        placeholder={productSearchPlaceholder}
      />

      <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <ProductsTable
          className="lg:col-span-7"
          products={pageRows}
          selectedId={selectedId}
          onSelect={(product) => setSelectedId(product.id)}
          toolbar={
            <>
              <div className="flex items-center gap-space-xs">
                <span className="text-headline-md text-on-surface">{inventoryPanel.title}</span>
                <StatusBadge variant="neutral" size="sm" dot={false} className="bg-surface-container px-2">
                  {inventoryPanel.showingLabel(pageRows.length)}
                </StatusBadge>
              </div>
              <div className="flex items-center gap-space-xs text-on-surface-variant">
                <IconButton icon="file_download" label="Export CSV" className="bg-transparent hover:bg-surface-container-high" />
                <IconButton icon="view_column" label="Column layout" className="bg-transparent hover:bg-surface-container-high" />
              </div>
            </>
          }
          pagination={{
            page,
            pageSize,
            total,
            visibleCount: pageRows.length,
            onPageChange: setPage,
            itemLabel: 'entries',
          }}
        />

        {selected && (
          <ProductDetailPanel
            key={selected.id}
            className="lg:col-span-5"
            product={selected}
            categories={productCategoryOptions}
            onSave={(updated) => setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))}
            onArchive={(product) =>
              setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, status: 'discontinued' } : p)))
            }
          />
        )}
      </div>
    </>
  )
}
