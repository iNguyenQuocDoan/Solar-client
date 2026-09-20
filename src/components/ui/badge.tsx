import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

export type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info' | 'accent'

/* Status is written, not boxed: a short phrase in a meaningful colour. It may wrap; it never squeezes its neighbours. */
const tones: Record<Tone, string> = {
  neutral: 'text-fg-2',
  ok: 'text-ok',
  warn: 'text-warn',
  danger: 'text-danger',
  info: 'text-info',
  accent: 'text-accent-fg',
}

export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return <span className={cx('inline-block text-meta font-medium', tones[tone], className)}>{children}</span>
}
