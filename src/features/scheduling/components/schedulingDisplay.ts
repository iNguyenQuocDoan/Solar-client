import type { Tone } from '@/components/common/ui/badge'
import { errorMessage, isApiError } from '@/services/api/errors'
import type { ConflictingAppointmentView } from '@/types/res/adminTechniciansRes'
import type { CustomerSurveyRequestView } from '@/types/res/customerSurveyRequestsRes'
import type { TravelCongestionView } from '@/types/res/technicianAvailabilityRes'

// Nhãn và định dạng của lịch khảo sát, dùng chung cho mọi vai trò
// Luôn dùng giờ Việt Nam: ngày gửi API là "YYYY-MM-DD", giờ hẹn kèm "+07:00"
// Không dùng `new Date('2026-10-20')` vì nó hiểu là nửa đêm UTC

export const VN_TIME_ZONE = 'Asia/Ho_Chi_Minh'
const VN_OFFSET = '+07:00'

const dayKeyFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: VN_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const timeFormat = new Intl.DateTimeFormat('vi-VN', {
  timeZone: VN_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const WEEKDAYS = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
const WEEKDAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function toDate(value: string | Date) {
  const date = typeof value === 'string' ? new Date(value) : value
  return Number.isNaN(date.getTime()) ? null : date
}

/** Ngày (YYYY-MM-DD) theo giờ Việt Nam của một thời điểm. */
export function vnDate(value: string | Date) {
  const date = toDate(value)
  return date ? dayKeyFormat.format(date) : ''
}

export function todayVn(now: Date = new Date()) {
  return dayKeyFormat.format(now)
}

/** Cộng ngày trên chuỗi ngày; tính ở 12:00 UTC nên không lệch ngày vì múi giờ. */
export function addDays(date: string, days: number) {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function parts(date: string) {
  const d = new Date(`${date}T12:00:00Z`)
  return { weekday: d.getUTCDay(), day: d.getUTCDate(), month: d.getUTCMonth() + 1, year: d.getUTCFullYear() }
}

const pad = (n: number) => String(n).padStart(2, '0')

/** "Thứ Ba, 20/10" (kèm năm khi `year`). */
export function formatDay(date: string, { year = false }: { year?: boolean } = {}) {
  if (!date) return '—'
  const p = parts(date)
  return `${WEEKDAYS[p.weekday]}, ${pad(p.day)}/${pad(p.month)}${year ? `/${p.year}` : ''}`
}

/** Ô ngày của bộ chọn: "T3" và "20/10". */
export function dayChip(date: string) {
  const p = parts(date)
  return { weekday: WEEKDAYS_SHORT[p.weekday]!, date: `${pad(p.day)}/${pad(p.month)}`, isSunday: p.weekday === 0 }
}

/** "Hôm nay", "Ngày mai", hoặc "Thứ Ba, 20/10". */
export function relativeDay(date: string, today = todayVn()) {
  if (date === today) return 'Hôm nay'
  if (date === addDays(today, 1)) return 'Ngày mai'
  return formatDay(date)
}

/** "08:00" theo giờ Việt Nam. */
export function formatTime(iso: string | null | undefined) {
  const date = iso ? toDate(iso) : null
  return date ? timeFormat.format(date) : '—'
}

/** "08:00-09:30" */
export function formatTimeRange(startIso: string, endIso: string) {
  return `${formatTime(startIso)}–${formatTime(endIso)}`
}

/** "Thứ Ba, 20/10/2026, 08:00-09:30" */
export function formatAppointment(startIso: string, endIso: string) {
  return `${formatDay(vnDate(startIso), { year: true })}, ${formatTimeRange(startIso, endIso)}`
}

/** "20/10/2026 08:00" theo giờ Việt Nam. */
export function formatMoment(iso: string | null | undefined) {
  const date = iso ? toDate(iso) : null
  if (!date) return '—'
  const p = parts(vnDate(date))
  return `${pad(p.day)}/${pad(p.month)}/${p.year} ${timeFormat.format(date)}`
}

/** Giờ hẹn gửi API: "2026-10-20T08:00:00+07:00". */
export function vnTimestamp(date: string, time: string) {
  return `${date}T${time}:00${VN_OFFSET}`
}

/** Giới hạn đặt trước của backend: 30 ngày kể cả hôm nay */
export const BOOKING_HORIZON_DAYS = 30

/** Ngày mở sẵn: hôm nay, nhưng qua 15:30 thì mở ngày mai vì hôm nay gần như hết giờ trống */
export function initialBookingDate(now: Date = new Date()) {
  const today = todayVn(now)
  return timeFormat.format(now) >= '15:30' ? addDays(today, 1) : today
}

type Viewer = 'customer' | 'sales' | 'technician' | 'staff'

const APPOINTMENT_LABELS: Record<string, string> = {
  BOOKED: 'Đã đặt giờ, chờ phân công',
  ASSIGNED: 'Đã phân công',
  ACKNOWLEDGED: 'Kỹ thuật viên đã nhận việc',
  CANCELLED: 'Đã huỷ',
}

// Đỏ là việc người xem phải làm: sales thấy BOOKED (cần phân công), kỹ thuật viên thấy ASSIGNED (cần nhận việc)
const APPOINTMENT_TONES: Record<Viewer, Record<string, Tone>> = {
  customer: { BOOKED: 'info', ASSIGNED: 'ok', ACKNOWLEDGED: 'ok', CANCELLED: 'neutral' },
  sales: { BOOKED: 'danger', ASSIGNED: 'info', ACKNOWLEDGED: 'ok', CANCELLED: 'neutral' },
  technician: { BOOKED: 'neutral', ASSIGNED: 'danger', ACKNOWLEDGED: 'ok', CANCELLED: 'neutral' },
  staff: { BOOKED: 'info', ASSIGNED: 'info', ACKNOWLEDGED: 'ok', CANCELLED: 'neutral' },
}

export function appointmentStatusMeta(
  status: string | null | undefined,
  viewer: Viewer,
): { label: string; tone: Tone } {
  if (!status) return { label: '—', tone: 'neutral' }
  return {
    label:
      viewer === 'technician' && status === 'ASSIGNED' ? 'Chờ bạn nhận việc' : (APPOINTMENT_LABELS[status] ?? status),
    tone: APPOINTMENT_TONES[viewer][status] ?? 'neutral',
  }
}

/** Trạng thái của một lần đặt trong lịch sử (khách hàng). */
export function historyStatusLabel(status: string) {
  return status === 'CANCELLED' ? 'Đã huỷ hoặc đổi giờ' : (APPOINTMENT_LABELS[status] ?? status)
}

// Gộp trạng thái yêu cầu + lịch hẹn thành một nhãn. Chưa đặt giờ là việc của khách nên tô đỏ
export function customerProgress(r: Pick<CustomerSurveyRequestView, 'status' | 'appointment'>): {
  label: string
  tone: Tone
} {
  if (r.status === 'COMPLETED') return { label: 'Đã khảo sát xong', tone: 'neutral' }
  if (r.status === 'CANCELLED') return { label: 'Đã huỷ', tone: 'neutral' }
  const a = r.appointment
  if (!a)
    return canBook(r)
      ? { label: 'Chưa đặt giờ khảo sát', tone: 'danger' }
      : { label: 'Chưa có lịch hẹn', tone: 'neutral' }
  return appointmentStatusMeta(a.status, 'customer')
}

/** Khách đặt giờ được khi yêu cầu chưa có lịch hiệu lực */
export function canBook(r: Pick<CustomerSurveyRequestView, 'status' | 'appointment'>) {
  return !r.appointment && (r.status === 'PENDING' || r.status === 'ASSIGNED')
}

const decimal = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })

/** "850 m", "12,3 km" */
export function formatDistance(meters: number | null | undefined) {
  if (meters == null) return '—'
  return meters < 1000 ? `${Math.round(meters)} m` : `${decimal.format(meters / 1000)} km`
}

/** "25 phút", "1 giờ 5 phút" (làm tròn lên phút). */
export function formatDuration(seconds: number | null | undefined) {
  if (seconds == null) return '—'
  const minutes = Math.ceil(seconds / 60)
  if (minutes < 60) return `${minutes} phút`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} giờ ${m} phút` : `${h} giờ`
}

export function originLabel(kind: string) {
  return kind === 'BASE' ? 'Từ nơi xuất phát' : kind === 'APPOINTMENT' ? 'Từ công trình trước' : kind
}

/** Kết quả gọi Vietmap của một chặng (RouteCalculationStatuses). */
const ROUTE_CALCULATION: Record<string, string> = {
  OK: 'Đã tính',
  ROUTE_NOT_FOUND: 'Không tìm được đường đi',
  QUOTA_EXCEEDED: 'Hết lượt tính của Vietmap',
  RATE_LIMITED: 'Vietmap đang giới hạn số lượt',
  TIMEOUT: 'Vietmap không phản hồi kịp',
  PROVIDER_UNAVAILABLE: 'Vietmap đang lỗi',
  INVALID_RESPONSE: 'Vietmap trả dữ liệu không đọc được',
  REJECTED_REQUEST: 'Vietmap từ chối yêu cầu',
  PROVIDER_DISABLED: 'Chưa bật dịch vụ tính đường đi',
  BUDGET_EXHAUSTED: 'Quá số lượt tính cho một thao tác',
}

export function routeCalculationLabel(status: string) {
  return ROUTE_CALCULATION[status] ?? status
}

// Trạng thái chặng đường. Chỉ OK mới là số liệu hiện tại
const SCHEDULE_ROUTING: Record<string, { label: string; tone: Tone }> = {
  OK: { label: 'Đường đi đã kiểm tra', tone: 'ok' },
  PENDING_RECALCULATION: { label: 'Đang tính lại đường đi', tone: 'info' },
  STALE: { label: 'Đường đi cũ, cần tính lại', tone: 'warn' },
  FAILED: { label: 'Không tính được đường đi', tone: 'warn' },
  MISSING: { label: 'Chưa có ước tính đường đi', tone: 'warn' },
}

export function scheduleRoutingMeta(status: string): { label: string; tone: Tone } {
  return SCHEDULE_ROUTING[status] ?? { label: status, tone: 'neutral' }
}

/** Không có dữ liệu thì nói không có, không bao giờ suy ra "thông thoáng". */
export function congestionText(c: TravelCongestionView | null | undefined) {
  if (!c || c.status !== 'AVAILABLE') return 'Không có dữ liệu giao thông'
  const heavy = c.heavyOrWorseMeters ?? 0
  return heavy > 0 ? `Kẹt xe nặng khoảng ${formatDistance(heavy)} trên đường` : 'Vietmap không ghi nhận đoạn kẹt nặng'
}

const FEASIBILITY: Record<string, string> = {
  BASE_LOCATION_MISSING: 'chưa có nơi xuất phát',
  APPOINTMENT_LOCATION_MISSING: 'công trình chưa có toạ độ',
  TECHNICIAN_UNAVAILABLE_PERIOD: 'đang trong lịch nghỉ',
  DAILY_LIMIT_REACHED: 'đã đủ số lịch trong ngày',
  OVERLAPPING_APPOINTMENT: 'trùng giờ với lịch khác',
  CANNOT_ARRIVE_IN_TIME: 'không kịp tới công trình',
  LATE_FOR_NEXT_APPOINTMENT: 'sẽ trễ lịch kế tiếp',
  DEPARTURE_IN_PAST: 'giờ phải xuất phát đã qua',
  ROUTE_NOT_VERIFIED: 'chưa kiểm tra được đường đi',
  OUTSIDE_WORKING_HOURS: 'ngoài giờ làm',
  BEFORE_EARLIEST_BASE_DEPARTURE: 'phải rời nơi xuất phát sớm hơn giờ cho phép',
  SCHEDULING_DISABLED: 'kỹ thuật viên bị tắt nhận lịch',
}

export function feasibilityLabel(code: string) {
  return FEASIBILITY[code] ?? code
}

/** Lấy mã lý do trong câu gốc của server, vd. "...cannot take this appointment (DAILY_LIMIT_REACHED)." thành "đã đủ số lịch trong ngày" */
export function reasonFromServerMessage(message: string | null | undefined) {
  const code = message?.match(/\(([A-Z_]{4,})\)/)?.[1]
  return code ? feasibilityLabel(code) : null
}

/** Danh sách lịch bị ảnh hưởng trong lỗi 409 TECHNICIAN_HAS_CONFLICTING_APPOINTMENTS */
export function conflictsOf(error: unknown): ConflictingAppointmentView[] {
  if (!isApiError(error) || error.code !== 'TECHNICIAN_HAS_CONFLICTING_APPOINTMENTS') return []
  const details = error.details as { conflictingAppointments?: unknown } | null
  return Array.isArray(details?.conflictingAppointments)
    ? (details.conflictingAppointments as ConflictingAppointmentView[])
    : []
}

/** Câu lỗi khi xếp lịch, kèm lý do nếu server có ghi */
export function schedulingErrorMessage(error: unknown) {
  if (isApiError(error)) {
    if (error.code === 'TECHNICIAN_NOT_AVAILABLE') {
      const reason = reasonFromServerMessage(error.serverMessage)
      if (reason)
        return `Kỹ thuật viên này không nhận được lịch (${reason}). Danh sách đã được tải lại, hãy chọn người khác.`
    }
    if (error.status === 429 && error.retryAfter) return `Bạn thao tác quá nhanh. Thử lại sau ${error.retryAfter} giây.`
  }
  return errorMessage(error)
}

const RECALCULATION_REASONS: Record<string, string> = {
  CANCELLATION: 'có lịch bị huỷ',
  CUSTOMER_RESCHEDULE: 'khách đổi giờ',
  SALES_RESCHEDULE: 'kinh doanh đổi giờ',
  REASSIGNMENT: 'đổi kỹ thuật viên',
  BASE_LOCATION_CHANGED: 'đổi nơi xuất phát',
  WORKING_SCHEDULE_CHANGED: 'đổi giờ làm',
  UNAVAILABILITY_CHANGED: 'đổi lịch nghỉ',
}

export function recalculationReasonLabel(reason: string) {
  return RECALCULATION_REASONS[reason] ?? reason
}

export const WEEK_DAYS = [
  { value: 'MONDAY', label: 'Thứ Hai' },
  { value: 'TUESDAY', label: 'Thứ Ba' },
  { value: 'WEDNESDAY', label: 'Thứ Tư' },
  { value: 'THURSDAY', label: 'Thứ Năm' },
  { value: 'FRIDAY', label: 'Thứ Sáu' },
  { value: 'SATURDAY', label: 'Thứ Bảy' },
  { value: 'SUNDAY', label: 'Chủ nhật' },
] as const

export function weekDayLabel(day: string) {
  return WEEK_DAYS.find((d) => d.value === day)?.label ?? day
}

// Kỹ thuật viên nhận được lịch không. Thiếu nơi xuất phát thì tô đỏ, tắt nhận lịch / bị khoá thì xám
export function technicianReadiness(t: {
  readyForScheduling: boolean
  isActiveUser: boolean
  isSchedulingActive: boolean
  baseLatitude: number | null
  baseLongitude: number | null
}): { label: string; tone: Tone } {
  if (t.readyForScheduling) return { label: 'Sẵn sàng nhận lịch', tone: 'ok' }
  if (!t.isActiveUser) return { label: 'Tài khoản không hoạt động', tone: 'neutral' }
  const hasBase = t.baseLatitude != null && t.baseLongitude != null && !(t.baseLatitude === 0 && t.baseLongitude === 0)
  if (!hasBase) return { label: 'Chưa có nơi xuất phát', tone: 'danger' }
  return { label: 'Đang tắt nhận lịch', tone: 'neutral' }
}

/** Màn kỹ thuật viên nhận tên enum (Rooftop...), không phải số */
const SURFACE_NAMES: Record<string, string> = {
  Rooftop: 'Mái nhà',
  Ground: 'Mặt đất',
  Carport: 'Mái che bãi xe',
  Facade: 'Mặt dựng',
  Other: 'Khác',
}

export function surfaceNameLabel(value: string | null | undefined) {
  return value ? (SURFACE_NAMES[value] ?? value) : '—'
}
