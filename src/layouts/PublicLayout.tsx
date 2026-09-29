import '@fontsource/be-vietnam-pro/300.css'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/600.css'
import { Link, Outlet, useLocation } from 'react-router'
import { LANDING_CONTAINER, TEXT_LINK, ctaClass } from '@/components/landing/classes'
import { ROUTES } from '@/constants/routes'
import { cx } from '@/lib/cx'
import { footer, header, projects, trust } from '@/lib/mock/landing'

/*
 * Shell của các trang công khai ("/", "/coming-soon"). Không dùng AppShell/sidebar.
 * Font Be Vietnam Pro (300 số khai, 400 chữ, 600 tiêu đề và số đo) chỉ đặt ở đây vì
 * Schibsted Grotesk của portal thiếu dấu tiếng Việt.
 * Header không có menu theo giai đoạn (khảo sát, báo giá, thi công…): điều hướng đặt tên theo
 * giai đoạn đọc thành quy trình. Chỉ link tới phần công trình và phần năng lực thi công.
 */
const capabilityLink = { pathname: ROUTES.HOME, hash: `#${trust.id}` }
const projectsLink = { pathname: ROUTES.HOME, hash: `#${projects.id}` }

export function PublicLayout() {
  // Ghi chú nguồn giá điện chỉ đúng với trang chủ (nơi có biểu giá).
  const onHome = useLocation().pathname === ROUTES.HOME
  return (
    <div className="public-shell flex min-h-screen flex-col bg-canvas font-vn text-fg">
      <a
        href="#noi-dung"
        className="fixed top-2 left-2 z-50 -translate-y-20 rounded-control border border-line-2 bg-canvas px-4 py-2.5 ld-action text-fg focus:translate-y-0"
      >
        {header.skip}
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-canvas">
        <div className={cx('flex h-14 items-center justify-between gap-4 lg:h-16', LANDING_CONTAINER)}>
          <Link to={ROUTES.HOME} className="flex items-center gap-2 rounded-control">
            <img src="/placeholders/logo.svg" alt="" width={28} height={28} className="size-7" />
            <span className="ld-action text-fg">{footer.brand}</span>
          </Link>
          <nav aria-label="Liên kết chính" className="flex items-center gap-6">
            <Link to={projectsLink} className="hidden ld-body text-fg-2 hover:text-fg lg:inline">
              {header.projects}
            </Link>
            <Link to={capabilityLink} className="hidden ld-body text-fg-2 hover:text-fg lg:inline">
              {header.capability}
            </Link>
            <Link to={ROUTES.LOGIN} className="tap ld-body text-fg-2 hover:text-fg">
              {header.login}
            </Link>
            <Link to={ROUTES.REGISTER} className={ctaClass('md', 'hidden lg:inline-flex')}>
              {header.register}
            </Link>
          </nav>
        </div>
      </header>

      <main id="noi-dung" className="flex-1">
        <Outlet />
      </main>

      {/* Trang chủ kết thúc bằng dải CTA màu nên footer đứng sát; trang khác cần khoảng trống phía trên. */}
      <footer className={cx('border-t border-line', !onHome && 'mt-24 lg:mt-32')}>
        <div
          className={cx(
            'flex flex-col gap-3 py-8 ld-meta text-fg-2 lg:flex-row lg:flex-wrap lg:items-baseline lg:justify-between lg:gap-x-8',
            LANDING_CONTAINER,
          )}
        >
          <p className="font-semibold text-fg">{footer.brand}</p>
          <nav aria-label="Liên kết cuối trang" className="flex gap-6">
            <Link to={projectsLink} className={cx(TEXT_LINK, 'inline-block py-1')}>
              {header.projects}
            </Link>
            <Link to={ROUTES.LOGIN} className={cx(TEXT_LINK, 'inline-block py-1')}>
              {header.login}
            </Link>
          </nav>
          <p>{footer.copyright}</p>
        </div>
      </footer>
    </div>
  )
}
