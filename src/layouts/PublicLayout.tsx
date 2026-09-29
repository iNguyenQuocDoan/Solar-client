import '@fontsource/be-vietnam-pro/300.css'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/600.css'
import { Link, Outlet, useLocation } from 'react-router'
import { Rich } from '@/components/landing/rich'
import { LANDING_CONTAINER, TEXT_LINK, ctaClass } from '@/components/landing/classes'
import { ROUTES } from '@/constants/routes'
import { cx } from '@/lib/cx'
import { faq, footer, header, offer } from '@/lib/mock/landing'

/*
 * Shell của các trang công khai ("/", "/coming-soon"). Không dùng AppShell/sidebar.
 * Font Be Vietnam Pro (300 số khai, 400 chữ, 600 tiêu đề và số đo) chỉ đặt ở đây vì
 * Schibsted Grotesk của portal thiếu dấu tiếng Việt.
 * Header không có menu theo giai đoạn (khảo sát, báo giá, thi công…): điều hướng đặt tên theo
 * giai đoạn đọc thành quy trình. Chỉ link tới phần mô tả món hàng và phần câu hỏi.
 */
const faqLink = { pathname: ROUTES.HOME, hash: `#${faq.id}` }
const offerLink = { pathname: ROUTES.HOME, hash: `#${offer.id}` }

export function PublicLayout() {
  // Câu "dữ liệu minh hoạ" chỉ đúng với trang có số liệu mẫu.
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
            <Link to={offerLink} className="hidden ld-body text-fg-2 hover:text-fg lg:inline">
              {header.offer}
            </Link>
            <Link to={faqLink} className="hidden ld-body text-fg-2 hover:text-fg lg:inline">
              {header.faq}
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

      <footer className="mt-24 border-t border-line lg:mt-32">
        <div
          className={cx(
            'flex flex-col gap-3 py-8 ld-meta text-fg-2 lg:flex-row lg:flex-wrap lg:items-baseline lg:justify-between lg:gap-x-8',
            LANDING_CONTAINER,
          )}
        >
          <p>
            <span className="font-semibold text-fg">{footer.brand}</span> <Rich value={footer.legal} />
          </p>
          {onHome && <p>{footer.sampleNote}</p>}
          <nav aria-label="Liên kết cuối trang" className="flex gap-6">
            <Link to={faqLink} className={cx(TEXT_LINK, 'inline-block py-1')}>
              {header.faq}
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
