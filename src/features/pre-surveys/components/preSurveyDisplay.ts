import type { Tone } from '@/components/common/ui/badge'
import type { CustomerType, InstallationSurfaceType } from '@/types/req/customersReq'
import type { SurveyRequestStatus } from '@/types/res/surveyRequestsRes'

// Nhãn và định dạng dùng chung cho khách hàng và sales
// Swagger chỉ có số của enum, tên lấy từ SmartSolar.Modules.PreSurvey.Enums của backend

export const CUSTOMER_TYPES = [
  { value: 1, label: 'Cá nhân' },
  { value: 2, label: 'Doanh nghiệp' },
] as const satisfies readonly { value: CustomerType; label: string }[]

export const SURFACE_TYPES = [
  { value: 1, label: 'Mái nhà', hint: 'Mái tôn, mái ngói, sân thượng' },
  { value: 2, label: 'Mặt đất', hint: 'Khoảng đất trống trong khuôn viên' },
  { value: 3, label: 'Mái che bãi xe', hint: 'Khung che chỗ đậu ô tô, xe máy' },
  { value: 4, label: 'Mặt dựng', hint: 'Tường đứng hoặc mặt ngoài toà nhà' },
  { value: 5, label: 'Khác', hint: 'Ghi rõ ở phần ghi chú' },
] as const satisfies readonly { value: InstallationSurfaceType; label: string; hint: string }[]

// 8 hướng la bàn, xếp theo lưới 3x3 của bộ chọn (null là ô giữa)
export const COMPASS_GRID = [
  { label: 'Tây Bắc', degree: 315 },
  { label: 'Bắc', degree: 0 },
  { label: 'Đông Bắc', degree: 45 },
  { label: 'Tây', degree: 270 },
  null,
  { label: 'Đông', degree: 90 },
  { label: 'Tây Nam', degree: 225 },
  { label: 'Nam', degree: 180 },
  { label: 'Đông Nam', degree: 135 },
] as const

const DIRECTIONS = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc']

/** Ví dụ 185 độ là "Nam" */
export function directionLabel(degree: number | null | undefined) {
  if (degree == null) return '—'
  const normalized = ((degree % 360) + 360) % 360
  return DIRECTIONS[Math.round(normalized / 45) % 8]!
}

export function customerTypeLabel(value: number | null | undefined) {
  return CUSTOMER_TYPES.find((t) => t.value === value)?.label ?? (value == null ? '—' : `Loại ${value}`)
}

export function surfaceTypeLabel(value: number | null | undefined) {
  return SURFACE_TYPES.find((t) => t.value === value)?.label ?? (value == null ? '—' : `Loại ${value}`)
}

// "Chờ nhận" tô đỏ vì cần người nhận
const STATUS_META: Record<SurveyRequestStatus, { label: string; tone: Tone }> = {
  1: { label: 'Chờ nhận', tone: 'danger' },
  2: { label: 'Đã nhận', tone: 'info' },
  3: { label: 'Đang xem xét', tone: 'info' },
  4: { label: 'Đã hẹn khảo sát', tone: 'ok' },
  5: { label: 'Hoàn tất', tone: 'neutral' },
  6: { label: 'Đã huỷ', tone: 'neutral' },
}

/** (0, 0) là giá trị mặc định khi bỏ trống, không phải vị trí thật */
export function hasCoordinates(latitude: number | null | undefined, longitude: number | null | undefined) {
  return latitude != null && longitude != null && !(latitude === 0 && longitude === 0)
}

// Khung toạ độ gần đúng của TP.HCM (gồm đất liền và Côn Đảo), chỉ dùng để cảnh báo nhập nhầm
const HCM_BOXES = [
  { latMin: 10.3, latMax: 11.6, lonMin: 106.3, lonMax: 107.65 },
  { latMin: 8.5, latMax: 8.9, lonMin: 106.4, lonMax: 106.8 },
]

export function isInHcm(latitude: number, longitude: number) {
  return HCM_BOXES.some(
    (b) => latitude >= b.latMin && latitude <= b.latMax && longitude >= b.lonMin && longitude <= b.lonMax,
  )
}

export const HCM_COORDINATE_HINT = 'vĩ độ (số đầu) khoảng 10.3 đến 11.6, kinh độ (số sau) khoảng 106.3 đến 107.6'

/** Dùng dấu chấm như Google Maps, tránh nhầm với dấu phẩy ngăn cách */
export function formatCoordinates(latitude: number, longitude: number) {
  const part = (v: number) => String(Number(v.toFixed(5)))
  return `${part(latitude)}, ${part(longitude)}`
}

export function mapsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`
}

/** Đã nhận nhưng chưa phân công kỹ thuật viên */
export function needsScheduling(status: number | null | undefined) {
  return status === 2 || status === 3
}

export function surveyStatusMeta(status: number | null | undefined): { label: string; tone: Tone } {
  return (
    STATUS_META[status as SurveyRequestStatus] ?? {
      label: status == null ? '—' : `Trạng thái ${status}`,
      tone: 'neutral',
    }
  )
}

const decimal = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })
// Luôn hiển thị theo giờ Việt Nam
const dateTime = new Intl.DateTimeFormat('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatArea(value: number | null | undefined) {
  return value == null ? '—' : `${decimal.format(value)} m²`
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return '—'
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateTime.format(date)
}

const relative = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' })
const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** "vừa xong", "35 phút trước", "hôm qua"...; quá 30 ngày thì in ngày giờ */
export function formatRelative(iso: string | null | undefined, now = Date.now()) {
  if (!iso) return '—'
  const time = new Date(iso).getTime()
  if (Number.isNaN(time)) return '—'
  const diff = time - now
  const abs = Math.abs(diff)
  let text: string
  if (abs < MINUTE) text = 'vừa xong'
  else if (abs < HOUR) text = relative.format(Math.round(diff / MINUTE), 'minute')
  else if (abs < DAY) text = relative.format(Math.round(diff / HOUR), 'hour')
  else if (abs < 30 * DAY) text = relative.format(Math.round(diff / DAY), 'day')
  else return formatDateTime(iso)
  // Intl viết hoa "Hôm qua", đổi về chữ thường
  return text.charAt(0).toLowerCase() + text.slice(1)
}

export function isOverdue(iso: string | null | undefined, now = Date.now()) {
  if (!iso) return false
  const time = new Date(iso).getTime()
  return !Number.isNaN(time) && now - time > DAY
}

export function formatAddress(parts: {
  streetLine?: string | null
  ward?: string | null
  district?: string | null
  province?: string | null
}) {
  const text = [parts.streetLine, parts.ward, parts.district, parts.province]
    .map((p) => p?.trim())
    .filter(Boolean)
    .join(', ')
  return text || '—'
}

/** 8 ký tự đầu của GUID, dễ đọc qua điện thoại */
export function shortCode(id: string | null | undefined) {
  return id ? id.slice(0, 8).toUpperCase() : '—'
}
