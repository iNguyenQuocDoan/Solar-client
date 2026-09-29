import { cx } from '@/lib/cx'
import { survey } from '@/lib/mock/landing'
import { PhotoSlot } from './photo-slot'
import { ReconcilePair } from './reconcile-pair'
import { PAGE_GRID } from './classes'
import { Section, SectionTitle } from './section'

/*
  Ba trường còn lại của cùng phiếu khảo sát với cặp ở màn đầu, nên đứng gần (near).
  Cặp không nằm trong khung tài khoản: bảng "bạn khai / đo tại mái" hiện chỉ có ở portal kỹ thuật
  và quản lý, chủ nhà chưa xem được trong /customer (brief §4).
*/
export function SurveySection() {
  return (
    <Section id="so-do" space="near" titleId="survey-title">
      <SectionTitle id="survey-title">{survey.title}</SectionTitle>
      <div className={cx(PAGE_GRID, 'mt-8 gap-y-10 lg:mt-10')}>
        <div className="col-span-4 flex flex-col gap-10 lg:col-span-8 lg:gap-12">
          {survey.pairs.map((pair) => (
            <ReconcilePair key={pair.quantity} {...pair} />
          ))}
          <p className="ld-meta text-fg-3">{survey.record}</p>
        </div>
        <PhotoSlot need={survey.photo} className="col-span-4 lg:aspect-4/5" />
      </div>
    </Section>
  )
}
