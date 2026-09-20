import { useId } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/field'
import { Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stat, StatRow } from '@/components/ui/stat'
import { Table, Td, Th, Tr } from '@/components/ui/table'
import { revenue } from '@/data/manage'
import { cx } from '@/lib/cx'
import { fmt } from '@/lib/format'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function ManageRevenuePage() {
  const query = useMockQuery(['manage', 'revenue'], revenue)
  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            title="Revenue and margin analytics"
            description="Cash realization milestones, margin discipline and pipeline conversion across regional installation fleets."
            meta={<Badge>Regional scope: {data.scope}</Badge>}
            actions={
              <>
                <Button>Consolidate entities</Button>
                <Button variant="ghost">Print</Button>
              </>
            }
          />

          <StatRow className="mb-12 md:grid-cols-5">
            {data.kpis.map((k) => (
              <Stat key={k.label} label={k.label} value={<span className="text-figure">{k.value}</span>} note={k.note} tone={k.tone} />
            ))}
          </StatRow>

          <div className="mb-12 grid gap-x-12 gap-y-12 lg:grid-cols-3 lg:items-start">
            <Panel className="lg:col-span-2">
              <PanelHeader title="Milestone cash flow versus booked contracts" description="Six-month trace, in millions of dollars." />
              <PanelBody>
                <LineChart months={data.series.months} booked={data.series.booked} realized={data.series.realized} />
                <p className="mt-3 text-meta text-fg-3">{data.series.note}</p>
              </PanelBody>
              <PanelFooter className="justify-between text-body">
                <span className="text-fg-2">{data.series.insight}</span>
                <Badge tone="ok">+14.2% YoY</Badge>
              </PanelFooter>
            </Panel>

            <Panel>
              <PanelHeader title="Tier distribution" description="Revenue split by hardware topology." />
              <PanelBody>
                <ul className="space-y-4">
                  {data.tiers.map((t) => (
                    <li key={t.label}>
                      <div className="mb-1 flex justify-between gap-3 text-body">
                        <span className="font-medium">{t.label}</span>
                        <span className="tnum">{fmt.usd(t.value)}</span>
                      </div>
                      <Progress value={t.pct} label={`${t.label} share`} />
                      <p className="tnum mt-1 text-meta text-fg-3">
                        {t.pct}%. {t.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </PanelBody>
              <PanelFooter className="text-body text-fg-2">Hardware backlog clearance: {data.backlog}</PanelFooter>
            </Panel>
          </div>

          <Panel className="mb-12">
            <PanelHeader
              title="Revenue and margin ledger"
              description="Live quotation audit with override tracking and milestone release status."
              action={<Badge>{data.ledger.filters.range}</Badge>}
            />
            <PanelBody className="mb-6 flex flex-wrap items-center gap-3">
              <label className="relative block w-full sm:max-w-xs">
                <span className="sr-only">Filter project or client</span>
                <input type="search" placeholder="Filter project or client" className="h-9 w-full rounded-control border border-line-2 bg-transparent px-3 text-body placeholder:text-fg-3 focus:border-fg" />
              </label>
              <Select aria-label="Sales adviser" className="w-auto">
                {data.ledger.filters.advisers.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
              <Select aria-label="Margin health" className="w-auto">
                {data.ledger.filters.margin.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </Select>
            </PanelBody>
            <Table className="text-body">
              <thead>
                <tr>
                  <Th>Project and customer</Th>
                  <Th>Adviser</Th>
                  <Th>System</Th>
                  <Th className="text-right">Gross quote</Th>
                  <Th className="text-right">Discounts</Th>
                  <Th className="text-right">Net contract</Th>
                  <Th className="text-right">Gross margin</Th>
                  <Th>Milestone</Th>
                </tr>
              </thead>
              <tbody>
                {data.ledger.rows.map((r) => (
                  <Tr key={r.id}>
                    <Td>
                      <p className="text-body text-fg-3">{r.id}</p>
                      <p className="font-medium">{r.customer}</p>
                      <p className="text-meta text-fg-3">{r.city}</p>
                    </Td>
                    <Td>
                      <span className="flex items-center gap-2 whitespace-nowrap">
                        <Avatar name={r.adviser} size="sm" />
                        <span>
                          <span className="block">{r.adviser}</span>
                          <span className="block text-meta text-fg-3">{r.tier}</span>
                        </span>
                      </span>
                    </Td>
                    <Td>
                      <p>{r.system}</p>
                      <p className="text-meta text-fg-3">{r.hardware}</p>
                    </Td>
                    <Td className="tnum text-right whitespace-nowrap">{fmt.usd(r.gross)}</Td>
                    <Td className={cx('tnum text-right whitespace-nowrap', r.discount < 0 ? 'text-warn' : 'text-fg-3')}>{r.discount < 0 ? fmt.usd(r.discount) : 'None'}</Td>
                    <Td className="tnum text-right font-medium whitespace-nowrap">{fmt.usd(r.net)}</Td>
                    <Td className="text-right">
                      <Badge tone={r.margin < 30 ? 'danger' : 'ok'}>{r.margin}%</Badge>
                    </Td>
                    <Td className="whitespace-nowrap text-fg-2">{r.stage}</Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            <PanelFooter className="justify-between text-body text-fg-2">
              <span className="tnum">
                Showing {data.ledger.rows.length} of {data.ledger.total} active accounts. <span className="text-warn">{data.ledger.flagged} account requires margin review (under 30%).</span>
              </span>
              <nav aria-label="Pagination" className="flex items-center gap-1">
                <Button size="sm" variant="ghost" disabled>
                  Previous
                </Button>
                {[1, 2, 3].map((p) => (
                  <Button key={p} size="sm" variant={p === 1 ? 'primary' : 'ghost'} aria-current={p === 1 ? 'page' : undefined} className="tnum min-w-8 px-2">
                    {p}
                  </Button>
                ))}
                <Button size="sm" variant="ghost">
                  Next
                </Button>
              </nav>
            </PanelFooter>
          </Panel>

          <Panel>
            <PanelHeader title="Milestone billing phases" />
            <PanelBody>
              <dl className="grid gap-6 md:grid-cols-3 md:divide-x md:divide-line">
                {data.phases.map((p, i) => (
                  <div key={p.label} className={cx(i > 0 && 'md:pl-6')}>
                    <dt className="flex items-center justify-between gap-2 text-body font-medium">
                      {p.label}
                      <Badge tone={p.tone}>{p.note.split(',')[0]}</Badge>
                    </dt>
                    <dd className="tnum mt-1 text-figure font-semibold">{fmt.usd(p.amount)}</dd>
                    <dd className="text-body text-fg-2">{p.body}</dd>
                    <dd className="mt-1 text-meta text-fg-3">{p.note}</dd>
                  </div>
                ))}
              </dl>
            </PanelBody>
          </Panel>
        </>
      )}
    </QueryBoundary>
  )
}

/* Two-series line chart drawn from the revenue data. Axis scale derives from the data. */
function LineChart({ months, booked, realized }: { months: string[]; booked: number[]; realized: number[] }) {
  const id = useId()
  const w = 600
  const h = 200
  const padX = 8
  const padY = 12
  const max = Math.max(...booked, ...realized) * 1.08
  const min = Math.min(...booked, ...realized) * 0.85
  const x = (i: number) => padX + (i / (months.length - 1)) * (w - padX * 2)
  const y = (v: number) => h - padY - ((v - min) / (max - min)) * (h - padY * 2)
  const path = (s: number[]) => s.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')

  return (
    <figure>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-labelledby={`${id}-title`}>
        <title id={`${id}-title`}>Booked contract value versus realized cash collections by month</title>
        {[0.25, 0.5, 0.75].map((t) => (
          <line key={t} x1={padX} x2={w - padX} y1={padY + t * (h - padY * 2)} y2={padY + t * (h - padY * 2)} className="stroke-line" strokeWidth={1} />
        ))}
        <path d={path(booked)} fill="none" className="stroke-accent" strokeWidth={2} strokeLinejoin="round" />
        <path d={path(realized)} fill="none" className="stroke-fg-3" strokeWidth={2} strokeDasharray="4 4" strokeLinejoin="round" />
        {booked.map((v, i) => (
          <circle key={`b${i}`} cx={x(i)} cy={y(v)} r={3.5} className="fill-accent" />
        ))}
        {realized.map((v, i) => (
          <circle key={`r${i}`} cx={x(i)} cy={y(v)} r={3.5} className="fill-fg-3" />
        ))}
      </svg>
      <div className="tnum mt-1 grid text-center text-meta text-fg-2" style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}>
        {months.map((m, i) => (
          <span key={m}>
            <span className="block font-medium text-fg">{m}</span>
            <span className="block">${booked[i]!.toFixed(2)}M</span>
          </span>
        ))}
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-meta text-fg-2">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-4 bg-accent" /> Booked contract value
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden className="h-0.5 w-4 border-t-2 border-dashed border-fg-3" /> Realized cash collections
        </span>
      </figcaption>
    </figure>
  )
}
