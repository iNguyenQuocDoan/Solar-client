import { cx } from '@/lib/cx'
import { faq } from '@/lib/mock/landing'
import { PAGE_GRID, TEXT_LINK } from './classes'
import { Rich } from './rich'
import { Section } from './section'

/*
  Hai cột kiểu tạp chí: tiêu đề dính bên trái (desktop), câu hỏi mở/đóng bên phải. Mỗi câu trả lời
  có nguồn thì kèm một dòng nguồn (tên văn bản, ngày, tên miền); không icon.
*/
export function FaqSection() {
  return (
    <Section id={faq.id} space="far" titleId="faq-title">
      <div className={cx(PAGE_GRID, 'gap-y-6')}>
        <h2 id="faq-title" className="col-span-4 self-start ld-h2 text-fg lg:sticky lg:top-24">
          {faq.title}
        </h2>
        <div className="col-span-4 divide-y divide-line border-y border-line lg:col-span-8 lg:col-start-5">
          {faq.items.map((item) => (
            <details key={item.q} className="faq-item group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 ld-sub text-fg">
                <span>{item.q}</span>
                <Chevron />
              </summary>
              <div className="pb-6">
                <p className="max-w-copy ld-body text-fg-2">
                  <Rich value={item.a} />
                </p>
                {item.source && (
                  <p className="mt-3 max-w-copy ld-meta text-fg-3">
                    {faq.sourcePrefix}{' '}
                    <a href={item.source.href} target="_blank" rel="noreferrer" className={TEXT_LINK}>
                      {item.source.label}
                    </a>{' '}
                    ({item.source.host})
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* Chỉ báo mở/đóng: nét 1,5px cùng độ dày nét chữ 600 ở 20px; xoay khi mở. */
function Chevron() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className="mt-1 size-5 shrink-0 text-fg-2 transition-transform duration-200 ease-ld group-open:rotate-180"
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
