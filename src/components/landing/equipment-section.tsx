import { cx } from '@/lib/cx'
import { equipment } from '@/lib/mock/landing'
import { NeedMark, Rich } from './rich'
import { PhotoSlot } from './photo-slot'
import { Section, SectionTitle } from './section'

/*
  Sản phẩm vật lý. Desktop: ảnh tấm pin lớn 4:5 chiếm 7 cột, hai ảnh 4:3 xếp dọc ở 4 cột phải – ba
  cỡ khác nhau, không lưới thẻ đều. Mobile: dải vuốt ngang cùng tỷ lệ 4:5 (.strip trong landing.css).
*/
const LEAD = { slot: 'lg:col-span-7 lg:row-span-2', photo: 'aspect-4/5' }
const SIDE = {
  slot: 'lg:col-span-4 lg:col-start-9',
  photo: 'aspect-4/5 lg:aspect-4/3',
}

export function EquipmentSection() {
  return (
    <Section id={equipment.id} space="far" titleId="equipment-title">
      <SectionTitle id="equipment-title">{equipment.title}</SectionTitle>
      <ul className="strip mt-8 lg:mt-12" tabIndex={0} aria-label={equipment.title}>
        {equipment.items.map((item, i) => {
          const place = i === 0 ? LEAD : SIDE
          return (
            <li key={item.name} className={cx('min-w-0', place.slot)}>
              <PhotoSlot photo={item.photo} className={place.photo} />
              <h3 className="mt-4 ld-sub text-fg">{item.name}</h3>
              <p className="mt-1 max-w-copy ld-body text-fg-2">{item.text}</p>
              <p className="mt-2 ld-meta">
                <NeedMark>{item.spec.need}</NeedMark>
              </p>
            </li>
          )
        })}
      </ul>
      <p className="mt-8 max-w-3xl border-t border-line pt-6 ld-body text-fg-2 lg:mt-12">
        <span className="font-semibold text-fg">{equipment.also.label}:</span>{' '}
        {equipment.also.items.map((parts, i) => (
          <span key={i}>
            {i > 0 && '; '}
            <Rich value={parts} />
          </span>
        ))}
        .
      </p>
    </Section>
  )
}
