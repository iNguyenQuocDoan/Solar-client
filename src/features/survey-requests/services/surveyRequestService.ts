import type { AssignTechnicianRequest, SalesRescheduleRequest } from '@/types/req/surveyRequestsReq'
import type { TechnicianAvailabilityView } from '@/types/res/technicianAvailabilityRes'
import type {
  AssignmentView,
  ClaimSurveyRequestResponse,
  EscalatedAppointmentView,
  MySurveyRequestItem,
  PendingSurveyRequestItem,
  SalesRescheduleView,
  SurveyRequestDetail,
} from '@/types/res/surveyRequestsRes'
import { apiGet, apiPost, apiRequest } from '@/services/api/client'

// API phía sales. Nhận yêu cầu chỉ là nhận chăm sóc khách (không đổi trạng thái lịch).
// Kỹ thuật viên trong khu vực tự nhận lịch; sales chỉ phân công khi quá hạn không ai nhận (lý do bắt buộc)

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

/** Kỹ thuật viên nhận được giờ khách đã đặt, kèm người không nhận được và lý do */
export function getTechnicianAvailability(surveyRequestId: string) {
  return apiGet<TechnicianAvailabilityView>('/technicians/availability', { params: { surveyRequestId } })
}

/** Lịch quá hạn không ai nhận, cần nhân viên phân công */
export function listEscalatedAppointments() {
  return apiGet<EscalatedAppointmentView[]>('/survey-requests/escalated')
}

export function assignTechnician(id: string, body: AssignTechnicianRequest) {
  return apiPost<AssignmentView>(`/survey-requests/${encodeURIComponent(id)}/assign-technician`, body)
}

/** Đổi người phụ trách lịch đã xác nhận (lý do bắt buộc) */
export function reassignTechnician(id: string, body: AssignTechnicianRequest) {
  return apiRequest<AssignmentView>({
    method: 'PUT',
    url: `/survey-requests/${encodeURIComponent(id)}/reassign-technician`,
    data: body,
  })
}

/** Không truyền technicianUserId thì giữ người cũ nếu vẫn rảnh, không thì lịch quay về chờ nhận */
export function rescheduleSurveyRequest(id: string, body: SalesRescheduleRequest) {
  return apiRequest<SalesRescheduleView>({
    method: 'PUT',
    url: `/survey-requests/${encodeURIComponent(id)}/reschedule`,
    data: body,
  })
}
