import type { StatusVariant } from '@/components/common/stitch-ui/StatusBadge'
import type { ProductSortBy, ProductSortDirection } from '@/features/products/services/productService'
import type { ProductResponse } from '@/types/res/adminProductsRes'

/*
 * Cách hiển thị một ProductResponse, dùng chung cho trang admin và trang sản phẩm công khai.
 *
 * Swagger khai `status` là string tự do. Danh sách dưới đây là các giá trị backend nhận
 * (backend trả "'Status' must be ACTIVE or INACTIVE." khi dò PATCH .../status ngày 29/09/2026);
 * so khớp không phân biệt hoa thường,
 * giá trị lạ thì in nguyên văn thay vì đoán nghĩa.
 */
export const PRODUCT_STATUSES = [
  { value: 'ACTIVE', label: 'Đang bán', variant: 'positive' },
  { value: 'INACTIVE', label: 'Ngừng bán', variant: 'neutral' },
] as const satisfies readonly { value: string; label: string; variant: StatusVariant }[]

export type ProductStatus = (typeof PRODUCT_STATUSES)[number]['value']

/*
 * Loại sản phẩm là chữ tự do; riêng tấm pin có mã SOLAR_PANEL mà backend kiểm tra thêm (dò validator
 * 05/10/2026, không phân biệt hoa thường): bắt buộc ratedPowerW, widthMm, heightMm. Mô phỏng 3D cũng
 * chỉ lấy sản phẩm loại này.
 */
export const SOLAR_PANEL_TYPE = 'SOLAR_PANEL'

export function isSolarPanelType(productType: string | null | undefined) {
  return productType?.trim().toUpperCase() === SOLAR_PANEL_TYPE
}

export function isProductActive(status: string | null | undefined) {
  return status?.trim().toUpperCase() === 'ACTIVE'
}

export function productStatusMeta(status: string | null | undefined): { label: string; variant: StatusVariant } {
  const found = PRODUCT_STATUSES.find((s) => s.value === status?.trim().toUpperCase())
  if (found) return found
  return { label: status?.trim() || 'Chưa đặt trạng thái', variant: 'neutral' }
}

/** Tuỳ chọn sắp xếp; value = "SortBy:SortDirection" theo giá trị backend chấp nhận. */
export const PRODUCT_SORT_OPTIONS: { value: `${ProductSortBy}:${ProductSortDirection}`; label: string }[] = [
  { value: 'createdAt:desc', label: 'Mới thêm gần đây' },
  { value: 'name:asc', label: 'Tên A–Z' },
  { value: 'unitPrice:asc', label: 'Giá thấp đến cao' },
  { value: 'unitPrice:desc', label: 'Giá cao đến thấp' },
  { value: 'ratedPowerW:desc', label: 'Công suất lớn nhất' },
  { value: 'brand:asc', label: 'Hãng A–Z' },
]

export function parseSort(value: string): { SortBy: ProductSortBy; SortDirection: ProductSortDirection } {
  const [by, dir] = value.split(':') as [ProductSortBy, ProductSortDirection]
  return { SortBy: by, SortDirection: dir }
}

/** Công suất định mức: 400 W, 5,5 kW. */
export function formatPower(watt: number | null | undefined) {
  if (watt == null) return null
  if (watt >= 1000) return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(watt / 1000)} kW`
  return `${new Intl.NumberFormat('vi-VN').format(watt)} W`
}

/** Kích thước rộng × cao (mm). */
export function formatSize(product: Pick<ProductResponse, 'widthMm' | 'heightMm'>) {
  if (product.widthMm == null || product.heightMm == null) return null
  const n = new Intl.NumberFormat('vi-VN')
  return `${n.format(product.widthMm)} × ${n.format(product.heightMm)} mm`
}

/** Bảo hành theo tháng; tròn năm thì đổi sang năm. */
export function formatWarranty(months: number | null | undefined) {
  if (months == null) return null
  return months % 12 === 0 ? `${months / 12} năm` : `${months} tháng`
}

/*
 * Swagger không khai kiểu của `spec` (schema rỗng). Chuỗi thì in thẳng; object thì trải
 * thành các cặp "khoá: giá trị"; dạng khác bỏ qua.
 */
export function specEntries(spec: unknown): { key: string; value: string }[] {
  if (spec == null) return []
  if (typeof spec === 'string') {
    const text = spec.trim()
    if (!text) return []
    try {
      return specEntries(JSON.parse(text) as unknown)
    } catch {
      return [{ key: '', value: text }]
    }
  }
  if (typeof spec === 'object' && !Array.isArray(spec)) {
    return Object.entries(spec as Record<string, unknown>)
      .filter(([, value]) => value != null && value !== '')
      .map(([key, value]) => ({ key, value: typeof value === 'object' ? JSON.stringify(value) : String(value) }))
  }
  return [{ key: '', value: String(spec) }]
}

/** `spec` về dạng chuỗi để đặt vào ô nhập của form admin. */
export function specToText(spec: unknown) {
  if (spec == null) return ''
  return typeof spec === 'string' ? spec : JSON.stringify(spec, null, 2)
}
