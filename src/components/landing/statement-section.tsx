import { cx } from '@/lib/cx'
import { statement } from '@/lib/mock/landing'
import { LANDING_CONTAINER, PAGE_GRID } from './classes'
import { Reveal } from './reveal'

/* Section chỉ có chữ, đặt lệch vào cột 3 để ngắt nhịp sau ảnh hero tràn màn. */
export function StatementSection() {
  return (
    <section aria-label="Cách Smart Solar làm việc" className="pt-20 lg:pt-32">
      <div className={cx(LANDING_CONTAINER, PAGE_GRID)}>
        <Reveal className="col-span-4 lg:col-span-9 lg:col-start-3">
          <p className="ld-statement text-fg">
            {statement.lead} <span className="text-fg-2">{statement.rest}</span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
