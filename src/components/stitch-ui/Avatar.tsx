import { Icon } from '@/components/stitch-ui/Icon'
import { cn } from '@/lib/cn'

export type AvatarTone = 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral'

const toneClasses: Record<AvatarTone, string> = {
  primary: 'bg-primary text-on-primary',
  secondary: 'bg-secondary text-on-secondary',
  tertiary: 'bg-tertiary-container text-on-primary',
  error: 'bg-error-container text-on-error-container',
  neutral: 'bg-surface-container-highest text-on-surface',
}

const sizeClasses = {
  sm: 'h-6 w-6 text-label-sm font-semibold',
  md: 'h-10 w-10 text-headline-md font-bold',
  lg: 'h-12 w-12 text-headline-md font-bold',
} as const

export type AvatarProps = {
  src?: string
  alt?: string
  /** Chữ cái viết tắt khi không có ảnh */
  initials?: string
  /** Icon thay chữ cái (ví dụ person_off cho tài khoản bị khóa) */
  icon?: string
  tone?: AvatarTone
  size?: keyof typeof sizeClasses
  className?: string
}

/* Avatar tròn theo cột "User / Identity" trong user_management: ảnh, chữ cái hoặc icon. */
export function Avatar({ src, alt = '', initials, icon, tone = 'primary', size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm',
        toneClasses[tone],
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : icon ? (
        <Icon name={icon} className={size === 'sm' ? 'text-[14px]' : 'text-[20px]'} />
      ) : (
        initials
      )}
    </div>
  )
}
