import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonClass } from '@/components/ui/button'
import { Field, Select, Textarea } from '@/components/ui/field'
import { ActivityList, KeyValueList, Notice, Photo } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { PlaceholderLink } from '@/components/ui/placeholder-link'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Table, Td, Th, Tr } from '@/components/ui/table'
import { ROUTES } from '@/constants/routes'
import { approvalDetail } from '@/data/manage'
import { fmt } from '@/lib/format'
import { QueryBoundary, useMockQuery } from '@/services/mock'

type Decision = 'approved' | 'redline' | 'rejected'

export function ManageApprovalPage() {
  const query = useMockQuery(['manage', 'approval', approvalDetail.id], approvalDetail)
  const [decision, setDecision] = useState<Decision | null>(null)
  const [counter, setCounter] = useState('')
  const [reason, setReason] = useState('')

  return (
    <QueryBoundary query={query}>
      {(data) => {
        const cogsPct = (data.guardrails.cogs / data.gross) * 100
        const minPct = (data.guardrails.hardMin / data.gross) * 100
        const finalPct = (data.final / data.gross) * 100
        return (
          <>
            <PageHeader
              back={{ to: ROUTES.manage.approvals, label: 'Quotation Approvals' }}
              meta={
                <>
                  <span className="text-fg-2">{data.id}</span>
                  <Badge tone={decision === 'approved' ? 'ok' : decision === 'rejected' ? 'danger' : 'warn'}>
                    {decision === 'approved' ? 'Approved' : decision === 'rejected' ? 'Rejected' : decision === 'redline' ? 'Counter requested' : data.status}
                  </Badge>
                  <span>Submitted {data.submitted}</span>
                </>
              }
              title={`Proposal ${data.id}`}
              description="Priority review, level 3 authority required."
              actions={
                <>
                  <Button>Preview customer PDF</Button>
                  <a href="#decision" className={buttonClass('secondary')}>
                    Jump to decision
                  </a>
                </>
              }
            />

            <div className="mb-12 grid gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
              <Notice tone="warn" title={`${data.exception.title}. Policy ${data.exception.policy}.`}>
                <p>{data.exception.body}</p>
                <blockquote className="mt-3 border-l-2 border-warn/40 pl-3 text-fg-2">
                  <p className="mb-1 text-meta text-fg-3">Marcus Chen, sales rep note</p>
                  {data.exception.repNote}
                </blockquote>
              </Notice>
              <Panel>
                <PanelBody className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-body text-fg-2">Gross margin</p>
                    <p className="tnum text-figure font-semibold">{data.margin.pct}%</p>
                    <Badge tone="ok">Compliant, floor {data.margin.floor}%</Badge>
                  </div>
                  <div className="border-l border-line pl-6">
                    <p className="text-body text-fg-2">Net deal contribution</p>
                    <p className="tnum text-figure font-semibold">{fmt.usdCents(data.margin.contribution)}</p>
                    <p className="text-meta text-fg-3">{data.margin.tier}</p>
                  </div>
                </PanelBody>
              </Panel>
            </div>

            <div className="grid gap-x-12 gap-y-12 lg:grid-cols-5">
              <div className="space-y-8 lg:col-span-2">
                <Panel>
                  <PanelHeader title="Customer profile" action={<Badge tone="ok">{data.customer.credit}</Badge>} />
                  <PanelBody>
                    <p className="font-medium">{data.customer.name}</p>
                    <p className="text-body text-fg-2">{data.customer.address}</p>
                    <p className="text-meta text-fg-3">{data.customer.profile}</p>
                    <KeyValueList
                      className="mt-4 border-t border-line pt-4"
                      items={[
                        { k: 'Historical utility', v: data.customer.utility },
                        { k: 'Financing pathway', v: data.customer.financing },
                      ]}
                    />
                  </PanelBody>
                </Panel>

                <Panel>
                  <PanelHeader title={`Site survey ${data.survey.id}`} action={<Badge tone="ok">{data.survey.status}</Badge>} />
                  <PanelBody className="space-y-4">
                    <ul className="grid grid-cols-2 gap-3">
                      {data.survey.photos.map((p) => (
                        <li key={p.caption}>
                          <Photo src={p.src} alt={p.caption} ratio="aspect-[3/2]" caption={p.caption} />
                        </li>
                      ))}
                    </ul>
                    <KeyValueList items={data.survey.facts} />
                  </PanelBody>
                  <PanelFooter>
                    <PlaceholderLink className="text-body text-accent-fg hover:underline">
                      View survey package ({data.survey.attachments} files)
                    </PlaceholderLink>
                  </PanelFooter>
                </Panel>

                <Panel>
                  <PanelHeader title="Approval audit trail" />
                  <PanelBody>
                    <ActivityList items={data.trail} />
                  </PanelBody>
                </Panel>
              </div>

              <div className="space-y-8 lg:col-span-3">
                <Panel>
                  <PanelHeader title="Itemized hardware and services" description={data.architecture} />
                  <Table>
                    <thead>
                      <tr>
                        <Th>Item</Th>
                        <Th className="text-right">Qty</Th>
                        <Th className="text-right">Cost basis</Th>
                        <Th className="text-right">Retail line</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((i) => (
                        <Tr key={i.name}>
                          <Td>
                            <p className="font-medium">{i.name}</p>
                            <p className="text-meta text-fg-3">{i.detail}</p>
                          </Td>
                          <Td className="tnum text-right whitespace-nowrap">{i.qty}</Td>
                          <Td className="tnum text-right whitespace-nowrap text-fg-2">{fmt.usd(i.cost)}</Td>
                          <Td className="tnum text-right font-medium whitespace-nowrap">{fmt.usdCents(i.retail)}</Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                  <PanelBody>
                    <dl className="space-y-2 text-body">
                      <div className="flex justify-between gap-4">
                        <dt className="text-fg-2">Standard gross system price</dt>
                        <dd className="tnum">{fmt.usdCents(data.gross)}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-warn">
                          {data.discount.label} {data.discount.overCap && <Badge tone="warn">Over cap</Badge>}
                        </dt>
                        <dd className="tnum text-warn">{fmt.usdCents(data.discount.amount)}</dd>
                      </div>
                      <div className="flex items-end justify-between gap-4 border-t border-line pt-2">
                        <dt>
                          <span className="font-medium">Final proposed price</span>
                          <span className="block text-meta text-fg-3">{data.perWatt}</span>
                        </dt>
                        <dd className="tnum text-figure font-semibold">{fmt.usdCents(data.final)}</dd>
                      </div>
                    </dl>
                  </PanelBody>
                </Panel>

                <Panel>
                  <PanelHeader title="Financial guardrails" description={`COGS basis ${fmt.usdCents(data.guardrails.cogs)}. Gross margin realization ${data.margin.pct}%, ${(data.margin.pct - data.margin.floor).toFixed(1)} points above the hard stop.`} />
                  <PanelBody className="space-y-4">
                    <div>
                      <div className="relative h-2 w-full rounded-control bg-surface-3" role="img" aria-label="Quotation position between cost floor and gross price">
                        <span className="absolute inset-y-0 left-0 rounded-control bg-danger/40" style={{ width: `${cogsPct}%` }} />
                        <span className="absolute inset-y-0 rounded-control bg-warn/40" style={{ left: `${cogsPct}%`, width: `${minPct - cogsPct}%` }} />
                        <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-control border-2 border-surface bg-accent" style={{ left: `${finalPct}%` }} />
                      </div>
                      <dl className="tnum mt-2 grid grid-cols-3 text-meta">
                        <div>
                          <dt className="text-fg-3">Cost floor</dt>
                          <dd className="font-medium">{fmt.usd(data.guardrails.cogs)}</dd>
                        </div>
                        <div className="text-center">
                          <dt className="text-fg-3">{data.margin.floor}% hard minimum</dt>
                          <dd className="font-medium">{fmt.usd(data.guardrails.hardMin)}</dd>
                        </div>
                        <div className="text-right">
                          <dt className="text-fg-3">Current quotation</dt>
                          <dd className="font-medium">{fmt.usd(data.final)}</dd>
                        </div>
                      </dl>
                    </div>
                    <dl className="grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-meta text-fg-2">Rep monthly discretionary budget</dt>
                        <dd className="tnum font-medium">
                          {fmt.usd(data.guardrails.budget.remaining)} of {fmt.usd(data.guardrails.budget.total)} remaining
                        </dd>
                        <dd className="text-meta text-warn">{data.guardrails.budget.note}</dd>
                      </div>
                      <div>
                        <dt className="text-meta text-fg-2">Regional competitor baseline</dt>
                        <dd className="font-medium">
                          {data.guardrails.competitor.name}, {data.guardrails.competitor.rate}
                        </dd>
                        <dd className="text-meta text-fg-3">{data.guardrails.competitor.winRate}</dd>
                      </div>
                    </dl>
                  </PanelBody>
                </Panel>

                <Panel id="decision">
                  <PanelHeader title="Manager authorization" description="Logged as Jonathan Mercer." />
                  {decision ? (
                    <PanelBody>
                      <Notice tone={decision === 'rejected' ? 'danger' : 'ok'} title={decision === 'approved' ? 'Approved and dispatched' : decision === 'redline' ? 'Counter request sent' : 'Quotation rejected'}>
                        {decision === 'approved' && 'The promotional code override is executed and the DocuSign envelope was sent to David Miller.'}
                        {decision === 'redline' && `The proposal was returned to Marcus Chen with your note: "${counter}".`}
                        {decision === 'rejected' && `The opportunity file is closed. Reason: ${reason}.`}
                      </Notice>
                    </PanelBody>
                  ) : (
                    <PanelBody className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-container bg-surface-2 px-4 py-3">
                        <div className="text-body">
                          <p className="font-medium">Executive sign-off</p>
                          <p className="text-fg-2">Executes the promotional override, signs contract dispatch and triggers the DocuSign envelope to David Miller.</p>
                        </div>
                        <Button variant="primary" onClick={() => setDecision('approved')}>
                          Approve and dispatch
                        </Button>
                      </div>

                      <form
                        className="space-y-3"
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (counter.trim()) setDecision('redline')
                        }}
                      >
                        <Field label="Request redline or structured counter" hint="Sends the proposal back to Marcus Chen." htmlFor="counter">
                          <Textarea id="counter" value={counter} onChange={(e) => setCounter(e.target.value)} placeholder="Counter with $29,200 or reduce the warranty labor package. Do not drop below $29k without extending monitoring." />
                        </Field>
                        <div className="flex flex-wrap items-center gap-2">
                          {data.presets.map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setCounter((c) => (c ? `${c} ${p}.` : `${p}.`))}
                              className="press tap text-body text-fg-2 underline-offset-4 hover:text-fg hover:underline"
                            >
                              Preset: {p}
                            </button>
                          ))}
                          <Button type="submit" size="sm" className="ml-auto" disabled={!counter.trim()}>
                            Send counter request
                          </Button>
                        </div>
                      </form>

                      <form
                        className="border-l-2 border-danger pl-4"
                        onSubmit={(e) => {
                          e.preventDefault()
                          if (reason) setDecision('rejected')
                        }}
                      >
                        <Field label="Reject quotation outright" hint="Closes the opportunity file and invalidates the pricing lock." htmlFor="reason">
                          <div className="flex flex-wrap gap-3">
                            <Select id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full sm:w-auto sm:min-w-0 sm:flex-1">
                              <option value="">Select a rejection reason</option>
                              {data.rejectReasons.map((r) => (
                                <option key={r}>{r}</option>
                              ))}
                            </Select>
                            <Button type="submit" variant="danger" disabled={!reason}>
                              Reject
                            </Button>
                          </div>
                        </Field>
                      </form>
                    </PanelBody>
                  )}
                </Panel>
              </div>
            </div>

            <p className="mt-6 border-t border-line pt-4 text-meta text-fg-3">
              Quote hash <span className="text-fg-2">{data.hash}</span>. Complies with Title 24 California Building Energy Efficiency Standards.
            </p>
          </>
        )
      }}
    </QueryBoundary>
  )
}
