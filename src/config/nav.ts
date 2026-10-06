import { ROUTES } from '@/routes/paths'

export type NavItem = {
  label: string
  /** Tên icon Material Symbols Outlined, giữ đúng như code.html */
  icon: string
  href: string
  badge?: number
}

/*
 * Menu chỉ liệt kê màn đã đổ dữ liệu thật từ backend (05/10/2026). Màn mock của admin
 * (Tổng quan, Người dùng, Vai trò & quyền…) và toàn bộ màn technician vẫn giữ trong pages/
 * nhưng ẩn khỏi menu và route; nối API xong thì thêm lại mục ở đây (icon theo code.html).
 */

/** Menu Admin */
export const adminNav: NavItem[] = [{ label: 'Sản phẩm', icon: 'solar_power', href: ROUTES.ADMIN.PRODUCTS }]

/** Menu Technician – chưa có màn nào nối API, chỉ còn trang tổng quan báo chưa có chức năng */
export const technicianNav: NavItem[] = [{ label: 'Tổng quan', icon: 'dashboard', href: ROUTES.TECH.DASHBOARD }]
