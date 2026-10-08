import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Icon } from '@/components/common/stitch-ui/Icon'
import { cx } from '@/utils/cx'

/* `required`: dấu * màu đỏ sau nhãn (chỉ để nhìn; ô nhập tự đặt aria-required). */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  required,
  children,
  className,
}: {
  label: ReactNode
  hint?: string
  error?: string
  htmlFor?: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <label htmlFor={htmlFor} className="text-body font-medium text-fg">
        {label}
        {required && (
          <span aria-hidden className="text-danger">
            {' *'}
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p className="text-meta text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-meta text-fg-3">{hint}</p>
      ) : null}
    </div>
  )
}

type ControlSize = 'sm' | 'md'

/*
  Trạng thái ô nhập: rê chuột viền đậm lên; focus là MỘT vòng liền 2px màu thương hiệu (viền 1px + outline 1px sát viền,
  thay cho vòng focus chung cách 2px trông thành hai vòng); lỗi viền đỏ, vòng focus cũng đỏ; tắt thì nền xám.
  Nền trắng (canvas) để ô nhập luôn trông là chỗ điền được, kể cả trên nền xám.
*/
/* Màu chữ, viền, nền KHÔNG nằm trong `shape`: cx không gộp class, hai màu chữ cùng lúc thì lớp nào thắng tuỳ thứ tự CSS. */
const shape = 'rounded-control border text-body placeholder:text-fg-3 disabled:border-line disabled:bg-surface-2 disabled:text-fg-3'
const states =
  'not-disabled:hover:border-fg-3 focus:border-accent focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-accent aria-invalid:border-danger aria-invalid:outline-danger not-disabled:aria-invalid:hover:border-danger'
const control = cx(shape, states, 'border-line-2 bg-canvas text-fg')
/* Bộ lọc đang áp dụng (giá trị khác mặc định): nền + viền + chữ màu thương hiệu để thấy ngay đang lọc theo gì. */
const controlActive = cx(shape, states, 'border-accent-line bg-accent-soft font-medium text-accent-fg')

/* Same heights as Button: 44px touch target below the desktop breakpoint. sm is for dense rows (pagination, rail). */
const heights: Record<ControlSize, string> = {
  sm: 'h-11 lg:h-8',
  md: 'h-11 lg:h-10',
}

/* Controls fill their container unless the caller sets a width. */
const width = (className?: string) => (className && /(^|\s)w-/.test(className) ? undefined : 'w-full')

export function Input({ className, size = 'md', ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & { size?: ControlSize }) {
  return <input className={cx(control, width(className), heights[size], 'px-3', className)} {...rest} />
}

/* Ô tìm kiếm: icon kính lúp ở đầu ô để nhận ra ngay là ô tìm, không chỉ dựa vào chữ gợi ý. */
export function SearchInput({ className, size = 'md', ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & { size?: ControlSize }) {
  return (
    <span className={cx('relative block', width(className), className)}>
      <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-fg-3" />
      <input type="search" className={cx(control, 'w-full pr-3 pl-10', heights[size])} {...rest} />
    </span>
  )
}

export function Textarea({ className, rows = 4, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={cx(control, width(className), 'px-3 py-2', className)} {...rest} />
}

/** `active`: ô lọc đang có giá trị khác "Tất cả…", tô màu để thấy bộ lọc đang áp dụng. */
export function Select({
  className,
  size = 'md',
  active,
  children,
  ...rest
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & { size?: ControlSize; active?: boolean }) {
  return (
    <select className={cx(active ? controlActive : control, width(className), heights[size], 'cursor-pointer px-3 pr-8', className)} {...rest}>
      {children}
    </select>
  )
}

type ChoiceProps = InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; description?: ReactNode }

export function Checkbox({ label, description, className, ...rest }: ChoiceProps) {
  return (
    <label className={cx('flex cursor-pointer items-start gap-3 text-body', className)}>
      <input type="checkbox" className="mt-1 size-4 shrink-0 accent-accent" {...rest} />
      <span>
        <span className="text-fg">{label}</span>
        {description && <span className="block text-meta text-fg-3">{description}</span>}
      </span>
    </label>
  )
}

export function Radio({ label, description, className, ...rest }: ChoiceProps) {
  return (
    <label className={cx('flex cursor-pointer items-start gap-3 text-body', className)}>
      <input type="radio" className="mt-1 size-4 shrink-0 accent-accent" {...rest} />
      <span>
        <span className="text-fg">{label}</span>
        {description && <span className="block text-meta text-fg-3">{description}</span>}
      </span>
    </label>
  )
}
