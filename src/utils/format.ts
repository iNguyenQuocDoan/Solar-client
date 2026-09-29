const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const usdCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const num = new Intl.NumberFormat('en-US')

export const fmt = {
  usd: (n: number) => usd.format(n),
  usdCents: (n: number) => usdCents.format(n),
  num: (n: number) => num.format(n),
  pct: (n: number, digits = 1) => `${n.toFixed(digits)}%`,
}

/**
 * Tiền theo mã tiền tệ backend trả về (VND, USD…), định dạng kiểu Việt Nam: "12.500.000 ₫", "7.200,00 US$".
 * Mã lạ hoặc thiếu thì chỉ in số kèm mã để không làm vỡ trang.
 */
export function formatMoney(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount == null) return '—'
  const code = currency?.trim().toUpperCase() || 'VND'
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: code }).format(amount)
  } catch {
    return `${new Intl.NumberFormat('vi-VN').format(amount)} ${code}`
  }
}
