import { KeyValueList } from '@/components/ui/lists'
import { Table, Td, Th, Tr } from '@/components/ui/table'
import { cx } from '@/lib/cx'
import { papers } from '@/lib/mock/landing'
import { AccountFrame } from './account-frame'
import { PAGE_GRID } from './classes'
import { Rich } from './rich'
import { Section } from './section'

/*
  Phần sản phẩm số. Trái: tiêu đề và ba ý (bảo hành trước, không theo thời gian dự án). Phải: hai
  màn tài khoản chồng nhau có chủ ý – Bảo hành lùi lên phải, Báo giá lấn xuống trái – dựng bằng
  primitive thật của portal. Không bóng: hai khung tách nhau bằng nền canvas và viền.
  Mobile chỉ giữ màn Bảo hành.
*/
export function PapersSection() {
  const { warranty, quote } = papers
  return (
    <Section id={papers.id} space="far" titleId="papers-title">
      <div className={cx(PAGE_GRID, 'gap-y-10')}>
        <div className="col-span-4 lg:col-span-4">
          <h2 id="papers-title" className="ld-h2 text-fg">
            {papers.title}
          </h2>
          <ul className="mt-6 lg:mt-8">
            {papers.points.map((point) => (
              <li key={point} className="border-t border-line py-4 ld-body text-fg">
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 grid grid-cols-8 lg:col-span-7 lg:col-start-6">
          <AccountFrame screen={warranty.screen} className="col-span-8 lg:col-span-6 lg:col-start-3">
            <KeyValueList
              items={warranty.rows.map((row) => ({
                k: row.k,
                v: <Rich value={row.v} />,
              }))}
            />
            {/* Phần trống để khung Báo giá lấn lên (lg:-mt-20) mà không che dòng nào của màn Bảo hành. */}
            <div aria-hidden className="hidden h-24 lg:block" />
          </AccountFrame>
          <AccountFrame
            screen={quote.screen}
            className="relative hidden lg:col-span-6 lg:col-start-1 lg:-mt-20 lg:block"
          >
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
      </div>
    </Section>
  )
}
