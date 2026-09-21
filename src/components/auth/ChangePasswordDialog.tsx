import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { PasswordInput } from '@/components/auth/AuthInput'
import { PasswordRules } from '@/components/auth/PasswordRules'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { Icon } from '@/components/ui/Icon'
import { ROUTES } from '@/constants/routes'
import { useChangePasswordMutation } from '@/features/auth/hooks'
import { errorMessage, isApiError } from '@/lib/api/errors'
import { useAuth } from '@/lib/auth/AuthProvider'
import { changePasswordContent, isStrongPassword } from '@/lib/mock/auth'

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z.string().refine(isStrongPassword, 'Mật khẩu chưa đạt đủ 4 quy chuẩn an toàn'),
    confirm: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((values) => values.newPassword === values.confirm, {
    path: ['confirm'],
    message: 'Mật khẩu xác nhận không khớp',
  })

type ChangePasswordValues = z.infer<typeof schema>

export type ChangePasswordDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/*
 * Dialog đổi mật khẩu, mở từ khối user ở Sidebar.
 * ChangePasswordRequest trong swagger = { currentPassword, newPassword };
 * ô "xác nhận" chỉ validate phía client.
 */
export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const navigate = useNavigate()
  const { clearSession } = useAuth()
  const changeMutation = useChangePasswordMutation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirm: '' },
  })

  const newPassword = watch('newPassword')
  const submitting = changeMutation.isPending

  const close = (next: boolean) => {
    if (submitting) return
    if (!next) {
      reset()
      setFormError(null)
    }
    onOpenChange(next)
  }

  const onSubmit = handleSubmit(async (values) => {
    if (submitting) return
    setFormError(null)
    try {
      await changeMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      toast.success(changePasswordContent.success)
      reset()
      onOpenChange(false)
    } catch (error) {
      // Backend thu hồi phiên sau khi đổi mật khẩu → 401 → đăng xuất và về /login.
      if (isApiError(error) && error.status === 401) {
        toast.success(changePasswordContent.successRelogin)
        clearSession()
        onOpenChange(false)
        navigate(ROUTES.LOGIN, { replace: true })
        return
      }
      if (isApiError(error) && error.fieldErrors.currentPassword) {
        setError('currentPassword', { type: 'server', message: error.fieldErrors.currentPassword })
        return
      }
      setFormError(errorMessage(error))
    }
  })

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{changePasswordContent.title}</DialogTitle>
          <DialogDescription>{changePasswordContent.description}</DialogDescription>
        </DialogHeader>

        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg bg-error-container p-space-sm text-on-error-container"
          >
            <Icon name="error" className="mt-0.5 shrink-0 text-[20px] text-error" />
            <span className="text-body-sm">{formError}</span>
          </div>
        )}

        <form className="flex flex-col gap-space-sm" onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="cp-current" className="text-label-lg text-on-surface">
              {changePasswordContent.currentLabel}
            </label>
            <PasswordInput
              id="cp-current"
              size="md"
              autoComplete="current-password"
              placeholder={changePasswordContent.placeholder}
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <span className="text-body-sm text-error">{errors.currentPassword.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="cp-new" className="text-label-lg text-on-surface">
              {changePasswordContent.newLabel}
            </label>
            <PasswordInput
              id="cp-new"
              size="md"
              autoComplete="new-password"
              placeholder={changePasswordContent.placeholder}
              {...register('newPassword')}
            />
            {errors.newPassword && <span className="text-body-sm text-error">{errors.newPassword.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="cp-confirm" className="text-label-lg text-on-surface">
              {changePasswordContent.confirmLabel}
            </label>
            <PasswordInput
              id="cp-confirm"
              size="md"
              autoComplete="new-password"
              placeholder={changePasswordContent.placeholder}
              {...register('confirm')}
            />
            {errors.confirm && <span className="text-body-sm text-error">{errors.confirm.message}</span>}
          </div>

          <PasswordRules value={newPassword} />

          <div className="mt-1 flex items-center justify-end gap-space-sm">
            <button
              type="button"
              onClick={() => close(false)}
              disabled={submitting}
              className="h-11 rounded-xl bg-surface-container px-4 text-label-lg text-on-surface transition-colors hover:bg-surface-container-high disabled:opacity-60"
            >
              {changePasswordContent.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Icon
                name={submitting ? 'progress_activity' : 'lock_reset'}
                className={submitting ? 'animate-spin text-[18px]' : 'text-[18px]'}
              />
              {submitting ? changePasswordContent.submitting : changePasswordContent.submit}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
