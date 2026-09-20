import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { FilterChips } from '@/components/ui/chips'
import { Field, Select, Textarea } from '@/components/ui/field'
import { FilterBar } from '@/components/ui/filter-bar'
import { ListRow, ListRowActions } from '@/components/ui/list-row'
import { KeyValueList, Notice, Photo } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stat, StatRow } from '@/components/ui/stat'
import { EmptyState } from '@/components/ui/states'
import { ROUTES, withId } from '@/constants/routes'
import { approvalQueue, approvals, type ApprovalFlag } from '@/data/manage'
import { cx } from '@/lib/cx'
import { fmt } from '@/lib/format'
import { QueryBoundary, useMockQuery } from '@/services/mock'

type Filter = ApprovalFlag | 'all'

export function ManageApprovalsPage() {
  const query = useMockQuery(['manage', 'approvals'], approvalQueue)
  const [filter, setFilter] = useState<Filter>('all')
  const [decided, setDecided] = useState<Record<string, 'approved' | 'redline' | 'rejected'>>({})
  const [selectedId, setSelectedId] = useState(approvals[0]!.id)
  const [memo, setMemo] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const pending = useMemo(() => approvals.filter((a) => !decided[a.id]), [decided])
  const rows = useMemo(() => pending.filter((a) => filter === 'all' || a.flags.includes(filter)), [pending, filter])
  const selected = approvals.find((a) => a.id === selectedId)!
  const eligible = pending.filter((a) => a.flags.length === 0)

  function decide(id: string, decision: 'approved' | 'redline' | 'rejected', message: string) {
    setDecided((d) => ({ ...d, [id]: decision }))
    setToast(message)
    const next = pending.find((a) => a.id !== id)
    if (next) setSelectedId(next.id)
  }

  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            meta={<span>{data.authority}</span>}
            title="Quotation approval queue"
            actions={
              <>
                <Button>Batch parameters</Button>
                <Button
                  disabled={eligible.length === 0}
                  onClick={() => {
                    setDecided((d) => ({ ...d, ...Object.fromEntries(eligible.map((a) => [a.id, 'approved' as const])) }))
                    setToast(`Batch approved ${eligible.length} compliant quotation${eligible.length === 1 ? '' : 's'}.`)
                  }}
                >
                  Approve eligible ({eligible.length})
                </Button>
              </>
            }
          />

          {toast && (
            <Notice tone="ok" className="mb-8">
              {toast}
            </Notice>
          )}

          <StatRow className="mb-12">
            {data.stats.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} unit={s.unit} note={s.note} tone={s.tone} />
            ))}
          </StatRow>

          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
              <FilterBar className="mb-0" tabs={<FilterChips chips={[...data.chips]} value={filter} onChange={setFilter} label="Filter approvals" />}>
                <label className="flex items-center gap-2 text-meta whitespace-nowrap text-fg-2">
                  Sort by
                  <Select size="sm" className="w-auto" aria-label="Sort by">
                    {data.sorts.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </Select>
                </label>
              </FilterBar>

              {rows.length === 0 ? (
                <EmptyState title="Queue is clear" description={`Nothing pending under this filter. ${data.recentlyApproved} quotations were approved recently.`} />
              ) : (
                <ul className="divide-y divide-line border-t border-line">
                  {rows.map((a) => {
                    const active = a.id === selectedId
                    return (
                      <ListRow key={a.id} tone={a.slaHours ? 'danger' : undefined} selected={active}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="min-w-0 flex-1 basis-64">
                                <button type="button" onClick={() => setSelectedId(a.id)} className="tap text-left text-body font-semibold hover:underline">
                                  {a.customer}
                                </button>
                                <span className="ml-2 text-meta text-fg-3">{a.id}</span>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  <Badge tone={a.flagTone}>{a.flag}</Badge>
                                  <span className="text-meta text-fg-3">
                                    {a.address}. Rep {a.rep}.
                                  </span>
                                </div>
                              </div>
                              <div className="shrink-0 text-right">
                                {a.gross !== a.net && <p className="tnum text-meta text-fg-3 line-through">{fmt.usd(a.gross)}</p>}
                                <p className="tnum text-figure font-semibold">{fmt.usd(a.net)}</p>
                                {a.gross !== a.net && <p className="text-meta text-warn">Save {fmt.usd(a.gross - a.net)}, override required</p>}
                              </div>
                            </div>
                            <dl className={cx('mt-3 grid gap-x-6 gap-y-1 rounded-container px-3 py-3 text-body sm:grid-cols-3', active ? 'bg-surface-3' : 'bg-surface-2')}>
                              {a.specs.map((s) => (
                                <div key={s.k}>
                                  <dt className="text-meta text-fg-3">{s.k}</dt>
                                  <dd className="font-medium">{s.v}</dd>
                                </div>
                              ))}
                            </dl>
                            <p className="mt-2 text-meta text-fg-3">
                              Submitted {a.submitted}. {a.stage}.
                            </p>
                          <ListRowActions>
                            <ButtonLink to={withId(ROUTES.manage.approval, a.id)} size="sm">
                              {a.actionLabel}
                            </ButtonLink>
                            <Button size="sm" onClick={() => decide(a.id, 'approved', `${a.id} authorized and sent to ${a.customer}.`)}>
                              Quick approve
                            </Button>
                          </ListRowActions>
                      </ListRow>
                    )
                  })}
                </ul>
              )}
            </div>

            <div className="space-y-8 lg:col-span-2">
              <Panel>
                <PanelHeader
                  title={`${selected.id}, ${selected.customer}`}
                  description="Inline inspection"
                  action={selected.slaHours ? <Badge tone="danger">SLA overdue</Badge> : <Badge tone="warn">Priority 1</Badge>}
                />
                <PanelBody className="space-y-4">
                  <div>
                    <p className="mb-2 text-meta text-fg-2">Trigger criteria</p>
                    <ul className="flex flex-wrap gap-2">
                      {selected.criteria.map((c) => (
                        <li key={c.label}>
                          <Badge tone={c.tone}>{c.label}</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <dl className="space-y-2 text-body">
                    {selected.breakdown.map((b) => (
                      <div key={b.label} className="flex justify-between gap-3">
                        <dt className="text-fg-2">{b.label}</dt>
                        <dd className={cx('tnum font-medium', b.amount < 0 && 'text-warn')}>{fmt.usd(b.amount)}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-3 border-t border-line pt-2">
                      <dt className="font-medium">Target final contract</dt>
                      <dd className="tnum text-title font-semibold">{fmt.usd(selected.net)}</dd>
                    </div>
                  </dl>
                  <KeyValueList items={[{ k: 'Projected gross margin', v: selected.margin }]} />
                  <blockquote className="border-l-2 border-line-2 pl-3 text-body text-fg-2">
                    <p className="mb-1 text-meta text-fg-3">Sales note from {selected.rep}</p>
                    {selected.note}
                  </blockquote>
                  {decided[selected.id] ? (
                    <Notice tone={decided[selected.id] === 'rejected' ? 'danger' : 'ok'}>This quotation was marked {decided[selected.id]}.</Notice>
                  ) : (
                    <Field label="Manager memo or redline condition" htmlFor="memo">
                      <Textarea id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Approved provided the customer signs within 48 hours" rows={3} />
                    </Field>
                  )}
                </PanelBody>
                {!decided[selected.id] && (
                  <PanelFooter className="flex-col items-stretch gap-2">
                    <Button variant="primary" onClick={() => decide(selected.id, 'approved', `${selected.id} authorized with a digital manager stamp and dispatched to the customer.`)}>
                      Authorize and dispatch to customer
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button onClick={() => decide(selected.id, 'redline', `Revision notes for ${selected.id} sent back to ${selected.rep}.`)}>Request redline</Button>
                      <Button variant="danger" onClick={() => decide(selected.id, 'rejected', `${selected.id} marked as rejected. ${selected.rep} will be notified.`)}>
                        Reject terms
                      </Button>
                    </div>
                  </PanelFooter>
                )}
              </Panel>

              <Panel>
                <PanelHeader title="CAD roof layout preview" />
                <PanelBody>
                  <Photo src={data.cad.src} alt="CAD roof layout" ratio="aspect-[16/10]" caption={data.cad.caption} meta={data.cad.meta} />
                </PanelBody>
              </Panel>
            </div>
          </div>
        </>
      )}
    </QueryBoundary>
  )
}
