// Normalized error shape every service call rejects with — components branch on `code`, never on HTTP details.
export interface ApiError {
  code: string
  message: string
  status?: number
  details?: Record<string, string[]>
}
