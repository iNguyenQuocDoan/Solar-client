import type {
  BookSurveyAppointmentRequest,
  CancelSurveyAppointmentRequest,
} from '@/types/req/customerSurveyRequestsReq'
import type {
  BookingConfirmation,
  CustomerAppointmentView,
  CustomerSurveyRequestDetailView,
  CustomerSurveyRequestView,
} from '@/types/res/customerSurveyRequestsRes'
import type { SurveySlotsView } from '@/types/res/surveySlotsRes'
import { apiGet, apiPost, apiRequest } from '@/services/api/client'

// Khách tự đặt giờ khảo sát, hệ thống giữ chỗ một kỹ thuật viên. Đổi / huỷ được khi lịch còn BOOKED

const base = '/customers/me/survey-requests'
const path = (id: string) => `${base}/${encodeURIComponent(id)}`

/** Chỉ trả các giờ đã kiểm tra được kỹ thuật viên và đường đi */
export function getSurveySlots(propertySiteId: string, date: string) {
  return apiGet<SurveySlotsView>('/survey-slots', { params: { propertySiteId, date } })
}

/** GET /api/customers/me/survey-requests */
export function listMyRequests() {
  return apiGet<CustomerSurveyRequestView[]>(base)
}

/** GET /api/customers/me/survey-requests/{id}, kèm lịch sử các lần đặt. */
export function getMyRequest(id: string) {
  return apiGet<CustomerSurveyRequestDetailView>(path(id))
}

/** 201 tạo mới, gửi lại đúng giờ cũ thì 200 với created=false */
export function bookAppointment(id: string, body: BookSurveyAppointmentRequest) {
  return apiPost<BookingConfirmation>(`${path(id)}/booking`, body)
}

/** PUT .../booking, đổi sang giờ khác khi còn BOOKED (lịch cũ giữ làm lịch sử). */
export function rescheduleAppointment(id: string, body: BookSurveyAppointmentRequest) {
  return apiRequest<BookingConfirmation>({ method: 'PUT', url: `${path(id)}/booking`, data: body })
}

/** POST .../booking/cancel, nhả chỗ của kỹ thuật viên; lý do tối đa 200 ký tự. */
export function cancelAppointment(id: string, body: CancelSurveyAppointmentRequest) {
  return apiPost<CustomerAppointmentView>(`${path(id)}/booking/cancel`, body)
}
