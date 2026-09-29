import { useId, useState } from 'react'
import { cx } from '@/lib/cx'
import { RESIDENTIAL_TIERS, TARIFF_SOURCE, kwhInTier, monthlyBill, tierRange, type Tier } from '@/lib/electricity-tariff'
import { fmt } from '@/lib/format'
import { tariff } from '@/lib/mock/landing'
import { TEXT_LINK } from './classes'

/*
  Bậc thang giá điện – yếu tố nhận diện của trang. Lấy từ thứ chủ nhà nào cũng đã cầm trên tay:
  hoá đơn tiền điện 6 bậc. Mỗi cột là một bậc, cao theo đơn giá; trong cột, phần xám là điện
  mua từ lưới, phần xanh là điện tấm pin làm ra và nhà dùng trực tiếp. Vì bậc tính luỹ tiến theo
  tổng tháng, điện tấm pin thay luôn cắt từ bậc trên cùng xuống.
  Mọi con số là phép tính trên biểu giá có nguồn (src/lib/electricity-tariff.ts); số kWh là của
  người xem tự kéo, không phải cam kết sản lượng.
  Các cột rộng bằng nhau (không theo độ dài khoảng kWh) để nhãn giá đọc được ở 360px.
*/
const MAX_PRICE = Math.max(...RESIDENTIAL_TIERS.map((t) => t.price))

export function TariffLadder({ className }: { className?: string }) {
  const [use, setUse] = useState(tariff.defaultUse)
  const [solar, setSolar] = useState(tariff.defaultSolar)
  const [active, setActive] = useState<number | null>(null)
  const ids = { use: useId(), solar: useId() }

  const solarKwh = Math.min(solar, use)
  const bought = use - solarKwh
  const before = monthlyBill(use)
  const after = monthlyBill(bought)
  const saved = before - after

  // Bậc cao nhất đang dùng là bậc mặc định của dòng chi tiết khi chưa rê chuột vào cột nào.
  const topTier = RESIDENTIAL_TIERS.findIndex((t) => t.to === null || use <= t.to)
  const shown = active ?? topTier

  const onUseChange = (v: number) => {
    setUse(v)
    if (solar > v) setSolar(v)
  }

  return (
    <div className={cx('grid grid-cols-4 gap-x-4 gap-y-8 lg:grid-cols-12 lg:gap-x-6', className)}>
      <div className="col-span-4 flex flex-col gap-6 lg:col-span-5">
        <Slider
          id={ids.use}
          label={tariff.useLabel}
          value={use}
          min={tariff.useMin}
          max={tariff.useMax}
          onChange={onUseChange}
        />
        <Slider id={ids.solar} label={tariff.solarLabel} value={solarKwh} min={0} max={use} onChange={setSolar} />

        <p aria-live="polite" className="ld-lede text-fg-2">
          {solarKwh > 0 ? (
            <>
              Tiền điện mỗi tháng từ <span className="font-semibold text-fg">{fmt.vnd(before)}</span> còn{' '}
              <span className="font-semibold text-fg">{fmt.vnd(after)}</span>, bớt{' '}
              <span className="font-semibold text-accent">{fmt.vnd(saved)}</span>. Mỗi kWh tấm pin thay đáng{' '}
              {fmt.vnd(saved / solarKwh)}, cao hơn giá trung bình {fmt.vnd(before / use)} của cả hoá đơn.
            </>
          ) : (
            <>
              Tiền điện mỗi tháng: <span className="font-semibold text-fg">{fmt.vnd(before)}</span>. {tariff.noSolar}
            </>
          )}
        </p>
        <p className="ld-meta text-fg-3">{tariff.caveat}</p>
      </div>

      <figure className="col-span-4 min-w-0 lg:col-span-7">
        <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="ld-sub text-fg">{tariff.chartTitle}</span>
          <Legend />
        </figcaption>

        <div
          role="group"
          aria-label={`${tariff.chartTitle}: nhà dùng ${use} kWh, tấm pin thay ${solarKwh} kWh ở các bậc trên cùng`}
          className="flex h-44 items-end gap-0.5 border-b border-line-2 lg:h-52"
        >
          {RESIDENTIAL_TIERS.map((t, i) => (
            <TierColumn
              key={t.from}
              tier={t}
              use={use}
              bought={bought}
              active={shown === i}
              label={tierDetail(i, use, bought)}
              onActivate={() => setActive(i)}
              onDeactivate={() => setActive(null)}
            />
          ))}
        </div>
        <div aria-hidden className="mt-2 flex gap-0.5 ld-meta text-fg-3">
          {RESIDENTIAL_TIERS.map((t) => (
            <span key={t.from} className="min-w-0 flex-1 truncate text-center">
              {tierRange(t)}
            </span>
          ))}
        </div>

        {/* Lớp hover: rê chuột hay tab vào một cột thì dòng này nói bậc đó. Trình đọc màn hình nhận cùng câu qua nhãn của cột. */}
        <p aria-hidden className="mt-4 min-h-12 ld-body text-fg-2">
          {tierDetail(shown, use, bought)}
        </p>

        <details className="faq-item group mt-3">
          <summary className="inline-flex min-h-7 cursor-pointer list-none items-center gap-2 ld-meta text-fg-2 hover:text-fg">
            {tariff.tableToggle}
            <svg aria-hidden viewBox="0 0 20 20" className="size-4 transition-transform duration-200 ease-ld group-open:rotate-180">
              <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <table className="mt-3 w-full max-w-md text-left ld-meta">
            <thead className="text-fg-3">
              <tr>
                <th scope="col" className="border-b border-line-2 py-2 font-normal">{tariff.tableHead[0]}</th>
                <th scope="col" className="border-b border-line-2 py-2 font-normal">{tariff.tableHead[1]}</th>
                <th scope="col" className="border-b border-line-2 py-2 text-right font-normal">{tariff.tableHead[2]}</th>
              </tr>
            </thead>
            <tbody className="text-fg">
              {RESIDENTIAL_TIERS.map((t, i) => (
                <tr key={t.from}>
                  <td className="border-b border-line py-2">Bậc {i + 1}</td>
                  <td className="border-b border-line py-2">{tierRange(t)} kWh</td>
                  <td className="border-b border-line py-2 text-right">{fmt.vnNum(t.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 ld-meta text-fg-3">
            {tariff.sourcePrefix}{' '}
            <a href={TARIFF_SOURCE.href} target="_blank" rel="noreferrer" className={TEXT_LINK}>
              {TARIFF_SOURCE.label}
            </a>{' '}
            ({TARIFF_SOURCE.host})
          </p>
        </details>
      </figure>
    </div>
  )
}

function Slider({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="ld-body text-fg">
          {label}
        </label>
        <output htmlFor={id} className="ld-sub text-fg">
          {fmt.vnNum(value)} kWh
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={10}
        value={value}
        aria-valuetext={`${value} kWh`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-11 w-full cursor-pointer accent-accent lg:h-8"
      />
    </div>
  )
}

/*
  Một bậc: cao theo đơn giá, chia ngang theo kWh trong bậc – phần mua từ lưới, phần tấm pin thay,
  phần chưa dùng tới. Bậc 6 không có trần nên lấy phần dùng thực tế (tối thiểu 100 kWh) làm bề ngang.
*/
function TierColumn({
  tier,
  use,
  bought,
  active,
  label,
  onActivate,
  onDeactivate,
}: {
  tier: Tier
  use: number
  bought: number
  active: boolean
  label: string
  onActivate: () => void
  onDeactivate: () => void
}) {
  const span = (tier.to ?? Math.max(use, tier.from + 100)) - tier.from
  const grid = kwhInTier(tier, 0, bought)
  const solar = kwhInTier(tier, bought, use)
  const pct = (n: number) => `${(n / span) * 100}%`

  return (
    <div
      role="img"
      aria-label={label}
      tabIndex={0}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className="relative flex min-w-0 flex-1 flex-col justify-end self-stretch rounded-t-control outline-offset-2"
    >
      <span className={cx('mb-1 text-center ld-meta', active ? 'font-semibold text-fg' : 'text-fg-2')}>
        {fmt.vnNum(tier.price)}
      </span>
      <div
        className={cx(
          'flex overflow-hidden rounded-t-control border border-b-0 bg-canvas',
          active ? 'border-fg-2' : 'border-line',
        )}
        // Chiều cao là dữ liệu (đơn giá) nên đặt inline; trừ 28px của nhãn giá phía trên.
        style={{ height: `calc((100% - 28px) * ${tier.price / MAX_PRICE})` }}
      >
        {grid > 0 && <span className="h-full bg-line-2" style={{ width: pct(grid) }} />}
        {solar > 0 && <span className="h-full bg-accent" style={{ width: pct(solar) }} />}
      </div>
    </div>
  )
}

/** Câu mô tả một bậc cho dòng chi tiết và nhãn của cột. */
function tierDetail(index: number, use: number, bought: number) {
  const t = RESIDENTIAL_TIERS[index]!
  const used = kwhInTier(t, 0, use)
  const solar = kwhInTier(t, bought, use)
  const head = `Bậc ${index + 1} (${tierRange(t)} kWh), ${fmt.vnNum(t.price)} đ/kWh`
  if (used === 0) return `${head}: nhà dùng ${use} kWh nên chưa tới bậc này.`
  if (solar === 0) return `${head}: nhà mua ${used} kWh từ lưới ở bậc này.`
  if (solar === used) return `${head}: cả ${used} kWh ở bậc này do tấm pin thay.`
  return `${head}: nhà dùng ${used} kWh, trong đó tấm pin thay ${solar} kWh.`
}

function Legend() {
  return (
    <span className="flex flex-wrap gap-x-4 gap-y-1 ld-meta text-fg-2">
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="size-3 rounded-control bg-line-2" />
        {tariff.legend.grid}
      </span>
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="size-3 rounded-control bg-accent" />
        {tariff.legend.solar}
      </span>
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="size-3 rounded-control border border-line-2 bg-canvas" />
        {tariff.legend.unused}
      </span>
    </span>
  )
}
