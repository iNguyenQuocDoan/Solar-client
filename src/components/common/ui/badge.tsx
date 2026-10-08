import type { ReactNode } from 'react'
import { cx } from '@/utils/cx'

export type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info' | 'accent'

/*
  Colour carries meaning, never decoration (CLAUDE.md, rules 4–5).
  - warn / danger: something needs attention, so it sits on a tinted field and is found at a glance in a long list.
  - ok / info / accent: a coloured dot before plain text; progress is visible without shouting.
  - neutral: muted text with a grey dot (finished, cancelled, not on sale).
  The colour is never the only signal: the words say the same thing.
*/
const fills: Record<'warn' | 'danger', string> = {
  warn: 'bg-warn-soft text-warn',
  danger: 'bg-danger-soft text-danger',
}

const dots: Record<Exclude<Tone, 'warn' | 'danger'>, string> = {
  neutral: 'bg-fg-3',
  ok: 'bg-ok',
  info: 'bg-info',
  accent: 'bg-accent',
}

export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  if (tone === 'warn' || tone === 'danger') {
    return (
      <span className={cx('inline-flex items-center rounded-control px-2 text-meta font-medium', fills[tone], className)}>
        {children}
      </span>
    )
  }
  return (
    <span className={cx('inline-flex items-center gap-2 text-meta font-medium', tone === 'neutral' ? 'text-fg-2' : 'text-fg', className)}>
      <span aria-hidden className={cx('size-2 shrink-0 rounded-full', dots[tone])} />
      {children}
    </span>
  )
}

/*
  A count beside a menu item or tab. `attention`: work waiting for the person looking at it
  (requests to claim, requests still to schedule), filled with the accent so it is the first
  thing the eye lands on; otherwise a quiet total for reference.
*/
export function Count({ value, attention, className }: { value: number; attention?: boolean; className?: string }) {
  return (
    <span
      className={cx(
        'tnum inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-control px-1 text-meta font-semibold',
        attention ? 'bg-accent text-on-accent' : 'bg-surface-2 text-fg-2',
        className,
      )}
    >
      {value}
    </span>
  )
}
