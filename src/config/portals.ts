import { ROUTES } from '@/routes/paths'

export type PortalKey = 'customer' | 'ops' | 'field' | 'manage'

export type NavItem = { label: string; to: string; end?: boolean; badge?: string }
export type NavGroup = { label?: string; items: NavItem[] }

export type Portal = {
  key: PortalKey
  name: string
  home: string
  groups: NavGroup[]
}

/*
  Menu chỉ liệt kê màn đã đổ dữ liệu thật từ backend (quyết định 05/10/2026). Màn còn dùng mock
  (pages/<portal>/*, data/*.ts) vẫn giữ trong code nhưng ẩn khỏi menu và route; nối API xong thì
  thêm lại mục ở đây và route trong routes/protectedRoutes.tsx.
  Portal chưa có màn nào nối API chỉ còn "Tổng quan", trang này báo chưa có chức năng.
*/
export const PORTALS: Record<PortalKey, Portal> = {
  customer: {
    key: 'customer',
    name: 'Cổng khách hàng',
    home: ROUTES.customer.home,
    groups: [
      {
        items: [
          { label: 'Đánh giá sơ bộ', to: ROUTES.customer.assessment },
          { label: 'Sản phẩm', to: ROUTES.customer.products },
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
        items: [
          { label: 'Yêu cầu khảo sát', to: ROUTES.ops.surveys },
          { label: 'Sản phẩm', to: ROUTES.ops.products },
        ],
      },
    ],
  },
  field: {
    key: 'field',
    name: 'Kỹ thuật hiện trường',
    home: ROUTES.field.home,
    groups: [{ items: [{ label: 'Tổng quan', to: ROUTES.field.home, end: true }] }],
  },
  manage: {
    key: 'manage',
    name: 'Quản lý',
    home: ROUTES.manage.home,
    groups: [{ items: [{ label: 'Tổng quan', to: ROUTES.manage.home, end: true }] }],
  },
}
