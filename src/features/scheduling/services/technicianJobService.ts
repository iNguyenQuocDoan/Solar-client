import type { AcceptAppointmentRequest, ReleaseAppointmentRequest } from '@/types/req/technicianAppointmentsReq'
import type { AssignmentView } from '@/types/res/surveyRequestsRes'
import type {
  OpenAppointmentView,
  ReleaseView,
  TechnicianAppointmentListItem,
  TechnicianJobView,
  TechnicianScheduleView,
} from '@/types/res/technicianAppointmentsRes'
import { apiGet, apiPost } from '@/services/api/client'

// Việc của kỹ thuật viên. Lịch khách đặt hiện cho mọi kỹ thuật viên trong khu vực, ai nhận trước thì được

const base = '/technicians/me'
const appointmentPath = (id: string) => `${base}/appointments/${encodeURIComponent(id)}`

/** Việc đã xác nhận (tự nhận hoặc được phân công) */
export function listMyAppointments() {
  return apiGet<TechnicianAppointmentListItem[]>(`${base}/appointments`)
}

export function getMyAppointment(id: string) {
  return apiGet<TechnicianJobView>(appointmentPath(id))
}

/** Lịch đang chờ người nhận trong các khu vực của mình */
export function listOpenAppointments() {
  return apiGet<OpenAppointmentView[]>(`${base}/open-appointments`)
}

/** Người khác nhận trước thì trả 409 APPOINTMENT_ALREADY_TAKEN */
export function acceptAppointment(id: string, body: AcceptAppointmentRequest) {
  return apiPost<AssignmentView>(`${appointmentPath(id)}/accept`, body)
}

/** Trả lại việc đã nhận, lịch quay về chờ người khác nhận */
export function releaseAppointment(id: string, body: ReleaseAppointmentRequest) {
  return apiPost<ReleaseView>(`${appointmentPath(id)}/release`, body)
}

export function getMySchedule(date: string) {
  return apiGet<TechnicianScheduleView>(`${base}/schedule`, { params: { date } })
}
