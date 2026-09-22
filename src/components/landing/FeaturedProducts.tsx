import { Link } from 'react-router'
import { LANDING_CONTAINER, LandingSection } from '@/components/landing/section'
import { Icon } from '@/components/stitch-ui/Icon'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'
import { featuredProducts } from '@/lib/mock/landing'

/** Khối 7 của landing_home: 3 sản phẩm tiêu biểu. */
export function FeaturedProducts() {
  const { eyebrow, title, allLink, detailLabel, items } = featuredProducts

  return (
    <LandingSection id="products" tone="low">
      <div className={cn('flex flex-col gap-space-2xl', LANDING_CONTAINER)}>
        <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div className="flex flex-col gap-space-2xs">
            <span className="text-label-lg uppercase tracking-wider text-primary-container">{eyebrow}</span>
            <h2 className="text-headline-xl-mobile text-primary md:text-headline-xl">{title}</h2>
          </div>
          <Link
            to={ROUTES.COMING_SOON}
            className="inline-flex items-center gap-space-xs text-label-lg text-primary-container transition-colors hover:text-primary"
          >
            <span>{allLink}</span>
            <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
          {items.map((product) => (
            <div
              key={product.id}
              className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-space-sm">
                <div className="h-48 w-full overflow-hidden rounded-xl bg-surface-container">
                  <img src={product.image.src} alt={product.image.alt} className="h-full w-full object-cover" />
                </div>
                <span className="text-label-sm text-on-surface-variant">{product.category}</span>
                <h3 className="text-headline-md text-primary">{product.name}</h3>
                <p className="text-body-sm text-on-surface-variant">{product.description}</p>
              </div>
              <div className="flex items-center justify-between pt-space-md">
                <span className="rounded-full bg-surface-container px-3 py-1 text-label-md text-primary">
                  {product.badge}
                </span>
                <Link
                  to={ROUTES.COMING_SOON}
                  className="text-label-lg text-primary-container hover:underline"
                >
                  {detailLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LandingSection>
  )
}
