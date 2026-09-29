const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const usdCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const num = new Intl.NumberFormat('en-US')
const vnNum = new Intl.NumberFormat('vi-VN')

export const fmt = {
  usd: (n: number) => usd.format(n),
  usdCents: (n: number) => usdCents.format(n),
  num: (n: number) => num.format(n),
  pct: (n: number, digits = 1) => `${n.toFixed(digits)}%`,
  /** 1.247.500 – dấu chấm ngăn nghìn kiểu Việt. */
  vnNum: (n: number) => vnNum.format(n),
  /** 1.247.500 đ – khoảng trắng không ngắt để số và "đ" không bị tách dòng. */
  vnd: (n: number) => `${vnNum.format(Math.round(n))}\u00a0đ`,
}

/** Định dạng tiền USD kiểu "$7,200.00" như bảng product_catalogue (Stitch kit). */
export function formatUsd(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
