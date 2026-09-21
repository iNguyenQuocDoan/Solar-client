import { Icon } from '@/components/stitch-ui/Icon'
import { cn } from '@/lib/cn'

/*
 * Ô tăng/giảm số đo hiện trường (site_survey_task – "Verified Usable Area").
 * md: hai nút 44px hai đầu, giá trị headline-md ở giữa.
 * sm: bản gọn nằm trong một bước của installation_task ("Mounted Panels: - 18 +"), nút 28px.
 */
export type StepperInputProps = {
  value: number
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
  /** Số chữ số thập phân khi hiển thị (78.5 => 1) */
  precision?: number
  unit?: string
  /** aria-label cho vùng giá trị */
  label: string
  /** md = ô đo hiện trường (mặc định); sm = bộ đếm gọn trong một bước công việc */
  size?: 'sm' | 'md'
  className?: string
}

const stepButtonBase =
  'flex shrink-0 items-center justify-center rounded-lg font-bold text-on-surface transition-colors disabled:pointer-events-none disabled:opacity-40'

const stepButtonSizes = {
  sm: 'h-7 w-7 rounded bg-surface-container hover:bg-surface-container-highest',
  md: 'h-11 w-11 bg-surface-container-lowest hover:bg-surface-container-highest',
} as const

export function StepperInput({
  value,
  onChange,
  step = 1,
  min,
  max,
  precision = 1,
  unit,
  label,
  size = 'md',
  className,
}: StepperInputProps) {
  const clamp = (next: number) => {
    const rounded = Number(next.toFixed(precision))
    if (min !== undefined && rounded < min) return min
    if (max !== undefined && rounded > max) return max
    return rounded
  }

  const isSmall = size === 'sm'
  const stepButton = cn(stepButtonBase, stepButtonSizes[size])
  const iconSize = isSmall ? 'text-[16px]' : 'text-[20px]'

  return (
    <div
      className={cn(
        'flex items-center',
        isSmall ? 'gap-space-xs' : 'rounded-xl bg-surface-container-low p-1',
        className,
      )}
    >
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={min !== undefined && value <= min}
        onClick={() => onChange(clamp(value - step))}
        className={stepButton}
      >
        <Icon name="remove" className={iconSize} />
      </button>
      <div
        role="status"
        aria-label={label}
        className={cn(
          'text-center font-bold',
          isSmall ? 'px-2 text-headline-md text-primary' : 'flex-1 text-headline-md text-on-surface',
        )}
      >
        {value.toFixed(precision)}
        {unit && <span className="text-body-md font-normal text-on-surface-variant"> {unit}</span>}
      </div>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(clamp(value + step))}
        className={stepButton}
      >
        <Icon name="add" className={iconSize} />
      </button>
    </div>
  )
}
