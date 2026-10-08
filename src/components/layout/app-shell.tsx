import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { ROUTES } from '@/routes/paths'
import { type NavItem, type Portal } from '@/config/portals'
import { useAuth } from '@/context/AuthProvider'
import { roleLabels } from '@/config/roles'
import { cx } from '@/utils/cx'
import { useTheme, type Theme } from '@/hooks/useTheme'
import { Count } from '@/components/common/ui/badge'
import { ChangePasswordDialog } from '@/features/auth/components/ChangePasswordDialog'
import { changePasswordContent } from '@/data/auth'
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed'
import { PageCrumbContext, isNavItemActive, isNavItemPage, type PageCrumb } from '@/components/layout/page-crumb'

/*
  The shell is a margin, not a frame: a text-only rail on the left, the page as a
  document on the right. Context and tools for the portal live in the rail.
  Main padding is px-4 below md and px-6 from md, no max width (dense layout, 05/10/2026);
  ActionBar and Table bleed by the same amounts.
  Desktop: the rail can be collapsed; the slim top bar (the same one phones use) then holds
  "Mở menu" and the portal's attention hint, so the page gets the full width.
  Keyboard: opening or collapsing moves focus to the control that undoes it (the one that was pressed
  disappears); Esc closes the drawer; a closed drawer is invisible, so its links leave the Tab order.
  "Bạn đang ở đâu" (08/10/2026): mục đang mở trên rail có nền màu + vạch nhấn, nhóm chứa nó đậm lên, và một
  thanh định vị dính trên cùng nội dung ghi đường đi: portal / nhóm / mục / trang chi tiết (usePageCrumb).
*/
/** Số đếm cạnh mục menu. `attention`: việc đang chờ người dùng xử lý, tô màu nhấn. */
export type RailCount = { value?: number; attention?: boolean }

export function AppShell({
  portal,
  context,
  tools,
  badges,
  collapsedHint,
  children,
}: {
  portal: Portal
  context?: ReactNode
  tools?: ReactNode
  /** Số đếm thật cạnh mục menu, theo `to` của mục; 0 hoặc chưa có thì không hiện. */
  badges?: Record<string, RailCount | undefined>
  /** Nội dung ngắn hiện trên thanh trên cùng khi menu đang ẩn, ví dụ "3 yêu cầu chờ nhận". */
  collapsedHint?: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useSidebarCollapsed()
  const location = useLocation()
  const [crumb, setCrumb] = useState<PageCrumb | null>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const collapseButtonRef = useRef<HTMLButtonElement>(null)
  /* Nút cần nhận focus sau lần đổi trạng thái do người dùng bấm (null: không đụng tới focus). */
  const focusNext = useRef<RefObject<HTMLButtonElement | null> | null>(null)

  /* Cùng một nút: dưới lg mở drawer, từ lg mở lại rail đã thu gọn. */
  function openMenu() {
    if (window.matchMedia('(min-width: 64rem)').matches) {
      focusNext.current = collapseButtonRef
      setCollapsed(false)
    } else {
      focusNext.current = closeButtonRef
      setOpen(true)
    }
  }

  function closeDrawer() {
    focusNext.current = menuButtonRef
    setOpen(false)
  }

  function collapse() {
    focusNext.current = menuButtonRef
    setCollapsed(true)
  }

  // Focus chuyển sau khi DOM đã đổi (nút vừa bấm có thể đã bị ẩn).
  useEffect(() => {
    const target = focusNext.current
    if (!target) return
    focusNext.current = null
    target.current?.focus()
  }, [open, collapsed])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return
    // Esc của một hộp thoại mở từ drawer (Đổi mật khẩu) chỉ đóng hộp thoại đó, không đóng luôn drawer.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented || document.querySelector('dialog[open], [role=dialog]')) return
      closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Drawer đang mở mà cửa sổ rộng qua lg (xoay máy tính bảng): đóng lại, nếu không trang bị khoá cuộn mà không thấy nút đóng.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 64rem)')
    const onChange = () => {
      if (desktop.matches) setOpen(false)
    }
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

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
        Bỏ qua, tới nội dung chính
      </a>

      <header
        className={cx(
          'sticky top-0 z-20 flex h-12 items-center justify-between gap-4 border-b border-line bg-canvas px-4 md:px-6',
          collapsed ? 'lg:flex' : 'lg:hidden',
        )}
      >
        <span className="text-body font-semibold">Smart Solar</span>
        <div className="flex min-w-0 items-center gap-4">
          {collapsedHint && <div className="flex min-w-0 items-center text-meta text-fg-2">{collapsedHint}</div>}
          <button
            ref={menuButtonRef}
            type="button"
            aria-controls="rail"
            aria-expanded={open}
            className="press -mr-3 inline-flex h-11 items-center px-3 text-body text-fg-2 underline-offset-4 hover:text-fg hover:underline lg:h-9"
            onClick={openMenu}
          >
            Mở menu
          </button>
        </div>
      </header>

      <Rail
        portal={portal}
        context={context}
        tools={tools}
        badges={badges}
        open={open}
        collapsed={collapsed}
        onClose={closeDrawer}
        onCollapse={collapse}
        closeButtonRef={closeButtonRef}
        collapseButtonRef={collapseButtonRef}
      />

      <div className={collapsed ? undefined : 'lg:pl-52'}>
        {/* Dưới thanh trên (h-12) khi thanh đó hiện: luôn dưới lg, và từ lg khi rail đang thu gọn. */}
        <div className={cx('sticky top-12 z-10 border-b border-line bg-canvas px-4 md:px-6', collapsed ? 'lg:top-12' : 'lg:top-0')}>
          <LocationBar portal={portal} crumb={crumb?.pathname === location.pathname ? crumb.label : null} />
        </div>
        <PageCrumbContext value={setCrumb}>
          <main id="main" className="w-full px-4 py-6 md:px-6">
            {children}
          </main>
        </PageCrumbContext>
      </div>
    </div>
  )
}

function Rail({
  portal,
  context,
  tools,
  badges,
  open,
  collapsed,
  onClose,
  onCollapse,
  closeButtonRef,
  collapseButtonRef,
}: {
  portal: Portal
  context?: ReactNode
  tools?: ReactNode
  badges?: Record<string, RailCount | undefined>
  open: boolean
  collapsed: boolean
  onClose: () => void
  onCollapse: () => void
  closeButtonRef: RefObject<HTMLButtonElement | null>
  collapseButtonRef: RefObject<HTMLButtonElement | null>
}) {
  const { pathname } = useLocation()
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-fg/40 lg:hidden" aria-hidden onClick={onClose} />}
      <aside
        id="rail"
        className={cx(
          'fixed inset-y-0 left-0 z-40 flex w-52 flex-col overflow-y-auto overscroll-contain [scrollbar-width:thin] border-r border-line bg-canvas px-6 pt-6 duration-200',
          // Đóng / thu gọn: ẩn hẳn (invisible gỡ khỏi thứ tự Tab và cây trợ năng), không chỉ đẩy ra ngoài màn hình.
          // Transition lấy theo trạng thái MỚI: lúc ẩn có visibility trong transition nên trượt ra hết rồi mới ẩn;
          // lúc hiện thì không, để rail hiện ngay và nhận được focus ở khung hình đầu.
          open ? 'visible translate-x-0 transition-[translate]' : 'invisible -translate-x-full transition-[translate,visibility]',
          collapsed
            ? 'lg:invisible lg:-translate-x-full lg:transition-[translate,visibility]'
            : 'lg:visible lg:translate-x-0 lg:transition-[translate]',
        )}
        aria-label="Điều hướng chính"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-body font-semibold">Smart Solar</p>
            <p className="text-meta text-fg-2">{portal.name}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="press -mt-3 -mr-3 inline-flex h-11 items-center px-3 text-meta text-fg-2 hover:text-fg lg:hidden"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
        {context && <div className="mt-4 text-meta text-fg-2">{context}</div>}

        <nav className="mt-6 flex-1">
          {portal.groups.map((group, gi) => (
            <div key={gi} className={cx(gi > 0 && 'mt-6')}>
              {group.label && (
                <p
                  className={cx(
                    'mb-1 text-meta',
                    group.items.some((item) => isNavItemActive(item, pathname)) ? 'font-medium text-fg-2' : 'text-fg-3',
                  )}
                >
                  {group.label}
                </p>
              )}
              <ul>
                {group.items.map((item) => (
                  <li key={item.label}>
                    <RailLink item={item} count={badges?.[item.to]} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {tools && <div className="mt-6 space-y-3">{tools}</div>}
        </nav>

        <SessionBlock onCollapse={onCollapse} collapseButtonRef={collapseButtonRef} />
      </aside>
    </>
  )
}

/*
  Rail rows are 44px tall in the drawer and 36px on the desktop rail.
  The open item sits on the accent tint with a 3px accent bar at the rail edge, so "where am I" reads at a glance;
  other rows only tint on hover.
*/
function RailLink({ item, count }: { item: NavItem; count?: RailCount }) {
  const { pathname } = useLocation()
  const active = isNavItemActive(item, pathname)
  const isPlaceholder = item.to === '#'
  const className = (on: boolean) =>
    cx(
      '-mr-3 -ml-6 flex items-center gap-2 rounded-r-control border-l-[3px] py-3 pr-3 pl-[21px] text-body lg:py-2',
      on ? 'border-accent bg-accent-soft font-semibold text-fg' : 'border-transparent text-fg-2 hover:bg-surface-2 hover:text-fg',
    )
  const inner = (
    <>
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.badge && <span className="text-meta text-accent-fg">{item.badge}</span>}
      {!item.badge && count?.value ? <Count value={count.value} attention={count.attention} /> : null}
    </>
  )
  if (isPlaceholder) {
    return (
      <button type="button" className={cx(className(false), 'w-[calc(100%+2.25rem)] text-left')} aria-disabled title="Chưa có trong bản này">
        {inner}
      </button>
    )
  }
  return (
    // Link thường thay NavLink: NavLink bỏ aria-current khi đường dẫn không khớp hẳn, kể cả lúc đang ở trang con.
    // Đúng trang của mục: "page"; trang con (chi tiết…): "location".
    <Link
      to={item.to}
      aria-current={active ? (isNavItemPage(item, pathname) ? 'page' : 'location') : undefined}
      className={className(active)}
    >
      {inner}
    </Link>
  )
}

/*
  Thanh định vị: portal / nhóm menu / mục đang mở / trang chi tiết (hoặc bước wizard).
  - Mắt xích cuối là trang đang xem (aria-current, không phải link); mục menu là link về danh sách khi đang ở trang
    con, kể cả lúc trang con còn đang tải hoặc báo lỗi (404/403), để không thành đường cụt.
  - Điện thoại: ẩn tên portal và nhóm, nhường chỗ cho tên trang hiện tại; tên quá dài thì cắt "…" và có tooltip.
  - Tiêu đề tab trình duyệt đi theo vị trí: "<trang> – <portal> – Smart Solar".
*/
function LocationBar({ portal, crumb }: { portal: Portal; crumb: string | null }) {
  const { pathname } = useLocation()
  const group = portal.groups.find((g) => g.items.some((item) => isNavItemActive(item, pathname)))
  const item = group?.items.find((i) => isNavItemActive(i, pathname))
  const onItemPage = item ? isNavItemPage(item, pathname) : false

  type Step = { label: string; to?: string; wide?: boolean }
  const trail: Step[] = [{ label: portal.name, wide: true }]
  if (group?.label) trail.push({ label: group.label, to: group.items[0]?.to, wide: true })
  // Mục menu là link khi đang ở trang con của nó, hoặc khi còn mắt xích sau nó (bước wizard: không link về chính trang).
  if (item) trail.push({ label: item.label, to: onItemPage ? undefined : item.to })
  if (crumb) trail.push({ label: crumb })

  const title = [trail[trail.length - 1]?.label, portal.name, 'Smart Solar'].filter(Boolean).join(' – ')
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <nav aria-label="Vị trí hiện tại" className="flex h-10 items-center">
      {/* flex-1: giới hạn 45% của các mắt xích trước tính theo cả bề ngang thanh, không theo bề rộng đã co lại. */}
      <ol className="flex min-w-0 flex-1 items-center gap-2 text-meta">
        {trail.map((step, i) => {
          const last = i === trail.length - 1
          return (
            <li
              key={i}
              className={cx(
                'items-center gap-2',
                step.wide && !last ? 'hidden sm:flex' : 'flex',
                last ? 'min-w-0' : 'max-w-[45%] shrink-0 sm:max-w-none',
              )}
            >
              {i > 0 && (
                // Trên điện thoại các mắt xích "wide" phía trước bị ẩn: bỏ luôn dấu "/" đứng đầu.
                <span aria-hidden className={cx('text-fg-3', trail.slice(0, i).every((prev) => prev.wide) && 'hidden sm:inline')}>
                  /
                </span>
              )}
              {/* Mắt xích có `to` luôn là link, kể cả khi đứng cuối (trang chi tiết đang tải hoặc lỗi). */}
              {last && !step.to ? (
                <span aria-current="page" title={step.label} className="truncate font-medium text-fg">
                  {step.label}
                </span>
              ) : step.to ? (
                <Link to={step.to} className="tap min-w-0 text-fg-2 underline-offset-4 hover:text-fg hover:underline">
                  <span className="min-w-0 truncate">{step.label}</span>
                </Link>
              ) : (
                <span className="truncate text-fg-2">{step.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/*
  Khối phiên đăng nhập, ghim ở đáy rail khi rail dài hơn màn hình.
  Tài khoản thật lấy từ AuthProvider; portal đi theo vai trò nên không còn ô "đổi portal".
  Đổi mật khẩu dùng chung hộp thoại với sidebar admin/kỹ thuật viên (POST /api/auth/change-password).
*/
/* Mỗi thao tác tài khoản là một hàng đủ bề ngang: dễ thấy và dễ bấm hơn chữ nhỏ chen chung một dòng. */
const sessionRow =
  'press flex h-11 w-full items-center rounded-control px-3 text-left text-body text-fg-2 hover:bg-surface-2 hover:text-fg lg:h-9'

function SessionBlock({
  onCollapse,
  collapseButtonRef,
}: {
  onCollapse: () => void
  collapseButtonRef: RefObject<HTMLButtonElement | null>
}) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [changingPassword, setChangingPassword] = useState(false)
  const name = user?.name ?? ''
  const role = user ? roleLabels[user.role] : ''

  async function handleSignOut() {
    await signOut()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return (
    <div className="sticky bottom-0 mt-6 bg-canvas pb-4">
      {/* Thu gọn nằm ngay trên khối tài khoản (cùng chỗ với sidebar admin), không chen vào dòng tên portal. */}
      <div className="-mx-3 mb-2 hidden lg:block">
        <button ref={collapseButtonRef} type="button" aria-controls="rail" aria-expanded={true} onClick={onCollapse} className={sessionRow}>
          Thu gọn menu
        </button>
      </div>
      <div className="border-t border-line pt-3">
        <p className="truncate text-body font-medium" title={user?.email}>
          {name}
        </p>
        <p className="text-meta text-fg-2">{role}</p>
        {user && (
          <ul className="-mx-3 mt-2">
            <li>
              <button type="button" onClick={() => setChangingPassword(true)} className={sessionRow}>
                {changePasswordContent.menuLabel}
              </button>
            </li>
            <li>
              <ThemeButton className={sessionRow} />
            </li>
            <li>
              <button type="button" onClick={handleSignOut} className={sessionRow}>
                Đăng xuất
              </button>
            </li>
          </ul>
        )}
      </div>
      <ChangePasswordDialog open={changingPassword} onOpenChange={setChangingPassword} />
    </div>
  )
}

const NEXT: Record<Theme, Theme> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<Theme, string> = { system: 'Tự động', light: 'Sáng', dark: 'Tối' }

function ThemeButton({ className }: { className?: string }) {
  const [theme, setTheme] = useTheme()
  return (
    <button
      type="button"
      onClick={() => setTheme(NEXT[theme])}
      className={className}
      aria-label={`Giao diện: ${LABEL[theme]}. Đổi giao diện`}
    >
      Giao diện: {LABEL[theme]}
    </button>
  )
}
