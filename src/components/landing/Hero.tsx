import { Link } from 'react-router'
import { LANDING_CONTAINER } from '@/components/landing/section'
import { Icon } from '@/components/ui/Icon'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'
import { heroContent } from '@/lib/mock/landing'

/** Khối 1 của landing_home: messaging bên trái + ảnh kèm 2 overlay bên phải. */
export function Hero({ onViewSolutions }: { onViewSolutions: () => void }) {
  const { badge, title, description, primaryCta, secondaryCta, stats, image, savingsOverlay, monitorOverlay } =
    heroContent

  return (
    <section id="top" className="relative w-full overflow-hidden scroll-mt-20 pb-space-3xl pt-space-xl">
      <div className="pointer-events-none absolute -right-36 -top-36 h-96 w-96 rounded-full bg-primary-fixed/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 rounded-full bg-secondary-fixed/25 blur-3xl" />

      <div className={LANDING_CONTAINER}>
        <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
          <div className="flex flex-col items-start gap-space-md lg:col-span-6">
            <div className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-high px-space-sm py-1.5 text-label-sm text-primary shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-secondary-container" />
              <span>{badge}</span>
            </div>

            <h1 className="text-display-lg-mobile tracking-tight text-primary md:text-display-lg">{title}</h1>
            <p className="max-w-xl text-body-xl text-on-surface-variant">{description}</p>

            <div className="flex w-full flex-wrap items-center gap-space-sm pt-space-xs sm:w-auto">
              <Link
                to={ROUTES.COMING_SOON}
                className="inline-flex w-full items-center justify-center gap-space-xs rounded-xl bg-primary-container px-space-xl py-3.5 text-label-lg text-on-primary shadow-md transition-all hover:bg-primary hover:shadow-lg sm:w-auto"
              >
                <span>{primaryCta}</span>
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
              <button
                type="button"
                onClick={onViewSolutions}
                className="inline-flex w-full items-center justify-center rounded-xl bg-surface-container-lowest px-space-lg py-3.5 text-label-lg text-primary-container shadow-sm transition-all hover:bg-surface-container-low sm:w-auto"
              >
                {secondaryCta}
              </button>
            </div>

            <div className="grid w-full max-w-lg grid-cols-3 gap-space-sm pt-space-md">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-headline-lg font-bold text-primary">{stat.value}</span>
                  <span className="text-body-sm text-on-surface-variant">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative h-[460px] w-full overflow-hidden rounded-2xl bg-surface-container-low shadow-xl md:h-[520px]">
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

              {/* Overlay 1 – tiết kiệm hóa đơn */}
              <div className="absolute left-6 top-6 flex max-w-[240px] items-center gap-space-sm rounded-xl bg-surface-container-lowest/95 p-space-sm shadow-md backdrop-blur-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
                  <Icon name={savingsOverlay.icon} className="text-[22px]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-label-sm text-on-surface-variant">{savingsOverlay.label}</span>
                  <span className="text-label-lg text-primary">{savingsOverlay.value}</span>
                </div>
              </div>

              {/* Overlay 2 – giám sát thời gian thực */}
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-space-xs rounded-2xl bg-surface-container-lowest/95 p-space-md shadow-xl backdrop-blur-md md:right-auto md:w-80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="h-2.5 w-2.5 animate-ping rounded-full bg-secondary-container" />
                    <span className="text-label-md text-primary">{monitorOverlay.title}</span>
                  </div>
                  <span className="text-label-sm text-on-surface-variant">{monitorOverlay.realtimeLabel}</span>
                </div>
                <div className="flex items-baseline justify-between pt-space-2xs">
                  <div>
                    <span className="text-data-metric text-primary">{monitorOverlay.metric}</span>
                    <span className="ml-1 text-label-md text-on-surface-variant">{monitorOverlay.metricUnit}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-label-sm text-on-surface-variant">{monitorOverlay.dailyLabel}</span>
                    <p className="text-label-lg text-primary">{monitorOverlay.dailyValue}</p>
                  </div>
                </div>
                <div className={cn('mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-container')}>
                  <div
                    className="h-full rounded-full bg-primary-container"
                    style={{ width: `${monitorOverlay.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
