import type { Tone } from '@/components/common/ui/badge'
import type { EnergyInfo, InstallationValue, ProviderFailure, SimulationWarning } from '@/types/res/simulationsRes'

/*
 * Nhãn và định dạng cho kết quả mô phỏng (khách hàng và sales dùng chung).
 * Backend trả mã ổn định kèm câu tiếng Anh: mã đã biết (SimulationConstants.cs, InstallationModels.cs,
 * EnergyContracts.cs, SimulationDocuments.cs của image 09/10/2026) dịch sang tiếng Việt; mã lạ in câu gốc của backend
 * thay vì đoán nghĩa.
 */

export type MountingType = 'FLUSH' | 'RACK'

export const MOUNTING_TYPES = [
  { value: 'FLUSH', label: 'Áp mái', hint: 'Tấm nằm song song mặt mái, theo đúng độ dốc và hướng của mái.' },
  { value: 'RACK', label: 'Khung nghiêng', hint: 'Tấm đặt trên khung, có góc nghiêng và hướng riêng.' },
] as const satisfies readonly { value: MountingType; label: string; hint: string }[]

export function mountingLabel(type: string | null | undefined) {
  return MOUNTING_TYPES.find((m) => m.value === type?.toUpperCase())?.label ?? type ?? '—'
}

/*
  COMPLETED và PARTIALLY_COMPLETED đều là kết quả đã lưu; "một phần" nghĩa là bố trí tính xong nhưng thiếu sản lượng
  (PVGIS) hoặc chỉ thiếu khí hậu (NASA POWER) – nói đúng phần nào thiếu, vì PVGIS có số mà ghi "thiếu sản lượng" là sai
  (rà code 09/10/2026). Thiếu là lưu ý (warn), không phải lỗi; hoàn tất là việc đã xong nên nhãn xám (neutral) theo quy tắc màu.
*/
export function simulationStatusMeta(
  status: string | null | undefined,
  energyStatus?: string | null,
  climateStatus?: string | null,
): { label: string; tone: Tone } {
  if (status === 'COMPLETED') return { label: 'Hoàn tất', tone: 'neutral' }
  if (status === 'PARTIALLY_COMPLETED') {
    if (energyStatus === 'SUCCEEDED' && climateStatus !== 'SUCCEEDED') return { label: 'Thiếu số liệu khí hậu', tone: 'warn' }
    if (energyStatus === 'NOT_APPLICABLE') return { label: 'Không có sản lượng', tone: 'warn' }
    return { label: 'Thiếu số liệu sản lượng', tone: 'warn' }
  }
  return { label: status || '—', tone: 'neutral' }
}

export const ORIENTATIONS: Record<string, string> = { LANDSCAPE: 'Tấm nằm ngang', PORTRAIT: 'Tấm đứng dọc' }

const NO_PANELS: Record<string, string> = {
  PANEL_LARGER_THAN_INSTALLABLE_REGION: 'Tấm pin lớn hơn vùng lắp được (mặt lắp đã trừ khoảng lùi mép).',
  SETBACK_CONSUMES_SURFACE: 'Khoảng lùi mép chiếm hết mặt lắp.',
  OBSTACLES_BLOCK_ALL_POSITIONS: 'Vật cản và khoảng cách quanh vật cản chiếm hết các vị trí đặt tấm.',
}

export function noPanelsText(reason: string | null | undefined) {
  if (!reason) return 'Không xếp được tấm nào trên mặt lắp này.'
  return NO_PANELS[reason] ?? `Không xếp được tấm nào (${reason}).`
}

const PROVIDER_FAILURES: Record<string, string> = {
  PROVIDER_TIMEOUT: 'máy chủ dữ liệu phản hồi quá chậm',
  PROVIDER_UNAVAILABLE: 'không kết nối được máy chủ dữ liệu',
  PROVIDER_RATE_LIMITED: 'máy chủ dữ liệu đang giới hạn số lần gọi',
  PROVIDER_REJECTED_REQUEST: 'máy chủ dữ liệu từ chối yêu cầu',
  PROVIDER_RESPONSE_INVALID: 'dữ liệu trả về không đọc được',
  LOCATION_NOT_COVERED: 'toạ độ nằm ngoài vùng có dữ liệu',
}

export function providerFailureText(failure: ProviderFailure | null | undefined) {
  if (!failure) return null
  return PROVIDER_FAILURES[failure.code] ?? failure.code
}

/** Câu giải thích khi chưa có sản lượng năm (annualEnergyKwh null): không bao giờ hiện 0 kWh thay cho "chưa có". */
export function energyMissingText(energy: EnergyInfo) {
  if (energy.status === 'NOT_APPLICABLE') return 'Không xếp được tấm nào nên không tính sản lượng.'
  if (energy.reason === 'LOCATION_MISSING') return 'Địa điểm chưa có toạ độ nên chưa tính được sản lượng.'
  const failure = energy.scenarios.map((s) => providerFailureText(s.failure)).find(Boolean)
  if (energy.status === 'FAILED' || failure) return `Chưa lấy được số liệu bức xạ từ PVGIS${failure ? `: ${failure}` : ''}. Chạy lại sau ít phút.`
  return 'Chưa có số liệu sản lượng.'
}

export const SCENARIO_PLACES: Record<string, string> = {
  building: 'Áp sát mái, ít thông gió',
  free: 'Thông gió tự do',
}

const INSTALLATION_SOURCES: Record<string, string> = {
  MANUFACTURER_DOCUMENTED_MINIMUM: 'Tối thiểu theo tài liệu nhà sản xuất',
  MANUFACTURER_DOCUMENTED: 'Theo tài liệu nhà sản xuất',
  SITE_SPECIFIED: 'Nhập khi chạy mô phỏng',
  PRELIMINARY_DEFAULT: 'Mặc định sơ bộ',
  COMPUTED_SHADE_ESTIMATE: 'Tính theo bóng nắng',
  NOT_APPLICABLE: 'Không áp dụng',
}

export function installationSourceLabel(value: InstallationValue) {
  return INSTALLATION_SOURCES[value.source] ?? value.source
}

/* ---------------------------------------------------------------- cảnh báo, giới hạn, giả định */

const WARNINGS: Record<string, string> = {
  STRUCTURE_NOT_ASSESSED: 'Chưa đánh giá khả năng chịu lực của mái, cách bắt giá đỡ và kết cấu đỡ.',
  MOUNTING_SYSTEM_REQUIREMENTS_UNAVAILABLE: 'Danh mục chưa có yêu cầu lắp đặt của hệ khung giá đỡ nên chưa áp dụng.',
  BUILDING_FIRE_CODE_NOT_CHECKED: 'Chưa kiểm tra khoảng lùi và lối tiếp cận theo quy chuẩn xây dựng, phòng cháy.',
  PRELIMINARY_INSTALLATION_VALUES: 'Một số khoảng cách là giả định sơ bộ, không phải mức tối thiểu của nhà sản xuất hay quy chuẩn.',
  SITE_VALUES_NOT_VERIFIED: 'Các khoảng cách nhập tay chưa được kỹ sư kiểm tra.',
  MANUFACTURER_VALUES_NOT_INDEPENDENTLY_VERIFIED: 'Số liệu theo tài liệu nhà sản xuất do người nhập danh mục ghi lại, Smart Solar chưa kiểm chứng độc lập.',
  PRODUCT_INSTALLATION_SPEC_INVALID: 'Khối thông số lắp đặt của sản phẩm không hợp lệ nên bị bỏ qua.',
  MODULE_THICKNESS_ASSUMED: 'Tài liệu tấm pin chưa có độ dày; tạm lấy 40 mm để tính và vẽ.',
  RACK_ON_INCLINED_SURFACE: 'Lắp khung nghiêng trên mái dốc cần kỹ sư kiểm tra giá đỡ và cách bắt.',
  FOOTPRINT_CONSERVATIVE_BOUNDING_BOX: 'Hướng tấm khác hướng mái dốc: bố trí dùng khung bao an toàn cho hình chiếu từng tấm.',
  SHADE_SPACING_NOT_EVALUATED: 'Địa điểm chưa có toạ độ nên chưa ước tính bóng đổ giữa các hàng.',
  OBSTACLE_SHADING_NOT_MODELED: 'Chưa tính bóng đổ của vật cản; chiều cao vật cản chỉ dùng để vẽ 3D.',
  LOCATION_MISSING: 'Địa điểm chưa có toạ độ nên chưa ước tính được sản lượng và khí hậu.',
  FLUSH_MOUNT_THERMAL_ASSUMPTION: 'Sản lượng áp mái lấy kịch bản "áp sát mái" của PVGIS làm tham chiếu thận trọng, kèm kịch bản "thông gió tự do" để so sánh.',
}

const vi = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 })
const viNumber = (raw: string | undefined) => (raw === undefined || Number.isNaN(Number(raw)) ? raw : vi.format(Number(raw)))

/** Cảnh báo có số trong câu: lấy số từ câu tiếng Anh; không khớp mẫu thì trả null để dùng câu gốc. */
function dynamicWarning(w: SimulationWarning): string | null {
  if (w.code === 'DECLARED_AREA_DIFFERS') {
    const m = /area ([\d.]+) m² differs from the drawn surface area ([\d.]+) m²/.exec(w.message)
    return m
      ? `Diện tích khai báo ${viNumber(m[1])} m² khác diện tích mặt lắp đã vẽ ${viNumber(m[2])} m². Mô phỏng dùng mặt lắp đã vẽ.`
      : 'Diện tích khai báo khác diện tích mặt lắp đã vẽ. Mô phỏng dùng mặt lắp đã vẽ.'
  }
  if (w.code === 'RACK_SUPPORT_HEIGHT_ABOVE_PRELIMINARY_THRESHOLD') {
    const m = /edge is ([\d.]+) m above the surface, above the preliminary review threshold of ([\d.]+) m/.exec(w.message)
    return m
      ? `Mép cao của tấm cách mặt mái ${viNumber(m[1])} m, vượt ngưỡng ${viNumber(m[2])} m cần kỹ sư xem lại giá đỡ.`
      : 'Mép cao của tấm vượt ngưỡng chiều cao cần kỹ sư xem lại giá đỡ.'
  }
  if (w.code === 'ROW_GAP_BELOW_SHADE_ESTIMATE') {
    const m = /Row gap ([\d.]+) mm is below the advisory shading estimate of ([\d.]+) mm/.exec(w.message)
    return m
      ? `Khoảng cách hàng ${viNumber(m[1])} mm nhỏ hơn mức ước tính để tránh bóng đổ ${viNumber(m[2])} mm (ngày hạ chí và đông chí, 9 giờ đến 15 giờ).`
      : 'Khoảng cách hàng nhỏ hơn mức ước tính để tránh bóng đổ giữa các hàng.'
  }
  if (w.code === 'ENERGY_PROVIDER_FAILED') return 'PVGIS chưa trả sản lượng cho ít nhất một kịch bản; chạy lại sau ít phút.'
  if (w.code === 'CLIMATE_PROVIDER_FAILED') return 'Chưa lấy được số liệu khí hậu từ NASA POWER.'
  return null
}

export function warningText(w: SimulationWarning) {
  return WARNINGS[w.code] ?? dynamicWarning(w) ?? w.message
}

/* Giới hạn của bản mô phỏng (SimulationLimitations.For): danh sách cố định, so khớp theo đầu câu. */
const LIMITATIONS: [prefix: string, text: string][] = [
  ['Preliminary estimate.', 'Đây là ước tính sơ bộ. Cần kỹ sư khảo sát trước khi quyết định lắp đặt.'],
  ['Energy values are PVGIS', 'Sản lượng là ước tính năm điển hình của PVGIS từ số liệu lịch sử, không phải dự báo hay cam kết.'],
  ['Climate values are NASA POWER', 'Số liệu khí hậu là trung bình lịch sử của NASA POWER, chỉ để tham khảo.'],
  ['The layout is a best-found', 'Bố trí là phương án tốt nhất tìm được ở bước sơ bộ, chưa chắc là tối ưu.'],
  ['Rack row shading', 'Bóng đổ giữa các hàng khung chỉ ước tính cho ngày hạ chí và đông chí (9 giờ đến 15 giờ), không bảo đảm không bị che quanh năm.'],
  ['Shading from obstacles', 'Chưa tính bóng đổ của vật cản và của đầu hàng.'],
  ['Structural, mounting-system', 'Chưa kiểm tra kết cấu, hệ khung giá đỡ, quy chuẩn xây dựng và phòng cháy.'],
  ['Installation spacing values are in millimetres', 'Khoảng cách lắp đặt tính bằng mm; mỗi giá trị ghi rõ nguồn.'],
]

export function limitationText(text: string) {
  return LIMITATIONS.find(([prefix]) => text.startsWith(prefix))?.[1] ?? text
}

/* Giả định của ước tính sản lượng (EnergyDocument.assumptions): câu có số nên so khớp bằng biểu thức. */
export function assumptionText(text: string) {
  let m = /^System losses ([\d.]+)% \((site-specified|PVGIS documented default)\)\.$/.exec(text)
  if (m) return `Tổn hao hệ thống ${viNumber(m[1])}% (${m[2] === 'site-specified' ? 'nhập khi chạy mô phỏng' : 'mặc định của PVGIS'}).`
  m = /^Module technology '([^']+)'/.exec(text)
  if (m) return `Công nghệ tấm pin "${m[1]}" (mặc định của PVGIS vì danh mục chưa có trường công nghệ).`
  m = /^Terrain horizon (included|excluded)/.exec(text)
  if (m) return `${m[1] === 'included' ? 'Có' : 'Không'} tính địa hình che chân trời (PVGIS); chưa tính bóng của vật cản trên mái.`
  if (text.startsWith('Flush mounting with an air gap'))
    return 'Áp mái có khe thông gió nằm giữa hai kịch bản của PVGIS: "áp sát mái" (không thông gió) và "thông gió tự do". Kịch bản áp sát mái được lấy làm ước tính thận trọng; đây là giả định sơ bộ, không phải mức thấp nhất được bảo đảm.'
  if (text.startsWith('Rack mounting uses PVGIS')) return 'Khung nghiêng dùng kịch bản "thông gió tự do" của PVGIS (không khí lưu thông sau tấm).'
  return text
}

export const ENERGY_DISCLAIMER = 'Ước tính năm điển hình của PVGIS từ số liệu lịch sử, không phải dự báo cho một năm cụ thể và không phải cam kết sản lượng.'
export const CLIMATE_DISCLAIMER = 'Trung bình tháng trong quá khứ của NASA POWER, chỉ để tham khảo; không dùng để tính sản lượng.'

/* ---------------------------------------------------------------- số */

const kwh = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })
const one = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })
const two = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 })

export const formatKwh = (value: number | null | undefined) => (value == null ? '—' : kwh.format(value))
export const formatOne = (value: number | null | undefined) => (value == null ? '—' : one.format(value))
const fixed1 = new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
/** Luôn đúng 1 chữ số lẻ (cột số trong bảng căn thẳng hàng: 28,0 cạnh 26,2). */
export const formatFixed1 = (value: number | null | undefined) => (value == null ? '—' : fixed1.format(value))
export const formatTwo = (value: number | null | undefined) => (value == null ? '—' : two.format(value))
export const formatM2 = (value: number | null | undefined) => (value == null ? '—' : `${two.format(value)} m²`)
export const formatMm = (value: number | null | undefined) => (value == null ? '—' : `${kwh.format(value)} mm`)

export const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
export const MONTH_NAMES = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
