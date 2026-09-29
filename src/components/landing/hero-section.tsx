import { Link } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { cx } from '@/lib/cx'
import { hero, projects } from '@/lib/mock/landing'
import { TEXT_LINK, ctaClass } from './classes'
import { LandingPhoto } from './photo'

/*
  Bạn là ai, bạn làm gì. Ảnh công trình tràn hết bề ngang; trên desktop khối chữ nền trang cắt vào
  góc dưới trái của ảnh (chữ không đè lên ảnh nên không cần lớp phủ tối). Mobile: ảnh 4:3, chữ bên dưới.
*/
export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="ld-hero-frame overflow-hidden bg-surface-3">
        <LandingPhoto shot={hero.photo} sizes="100vw" priority />
      </div>
      <div className="ld-hero-card bg-canvas">
        <div className="max-w-3xl">
          <h1 id="hero-title" className="ld-display text-fg">
            {hero.title}
          </h1>
          <p className="mt-4 max-w-xl ld-lede text-fg-2 lg:mt-5">{hero.lede}</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8 lg:mt-8">
            <Link to={ROUTES.REGISTER} className={ctaClass()}>
              {hero.cta}
            </Link>
            <a href={`#${projects.id}`} className={cx(TEXT_LINK, 'ld-action')}>
              {hero.secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
