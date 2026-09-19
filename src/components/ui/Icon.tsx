import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type IconProps = Omit<ComponentProps<'span'>, 'children'> & {
  /** Tên icon Material Symbols Outlined, ví dụ `grid_view`, `solar_power` */
  name: string
}

/** Kích thước đặt bằng utility `text-[20px]`, màu bằng `text-*`. */
export function Icon({ name, className, ...rest }: IconProps) {
  return (
    <span aria-hidden="true" className={cn('material-symbols', className)} {...rest}>
      {name}
    </span>
  )
}
