import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

export type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info' | 'accent'

/*
  Status is written, not boxed. Colour is reserved for what needs attention
  (warn, danger); a healthy or informational status reads as plain text so the
  page is not a scatter of green and blue words. It may wrap; it never squeezes its neighbours.
*/
const tones: Record<Tone, string> = {
  neutral: 'text-fg-2',
  ok: 'text-fg',
  warn: 'text-warn',
  danger: 'text-danger',
  info: 'text-fg',
  accent: 'text-fg',
}

export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return <span className={cx('inline-block text-meta font-medium', tones[tone], className)}>{children}</span>
}
