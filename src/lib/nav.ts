import { ROUTES } from '@/constants/routes'

export type NavItem = {
  label: string
  /** Tên icon Material Symbols Outlined, giữ đúng như code.html */
  icon: string
  href: string
  badge?: number
}

/** Menu Admin – thứ tự theo CLAUDE.md, icon theo admin_dashboard/code.html */
export const adminNav: NavItem[] = [
  { label: 'Tổng quan', icon: 'grid_view', href: ROUTES.ADMIN.DASHBOARD },
  { label: 'Người dùng', icon: 'manage_accounts', href: ROUTES.ADMIN.USERS },
  { label: 'Vai trò & quyền', icon: 'admin_panel_settings', href: ROUTES.ADMIN.ROLES },
  { label: 'Danh mục sản phẩm', icon: 'solar_power', href: ROUTES.ADMIN.PRODUCTS },
  { label: 'Danh mục dịch vụ', icon: 'home_repair_service', href: ROUTES.ADMIN.SERVICES },
  { label: 'Nhóm hàng', icon: 'category', href: ROUTES.ADMIN.CATEGORIES },
  { label: 'Kho tri thức AI', icon: 'smart_toy', href: ROUTES.ADMIN.KNOWLEDGE_BASE },
  { label: 'Cấu hình kỹ thuật', icon: 'tune', href: ROUTES.ADMIN.TECH_CONFIG },
  { label: 'Báo cáo', icon: 'analytics', href: ROUTES.ADMIN.REPORTS },
  { label: 'Cài đặt hệ thống', icon: 'settings', href: ROUTES.ADMIN.SETTINGS },
]

/** Menu Technician – thứ tự theo CLAUDE.md, icon theo my_tasks_1/code.html */
export const technicianNav: NavItem[] = [
  { label: 'Tổng quan', icon: 'dashboard', href: ROUTES.TECH.DASHBOARD },
  { label: 'Việc của tôi', icon: 'assignment_turned_in', href: ROUTES.TECH.TASKS, badge: 8 },
  { label: 'Khảo sát', icon: 'square_foot', href: ROUTES.TECH.SURVEYS },
  { label: 'Lắp đặt', icon: 'solar_power', href: ROUTES.TECH.INSTALLATIONS },
  { label: 'Bảo hành & bảo trì', icon: 'build_circle', href: ROUTES.TECH.WARRANTY },
  { label: 'Lịch làm việc', icon: 'calendar_today', href: ROUTES.TECH.SCHEDULE },
]

/** Hai link cuối sidebar technician (Alerts / Settings) */
export const technicianFooterNav: NavItem[] = [
  { label: 'Cảnh báo', icon: 'notifications', href: ROUTES.TECH.ALERTS },
  { label: 'Tài khoản', icon: 'account_circle', href: ROUTES.TECH.SETTINGS },
]

/**
 * Menu header trang công khai (landing_home). `href` là anchor trong trang chủ,
 * PublicLayout cuộn mượt tới section tương ứng.
 */
export type PublicNavItem = { label: string; hash: string }

export const publicNav: PublicNavItem[] = [
  { label: 'Trang chủ', hash: '#top' },
  { label: 'Giải pháp', hash: '#solutions' },
  { label: 'Sản phẩm', hash: '#products' },
  { label: 'Quy trình', hash: '#process' },
  { label: 'Bảo hành & Bảo trì', hash: '#after-sales' },
  { label: 'Về chúng tôi', hash: '#about' },
]
