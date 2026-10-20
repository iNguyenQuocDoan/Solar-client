import type { CreateSimulationRequest } from '@/types/req/simulationsReq'
import type { SimulationDetail, SimulationListItem } from '@/types/res/simulationsRes'
import { apiGet, apiPost } from '@/services/api/client'

// Mô phỏng do backend tính, tối đa 10 lần / phút (429)
// Backend tự chọn lần chạy mới nhất làm mô phỏng chính

const base = (preSurveyId: string) => `/pre-surveys/${encodeURIComponent(preSurveyId)}/simulations`

/** 201 tạo mới, 200 dùng lại kết quả cũ; có thể mất khoảng 25 giây */
export function createSimulation(preSurveyId: string, body: CreateSimulationRequest) {
  return apiPost<SimulationDetail>(base(preSurveyId), body)
}

/** Bản rút gọn, không có toạ độ tấm */
export function listSimulations(preSurveyId: string) {
  return apiGet<SimulationListItem[]>(base(preSurveyId))
}

/** Bản đầy đủ để vẽ 2D / 3D */
export function getSimulation(preSurveyId: string, simulationId: string) {
  return apiGet<SimulationDetail>(`${base(preSurveyId)}/${encodeURIComponent(simulationId)}`)
}
