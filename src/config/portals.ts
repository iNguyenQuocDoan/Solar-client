import { ROUTES } from '@/routes/paths'

export type PortalKey = 'customer' | 'ops' | 'manage' | 'admin' | 'tech'

export type NavItem = {
  label: string
  to: string
  end?: boolean
  badge?: string
  /** Mẫu đường dẫn khác cũng tính là đang ở mục này, khi trang con không nằm dưới `to` (vd. chi tiết yêu cầu thuộc "Của tôi"). */
  alsoActiveOn?: string[]
}
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
  Từ 08/10/2026 mọi portal (kể cả admin và kỹ thuật viên /tech) dùng chung shell của portal kit, và không còn
  trang giữ chỗ "chưa có chức năng": kỹ thuật viên và quản lý chưa có API riêng nên dùng danh mục sản phẩm thật
  (GET /api/products, API công khai duy nhất các vai trò này gọi được). /field gộp về /tech.
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
        label: 'Yêu cầu khảo sát',
        items: [
          { label: 'Chờ nhận', to: ROUTES.ops.surveys, end: true },
          // Backend chỉ trả chi tiết cho sales đã nhận yêu cầu, nên mọi trang chi tiết đều thuộc "Của tôi".
          { label: 'Của tôi', to: ROUTES.ops.surveysMine, alsoActiveOn: [ROUTES.ops.survey] },
        ],
      },
      { items: [{ label: 'Sản phẩm', to: ROUTES.ops.products }] },
    ],
  },
  manage: {
    key: 'manage',
    name: 'Quản lý',
    home: ROUTES.manage.home,
    groups: [{ items: [{ label: 'Sản phẩm', to: ROUTES.manage.products }] }],
  },
  admin: {
    key: 'admin',
    name: 'Quản trị hệ thống',
    home: ROUTES.ADMIN.DASHBOARD,
    groups: [{ items: [{ label: 'Sản phẩm', to: ROUTES.ADMIN.PRODUCTS }] }],
  },
  /* Vai trò kỹ thuật viên đăng nhập vào /tech (homePathForRole). */
  tech: {
    key: 'tech',
    name: 'Kỹ thuật hiện trường',
    home: ROUTES.TECH.DASHBOARD,
    groups: [{ items: [{ label: 'Sản phẩm', to: ROUTES.TECH.PRODUCTS }] }],
  },
}
