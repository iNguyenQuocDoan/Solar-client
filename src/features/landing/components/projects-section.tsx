import { cx } from '@/utils/cx'
import { projects, type Shot } from '@/data/landing'
import { PAGE_GRID } from './classes'
import { LandingPhoto } from './photo'
import { Reveal } from './reveal'
import { Section, SectionTitle } from './section'

/* Rê chuột vào ảnh công trình thì ảnh phóng nhẹ trong khung – chỉ transform, không đổi layout. */
const ZOOM = 'transition-transform duration-700 ease-ld group-hover:scale-103'

/*
  Công trình trông như thế nào: một ảnh lớn và hai ảnh nhỏ (bất đối xứng theo độ quan trọng),
  rồi một cặp trước/sau. Chú thích chỉ ghi loại công trình.
*/
export function ProjectsSection() {
  const { featured, others, beforeAfter } = projects
  return (
    <Section id={projects.id} space="far" titleId="projects-title">
      <Reveal>
        <SectionTitle id="projects-title">{projects.title}</SectionTitle>
      </Reveal>

      <div className={cx(PAGE_GRID, 'mt-8 gap-y-6 lg:mt-12')}>
        <Reveal className="col-span-4 lg:col-span-8">
          <ProjectFigure label={featured.label} shot={featured.shot} sizes="(width >= 64rem) 66vw, 100vw" />
        </Reveal>
        <div className="col-span-4 grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6">
          {others.map((item, i) => (
            <Reveal key={item.label} delay={120 * (i + 1)}>
              <ProjectFigure label={item.label} shot={item.shot} sizes="(width >= 64rem) 33vw, 50vw" />
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="mt-16 lg:mt-24">
        <figure>
          <div className="grid grid-cols-2 gap-2">
            {[beforeAfter.before, beforeAfter.after].map((shot, i) => (
              <div key={shot.alt} className="group relative aspect-3/2 overflow-hidden rounded-container">
                <LandingPhoto shot={shot} sizes="50vw" className={ZOOM} />
                <span className="absolute top-3 left-3 rounded-control bg-canvas px-2 py-1 ld-meta font-semibold text-fg">
                  {i === 0 ? 'Trước' : 'Sau'}
                </span>
              </div>
            ))}
          </div>
          <figcaption className="mt-3 ld-body text-fg-2">{beforeAfter.caption}</figcaption>
        </figure>
      </Reveal>
    </Section>
  )
}

function ProjectFigure({ label, shot, sizes }: { label: string; shot: Shot; sizes: string }) {
  return (
    <figure className="group">
      <div className="aspect-4/3 overflow-hidden rounded-container">
        <LandingPhoto shot={shot} sizes={sizes} className={ZOOM} />
      </div>
      <figcaption className="mt-3 ld-sub text-fg">{label}</figcaption>
    </figure>
  )
}
