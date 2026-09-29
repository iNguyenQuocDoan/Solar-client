import { Table, Td, Th, Tr } from '@/components/ui/table'
import { cx } from '@/lib/cx'
import { quote } from '@/lib/mock/landing'
import { AccountFrame } from './account-frame'
import { ReconcilePair } from './reconcile-pair'
import { Rich } from './rich'
import { Section, SectionTitle } from './section'

/* Bảng báo giá: mobile chỉ giữ ba dòng đầu và một dòng tóm tắt, không thu nhỏ cả bảng. */
export function QuoteSection() {
  const hidden = quote.rows.length - quote.mobileRows
  return (
    <Section id="bao-gia" space="far" titleId="quote-title">
      <SectionTitle id="quote-title">{quote.title}</SectionTitle>
      <ReconcilePair {...quote.pair} className="mt-8 lg:mt-10" />
      <AccountFrame screen={quote.screen} caption={quote.caption} className="mt-10 lg:mt-12">
        <Table>
          <thead>
            <Tr>
              <Th>{quote.columns[0]}</Th>
              <Th>{quote.columns[1]}</Th>
              <Th className="text-right">{quote.columns[2]}</Th>
            </Tr>
          </thead>
          <tbody>
            {quote.rows.map((row, i) => (
              <Tr key={row.item} className={cx(i >= quote.mobileRows && 'hidden lg:table-row')}>
                <Td className="font-medium text-fg">{row.item}</Td>
                <Td className="text-fg-2">
                  <Rich value={row.spec} />
                </Td>
                <Td className="text-right whitespace-nowrap text-fg">{row.qty}</Td>
              </Tr>
            ))}
            {hidden > 0 && (
              <Tr className="lg:hidden">
                <Td colSpan={3} className="text-fg-2">
                  {quote.moreRows(hidden)}
                </Td>
              </Tr>
            )}
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
    </Section>
  )
}
