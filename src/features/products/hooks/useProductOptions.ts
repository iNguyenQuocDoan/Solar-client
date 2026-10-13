import { useMemo } from 'react'
import { SOLAR_PANEL_TYPE } from '@/features/products/components/productDisplay'
import { useProductsQuery } from '@/features/products/hooks/useProducts'

/** Toàn bộ danh mục (100 là PageSize tối đa backend nhận) để lấy các loại, hãng, nhóm hàng đang có. */
const ALL_PRODUCTS = { PageSize: 100, SortBy: 'name', SortDirection: 'asc' } as const

const unique = (values: (string | null | undefined)[]) =>
  [...new Set(values.map((v) => v?.trim()).filter((v): v is string => Boolean(v)))].sort((a, b) => a.localeCompare(b, 'vi'))

/*
  Bộ lọc của danh sách và gợi ý của form thêm / sửa sản phẩm, lấy từ dữ liệu thật (backend chỉ lọc khớp đúng cả chuỗi).
  Luôn kèm SOLAR_PANEL vì backend kiểm tra riêng mã này. Danh sách và trang chi tiết dùng chung một cache. `enabled`: trang
  chi tiết chỉ cần gợi ý khi mở hộp thoại Sửa, nên chỉ gọi lúc đó (mỗi lần mở chi tiết khỏi kéo 100 sản phẩm).
*/
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
