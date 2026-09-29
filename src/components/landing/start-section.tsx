import { Link } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { cx } from '@/lib/cx'
import { start } from '@/lib/mock/landing'
import { PAGE_GRID, TEXT_LINK, ctaClass } from './classes'
import { Section, SectionTitle } from './section'

/*
  Hành động cuối trang: bốn thứ cần chuẩn bị (không số – người đọc cần biết chuẩn bị gì,
  không cần thứ tự form) và một câu về việc xảy ra sau đó. Đây là chỗ duy nhất trên trang
  nói tới trình tự, và nó ngắn.
*/
export function StartSection() {
  return (
    <Section id={start.id} space="near" titleId="start-title">
      <div className={cx(PAGE_GRID, 'gap-y-8 border-t border-line pt-12 lg:pt-16')}>
        <div className="col-span-4 lg:col-span-6">
          <SectionTitle id="start-title">{start.title}</SectionTitle>
          <ul className="mt-6 flex flex-col gap-3 ld-body text-fg lg:mt-8">
            {start.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="col-span-4 flex flex-col gap-3 sm:items-start lg:col-span-5 lg:col-start-8 lg:self-end">
          <Link to={ROUTES.REGISTER} className={ctaClass()}>
            {start.cta}
          </Link>
          <p className="ld-meta text-fg-2">{start.emailNote}</p>
          <p className="mt-3 max-w-copy ld-body text-fg-2">{start.after}</p>
          <p className="ld-meta text-fg-2">
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
