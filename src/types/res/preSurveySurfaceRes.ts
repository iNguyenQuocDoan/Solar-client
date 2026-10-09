/*
 * VIẾT TAY – swagger chỉ khai "200 OK" cho tag PreSurveySurface, không có schema response.
 * Tên kiểu và field lấy đúng theo SmartSolar.Modules.PreSurvey (GetPreSurveySurface, UpdatePreSurveySurface,
 * Surface/SurfaceObstacle) và Contracts.PreSurveys của image 09/10/2026 (commit 833ff3c), đã đối chiếu response thật.
 * Khi backend khai response trong swagger, `npm run gen:api` sẽ ghi đè file này bằng bản sinh tự động.
 */

/**
 * Vật cản hình chữ nhật trên mặt lắp, mọi số đo là mét: (xM, yM) là góc trên-trái (gần gốc toạ độ nhất),
 * widthM theo trục X (chiều rộng mặt lắp), lengthM theo trục Y (xuôi dốc). heightM chỉ dùng để vẽ 3D.
 */
export type SurfaceObstacle = {
  name: string
  xM: number
  yM: number
  widthM: number
  lengthM: number
  heightM: number | null
}

/** Số liệu khách khai ở form cũ (PUT /api/pre-surveys/{id}); không phải diện tích backend tính từ hình học. */
export type DeclaredSurveyValues = {
  totalAreaM2: number | null
  usableAreaM2: number | null
  hasObstruction: boolean | null
  note: string
}

/** Quy ước toạ độ (chữ tiếng Anh của backend, chỉ để tham khảo). */
export type SurfaceConventions = {
  units: string
  origin: string
  xAxis: string
  yAxis: string
  azimuth: string
  obstacleHeight: string
}

/** GET /api/pre-surveys/{id}/surface – chỉ khách hàng sở hữu bản đánh giá. */
export type PreSurveySurfaceView = {
  preSurveyId: string
  /** Tên enum PreSurveyStatus viết hoa: "DRAFT", "SUBMITTED". */
  status: string
  /** Mỗi lần ghi bản đánh giá (kể cả form cũ) tăng 1; gửi lại làm expectedRevision của PUT surface. */
  revision: number
  /** Chỉ tăng khi hình học đổi (kích thước, độ dốc, hướng, vật cản); gửi làm expectedGeometryVersion của POST simulation. */
  geometryVersion: number
  /** Đã lưu kích thước và danh sách vật cản (có thể rỗng) ít nhất một lần. */
  surfaceDefined: boolean
  surfaceLengthM: number | null
  surfaceWidthM: number | null
  /** Dùng chung cột với tiltDegree / azimuthDegree của form cũ. */
  surfaceTiltDegree: number | null
  surfaceAzimuthDegree: number | null
  /** Mảng rỗng cả khi chưa lưu mặt lắp – xem `surfaceDefined`. */
  obstacles: SurfaceObstacle[]
  declared: DeclaredSurveyValues
  latitude: number | null
  longitude: number | null
  /** Lần mô phỏng khách tạo hoặc dùng lại gần nhất (backend tự chọn khi POST simulation). */
  selectedSimulationId: string | null
  conventions: SurfaceConventions
}

/** PUT /api/pre-surveys/{id}/surface */
export type UpdatePreSurveySurfaceResponse = {
  revision: number
  geometryVersion: number
}
