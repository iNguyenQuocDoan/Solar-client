import { LANDING_CONTAINER, LandingSection, SectionHeading } from '@/components/landing/section'
import { Icon } from '@/components/stitch-ui/Icon'
import { cn } from '@/lib/cn'
import { benefits } from '@/lib/mock/landing'

/** Khối 3 của landing_home: 6 lợi ích dạng lưới 3 cột. */
export function Benefits() {
  const { eyebrow, title, description, items } = benefits

  return (
    <LandingSection id="benefits">
      <div className={cn('flex flex-col gap-space-2xl', LANDING_CONTAINER)}>
        <SectionHeading align="center" eyebrow={eyebrow} title={title} description={description} />

        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container text-primary">
                <Icon name={item.icon} className="text-[26px]" />
              </div>
              <h3 className="text-headline-md text-on-surface">{item.title}</h3>
              <p className="text-body-md text-on-surface-variant">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </LandingSection>
  )
}
