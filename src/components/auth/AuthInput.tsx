import { useState, type ComponentProps, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

export type AuthInputProps = Omit<ComponentProps<'input'>, 'size'> & {
  /** Icon Material Symbols ở mép trái trong ô */
  leadingIcon?: string
  /** Nội dung ở mép phải (icon check, nút hiện/ẩn mật khẩu) */
  trailing?: ReactNode
  /** h-12 (login, forgot) hoặc h-11 (register, reset) như code.html */
  size?: 'md' | 'lg'
}

/** Ô nhập của auth_portal: nền surface-container-low, sáng lên và viền primary khi focus. */
export function AuthInput({ leadingIcon, trailing, size = 'lg', className, ...rest }: AuthInputProps) {
  return (
    <div className="relative flex items-center">
      {leadingIcon && (
        <Icon
          name={leadingIcon}
          className="pointer-events-none absolute left-3.5 text-[20px] text-on-surface-variant"
        />
      )}
      <input
        className={cn(
          'w-full rounded-xl bg-surface-container-low text-body-md text-on-surface transition-all placeholder:text-outline',
          'focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary',
          size === 'lg' ? 'h-12' : 'h-11',
          leadingIcon ? 'pl-11' : 'pl-3.5',
          trailing ? 'pr-11' : 'pr-4',
          className,
        )}
        {...rest}
      />
      {trailing && <span className="absolute right-3.5 flex items-center">{trailing}</span>}
    </div>
  )
}

export type PasswordInputProps = Omit<AuthInputProps, 'type' | 'trailing'>

/** AuthInput kèm nút hiện/ẩn mật khẩu (visibility / visibility_off). */
export function PasswordInput({ leadingIcon, ...rest }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  return (
    <AuthInput
      {...rest}
      leadingIcon={leadingIcon}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          onClick={() => setVisible((value) => !value)}
          className="p-1 text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <Icon name={visible ? 'visibility' : 'visibility_off'} className="text-[20px]" />
        </button>
      }
    />
  )
}
