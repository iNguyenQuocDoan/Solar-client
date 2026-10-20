import type { AssignTechnicianRequest, SalesRescheduleRequest } from '@/types/req/surveyRequestsReq'
import type { TechnicianAvailabilityView } from '@/types/res/technicianAvailabilityRes'
import type {
  AssignmentView,
  ClaimSurveyRequestResponse,
  MySurveyRequestItem,
  PendingSurveyRequestItem,
  SalesRescheduleView,
  SurveyRequestDetail,
} from '@/types/res/surveyRequestsRes'
import { apiGet, apiPost, apiRequest } from '@/services/api/client'

// API phía sales: nhận yêu cầu, xem kỹ thuật viên rảnh, phân công, đổi giờ

export function listPendingSurveyRequests() {
  return apiGet<PendingSurveyRequestItem[]>('/survey-requests/pending')
}

export function listMySurveyRequests() {
  return apiGet<MySurveyRequestItem[]>('/survey-requests/my')
}

export function getSurveyRequest(id: string) {
  return apiGet<SurveyRequestDetail>(`/survey-requests/${encodeURIComponent(id)}`)
}

/** Người khác nhận trước thì trả SURVEY_REQUEST_UNAVAILABLE */
export function claimSurveyRequest(id: string) {
  return apiPost<ClaimSurveyRequestResponse>(`/survey-requests/${encodeURIComponent(id)}/claim`)
}

/** Không truyền startsAt thì dùng giờ khách đã đặt */
export function getTechnicianAvailability(surveyRequestId: string, startsAt?: string) {
  return apiGet<TechnicianAvailabilityView>('/technicians/availability', {
    params: startsAt ? { surveyRequestId, startsAt } : { surveyRequestId },
  })
}

export function assignTechnician(id: string, body: AssignTechnicianRequest) {
  return apiPost<AssignmentView>(`/survey-requests/${encodeURIComponent(id)}/assign-technician`, body)
}

/** Đổi người thì xác nhận của người cũ mất hiệu lực */
export function reassignTechnician(id: string, body: AssignTechnicianRequest) {
  return apiRequest<AssignmentView>({
    method: 'PUT',
    url: `/survey-requests/${encodeURIComponent(id)}/reassign-technician`,
    data: body,
  })
}

/** Truyền thêm technicianUserId để đổi cả người */
export function rescheduleSurveyRequest(id: string, body: SalesRescheduleRequest) {
  return apiRequest<SalesRescheduleView>({
    method: 'PUT',
    url: `/survey-requests/${encodeURIComponent(id)}/reschedule`,
    data: body,
  })
}
