import { LANDING_CONTAINER, LandingSection } from '@/components/landing/section'
import { Icon } from '@/components/stitch-ui/Icon'
import { whyUs } from '@/lib/mock/landing'
import { cn } from '@/lib/cn'

/** Khối 6 của landing_home: ảnh kỹ sư bên trái + 4 trụ cột giá trị bên phải. */
export function WhyUs() {
  const { eyebrow, title, description, image, certBadge, pillars } = whyUs

  return (
    <LandingSection id="about" tone="lowest">
      <div className={LANDING_CONTAINER}>
        <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <div className="h-96 w-full overflow-hidden rounded-2xl bg-surface-container shadow-lg">
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden max-w-xs flex-col rounded-xl bg-surface p-space-md shadow-xl sm:flex">
              <div className="mb-1 flex items-center gap-space-xs text-primary">
                <Icon name={certBadge.icon} className="text-[20px]" />
                <span className="text-label-md">{certBadge.title}</span>
              </div>
              <p className="text-body-sm text-on-surface-variant">{certBadge.description}</p>
            </div>
          </div>

          <div className="flex flex-col gap-space-lg lg:col-span-7">
            <div className="flex flex-col gap-space-2xs">
              <span className="text-label-lg text-primary-container">{eyebrow}</span>
              <h2 className="text-headline-xl-mobile text-primary md:text-headline-xl">{title}</h2>
              <p className="text-body-md text-on-surface-variant">{description}</p>
            </div>

            <div className={cn('grid grid-cols-1 gap-space-md sm:grid-cols-2')}>
              {pillars.map((pillar) => (
                <div key={pillar.title} className="flex flex-col gap-space-xs rounded-xl bg-surface p-space-md shadow-sm">
                  <Icon name={pillar.icon} className="text-[28px] text-primary" />
                  <h4 className="text-headline-md text-on-surface">{pillar.title}</h4>
                  <p className="text-body-sm text-on-surface-variant">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LandingSection>
  )
}
