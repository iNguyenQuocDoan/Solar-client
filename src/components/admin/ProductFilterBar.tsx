import { IconButton } from '@/components/stitch-ui/Button'
import { Card } from '@/components/stitch-ui/Card'
import { SearchInput, Select, type SelectOption } from '@/components/stitch-ui/FilterBar'
import { cn } from '@/lib/cn'

/* Thanh lọc trong product_catalogue: search + 3 select + nút xóa lọc. State do trang giữ. */
export type ProductFilterValue = {
  search: string
  category: string
  oem: string
  status: string
}

export type ProductFilterBarProps = {
  value: ProductFilterValue
  onChange: (next: ProductFilterValue) => void
  onClear: () => void
  options: { categories: SelectOption[]; oems: SelectOption[]; statuses: SelectOption[] }
  placeholder: string
  className?: string
}

export function ProductFilterBar({ value, onChange, onClear, options, placeholder, className }: ProductFilterBarProps) {
  const update = (patch: Partial<ProductFilterValue>) => onChange({ ...value, ...patch })
  return (
    <Card padding="md" className={cn('mb-space-md', className)}>
      <div className="flex flex-col items-stretch justify-between gap-space-sm lg:flex-row lg:items-center">
        <SearchInput
          size="md"
          placeholder={placeholder}
          value={value.search}
          onChange={(e) => update({ search: e.target.value })}
          className="flex-1"
        />
        <div className="flex flex-wrap items-center gap-space-xs sm:flex-nowrap">
          <Select
            size="md"
            aria-label="Nhóm hàng"
            options={options.categories}
            value={value.category}
            onChange={(e) => update({ category: e.target.value })}
            className="min-w-[170px]"
          />
          <Select
            size="md"
            aria-label="Hãng sản xuất"
            options={options.oems}
            value={value.oem}
            onChange={(e) => update({ oem: e.target.value })}
            className="min-w-[190px]"
          />
          <Select
            size="md"
            aria-label="Trạng thái"
            options={options.statuses}
            value={value.status}
            onChange={(e) => update({ status: e.target.value })}
            className="min-w-[140px]"
          />
          <IconButton
            icon="filter_alt_off"
            label="Xoá bộ lọc"
            size="md"
            onClick={onClear}
            className="h-11 w-11 hover:bg-surface-container hover:text-on-surface-variant"
          />
        </div>
      </div>
    </Card>
  )
}
