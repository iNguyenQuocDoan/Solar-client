import { cx } from '@/utils/cx'
import { trust } from '@/data/landing'
import { PAGE_GRID } from './classes'
import { LandingPhoto } from './photo'
import { Reveal } from './reveal'
import { Section, SectionTitle } from './section'

/* Vì sao tin: split – ảnh người thật làm việc bên trái chiếm nhiều chỗ hơn, lý do bên phải. */
export function TrustSection() {
  return (
    <Section id={trust.id} space="far" titleId="trust-title">
      <div className={cx(PAGE_GRID, 'gap-y-10 lg:items-center')}>
        <Reveal className="col-span-4 lg:col-span-6">
          <div className="aspect-4/5 overflow-hidden rounded-container">
            <LandingPhoto shot={trust.photo} sizes="(width >= 64rem) 50vw, 100vw" />
          </div>
        </Reveal>
        <div className="col-span-4 lg:col-span-5 lg:col-start-8">
          <Reveal>
            <SectionTitle id="trust-title">{trust.title}</SectionTitle>
          </Reveal>
          <div className="mt-8 flex flex-col gap-6">
            {trust.points.map((point, i) => (
              <Reveal key={point.title} delay={100 * (i + 1)}>
                <h3 className="ld-sub text-fg">{point.title}</h3>
                <p className="mt-1 ld-body text-fg-2">{point.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
