import type { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/*
 * Card có hàng đầu "icon vuông + tiêu đề + phụ đề + slot phải".
 * Lặp lại ở site_survey_task (Homeowner Submission / Technician Verified Audit),
 * site_survey_verification và survey_image_documentation.
 * installation_task / maintenance_task / warranty_request dùng biến thể `plain`:
 * icon primary 24px không có ô nền, tiêu đề in đậm.
 */
export type SectionCardProps = {
  /** Bỏ trống khi dùng `step` */
  icon?: string
  /** Số thứ tự bước thay cho icon: ô 32px nền primary-container (site_survey_verification) */
  step?: number
  /**
   * neutral = nền surface-container-highest; primary = nền primary-container (khối của kỹ thuật viên);
   * plain = icon trần màu primary 24px (các màn installation / maintenance / warranty)
   */
  iconTone?: 'neutral' | 'primary' | 'plain'
  title: string
  subtitle?: string
  /** Badge / dòng trạng thái ở mép phải hàng tiêu đề */
  trailing?: ReactNode
  /** Khoảng cách giữa các khối con: md cho aside, lg cho form dài */
  gap?: 'md' | 'lg'
  children: ReactNode
  className?: string
}

const iconToneClasses = {
  neutral: 'bg-surface-container-highest text-on-surface',
  primary: 'bg-primary-container text-on-primary',
  plain: 'text-primary',
} as const

export function SectionCard({
  icon,
  step,
  iconTone = 'neutral',
  title,
  subtitle,
  trailing,
  gap = 'md',
  children,
  className,
}: SectionCardProps) {
  const isPlain = iconTone === 'plain'

  return (
    <Card
      padding="lg"
      className={cn('flex flex-col', gap === 'md' ? 'gap-space-md' : 'gap-space-lg', className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-xs">
        {/* flex-1 để khối tiêu đề co lại nhường chỗ cho `trailing` thay vì đẩy nó xuống dòng */}
        <div className="flex min-w-0 flex-1 items-center gap-space-xs">
          {step === undefined ? (
            <div
              className={cn(
                'flex shrink-0 items-center justify-center',
                isPlain ? 'h-6 w-6' : 'h-7 w-7 rounded-lg',
                iconToneClasses[iconTone],
              )}
            >
              {icon && <Icon name={icon} className={isPlain ? 'text-[24px]' : 'text-[18px]'} />}
            </div>
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-container text-label-lg font-bold text-on-primary">
              {step}
            </div>
          )}
          <div className="min-w-0">
            <h2 className={cn('text-headline-md leading-tight text-on-surface', isPlain && 'font-bold')}>
              {title}
            </h2>
            {subtitle && <span className="text-label-sm text-on-surface-variant">{subtitle}</span>}
          </div>
        </div>
        {trailing}
      </div>
      {children}
    </Card>
  )
}
