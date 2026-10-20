import type {
  AddUnavailablePeriodRequest,
  SetWorkingScheduleRequest,
  UpsertTechnicianProfileRequest,
} from '@/types/req/adminTechniciansReq'
import type { TechnicianProfileView, UnavailablePeriodView, WorkingScheduleView } from '@/types/res/adminTechniciansRes'
import type { TechnicianScheduleView } from '@/types/res/technicianAppointmentsRes'
import { apiGet, apiPost, apiRequest } from '@/services/api/client'

// Cấu hình lịch của kỹ thuật viên (ADMIN, MANAGER). Đụng lịch đã có thì trả 409 TECHNICIAN_HAS_CONFLICTING_APPOINTMENTS

const base = '/admin/technicians'
const path = (id: string) => `${base}/${encodeURIComponent(id)}`

/** Mọi tài khoản có vai trò kỹ thuật viên, kể cả chưa có hồ sơ lịch */
export function listTechnicians() {
  return apiGet<TechnicianProfileView[]>(base)
}

export function upsertTechnicianProfile(id: string, body: UpsertTechnicianProfileRequest) {
  return apiRequest<TechnicianProfileView>({ method: 'PUT', url: `${path(id)}/profile`, data: body })
}

/** GET .../working-schedule */
export function getWorkingSchedule(id: string) {
  return apiGet<WorkingScheduleView>(`${path(id)}/working-schedule`)
}

/** Thay cả tuần, hoặc useDefault=true để dùng giờ chung */
export function setWorkingSchedule(id: string, body: SetWorkingScheduleRequest) {
  return apiRequest<WorkingScheduleView>({ method: 'PUT', url: `${path(id)}/working-schedule`, data: body })
}

/** GET .../unavailable-periods, chỉ các khoảng nghỉ chưa kết thúc. */
export function listUnavailablePeriods(id: string) {
  return apiGet<UnavailablePeriodView[]>(`${path(id)}/unavailable-periods`)
}

/** POST .../unavailable-periods (201). */
export function addUnavailablePeriod(id: string, body: AddUnavailablePeriodRequest) {
  return apiPost<UnavailablePeriodView>(`${path(id)}/unavailable-periods`, body)
}

/** DELETE .../unavailable-periods/{periodId} (204). */
export function removeUnavailablePeriod(id: string, periodId: string) {
  return apiRequest<void>({ method: 'DELETE', url: `${path(id)}/unavailable-periods/${encodeURIComponent(periodId)}` })
}

/** GET /api/technicians/{id}/schedule?date=YYYY-MM-DD (MANAGER, ADMIN). */
export function getTechnicianSchedule(id: string, date: string) {
  return apiGet<TechnicianScheduleView>(`/technicians/${encodeURIComponent(id)}/schedule`, { params: { date } })
}
