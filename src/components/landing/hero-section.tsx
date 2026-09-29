import { Link } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { cx } from '@/lib/cx'
import { hero } from '@/lib/mock/landing'
import { LANDING_CONTAINER, PAGE_GRID, TEXT_LINK, ctaClass } from './classes'
import { HouseDrawing } from './house-drawing'

/*
  Màn đầu: tên ý tưởng thật lớn ("Điện" / "nhà làm."), một câu nói sản phẩm là gì và cho ai, một nút.
  Hình chính là bản vẽ mặt cắt nhà ống – có ngay, không phải chờ ảnh. Mobile: chữ và nút trước,
  bản vẽ cắt 4:3 chỉ còn phần mái, vẫn nằm trong màn 390 × 664.
*/
export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="pt-6 lg:pt-12">
      <div className={cx(LANDING_CONTAINER, PAGE_GRID, 'gap-y-8')}>
        <div className="col-span-4 lg:col-span-6 lg:pt-16">
          <h1 id="hero-title" className="ld-display text-fg">
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-4 max-w-copy ld-lede text-fg-2 lg:mt-8">{hero.lede}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:mt-10">
            <Link to={ROUTES.REGISTER} className={ctaClass('lg', 'flex sm:inline-flex')}>
              {hero.cta}
            </Link>
            <p className="ld-meta text-fg-2">
              {hero.hasAccount}{' '}
              <Link to={ROUTES.LOGIN} className={TEXT_LINK}>
                {hero.login}
              </Link>
            </p>
          </div>
        </div>
        <div className="col-span-4 -mx-4 aspect-4/3 md:-mx-8 lg:col-span-6 lg:mx-0 lg:aspect-6/7">
          <HouseDrawing label={hero.drawing} />
        </div>
      </div>
    </section>
  )
}
