import type { CreateSimulationRequest, SelectSimulationRequest } from '@/types/req/simulationsReq'
import type { SelectedSimulation, SimulationDetail, SimulationList, SimulationView } from '@/types/res/simulationsRes'
import { apiGet, apiPost, apiRequest } from '@/services/api/client'

// Mô phỏng do backend tính. Tạo, chọn, bỏ chọn dùng chung giới hạn 10 lần / phút (429)
// Kết quả chỉ giữ tạm 24 giờ; khách phải tự chọn một lần chạy làm mô phỏng chính thì mới được lưu lại

const base = (preSurveyId: string) => `/pre-surveys/${encodeURIComponent(preSurveyId)}/simulations`

/** 201 tạo mới, 200 dùng lại kết quả cũ; có thể mất khoảng 25 giây. Không tự chọn làm mô phỏng chính */
export function createSimulation(preSurveyId: string, body: CreateSimulationRequest) {
  return apiPost<SimulationDetail>(base(preSurveyId), body)
}

/** Các lần chạy còn hạn (bản rút gọn) và mô phỏng đã chọn */
export function listSimulations(preSurveyId: string) {
  return apiGet<SimulationList>(base(preSurveyId))
}

/** Bản đầy đủ để vẽ 2D / 3D. Kết quả đã hết hạn thì 410, riêng mô phỏng đã chọn thì trả bản tóm tắt */
export function getSimulation(preSurveyId: string, simulationId: string) {
  return apiGet<SimulationView>(`${base(preSurveyId)}/${encodeURIComponent(simulationId)}`)
}

/** Chọn làm mô phỏng chính. expectedGeometryVersion là phiên bản mặt lắp khách đang xem */
export function selectSimulation(preSurveyId: string, simulationId: string, body: SelectSimulationRequest) {
  return apiPost<SelectedSimulation>(`${base(preSurveyId)}/${encodeURIComponent(simulationId)}/select`, body)
}

/** Bỏ mô phỏng chính, chỉ làm được khi bản đánh giá chưa gửi */
export function clearSimulationSelection(preSurveyId: string) {
  return apiRequest<void>({ method: 'DELETE', url: `${base(preSurveyId)}/selection` })
}
