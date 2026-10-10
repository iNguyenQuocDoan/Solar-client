/*
 * VIẾT TAY – không thuộc swagger của backend (`npm run gen:api` không đụng tới): API công khai provinces.open-api.vn
 * bản v2, đơn vị hành chính 2 cấp (tỉnh → phường/xã) từ 01/07/2025. Đối chiếu response thật
 * GET https://provinces.open-api.vn/api/v2/p/79?depth=2 ngày 10/10/2026 (TP.HCM: 113 phường, 54 xã, 1 đặc khu).
 */

export type ProvinceWardRes = {
  name: string
  code: number
  /** "phường" | "xã" | "đặc khu" */
  division_type: string
  codename: string
  province_code: number
}

export type ProvinceWithWardsRes = {
  name: string
  code: number
  division_type: string
  codename: string
  phone_code: number
  wards: ProvinceWardRes[]
}
