import { cx } from '@/lib/cx'
import { principle } from '@/lib/mock/landing'
import { LANDING_CONTAINER, PAGE_GRID } from './classes'
import { ReconcilePair } from './reconcile-pair'

/*
  Tính cách thương hiệu nói bằng một câu, trên dải tối tràn viền. Cặp đối chiếu (đường ghi kích
  thước) chỉ xuất hiện ở đây, làm bằng chứng cho câu đó – không lặp lại ở section khác.
*/
export function PrincipleSection() {
  return (
    <section
      id={principle.id}
      aria-labelledby="principle-title"
      className="scheme-dark band-ink mt-20 py-20 lg:mt-32 lg:py-32"
    >
      <div className={cx(LANDING_CONTAINER, PAGE_GRID, 'gap-y-12')}>
        <div className="col-span-4 lg:col-span-5">
          <h2 id="principle-title" className="ld-band-title text-fg">
            {principle.title}
          </h2>
          <p className="mt-6 max-w-copy ld-body text-fg-2">{principle.text}</p>
        </div>
        <ReconcilePair {...principle.pair} className="col-span-4 lg:col-span-6 lg:col-start-7 lg:pt-3" />
      </div>
    </section>
  )
}
