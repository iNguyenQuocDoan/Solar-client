import type {
  AcknowledgementView,
  TechnicianAppointmentListItem,
  TechnicianJobView,
  TechnicianScheduleView,
} from '@/types/res/technicianAppointmentsRes'
import { apiGet, apiPost } from '@/services/api/client'

// Việc của kỹ thuật viên: chỉ các lịch đã được phân công chính thức

const base = '/technicians/me'

/** GET /api/technicians/me/appointments */
export function listMyAppointments() {
  return apiGet<TechnicianAppointmentListItem[]>(`${base}/appointments`)
}

export function getMyAppointment(id: string) {
  return apiGet<TechnicianJobView>(`${base}/appointments/${encodeURIComponent(id)}`)
}

/** POST .../acknowledge, gửi lại khi đã nhận thì trả alreadyAcknowledged=true. */
export function acknowledgeAppointment(id: string) {
  return apiPost<AcknowledgementView>(`${base}/appointments/${encodeURIComponent(id)}/acknowledge`)
}

/** Lịch một ngày kèm đường đi đã lưu */
export function getMySchedule(date: string) {
  return apiGet<TechnicianScheduleView>(`${base}/schedule`, { params: { date } })
}
