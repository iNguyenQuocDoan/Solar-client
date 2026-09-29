import { cx } from '@/lib/cx'
import { benefits } from '@/lib/mock/landing'
import { PAGE_GRID } from './classes'
import { Section, SectionTitle } from './section'

/*
  Doanh nghiệp nhận được gì: section chỉ có chữ để xen giữa các section nhiều ảnh. Lợi ích đứng hàng
  lớn, trọn gói nhỏ hơn bên dưới. Không con số nào chưa có nguồn.
*/
export function BenefitsSection() {
  return (
    <Section id={benefits.id} space="far" titleId="benefits-title">
      <SectionTitle id="benefits-title">{benefits.title}</SectionTitle>
      <div className={cx(PAGE_GRID, 'mt-10 gap-y-10 lg:mt-14')}>
        {benefits.items.map((item) => (
          <div key={item.title} className="col-span-4">
            <h3 className="ld-h2 text-fg">{item.title}</h3>
            <p className="mt-3 max-w-copy ld-body text-fg-2">{item.text}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-20 ld-sub text-fg lg:mt-24">{benefits.offerTitle}</h3>
      <div className={cx(PAGE_GRID, 'mt-6 gap-y-6')}>
        {benefits.offer.map((group) => (
          <div key={group.title} className="col-span-4 border-t border-line-2 pt-5">
            <p className="ld-body font-semibold text-fg">{group.title}</p>
            <p className="mt-2 ld-body text-fg-2">{group.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
