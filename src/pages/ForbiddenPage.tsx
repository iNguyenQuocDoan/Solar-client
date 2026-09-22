import { Link } from 'react-router'
import { ForbiddenCard } from '@/components/auth/ForbiddenCard'
import { Icon } from '@/components/stitch-ui/Icon'
import { ROUTES } from '@/constants/routes'

/** /403 – render trong AuthLayout, phần <main> là ForbiddenCard. */
export function ForbiddenPage() {
  return (
    <div className="flex flex-col gap-space-md">
      <ForbiddenCard />
      <div className="flex flex-wrap items-center gap-space-sm">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-space-xs rounded-lg bg-surface-container-lowest px-3 py-1.5 text-label-sm text-on-surface-variant shadow-sm transition-colors hover:text-on-surface"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
