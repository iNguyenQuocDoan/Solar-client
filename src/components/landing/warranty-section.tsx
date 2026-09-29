import { KeyValueList } from '@/components/ui/lists'
import { cx } from '@/lib/cx'
import { warranty } from '@/lib/mock/landing'
import { AccountFrame } from './account-frame'
import { ReconcilePair } from './reconcile-pair'
import { Rich } from './rich'
import { PAGE_GRID } from './classes'
import { Section, SectionTitle } from './section'

/*
  Nhảy thời gian (sau lắp đặt) và đổi câu hỏi sang "ai chịu", nên cách section trước xa nhất.
  Phiếu chỉ hiện trạng thái hiện tại, không dùng Stepper vòng đời phiếu của portal.
*/
export function WarrantySection() {
  return (
    <Section id="bao-hanh" space="farther" titleId="warranty-title">
      <SectionTitle id="warranty-title">{warranty.title}</SectionTitle>
      <div className={cx(PAGE_GRID, 'mt-8 gap-y-10 lg:mt-10')}>
        <ReconcilePair {...warranty.pair} className="col-span-4 lg:col-span-7" />
        <AccountFrame screen={warranty.screen} className="col-span-4 lg:col-span-5">
          <KeyValueList items={warranty.coverage.map((row) => ({ k: row.k, v: <Rich value={row.v} /> }))} />
        </AccountFrame>
      </div>
    </Section>
  )
}
