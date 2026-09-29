import { Link } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { cx } from '@/lib/cx'
import { start } from '@/lib/mock/landing'
import { ReconcilePair } from './reconcile-pair'
import { PAGE_GRID, TEXT_LINK, ctaClass } from './classes'
import { Section, SectionTitle } from './section'

/*
  Khối trình tự duy nhất của trang, đặt cuối khi giá trị đã rõ: bốn thứ cần chuẩn bị (không số,
  vì người đọc cần biết chuẩn bị gì chứ không cần thứ tự form) và một câu về việc xảy ra sau đó.
  Cặp rỗng lặp lại bố cục màn đầu: vế trái là số người đọc sắp khai.
*/
export function StartSection() {
  return (
    <Section id="bat-dau" space="near" titleId="start-title">
      <div className={cx(PAGE_GRID, 'gap-y-10')}>
        <div className="col-span-4 lg:col-span-6">
          <SectionTitle id="start-title">{start.title}</SectionTitle>
          <ul className="mt-6 flex flex-col gap-4 ld-body text-fg lg:mt-8">
            {start.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="col-span-4 lg:col-span-6 lg:pt-2">
          <ReconcilePair {...start.pair} sample={false} />
          <div className="mt-6 flex flex-col gap-3 sm:items-start">
            <Link to={ROUTES.REGISTER} className={ctaClass()}>
              {start.cta}
            </Link>
            <p className="ld-meta text-fg-2">{start.emailNote}</p>
          </div>
          <p className="mt-6 max-w-copy ld-body text-fg-2">{start.after}</p>
          <p className="mt-3 ld-meta text-fg-2">
            {start.hasAccount}{' '}
            <Link to={ROUTES.LOGIN} className={TEXT_LINK}>
              {start.login}
            </Link>
          </p>
        </div>
      </div>
    </Section>
  )
}
