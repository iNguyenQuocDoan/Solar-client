import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { FilterChips } from '@/components/ui/chips'
import { Select } from '@/components/ui/field'
import { Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stat, StatRow } from '@/components/ui/stat'
import { EmptyState } from '@/components/ui/states'
import { Table, Td, Th, Tr } from '@/components/ui/table'
import { ROUTES, withId } from '@/constants/routes'
import { portfolio, portfolioRows, portfolioStages, type PortfolioStage } from '@/data/manage'
import { fmt } from '@/lib/format'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function ManagePortfolioPage() {
  const query = useMockQuery(['manage', 'portfolio'], portfolio)
  const [stage, setStage] = useState<PortfolioStage | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return portfolioRows.filter(
      (r) =>
        (stage === 'all' || r.stage === stage) &&
        (!q || r.id.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q) || r.address.toLowerCase().includes(q)),
    )
  }, [stage, search])

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id))

  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            title="Project portfolio"
            description="Lifecycle governance across distributed residential and commercial arrays."
            actions={
              <>
                <Button disabled={selected.size === 0}>
                  Batch reassign owner{selected.size > 0 ? ` (${selected.size})` : ''}
                </Button>
                <Button variant="primary">
                  Export CSV
                </Button>
              </>
            }
          />

          <StatRow className="mb-10">
            {data.stats.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} note={s.note} tone={s.tone} />
            ))}
          </StatRow>

          <Panel>
            <PanelBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="relative block w-full md:max-w-xs">
                  <span className="sr-only">Search projects</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Project ID, customer name or address"
                    className="h-9 w-full rounded-md border border-line-2 bg-transparent px-3 text-[15px] placeholder:text-fg-3 focus:border-fg"
                  />
                </label>
                <Select aria-label="Sales staff" className="w-auto">
                  {data.filters.staff.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
                <Select aria-label="Health status" className="w-auto">
                  {data.filters.health.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
                <Select aria-label="Period" className="w-auto">
                  {data.filters.period.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
              </div>
              <FilterChips chips={portfolioStages} value={stage} onChange={setStage} label="Filter by lifecycle stage" />
            </PanelBody>

            {rows.length === 0 ? (
              <PanelBody>
                <EmptyState title="No projects match" description="Try another stage or clear the search." />
              </PanelBody>
            ) : (
              <Table className="min-w-[1080px] text-[14px]">
                <thead>
                  <tr>
                    <Th className="w-10">
                      <input
                        type="checkbox"
                        aria-label="Select all visible"
                        className="size-4 accent-accent"
                        checked={allSelected}
                        onChange={() => setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)))}
                      />
                    </Th>
                    <Th>Project</Th>
                    <Th>Customer and site</Th>
                    <Th>Sales owner</Th>
                    <Th>System</Th>
                    <Th>Lifecycle stage</Th>
                    <Th>Timeline</Th>
                    <Th>Health</Th>
                    <Th>
                      <span className="sr-only">Action</span>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <Tr key={r.id} className={selected.has(r.id) ? 'bg-accent-soft/40' : undefined}>
                      <Td>
                        <input
                          type="checkbox"
                          aria-label={`Select ${r.id}`}
                          className="size-4 accent-accent"
                          checked={selected.has(r.id)}
                          onChange={() =>
                            setSelected((s) => {
                              const next = new Set(s)
                              if (next.has(r.id)) next.delete(r.id)
                              else next.add(r.id)
                              return next
                            })
                          }
                        />
                      </Td>
                      <Td>
                        <Link to={withId(ROUTES.manage.project, r.id)} className="text-[14px] font-medium whitespace-nowrap text-accent-fg hover:underline">
                          {r.id}
                        </Link>
                        <p className="text-[13px] text-fg-3">{r.type}</p>
                      </Td>
                      <Td>
                        <p className="font-medium">{r.customer}</p>
                        <p className="text-[13px] text-fg-3">{r.address}</p>
                      </Td>
                      <Td>
                        <span className="flex items-center gap-2 whitespace-nowrap">
                          <Avatar name={r.owner} size="sm" />
                          <span>
                            <span className="block">{r.owner}</span>
                            <span className="block text-[13px] text-fg-3">{r.territory}</span>
                          </span>
                        </span>
                      </Td>
                      <Td className="min-w-40">
                        <p className="whitespace-nowrap">{r.system}</p>
                        <p className="text-[13px] text-fg-3">{r.hardware}</p>
                      </Td>
                      <Td className="min-w-52">
                        <p className="whitespace-nowrap">{r.stageLabel}</p>
                        <p className="text-[13px] text-fg-3">{r.stageNote}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Progress value={r.pct} label={`${r.id} progress`} className="w-24" />
                          <span className="tnum text-[13px] text-fg-2">
                            {r.pct}% {r.progressLabel.toLowerCase()}
                          </span>
                        </div>
                      </Td>
                      <Td className="whitespace-nowrap">
                        <p className="tnum">{r.milestone}</p>
                        <p className="tnum text-[13px] text-fg-3">PTO {r.pto}</p>
                      </Td>
                      <Td>
                        <Badge tone={r.healthTone}>{r.health}</Badge>
                      </Td>
                      <Td className="text-right">
                        <ButtonLink to={withId(ROUTES.manage.project, r.id)} size="sm" variant={r.healthTone === 'danger' ? 'primary' : 'secondary'}>
                          {r.action}
                        </ButtonLink>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}

            <PanelFooter className="justify-between text-[14px] text-fg-2">
              <span className="tnum">
                Showing 1 to {rows.length} of {data.total} projects. Contract value in view {fmt.usd(data.valueInView)}.
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
                <span className="px-1 text-fg-3">...</span>
                <Button size="sm" variant="ghost" className="tnum min-w-8 px-2">
                  15
                </Button>
                <Button size="sm" variant="ghost">
                  Next
                </Button>
              </nav>
            </PanelFooter>
          </Panel>

          <div className="mt-10 grid gap-x-12 gap-y-10 lg:grid-cols-3 lg:items-start">
            <Panel className="lg:col-span-2">
              <PanelHeader
                title="Interconnection queue"
                description="Throughput for municipal permitting and utility PTO clearances."
                action={<Badge>Average {data.interconnection.avg}</Badge>}
              />
              <PanelBody>
                <dl className="grid grid-cols-2 gap-5 md:grid-cols-4">
                  {data.interconnection.queues.map((q) => (
                    <div key={q.utility} className="md:border-l md:border-line md:pl-5 md:first:border-0 md:first:pl-0">
                      <dt className="text-[13px] text-fg-2">{q.utility}</dt>
                      <dd className="tnum text-2xl font-semibold">
                        {q.days} <span className="text-[15px] font-normal text-fg-2">days</span>
                      </dd>
                      <dd>
                        <Badge tone={q.tone}>{q.note}</Badge>
                      </dd>
                    </div>
                  ))}
                </dl>
              </PanelBody>
              <PanelFooter className="justify-between text-[14px] text-fg-2">
                <span>{data.interconnection.refresh}</span>
                <Link to="#" className="text-accent-fg hover:underline">
                  Download AHJ bottleneck report
                </Link>
              </PanelFooter>
            </Panel>

            <Panel>
              <PanelHeader title="Field squad status" description={`${data.crews.active} installation trucks deployed in Southern California.`} />
              <PanelBody>
                <ul className="divide-y divide-line">
                  {data.crews.rows.map((c) => (
                    <li key={c.crew} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium">{c.crew}</p>
                        <p className="text-[13px] text-fg-3">{c.task}</p>
                      </div>
                      <Badge tone={c.tone}>{c.status}</Badge>
                    </li>
                  ))}
                </ul>
              </PanelBody>
              <PanelFooter>
                <Button size="sm">Open dispatch map</Button>
              </PanelFooter>
            </Panel>
          </div>
        </>
      )}
    </QueryBoundary>
  )
}
