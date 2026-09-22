import type { components } from '@/lib/api/schema'

/*
 * Lỗi API.
 *
 * Wrapper *ApiResponse trong swagger có dạng { isSuccess, traceId, data, error },
 * `error` là ApiError { code, message, details }. Swagger KHÔNG khai kiểu của
 * `details` (chỉ "nullable": true) nên parser dưới đây nhận mọi dạng thường gặp
 * và bỏ qua dạng lạ.
 *
 * Thứ tự chọn câu hiển thị:
 *   1. bản dịch theo `code` trong ERROR_MESSAGES (mã đã quan sát được từ backend thật);
 *   2. `message` của server (hiện đang là tiếng Anh) cho mã lạ;
 *   3. câu tiếng Việt theo HTTP status khi không có message.
 */

export type RawApiError = components['schemas']['ApiError']

/** Lỗi theo từng field, đã chuẩn hoá về { tenField: "thông báo đầu tiên" }. */
export type FieldErrors = Record<string, string>

export class ApiError extends Error {
  readonly status: number
  readonly code: string | null
  readonly fieldErrors: FieldErrors
  readonly traceId: string | null
  readonly details: unknown

  constructor(init: {
    status: number
    message: string
    code?: string | null
    fieldErrors?: FieldErrors
    traceId?: string | null
    details?: unknown
  }) {
    super(init.message)
    this.name = 'ApiError'
    this.status = init.status
    this.code = init.code ?? null
    this.fieldErrors = init.fieldErrors ?? {}
    this.traceId = init.traceId ?? null
    this.details = init.details
  }

  get hasFieldErrors() {
    return Object.keys(this.fieldErrors).length > 0
  }
}

/*
 * Mã lỗi quan sát trực tiếp từ backend (POST /api/auth/* ngày 21/09/2026).
 * Server trả message tiếng Anh nên cần bản dịch; mã chưa có ở đây sẽ rơi về
 * message của server.
 */
const ERROR_MESSAGES: Record<string, string> = {
  AUTH_INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác, hoặc tài khoản chưa thể đăng nhập.',
  AUTH_EMAIL_ALREADY_EXISTS: 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.',
  AUTH_VALIDATION_FAILED: 'Dữ liệu chưa hợp lệ. Vui lòng kiểm tra lại các ô được đánh dấu.',
  AUTH_VERIFICATION_TOKEN_INVALID_OR_EXPIRED: 'Liên kết xác minh không hợp lệ hoặc đã hết hạn.',
  AUTH_PASSWORD_RESET_TOKEN_INVALID_OR_EXPIRED: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
  AUTH_REFRESH_TOKEN_INVALID: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  AUTH_UNAUTHORIZED: 'Bạn cần đăng nhập để thực hiện thao tác này.',
  AUTH_TOO_MANY_REQUESTS: 'Bạn thao tác quá nhanh. Vui lòng chờ ít phút rồi thử lại.',
}

/** Bản dịch theo mã lỗi; chưa có trong bảng thì trả null. */
export function messageForCode(code: string | null | undefined) {
  if (!code) return null
  return ERROR_MESSAGES[code] ?? null
}

/** Thông báo mặc định theo HTTP status khi server không trả message. */
const STATUS_MESSAGES: Record<number, string> = {
  400: 'Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại.',
  401: 'Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.',
  403: 'Bạn không có quyền thực hiện thao tác này.',
  404: 'Không tìm thấy dữ liệu yêu cầu.',
  409: 'Dữ liệu đã tồn tại trên hệ thống.',
  422: 'Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại.',
  429: 'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.',
  500: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.',
  502: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.',
  503: 'Máy chủ đang bảo trì. Vui lòng thử lại sau.',
}

/** Mất mạng / không gọi được server (status = 0). */
export const NETWORK_ERROR_MESSAGE = 'Không kết nối được máy chủ. Kiểm tra mạng rồi thử lại.'

export function messageForStatus(status: number) {
  if (status === 0) return NETWORK_ERROR_MESSAGE
  return STATUS_MESSAGES[status] ?? 'Đã xảy ra lỗi. Vui lòng thử lại.'
}

function firstString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstString(item)
      if (found) return found
    }
  }
  return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/*
 * Chuẩn hoá `details` về { field: message }. Nhận 3 dạng hay gặp:
 *   1. { email: ["..."], password: ["..."] }        (ModelState / ProblemDetails của .NET)
 *   2. [{ field: "email", message: "..." }, ...]    (mảng lỗi)
 *   3. { errors: { email: [...] } }                 (ProblemDetails bọc thêm 1 lớp)
 * Dạng khác (chuỗi mô tả, null…) trả về {} và để message chung hiển thị ở alert.
 */
export function parseFieldErrors(details: unknown): FieldErrors {
  if (!details) return {}

  // Dạng 3: mở lớp bọc "errors" rồi xử lý tiếp như dạng 1.
  if (isRecord(details) && 'errors' in details && (isRecord(details.errors) || Array.isArray(details.errors))) {
    return parseFieldErrors(details.errors)
  }

  // Dạng 2
  if (Array.isArray(details)) {
    const result: FieldErrors = {}
    for (const item of details) {
      if (!isRecord(item)) continue
      const field = firstString(item.field ?? item.name ?? item.propertyName ?? item.key)
      const message = firstString(item.message ?? item.error ?? item.errorMessage ?? item.description)
      if (field && message && !(field in result)) result[field] = message
    }
    return result
  }

  // Dạng 1
  if (isRecord(details)) {
    const result: FieldErrors = {}
    for (const [field, value] of Object.entries(details)) {
      const message = firstString(value)
      if (message) result[field] = message
    }
    return result
  }

  return {}
}

/** Dựng ApiError từ payload lỗi của server (đã có wrapper hoặc chỉ có ApiError). */
export function toApiError(status: number, body: unknown): ApiError {
  let raw: RawApiError | null = null
  let traceId: string | null = null

  if (isRecord(body)) {
    traceId = firstString(body.traceId)
    if (isRecord(body.error)) raw = body.error as RawApiError
    else if ('code' in body || 'message' in body) raw = body as RawApiError
  }

  const code = firstString(raw?.code)
  const serverMessage = firstString(raw?.message)
  const fieldErrors = parseFieldErrors(raw?.details)

  return new ApiError({
    status,
    // Bản dịch theo mã → message của server → câu theo status.
    message:
      messageForCode(code) ??
      serverMessage ??
      firstString(Object.values(fieldErrors)) ??
      messageForStatus(status),
    code,
    fieldErrors,
    traceId,
    details: raw?.details,
  })
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/** Lấy câu hiển thị cho người dùng từ bất kỳ lỗi nào. */
export function errorMessage(error: unknown, fallback = 'Đã xảy ra lỗi. Vui lòng thử lại.') {
  if (isApiError(error)) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}
