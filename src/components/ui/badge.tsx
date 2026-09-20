import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

export type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info' | 'accent'

/* Status is written, not boxed: a short phrase in a meaningful colour. */
const tones: Record<Tone, string> = {
  neutral: 'text-fg-2',
  ok: 'text-ok',
  warn: 'text-warn',
  danger: 'text-danger',
  info: 'text-info',
  accent: 'text-accent-fg',
}

export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return <span className={cx('inline-flex items-center text-[13px] leading-5 font-medium whitespace-nowrap', tones[tone], className)}>{children}</span>
}
