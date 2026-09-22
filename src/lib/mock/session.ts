/** Người dùng đang đăng nhập + trạng thái hệ thống hiển thị trên shell (mock). */

export const adminSession = {
  user: {
    name: 'Eleanor Sterling',
    title: 'Quản trị viên hệ thống',
    status: 'Đang hoạt động, quản trị viên',
    icon: 'account_circle',
  },
  environment: 'PROD, cụm 01',
  systemStatus: 'Hoạt động bình thường',
  unreadNotifications: 3,
  searchPlaceholder: 'Tìm người dùng, sản phẩm, cấu hình, nhật ký…',
}

export const technicianSession = {
  user: {
    name: 'Marcus Vance',
    title: 'Kỹ thuật viên trưởng #4402',
    icon: 'engineering',
  },
  syncStatus: 'Đang đồng bộ với trung tâm điều phối',
  location: 'Khu vực 4, tổ kỹ thuật 12',
  telemetry: 'Dữ liệu giám sát trực tuyến',
  hasUnreadAlerts: true,
}
