import { useId } from 'react'
import { Icon } from '@/components/common/stitch-ui/Icon'
import { cx } from '@/utils/cx'

export type SegmentedOption<T extends string> = { value: T; label: string; icon?: string }

const sizes = {
  /* Hẹp (rail): chữ nhỏ, đệm ít để ba lựa chọn vừa 150px. */
  sm: 'h-11 px-1.5 text-meta lg:h-7',
  md: 'h-11 px-3 text-body lg:h-8',
} as const

/*
  Chọn một trong vài lựa chọn ngang hàng (giao diện, góc nhìn mô phỏng): mọi lựa chọn hiện sẵn, lựa chọn đang dùng nằm
  trên nền "đang chọn" (accent-soft, chữ accent-fg đậm) – cùng màu với tab và trang đang chọn – thay vì một nút đặc
  tranh chỗ với nút chính của trang. Radio thật (ẩn) nên Tab vào nhóm rồi dùng phím mũi tên như mọi nhóm radio.
  Mỗi lựa chọn rộng theo chữ (flex-auto), không chia đều, để nhãn dài không bị bẻ dòng.
*/
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'md',
  className,
}: {
  label: string
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  size?: keyof typeof sizes
  className?: string
}) {
  const name = useId()
  return (
    <div role="radiogroup" aria-label={label} className={cx('flex gap-0.5 rounded-control border border-line-2 bg-canvas p-0.5', className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cx(
            // Bán kính đồng tâm: khung bo 6px, viền 1px + đệm 2px, nên ô bên trong bo 3px để hai đường cong song song.
            'press flex flex-auto cursor-pointer items-center justify-center gap-1.5 rounded-[calc(var(--radius-control)-3px)] whitespace-nowrap text-fg-2',
            'has-checked:bg-accent-soft has-checked:font-semibold has-checked:text-accent-fg',
            'has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-ring',
            '[&:not(:has(:checked)):hover]:bg-hover [&:not(:has(:checked)):hover]:text-fg',
            sizes[size],
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          {option.icon && <Icon name={option.icon} className="text-[20px]" />}
          {option.label}
        </label>
      ))}
    </div>
  )
}
