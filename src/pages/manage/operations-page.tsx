import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/field'
import { Photo, Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stat, StatRow } from '@/components/ui/stat'
import { Table, Td, Th, Tr } from '@/components/ui/table'
import { operations } from '@/data/manage'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function ManageOperationsPage() {
  const query = useMockQuery(['manage', 'operations'], operations)
  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            title="Operational throughput and fleet velocity"
            description="Performance across regional installation crews, AHJ pass compliance and post-PTO reliability."
            actions={
              <>
                <Button>Export CSV</Button>
                <Button variant="primary">Download executive brief</Button>
              </>
            }
          />

          <div className="mb-12 flex flex-wrap items-center gap-3">
            <Select size="sm" aria-label="Analysis horizon" className="w-auto">
              {data.filters.horizon.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
            <Select size="sm" aria-label="Territory" className="w-auto">
              {data.filters.territory.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
            <Select size="sm" aria-label="Asset class" className="w-auto">
              {data.filters.asset.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </Select>
            <span className="tnum text-body text-fg-2">{data.feeds} live telemetry feeds</span>
          </div>

          <StatRow className="mb-12 md:grid-cols-3 xl:grid-cols-5">
            {data.kpis.map((k) => (
              <Stat key={k.label} label={k.label} value={k.value} unit={k.unit} note={k.note} />
            ))}
          </StatRow>

          <Panel className="mb-12">
            <PanelHeader
              title="End-to-end pipeline throughput"
              description="Live volume across active contracts from initial inquiry through commercial activation."
              action={<Badge tone="ok">{data.throughput.handshakes} PTO handshakes this month</Badge>}
            />
            <PanelBody>
              <ol className="grid grid-cols-2 gap-y-6 sm:grid-cols-4 lg:grid-cols-7">
                {data.throughput.phases.map((p, i) => (
                  <li key={p.label} className="min-w-0 pr-3 lg:border-l lg:border-line lg:pl-3 lg:first:border-0 lg:first:pl-0">
                    <p className="tnum text-figure font-semibold">{p.count}</p>
                    <p className="text-body font-medium">{p.label}</p>
                    <p className="text-meta text-fg-3">{p.note}</p>
                    <p className={i === data.throughput.phases.length - 1 ? 'tnum mt-1 text-meta font-medium text-ok' : 'tnum mt-1 text-meta text-fg-2'}>
                      {i === data.throughput.phases.length - 1 ? p.avg : `Avg ${p.avg}`}
                    </p>
                  </li>
                ))}
              </ol>
            </PanelBody>
            <PanelFooter className="justify-between text-body text-fg-2">
              <span>Pipeline funnel distribution, 142 cumulative active projects</span>
              <span>
                Conversion rate <span className="tnum font-medium text-fg">{data.throughput.conversion}</span>
              </span>
            </PanelFooter>
          </Panel>

          <div className="mb-12 grid gap-x-12 gap-y-12 lg:grid-cols-5 lg:items-start">
            <Panel className="lg:col-span-3">
              <PanelHeader title="Field squad operations" description="Regional deployment velocity and residential install timelines." action={<Badge>Average {data.squads.avgSpeed}</Badge>} />
              <Table>
                <thead>
                  <tr>
                    <Th>Squad</Th>
                    <Th className="text-right">Turnaround</Th>
                    <Th className="text-right">First-pass AHJ</Th>
                    <Th className="text-right">Active installs</Th>
                    <Th className="hidden text-right wide:table-cell">Utilization</Th>
                    <Th className="hidden text-right wide:table-cell">Zero-incident days</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.squads.rows.map((s) => (
                    <Tr key={s.name}>
                      <Td>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-meta text-fg-3">
                          {s.metro}. {s.lead}.
                        </p>
                      </Td>
                      <Td className="tnum text-right font-medium">{s.turnaround}</Td>
                      <Td className="tnum text-right">{s.pass}</Td>
                      <Td className="tnum text-right">{s.installs} sites</Td>
                      <Td className="tnum hidden text-right wide:table-cell">{s.utilization}</Td>
                      <Td className="tnum hidden text-right wide:table-cell">{s.safety}</Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
              <PanelBody>
                <Photo src={data.squads.benchmark.src} alt={data.squads.benchmark.title} ratio="aspect-[21/9]" caption={`Benchmark site: ${data.squads.benchmark.title}`} meta={data.squads.benchmark.meta} />
              </PanelBody>
            </Panel>

            <Panel className="lg:col-span-2">
              <PanelHeader title="Post-PTO reliability" description="Post-commissioning warranty incident audit." action={<Badge tone="ok">{data.reliability.uptime}</Badge>} />
              <PanelBody className="space-y-6">
                <ul className="divide-y divide-line border-t border-line">
                  {data.reliability.incidents.map((i) => (
                    <li key={i.label}>
                      <div className="mb-1 flex justify-between gap-3 text-body">
                        <span className="font-medium">{i.label}</span>
                        <span className="tnum text-fg-2">{i.pct}%</span>
                      </div>
                      <Progress value={i.pct} label={`${i.label} share of incidents`} />
                      <p className="mt-1 text-meta text-fg-3">{i.note}</p>
                    </li>
                  ))}
                </ul>
                <dl className="grid grid-cols-2 gap-4 border-t border-line pt-4">
                  <div>
                    <dt className="text-meta text-fg-2">Closed and resolved</dt>
                    <dd className="tnum text-figure font-semibold">{data.reliability.closed} tickets</dd>
                  </div>
                  <div>
                    <dt className="text-meta text-fg-2">Open in field</dt>
                    <dd className="tnum text-figure font-semibold">{data.reliability.open} under SLA</dd>
                  </div>
                </dl>
                <p className="text-meta text-fg-3">MTTR resolution trend: {data.reliability.mttrTrend}.</p>
              </PanelBody>
              <PanelFooter>
                <Button size="sm">Dispatch warranty special unit</Button>
              </PanelFooter>
            </Panel>
          </div>

          <Panel>
            <PanelHeader title="Municipal jurisdiction (AHJ) friction" description="Bottleneck detection across local building departments and electric utility partners. Code registry syncs daily." />
            <Table>
              <thead>
                <tr>
                  <Th>Authority or utility</Th>
                  <Th className="hidden md:table-cell">Metro region</Th>
                  <Th className="text-right">Avg turnaround</Th>
                  <Th className="text-right">Pass rate</Th>
                  <Th className="text-right">Active audits</Th>
                  <Th>SLA risk</Th>
                </tr>
              </thead>
              <tbody>
                {data.ahj.rows.map((r) => (
                  <Tr key={r.authority}>
                    <Td>
                      <p className="font-medium">{r.authority}</p>
                      <p className="text-meta text-fg-3">{r.note}</p>
                    </Td>
                    <Td className="hidden md:table-cell">{r.region}</Td>
                    <Td className="tnum text-right">{r.days} days</Td>
                    <Td className="tnum text-right">{r.pass}</Td>
                    <Td className="tnum text-right">{r.audits} permits</Td>
                    <Td>
                      <Badge tone={r.tone}>{r.risk}</Badge>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
            <PanelFooter className="justify-between text-body text-fg-2">
              <span>Showing the top 3 jurisdictions, {data.ahj.share}.</span>
              <Link to="#" className="text-accent-fg hover:underline">
                View all {data.ahj.total} regional AHJs
              </Link>
            </PanelFooter>
          </Panel>
        </>
      )}
    </QueryBoundary>
  )
}
