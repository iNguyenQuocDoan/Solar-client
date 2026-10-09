/*
 * VIẾT TAY – swagger chỉ khai "200 OK" cho tag SurveyRequests, không có schema response.
 * Tên kiểu và field lấy đúng theo SmartSolar.Modules.PreSurvey (GetPendingSurveyRequests,
 * GetMySurveyRequests, GetSurveyRequestDetail) và Contracts.SurveyRequests của image 05/10/2026.
 * Enum serialize thành số giống request. Khi backend khai response trong swagger,
 * `npm run gen:api` sẽ ghi đè file này bằng bản sinh tự động.
 */
import type { InstallationSurfaceType } from '@/types/req/customersReq'

/** 1 Pending, 2 Assigned, 3 Reviewing, 4 Scheduled, 5 Completed, 6 Cancelled */
export type SurveyRequestStatus = 1 | 2 | 3 | 4 | 5 | 6

export type PendingSurveyRequestItem = {
  surveyRequestId: string
  preSurveyId: string
  customerName: string | null
  propertyName: string | null
  province: string | null
  district: string | null
  installationSurfaceType: InstallationSurfaceType
  totalAreaM2: number | null
  usableAreaM2: number | null
  /** Format: date-time */
  submittedAt: string
}

export type MySurveyRequestItem = {
  surveyRequestId: string
  preSurveyId: string
  customerName: string | null
  propertyName: string | null
  province: string | null
  district: string | null
  status: SurveyRequestStatus
  /** Format: date-time */
  submittedAt: string
  assignedAt: string | null
  scheduledAt: string | null
}

export type SurveyRequestDetail = {
  surveyRequestId: string
  preSurveyId: string
  assignedSaleId: string | null
  customerName: string | null
  customerPhone: string | null
  customerEmail: string | null
  propertyName: string | null
  province: string | null
  district: string | null
  ward: string | null
  streetLine: string | null
  latitude: number | null
  longitude: number | null
  installationSurfaceType: InstallationSurfaceType
  surfaceMaterial: string | null
  totalAreaM2: number | null
  usableAreaM2: number | null
  tiltDegree: number | null
  azimuthDegree: number | null
  hasObstruction: boolean | null
  status: SurveyRequestStatus
  /** Format: date-time */
  submittedAt: string
  assignedAt: string | null
  scheduledAt: string | null
  salesNote: string | null
  /** Lần mô phỏng khách chọn khi gửi (image 09/10/2026); null với yêu cầu gửi khi chưa chạy mô phỏng. */
  selectedSimulation: SelectedSimulationSummary | null
}

/** Tóm tắt mô phỏng khách chọn; bản đầy đủ đọc ở GET /api/pre-surveys/{preSurveyId}/simulations/{simulationId}. */
export type SelectedSimulationSummary = {
  simulationId: string
  status: string
  energyStatus: string
  isStale: boolean
  mountingType: string
  productSku: string
  productName: string
  panelCount: number
  installedCapacityKwp: number
  annualEnergyKwh: number | null
  /** Format: date-time */
  createdAt: string
}

export type ClaimSurveyRequestResponse = {
  surveyRequestId: string
}
