import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { Link, type LinkProps } from 'react-router'
import { Icon } from '@/components/common/stitch-ui/Icon'
import { WithTooltip } from '@/components/common/ui/tooltip'
import { cx } from '@/utils/cx'

/*
  Thứ bậc nút (08/10/2026), mỗi biến thể một vai trò:
    primary       hành động chính của trang – nút đặc màu thương hiệu, mỗi màn một nút
    soft          hành động chính của từng dòng / khối (Nhận yêu cầu, Mở yêu cầu, Mở bán lại): nền xanh nhạt + viền
                  xanh mảnh, có màu nhưng không tranh với nút đặc. Viền là thứ tách nó khỏi nhãn trạng thái "Đang bán"
                  (nhãn không bao giờ có viền).
    secondary     hành động phụ: nền trắng có viền, luôn trông là nút chứ không phải chữ
    ghost         hành động kín đáo (Huỷ, Lưu nháp, Xoá bộ lọc): chữ, rê chuột hiện nền
    danger        phá huỷ nhưng hoàn tác được (Ngừng bán trong hộp thoại xác nhận): viền + chữ đỏ, rê chuột nền đỏ nhạt
    danger-quiet  nút phá huỷ lặp lại trên từng dòng (Xoá): xám khi nghỉ, đỏ khi rê chuột / focus, để cả cột không thành
                  một dải đỏ; luôn mở hộp thoại xác nhận
    danger-solid  xác nhận thao tác không hoàn tác (Xoá): nút đặc đỏ, chỉ đặt trong hộp thoại xác nhận
  Mọi nút bo cùng một bán kính (--radius-control, 6px).
  Icon trên nút chỉ khi nó nói thêm điều chữ chưa nói hoặc giúp nhận ra nhanh: tạo (+), sửa, xoá, gọi, email, bản đồ,
  lưu nháp, xoá bộ lọc, hiện mật khẩu, thử lại. Nút điều hướng bước (Tiếp tục, Quay lại), nút gửi form và nút hành động
  chính của dòng không gắn icon.
*/
type Variant = 'primary' | 'soft' | 'secondary' | 'ghost' | 'danger' | 'danger-quiet' | 'danger-solid'
type Size = 'sm' | 'md'

/* Disabled is a colour, not an opacity, so borders and fills stay crisp. */
const base =
  'press inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control text-body font-medium select-none disabled:text-fg-3'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent not-disabled:hover:bg-accent-hover disabled:bg-surface-3',
  soft: 'border border-accent-line/50 bg-accent-soft text-accent-fg not-disabled:hover:border-accent-line not-disabled:hover:bg-accent-muted disabled:border-line disabled:bg-surface-2',
  secondary: 'border border-line-2 bg-canvas text-fg not-disabled:hover:border-fg-3 not-disabled:hover:bg-surface-2 disabled:border-line',
  ghost: 'text-fg-2 not-disabled:hover:bg-hover not-disabled:hover:text-fg not-disabled:active:bg-pressed',
  danger: 'border border-danger/45 bg-canvas text-danger not-disabled:hover:border-danger not-disabled:hover:bg-danger-soft disabled:border-line',
  'danger-quiet': 'text-fg-2 not-disabled:hover:bg-danger-soft not-disabled:hover:text-danger focus-visible:text-danger',
  'danger-solid': 'bg-danger-fill text-on-danger not-disabled:hover:bg-danger-hover disabled:bg-surface-3',
}

/* Every button is a 44px touch target below the desktop breakpoint. */
const sizes: Record<Size, string> = {
  sm: 'h-11 px-3 lg:h-8',
  md: 'h-11 px-4 lg:h-10',
}

/* Ghost buttons keep their hit area but pull the padding back out so the label aligns with text. */
const ghostSizes: Record<Size, string> = {
  sm: 'h-11 -mx-3 px-3 lg:h-8',
  md: 'h-11 -mx-3 px-3 lg:h-10',
}

/* Nút chỉ có icon: vuông, cùng chiều cao với nút chữ cùng cỡ. */
const iconSizes: Record<Size, string> = {
  sm: 'size-11 lg:size-8',
  md: 'size-11 lg:size-10',
}

/** `bleed` (mặc định bật): nút ghost lấn lề để chữ thẳng mép nội dung; tắt khi nút nằm trong một cụm nút (cuối dòng bảng). */
export function buttonClass(variant: Variant = 'secondary', size: Size = 'md', className?: string, bleed = true) {
  return cx(base, variants[variant], variant === 'ghost' && bleed ? ghostSizes[size] : sizes[size], className)
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
  bleed?: boolean
  /** React 19: ref là prop thường, đi qua `...rest` xuống <button> (vd. trả focus về nút sau khi xoá một dòng). */
  ref?: Ref<HTMLButtonElement>
}

export function Button({ variant = 'secondary', size = 'md', icon, bleed, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className, bleed)} {...rest}>
      <ButtonIcon icon={icon} />
      {children}
    </button>
  )
}

type ButtonLinkProps = LinkProps & { variant?: Variant; size?: Size; icon?: ReactNode | string; bleed?: boolean }

export function ButtonLink({ variant = 'secondary', size = 'md', icon, bleed, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className, bleed)} {...rest}>
      <ButtonIcon icon={icon} />
      {children}
    </Link>
  )
}

/*
  Nút chỉ có icon (thao tác phụ lặp lại trên từng dòng, ví dụ Xoá). `label` là tên đọc cho trình đọc màn hình
  và hiện thành tooltip (WithTooltip) khi rê chuột hoặc focus bằng bàn phím, nên icon không bao giờ là tín hiệu duy nhất.
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
  /** Chữ ngắn trên tooltip khi `label` dài vì kèm tên đối tượng cho trình đọc màn hình (vd. "Xoá" thay cho "Xoá Tấm pin …"). */
  tooltip?: string
  variant?: Variant
  size?: Size
}) {
  return (
    <WithTooltip label={tooltip ?? label}>
      {(tip) => (
        <button type={type} aria-label={label} className={cx(base, variants[variant], iconSizes[size], className)} {...rest} {...tip}>
          <Icon name={icon} className="text-[20px]" />
        </button>
      )}
    </WithTooltip>
  )
}
