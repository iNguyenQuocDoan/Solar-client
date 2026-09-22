import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { AuthCard } from '@/components/auth/AuthCard'
import { Icon } from '@/components/stitch-ui/Icon'
import { ROUTES } from '@/constants/routes'
import { useResendVerificationMutation, useVerifyEmailMutation } from '@/features/auth/hooks'
import { errorMessage } from '@/lib/api/errors'
import { verifyContent } from '@/lib/mock/auth'

/** Che bớt email: "khachhang@gmail.com" → "k***@gmail.com" (theo thiết kế). */
function maskEmail(email: string) {
  const [local, domain] = email.split('@')
  if (!domain || !local) return email
  return `${local.slice(0, 1)}***@${domain}`
}

/*
 * /verify-email
 *
 * - Có ?token= (link trong email) → tự gọi POST /api/auth/verify-email.
 *   VerifyEmailRequest trong swagger CHỈ có `token`, không có email.
 * - Không có token → màn "kiểm tra hộp thư", nút gửi lại gọi resend-verification
 *   (ResendVerificationRequest = { email }) kèm đếm ngược 60 giây.
 */
export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const emailParam = searchParams.get('email')

  const verifyMutation = useVerifyEmailMutation()
  const resendMutation = useResendVerificationMutation()

  const [verifyState, setVerifyState] = useState<'idle' | 'pending' | 'success' | 'error'>(
    token ? 'pending' : 'idle',
  )
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const verifiedRef = useRef(false)

  // Tự xác thực khi mở link trong email. Ref chặn gọi 2 lần ở StrictMode.
  useEffect(() => {
    if (!token || verifiedRef.current) return
    verifiedRef.current = true

    void (async () => {
      try {
        const result = await verifyMutation.mutateAsync({ token })
        if (result.emailVerified === false) {
          setVerifyState('error')
          setVerifyError(verifyContent.failedMessage)
          return
        }
        setVerifyState('success')
        toast.success(verifyContent.toastSuccess)
      } catch (error) {
        setVerifyState('error')
        setVerifyError(errorMessage(error, verifyContent.failedMessage))
      }
    })()
  }, [token, verifyMutation])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [secondsLeft])

  const resend = async () => {
    if (secondsLeft > 0 || resendMutation.isPending) return
    if (!emailParam) {
      toast.error(verifyContent.missingEmail)
      return
    }
    try {
      await resendMutation.mutateAsync({ email: emailParam })
      setSecondsLeft(verifyContent.resendSeconds)
      toast.success(verifyContent.toastSuccess)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  /* ----------------------------------------- mở từ link trong email: đang xác thực */
  if (verifyState === 'pending') {
    return (
      <AuthCard className="items-center text-center">
        <Icon name="progress_activity" className="mb-space-md animate-spin text-[42px] text-primary" />
        <h1 className="text-headline-xl text-on-surface">{verifyContent.verifyingTitle}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">{verifyContent.verifyingHint}</p>
      </AuthCard>
    )
  }

  if (verifyState === 'success') {
    return (
      <AuthCard className="items-center text-center">
        <div className="mb-space-md flex h-20 w-20 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
          <Icon name="task_alt" className="text-[42px]" />
        </div>
        <h1 className="mb-1 text-headline-xl text-on-surface">{verifyContent.successTitle}</h1>
        <p className="mb-space-lg max-w-md text-body-lg text-on-surface-variant">{verifyContent.successHint}</p>
        <Link
          to={ROUTES.LOGIN}
          className="flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-primary text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary-container"
        >
          <Icon name="login" className="text-[18px]" />
          {verifyContent.goToLogin}
        </Link>
      </AuthCard>
    )
  }

  if (verifyState === 'error') {
    return (
      <AuthCard className="items-center text-center">
        <div className="mb-space-md flex h-20 w-20 items-center justify-center rounded-full bg-error-container text-error">
          <Icon name="link_off" className="text-[42px]" />
        </div>
        <h1 className="mb-1 text-headline-xl text-on-surface">{verifyContent.failedTitle}</h1>
        <p className="mb-space-lg max-w-md text-body-md text-on-surface-variant">{verifyError}</p>
        <div className="flex w-full max-w-md flex-col items-center gap-space-sm sm:flex-row">
          <button
            type="button"
            onClick={() => void resend()}
            disabled={secondsLeft > 0 || resendMutation.isPending}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
          >
            <Icon
              name={resendMutation.isPending ? 'progress_activity' : 'forward_to_inbox'}
              className={resendMutation.isPending ? 'animate-spin text-[18px]' : 'text-[18px]'}
            />
            <span>
              {secondsLeft > 0
                ? verifyContent.resendCountdown.replace('%s', String(secondsLeft))
                : verifyContent.resend}
            </span>
          </button>
          <Link
            to={ROUTES.LOGIN}
            className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-surface-container px-6 text-label-lg text-on-surface transition-all hover:bg-surface-container-high sm:w-auto"
          >
            <Icon name="arrow_back" className="text-[18px]" />
            {verifyContent.backToLogin}
          </Link>
        </div>
      </AuthCard>
    )
  }

  /* ------------------------------------------------- không có token: kiểm tra hộp thư */
  const displayEmail = emailParam ? maskEmail(emailParam) : verifyContent.unknownEmail

  return (
    <AuthCard className="items-center text-center">
      <div className="relative mb-space-md flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-high text-primary shadow-sm">
        <Icon name="mark_email_unread" className="text-[42px]" />
        <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary-container text-label-sm font-bold text-on-secondary-container">
          1
        </span>
      </div>

      <h1 className="mb-1 text-headline-xl text-on-surface">{verifyContent.title}</h1>
      <p className="mb-space-md max-w-md text-body-lg text-on-surface-variant">{verifyContent.description}</p>

      <div className="mb-space-lg inline-flex items-center gap-2 rounded-xl bg-surface-container px-4 py-2 text-headline-md text-primary">
        <Icon name="alternate_email" className="text-[20px]" />
        <span className="font-bold">{displayEmail}</span>
      </div>

      <p className="mb-space-lg max-w-sm text-body-sm text-on-surface-variant">{verifyContent.hint}</p>

      <div className="flex w-full max-w-md flex-col items-center gap-space-sm sm:flex-row">
        <button
          type="button"
          onClick={() => void resend()}
          disabled={secondsLeft > 0 || resendMutation.isPending || !emailParam}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
        >
          <Icon
            name={resendMutation.isPending ? 'progress_activity' : 'forward_to_inbox'}
            className={resendMutation.isPending ? 'animate-spin text-[18px]' : 'text-[18px]'}
          />
          <span>
            {secondsLeft > 0
              ? verifyContent.resendCountdown.replace('%s', String(secondsLeft))
              : verifyContent.resend}
          </span>
        </button>
        <Link
          to={ROUTES.LOGIN}
          className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-surface-container px-6 text-label-lg text-on-surface transition-all hover:bg-surface-container-high sm:w-auto"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          {verifyContent.backToLogin}
        </Link>
      </div>

      {!emailParam && (
        <p className="mt-space-sm max-w-md text-body-sm text-error">{verifyContent.missingEmail}</p>
      )}

      <div className="mt-space-xl w-full max-w-md border-t border-surface-container pt-space-md text-center">
        <span className="text-body-sm text-on-surface-variant">
          {verifyContent.wrongEmail}
          <Link to={ROUTES.REGISTER} className="font-bold text-primary hover:underline">
            {verifyContent.registerAgain}
          </Link>
        </span>
      </div>
    </AuthCard>
  )
}
