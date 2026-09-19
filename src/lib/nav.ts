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
  { label: 'Admin Dashboard', icon: 'grid_view', href: ROUTES.ADMIN.DASHBOARD },
  { label: 'Users', icon: 'manage_accounts', href: ROUTES.ADMIN.USERS },
  { label: 'Roles & Permissions', icon: 'admin_panel_settings', href: ROUTES.ADMIN.ROLES },
  { label: 'Product Catalogue', icon: 'solar_power', href: ROUTES.ADMIN.PRODUCTS },
  { label: 'Service Catalogue', icon: 'home_repair_service', href: ROUTES.ADMIN.SERVICES },
  { label: 'Categories', icon: 'category', href: ROUTES.ADMIN.CATEGORIES },
  { label: 'AI Knowledge Base', icon: 'smart_toy', href: ROUTES.ADMIN.KNOWLEDGE_BASE },
  { label: 'Technical Configuration', icon: 'tune', href: ROUTES.ADMIN.TECH_CONFIG },
  { label: 'Reports', icon: 'analytics', href: ROUTES.ADMIN.REPORTS },
  { label: 'System Settings', icon: 'settings', href: ROUTES.ADMIN.SETTINGS },
]

/** Menu Technician – thứ tự theo CLAUDE.md, icon theo my_tasks_1/code.html */
export const technicianNav: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', href: ROUTES.TECH.DASHBOARD },
  { label: 'My Tasks', icon: 'assignment_turned_in', href: ROUTES.TECH.TASKS, badge: 8 },
  { label: 'Site Surveys', icon: 'square_foot', href: ROUTES.TECH.SURVEYS },
  { label: 'Installations', icon: 'solar_power', href: ROUTES.TECH.INSTALLATIONS },
  { label: 'Warranty & Maintenance', icon: 'build_circle', href: ROUTES.TECH.WARRANTY },
  { label: 'Schedule', icon: 'calendar_today', href: ROUTES.TECH.SCHEDULE },
]

/** Hai link cuối sidebar technician (Alerts / Settings) */
export const technicianFooterNav: NavItem[] = [
  { label: 'Alerts', icon: 'notifications', href: ROUTES.TECH.ALERTS },
  { label: 'Settings', icon: 'account_circle', href: ROUTES.TECH.SETTINGS },
]
