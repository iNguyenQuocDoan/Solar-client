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

type Range = { label: string; unit?: string; min: number; max: number; minExclusive?: boolean }

/** Kiểm tra một ô số; trả về câu lỗi hoặc null. */
function numberIssue(value: string, range: Range, required: boolean) {
  const n = toNumber(value)
  if (n === null) return required ? `Nhập ${range.label}.` : null
  if (Number.isNaN(n)) return `Nhập ${range.label} bằng số.`
  const unit = range.unit ? ` ${range.unit}` : ''
  if (range.minExclusive ? n <= range.min : n < range.min) {
    return range.minExclusive ? `${capitalize(range.label)} phải lớn hơn ${range.min}${unit}.` : `${capitalize(range.label)} từ ${range.min} đến ${range.max}${unit}.`
  }
  if (n > range.max) return `Kiểm tra lại ${range.label}; tối đa ${range.max}${unit}.`
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

const AREA: Range = { label: 'diện tích', unit: 'm²', min: 0, max: Number.POSITIVE_INFINITY, minExclusive: true }
const TILT: Range = { label: 'độ dốc mái', unit: 'độ', min: 0, max: 90 }
const AZIMUTH: Range = { label: 'góc phương vị', unit: 'độ', min: 0, max: 360 }

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
      issue<SurfaceForm>(ctx, 'totalAreaM2', numberIssue(f.totalAreaM2, { ...AREA, label: 'tổng diện tích' }, required))
      issue<SurfaceForm>(ctx, 'usableAreaM2', numberIssue(f.usableAreaM2, { ...AREA, label: 'diện tích dùng được' }, required))
      issue<SurfaceForm>(ctx, 'tiltDegree', numberIssue(f.tiltDegree, TILT, required))
      // Hướng chọn trên la bàn nên chỉ có thể thiếu, không thể sai định dạng.
      if (required && !f.azimuthDegree.trim()) issue<SurfaceForm>(ctx, 'azimuthDegree', 'Chọn hướng mặt mái.')
      else issue<SurfaceForm>(ctx, 'azimuthDegree', numberIssue(f.azimuthDegree, AZIMUTH, false))
      if (required && !f.hasObstruction) issue<SurfaceForm>(ctx, 'hasObstruction', 'Cho biết mặt lắp có vật cản hay không.')
      const total = toNumber(f.totalAreaM2)
      const usable = toNumber(f.usableAreaM2)
      if (total !== null && usable !== null && usable > total)
        issue<SurfaceForm>(ctx, 'usableAreaM2', 'Diện tích dùng được không lớn hơn tổng diện tích.')
    })
    .transform(
      (f): UpdatePreSurveyRequest => ({
        totalAreaM2: toNumber(f.totalAreaM2),
        usableAreaM2: toNumber(f.usableAreaM2),
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
