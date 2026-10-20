import { ROUTES } from '@/routes/paths'

export type PortalKey = 'customer' | 'ops' | 'manage' | 'admin' | 'tech'

export type NavItem = {
  label: string
  to: string
  /** Icon Material Symbols, còn thấy khi rail thu gọn */
  icon: string
  end?: boolean
  badge?: string
  /** Đường dẫn khác cũng tính là đang ở mục này */
  alsoActiveOn?: string[]
}
export type NavGroup = { label?: string; items: NavItem[] }

export type Portal = {
  key: PortalKey
  name: string
  home: string
  groups: NavGroup[]
}

// Menu chỉ có màn đã dùng dữ liệu thật. Màn mock vẫn giữ code nhưng ẩn khỏi menu và route
// Nối API xong thì thêm mục ở đây và route trong routes/protectedRoutes.tsx
export const PORTALS: Record<PortalKey, Portal> = {
  customer: {
    key: 'customer',
    name: 'Cổng khách hàng',
    home: ROUTES.customer.home,
    groups: [
      {
        items: [
          { label: 'Đánh giá sơ bộ', to: ROUTES.customer.assessment, icon: 'fact_check' },
          { label: 'Yêu cầu khảo sát', to: ROUTES.customer.requests, icon: 'event_available' },
          { label: 'Sản phẩm', to: ROUTES.customer.products, icon: 'solar_power' },
        ],
      },
    ],
  },
  ops: {
    key: 'ops',
    name: 'Kinh doanh & vận hành',
    home: ROUTES.ops.home,
    groups: [
      {
        label: 'Yêu cầu khảo sát',
        items: [
          { label: 'Chờ nhận', to: ROUTES.ops.surveys, icon: 'move_to_inbox', end: true },
          // Backend chỉ trả chi tiết cho sales đã nhận yêu cầu, nên trang chi tiết thuộc "Của tôi"
          { label: 'Của tôi', to: ROUTES.ops.surveysMine, icon: 'assignment_ind', alsoActiveOn: [ROUTES.ops.survey] },
        ],
      },
      { items: [{ label: 'Sản phẩm', to: ROUTES.ops.products, icon: 'solar_power' }] },
    ],
  },
  manage: {
    key: 'manage',
    name: 'Quản lý',
    home: ROUTES.manage.home,
    groups: [
      {
        items: [
          { label: 'Kỹ thuật viên', to: ROUTES.manage.technicians, icon: 'engineering' },
          { label: 'Sản phẩm', to: ROUTES.manage.products, icon: 'solar_power' },
        ],
      },
    ],
  },
  admin: {
    key: 'admin',
    name: 'Quản trị hệ thống',
    home: ROUTES.ADMIN.DASHBOARD,
    groups: [
      {
        items: [
          { label: 'Sản phẩm', to: ROUTES.ADMIN.PRODUCTS, icon: 'solar_power' },
          { label: 'Tài khoản', to: ROUTES.ADMIN.USERS, icon: 'manage_accounts' },
          { label: 'Kỹ thuật viên', to: ROUTES.ADMIN.TECHNICIANS, icon: 'engineering' },
        ],
      },
    ],
  },
  /* Vai trò kỹ thuật viên đăng nhập vào /tech (homePathForRole). */
  tech: {
    key: 'tech',
    name: 'Kỹ thuật hiện trường',
    home: ROUTES.TECH.DASHBOARD,
    groups: [
      {
        items: [
          { label: 'Việc của tôi', to: ROUTES.TECH.JOBS, icon: 'assignment' },
          { label: 'Lịch làm việc', to: ROUTES.TECH.SCHEDULE, icon: 'calendar_month' },
          { label: 'Sản phẩm', to: ROUTES.TECH.PRODUCTS, icon: 'solar_power' },
        ],
      },
    ],
  },
}
