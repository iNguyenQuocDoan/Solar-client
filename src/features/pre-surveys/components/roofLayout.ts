/*
 * Tính bố trí tấm pin cho mô phỏng 3D. Hàm thuần, không phụ thuộc three.js.
 *
 * Backend chỉ có diện tích mặt lắp, không có kích thước dài × rộng, nên mô phỏng GIẢ ĐỊNH:
 * - mái một mặt dốc, hình chữ nhật tỉ lệ dài : dốc = 3 : 2, diện tích đúng bằng tổng diện tích khai báo
 *   (diện tích đo theo mặt nghiêng);
 * - phần dùng được là hình chữ nhật cùng tỉ lệ, đặt giữa mái;
 * - tấm pin xếp lưới đều, khe 2 cm; thử cả hai chiều đặt tấm, lấy chiều xếp được nhiều tấm hơn.
 * Các giả định này phải hiện kèm mô phỏng để không ai đọc nó như bản thiết kế thật.
 */

export const ROOF_ASPECT = 1.5
export const PANEL_GAP_M = 0.02

export type PanelSpec = { widthMm: number; heightMm: number; ratedPowerW: number }

export type RoofInput = {
  totalAreaM2: number
  usableAreaM2: number
  tiltDegree: number
}

export type RoofLayout = {
  /** Kích thước mái (m): `length` dọc theo đỉnh mái, `slope` theo chiều dốc. */
  roof: { length: number; slope: number }
  usable: { length: number; slope: number }
  /** Kích thước một tấm trên mặt mái (m) theo chiều đã chọn. */
  panel: { along: number; down: number }
  columns: number
  rows: number
  count: number
  /** Tổng công suất đỉnh, kWp. */
  kWp: number
  tiltRad: number
}

function rectangle(area: number) {
  const length = Math.sqrt(area * ROOF_ASPECT)
  return { length, slope: area / length }
}

function fit(space: number, size: number) {
  return Math.max(0, Math.floor((space + PANEL_GAP_M) / (size + PANEL_GAP_M)))
}

/** null khi chưa đủ số liệu để dựng mái (diện tích chưa nhập hoặc không hợp lệ). */
export function computeRoofLayout(input: RoofInput, panel: PanelSpec | null): RoofLayout | null {
  const { totalAreaM2, usableAreaM2, tiltDegree } = input
  if (!(totalAreaM2 > 0) || !(usableAreaM2 > 0) || usableAreaM2 > totalAreaM2) return null
  const roof = rectangle(totalAreaM2)
  const usable = rectangle(usableAreaM2)
  const tiltRad = (Math.min(Math.max(tiltDegree || 0, 0), 90) * Math.PI) / 180

  if (!panel || !(panel.widthMm > 0) || !(panel.heightMm > 0)) {
    return { roof, usable, panel: { along: 0, down: 0 }, columns: 0, rows: 0, count: 0, kWp: 0, tiltRad }
  }

  const w = panel.widthMm / 1000
  const h = panel.heightMm / 1000
  // Đứng: cạnh dài của tấm theo chiều dốc. Nằm: cạnh dài dọc theo đỉnh mái.
  const options = [
    { along: Math.min(w, h), down: Math.max(w, h) },
    { along: Math.max(w, h), down: Math.min(w, h) },
  ].map((size) => {
    const columns = fit(usable.length, size.along)
    const rows = fit(usable.slope, size.down)
    return { size, columns, rows, count: columns * rows }
  })
  const best = options[0]!.count >= options[1]!.count ? options[0]! : options[1]!

  return {
    roof,
    usable,
    panel: best.size,
    columns: best.columns,
    rows: best.rows,
    count: best.count,
    kWp: (best.count * panel.ratedPowerW) / 1000,
    tiltRad,
  }
}
