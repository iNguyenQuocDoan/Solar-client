import { createContext, useContext, useEffect } from 'react'
import { matchPath, useLocation } from 'react-router'
import type { NavItem } from '@/config/portals'

/*
  Mắt xích cuối của thanh định vị (app-shell): tên trang chi tiết (công trình, sản phẩm) hoặc bước đang làm
  của wizard. Trang danh sách không cần đặt; mục menu đang mở đã là vị trí hiện tại.
  Lưu kèm pathname: chuyển trang là một transition, trang cũ gỡ crumb SAU khi trang mới đã vẽ, nên thanh định vị
  chỉ dùng crumb khớp đúng đường dẫn đang mở (không loé tên của trang trước).
*/
export type PageCrumb = { pathname: string; label: string }

export const PageCrumbContext = createContext<(crumb: PageCrumb | null) => void>(() => {})

export function usePageCrumb(label: string | null | undefined) {
  const setCrumb = useContext(PageCrumbContext)
  const { pathname } = useLocation()
  useEffect(() => {
    setCrumb(label ? { pathname, label } : null)
    return () => setCrumb(null)
  }, [label, pathname, setCrumb])
}

/** Mục menu có đang mở không: khớp `to` (theo `end`) hoặc một trong `alsoActiveOn` (trang con nằm ngoài `to`). */
export function isNavItemActive(item: NavItem, pathname: string) {
  if (item.to === '#') return false
  if (matchPath({ path: item.to, end: item.end ?? false }, pathname)) return true
  return item.alsoActiveOn?.some((pattern) => matchPath(pattern, pathname)) ?? false
}

/** Đang ở đúng trang của mục (không phải trang con). */
export function isNavItemPage(item: NavItem, pathname: string) {
  return item.to !== '#' && matchPath({ path: item.to, end: true }, pathname) !== null
}
