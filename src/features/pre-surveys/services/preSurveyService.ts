import type { CreateCustomerProfileRequest, CreatePropertySiteRequest } from '@/types/req/customersReq'
import type { UpdatePreSurveySurfaceRequest } from '@/types/req/preSurveySurfaceReq'
import type { CreatePreSurveyRequest, UpdatePreSurveyRequest } from '@/types/req/preSurveysReq'
import type { CreateCustomerProfileResponse, CreatePropertySiteResponse } from '@/types/res/customersRes'
import type { PreSurveySurfaceView, UpdatePreSurveySurfaceResponse } from '@/types/res/preSurveySurfaceRes'
import type { CreatePreSurveyResponse, SubmitPreSurveyResponse } from '@/types/res/preSurveysRes'
import { apiGet, apiPost, apiRequest } from '@/services/api/client'

// API phía khách hàng: hồ sơ, địa điểm, bản nháp đánh giá, mặt lắp, gửi

/** Gọi lần hai trả CUSTOMER_ALREADY_EXISTS */
export function createCustomerProfile(body: CreateCustomerProfileRequest) {
  return apiPost<CreateCustomerProfileResponse>('/customers/me', body)
}

/** Chưa có hồ sơ thì trả CUSTOMER_PROFILE_NOT_FOUND */
export function createPropertySite(body: CreatePropertySiteRequest) {
  return apiPost<CreatePropertySiteResponse>('/customers/me/sites', body)
}

export function createPreSurvey(body: CreatePreSurveyRequest) {
  return apiPost<CreatePreSurveyResponse>('/pre-surveys', body)
}

/** Ghi số liệu khai. Độ dốc, hướng trùng cột với mặt lắp, ghi khác đi thì mô phỏng bị đánh dấu cũ */
export function updatePreSurvey(id: string, body: UpdatePreSurveyRequest) {
  return apiRequest<unknown>({ method: 'PUT', url: `/pre-surveys/${encodeURIComponent(id)}`, data: body })
}

/** Cách duy nhất để đọc lại một bản nháp */
export function getSurface(id: string) {
  return apiGet<PreSurveySurfaceView>(`/pre-surveys/${encodeURIComponent(id)}/surface`)
}

/** expectedRevision cũ thì trả 409 PRE_SURVEY_CONCURRENTLY_MODIFIED */
export function saveSurface(id: string, body: UpdatePreSurveySurfaceRequest) {
  return apiRequest<UpdatePreSurveySurfaceResponse>({
    method: 'PUT',
    url: `/pre-surveys/${encodeURIComponent(id)}/surface`,
    data: body,
  })
}

/** Thiếu số liệu thì trả PRE_SURVEY_INCOMPLETE */
export function submitPreSurvey(id: string) {
  return apiPost<SubmitPreSurveyResponse>(`/pre-surveys/${encodeURIComponent(id)}/submit`)
}
