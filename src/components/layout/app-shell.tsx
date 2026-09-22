import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { type NavItem, type Portal } from '@/constants/nav'
import { useAuth } from '@/lib/auth/AuthProvider'
import { roleLabels } from '@/lib/auth/roles'
import { cx } from '@/lib/cx'
import { useTheme, type Theme } from '@/lib/theme'

/*
  The shell is a margin, not a frame: a text-only rail on the left, the page as a
  document on the right. Context and tools for the portal live in the rail.
  Main padding is px-4 below md and px-12 from md; ActionBar and Table bleed by the same amounts.
*/
export function AppShell({
  portal,
  context,
  tools,
  children,
}: {
  portal: Portal
  context?: ReactNode
  tools?: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  /* The page behind the drawer must not scroll while it is open. */
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-canvas focus:px-3 focus:py-2 focus:text-meta"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-line bg-canvas px-4 lg:hidden">
        <span className="text-body font-semibold">Smart Solar</span>
        <button
          type="button"
          className="press -mr-3 inline-flex h-11 items-center px-3 text-body text-fg-2 underline-offset-4 hover:text-fg hover:underline"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </header>

      <Rail portal={portal} context={context} tools={tools} open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-60">
        <main id="main" className="mx-auto w-full max-w-[1160px] px-4 py-8 md:px-12 md:py-12">
          {children}
        </main>
      </div>
    </div>
  )
}

function Rail({
  portal,
  context,
  tools,
  open,
  onClose,
}: {
  portal: Portal
  context?: ReactNode
  tools?: ReactNode
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-fg/40 lg:hidden" aria-hidden onClick={onClose} />}
      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-60 flex-col overflow-y-auto overscroll-contain [scrollbar-width:thin] border-r border-line bg-canvas px-6 pt-6 transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Primary"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-body font-semibold">Smart Solar</p>
            <p className="text-meta text-fg-2">{portal.name}</p>
          </div>
          <button
            type="button"
            className="press -mt-3 -mr-3 inline-flex h-11 items-center px-3 text-meta text-fg-2 hover:text-fg lg:hidden"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {context && <div className="mt-4 text-meta text-fg-2">{context}</div>}

        <nav className="mt-6 flex-1">
          {portal.groups.map((group, gi) => (
            <div key={gi} className={cx(gi > 0 && 'mt-6')}>
              {group.label && <p className="mb-1 text-meta text-fg-3">{group.label}</p>}
              <ul>
                {group.items.map((item) => (
                  <li key={item.label}>
                    <RailLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {tools && <div className="mt-6 space-y-3">{tools}</div>}
          {portal.support && (
            <ul className="mt-6 border-t border-line pt-4">
              {portal.support.map((item) => (
                <li key={item.label}>
                  <RailLink item={item} />
                </li>
              ))}
            </ul>
          )}
        </nav>

        <SessionBlock fallback={portal.user} />
      </aside>
    </>
  )
}

/* Rail rows are 44px tall in the drawer and 36px on the desktop rail. */
function RailLink({ item }: { item: NavItem }) {
  const isPlaceholder = item.to === '#'
  const className = (active: boolean) =>
    cx(
      '-ml-6 flex items-baseline gap-2 border-l-2 py-3 pl-[22px] text-body lg:py-2',
      active ? 'border-accent font-semibold text-fg' : 'border-transparent text-fg-2 hover:text-fg',
    )
  const inner = (
    <>
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge && <span className="tnum text-meta text-accent-fg">{item.badge}</span>}
    </>
  )
  if (isPlaceholder) {
    return (
      <button type="button" className={cx(className(false), 'w-[calc(100%+1.5rem)] text-left')} aria-disabled title="Not available in this build">
        {inner}
      </button>
    )
  }
  return (
    <NavLink to={item.to} end={item.end} className={({ isActive }) => className(isActive)}>
      {inner}
    </NavLink>
  )
}

/*
  Khối phiên đăng nhập, ghim ở đáy rail khi rail dài hơn màn hình.
  Tài khoản thật lấy từ AuthProvider; portal đi theo vai trò nên không còn ô "đổi portal".
  Khi chưa có phiên (mock/dev) hiển thị người dùng mẫu của portal.
*/
function SessionBlock({ fallback }: { fallback: Portal['user'] }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const name = user?.name ?? fallback.name
  const role = user ? roleLabels[user.role] : fallback.role

  async function handleSignOut() {
    await signOut()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="sticky bottom-0 mt-6 border-t border-line bg-canvas pt-4 pb-6">
      <p className="truncate text-body font-medium" title={user?.email}>
        {name}
      </p>
      <p className="text-meta text-fg-2">{role}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <ThemeButton />
        {user && (
          <button
            type="button"
            onClick={handleSignOut}
            className="press inline-flex h-11 items-center text-meta whitespace-nowrap text-fg-2 underline-offset-4 hover:text-fg hover:underline lg:h-8"
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  )
}

const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<Theme, string> = { system: 'Auto', light: 'Light', dark: 'Dark' }

function ThemeButton() {
  const [theme, setTheme] = useTheme()
  return (
    <button
      type="button"
      onClick={() => setTheme(NEXT[theme])}
      className="press inline-flex h-11 shrink-0 items-center text-meta whitespace-nowrap text-fg-2 underline-offset-4 hover:text-fg hover:underline lg:h-8"
      aria-label={`Theme: ${LABEL[theme]}. Switch theme`}
    >
      Theme: {LABEL[theme]}
    </button>
  )
}
