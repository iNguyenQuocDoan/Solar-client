/*
 * Biểu giá bán lẻ điện sinh hoạt 6 bậc (đồng/kWh, chưa gồm VAT) theo Quyết định 1279/QĐ-BCT
 * ngày 09/05/2025 của Bộ Công Thương, áp dụng từ 10/05/2025. Mục "Giá điện" của EVN đến
 * 29/09/2026 chỉ có văn bản về cơ chế điều chỉnh (NĐ 278/2026, VBHN 68/2026), chưa có biểu giá mới.
 * Đổi biểu giá thì chỉ sửa mảng dưới và TARIFF_SOURCE.
 */

export type Tier = {
  /** kWh bắt đầu (không tính), bậc 1 bắt đầu từ 0 */
  from: number
  /** kWh kết thúc (tính), null = không giới hạn */
  to: number | null
  /** đồng/kWh, chưa VAT */
  price: number
}

export const RESIDENTIAL_TIERS: Tier[] = [
  { from: 0, to: 50, price: 1984 },
  { from: 50, to: 100, price: 2050 },
  { from: 100, to: 200, price: 2380 },
  { from: 200, to: 300, price: 2998 },
  { from: 300, to: 400, price: 3350 },
  { from: 400, to: null, price: 3460 },
]

export const TARIFF_SOURCE = {
  label: 'Quyết định 1279/QĐ-BCT, áp dụng từ 10/05/2025, giá chưa gồm VAT',
  host: 'evn.com.vn',
  href: 'https://www.evn.com.vn/d/vi-VN/news/Bieu-gia-ban-le-dien-theo-Quyet-dinh-so-1279QD-BCT-ngay-0952025-cua-Bo-Cong-Thuong-60-28-502668',
}

/** Số kWh của đoạn (a, b] rơi vào bậc t. */
export function kwhInTier(t: Tier, a: number, b: number) {
  const top = t.to ?? Number.POSITIVE_INFINITY
  return Math.max(0, Math.min(b, top) - Math.max(a, t.from))
}

/** Tiền điện (chưa VAT) cho một tháng dùng `kwh` kWh. */
export function monthlyBill(kwh: number) {
  return RESIDENTIAL_TIERS.reduce((sum, t) => sum + kwhInTier(t, 0, kwh) * t.price, 0)
}

/** Nhãn khoảng kWh của bậc như trên hoá đơn: "0–50", "51–100", "Từ 401". */
export function tierRange(t: Tier) {
  return t.to === null ? `Từ ${t.from + 1}` : `${t.from === 0 ? 0 : t.from + 1}–${t.to}`
}
