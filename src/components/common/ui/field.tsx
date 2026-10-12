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

/*
  Ô chọn ngày luôn hiện kiểu Việt Nam (13/10/2026). Ô date gốc hiện theo ngôn ngữ của trình duyệt (bản tiếng Anh ra
  10/13/2026, lệch với tiêu đề "Thứ Ba, 13/10/2026" ngay cạnh – người dùng báo 12/10/2026). Ô gốc vẫn nằm trên cùng, trong
  suốt và phủ cả ô: bấm vào đâu cũng mở lịch của trình duyệt (showPicker, kèm nút lịch kéo phủ cả ô cho Chrome / Edge), Tab và
  gõ phím như cũ, trình đọc màn hình đọc ô gốc. Chữ hiện là lớp bên dưới, nhận viền focus / rê chuột qua `peer`.
*/
export function DateField({
  id,
  value,
  onChange,
  label,
  min,
  max,
  className,
  size = 'md',
}: {
  /** Gắn với nhãn của `Field` (htmlFor); không có nhãn hiện thì truyền `label` để đọc cho trình đọc màn hình. */
  id?: string
  /** YYYY-MM-DD */
  value: string
  onChange: (value: string) => void
  label?: string
  min?: string
  max?: string
  className?: string
  size?: ControlSize
}) {
  const [y, m, d] = value.split('-')
  return (
    <span className={cx('relative block', width(className), className)}>
      <input
        id={id}
        type="date"
        aria-label={label}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker()
          } catch {
            /* Trình duyệt chưa có showPicker hoặc lịch đang mở: để ô gốc tự xử lý. */
          }
        }}
        className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:size-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
      />
      <span
        aria-hidden
        className={cx(
          shape,
          'flex items-center justify-between gap-2 border-line-2 bg-canvas px-3 text-fg peer-hover:border-fg-3 peer-focus-visible:border-accent peer-focus-visible:outline-1 peer-focus-visible:outline-accent',
          heights[size],
        )}
      >
        <span className="tnum">{value ? `${d}/${m}/${y}` : 'Chọn ngày'}</span>
        <Icon name="calendar_month" className="text-[20px] text-fg-3" />
      </span>
    </span>
  )
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

const minutesOf = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5))
const timeOf = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

/*
  Ô chọn giờ kiểu 24 giờ (13:00), mỗi `step` phút từ `from` tới `to`. Ô time gốc hiện theo ngôn ngữ trình duyệt (bản tiếng
  Anh ra "01:00 PM", lệch với "13:00–17:00" in ngay cạnh – 12/10/2026). Giá trị đang có mà lệch lưới (vd. 08:10 lưu từ nơi
  khác) vẫn được thêm vào danh sách để không bị đổi ngầm. `emptyLabel`: thêm lựa chọn rỗng (vd. "Theo mặc định").
*/
export function TimeSelect({
  value,
  onChange,
  from = '00:00',
  to = '23:30',
  step = 30,
  emptyLabel,
  ...rest
}: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange' | 'size'> & {
  /** HH:mm (HH:mm:ss cũng đọc được) */
  value: string
  onChange: (value: string) => void
  from?: string
  to?: string
  step?: number
  emptyLabel?: string
  size?: ControlSize
  active?: boolean
}) {
  const current = value.slice(0, 5)
  const times: string[] = []
  for (let m = minutesOf(from); m <= minutesOf(to); m += step) times.push(timeOf(m))
  if (current && !times.includes(current)) times.push(current)
  times.sort()
  return (
    <Select value={current} onChange={(e) => onChange(e.target.value)} {...rest}>
      {emptyLabel !== undefined && <option value="">{emptyLabel}</option>}
      {times.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </Select>
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
