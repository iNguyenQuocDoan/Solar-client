import { Link } from 'react-router'
import { LANDING_CONTAINER, LandingSection } from '@/components/landing/section'
import { Icon } from '@/components/ui/Icon'
import { ROUTES } from '@/constants/routes'
import { ctaBanner } from '@/lib/mock/landing'

/** Khối 10 của landing_home: banner chốt đơn nền primary-container. */
export function CtaBanner() {
  const { badge, title, description, primaryCta, secondaryCta, assurances } = ctaBanner

  return (
    <LandingSection id="cta">
      <div className={LANDING_CONTAINER}>
        <div className="relative flex flex-col items-center gap-space-lg overflow-hidden rounded-3xl bg-primary-container p-space-xl text-center text-on-primary shadow-xl md:p-space-3xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-secondary-container/20 blur-2xl" />

          <div className="flex max-w-2xl flex-col items-center gap-space-xs">
            <span className="mb-2 inline-block rounded-full bg-white/10 px-3.5 py-1 text-label-sm text-on-primary backdrop-blur-md">
              {badge}
            </span>
            <h2 className="text-display-lg-mobile tracking-tight text-on-primary md:text-display-lg">{title}</h2>
            <p className="mt-2 text-body-xl text-on-primary/90">{description}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-xs">
            <Link
              to={ROUTES.COMING_SOON}
              className="inline-flex items-center justify-center gap-space-xs rounded-xl bg-surface-container-lowest px-space-2xl py-4 text-label-lg text-primary shadow-lg transition-all hover:bg-surface-container-low hover:shadow-xl"
            >
              <span>{primaryCta}</span>
              <Icon name="solar_power" className="text-[20px]" />
            </Link>
            <a
              href="tel:19006868"
              className="inline-flex items-center justify-center rounded-xl bg-white/10 px-space-xl py-4 text-label-lg text-on-primary backdrop-blur-md transition-all hover:bg-white/20"
            >
              {secondaryCta}
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs text-body-sm text-on-primary/80">
            {assurances.map((assurance) => (
              <span key={assurance} className="flex items-center gap-1">
                <Icon name="check" className="text-[16px] text-tertiary-fixed" />
                {assurance}
              </span>
            ))}
          </div>
        </div>
      </div>
    </LandingSection>
  )
}
