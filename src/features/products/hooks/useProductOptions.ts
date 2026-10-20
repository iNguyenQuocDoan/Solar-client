import { useMemo } from 'react'
import { SOLAR_PANEL_TYPE } from '@/features/products/components/productDisplay'
import { useProductsQuery } from '@/features/products/hooks/useProducts'

/** Lấy toàn bộ danh mục (100 là PageSize tối đa) để có danh sách loại, hãng, nhóm hàng */
const ALL_PRODUCTS = { PageSize: 100, SortBy: 'name', SortDirection: 'asc' } as const

const unique = (values: (string | null | undefined)[]) =>
  [...new Set(values.map((v) => v?.trim()).filter((v): v is string => Boolean(v)))].sort((a, b) =>
    a.localeCompare(b, 'vi'),
  )

// Gợi ý cho bộ lọc và form sản phẩm, lấy từ dữ liệu thật. Luôn có SOLAR_PANEL
// `enabled`: trang chi tiết chỉ gọi khi mở dialog Sửa
export function useProductOptions({ enabled = true }: { enabled?: boolean } = {}) {
  const all = useProductsQuery(ALL_PRODUCTS, { enabled })
  return useMemo(() => {
    const items = all.data?.items ?? []
    return {
      productTypes: unique([SOLAR_PANEL_TYPE, ...items.map((p) => p.productType)]),
      brands: unique(items.map((p) => p.brand)),
      categories: unique(items.map((p) => p.category)),
    }
  }, [all.data])
}
