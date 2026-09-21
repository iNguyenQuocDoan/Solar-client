import { Link, Outlet } from 'react-router'
import { Icon } from '@/components/ui/Icon'
import { ROUTES } from '@/constants/routes'
import { authPanel } from '@/lib/mock/auth'

/*
 * Shell 2 cột của auth_portal: panel primary-container bên trái + card form bên phải + footer nhỏ.
 * KHÔNG dựng thanh tab "Auth Hub" của bản Stitch – header chỉ có logo + link về trang chủ,
 * mỗi view trong code.html là một route riêng.
 */
export function AuthLayout() {
  const { badge, title, description, image, systemBadge, metrics, roleLegendTitle, roles, footer } = authPanel

  return (
    <main className="flex min-h-screen w-full flex-col justify-center bg-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-space-2xl px-space-md py-space-xl md:px-margin-desktop">
        {/* Header: logo + link về trang chủ */}
        <div className="flex w-full flex-col items-center justify-between gap-space-md rounded-xl bg-surface-container-low p-space-xs shadow-sm md:flex-row">
          <Link to={ROUTES.HOME} className="flex items-center gap-space-sm pl-space-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary shadow-sm">
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
          <div className="relative hidden flex-col justify-between overflow-hidden rounded-xl bg-primary-container p-space-2xl text-on-primary shadow-md lg:col-span-5 lg:flex">
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-primary opacity-30 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 top-1/4 h-56 w-56 rounded-full bg-secondary-container opacity-20 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-space-md">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-on-primary/10 px-3 py-1 text-label-sm text-on-primary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary-fixed" />
                {badge}
              </div>
              <h2 className="text-headline-xl leading-tight text-on-primary">{title}</h2>
              <p className="text-body-md text-on-primary/80">{description}</p>
            </div>

            <div className="relative z-10 my-space-lg rounded-xl bg-surface-container-lowest/10 p-space-md shadow-lg backdrop-blur-sm">
              <div className="relative mb-space-sm h-44 w-full overflow-hidden rounded-lg">
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-inverse-surface/80 px-2.5 py-1 text-label-sm text-inverse-on-surface backdrop-blur">
                  <Icon name="solar_power" className="text-[14px] text-tertiary-fixed" />
                  {systemBadge}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-space-xs text-on-primary">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-on-primary/5 p-space-xs">
                    <div className="text-label-sm text-on-primary/70">{metric.label}</div>
                    <div className={`text-headline-md font-bold ${metric.tone}`}>{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-2 border-t border-on-primary/15 pt-space-md">
              <span className="text-label-sm uppercase tracking-wider text-on-primary/70">{roleLegendTitle}</span>
              <div className="flex flex-wrap gap-1.5">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-on-primary/10 px-2.5 py-0.5 text-label-sm text-on-primary"
                  >
                    {role}
                  </span>
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
          <div className="flex items-center gap-4">
            {footer.badges.map((item) => (
              <span key={item.text} className="flex items-center gap-1">
                <Icon name={item.icon} className="text-[16px] text-primary" />
                {item.text}
              </span>
            ))}
          </div>
          <div>{footer.copyright}</div>
        </div>
      </div>
    </main>
  )
}
