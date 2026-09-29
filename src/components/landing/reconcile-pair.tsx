import { cx } from '@/lib/cx'
import { SAMPLE_LABEL, type PendingReading, type PhotoReading, type Reading, type Rich as RichValue } from '@/lib/mock/landing'
import { PhotoSlot } from './photo-slot'
import { Rich } from './rich'

type Side = Reading | PendingReading | PhotoReading

/*
  Cặp đối chiếu – yếu tố nhận diện của landing. Luật nội dung:
    - vế trái luôn là điều chủ nhà đã khai hoặc đã được báo TRƯỚC; vế phải là điều đo hoặc ghi lại;
    - hai vế cùng cỡ, chỉ khác weight (300 / 600) và độ đậm của mực; số khai không gạch ngang;
    - chênh lệch khác 0 thì luôn có câu xử lý; chưa đo thì vế phải là trạng thái, đường nét đứt.
  Hình học (đường gióng, đường kích thước, vạch xiên) ở src/styles/landing.css (.pair*).
*/
export function ReconcilePair({
  quantity,
  declared,
  measured,
  delta,
  note,
  size = 'm',
  sample = true,
  className,
}: {
  quantity: string
  declared: Side
  measured: Side
  delta?: string
  note?: RichValue
  size?: 'l' | 'm'
  /** Tắt khi cặp là khuôn trống chờ số của người đọc, không phải dữ liệu mẫu. */
  sample?: boolean
  className?: string
}) {
  const kind = 'photo' in declared ? 'photo' : 'unit' in declared && declared.unit ? 'number' : 'text'
  const pending = 'pending' in measured

  return (
    <figure className={cx('pair', className)}>
      <figcaption className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="ld-sub text-fg">{quantity}</span>
        {sample && <span className="ld-meta text-fg-3">{SAMPLE_LABEL}</span>}
      </figcaption>
      <div className="pair-grid" data-kind={kind}>
        <dl className="pair-a">
          <dt className="ld-meta text-fg-2">{declared.by}</dt>
          <dd className={valueClass(kind, size, 'declared')}>
            <SideValue side={declared} />
          </dd>
        </dl>
        <dl className="pair-b">
          <dt className="ld-meta text-fg-2">{measured.by}</dt>
          <dd className={pending ? 'ld-sub text-fg-3' : valueClass(kind, size, 'measured')}>
            <SideValue side={measured} />
          </dd>
        </dl>
        <div className="pair-dim" data-pending={pending || undefined}>
          <span className="pair-line" aria-hidden />
          {delta && (
            <p className="pair-delta ld-sub">
              <span className="sr-only">Chênh lệch: </span>
              {delta}
            </p>
          )}
        </div>
        {note && (
          <p className="pair-note ld-body text-fg-2">
            <Rich value={note} />
          </p>
        )}
      </div>
    </figure>
  )
}

function valueClass(kind: 'number' | 'text' | 'photo', size: 'l' | 'm', side: 'declared' | 'measured') {
  if (kind === 'photo') return undefined
  const ink = side === 'declared' ? 'font-light text-fg-2' : 'font-semibold text-fg'
  if (kind === 'text') return cx('ld-num-text', ink)
  return cx(size === 'l' ? 'ld-num-l' : 'ld-num-m', ink)
}

function SideValue({ side }: { side: Side }) {
  if ('photo' in side) return <PhotoSlot need={side.photo} className="aspect-4/3" />
  if ('pending' in side) return <>{side.pending}</>
  // Ký hiệu độ đi liền số ở cỡ đầy đủ; đơn vị chữ (m², tấm) nhỏ lại để số dẫn mắt.
  if (side.unit === '°') return <>{side.value}°</>
  return (
    <>
      {side.value}
      {side.unit && <span className="pair-unit">{side.unit}</span>}
    </>
  )
}
