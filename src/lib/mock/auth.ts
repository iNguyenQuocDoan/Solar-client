/*
 * Nội dung các màn xác thực – lấy nguyên văn tiếng Việt từ
 * design/stitch/stitch_smart_solar_customer_portal/auth_portal/code.html.
 */

/** Panel xanh bên trái của AuthLayout */
export const authPanel = {
  badge: 'Nền tảng Quản trị Năng lượng Mặt trời Tự động',
  title: 'Chuyển dịch Năng lượng Xanh cho Ngôi nhà Việt',
  description:
    'Theo dõi tiến trình hồ sơ thiết kế, tiến độ thi công áp mái, công suất phát điện trực quan và bảo hành linh kiện chính hãng tại một nơi duy nhất.',
  image: {
    src: '/placeholders/villa-solar.svg',
    alt: 'Biệt thự có mái lắp tấm pin mặt trời dưới nắng sớm, sân vườn xanh mát',
  },
  systemBadge: 'Hệ thống 8.4 kWp, Đang hòa lưới',
  metrics: [
    { label: 'Hiệu suất tháng', value: '1,240 kWh', tone: 'text-tertiary-fixed' },
    { label: 'Tiết kiệm điện', value: '~3.85 Tr ₫', tone: 'text-secondary-fixed' },
  ],
  roleLegendTitle: 'Phân quyền tự động theo vai trò',
  roles: ['Khách hàng', 'Kỹ thuật viên', 'Kinh doanh', 'Quản lý', 'Quản trị viên'],
  footer: {
    badges: [
      { icon: 'verified_user', text: 'Mã hóa dữ liệu chuẩn AES-256' },
      { icon: 'cloud_done', text: 'Tự động sao lưu tiến độ' },
    ],
    copyright: '© 2025 Smart Solar Energy Hub. All rights reserved. Hotline kỹ thuật: 1900 6868.',
  },
} as const

/** /login */
export const loginContent = {
  badge: 'Cổng đăng nhập',
  tls: 'Đã kiểm tra bảo mật TLS 1.3',
  title: 'Chào mừng trở lại với Smart Solar',
  descriptionBefore: 'Hệ thống tự động chuyển hướng đúng quyền hạn (',
  descriptionRoles: 'Khách hàng, Kỹ thuật viên, Kinh doanh, Quản lý, Quản trị viên',
  descriptionAfter: ') sau khi đăng nhập.',
  emailLabel: 'Địa chỉ Email',
  emailPlaceholder: 'ten.ban@gmail.com',
  emailHelp: 'Sử dụng email cá nhân hoặc email doanh nghiệp được cấp.',
  emailValid: 'Email hợp lệ',
  passwordLabel: 'Mật khẩu',
  passwordPlaceholder: '••••••••',
  forgotLink: 'Quên mật khẩu?',
  remember: 'Ghi nhớ đăng nhập trên thiết bị này',
  submit: 'Đăng nhập',
  submitting: 'Đang đăng nhập...',
  errorTitle: 'Lỗi xác thực thông tin',
  errorMessage: 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.',
  notVerifiedLink: 'Tài khoản chưa xác thực email? Sang trang xác thực',
  quickTitle: 'Thử nhanh theo các vai trò:',
  expiredLabel: 'Hết hạn phiên',
  expiredHint: 'Xem pop-up modal',
  noAccount: 'Chưa có tài khoản? ',
  registerLink: 'Đăng ký ngay',
  toastSuccess: 'Thao tác thành công',
} as const

/** /register */
export const registerContent = {
  badge: 'Tạo hồ sơ mới',
  title: 'Đăng ký tài khoản Khách hàng',
  description:
    'Dành cho chủ hộ gia đình quản lý hồ sơ khảo sát, tiến độ thi công và bảo hành điện mặt trời.',
  nameLabel: 'Họ và tên',
  namePlaceholder: 'Nguyễn Văn A',
  emailLabel: 'Địa chỉ Email',
  emailPlaceholder: 'nguyen.a@gmail.com',
  phoneLabel: 'Số điện thoại',
  phonePlaceholder: '0912 xxx xxx',
  passwordLabel: 'Mật khẩu mới',
  confirmLabel: 'Xác nhận mật khẩu',
  passwordPlaceholder: '••••••••',
  rulesTitle: 'Quy chuẩn an toàn mật khẩu:',
  termsBefore: 'Tôi đồng ý với ',
  termsLink: 'Điều khoản sử dụng',
  termsMiddle: ' và ',
  privacyLink: 'Chính sách bảo mật',
  termsAfter: ' của Smart Solar.',
  submit: 'Tạo tài khoản',
  submitting: 'Đang tạo tài khoản...',
  hasAccount: 'Đã có tài khoản? ',
  loginLink: 'Đăng nhập',
  toastSuccess: 'Thao tác thành công',
} as const

/** /forgot-password */
export const forgotContent = {
  badge: 'Khôi phục quyền truy cập',
  title: 'Quên mật khẩu?',
  description: 'Nhập địa chỉ email đăng ký để nhận liên kết khôi phục mật khẩu bảo mật.',
  emailLabel: 'Địa chỉ Email đã đăng ký',
  emailPlaceholder: 'ten.ban@gmail.com',
  notice:
    'Nếu email này được đăng ký trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu trong hộp thư đến.',
  submit: 'Gửi hướng dẫn',
  submitting: 'Đang gửi...',
  cancel: 'Hủy',
  toastSuccess: 'Thao tác thành công',
} as const

/** /reset-password */
export const resetContent = {
  eyebrow: 'Bước tiếp theo: Cập nhật mật khẩu',
  tokenValid: 'Mã token hợp lệ',
  tokenInvalid: 'Thiếu mã token',
  title: 'Đặt lại mật khẩu mới',
  passwordLabel: 'Mật khẩu mới',
  passwordPlaceholder: 'Nhập mật khẩu mới',
  confirmLabel: 'Xác nhận mật khẩu',
  confirmPlaceholder: 'Nhập lại mật khẩu mới',
  submit: 'Đặt lại mật khẩu',
  submitting: 'Đang cập nhật...',
  missingToken: 'Liên kết đặt lại mật khẩu thiếu mã token hoặc không hợp lệ.',
  failedMessage: 'Liên kết đã hết hạn hoặc không còn đúng.',
  requestNewLink: 'Gửi lại liên kết',
  success: 'Mật khẩu của bạn đã được cập nhật thành công. Đang chuyển hướng...',
  toastSuccess: 'Thao tác thành công',
} as const

/** /verify-email */
export const verifyContent = {
  title: 'Xác minh email của bạn',
  description: 'Chúng tôi đã gửi một thư liên kết kích hoạt tài khoản an toàn đến hòm thư:',
  unknownEmail: 'email bạn đã đăng ký',
  missingEmail: 'Không xác định được email để gửi lại. Vui lòng đăng nhập hoặc đăng ký lại.',
  verifyingTitle: 'Đang xác minh email…',
  verifyingHint: 'Vui lòng chờ trong giây lát.',
  successTitle: 'Email đã được xác minh',
  successHint: 'Tài khoản của bạn đã sẵn sàng. Đăng nhập để bắt đầu sử dụng Smart Solar.',
  goToLogin: 'Đăng nhập ngay',
  failedTitle: 'Liên kết xác minh không hợp lệ',
  failedMessage: 'Liên kết đã hết hạn hoặc không còn đúng. Hãy gửi lại email xác minh.',
  hint: 'Vui lòng kiểm tra hộp thư đến (hoặc thư mục Spam) và nhấp vào nút "Kích hoạt tài khoản" trong vòng 24 giờ.',
  resend: 'Gửi lại email xác minh',
  /** Nhãn lúc đang đếm ngược, %s là số giây còn lại */
  resendCountdown: 'Gửi lại sau %s giây',
  backToLogin: 'Quay lại đăng nhập',
  wrongEmail: 'Sai email đăng ký? ',
  registerAgain: 'Đăng ký lại với email khác',
  resendSeconds: 60,
  toastSuccess: 'Thao tác thành công',
} as const

/** /403 */
export const forbiddenContent = {
  title: 'Truy cập không được phép (403 Forbidden)',
  descriptionBefore: 'Tài khoản của bạn (',
  descriptionAfter:
    ') không có quyền truy cập vào bảng phân bổ vật tư kỹ thuật hoặc phê duyệt hợp đồng thương mại.',
  guestLabel: 'Khách',
  switchAccount: 'Đổi tài khoản khác',
  hotline: 'Liên hệ Hotline hỗ trợ: 1900 6868',
  requiredPrefix: 'Cần quyền ',
} as const

/** Dialog "Đổi mật khẩu" mở từ khối user ở Sidebar */
export const changePasswordContent = {
  title: 'Đổi mật khẩu',
  description: 'Nhập mật khẩu hiện tại và mật khẩu mới theo quy chuẩn an toàn bên dưới.',
  currentLabel: 'Mật khẩu hiện tại',
  newLabel: 'Mật khẩu mới',
  confirmLabel: 'Xác nhận mật khẩu mới',
  placeholder: '••••••••',
  submit: 'Đổi mật khẩu',
  submitting: 'Đang cập nhật...',
  cancel: 'Hủy',
  success: 'Đã đổi mật khẩu thành công.',
  successRelogin: 'Đã đổi mật khẩu. Vui lòng đăng nhập lại.',
  menuLabel: 'Đổi mật khẩu',
} as const

/** Modal hết hạn phiên */
export const sessionExpiredContent = {
  title: 'Phiên đăng nhập đã hết hạn',
  description:
    'Vì lý do an toàn cho hồ sơ khảo sát điện mặt trời và dữ liệu thiết bị của bạn, phiên làm việc đã kết thúc. Vui lòng đăng nhập lại để tiếp tục sử dụng Smart Solar.',
  primary: 'Đăng nhập lại',
  secondary: 'Đóng và xem trang chủ',
} as const

/** 4 quy tắc mật khẩu trong PasswordRules */
export const passwordRules = [
  { id: 'length', label: 'Tối thiểu 8 ký tự', test: (value: string) => value.length >= 8 },
  { id: 'upper', label: 'Ít nhất 1 chữ in hoa (A-Z)', test: (value: string) => /[A-Z]/.test(value) },
  { id: 'number', label: 'Có ít nhất 1 chữ số (0-9)', test: (value: string) => /\d/.test(value) },
  {
    id: 'special',
    label: 'Có ký tự đặc biệt (@, #, $...)',
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
] as const

/** Mật khẩu hợp lệ khi thỏa cả 4 quy tắc – dùng chung cho zod schema. */
export function isStrongPassword(value: string) {
  return passwordRules.every((rule) => rule.test(value))
}
