import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { FilterChips } from '@/components/ui/chips'
import { Input, Select } from '@/components/ui/field'
import { FilterBar } from '@/components/ui/filter-bar'
import { Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Pagination } from '@/components/ui/pagination'
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
                <Button>Export CSV</Button>
              </>
            }
          />

          <StatRow className="mb-12">
            {data.stats.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} note={s.note} tone={s.tone} />
            ))}
          </StatRow>

          <Panel>
            <FilterBar tabs={<FilterChips chips={portfolioStages} value={stage} onChange={setStage} label="Filter by lifecycle stage" />}>
                <Input
                  type="search"
                  aria-label="Search projects"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Project ID, customer name or address"
                  className="w-full md:max-w-xs"
                />
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
            </FilterBar>

            {rows.length === 0 ? (
              <PanelBody>
                <EmptyState title="No projects match" description="Try another stage or clear the search." />
              </PanelBody>
            ) : (
              <Table>
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
                    <Th className="hidden xl:table-cell">Sales owner</Th>
                    <Th className="hidden 2xl:table-cell">System</Th>
                    <Th className="hidden md:table-cell">Lifecycle stage</Th>
                    <Th className="hidden lg:table-cell">Timeline</Th>
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
                        <Link to={withId(ROUTES.manage.project, r.id)} className="text-body font-medium whitespace-nowrap text-accent-fg hover:underline">
                          {r.id}
                        </Link>
                        <p className="text-meta text-fg-3">{r.type}</p>
                      </Td>
                      <Td>
                        <p className="font-medium">{r.customer}</p>
                        <p className="text-meta text-fg-3">{r.address}</p>
                      </Td>
                      <Td className="hidden xl:table-cell">
                        <p className="whitespace-nowrap">{r.owner}</p>
                        <p className="text-meta text-fg-3">{r.territory}</p>
                      </Td>
                      <Td className="hidden 2xl:table-cell">
                        <p className="whitespace-nowrap">{r.system}</p>
                        <p className="text-meta text-fg-3">{r.hardware}</p>
                      </Td>
                      <Td className="hidden md:table-cell">
                        <p className="whitespace-nowrap">{r.stageLabel}</p>
                        <p className="text-meta text-fg-3">{r.stageNote}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Progress value={r.pct} label={`${r.id} progress`} className="w-16" />
                          <span className="tnum text-meta whitespace-nowrap text-fg-2">
                            {r.pct}% {r.progressLabel.toLowerCase()}
                          </span>
                        </div>
                      </Td>
                      <Td className="hidden whitespace-nowrap lg:table-cell">
                        <p className="tnum">{r.milestone}</p>
                        <p className="tnum text-meta text-fg-3">PTO {r.pto}</p>
                      </Td>
                      <Td>
                        <Badge tone={r.healthTone}>{r.health}</Badge>
                      </Td>
                      <Td className="text-right">
                        <ButtonLink to={withId(ROUTES.manage.project, r.id)} size="sm">
                          {r.action}
                        </ButtonLink>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}

            <PanelFooter className="justify-between text-body text-fg-2">
              <span className="tnum">
                Showing 1 to {rows.length} of {data.total} projects. Contract value in view {fmt.usd(data.valueInView)}.
              </span>
              <Pagination page={1} pages={15} />
            </PanelFooter>
          </Panel>

          <div className="mt-12 grid gap-x-12 gap-y-12 lg:grid-cols-3 lg:items-start">
            <Panel className="lg:col-span-2">
              <PanelHeader
                title="Interconnection queue"
                description="Throughput for municipal permitting and utility PTO clearances."
                action={<Badge>Average {data.interconnection.avg}</Badge>}
              />
              <PanelBody>
                <StatRow>
                  {data.interconnection.queues.map((q) => (
                    <Stat key={q.utility} label={q.utility} value={q.days} unit="days" note={<Badge tone={q.tone}>{q.note}</Badge>} />
                  ))}
                </StatRow>
              </PanelBody>
              <PanelFooter className="justify-between text-body text-fg-2">
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
                    <li key={c.crew} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="text-body font-medium">{c.crew}</p>
                        <p className="text-meta text-fg-3">{c.task}</p>
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
