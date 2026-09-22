import axios, { AxiosError, AxiosHeaders, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import { ApiError, messageForStatus, toApiError } from '@/lib/api/errors'
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from '@/lib/api/tokens'
import type { components } from '@/lib/api/schema'

/*
 * Axios instance dùng chung.
 *
 * - Request: gắn Authorization: Bearer <accessToken>.
 * - Response: mở wrapper *ApiResponse ({ isSuccess, traceId, data, error }) và trả thẳng `data`;
 *   lỗi thì ném ApiError.
 * - 401: gọi /auth/refresh theo kiểu single-flight (nhiều request cùng 401 chỉ refresh 1 lần,
 *   các request còn lại xếp hàng chờ rồi retry). Refresh hỏng → xoá phiên + bắn "session-expired".
 */

/** Sự kiện phát trên window khi phiên không còn cứu được. */
export const SESSION_EXPIRED_EVENT = 'session-expired'

export function emitSessionExpired() {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
}

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

/** Đường dẫn không gắn token và không thử refresh khi 401. */
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/verify-email',
  '/auth/resend-verification',
  '/auth/forgot-password',
  '/auth/reset-password',
]

function isPublicPath(url: string | undefined) {
  if (!url) return false
  return PUBLIC_PATHS.some((path) => url.startsWith(path))
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token && !isPublicPath(config.url)) {
    const headers = AxiosHeaders.from(config.headers)
    headers.set('Authorization', `Bearer ${token}`)
    config.headers = headers
  }
  return config
})

/* ---------------------------------------------------------------- refresh */

type AuthTokensResponse = components['schemas']['AuthTokensResponse']

/** Promise của lần refresh đang chạy; các 401 khác chờ vào đây thay vì gọi thêm. */
let refreshInFlight: Promise<string> | null = null

/*
 * Gọi /auth/refresh bằng axios "trần" để không lọt vào interceptor của apiClient
 * (tránh đệ quy khi chính refresh trả 401).
 */
async function requestNewAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new ApiError({ status: 401, message: messageForStatus(401) })

  const response = await axios.post<unknown>(
    `${baseURL}/auth/refresh`,
    { refreshToken } satisfies components['schemas']['RefreshTokenRequest'],
    { headers: { 'Content-Type': 'application/json' } },
  )

  const body = response.data as { isSuccess?: boolean; data?: AuthTokensResponse } | null
  const tokens = body?.data
  if (!tokens?.accessToken || !tokens.refreshToken) {
    throw new ApiError({ status: 401, message: 'Phiên đăng nhập không còn hiệu lực.' })
  }

  // Giữ nguyên nơi lưu cũ (local hay session) – không truyền `remember`.
  saveTokens({
    accessToken: tokens.accessToken,
    accessTokenExpiresAt: tokens.accessTokenExpiresAt,
    refreshToken: tokens.refreshToken,
    refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
    tokenType: tokens.tokenType ?? undefined,
    userId: tokens.userId,
  })
  return tokens.accessToken
}

/** Single-flight: mọi lời gọi trong lúc đang refresh đều dùng chung 1 promise. */
export function refreshAccessToken(): Promise<string> {
  refreshInFlight ??= requestNewAccessToken().finally(() => {
    refreshInFlight = null
  })
  return refreshInFlight
}

/* --------------------------------------------------------------- response */

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

apiClient.interceptors.response.use(
  // Mở wrapper: trả thẳng `data` bên trong *ApiResponse.
  (response) => {
    const body = response.data as { isSuccess?: boolean; data?: unknown; error?: unknown } | null

    if (body && typeof body === 'object' && 'isSuccess' in body) {
      if (body.isSuccess === false) throw toApiError(response.status, body)
      return { ...response, data: body.data }
    }
    return response
  },

  async (error: unknown) => {
    if (error instanceof ApiError) throw error

    if (!axios.isAxiosError(error)) {
      throw new ApiError({ status: 0, message: messageForStatus(0) })
    }

    const axiosError = error as AxiosError
    const config = axiosError.config as RetriableConfig | undefined

    // Không có response = mất mạng / server không chạy.
    if (!axiosError.response) {
      throw new ApiError({ status: 0, message: messageForStatus(0) })
    }

    const { status, data } = axiosError.response

    const canRetry = status === 401 && config && !config._retried && !isPublicPath(config.url)
    if (canRetry) {
      config._retried = true
      try {
        const token = await refreshAccessToken()
        const headers = AxiosHeaders.from(config.headers)
        headers.set('Authorization', `Bearer ${token}`)
        config.headers = headers
        return await apiClient.request(config)
      } catch {
        clearTokens()
        emitSessionExpired()
        throw toApiError(status, data)
      }
    }

    throw toApiError(status, data)
  },
)

/** Gọi API và nhận thẳng phần `data` đã mở wrapper. */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config)
  return response.data
}

export async function apiPost<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...config, method: 'POST', url, data: body })
}

export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>({ ...config, method: 'GET', url })
}
