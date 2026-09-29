import { Link } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { cx } from '@/lib/cx'
import { fit } from '@/lib/mock/landing'
import { TEXT_LINK } from './classes'
import { Rich } from './rich'
import { Section, SectionTitle } from './section'

/*
  Nhà nào hợp: ba điều kiện đứng song song, viết thành đoạn văn chứ không thành thẻ, vì mỗi
  điều kiện cần một câu giải thích chứ không phải một icon.
*/
export function FitSection() {
  return (
    <Section id={fit.id} space="far" titleId="fit-title">
      <SectionTitle id="fit-title">{fit.title}</SectionTitle>
      <div className="mt-8 flex max-w-3xl flex-col gap-6 lg:mt-10">
        {fit.points.map((point) => (
          <p key={point.lead} className="ld-lede text-fg-2">
            <span className="font-semibold text-fg">{point.lead}. </span>
            <Rich value={point.text} />
          </p>
        ))}
        <p className="ld-body text-fg-2">
          <Link to={ROUTES.REGISTER} className={cx(TEXT_LINK, 'inline-block py-1')}>
            {fit.more}
          </Link>
        </p>
      </div>
    </Section>
  )
}
