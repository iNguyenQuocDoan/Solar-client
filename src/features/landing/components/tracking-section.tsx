import { Progress } from '@/components/common/ui/lists'
import { cx } from '@/utils/cx'
import { tracking } from '@/data/landing'
import { PAGE_GRID } from './classes'
import { LandingPhoto } from './photo'
import { Reveal } from './reveal'
import { Section, SectionTitle } from './section'

/*
  Theo dõi dự án ra sao: section DUY NHẤT có giao diện hệ thống, và chỉ một thẻ công trình gọn
  (giai đoạn, số tấm đã lên mái, ảnh cập nhật, việc tiếp theo) – không bảng, không phiếu.
*/
export function TrackingSection() {
  const { card } = tracking
  const pct = Math.round((card.progress.done / card.progress.total) * 100)
  return (
    <Section id={tracking.id} space="far" titleId="tracking-title">
      <div className={cx(PAGE_GRID, 'gap-y-10 lg:items-center')}>
        <Reveal className="col-span-4 lg:col-span-5">
          <SectionTitle id="tracking-title">{tracking.title}</SectionTitle>
          <ul className="mt-8 flex flex-col gap-4">
            {tracking.points.map((point) => (
              <li key={point} className="border-t border-line pt-4 ld-body text-fg">
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150} className="col-span-4 lg:col-span-6 lg:col-start-7">
          <figure>
          <div className="rounded-container border border-line bg-canvas p-5 lg:p-8">
            <p className="text-meta text-fg-3">{card.project}</p>
            <p className="mt-1 text-title font-semibold text-fg">{card.stage}</p>
            <div className="mt-4 flex items-baseline justify-between gap-4 text-meta text-fg-2">
              <span>{card.progress.text}</span>
              <span className="tnum">{pct}%</span>
            </div>
            <Progress value={pct} label={card.progress.text} className="mt-2" />
            <div className="mt-6 grid grid-cols-5 gap-4">
              <div className="col-span-2 aspect-4/3 overflow-hidden rounded-container">
                <LandingPhoto shot={card.photo} />
              </div>
              <div className="col-span-3">
                <p className="text-meta text-fg-3">{card.update.when}</p>
                <p className="mt-1 text-body text-fg">{card.update.text}</p>
              </div>
            </div>
            <p className="mt-6 border-t border-line pt-4 text-body text-fg-2">{card.next}</p>
          </div>
          <figcaption className="mt-3 ld-meta text-fg-3">{card.label}</figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  )
}
