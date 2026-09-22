import { Link, Outlet } from 'react-router'
import { Icon } from '@/components/stitch-ui/Icon'
import { ROUTES } from '@/constants/routes'
import { authPanel } from '@/lib/mock/auth'

/*
 * Shell 2 cột của auth_portal: panel primary-container bên trái + card form bên phải + footer nhỏ.
 * KHÔNG dựng thanh tab "Auth Hub" của bản Stitch – header chỉ có logo + link về trang chủ,
 * mỗi view trong code.html là một route riêng.
 *
 * Panel trái chỉ giữ thứ nói được điều gì đó: tiêu đề, mô tả, ảnh hệ thống và hai số đo.
 * Các chip trang trí (badge "nền tảng", chip role, chip bảo mật ở footer) và hai vệt blur
 * đã bỏ – chúng lặp lại trên mọi màn auth mà không thêm thông tin.
 */
export function AuthLayout() {
  const { title, description, image, metrics, footer } = authPanel

  return (
    <main className="flex min-h-screen w-full flex-col justify-center bg-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-space-2xl px-space-md py-space-xl md:px-margin-desktop">
        {/* Header: logo + link về trang chủ */}
        <div className="flex w-full flex-col items-center justify-between gap-space-md rounded-xl bg-surface-container-low p-space-xs md:flex-row">
          <Link to={ROUTES.HOME} className="flex items-center gap-space-sm pl-space-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary">
              <Icon name="solar_power" className="text-[20px]" />
            </div>
            <span className="text-headline-md tracking-tight text-primary">Smart Solar</span>
          </Link>
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-label-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <Icon name="arrow_back" className="text-[18px]" />
            Về trang chủ
          </Link>
        </div>

        <div className="grid w-full min-h-[640px] grid-cols-1 items-stretch gap-space-xl lg:grid-cols-12">
          {/* Panel trái – ẩn từ lg trở xuống */}
          <div className="hidden flex-col justify-between overflow-hidden rounded-xl bg-primary-container p-space-2xl text-on-primary lg:col-span-5 lg:flex">
            <div className="flex flex-col gap-space-md">
              <h2 className="text-headline-xl leading-tight text-on-primary">{title}</h2>
              <p className="text-body-md text-on-primary/80">{description}</p>
            </div>

            <div className="my-space-lg flex flex-col gap-space-sm">
              <div className="h-44 w-full overflow-hidden rounded-lg">
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-space-xs text-on-primary">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-on-primary/5 p-space-xs">
                    <div className="text-label-sm text-on-primary/70">{metric.label}</div>
                    <div className="text-headline-md font-bold text-on-primary">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải – từng route render trong đây */}
          <div className="flex flex-col justify-center lg:col-span-7">
            <Outlet />
          </div>
        </div>

        {/* Footer nhỏ */}
        <div className="flex w-full flex-wrap items-center justify-between gap-space-sm border-t border-surface-container-highest pt-space-md text-body-sm text-on-surface-variant">
          <div>{footer.copyright}</div>
        </div>
      </div>
    </main>
  )
}
