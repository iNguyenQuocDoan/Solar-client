import { cx } from '@/lib/cx'
import { projects } from '@/lib/mock/landing'
import { PAGE_GRID } from './classes'
import { LandingPhoto } from './photo'
import { Section, SectionTitle } from './section'

/*
  Công trình trông như thế nào: một ảnh lớn và hai ảnh nhỏ (bất đối xứng theo độ quan trọng),
  rồi một cặp trước/sau. Chú thích chỉ ghi loại công trình.
*/
export function ProjectsSection() {
  const { featured, others, beforeAfter } = projects
  return (
    <Section id={projects.id} space="far" titleId="projects-title">
      <SectionTitle id="projects-title">{projects.title}</SectionTitle>

      <div className={cx(PAGE_GRID, 'mt-8 gap-y-6 lg:mt-12')}>
        <figure className="col-span-4 lg:col-span-8">
          <div className="aspect-4/3 overflow-hidden rounded-container">
            <LandingPhoto shot={featured.shot} sizes="(width >= 64rem) 66vw, 100vw" />
          </div>
          <figcaption className="mt-3 ld-sub text-fg">{featured.label}</figcaption>
        </figure>
        <div className="col-span-4 grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6">
          {others.map((item) => (
            <figure key={item.label}>
              <div className="aspect-4/3 overflow-hidden rounded-container">
                <LandingPhoto shot={item.shot} sizes="(width >= 64rem) 33vw, 50vw" />
              </div>
              <figcaption className="mt-3 ld-sub text-fg">{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <figure className="mt-16 lg:mt-24">
        <div className="grid grid-cols-2 gap-2">
          {[beforeAfter.before, beforeAfter.after].map((shot, i) => (
            <div key={shot.alt} className="relative aspect-3/2 overflow-hidden rounded-container">
              <LandingPhoto shot={shot} sizes="50vw" />
              <span className="absolute top-3 left-3 rounded-control bg-canvas px-2 py-1 ld-meta font-semibold text-fg">
                {i === 0 ? 'Trước' : 'Sau'}
              </span>
            </div>
          ))}
        </div>
        <figcaption className="mt-3 ld-body text-fg-2">{beforeAfter.caption}</figcaption>
      </figure>
    </Section>
  )
}
