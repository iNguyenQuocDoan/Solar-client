import { useState } from 'react'
import { Link, Outlet } from 'react-router'
import { Icon } from '@/components/stitch-ui/Icon'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'
import { footerContent } from '@/lib/mock/landing'
import { publicNav } from '@/lib/nav'

/*
 * Shell của các màn công khai – dựng theo <header>/<footer> trong
 * design/stitch/stitch_smart_solar_customer_portal/landing_home/code.html.
 * Không dùng AppShell/sidebar. Từ md trở xuống menu thu thành hamburger.
 */

const CONTAINER = 'w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop'

/** Cuộn mượt tới anchor trong trang chủ; nếu đang ở route khác thì về "/" kèm hash. */
function scrollToHash(hash: string) {
  const el = document.querySelector(hash)
  if (!el) return false
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', hash)
  return true
}

function isHashLink(href: string) {
  return href.startsWith('#')
}

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleHashClick = (hash: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false)
    if (window.location.pathname !== ROUTES.HOME) return
    event.preventDefault()
    scrollToHash(hash)
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="fixed left-0 right-0 top-0 z-50 w-full bg-surface-container-lowest/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className={cn('flex h-20 items-center justify-between gap-space-md', CONTAINER)}>
          <Link to={ROUTES.HOME} className="flex shrink-0 items-center gap-space-sm">
            <img src="/placeholders/logo.svg" alt="Smart Solar logo" className="h-8 w-auto object-contain" />
            <span className="whitespace-nowrap text-headline-lg tracking-tight text-primary">Smart Solar</span>
          </Link>

          <nav className="hidden items-center gap-space-xs p-space-2xs xl:flex">
            {publicNav.map((item, index) => (
              <a
                key={item.hash}
                href={`${ROUTES.HOME}${item.hash}`}
                onClick={handleHashClick(item.hash)}
                aria-current={index === 0 ? 'page' : undefined}
                className={cn(
                  'whitespace-nowrap rounded-xl px-space-sm py-space-xs text-label-lg transition-colors',
                  index === 0
                    ? 'bg-surface-container font-semibold text-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface',
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-space-sm">
            <Link
              to={ROUTES.LOGIN}
              className="hidden items-center justify-center whitespace-nowrap rounded-xl bg-surface-container-lowest px-space-md py-space-xs text-label-lg text-primary-container shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-colors hover:bg-surface-container-low hover:text-primary sm:inline-flex"
            >
              Đăng nhập
            </Link>
            <Link
              to={ROUTES.customer.assessment}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-primary-container px-space-lg py-space-xs text-label-lg text-on-primary shadow-[0_4px_16px_-4px_rgba(15,23,42,0.05)] transition-colors hover:bg-primary"
            >
              Khảo sát mái nhà
            </Link>
            <div className="ml-space-2xs flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <Icon name="person" className="text-[18px] text-on-primary" />
            </div>
            <button
              type="button"
              aria-label="Mở menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface xl:hidden"
            >
              <Icon name={menuOpen ? 'close' : 'menu'} className="text-[22px]" />
            </button>
          </div>
        </div>

        {/* Menu hamburger – md trở xuống */}
        {menuOpen && (
          <nav className="border-t border-outline-card bg-surface-container-lowest xl:hidden">
            <div className={cn('flex flex-col gap-space-2xs py-space-sm', CONTAINER)}>
              {publicNav.map((item) => (
                <a
                  key={item.hash}
                  href={`${ROUTES.HOME}${item.hash}`}
                  onClick={handleHashClick(item.hash)}
                  className="rounded-xl px-space-sm py-space-xs text-label-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                >
                  {item.label}
                </a>
              ))}
              <Link
                to={ROUTES.LOGIN}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-space-sm py-space-xs text-label-lg text-primary-container sm:hidden"
              >
                Đăng nhập
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="w-full flex-1 bg-surface pt-20">
        <Outlet />
      </main>

      <footer className="mt-space-3xl w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
        <div className={cn('pb-space-2xl pt-space-3xl', CONTAINER)}>
          <div className="grid grid-cols-1 gap-space-xl md:grid-cols-2 lg:grid-cols-5">
            <div className="flex flex-col gap-space-md lg:col-span-2">
              <div className="flex items-center gap-space-sm">
                <img src="/placeholders/logo.svg" alt="Smart Solar logo" className="h-8 w-auto object-contain" />
                <span className="text-headline-lg tracking-tight text-primary">Smart Solar</span>
              </div>
              <p className="max-w-sm text-body-md text-on-surface-variant">{footerContent.description}</p>
              <div className="mt-space-xs flex flex-col gap-space-xs text-body-sm text-on-surface-variant">
                {footerContent.contacts.map((contact) => (
                  <div key={contact.text} className="flex items-center gap-space-xs">
                    <Icon name={contact.icon} className="text-[18px] text-primary-container" />
                    <span>{contact.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {footerContent.columns.map((column) => (
              <div key={column.title} className="flex flex-col gap-space-sm">
                <span className="text-headline-md text-on-surface">{column.title}</span>
                <div className="flex flex-col gap-space-xs text-body-md">
                  {column.links.map((link) =>
                    isHashLink(link.href) ? (
                      <a
                        key={link.label}
                        href={`${ROUTES.HOME}${link.href}`}
                        onClick={handleHashClick(link.href)}
                        className="text-on-surface-variant transition-colors hover:text-primary"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        to={link.href}
                        className="text-on-surface-variant transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-space-2xl flex flex-col items-center justify-between gap-space-md pt-space-lg text-body-sm text-on-surface-variant md:flex-row">
            <p>{footerContent.copyright}</p>
            <div className="flex items-center gap-space-md">
              {footerContent.legalLinks.map((link) =>
                isHashLink(link.href) ? (
                  <a
                    key={link.label}
                    href={`${ROUTES.HOME}${link.href}`}
                    onClick={handleHashClick(link.href)}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.label} to={link.href} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
