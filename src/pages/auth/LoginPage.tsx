import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { AuthCard, RequiredMark } from '@/components/auth/AuthCard'
import { AuthInput, PasswordInput } from '@/components/auth/AuthInput'
import { Icon } from '@/components/stitch-ui/Icon'
import { ROUTES } from '@/constants/routes'
import { demoAccounts } from '@/features/auth/demoAccounts'
import { errorMessage } from '@/lib/api/errors'
import { homePathForRole, useAuth } from '@/lib/auth/AuthProvider'
import { cn } from '@/lib/cn'
import { loginContent } from '@/lib/mock/auth'

const schema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  remember: z.boolean(),
})

type LoginValues = z.infer<typeof schema>

/** /login – view "Đăng nhập" của auth_portal, gọi POST /api/auth/login. */
export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, expireSession } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', remember: true },
    mode: 'onChange',
  })

  const emailValue = watch('email')
  const emailIsValid = !errors.email && z.email().safeParse(emailValue).success

  /** Dùng chung cho form và các nút "thử nhanh". */
  const doSignIn = async (email: string, password: string, remember: boolean) => {
    if (submitting) return
    setSubmitting(true)
    setFormError(null)
    try {
      const user = await signIn(email, password, remember)
      toast.success(loginContent.toastSuccess)
      // Quay lại trang đang muốn vào nếu bị RequireRole chặn, nếu không thì theo vai trò.
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? homePathForRole(user.role), { replace: true })
    } catch (error) {
      setFormError(errorMessage(error, loginContent.errorMessage))
    } finally {
      setSubmitting(false)
    }
  }

  const onSubmit = handleSubmit((values) => doSignIn(values.email, values.password, values.remember))

  return (
    <AuthCard>
      <h1 className="mb-space-lg text-headline-xl text-on-surface">{loginContent.title}</h1>

      {formError && (
        <div
          role="alert"
          className="mb-space-md flex items-start gap-3 rounded-lg bg-error-container p-space-sm text-on-error-container"
        >
          <Icon name="error" className="mt-0.5 shrink-0 text-[22px] text-error" />
          <div className="flex-1">
            <div className="text-label-lg font-bold">{loginContent.errorTitle}</div>
            <div className="text-body-sm">{formError}</div>
            {/*
              Backend chưa có bảng mã lỗi cố định nên không tự nhận ra được trường hợp
              "email chưa xác thực"; để người dùng tự sang màn xác thực khi cần.
            */}
            <Link
              to={`${ROUTES.VERIFY_EMAIL}${emailValue ? `?email=${encodeURIComponent(emailValue)}` : ''}`}
              className="mt-1 inline-block text-label-sm font-semibold underline"
            >
              {loginContent.notVerifiedLink}
            </Link>
          </div>
          <button
            type="button"
            aria-label="Đóng thông báo lỗi"
            onClick={() => setFormError(null)}
            className="p-1 text-on-error-container/70 transition-colors hover:text-on-error-container"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
      )}

      <form className="flex flex-col gap-space-md" onSubmit={onSubmit} noValidate>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="flex items-center justify-between text-label-lg text-on-surface">
            <span>
              {loginContent.emailLabel} <RequiredMark />
            </span>
            {emailIsValid && (
              <span className="flex items-center gap-1 text-label-sm text-primary">
                <Icon name="check_circle" className="text-[14px]" /> {loginContent.emailValid}
              </span>
            )}
          </label>
          <AuthInput
            id="login-email"
            type="email"
            autoComplete="email"
            leadingIcon="mail"
            placeholder={loginContent.emailPlaceholder}
            trailing={emailIsValid ? <Icon name="check_circle" className="text-[20px] text-primary" /> : undefined}
            {...register('email')}
          />
          {errors.email && <span className="text-body-sm text-error">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="login-password" className="text-label-lg text-on-surface">
              {loginContent.passwordLabel} <RequiredMark />
            </label>
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-label-sm font-semibold text-primary hover:underline">
              {loginContent.forgotLink}
            </Link>
          </div>
          <PasswordInput
            id="login-password"
            autoComplete="current-password"
            leadingIcon="lock"
            placeholder={loginContent.passwordPlaceholder}
            {...register('password')}
          />
          {errors.password && <span className="text-body-sm text-error">{errors.password.message}</span>}
        </div>

        <div className="flex items-center justify-between py-1">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input type="checkbox" className="h-4 w-4 rounded accent-primary" {...register('remember')} />
            <span className="text-body-md text-on-surface">{loginContent.remember}</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={cn(
            'flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-label-lg text-on-primary shadow-sm transition-all',
            'hover:bg-primary-container hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70',
          )}
        >
          {submitting && <Icon name="progress_activity" className="animate-spin text-[20px]" />}
          <span>{submitting ? loginContent.submitting : loginContent.submit}</span>
        </button>
      </form>

      {/* Chỉ hiện khi chạy dev và có khai báo tài khoản mẫu trong .env.development.local */}
      {import.meta.env.DEV && demoAccounts.length > 0 && (
        <div className="mt-space-lg border-t border-surface-container-highest pt-space-md">
          <span className="mb-2 block text-label-sm text-on-surface-variant">
            {loginContent.quickTitle}
          </span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                disabled={submitting}
                onClick={() => void doSignIn(account.email, account.password, true)}
                className="flex flex-col rounded-lg bg-surface-container px-2.5 py-1.5 text-left transition-colors hover:bg-surface-container-high disabled:opacity-60"
              >
                <span className="text-label-sm font-semibold text-primary">{account.roleLabel}</span>
                <span className="text-label-sm font-normal text-on-surface-variant">{account.description}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={expireSession}
              className="flex flex-col rounded-lg bg-error-container/40 px-2.5 py-1.5 text-left transition-colors hover:bg-error-container"
            >
              <span className="text-label-sm font-semibold text-error">{loginContent.expiredLabel}</span>
              <span className="text-label-sm font-normal text-error">{loginContent.expiredHint}</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-space-md text-center">
        <span className="text-body-md text-on-surface-variant">{loginContent.noAccount}</span>
        <Link to={ROUTES.REGISTER} className="text-label-lg font-bold text-primary hover:underline">
          {loginContent.registerLink}
        </Link>
      </div>
    </AuthCard>
  )
}
