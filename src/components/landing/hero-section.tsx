import { Link } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { hero } from '@/lib/mock/landing'
import { ReconcilePair } from './reconcile-pair'
import { LANDING_CONTAINER, TEXT_LINK, ctaClass } from './classes'

/*
  Màn đầu: nói là gì, cho ai (h1), cho thấy lời hứa duy nhất có bằng chứng (cặp diện tích),
  rồi hành động chính. Đoạn dẫn ẩn dưới md vì nhãn "Bạn khai / Kỹ thuật viên đo" đã nói cùng ý
  và nút phải nằm trong màn đầu ở 390 × 664.
*/
export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="pt-10 lg:pt-16">
      <div className={LANDING_CONTAINER}>
        <h1 id="hero-title" className="ld-h1 max-w-3xl text-fg">
          {hero.title}
        </h1>
        <p className="mt-4 hidden max-w-xl ld-lede text-fg-2 md:block lg:mt-5">{hero.lede}</p>
        <ReconcilePair size="l" {...hero.pair} className="mt-8 lg:mt-12" />
        <div className="mt-6 flex flex-col gap-3 sm:items-start lg:mt-8">
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
      </div>
    </section>
  )
}
