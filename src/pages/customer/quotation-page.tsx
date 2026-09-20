import { useRef, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox, Field, Textarea } from '@/components/ui/field'
import { Notice, Photo } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stat, StatRow } from '@/components/ui/stat'
import { Table, Td, Th, Tr } from '@/components/ui/table'
import { ROUTES } from '@/constants/routes'
import { advisor, quotation } from '@/data/customer'
import { fmt } from '@/lib/format'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function QuotationPage() {
  const query = useMockQuery(['customer', 'quotation', quotation.id], quotation)
  const [agreed, setAgreed] = useState(false)
  const [signing, setSigning] = useState<'idle' | 'busy' | 'done'>('idle')
  const [question, setQuestion] = useState('')
  const [sent, setSent] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  function sign() {
    setSigning('busy')
    setTimeout(() => setSigning('done'), 1200)
  }

  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            back={{ to: ROUTES.customer.home, label: 'Overview' }}
            meta={
              <>
                <span className="text-fg-2">{data.id}</span>
                <Badge tone={signing === 'done' ? 'ok' : 'warn'}>{signing === 'done' ? 'Accepted' : data.status}</Badge>
                <span>
                  Valid {data.validDays} more days, expires {data.expires}
                </span>
              </>
            }
            title={data.title}
            description={`Issued ${data.issued}. Prepared by ${data.preparedBy}, senior project advisor.`}
            actions={<Button>Download PDF</Button>}
          />

          <Panel className="mb-10">
            <PanelBody className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center">
              <Photo src={data.site.photo} alt={`Roof at ${data.site.address}`} ratio="aspect-[3/2]" caption={data.site.address} meta={data.site.detail} />
              <StatRow className="md:grid-cols-3">
                <Stat label="Array capacity" value={data.capacityKw} unit="kW DC" note="Tier-1 all-black monocrystalline" />
                <Stat label="Year 1 output" value={fmt.num(data.year1Kwh)} unit="kWh" note="Modeled with PVWatts" />
                <Stat label="Home energy offset" value={`${data.offsetPct}%`} note="Net metering" />
              </StatRow>
            </PanelBody>
          </Panel>

          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-5">
            <div className="space-y-10 lg:col-span-3">
              <Panel>
                <PanelHeader title="Itemized hardware and work" description={`${data.lines.length} line items`} />
                <Table className="text-[14px]">
                  <thead>
                    <tr>
                      <Th>Item</Th>
                      <Th>Quantity</Th>
                      <Th className="text-right">Amount</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lines.map((line) => (
                      <Tr key={line.name}>
                        <Td>
                          <p className="font-medium">{line.name}</p>
                          <p className="text-[14px] text-fg-2">{line.detail}</p>
                        </Td>
                        <Td className="whitespace-nowrap text-fg-2">{line.qty}</Td>
                        <Td className="tnum text-right font-medium whitespace-nowrap">{fmt.usdCents(line.amount)}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
                <PanelFooter className="justify-between">
                  <span className="text-[14px] text-fg-2">Gross system total</span>
                  <span className="tnum font-semibold">{fmt.usdCents(data.gross)}</span>
                </PanelFooter>
              </Panel>

              <Panel>
                <PanelHeader title="Warranties included" />
                <PanelBody>
                  <dl className="grid gap-4 sm:grid-cols-3">
                    {data.warranties.map((w) => (
                      <div key={w.name}>
                        <dt className="font-medium">{w.name}</dt>
                        <dd className="text-[14px] text-fg-2">{w.detail}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-5 border-t border-line pt-4 text-[13px] text-fg-3">{data.license}</p>
                </PanelBody>
              </Panel>
            </div>

            <div className="space-y-10 lg:col-span-2">
              <Panel id="accept">
                <PanelHeader title="Investment summary" />
                <PanelBody>
                  <dl className="space-y-2.5 text-[15px]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-fg-2">Gross system total</dt>
                      <dd className="tnum font-medium">{fmt.usdCents(data.gross)}</dd>
                    </div>
                    {data.incentives.map((inc) => (
                      <div key={inc.name} className="flex justify-between gap-4">
                        <dt>
                          <span className="text-fg-2">{inc.name}</span>
                          <span className="block text-[13px] text-fg-3">{inc.detail}</span>
                        </dt>
                        <dd className="tnum font-medium whitespace-nowrap text-ok">{fmt.usdCents(inc.amount)}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-4">
                    <div>
                      <p className="text-[15px] font-medium">Net homeowner investment</p>
                      <p className="text-[13px] text-fg-3">All incentives included</p>
                    </div>
                    <p className="tnum text-2xl font-semibold tracking-tight">{fmt.usdCents(data.net)}</p>
                  </div>

                  <div className="mt-5 rounded-md bg-surface-2 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[14px] font-medium">Estimated monthly cash flow</p>
                      <Badge tone="ok">Save {fmt.usd(data.cashflow.savings)}/mo</Badge>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[13px] text-fg-2">Current electric bill</p>
                        <p className="tnum text-lg font-semibold text-fg-3 line-through">{fmt.usd(data.cashflow.currentBill)}</p>
                      </div>
                      <div>
                        <p className="text-[13px] text-fg-2">Solar loan payment</p>
                        <p className="tnum text-lg font-semibold">
                          {fmt.usd(data.cashflow.loanPayment)} <span className="text-[13px] font-normal text-fg-2">/ mo</span>
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-[13px] text-fg-3">{data.cashflow.terms}</p>
                  </div>

                  {signing === 'done' ? (
                    <Notice tone="ok" title="Quotation accepted" className="mt-5">
                      {data.id} was digitally countersigned. {advisor.name} has been notified to proceed with the municipal permit filing.
                    </Notice>
                  ) : (
                    <div className="mt-5 space-y-3">
                      <Checkbox
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        label="I have reviewed the scope of work and technical specifications, and agree to lock in this price for 30 calendar days."
                      />
                      <Button variant="primary" className="w-full" disabled={!agreed || signing === 'busy'} onClick={sign}>
                        {signing === 'busy' ? 'Processing signature' : 'Accept and sign quotation'}
                      </Button>
                    </div>
                  )}
                </PanelBody>
                <PanelFooter className="justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={advisor.name} size="sm" />
                    <div className="leading-tight">
                      <p className="text-[14px] font-medium">{advisor.name}</p>
                      <p className="text-[13px] text-fg-3">Dedicated solar advisor</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => dialogRef.current?.showModal()}>
                    Ask {advisor.name.split(' ')[0]}
                  </Button>
                </PanelFooter>
              </Panel>
            </div>
          </div>

          <dialog
            ref={dialogRef}
            className="m-auto w-full max-w-md rounded-md border border-line-2 bg-canvas p-0 text-fg backdrop:bg-fg/40"
            onClose={() => {
              setSent(false)
              setQuestion('')
            }}
          >
            <form
              method="dialog"
              className="p-6"
              onSubmit={(e) => {
                if (!sent) {
                  e.preventDefault()
                  setSent(true)
                }
              }}
            >
              <h2 className="text-lg font-semibold">Consult with {advisor.name}</h2>
              <p className="mt-1 text-[15px] text-fg-2">
                Questions about equipment, adding a battery or structural mounting? {advisor.name.split(' ')[0]} replies through the portal or by phone.
              </p>
              {sent ? (
                <Notice tone="ok" className="mt-4">
                  Your note was routed to {advisor.name}. Expected response within 2 hours.
                </Notice>
              ) : (
                <Field label="Your question or note" htmlFor="question" className="mt-4">
                  <Textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} />
                </Field>
              )}
              <div className="mt-5 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => dialogRef.current?.close()}>
                  {sent ? 'Close' : 'Cancel'}
                </Button>
                {!sent && (
                  <Button type="submit" variant="primary" disabled={!question.trim()}>
                    Send inquiry
                  </Button>
                )}
              </div>
            </form>
          </dialog>
        </>
      )}
    </QueryBoundary>
  )
}
