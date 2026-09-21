import { Link } from 'react-router'
import { LANDING_CONTAINER, LandingSection, SectionHeading } from '@/components/landing/section'
import { Icon } from '@/components/ui/Icon'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'
import { packages } from '@/lib/mock/landing'

/** Khối 4 của landing_home: 3 gói giải pháp, gói giữa nổi bật. */
export function PackageCards() {
  const { eyebrow, title, description, featuredLabel, cta, billLabel, disclaimer, items } = packages

  return (
    <LandingSection id="solutions" tone="low">
      <div className={cn('flex flex-col gap-space-xl', LANDING_CONTAINER)}>
        <SectionHeading align="center" eyebrow={eyebrow} title={title} description={description} />

        <div className="flex items-center gap-space-sm rounded-xl bg-surface-container-highest/80 p-space-md shadow-sm">
          <Icon name={disclaimer.icon} className="shrink-0 text-[22px] text-secondary" />
          <p className="text-body-sm text-on-surface-variant">
            {disclaimer.before}
            <strong>{disclaimer.strong}</strong>
            {disclaimer.after}
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-space-lg lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'relative flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-xl',
                item.featured ? 'shadow-xl' : 'shadow-sm',
              )}
            >
              {item.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-secondary px-4 py-1 text-label-sm text-on-secondary shadow-sm">
                  {featuredLabel}
                </div>
              )}

              <div className={cn('flex flex-col gap-space-md', item.featured && 'pt-2')}>
                <div>
                  <span
                    className={cn(
                      'mb-2 inline-block rounded-full px-3 py-1 text-label-sm',
                      item.featured
                        ? 'bg-primary-fixed text-on-primary-fixed'
                        : 'bg-surface-container text-on-surface-variant',
                    )}
                  >
                    {item.tag}
                  </span>
                  <h3 className="text-headline-lg text-primary">{item.title}</h3>
                  <p className="mt-1 text-body-sm text-on-surface-variant">{item.subtitle}</p>
                </div>

                <div
                  className={cn(
                    'flex flex-col gap-1 rounded-xl p-space-md',
                    item.featured ? 'bg-surface-container-high' : 'bg-surface-container-low',
                  )}
                >
                  <span className="text-body-sm text-on-surface-variant">{billLabel}</span>
                  <span className="text-headline-md text-primary">{item.bill}</span>
                </div>

                <ul className="flex flex-col gap-space-xs text-body-md text-on-surface">
                  {item.features.map((feature) => (
                    <li key={feature.text + feature.strong} className="flex items-center gap-2">
                      <Icon name="check_circle" className="text-[20px] text-primary-container" />
                      <span>
                        {feature.text}
                        {feature.strong && <strong>{feature.strong}</strong>}
                        {feature.after}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-space-lg">
                <Link
                  to={ROUTES.COMING_SOON}
                  className={cn(
                    'inline-flex w-full items-center justify-center rounded-xl px-space-md py-3 text-label-lg transition-colors',
                    item.featured
                      ? 'bg-primary-container text-on-primary shadow-md hover:bg-primary'
                      : 'bg-surface-container text-primary-container hover:bg-surface-container-high',
                  )}
                >
                  {cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LandingSection>
  )
}
