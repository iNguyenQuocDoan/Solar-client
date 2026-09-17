import axios, { AxiosError } from 'axios'
import type { ApiError } from '@/types/api'

// The only place HTTP is configured. Components never import axios directly —
// they call typed functions from per-resource service modules in this folder.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  // TODO: inject auth token from the session store once auth exists.
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<Partial<ApiError>>) => {
    const status = error.response?.status
    const apiError: ApiError = {
      code: error.response?.data?.code ?? (status ? `HTTP_${status}` : 'NETWORK_ERROR'),
      message: error.response?.data?.message ?? error.message,
      status,
      details: error.response?.data?.details,
    }
    // TODO: handle 401 centrally (refresh token or redirect to login).
    return Promise.reject(apiError)
  },
)
