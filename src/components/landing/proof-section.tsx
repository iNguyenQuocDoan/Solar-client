import type { ReactNode } from 'react'
import { KeyValueList, Progress } from '@/components/ui/lists'
import { Table, Td, Th, Tr } from '@/components/ui/table'
import { cx } from '@/lib/cx'
import { proof } from '@/lib/mock/landing'
import { AccountFrame } from './account-frame'
import { PAGE_GRID } from './classes'
import { ReconcilePair } from './reconcile-pair'
import { Rich } from './rich'
import { Section, SectionTitle } from './section'

/*
  Điểm khác biệt đứng song song trong MỘT section, xếp theo mức quan trọng với người mua
  (tiền → hỏng hóc → thi công → số đo), không theo vòng đời dự án. Mỗi điểm có một khối màn
  thật của portal làm bằng chứng; kích thước khối theo lượng nội dung, không chia lưới đều.
*/
export function ProofSection() {
  const { quote, warranty, build, survey } = proof
  const pct = Math.round((build.progress.done / build.progress.total) * 100)
  return (
    <Section id={proof.id} space="far" titleId="proof-title">
      <SectionTitle id="proof-title">{proof.title}</SectionTitle>

      <div className={cx(PAGE_GRID, 'mt-10 gap-y-8 lg:mt-12')}>
        <Point title={quote.title} text={quote.text} className="col-span-4 lg:col-span-4" />
        <AccountFrame screen={quote.screen} className="col-span-4 lg:col-span-8">
          <Table>
            <thead>
              <Tr>
                <Th>{quote.columns[0]}</Th>
                <Th>{quote.columns[1]}</Th>
                <Th className="text-right">{quote.columns[2]}</Th>
              </Tr>
            </thead>
            <tbody>
              {quote.rows.map((row) => (
                <Tr key={row.item}>
                  <Td className="font-medium text-fg">{row.item}</Td>
                  <Td className="text-fg-2">
                    <Rich value={row.spec} />
                  </Td>
                  <Td className="text-right whitespace-nowrap text-fg">{row.qty}</Td>
                </Tr>
              ))}
            </tbody>
            <tfoot>
              <Tr>
                <Td className="border-b-0 font-semibold text-fg">{quote.total.label}</Td>
                <Td colSpan={2} className="border-b-0 text-right">
                  <Rich value={quote.total.value} />
                </Td>
              </Tr>
            </tfoot>
          </Table>
        </AccountFrame>
      </div>

      <div className={cx(PAGE_GRID, 'mt-16 gap-y-16 lg:mt-20')}>
        <div className="col-span-4 lg:col-span-6">
          <Point title={warranty.title} text={warranty.text} />
          <AccountFrame screen={warranty.screen} className="mt-6">
            <KeyValueList items={warranty.coverage.map((row) => ({ k: row.k, v: <Rich value={row.v} /> }))} />
          </AccountFrame>
        </div>
        <div className="col-span-4 lg:col-span-6">
          <Point title={build.title} text={build.text} />
          <AccountFrame screen={build.screen} className="mt-6">
            <p className="text-title font-semibold text-fg">{build.logTitle}</p>
            <KeyValueList items={build.log} className="mt-4" />
            <div className="mt-5 flex items-baseline justify-between gap-4 text-meta text-fg-2">
              <span>{build.progress.label}</span>
              <span className="tnum">{pct}%</span>
            </div>
            <Progress value={pct} label={build.progress.label} className="mt-2" />
          </AccountFrame>
        </div>
      </div>

      <div className={cx(PAGE_GRID, 'mt-16 gap-y-8 lg:mt-20')}>
        <Point title={survey.title} text={survey.text} className="col-span-4 lg:col-span-4" />
        <ReconcilePair {...survey.pair} className="col-span-4 lg:col-span-8" />
      </div>
    </Section>
  )
}

function Point({ title, text, className }: { title: string; text: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="ld-sub text-fg">{title}</h3>
      <p className="mt-2 max-w-copy ld-body text-fg-2">{text}</p>
    </div>
  )
}
