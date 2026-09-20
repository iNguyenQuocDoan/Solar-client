const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const usdCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const num = new Intl.NumberFormat('en-US')

export const fmt = {
  usd: (n: number) => usd.format(n),
  usdCents: (n: number) => usdCents.format(n),
  num: (n: number) => num.format(n),
  pct: (n: number, digits = 1) => `${n.toFixed(digits)}%`,
}
