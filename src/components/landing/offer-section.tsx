import { cx } from '@/lib/cx'
import { offer } from '@/lib/mock/landing'
import { PAGE_GRID } from './classes'
import { PhotoSlot } from './photo-slot'
import { Rich } from './rich'
import { Section, SectionTitle } from './section'

/*
  Món hàng: một hệ thống trên mái, trình bày như bảng thông số của sản phẩm – các mục đứng
  song song, không đánh số, không theo thứ tự làm việc. Ảnh hệ thống đã lắp đi trước danh sách
  trên mobile vì người mua cần thấy món hàng trước khi đọc thông số.
*/
export function OfferSection() {
  return (
    <Section id={offer.id} space="far" titleId="offer-title">
      <div className={cx(PAGE_GRID, 'gap-y-8')}>
        <div className="col-span-4 lg:col-span-5">
          <SectionTitle id="offer-title">{offer.title}</SectionTitle>
          <PhotoSlot need={offer.photo} className="mt-8 lg:aspect-4/5" />
        </div>
        <dl className="col-span-4 self-end lg:col-span-6 lg:col-start-7">
          {offer.items.map((item) => (
            <div key={item.k} className="grid grid-cols-1 gap-1 border-t border-line py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="ld-body font-semibold text-fg">{item.k}</dt>
              <dd className="ld-body text-fg-2 sm:col-span-2">
                <Rich value={item.v} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
