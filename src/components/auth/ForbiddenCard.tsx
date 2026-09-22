import { useLocation, useNavigate } from 'react-router'
import { Icon } from '@/components/stitch-ui/Icon'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/lib/auth/AuthProvider'
import { roleLabels, type UserRole } from '@/lib/auth/roles'
import { forbiddenContent } from '@/lib/mock/auth'

/*
 * Thẻ 403 – "State 1: Unauthorized Access Warning Box" trong auth_portal/code.html.
 * "Đổi tài khoản khác" = đăng xuất rồi về /login.
 */
export function ForbiddenCard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()
  const requiredRole = (location.state as { required?: UserRole } | null)?.required

  const currentRoleLabel = user ? roleLabels[user.role] : forbiddenContent.guestLabel

  const switchAccount = async () => {
    await signOut()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="flex items-start gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-error-container text-error">
        <Icon name="gpp_bad" className="text-[24px]" />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-headline-md text-on-surface">{forbiddenContent.title}</h1>
          {requiredRole && (
            <span className="rounded-full bg-error-container px-2 py-0.5 text-label-sm text-error">
              {forbiddenContent.requiredPrefix}
              {roleLabels[requiredRole]}
            </span>
          )}
        </div>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {forbiddenContent.descriptionBefore}
          <span className="text-on-surface">{currentRoleLabel}</span>
          {forbiddenContent.descriptionAfter}
        </p>
        <div className="mt-space-sm flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void switchAccount()}
            className="rounded-lg bg-surface-container px-3 py-1.5 text-label-sm text-on-surface transition-colors hover:bg-surface-container-high"
          >
            {forbiddenContent.switchAccount}
          </button>
          <a
            href="tel:19006868"
            className="rounded-lg bg-surface-container-low px-3 py-1.5 text-label-sm text-primary underline"
          >
            {forbiddenContent.hotline}
          </a>
        </div>
      </div>
    </div>
  )
}
