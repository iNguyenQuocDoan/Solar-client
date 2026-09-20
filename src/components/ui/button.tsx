import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { cx } from '@/lib/cx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

const base =
  'press inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium select-none disabled:opacity-40'

/* One solid button per view; everything else is quiet. */
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover',
  secondary: 'border border-line-2 text-fg hover:border-fg',
  ghost: 'text-fg-2 underline-offset-4 hover:text-fg hover:underline',
  danger: 'border border-danger/40 text-danger hover:border-danger',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[14px]',
  md: 'h-10 px-4 text-[15px]',
}

/* Ghost buttons carry no horizontal padding so they align with text. */
const ghostSizes: Record<Size, string> = {
  sm: 'h-8 px-0 text-[14px]',
  md: 'h-10 px-0 text-[15px]',
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
