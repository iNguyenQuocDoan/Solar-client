import { Badge } from '@/components/common/ui/badge'
import { Table, Td, Th, Tr } from '@/components/common/ui/table'
import { formatPower, formatSize, isProductActive, panelSpecGaps, productStatusMeta, productTypeLabel } from '@/features/products/components/productDisplay'
import type { ProductResponse } from '@/types/res/adminProductsRes'
import { cx } from '@/utils/cx'
import { formatMoney } from '@/utils/format'

/*
  Bảng sản phẩm của /admin/products (bộ portal kit, cùng kiểu với danh mục của khách hàng và sales).
  Dưới lg mỗi dòng xếp thành khối nhãn/giá trị nên không phải cuộn ngang.
  Tấm pin thiếu công suất hoặc kích thước được tô cảnh báo ngay trong ô: mô phỏng bố trí không dùng được tấm đó.
*/

export type ProductsTableProps = {
  products: ProductResponse[]
  onEdit: (product: ProductResponse) => void
  onToggleStatus: (product: ProductResponse) => void
  onDelete: (product: ProductResponse) => void
  /** id các sản phẩm đang chờ đổi trạng thái, để khoá thao tác của đúng những dòng đó */
  busyIds?: ReadonlySet<string>
}

/* Thao tác trong dòng là chữ, không phải nút đặc: một trang chỉ có một nút đặc (Thêm sản phẩm). */
const action =
  'press inline-flex h-11 items-center rounded-control px-2 text-body font-medium underline-offset-4 not-disabled:hover:underline disabled:text-fg-3 lg:h-8'

export function ProductsTable({ products, onEdit, onToggleStatus, onDelete, busyIds }: ProductsTableProps) {
  return (
    <Table stack>
      <thead>
        <tr>
          <Th>Sản phẩm</Th>
          <Th className="hidden md:table-cell">Loại / nhóm</Th>
          <Th className="hidden lg:table-cell">Hãng / model</Th>
          <Th className="text-right">Công suất</Th>
          <Th className="hidden text-right lg:table-cell">Kích thước</Th>
          <Th className="text-right">Đơn giá</Th>
          <Th>Trạng thái</Th>
          <Th className="text-right">
            <span className="sr-only">Thao tác</span>
          </Th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => {
          const status = productStatusMeta(p.status)
          const gaps = panelSpecGaps(p)
          const active = isProductActive(p.status)
          const busy = Boolean(p.id && busyIds?.has(p.id))
          return (
            <Tr key={p.id ?? p.sku}>
              <Td label="Sản phẩm">
                <div className="flex items-center gap-3">
                  <div className="size-10 shrink-0 overflow-hidden rounded-control bg-surface-2">
                    {p.imageUrl && <img src={p.imageUrl} alt="" loading="lazy" className="size-full object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-fg">{p.name || '—'}</p>
                    <p className="tnum text-meta text-fg-3">{p.sku}</p>
                  </div>
                </div>
              </Td>
              <Td label="Loại / nhóm" className="hidden md:table-cell">
                {productTypeLabel(p.productType) ?? '—'}
                {/* Mã loại vẫn hiện cho admin: bộ lọc, form và backend dùng đúng mã này. */}
                <p className="text-meta text-fg-3">
                  {[productTypeLabel(p.productType) !== p.productType ? p.productType : null, p.category].filter(Boolean).join(', ')}
                </p>
              </Td>
              <Td label="Hãng / model" className="hidden lg:table-cell">
                {p.brand || '—'}
                {p.model && <p className="text-meta text-fg-3">{p.model}</p>}
              </Td>
              <Td label="Công suất" className="tnum text-right whitespace-nowrap">
                {gaps.power ? <Badge tone="warn">Thiếu công suất</Badge> : (formatPower(p.ratedPowerW) ?? '—')}
              </Td>
              <Td label="Kích thước" className="tnum hidden text-right whitespace-nowrap lg:table-cell">
                {gaps.size ? <Badge tone="warn">Thiếu kích thước</Badge> : (formatSize(p) ?? '—')}
              </Td>
              <Td label="Đơn giá" className="tnum text-right whitespace-nowrap">
                {formatMoney(p.unitPrice, p.currency)}
                {p.unit && <span className="text-fg-3"> / {p.unit}</span>}
              </Td>
              <Td label="Trạng thái" className="whitespace-nowrap">
                <Badge tone={status.tone}>{status.label}</Badge>
              </Td>
              <Td label="Thao tác" className="text-right whitespace-nowrap">
                {/* Không dùng lề âm: ô cuối sát mép bảng, lấn ra là bảng sinh thanh cuộn ngang. */}
                <div className="inline-flex gap-1">
                  <button type="button" className={cx(action, 'text-accent-fg')} aria-label={`Sửa ${p.name ?? ''}`} onClick={() => onEdit(p)}>
                    Sửa
                  </button>
                  <button
                    type="button"
                    className={cx(action, 'text-fg-2 not-disabled:hover:text-fg')}
                    aria-label={`${active ? 'Ngừng bán' : 'Mở bán lại'} ${p.name ?? ''}`}
                    disabled={busy}
                    onClick={() => onToggleStatus(p)}
                  >
                    {busy ? 'Đang đổi…' : active ? 'Ngừng bán' : 'Mở bán lại'}
                  </button>
                  <button
                    type="button"
                    className={cx(action, 'text-danger')}
                    aria-label={`Xoá ${p.name ?? ''}`}
                    disabled={busy}
                    onClick={() => onDelete(p)}
                  >
                    Xoá
                  </button>
                </div>
              </Td>
            </Tr>
          )
        })}
      </tbody>
    </Table>
  )
}
