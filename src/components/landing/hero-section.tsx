import { Link } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { hero } from '@/lib/mock/landing'
import { LANDING_CONTAINER, TEXT_LINK, ctaClass } from './classes'
import { TariffLadder } from './tariff-ladder'

/*
  Màn đầu: sản phẩm và lợi ích chính (bớt phần điện giá cao nhất), rồi hành động chính, rồi
  bậc thang giá điện để người xem tự thấy lợi ích đó với số của nhà mình.
*/
export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="pt-10 lg:pt-16">
      <div className={LANDING_CONTAINER}>
        <h1 id="hero-title" className="ld-h1 max-w-3xl text-fg">
          {hero.title}
        </h1>
        <p className="mt-4 max-w-2xl ld-lede text-fg-2 lg:mt-5">{hero.lede}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:mt-8">
          <Link to={ROUTES.REGISTER} className={ctaClass()}>
            {hero.cta}
          </Link>
          <p className="ld-meta text-fg-2">
            {hero.hasAccount}{' '}
            <Link to={ROUTES.LOGIN} className={TEXT_LINK}>
              {hero.login}
            </Link>
          </p>
        </div>
        <TariffLadder className="mt-12 lg:mt-16" />
      </div>
    </section>
  )
}
