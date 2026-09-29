import { Link, useLocation } from 'react-router'
import { ctaClass } from '@/features/landing/components/classes'
import { ROUTES } from '@/routes/paths'
import { errorMessage, isApiError } from '@/services/api/errors'

/*
 * Lỗi khi tải danh mục trên trang công khai.
 * GET /api/products hiện vẫn đòi đăng nhập (backend trả 401 cho khách, 29/09/2026), nên 401
 * hiện lời mời đăng nhập, đăng nhập xong quay lại đúng trang này. Khi backend mở public thì
 * nhánh này tự không còn xảy ra.
 */
export function CatalogError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const location = useLocation()

  if (isApiError(error) && error.status === 401) {
    return (
      <div className="rounded-container border border-line px-6 py-10 text-center">
        <p className="ld-body font-semibold text-fg">Đăng nhập để xem danh mục sản phẩm</p>
        <p className="mx-auto mt-2 max-w-[46ch] ld-body text-fg-2">Danh mục hiện chỉ mở cho tài khoản đã đăng nhập.</p>
        <Link to={ROUTES.LOGIN} state={{ from: location.pathname }} className={ctaClass('lg', 'mt-6 inline-flex')}>
          Đăng nhập
        </Link>
      </div>
    )
  }

  return (
    <div role="alert" className="rounded-container border border-line px-6 py-10 text-center">
      <p className="ld-body font-semibold text-fg">Không tải được sản phẩm</p>
      <p className="mx-auto mt-2 max-w-[46ch] ld-body text-fg-2">{errorMessage(error)}</p>
      <button type="button" onClick={onRetry} className="tap mt-4 ld-body text-accent underline underline-offset-4">
        Thử lại
      </button>
    </div>
  )
}
