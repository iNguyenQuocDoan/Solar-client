import { Link } from 'react-router'
import { LANDING_CONTAINER, LandingSection } from '@/components/landing/section'
import { Icon } from '@/components/ui/Icon'
import { ROUTES } from '@/constants/routes'
import { afterSales } from '@/lib/mock/landing'

/** Khối 8 của landing_home: hậu mãi số hóa + thẻ "Sổ bảo hành số". */
export function AfterSales() {
  const { eyebrow, title, description, cta, features, warrantyCard } = afterSales

  return (
    <LandingSection id="after-sales">
      <div className={LANDING_CONTAINER}>
        <div className="rounded-3xl bg-surface-container-high p-space-xl shadow-md lg:p-space-2xl">
          <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
            <div className="flex flex-col gap-space-md lg:col-span-7">
              <span className="text-label-lg uppercase tracking-wider text-primary">{eyebrow}</span>
              <h2 className="text-headline-xl-mobile text-primary md:text-headline-xl">{title}</h2>
              <p className="text-body-lg text-on-surface-variant">{description}</p>

              <div className="grid grid-cols-1 gap-space-sm pt-space-xs sm:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-space-xs">
                    <Icon name={feature.icon} className="shrink-0 text-[22px] text-primary-container" />
                    <div>
                      <h4 className="text-label-lg text-on-surface">{feature.title}</h4>
                      <p className="text-body-sm text-on-surface-variant">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-space-xs">
                <Link
                  to={ROUTES.COMING_SOON}
                  className="inline-flex items-center justify-center rounded-xl bg-primary-container px-space-lg py-3 text-label-lg text-on-primary shadow-sm transition-all hover:bg-primary"
                >
                  {cta}
                </Link>
              </div>
            </div>

            {/* Thẻ "Sổ bảo hành số" */}
            <div className="flex justify-center lg:col-span-5">
              <div className="flex w-full max-w-sm flex-col gap-space-sm rounded-2xl bg-surface-container-lowest p-space-md shadow-xl">
                <div className="flex items-center justify-between border-b border-surface-container pb-space-xs">
                  <div className="flex items-center gap-space-2xs">
                    <span className="h-3 w-3 rounded-full bg-tertiary" />
                    <span className="text-label-md text-primary">{warrantyCard.title}</span>
                  </div>
                  <span className="rounded bg-surface-container px-2 py-0.5 text-label-sm text-primary-container">
                    {warrantyCard.status}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-body-sm text-on-surface-variant">{warrantyCard.systemCodeLabel}</span>
                  <span className="text-headline-md text-primary">{warrantyCard.systemCode}</span>
                </div>

                <div className="flex flex-col gap-1 rounded-xl bg-surface-container-low p-space-sm">
                  {warrantyCard.rows.map((row) => (
                    <div key={row.label} className="flex justify-between text-body-sm">
                      <span className="text-on-surface-variant">{row.label}</span>
                      <span className="font-semibold text-primary">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-space-xs rounded-lg bg-surface-container-high p-space-xs text-body-sm text-primary">
                  <Icon name={warrantyCard.nextVisit.icon} className="text-[18px]" />
                  <span>{warrantyCard.nextVisit.text}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LandingSection>
  )
}
