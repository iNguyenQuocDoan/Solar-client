import { z } from 'zod'
import type { ApiError } from '@/services/api/errors'
import type { CreateCustomerProfileRequest, CreatePropertySiteRequest } from '@/types/req/customersReq'
import type { UpdatePreSurveyRequest } from '@/types/req/preSurveysReq'

/*
 * Form của màn đánh giá sơ bộ. Ô nhập giữ dạng chuỗi; schema của từng bước vừa kiểm tra
 * vừa đổi sang body đúng kiểu request trong swagger, nên trang chỉ việc gửi `data`.
 */

export type ProfileForm = {
  customerType: '1' | '2'
  companyName: string
  taxCode: string
  note: string
}

export type SiteForm = {
  name: string
  province: string
  district: string
  ward: string
  streetLine: string
  latitude: string
  longitude: string
  installationSurfaceType: string
  surfaceMaterial: string
  note: string
}

export type SurfaceForm = {
  totalAreaM2: string
  usableAreaM2: string
  tiltDegree: string
  azimuthDegree: string
  hasObstruction: '' | 'yes' | 'no'
}

export const EMPTY_PROFILE: ProfileForm = { customerType: '2', companyName: '', taxCode: '', note: '' }

export const EMPTY_SITE: SiteForm = {
  name: '',
  province: '',
  district: '',
  ward: '',
  streetLine: '',
  latitude: '',
  longitude: '',
  installationSurfaceType: '1',
  surfaceMaterial: '',
  note: '',
}

export const EMPTY_SURFACE: SurfaceForm = { totalAreaM2: '', usableAreaM2: '', tiltDegree: '', azimuthDegree: '', hasObstruction: '' }

export type FormErrors<F> = Partial<Record<keyof F, string>>

/* ------------------------------------------------------------------ helpers */

/** Chuỗi rỗng → null để backend nhận đúng "không khai". */
const text = (value: string) => value.trim() || null

/** Người dùng Việt hay gõ dấu phẩy thập phân: "12,5" → 12.5. Rỗng → null, sai → NaN. */
export function toNumber(value: string) {
  const raw = value.trim().replace(',', '.')
  return raw === '' ? null : Number(raw)
}

/**
 * Diện tích hay được gõ theo kiểu Việt: "1.200" là một nghìn hai trăm, không phải 1,2 m². Dấu chấm chia đúng
 * nhóm ba chữ số thì coi là phân cách hàng nghìn (phần lẻ sau dấu phẩy); còn lại đọc như toNumber.
 * Chỉ dùng cho diện tích: toạ độ "10.762" hay góc "12.5" vẫn là số thập phân.
 */
export function toArea(value: string) {
  const raw = value.trim()
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(raw)) return Number(raw.replace(/\./g, '').replace(',', '.'))
  return toNumber(raw)
}

type Range = { label: string; unit?: string; min: number; max: number; minExclusive?: boolean; parse?: (value: string) => number | null }

/** Kiểm tra một ô số; trả về câu lỗi hoặc null. */
function numberIssue(value: string, range: Range, required: boolean) {
  const n = (range.parse ?? toNumber)(value)
  if (n === null) return required ? `Nhập ${range.label}.` : null
  // isFinite gạt cả NaN lẫn "Infinity" / "1e400" (Number() đọc được nhưng không phải số đo).
  if (!Number.isFinite(n)) return `Nhập ${range.label} bằng số.`
  const unit = range.unit ? ` ${range.unit}` : ''
  if (range.minExclusive ? n <= range.min : n < range.min) {
    return range.minExclusive ? `${capitalize(range.label)} phải lớn hơn ${range.min}${unit}.` : `${capitalize(range.label)} từ ${range.min} đến ${range.max}${unit}.`
  }
  if (n > range.max) return `Kiểm tra lại ${range.label}; tối đa ${new Intl.NumberFormat('vi-VN').format(range.max)}${unit}.`
  return null
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

function issue<F>(ctx: z.RefinementCtx, path: keyof F, message: string | null) {
  if (message) ctx.addIssue({ code: 'custom', path: [path as string], message })
}

/* ------------------------------------------------------------------ schemas */

/*
  Luật kiểm tra bám đúng backend, không thêm luật riêng (dò validator ngày 05/10/2026):
  - địa điểm: chỉ Name và Province bắt buộc; Latitude -90..90, Longitude -180..180.
  - bản nháp: TotalAreaM2 > 0, UsableAreaM2 <= TotalAreaM2, TiltDegree 0..90, AzimuthDegree 0..360.
  - hồ sơ: swagger cho mọi trường để trống (chưa dò được validator vì tài khoản test đã có hồ sơ).
*/

export const profileSchema = z
  .object({ customerType: z.enum(['1', '2']), companyName: z.string(), taxCode: z.string(), note: z.string() })
  .transform(
    (f): CreateCustomerProfileRequest => ({
      customerType: f.customerType === '2' ? 2 : 1,
      companyName: f.customerType === '2' ? text(f.companyName) : null,
      taxCode: text(f.taxCode),
      note: text(f.note),
    }),
  )

export const siteSchema = z
  .object({
    name: z.string().trim().min(1, 'Đặt tên cho địa điểm, ví dụ "Nhà xưởng Bình Dương".'),
    province: z.string().trim().min(1, 'Nhập tỉnh hoặc thành phố.'),
    district: z.string(),
    ward: z.string(),
    streetLine: z.string(),
    latitude: z.string(),
    longitude: z.string(),
    installationSurfaceType: z.enum(['1', '2', '3', '4', '5'], { error: 'Chọn bề mặt lắp đặt.' }),
    surfaceMaterial: z.string(),
    note: z.string(),
  })
  .superRefine((f, ctx) => {
    issue<SiteForm>(ctx, 'latitude', numberIssue(f.latitude, { label: 'vĩ độ', min: -90, max: 90 }, false))
    issue<SiteForm>(ctx, 'longitude', numberIssue(f.longitude, { label: 'kinh độ', min: -180, max: 180 }, false))
  })
  .transform(
    (f): CreatePropertySiteRequest => ({
      name: text(f.name),
      province: text(f.province),
      district: text(f.district),
      ward: text(f.ward),
      streetLine: text(f.streetLine),
      latitude: toNumber(f.latitude),
      longitude: toNumber(f.longitude),
      installationSurfaceType: Number(f.installationSurfaceType) as CreatePropertySiteRequest['installationSurfaceType'],
      surfaceMaterial: text(f.surfaceMaterial),
      note: text(f.note),
    }),
  )

/* Trần 1.000.000 m² (100 ha) chỉ để chặn số vô nghĩa; mái nhà xưởng lớn nhất cũng chỉ vài chục nghìn m². */
const AREA: Range = { label: 'diện tích', unit: 'm²', min: 0, max: 1_000_000, minExclusive: true, parse: toArea }
const TOTAL_AREA: Range = { ...AREA, label: 'tổng diện tích' }
const USABLE_AREA: Range = { ...AREA, label: 'diện tích dùng được' }
const TILT: Range = { label: 'độ dốc mái', unit: 'độ', min: 0, max: 90 }
const AZIMUTH: Range = { label: 'góc phương vị', unit: 'độ', min: 0, max: 360 }

/**
 * Lỗi phạm vi của một ô số ở bước số liệu, kiểm tra ngay khi gõ để không phải đợi bấm "Tiếp tục"
 * mới biết sai. Không xét bắt buộc (đang gõ dở) và không xét liên ô (dùng được ≤ tổng): hai việc đó
 * để schema lo lúc gửi. Câu báo lỗi trùng với schema vì cùng dùng numberIssue và cùng khoảng.
 */
export function liveSurfaceIssue(field: keyof SurfaceForm, value: string): string | null {
  if (field === 'totalAreaM2') return numberIssue(value, TOTAL_AREA, false)
  if (field === 'usableAreaM2') return numberIssue(value, USABLE_AREA, false)
  if (field === 'tiltDegree') return numberIssue(value, TILT, false)
  return null
}

/**
 * Lưu nháp cho phép bỏ trống (backend nhận null); đi tiếp sang bước gửi thì phải đủ cả 5 ô,
 * vì backend từ chối gửi bản thiếu số liệu (PRE_SURVEY_INCOMPLETE).
 */
export function surfaceSchema(required: boolean) {
  return z
    .object({
      totalAreaM2: z.string(),
      usableAreaM2: z.string(),
      tiltDegree: z.string(),
      azimuthDegree: z.string(),
      hasObstruction: z.enum(['', 'yes', 'no']),
    })
    .superRefine((f, ctx) => {
      issue<SurfaceForm>(ctx, 'totalAreaM2', numberIssue(f.totalAreaM2, TOTAL_AREA, required))
      issue<SurfaceForm>(ctx, 'usableAreaM2', numberIssue(f.usableAreaM2, USABLE_AREA, required))
      issue<SurfaceForm>(ctx, 'tiltDegree', numberIssue(f.tiltDegree, TILT, required))
      // Hướng chọn trên la bàn nên chỉ có thể thiếu, không thể sai định dạng.
      if (required && !f.azimuthDegree.trim()) issue<SurfaceForm>(ctx, 'azimuthDegree', 'Chọn hướng mặt mái.')
      else issue<SurfaceForm>(ctx, 'azimuthDegree', numberIssue(f.azimuthDegree, AZIMUTH, false))
      if (required && !f.hasObstruction) issue<SurfaceForm>(ctx, 'hasObstruction', 'Cho biết mặt lắp có vật cản hay không.')
      const total = toArea(f.totalAreaM2)
      const usable = toArea(f.usableAreaM2)
      if (total !== null && usable !== null && usable > total)
        issue<SurfaceForm>(ctx, 'usableAreaM2', 'Diện tích dùng được không lớn hơn tổng diện tích.')
    })
    .transform(
      (f): UpdatePreSurveyRequest => ({
        totalAreaM2: toArea(f.totalAreaM2),
        usableAreaM2: toArea(f.usableAreaM2),
        tiltDegree: toNumber(f.tiltDegree),
        azimuthDegree: toNumber(f.azimuthDegree),
        hasObstruction: f.hasObstruction === '' ? null : f.hasObstruction === 'yes',
      }),
    )
}

/* ------------------------------------------------------------------ chạy schema, gắn lỗi */

export function check<F, Out>(schema: z.ZodType<Out>, form: F): { data: Out; errors?: undefined } | { data?: undefined; errors: FormErrors<F> } {
  const result = schema.safeParse(form)
  if (result.success) return { data: result.data }
  const errors: FormErrors<F> = {}
  for (const i of result.error.issues) {
    const key = i.path[0] as keyof F | undefined
    if (key !== undefined && !errors[key]) errors[key] = i.message
  }
  return { errors }
}

/**
 * Lỗi theo field từ server (FluentValidation trả tên PascalCase, có thể kèm tiền tố "request.")
 * → khoá của form. Field không có trong form thì bỏ, message chung vẫn hiện ở thanh thao tác.
 */
export function serverFieldErrors<F extends object>(error: ApiError, form: F): FormErrors<F> {
  const errors: FormErrors<F> = {}
  for (const [field, message] of Object.entries(error.fieldErrors)) {
    const last = field.split('.').pop() ?? field
    const key = (last.charAt(0).toLowerCase() + last.slice(1)) as keyof F
    if (key in form && !errors[key]) errors[key] = message
  }
  return errors
}
