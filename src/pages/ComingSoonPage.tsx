import { Link } from 'react-router'
import { LANDING_CONTAINER } from '@/components/landing/section'
import { Icon } from '@/components/ui/Icon'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'

/*
 * Trang tạm cho các vai trò chưa có màn (Kinh doanh, Quản lý, Khách hàng) và cho
 * các link trong landing_home chưa có route thật.
 */
const audiences = [
  { icon: 'request_quote', title: 'Kinh doanh', description: 'Báo giá & Hợp đồng' },
  { icon: 'insights', title: 'Quản lý', description: 'Duyệt hồ sơ & KPI' },
  { icon: 'home', title: 'Khách hàng', description: 'Chủ hộ gia đình' },
]

export function ComingSoonPage() {
  return (
    <div className={cn('flex flex-col items-center py-space-3xl text-center', LANDING_CONTAINER)}>
      <div className="mb-space-md flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-high text-primary shadow-sm">
        <Icon name="construction" className="text-[42px]" />
      </div>
      <h1 className="text-headline-xl-mobile text-primary md:text-headline-xl">Khu vực này đang được xây dựng</h1>
      <p className="mt-space-xs max-w-xl text-body-lg text-on-surface-variant">
        Cổng làm việc cho các vai trò Kinh doanh, Quản lý và Khách hàng sẽ sớm có mặt. Hiện tại bạn có thể dùng
        cổng Quản trị viên và Kỹ thuật viên.
      </p>

      <div className="mt-space-xl grid w-full max-w-3xl grid-cols-1 gap-space-md sm:grid-cols-3">
        {audiences.map((audience) => (
          <div
            key={audience.title}
            className="flex flex-col items-center gap-space-2xs rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm"
          >
            <Icon name={audience.icon} className="text-[28px] text-primary-container" />
            <span className="text-headline-md text-on-surface">{audience.title}</span>
            <span className="text-body-sm text-on-surface-variant">{audience.description}</span>
          </div>
        ))}
      </div>

      <div className="mt-space-xl flex flex-wrap items-center justify-center gap-space-sm">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-lg py-3 text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          Về trang chủ
        </Link>
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center justify-center rounded-xl bg-surface-container px-space-lg py-3 text-label-lg text-on-surface transition-colors hover:bg-surface-container-high"
        >
          Đăng nhập bằng tài khoản khác
        </Link>
      </div>
    </div>
  )
}
