import type { Tone } from '@/components/common/ui/badge'
import type {
  EnergyInfo,
  InstallationValue,
  ProviderFailure,
  SelectedSimulation,
  SimulationView,
  SimulationWarning,
} from '@/types/res/simulationsRes'

// Nhãn và định dạng cho kết quả mô phỏng (khách hàng và sales dùng chung).
// Backend trả mã kèm câu tiếng Anh: mã đã biết thì dịch sang tiếng Việt, mã lạ thì in câu gốc.

export type MountingType = 'FLUSH' | 'RACK'

export const MOUNTING_TYPES = [
  { value: 'FLUSH', label: 'Áp mái', hint: 'Tấm nằm song song mặt mái, theo đúng độ dốc và hướng của mái.' },
  { value: 'RACK', label: 'Khung nghiêng', hint: 'Tấm đặt trên khung, có góc nghiêng và hướng riêng.' },
] as const satisfies readonly { value: MountingType; label: string; hint: string }[]

export function mountingLabel(type: string | null | undefined) {
  const known = MOUNTING_TYPES.find((mounting) => mounting.value === type?.toUpperCase())
  return known?.label ?? type ?? '—'
}

/** Backend chỉ còn bản tóm tắt của mô phỏng đã chọn (kết quả đầy đủ đã hết hạn) */
export function isSummaryOnly(view: SimulationView): view is SelectedSimulation {
  return view.source === 'SUMMARY'
}

// PARTIALLY_COMPLETED: xếp tấm xong nhưng thiếu sản lượng hoặc thiếu dữ liệu khí hậu
export function simulationStatusMeta(
  status: string | null | undefined,
  energyStatus?: string | null,
  climateStatus?: string | null,
): { label: string; tone: Tone } {
  if (status === 'COMPLETED') return { label: 'Hoàn tất', tone: 'neutral' }
  if (status === 'PARTIALLY_COMPLETED') {
    if (energyStatus === 'SUCCEEDED' && climateStatus !== 'SUCCEEDED') {
      return { label: 'Thiếu số liệu khí hậu', tone: 'warn' }
    }
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

/** Không bao giờ hiện 0 kWh khi chưa có dữ liệu */
export function energyMissingText(energy: EnergyInfo) {
  if (energy.status === 'NOT_APPLICABLE') return 'Không xếp được tấm nào nên không tính sản lượng.'
  if (energy.reason === 'LOCATION_MISSING') return 'Địa điểm chưa có toạ độ nên chưa tính được sản lượng.'
  const failure = energy.scenarios.map((scenario) => providerFailureText(scenario.failure)).find(Boolean)
  if (failure) return `Chưa lấy được số liệu bức xạ từ PVGIS: ${failure}. Chạy lại sau ít phút.`
  if (energy.status === 'FAILED') return 'Chưa lấy được số liệu bức xạ từ PVGIS. Chạy lại sau ít phút.'
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

const WARNINGS: Record<string, string> = {
  STRUCTURE_NOT_ASSESSED: 'Chưa đánh giá khả năng chịu lực của mái, cách bắt giá đỡ và kết cấu đỡ.',
  MOUNTING_SYSTEM_REQUIREMENTS_UNAVAILABLE: 'Danh mục chưa có yêu cầu lắp đặt của hệ khung giá đỡ nên chưa áp dụng.',
  BUILDING_FIRE_CODE_NOT_CHECKED: 'Chưa kiểm tra khoảng lùi và lối tiếp cận theo quy chuẩn xây dựng, phòng cháy.',
  PRELIMINARY_INSTALLATION_VALUES:
    'Một số khoảng cách là giả định sơ bộ, không phải mức tối thiểu của nhà sản xuất hay quy chuẩn.',
  SITE_VALUES_NOT_VERIFIED: 'Các khoảng cách nhập tay chưa được kỹ sư kiểm tra.',
  MANUFACTURER_VALUES_NOT_INDEPENDENTLY_VERIFIED:
    'Số liệu theo tài liệu nhà sản xuất do người nhập danh mục ghi lại, Smart Solar chưa kiểm chứng độc lập.',
  PRODUCT_INSTALLATION_SPEC_INVALID: 'Khối thông số lắp đặt của sản phẩm không hợp lệ nên bị bỏ qua.',
  MODULE_THICKNESS_ASSUMED: 'Tài liệu tấm pin chưa có độ dày; tạm lấy 40 mm để tính và vẽ.',
  RACK_ON_INCLINED_SURFACE: 'Lắp khung nghiêng trên mái dốc cần kỹ sư kiểm tra giá đỡ và cách bắt.',
  FOOTPRINT_CONSERVATIVE_BOUNDING_BOX:
    'Hướng tấm khác hướng mái dốc: bố trí dùng khung bao an toàn cho hình chiếu từng tấm.',
  SHADE_SPACING_NOT_EVALUATED: 'Địa điểm chưa có toạ độ nên chưa ước tính bóng đổ giữa các hàng.',
  OBSTACLE_SHADING_NOT_MODELED: 'Chưa tính bóng đổ của vật cản; chiều cao vật cản chỉ dùng để vẽ 3D.',
  LOCATION_MISSING: 'Địa điểm chưa có toạ độ nên chưa ước tính được sản lượng và khí hậu.',
  FLUSH_MOUNT_THERMAL_ASSUMPTION:
    'Sản lượng áp mái lấy kịch bản "áp sát mái" của PVGIS làm tham chiếu thận trọng, kèm kịch bản "thông gió tự do" để so sánh.',
}

const twoDecimals = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 })

/** Số dạng chữ trong câu tiếng Anh ("12.5") thành số kiểu Việt ("12,5") */
function vietnameseNumber(raw: string | undefined) {
  if (raw === undefined || Number.isNaN(Number(raw))) return raw
  return twoDecimals.format(Number(raw))
}

/** Cảnh báo có số trong câu: lấy số từ câu tiếng Anh. Mã chưa biết thì trả null để dùng câu gốc */
function warningWithNumbers(warning: SimulationWarning): string | null {
  if (warning.code === 'DECLARED_AREA_DIFFERS') {
    const match = /area ([\d.]+) m² differs from the drawn surface area ([\d.]+) m²/.exec(warning.message)
    if (!match) return 'Diện tích khai báo khác diện tích mặt lắp đã vẽ. Mô phỏng dùng mặt lắp đã vẽ.'
    const declared = vietnameseNumber(match[1])
    const drawn = vietnameseNumber(match[2])
    return `Diện tích khai báo ${declared} m² khác diện tích mặt lắp đã vẽ ${drawn} m². Mô phỏng dùng mặt lắp đã vẽ.`
  }
  if (warning.code === 'RACK_SUPPORT_HEIGHT_ABOVE_PRELIMINARY_THRESHOLD') {
    const pattern = /edge is ([\d.]+) m above the surface, above the preliminary review threshold of ([\d.]+) m/
    const match = pattern.exec(warning.message)
    if (!match) return 'Mép cao của tấm vượt ngưỡng chiều cao cần kỹ sư xem lại giá đỡ.'
    const height = vietnameseNumber(match[1])
    const threshold = vietnameseNumber(match[2])
    return `Mép cao của tấm cách mặt mái ${height} m, vượt ngưỡng ${threshold} m cần kỹ sư xem lại giá đỡ.`
  }
  if (warning.code === 'ROW_GAP_BELOW_SHADE_ESTIMATE') {
    const match = /Row gap ([\d.]+) mm is below the advisory shading estimate of ([\d.]+) mm/.exec(warning.message)
    if (!match) return 'Khoảng cách hàng nhỏ hơn mức ước tính để tránh bóng đổ giữa các hàng.'
    const gap = vietnameseNumber(match[1])
    const estimate = vietnameseNumber(match[2])
    return `Khoảng cách hàng ${gap} mm nhỏ hơn mức ước tính để tránh bóng đổ ${estimate} mm (ngày hạ chí và đông chí, 9 giờ đến 15 giờ).`
  }
  if (warning.code === 'ENERGY_PROVIDER_FAILED') {
    return 'PVGIS chưa trả sản lượng cho ít nhất một kịch bản; chạy lại sau ít phút.'
  }
  if (warning.code === 'CLIMATE_PROVIDER_FAILED') return 'Chưa lấy được số liệu khí hậu từ NASA POWER.'
  return null
}

export function warningText(warning: SimulationWarning) {
  return WARNINGS[warning.code] ?? warningWithNumbers(warning) ?? warning.message
}

// So khớp theo đầu câu của SimulationLimitations.For
const LIMITATIONS: [prefix: string, text: string][] = [
  ['Preliminary estimate.', 'Đây là ước tính sơ bộ. Cần kỹ sư khảo sát trước khi quyết định lắp đặt.'],
  [
    'Energy values are PVGIS',
    'Sản lượng là ước tính năm điển hình của PVGIS từ số liệu lịch sử, không phải dự báo hay cam kết.',
  ],
  ['Climate values are NASA POWER', 'Số liệu khí hậu là trung bình lịch sử của NASA POWER, chỉ để tham khảo.'],
  ['The layout is a best-found', 'Bố trí là phương án tốt nhất tìm được ở bước sơ bộ, chưa chắc là tối ưu.'],
  [
    'Rack row shading',
    'Bóng đổ giữa các hàng khung chỉ ước tính cho ngày hạ chí và đông chí (9 giờ đến 15 giờ), không bảo đảm không bị che quanh năm.',
  ],
  ['Shading from obstacles', 'Chưa tính bóng đổ của vật cản và của đầu hàng.'],
  ['Structural, mounting-system', 'Chưa kiểm tra kết cấu, hệ khung giá đỡ, quy chuẩn xây dựng và phòng cháy.'],
  ['Installation spacing values are in millimetres', 'Khoảng cách lắp đặt tính bằng mm; mỗi giá trị ghi rõ nguồn.'],
]

export function limitationText(text: string) {
  const known = LIMITATIONS.find(([prefix]) => text.startsWith(prefix))
  return known ? known[1] : text
}

/** Giả định của ước tính sản lượng. Câu có số nên so khớp bằng regex, câu lạ thì giữ nguyên */
export function assumptionText(text: string) {
  const lossMatch = /^System losses ([\d.]+)% \((site-specified|PVGIS documented default)\)\.$/.exec(text)
  if (lossMatch) {
    const source = lossMatch[2] === 'site-specified' ? 'nhập khi chạy mô phỏng' : 'mặc định của PVGIS'
    return `Tổn hao hệ thống ${vietnameseNumber(lossMatch[1])}% (${source}).`
  }

  const technologyMatch = /^Module technology '([^']+)'/.exec(text)
  if (technologyMatch) {
    return `Công nghệ tấm pin "${technologyMatch[1]}" (mặc định của PVGIS vì danh mục chưa có trường công nghệ).`
  }

  const horizonMatch = /^Terrain horizon (included|excluded)/.exec(text)
  if (horizonMatch) {
    const included = horizonMatch[1] === 'included' ? 'Có' : 'Không'
    return `${included} tính địa hình che chân trời (PVGIS); chưa tính bóng của vật cản trên mái.`
  }

  if (text.startsWith('Flush mounting with an air gap')) {
    return 'Áp mái có khe thông gió nằm giữa hai kịch bản của PVGIS: "áp sát mái" (không thông gió) và "thông gió tự do". Kịch bản áp sát mái được lấy làm ước tính thận trọng; đây là giả định sơ bộ, không phải mức thấp nhất được bảo đảm.'
  }
  if (text.startsWith('Rack mounting uses PVGIS')) {
    return 'Khung nghiêng dùng kịch bản "thông gió tự do" của PVGIS (không khí lưu thông sau tấm).'
  }
  return text
}

export const ENERGY_DISCLAIMER =
  'Ước tính năm điển hình của PVGIS từ số liệu lịch sử, không phải dự báo cho một năm cụ thể và không phải cam kết sản lượng.'
export const CLIMATE_DISCLAIMER =
  'Trung bình tháng trong quá khứ của NASA POWER, chỉ để tham khảo; không dùng để tính sản lượng.'

const wholeNumber = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 })
const oneDecimal = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })
const exactlyOneDecimal = new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

type MaybeNumber = number | null | undefined

/** Số kWh, làm tròn tới số nguyên */
export function formatKwh(value: MaybeNumber) {
  return value == null ? '—' : wholeNumber.format(value)
}

/** Tối đa 1 chữ số lẻ */
export function formatOne(value: MaybeNumber) {
  return value == null ? '—' : oneDecimal.format(value)
}

/** Luôn đúng 1 chữ số lẻ (28,0 cạnh 26,2) để cột số trong bảng thẳng hàng */
export function formatFixed1(value: MaybeNumber) {
  return value == null ? '—' : exactlyOneDecimal.format(value)
}

/** Tối đa 2 chữ số lẻ */
export function formatTwo(value: MaybeNumber) {
  return value == null ? '—' : twoDecimals.format(value)
}

export function formatM2(value: MaybeNumber) {
  return value == null ? '—' : `${twoDecimals.format(value)} m²`
}

export function formatMm(value: MaybeNumber) {
  return value == null ? '—' : `${wholeNumber.format(value)} mm`
}

export const MONTHS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
export const MONTH_NAMES = MONTHS.map((_, index) => `Tháng ${index + 1}`)
