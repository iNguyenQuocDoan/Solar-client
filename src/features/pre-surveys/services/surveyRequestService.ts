import type {
  ClaimSurveyRequestResponse,
  MySurveyRequestItem,
  PendingSurveyRequestItem,
  SurveyRequestDetail,
} from '@/types/res/surveyRequestsRes'
import { apiGet, apiPost } from '@/services/api/client'

/*
 * 4 endpoint phía kinh doanh (role SALES). Khách gửi bản đánh giá thì sinh một yêu cầu
 * trạng thái Pending; sales nhận (claim) thì yêu cầu chuyển sang Assigned và thuộc về người đó.
 * Chỉ sales đã nhận mới xem được chi tiết (SURVEY_REQUEST_NOT_ASSIGNED).
 */

/** GET /api/survey-requests/pending – yêu cầu chưa ai nhận */
export function listPendingSurveyRequests() {
  return apiGet<PendingSurveyRequestItem[]>('/survey-requests/pending')
}

/** GET /api/survey-requests/my – yêu cầu sales đang đăng nhập đã nhận */
export function listMySurveyRequests() {
  return apiGet<MySurveyRequestItem[]>('/survey-requests/my')
}

/** GET /api/survey-requests/{id} */
export function getSurveyRequest(id: string) {
  return apiGet<SurveyRequestDetail>(`/survey-requests/${encodeURIComponent(id)}`)
}

/** POST /api/survey-requests/{id}/claim – người khác nhận trước thì trả SURVEY_REQUEST_UNAVAILABLE */
export function claimSurveyRequest(id: string) {
  return apiPost<ClaimSurveyRequestResponse>(`/survey-requests/${encodeURIComponent(id)}/claim`)
}
