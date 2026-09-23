import { useNavigate } from 'react-router'
import { Dialog, DialogTitle } from '@/components/stitch-ui/Dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Icon } from '@/components/stitch-ui/Icon'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/lib/auth/AuthProvider'
import { sessionExpiredContent } from '@/lib/mock/auth'

/*
 * Modal "Phiên đăng nhập đã hết hạn" – bật khi phiên hết hạn sau 30 phút không thao tác
 * hoặc khi gọi expireSession(). Dùng Dialog (Radix) nhưng bỏ nút X mặc định vì thiết kế
 * chỉ có 2 nút hành động.
 */
export function SessionExpiredModal() {
  const navigate = useNavigate()
  const { sessionExpired, dismissSessionExpired } = useAuth()

  const goToLogin = () => {
    dismissSessionExpired()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  const goHome = () => {
    dismissSessionExpired()
    navigate(ROUTES.HOME, { replace: true })
  }

  return (
    <Dialog open={sessionExpired} onOpenChange={(open) => !open && dismissSessionExpired()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-60 bg-inverse-surface/60 backdrop-blur-sm data-[state=open]:animate-[dialog-fade-in_150ms_ease-out]" />
        <DialogPrimitive.Content aria-describedby={undefined} className="fixed left-1/2 top-1/2 z-70 flex w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-xl bg-surface-container-lowest p-space-xl text-center shadow-xl focus:outline-none data-[state=open]:animate-[dialog-pop-in_180ms_ease-out]">
          <div className="mb-space-md flex h-16 w-16 items-center justify-center rounded-full bg-error-container text-error">
            <Icon name="timer_off" className="text-[36px]" />
          </div>
          <DialogTitle className="mb-space-lg text-headline-xl text-on-surface">
            {sessionExpiredContent.title}
          </DialogTitle>

          <div className="flex w-full flex-col gap-space-xs">
            <button
              type="button"
              onClick={goToLogin}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary-container"
            >
              <Icon name="login" className="text-[20px]" />
              {sessionExpiredContent.primary}
            </button>
            <button
              type="button"
              onClick={goHome}
              className="h-11 w-full rounded-xl bg-surface-container text-label-md text-on-surface transition-all hover:bg-surface-container-high"
            >
              {sessionExpiredContent.secondary}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
