import { ROUTES } from '@/routes/paths'

export type PortalKey = 'customer' | 'ops' | 'field' | 'manage'

export type NavItem = { label: string; to: string; end?: boolean; badge?: string }
export type NavGroup = { label?: string; items: NavItem[] }

export type Portal = {
  key: PortalKey
  name: string
  home: string
  groups: NavGroup[]
  support?: NavItem[]
  user: { name: string; role: string }
}

export const PORTALS: Record<PortalKey, Portal> = {
  customer: {
    key: 'customer',
    name: 'Cổng khách hàng',
    home: ROUTES.customer.home,
    user: { name: 'Eleanor Vance', role: 'Nhà Oakwood' },
    groups: [
      {
        label: 'Hành trình điện mặt trời',
        items: [
          { label: 'Tổng quan', to: ROUTES.customer.home, end: true },
          { label: 'Đánh giá sơ bộ', to: ROUTES.customer.assessment },
          { label: 'Yêu cầu tư vấn', to: ROUTES.customer.consultations },
          { label: 'Báo giá', to: ROUTES.customer.quotations },
          { label: 'Dự án của tôi', to: ROUTES.customer.projects },
          { label: 'Bảo hành & bảo trì', to: ROUTES.customer.warranty },
          { label: 'Trợ lý AI', to: ROUTES.customer.assistant },
        ],
      },
    ],
    support: [
      { label: 'Trợ giúp & câu hỏi thường gặp', to: '#' },
      { label: 'Liên hệ tư vấn viên', to: '#' },
    ],
  },
  ops: {
    key: 'ops',
    name: 'Kinh doanh & vận hành',
    home: ROUTES.ops.home,
    user: { name: 'Elena Vance', role: 'Tư vấn viên cấp cao' },
    groups: [
      {
        label: 'Vòng đời dự án',
        items: [
          { label: 'Tổng quan', to: ROUTES.ops.home, end: true },
          { label: 'Tư vấn', to: ROUTES.ops.consultations },
          { label: 'Khách hàng', to: ROUTES.ops.customers },
          { label: 'Khảo sát', to: ROUTES.ops.surveys },
          { label: 'Báo giá', to: ROUTES.ops.quotations },
          { label: 'Hợp đồng', to: ROUTES.ops.contracts },
          { label: 'Dự án', to: ROUTES.ops.projects },
        ],
      },
    ],
    support: [
      { label: 'Thông báo', to: '#', badge: '4' },
      { label: 'Tài khoản & cài đặt', to: '#' },
    ],
  },
  field: {
    key: 'field',
    name: 'Kỹ thuật hiện trường',
    home: ROUTES.field.home,
    user: { name: 'Marcus Vance', role: 'Kỹ thuật viên hiện trường cấp cao' },
    groups: [
      {
        items: [
          { label: 'Tổng quan', to: ROUTES.field.home, end: true },
          { label: 'Việc của tôi', to: ROUTES.field.tasks },
          { label: 'Khảo sát', to: ROUTES.field.surveys },
          { label: 'Lắp đặt', to: ROUTES.field.installations },
          { label: 'Bảo hành & bảo trì', to: ROUTES.field.warranty },
          { label: 'Lịch làm việc', to: ROUTES.field.schedule },
          { label: 'Thông báo', to: ROUTES.field.notifications },
          { label: 'Tài khoản', to: ROUTES.field.profile },
        ],
      },
    ],
  },
  manage: {
    key: 'manage',
    name: 'Quản lý',
    home: ROUTES.manage.home,
    user: { name: 'Jonathan Mercer', role: 'Giám đốc khu vực' },
    groups: [
      {
        label: 'Điều hành',
        items: [
          { label: 'Tổng quan điều hành', to: ROUTES.manage.home, end: true },
          { label: 'Dự án', to: ROUTES.manage.projects },
          { label: 'Duyệt báo giá', to: ROUTES.manage.approvals, badge: '4' },
          { label: 'Vận hành', to: ROUTES.manage.operations },
          { label: 'Báo cáo doanh thu', to: ROUTES.manage.revenue },
        ],
      },
      {
        label: 'Giám sát hệ thống',
        items: [
          { label: 'Cảnh báo', to: ROUTES.manage.alerts, badge: '7' },
          { label: 'Thông báo', to: ROUTES.manage.notifications },
          { label: 'Tài khoản', to: ROUTES.manage.profile },
        ],
      },
    ],
  },
}
