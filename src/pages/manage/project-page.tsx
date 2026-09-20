import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/field'
import { ActivityList, KeyValueList, Notice, Photo, Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { PlaceholderLink } from '@/components/ui/placeholder-link'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stepper } from '@/components/ui/stepper'
import { Table, Td, Th, Tr } from '@/components/ui/table'
import { ROUTES } from '@/constants/routes'
import { projectFile } from '@/data/manage'
import { cx } from '@/lib/cx'
import { fmt } from '@/lib/format'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function ManageProjectPage() {
  const query = useMockQuery(['manage', 'project', projectFile.id], projectFile)
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState<{ time: string; title: string; body: string }[]>([])

  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            back={{ to: ROUTES.manage.projects, label: 'Projects' }}
            meta={
              <>
                <span className="text-fg-2">{data.id}</span>
                <Badge>{data.tier}</Badge>
                <span>{data.synced}</span>
              </>
            }
            title={`${data.customer}, ${data.title}`}
            description={`${data.address}. ${data.type}.`}
            actions={
              <>
                <Button variant="ghost">Export dossier</Button>
                <Button variant="danger">Pause work</Button>
                <Button variant="primary">Authorize change order</Button>
              </>
            }
          />

          <Panel className="mb-12">
            <PanelBody className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1.2fr)]">
              <div>
                <p className="text-body text-fg-2">Total turnkey contract value</p>
                <p className="tnum mt-1 text-display font-semibold">{fmt.usd(data.contract.total)}</p>
                <p className="tnum text-body text-fg-2">
                  {fmt.usd(data.contract.cleared)} cleared ({data.contract.clearedPct}% invoiced)
                </p>
                <Progress value={data.contract.clearedPct} label="Invoiced share" className="mt-3" />
              </div>
              <ul className="space-y-3 lg:border-l lg:border-line lg:pl-6">
                {data.people.map((p) => (
                  <li key={p.role} className="flex items-center gap-3">
                    <Avatar name={p.name} size="sm" />
                    <div className="">
                      <p className="text-body font-medium">
                        {p.name} {p.note && <span className="font-normal text-fg-3">({p.note})</span>}
                      </p>
                      <p className="text-meta text-fg-3">{p.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <KeyValueList items={data.specs} className="lg:border-l lg:border-line lg:pl-6" />
            </PanelBody>
          </Panel>

          <Panel className="mb-12">
            <PanelHeader
              title="Delivery lifecycle"
              description={`${data.stage}. ${data.variance}.`}
              action={<Badge tone="accent">Target PTO {data.targetPto}</Badge>}
            />
            <PanelBody className="space-y-4">
              <Stepper steps={data.steps} />
              <Notice tone="ok" title={`Field execution: ${data.pulse.title}`}>
                {data.pulse.body}
                <span className="mt-2 flex flex-wrap gap-2">
                  {data.pulse.tags.map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </span>
              </Notice>
            </PanelBody>
          </Panel>

          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
              <Panel>
                <PanelHeader title="Engineering and hardware manifest" action={<Badge tone="ok">{data.bom.rev}</Badge>} />
                <PanelBody className="space-y-6">
                  <dl className="grid gap-4 sm:grid-cols-3">
                    {data.bom.items.map((i) => (
                      <div key={i.k}>
                        <dt className="text-meta text-fg-2">{i.k}</dt>
                        <dd className="font-semibold">{i.v}</dd>
                        <dd className="text-meta text-fg-3">{i.note}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="border-t border-line pt-4">
                    <p className="mb-2 text-body font-medium">Array configuration</p>
                    <KeyValueList columns={2} items={data.bom.arrays} />
                  </div>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title="Field crew telemetry and quality" description={data.telemetry.crew} />
                <PanelBody className="space-y-6">
                  <dl className="grid gap-4 sm:grid-cols-3">
                    {data.telemetry.readings.map((r) => (
                      <div key={r.k} className="sm:border-l sm:border-line sm:pl-4 sm:first:border-0 sm:first:pl-0">
                        <dt className="text-meta text-fg-2">{r.k}</dt>
                        <dd className="tnum text-title font-semibold">{r.v}</dd>
                        <dd className="text-meta text-fg-3">{r.note}</dd>
                      </div>
                    ))}
                  </dl>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-body font-medium">Crew photo uploads, mandatory gate evidence</p>
                      <PlaceholderLink className="tap text-body text-accent-fg hover:underline">
                        View {data.telemetry.photoTotal} raw assets
                      </PlaceholderLink>
                    </div>
                    <ul className="grid grid-cols-3 gap-3">
                      {data.telemetry.photos.map((p) => (
                        <li key={p.caption}>
                          <Photo src={p.src} alt={p.caption} ratio="aspect-[3/2]" caption={p.caption} meta={p.meta} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title="Self-assessment versus physical survey" action={<Badge tone="ok">{data.audit.tolerance}</Badge>} />
                <Table stack>
                  <thead>
                    <tr>
                      <Th>Metric</Th>
                      <Th className="whitespace-normal!">Customer self-assessment</Th>
                      <Th className="whitespace-normal!">Physical site audit (Oct 19)</Th>
                      <Th>Variance</Th>
                      <Th className="hidden md:table-cell">Resolution</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.audit.rows.map((r) => (
                      <Tr key={r.metric}>
                        <Td label="Metric" className="font-medium">{r.metric}</Td>
                        <Td label="Customer self-assessment" className="text-fg-2">{r.self}</Td>
                        <Td label="Physical site audit (Oct 19)">{r.survey}</Td>
                        <Td label="Variance" className={cx(r.variance.startsWith('+') || r.variance.startsWith('-') ? 'text-warn' : 'text-fg-2')}>{r.variance}</Td>
                        <Td label="Resolution" className="hidden text-fg-2 md:table-cell">{r.resolution}</Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
              </Panel>
            </div>

            <div className="space-y-8 lg:col-span-2">
              <Panel>
                <PanelHeader title="Financial ledger" action={<Badge tone="ok">{data.ledger.status}</Badge>} />
                <PanelBody className="space-y-4">
                  <div>
                    <p className="tnum text-figure font-semibold">
                      {fmt.usd(data.contract.cleared)} <span className="text-body font-normal text-fg-2">/ {fmt.usd(data.contract.total)} invoiced and collected</span>
                    </p>
                    <div className="mt-2 flex h-2 w-full gap-1 overflow-hidden rounded-control" role="img" aria-label="Contract split by milestone">
                      {data.ledger.split.map((s, i) => (
                        <span key={s.label} className={cx('h-full', ['bg-accent', 'bg-accent/60', 'bg-surface-3'][i])} style={{ width: `${s.pct}%` }} />
                      ))}
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-x-4 text-meta text-fg-2">
                      {data.ledger.split.map((s) => (
                        <li key={s.label} className="tnum">
                          {s.label} {s.pct}%
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ul className="divide-y divide-line">
                    {data.ledger.rows.map((r) => (
                      <li key={r.name} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="text-body font-medium">{r.name}</p>
                          <p className="text-meta text-fg-3">{r.note}</p>
                        </div>
                        <span className={cx('tnum shrink-0 text-body font-semibold', r.state === 'pending' && 'text-fg-2')}>{fmt.usdCents(r.amount)}</span>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
                <PanelFooter>
                  <PlaceholderLink className="text-body text-accent-fg hover:underline">
                    View full GAAP revenue schedule
                  </PlaceholderLink>
                </PanelFooter>
              </Panel>

              <Panel>
                <PanelHeader title="Permitting and interconnection" />
                <PanelBody>
                  <ul className="divide-y divide-line">
                    {data.permits.map((p) => (
                      <li key={p.ref} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-meta text-fg-2">{p.authority}</p>
                          <Badge tone={p.tone}>{p.status}</Badge>
                        </div>
                        <p className="mt-1 text-body font-medium">
                          {p.name} <span className="text-body font-normal text-fg-3">{p.ref}</span>
                        </p>
                        <p className="text-meta text-fg-2">{p.body}</p>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
                <PanelFooter className="text-body text-fg-2">{data.permitSla}</PanelFooter>
              </Panel>

              <Panel>
                <PanelHeader title="Management audit trail" description={`${data.trail.length + notes.length} entries today`} />
                <PanelBody>
                  <ActivityList items={[...notes, ...data.trail]} />
                </PanelBody>
                <PanelFooter>
                  <form
                    className="flex w-full gap-3"
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (!note.trim()) return
                      setNotes((n) => [{ time: 'Just now', title: 'Jonathan Mercer (regional director)', body: note.trim() }, ...n])
                      setNote('')
                    }}
                  >
                    <Textarea aria-label="Append executive note" rows={1} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Append an executive note" className="min-h-11 resize-none lg:min-h-10" />
                    <Button type="submit" disabled={!note.trim()}>
                      Send
                    </Button>
                  </form>
                </PanelFooter>
              </Panel>
            </div>
          </div>

          <p className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-body text-fg-2">
            <span>{data.compliance}</span>
            <span>
              Squad emergency hotline{' '}
              <a href={`tel:${data.hotline}`} className="tnum font-medium text-fg hover:underline">
                {data.hotline}
              </a>
            </span>
          </p>
        </>
      )}
    </QueryBoundary>
  )
}
