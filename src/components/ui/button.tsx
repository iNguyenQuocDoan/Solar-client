import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cx } from '@/lib/cx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

/* Disabled is a colour, not an opacity, so borders and fills stay crisp. */
const base =
  'press inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-control text-body font-medium select-none disabled:text-fg-3'

/* One solid button per view; everything else is quiet. */
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent not-disabled:hover:bg-accent-hover disabled:bg-surface-3',
  secondary: 'border border-line-2 text-fg not-disabled:hover:border-fg disabled:border-line',
  ghost: 'text-fg-2 underline-offset-4 not-disabled:hover:text-fg not-disabled:hover:underline',
  danger: 'border border-danger/40 text-danger not-disabled:hover:border-danger disabled:border-line',
}

/* Every button is a 44px touch target below the desktop breakpoint. */
const sizes: Record<Size, string> = {
  sm: 'h-11 px-3 lg:h-8',
  md: 'h-11 px-4 lg:h-10',
}

/* Ghost buttons keep their hit area but pull the padding back out so the label aligns with text. */
const ghostSizes: Record<Size, string> = {
  sm: 'h-11 -mx-3 px-3 lg:h-8',
  md: 'h-11 -mx-3 px-3 lg:h-10',
}

export function buttonClass(variant: Variant = 'secondary', size: Size = 'md', className?: string) {
  return cx(base, variants[variant], variant === 'ghost' ? ghostSizes[size] : sizes[size], className)
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  icon?: ReactNode
}

export function Button({ variant = 'secondary', size = 'md', icon, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      {children}
    </button>
  )
}

type ButtonLinkProps = LinkProps & { variant?: Variant; size?: Size; icon?: ReactNode }

export function ButtonLink({ variant = 'secondary', size = 'md', icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      {children}
    </Link>
  )
}
