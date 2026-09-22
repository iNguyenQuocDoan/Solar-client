import { LANDING_CONTAINER, LandingSection, SectionHeading } from '@/components/landing/section'
import { Icon } from '@/components/stitch-ui/Icon'
import { cn } from '@/lib/cn'
import { journey } from '@/lib/mock/landing'

/** Khối 5 của landing_home: hành trình khách hàng 8 bước (lưới 4 cột). */
export function JourneySteps() {
  const { eyebrow, title, description, steps } = journey

  return (
    <LandingSection id="process">
      <div className={cn('flex flex-col gap-space-2xl', LANDING_CONTAINER)}>
        <SectionHeading align="center" eyebrow={eyebrow} title={title} description={description} />

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.step}
              className="relative flex flex-col gap-space-xs rounded-xl bg-surface-container-lowest p-space-md shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-label-md text-on-primary">
                  {step.step}
                </span>
                <Icon name={step.icon} className="text-[20px] text-primary-container" />
              </div>
              <h4 className="mt-2 text-headline-md text-on-surface">{step.title}</h4>
              <p className="text-body-sm text-on-surface-variant">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </LandingSection>
  )
}
