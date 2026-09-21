import { Link } from 'react-router'
import { LANDING_CONTAINER, LandingSection } from '@/components/landing/section'
import { Icon } from '@/components/ui/Icon'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'
import { surveySteps } from '@/lib/mock/landing'

/** Khối 2 của landing_home: khảo sát sơ bộ 3 bước. */
export function SurveySteps() {
  const { eyebrow, title, description, cta, steps } = surveySteps

  return (
    <LandingSection id="survey" tone="low" spacing="2xl">
      <div className={cn('flex flex-col gap-space-xl', LANDING_CONTAINER)}>
        <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div className="flex flex-col gap-space-2xs">
            <span className="text-label-lg uppercase tracking-wider text-primary-container">{eyebrow}</span>
            <h2 className="text-headline-xl-mobile text-primary md:text-headline-xl">{title}</h2>
          </div>
          <p className="max-w-md text-body-md text-on-surface-variant">{description}</p>
        </div>

        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high text-headline-md text-primary">
                {step.number}
              </div>
              <h3 className="mb-space-xs text-headline-md text-primary">{step.title}</h3>
              <p className="text-body-md text-on-surface-variant">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-space-xs">
          <Link
            to={ROUTES.COMING_SOON}
            className="inline-flex items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-2xl py-3.5 text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary hover:shadow"
          >
            <span>{cta}</span>
            <Icon name="solar_power" className="text-[18px]" />
          </Link>
        </div>
      </div>
    </LandingSection>
  )
}
