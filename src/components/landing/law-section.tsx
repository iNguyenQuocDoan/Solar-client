import { cx } from '@/lib/cx'
import { law } from '@/lib/mock/landing'
import { PAGE_GRID, TEXT_LINK } from './classes'
import { Section, SectionTitle } from './section'

/*
  Hai con số của luật, là số liệu thật duy nhất trên trang nên được in lớn nhất trang. Không thẻ:
  một đường kẻ trên mỗi số, số thứ hai lệch sang phải và thấp hơn để hai số không đọc thành một hàng
  KPI. Mỗi số luôn kèm dòng nguồn.
*/
export function LawSection() {
  return (
    <Section id={law.id} space="far" titleId="law-title">
      <SectionTitle id="law-title">{law.title}</SectionTitle>
      <div className={cx(PAGE_GRID, 'mt-10 gap-y-16 lg:mt-16')}>
        {law.items.map((item, i) => (
          <div
            key={item.figure}
            className={cx('col-span-4 border-t border-line pt-6 lg:col-span-5', i === 1 && 'lg:col-start-8 lg:mt-40')}
          >
            <p className="ld-figure text-fg">
              {item.figure}
              <span className="pair-unit">{item.unit}</span>
            </p>
            <p className="mt-6 max-w-copy ld-lede text-fg">{item.text}</p>
            <p className="mt-4 max-w-copy ld-meta text-fg-2">
              {law.sourcePrefix}{' '}
              <a href={item.source.href} target="_blank" rel="noreferrer" className={TEXT_LINK}>
                {item.source.label}
              </a>{' '}
              ({item.source.host})
            </p>
          </div>
        ))}
      </div>
    </Section>
  )
}
