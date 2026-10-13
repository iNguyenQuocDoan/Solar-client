import { Link } from 'react-router'
import { Badge } from '@/components/common/ui/badge'
import { Table, Td, Th, Tr } from '@/components/common/ui/table'
import { ProductActions } from '@/features/products/components/ProductActions'
import { formatPower, panelSpecGaps, productStatusMeta, productTypeLabel } from '@/features/products/components/productDisplay'
import type { PendingStatus } from '@/features/products/hooks/useProductStatusActions'
import type { ProductResponse } from '@/types/res/adminProductsRes'
import { formatMoney } from '@/utils/format'

/*
  Danh sách sản phẩm của /admin/products. Người dùng 12/10/2026: "phải là 1 list khi ấn vào thì mới hiển thị chi tiết" –
  mỗi dòng chỉ giữ thứ để nhận ra và so nhanh (ảnh, tên, SKU, loại, hãng, công suất, giá, trạng thái); model, kích thước,
  nhóm hàng, thông số nằm ở trang chi tiết /admin/products/:id. Rồi "tại sao lại không để cái nút này ở ngoài luôn cho
  tiện": Sửa / Ngừng bán / Xoá có cả trên từng dòng (ProductActions compact) lẫn ở trang chi tiết.
  Cả dòng bấm được như danh mục của các portal khác (link tên phủ cả dòng bằng ::after, rê chuột thì tên xanh + gạch chân),
  trừ cụm nút nằm trên lớp phủ; bàn phím Tab tới đúng link tên rồi tới từng nút. Tấm pin thiếu công suất / kích thước báo đỏ
  ngay trên dòng: mô phỏng bố trí không dùng được tấm đó cho tới khi sửa.
  Bảy cột nên xếp khối dưới xl (1280px): ở 1024px, rail 208px chỉ còn ~770px, chia cột thì tên bị bóp còn vài chữ mỗi dòng.
  Khi xếp khối bỏ hai ô Loại / Hãng (hãng hiện dưới tên) để mỗi sản phẩm vẫn gọn như một dòng danh sách.
*/
export function ProductsTable({
  products,
  detailPath,
  linkState,
  pending,
  onEdit,
  onHide,
  onDelete,
}: {
  products: ProductResponse[]
  detailPath: (id: string) => string
  /** Gửi kèm link tới trang chi tiết (vd. địa chỉ danh sách để quay về đúng bộ lọc). */
  linkState?: unknown
  /** sản phẩm đang chờ đổi trạng thái (id → việc đang làm), để khoá thao tác của đúng những dòng đó */
  pending?: ReadonlyMap<string, PendingStatus>
  onEdit: (product: ProductResponse) => void
  onHide: (product: ProductResponse) => void
  onDelete: (product: ProductResponse) => void
}) {
  return (
    <Table stack="xl">
      <thead>
        <tr>
          <Th>Sản phẩm</Th>
          <Th className="hidden md:table-cell">Loại</Th>
          <Th className="hidden md:table-cell">Hãng</Th>
          <Th className="text-right">Công suất</Th>
          <Th className="text-right">Đơn giá</Th>
          <Th>Trạng thái</Th>
          <Th>
            <span className="sr-only">Thao tác</span>
          </Th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => {
          const status = productStatusMeta(p.status)
          const gaps = panelSpecGaps(p)
          return (
            <Tr key={p.id ?? p.sku} className="group relative cursor-pointer [&>td]:align-middle">
              <Td label="Sản phẩm">
                <div className="flex items-center gap-3">
                  <div className="size-12 shrink-0 overflow-hidden rounded-control bg-surface-2">
                    {p.imageUrl && (
                      <img
                        // key theo link: sửa link ảnh thì ảnh mới được tải lại dù link cũ từng lỗi.
                        key={p.imageUrl}
                        src={p.imageUrl}
                        alt=""
                        loading="lazy"
                        // Link ảnh hỏng: ẩn ảnh, giữ ô xám làm chỗ trống thay cho biểu tượng ảnh vỡ.
                        onError={(e) => {
                          e.currentTarget.hidden = true
                        }}
                        className="size-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link
                      to={detailPath(p.id ?? '')}
                      state={linkState}
                      className="font-medium text-fg underline-offset-4 after:absolute after:inset-0 group-hover:text-accent-fg group-hover:underline"
                    >
                      {p.name || 'Sản phẩm chưa đặt tên'}
                    </Link>
                    <p className="tnum text-meta text-fg-3">{p.sku}</p>
                    {/* Dưới xl bảng xếp khối và bỏ hai ô Loại / Hãng cho gọn danh sách: hãng hiện dưới tên. */}
                    {p.brand && <p className="text-meta text-fg-3 xl:hidden">{p.brand}</p>}
                  </div>
                </div>
              </Td>
              <Td label="Loại" className="max-xl:hidden!">
                {productTypeLabel(p.productType) ?? '—'}
              </Td>
              <Td label="Hãng" className="max-xl:hidden!">
                {p.brand || '—'}
              </Td>
              <Td label="Công suất" className="tnum text-right whitespace-nowrap">
                {/* Một cụm: ở dạng xếp khối (dưới lg) mỗi phần tử con của ô là một dòng lưới riêng. */}
                <span className="inline-flex flex-col items-end gap-1">
                  {gaps.power ? <Badge tone="danger">Thiếu công suất</Badge> : (formatPower(p.ratedPowerW) ?? '—')}
                  {gaps.size && <Badge tone="danger">Thiếu kích thước</Badge>}
                </span>
              </Td>
              <Td label="Đơn giá" className="tnum text-right whitespace-nowrap">
                <span>
                  {formatMoney(p.unitPrice, p.currency)}
                  {p.unit && <span className="text-fg-3"> / {p.unit}</span>}
                </span>
              </Td>
              <Td label="Trạng thái" className="whitespace-nowrap">
                <Badge tone={status.tone}>{status.label}</Badge>
              </Td>
              {/* Không nhãn: khi xếp khối ô trải hết bề ngang nên ba nút nằm một hàng (360px: ~270px cho cụm nút). */}
              <Td className="whitespace-nowrap">
                <ProductActions
                  compact
                  product={p}
                  busy={Boolean(p.id && pending?.has(p.id))}
                  className="xl:justify-end"
                  onEdit={() => onEdit(p)}
                  onHide={() => onHide(p)}
                  onDelete={() => onDelete(p)}
                />
              </Td>
            </Tr>
          )
        })}
      </tbody>
    </Table>
  )
}
