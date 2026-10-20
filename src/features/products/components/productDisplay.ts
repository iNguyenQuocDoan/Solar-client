import type { Tone } from '@/components/common/ui/badge'
import type {
  ProductListParams,
  ProductSortBy,
  ProductSortDirection,
} from '@/features/products/services/productService'
import type { ProductResponse } from '@/types/res/adminProductsRes'

// Hiển thị ProductResponse, dùng chung cho trang admin và trang công khai
// `status` chỉ có ACTIVE / INACTIVE, giá trị lạ thì in nguyên văn
export const PRODUCT_STATUSES = [
  { value: 'ACTIVE', label: 'Đang bán', tone: 'ok' },
  { value: 'INACTIVE', label: 'Ngừng bán', tone: 'neutral' },
] as const satisfies readonly { value: string; label: string; tone: Tone }[]

export type ProductStatus = (typeof PRODUCT_STATUSES)[number]['value']

// Loại sản phẩm là chữ tự do, riêng SOLAR_PANEL bị backend kiểm tra thêm công suất và kích thước
export const SOLAR_PANEL_TYPE = 'SOLAR_PANEL'

/** Dùng chung một cache cho mô phỏng và admin */
export const SOLAR_PANEL_QUERY = {
  ProductType: SOLAR_PANEL_TYPE,
  PageSize: 100,
  SortBy: 'ratedPowerW',
  SortDirection: 'desc',
} as const satisfies ProductListParams

export function isSolarPanelType(productType: string | null | undefined) {
  return productType?.trim().toUpperCase() === SOLAR_PANEL_TYPE
}

/** SOLAR_PANEL hiện là "Tấm pin", loại khác giữ nguyên */
export function productTypeLabel(productType: string | null | undefined) {
  if (!productType?.trim()) return null
  return isSolarPanelType(productType) ? 'Tấm pin' : productType
}

export function isProductActive(status: string | null | undefined) {
  return status?.trim().toUpperCase() === 'ACTIVE'
}

export function productStatusMeta(status: string | null | undefined): { label: string; tone: Tone } {
  const found = PRODUCT_STATUSES.find((s) => s.value === status?.trim().toUpperCase())
  if (found) return found
  return { label: status?.trim() || 'Chưa đặt trạng thái', tone: 'warn' }
}

/** Thông số tấm pin còn thiếu. Dữ liệu cũ có thể thiếu nên cần báo ở admin */
export function panelSpecGaps(product: Pick<ProductResponse, 'productType' | 'ratedPowerW' | 'widthMm' | 'heightMm'>) {
  if (!isSolarPanelType(product.productType)) return { power: false, size: false }
  return {
    power: !(Number(product.ratedPowerW) > 0),
    size: !(Number(product.widthMm) > 0) || !(Number(product.heightMm) > 0),
  }
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

/** Kích thước rộng x cao (mm). */
export function formatSize(product: Pick<ProductResponse, 'widthMm' | 'heightMm'>) {
  if (product.widthMm == null || product.heightMm == null) return null
  const n = new Intl.NumberFormat('vi-VN')
  return `${n.format(product.widthMm)} × ${n.format(product.heightMm)} mm`
}

/** Bảo hành theo tháng; tròn năm thì đổi sang năm. */
export function formatWarranty(months: number | null | undefined) {
  if (months == null) return null
  if (months === 0) return 'Không bảo hành'
  return months % 12 === 0 ? `${months / 12} năm` : `${months} tháng`
}

// `spec` không có kiểu: chuỗi thì in thẳng, object thì trải thành các cặp khoá: giá trị
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
