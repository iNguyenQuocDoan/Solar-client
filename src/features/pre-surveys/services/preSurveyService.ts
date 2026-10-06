import type { CreateCustomerProfileRequest, CreatePropertySiteRequest } from '@/types/req/customersReq'
import type { CreatePreSurveyRequest, UpdatePreSurveyRequest } from '@/types/req/preSurveysReq'
import type { CreateCustomerProfileResponse, CreatePropertySiteResponse } from '@/types/res/customersRes'
import type { CreatePreSurveyResponse, SubmitPreSurveyResponse } from '@/types/res/preSurveysRes'
import { apiPost, apiRequest } from '@/services/api/client'

/*
 * 5 endpoint phía khách hàng (role CUSTOMER), gọi theo thứ tự:
 * hồ sơ → địa điểm → bản nháp đánh giá → sửa nháp → gửi (sinh yêu cầu khảo sát cho sales).
 * Backend chưa có endpoint GET nào cho khách hàng: không đọc lại được hồ sơ, địa điểm hay
 * bản nháp, nên màn đánh giá giữ id trong state.
 */

/** POST /api/customers/me – gọi lần hai trả CUSTOMER_ALREADY_EXISTS */
export function createCustomerProfile(body: CreateCustomerProfileRequest) {
  return apiPost<CreateCustomerProfileResponse>('/customers/me', body)
}

/** POST /api/customers/me/sites – cần hồ sơ khách hàng trước (CUSTOMER_PROFILE_NOT_FOUND) */
export function createPropertySite(body: CreatePropertySiteRequest) {
  return apiPost<CreatePropertySiteResponse>('/customers/me/sites', body)
}

/** POST /api/pre-surveys – tạo bản nháp (status Draft) cho một địa điểm của chính khách hàng */
export function createPreSurvey(body: CreatePreSurveyRequest) {
  return apiPost<CreatePreSurveyResponse>('/pre-surveys', body)
}

/** PUT /api/pre-surveys/{id} – chỉ sửa được khi còn là nháp (PRE_SURVEY_NOT_EDITABLE) */
export function updatePreSurvey(id: string, body: UpdatePreSurveyRequest) {
  return apiRequest<unknown>({ method: 'PUT', url: `/pre-surveys/${encodeURIComponent(id)}`, data: body })
}

/** POST /api/pre-surveys/{id}/submit – thiếu số liệu trả PRE_SURVEY_INCOMPLETE */
export function submitPreSurvey(id: string) {
  return apiPost<SubmitPreSurveyResponse>(`/pre-surveys/${encodeURIComponent(id)}/submit`)
}
