/** Người dùng đang đăng nhập + trạng thái hệ thống hiển thị trên shell (mock). */

export const adminSession = {
  user: {
    name: 'Eleanor Sterling',
    title: 'Super Administrator',
    status: 'Active, Super Admin',
    icon: 'account_circle',
  },
  environment: 'PROD - Cluster 01',
  systemStatus: 'Normal Operation',
  unreadNotifications: 3,
  searchPlaceholder: 'Search platform resources, configs, audits, or users...',
}

export const technicianSession = {
  user: {
    name: 'Marcus Vance',
    title: 'Lead Field Specialist #4402',
    icon: 'engineering',
  },
  syncStatus: 'Field Tech Hub, Active Sync',
  location: 'NorCal Zone 4, Service Unit 12',
  telemetry: 'Telemetry Online',
  hasUnreadAlerts: true,
}
