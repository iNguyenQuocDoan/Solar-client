import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Link, type LinkProps } from 'react-router'
import { Icon } from '@/components/common/stitch-ui/Icon'
import { WithTooltip } from '@/components/common/ui/tooltip'
import { cx } from '@/utils/cx'

/*
  Thứ bậc nút. Người dùng 12/10/2026: "những nút chức năng bắt buộc phải là phím ấn kèm theo border" và "các nút chức năng
  lại không có màu làm khó thao tác", nên MỌI nút đều có viền (hoặc nền đặc) ngay khi nghỉ, không còn nút chỉ có chữ, và
  màu nói nút làm gì:
    primary       hành động chính của trang, nút đặc màu thương hiệu, mỗi màn một nút
    soft          hành động chính / tích cực của từng dòng, khối (Sửa, Nhận yêu cầu, Phân công, Đổi giờ, Mở bán lại): nền
                  xanh nhạt + viền xanh đậm đủ. Viền là thứ tách nó khỏi nhãn trạng thái "Đang bán" (nhãn không có viền).
    secondary     thao tác trung tính, điều hướng (Tài khoản, Xem bản đồ, Hôm nay): nền trắng, viền xám
    ghost         thao tác phụ (Huỷ trong hộp thoại, Lưu nháp, Xoá bộ lọc): viền xám, nền trong suốt, chữ xám đậm
    warn          tạm dừng nhưng hoàn tác được (Ngừng bán, Tạm khoá): viền + chữ vàng, rê chuột nền vàng nhạt
    danger        xoá, huỷ (Xoá, Bỏ, Huỷ lịch, Vô hiệu hoá): viền + chữ đỏ, rê chuột nền đỏ nhạt. Xoá dữ liệu đã lưu thì mở
                  hộp thoại xác nhận; bỏ một dòng trong form chưa lưu (khoảng giờ làm, thông số, vật cản) thì bỏ ngay, vì
                  bấm Huỷ / không lưu là lấy lại được
    danger-solid  xác nhận thao tác không hoàn tác (Xoá): nút đặc đỏ, chỉ đặt trong hộp thoại xác nhận
  Viền đo >= 3:1 với nền trang ở cả hai chế độ (xanh 3,3:1; vàng, đỏ 75% >= 3,3:1; xám 3,5:1), chữ >= 4,5:1 cả khi rê chuột.
  Mọi nút bo cùng một bán kính (--radius-control, 6px).
  Icon trên nút chỉ khi nó nói thêm điều chữ chưa nói hoặc giúp nhận ra nhanh: tạo (+), sửa, xoá, gọi, email, bản đồ,
  lưu nháp, xoá bộ lọc, hiện mật khẩu, thử lại. Nút điều hướng bước (Tiếp tục, Quay lại), nút gửi form và nút hành động
  chính của dòng không gắn icon.
*/
type Variant = 'primary' | 'soft' | 'secondary' | 'ghost' | 'warn' | 'danger' | 'danger-solid'
type Size = 'sm' | 'md'

/* Disabled is a colour, not an opacity, so borders and fills stay crisp. */
const base =
  'press inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control text-body font-medium select-none disabled:text-fg-3'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent not-disabled:hover:bg-accent-hover disabled:bg-surface-3',
  soft: 'border border-accent-line bg-accent-soft text-accent-fg not-disabled:hover:bg-accent-muted disabled:border-line disabled:bg-surface-2',
  secondary:
    'border border-line-2 bg-canvas text-fg not-disabled:hover:border-fg-3 not-disabled:hover:bg-surface-2 disabled:border-line',
  ghost:
    'border border-line-2 text-fg-2 not-disabled:hover:border-fg-3 not-disabled:hover:bg-hover not-disabled:hover:text-fg not-disabled:active:bg-pressed disabled:border-line',
  warn: 'border border-warn/75 bg-canvas text-warn not-disabled:hover:border-warn not-disabled:hover:bg-warn-soft disabled:border-line',
  danger:
    'border border-danger/75 bg-canvas text-danger not-disabled:hover:border-danger not-disabled:hover:bg-danger-soft disabled:border-line',
  'danger-solid': 'bg-danger-fill text-on-danger not-disabled:hover:bg-danger-hover disabled:bg-surface-3',
}

/* Every button is a 44px touch target below the desktop breakpoint. */
const sizes: Record<Size, string> = {
  sm: 'h-11 px-3 lg:h-8',
  md: 'h-11 px-4 lg:h-10',
}

/* Nút chỉ có icon: vuông, cùng chiều cao với nút chữ cùng cỡ. */
const iconSizes: Record<Size, string> = {
  sm: 'size-11 lg:size-8',
  md: 'size-11 lg:size-10',
}

export function buttonClass(variant: Variant = 'secondary', size: Size = 'md', className?: string) {
  return cx(base, variants[variant], sizes[size], className)
}

/* Icon trước nhãn: tên Material Symbols (chuỗi) hoặc node tự dựng. Icon theo màu chữ của nút. */
function ButtonIcon({ icon }: { icon?: ReactNode | string }) {
  if (!icon) return null
  return typeof icon === 'string' ? <Icon name={icon} className="-ml-0.5 text-[20px]" /> : <>{icon}</>
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  icon?: ReactNode | string
  /** React 19: ref là prop thường, đi qua `...rest` xuống <button> (vd. trả focus về nút sau khi xoá một dòng). */
  ref?: Ref<HTMLButtonElement>
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      <ButtonIcon icon={icon} />
      {children}
    </button>
  )
}

type ButtonLinkProps = LinkProps & { variant?: Variant; size?: Size; icon?: ReactNode | string }

export function ButtonLink({
  variant = 'secondary',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      <ButtonIcon icon={icon} />
      {children}
    </Link>
  )
}

/*
  Nút chỉ có icon (thao tác lặp lại trên từng dòng, ví dụ Nhân bản, Xoá). Có viền như mọi nút. `label` là tên đọc cho
  trình đọc màn hình và hiện thành tooltip (WithTooltip) khi rê chuột hoặc focus bằng bàn phím, nên icon không bao giờ
  là tín hiệu duy nhất.
*/
export function IconButton({
  icon,
  label,
  tooltip,
  variant = 'ghost',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  icon: string
  label: string
  /** Chữ ngắn trên tooltip khi `label` dài vì kèm tên đối tượng cho trình đọc màn hình (vd. "Xoá" thay cho "Xoá Tấm pin ..."). */
  tooltip?: string
  variant?: Variant
  size?: Size
}) {
  return (
    <WithTooltip label={tooltip ?? label}>
      {(tip) => (
        <button
          type={type}
          aria-label={label}
          className={cx(base, variants[variant], iconSizes[size], className)}
          {...rest}
          {...tip}
        >
          <Icon name={icon} className="text-[20px]" />
        </button>
      )}
    </WithTooltip>
  )
}
