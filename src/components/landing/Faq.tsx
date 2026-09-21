import { useState } from 'react'
import { LandingSection } from '@/components/landing/section'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { faq } from '@/lib/mock/landing'

/*
 * Khối 9 của landing_home. Accordion bằng state React thay cho script trong code.html:
 * mặc định mở câu đầu, mỗi lúc chỉ mở một câu.
 */
export function Faq() {
  const { eyebrow, title, description, items } = faq
  const [openId, setOpenId] = useState<string | null>(items[0].id)

  return (
    <LandingSection id="faq" tone="low">
      <div className="mx-auto flex w-full max-w-[880px] flex-col gap-space-xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex flex-col gap-space-2xs text-center">
          <span className="text-label-lg uppercase tracking-wider text-primary-container">{eyebrow}</span>
          <h2 className="text-headline-xl-mobile text-primary md:text-headline-xl">{title}</h2>
          <p className="text-body-md text-on-surface-variant">{description}</p>
        </div>

        <div className="flex flex-col gap-space-sm">
          {items.map((item) => {
            const isOpen = openId === item.id
            return (
              <div key={item.id} className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-panel`}
                  id={`${item.id}-trigger`}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between p-space-md text-left"
                >
                  <span className="pr-4 text-headline-md text-on-surface">{item.question}</span>
                  <Icon
                    name="expand_more"
                    className={cn('text-primary-container transition-transform', isOpen && 'rotate-180')}
                  />
                </button>
                <div
                  id={`${item.id}-panel`}
                  role="region"
                  aria-labelledby={`${item.id}-trigger`}
                  hidden={!isOpen}
                  className="px-space-md pb-space-md pt-0 text-body-md text-on-surface-variant"
                >
                  {item.answer}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </LandingSection>
  )
}
