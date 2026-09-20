import { cx } from '@/lib/cx'

export type Step = { label: string; meta?: string; state: 'done' | 'active' | 'upcoming' }

/*
  Progress rail: each stage is a segment of a line. Done segments are ink,
  the current one is the accent, upcoming ones are faint. No circles, no numbers.
*/
export function Stepper({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cx('grid gap-3 md:grid-flow-col md:auto-cols-fr md:gap-4', className)}>
      {steps.map((step) => (
        <li
          key={step.label}
          aria-current={step.state === 'active' ? 'step' : undefined}
          className={cx(
            'border-l-2 pl-3 md:border-l-0 md:border-t-2 md:pt-3 md:pl-0',
            step.state === 'done' && 'border-fg',
            step.state === 'active' && 'border-accent',
            step.state === 'upcoming' && 'border-line',
          )}
        >
          <p className={cx('text-body', step.state === 'upcoming' ? 'text-fg-3' : 'text-fg', step.state === 'active' && 'font-semibold')}>
            {step.label}
          </p>
          {step.meta && <p className="mt-1 text-meta text-fg-3">{step.meta}</p>}
        </li>
      ))}
    </ol>
  )
}
