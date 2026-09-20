import { useEffect, useState, type ReactNode } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { PORTALS, type NavItem, type Portal, type PortalKey } from '@/constants/nav'
import { cx } from '@/lib/cx'
import { useTheme, type Theme } from '@/lib/theme'

/*
  The shell is a margin, not a frame: a text-only rail on the left, the page as a
  document on the right. Context and tools for the portal live in the rail.
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

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-canvas focus:px-3 focus:py-2 focus:text-sm"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-line bg-canvas px-5 lg:hidden">
        <span className="text-[15px] font-semibold">Smart Solar</span>
        <button type="button" className="press text-[15px] text-fg-2 underline-offset-4 hover:text-fg hover:underline" onClick={() => setOpen(true)}>
          Menu
        </button>
      </header>

      <Rail portal={portal} context={context} tools={tools} open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-60">
        <main id="main" className="mx-auto w-full max-w-[1160px] px-5 py-8 md:px-12 md:py-12">
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
          'fixed inset-y-0 left-0 z-40 flex w-60 flex-col overflow-y-auto border-r border-line bg-canvas px-6 py-7 transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Primary"
      >
        <div className="flex items-start justify-between">
          <div className="leading-tight">
            <p className="text-[15px] font-semibold">Smart Solar</p>
            <p className="text-[13px] text-fg-2">{portal.name}</p>
          </div>
          <button type="button" className="press text-[13px] text-fg-2 hover:text-fg lg:hidden" onClick={onClose}>
            Close
          </button>
        </div>
        {context && <div className="mt-4 text-[13px] leading-5 text-fg-2">{context}</div>}

        <nav className="mt-8 flex-1">
          {portal.groups.map((group, gi) => (
            <div key={gi} className={cx(gi > 0 && 'mt-7')}>
              {group.label && <p className="mb-2 text-[12px] text-fg-3">{group.label}</p>}
              <ul>
                {group.items.map((item) => (
                  <li key={item.label}>
                    <RailLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {tools && <div className="mt-8 space-y-3">{tools}</div>}
          {portal.support && (
            <ul className="mt-8 border-t border-line pt-5">
              {portal.support.map((item) => (
                <li key={item.label}>
                  <RailLink item={item} />
                </li>
              ))}
            </ul>
          )}
        </nav>

        <div className="mt-8 border-t border-line pt-5">
          <p className="text-[14px] font-medium">{portal.user.name}</p>
          <p className="text-[13px] text-fg-2">{portal.user.role}</p>
          <div className="mt-4 space-y-2">
            <PortalSwitch current={portal.key} />
            <ThemeButton />
          </div>
        </div>
      </aside>
    </>
  )
}

function RailLink({ item }: { item: NavItem }) {
  const isPlaceholder = item.to === '#'
  const className = (active: boolean) =>
    cx(
      '-ml-6 flex items-baseline gap-2 border-l-2 py-1.5 pl-[22px] text-[15px] leading-5',
      active ? 'border-accent font-semibold text-fg' : 'border-transparent text-fg-2 hover:text-fg',
    )
  const inner = (
    <>
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge && <span className="tnum text-[13px] text-accent-fg">{item.badge}</span>}
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

function PortalSwitch({ current }: { current: PortalKey }) {
  const navigate = useNavigate()
  return (
    <select
      aria-label="Switch portal"
      value={current}
      onChange={(e) => navigate(PORTALS[e.target.value as PortalKey].home)}
      className="h-8 w-full rounded-md border border-line bg-transparent px-2 text-[13px] text-fg-2"
    >
      {Object.values(PORTALS).map((p) => (
        <option key={p.key} value={p.key}>
          {p.name}
        </option>
      ))}
    </select>
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
      className="press shrink-0 text-[13px] text-fg-2 underline-offset-4 hover:text-fg hover:underline"
      aria-label={`Theme: ${LABEL[theme]}. Switch theme`}
    >
      Theme: {LABEL[theme]}
    </button>
  )
}
