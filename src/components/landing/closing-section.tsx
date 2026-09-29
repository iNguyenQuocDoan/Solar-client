import { Link } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { cx } from '@/lib/cx'
import { closing } from '@/lib/mock/landing'
import { CTA_ON_ACCENT, LANDING_CONTAINER, PAGE_GRID } from './classes'

/*
  Lời mời cuối trang trên dải xanh tràn viền, sát footer. Việc cần chuẩn bị chỉ là một câu; danh
  sách chi tiết nằm trong câu hỏi thường gặp, để trang không kết thúc bằng một quy trình.
*/
export function ClosingSection() {
  return (
    <section id={closing.id} aria-labelledby="closing-title" className="band-accent mt-20 py-20 lg:mt-32 lg:py-28">
      <div className={cx(LANDING_CONTAINER, PAGE_GRID, 'gap-y-8 lg:items-end')}>
        <div className="col-span-4 lg:col-span-7">
          <h2 id="closing-title" className="ld-band-title">
            {closing.title}
          </h2>
          <p className="mt-4 max-w-copy ld-lede lg:mt-6">{closing.text}</p>
        </div>
        <div className="col-span-4 flex flex-col gap-4 lg:col-span-4 lg:col-start-9 lg:items-start">
          <Link to={ROUTES.REGISTER} className={cx(CTA_ON_ACCENT, 'w-full sm:w-auto')}>
            {closing.cta}
          </Link>
          <p className="ld-meta">
            {closing.hasAccount}{' '}
            <Link to={ROUTES.LOGIN} className="underline decoration-1 underline-offset-4 hover:decoration-2">
              {closing.login}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
