import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Container chuẩn của landing_home: max-w-[1280px] + margin theo breakpoint. */
export const LANDING_CONTAINER =
  'w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop'

export type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  /** center = tiêu đề giữa (Lợi ích, Gói giải pháp, Hành trình, FAQ) */
  align?: 'start' | 'center'
  className?: string
}

/** Cụm eyebrow + h2 + mô tả lặp lại ở hầu hết section của trang chủ. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'start',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-space-2xs',
        align === 'center' && 'mx-auto max-w-2xl text-center',
        className,
      )}
    >
      <span className="text-label-lg text-primary-container">{eyebrow}</span>
      <h2 className="text-headline-xl-mobile text-primary md:text-headline-xl">{title}</h2>
      {description && <p className="text-body-md text-on-surface-variant">{description}</p>}
    </div>
  )
}

export type LandingSectionProps = {
  id: string
  /** Nền section: surface (mặc định), lowest, low */
  tone?: 'surface' | 'lowest' | 'low'
  /** py-space-2xl (48px) hoặc py-space-3xl (64px) như code.html */
  spacing?: '2xl' | '3xl'
  className?: string
  children: ReactNode
}

const toneClasses = {
  surface: '',
  lowest: 'bg-surface-container-lowest',
  low: 'bg-surface-container-low',
} as const

export function LandingSection({
  id,
  tone = 'surface',
  spacing = '3xl',
  className,
  children,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'w-full scroll-mt-20',
        spacing === '3xl' ? 'py-space-3xl' : 'py-space-2xl',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </section>
  )
}
