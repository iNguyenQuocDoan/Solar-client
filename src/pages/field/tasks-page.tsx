import { useMemo, useState } from 'react'
import { Badge, type Tone } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { FilterChips } from '@/components/ui/chips'
import { Checkbox, Select } from '@/components/ui/field'
import { Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter } from '@/components/ui/panel'
import { Stat, StatRow } from '@/components/ui/stat'
import { EmptyState } from '@/components/ui/states'
import { ROUTES, withId } from '@/constants/routes'
import { fieldContext, JOB_LABEL, tasksPage, workOrders, type JobKind, type WorkOrder } from '@/data/field'
import { QueryBoundary, useMockQuery } from '@/services/mock'

const PRIORITY_TONE: Record<WorkOrder['priority'], Tone> = { Urgent: 'danger', High: 'warn', Normal: 'neutral' }
const DETAIL_ROUTE: Partial<Record<JobKind, string>> = {
  survey: withId(ROUTES.field.survey, 'SS-PRJ-2024-089'),
  installation: withId(ROUTES.field.installation, 'SS-PRJ-2024-042'),
}

export function FieldTasksPage() {
  const query = useMockQuery(['field', 'tasks'], { ...tasksPage, orders: workOrders })
  const [timeline, setTimeline] = useState<'today' | 'upcoming' | 'completed' | 'all'>('today')
  const [type, setType] = useState<JobKind | 'all'>('all')
  const [priority, setPriority] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return workOrders.filter(
      (o) =>
        (timeline === 'all' || o.timeline === timeline) &&
        (type === 'all' || o.kind === type) &&
        (priority === 'all' || o.priority === priority) &&
        (!q || o.customer.toLowerCase().includes(q) || o.address.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)),
    )
  }, [timeline, type, priority, search])

  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            meta={<span>Dispatcher Zone 4, shift active {fieldContext.shiftWindow}</span>}
            title="Field tasks and work orders"
            description={`${data.activeToday} active for today. ${data.sync}.`}
          />

          <StatRow className="mb-12">
            <Stat label="Today's jobs" value={data.stats.jobs.done} unit={`/ ${data.stats.jobs.planned} planned`} />
            <Stat label="Travel distance" value={data.stats.miles} unit="mi" note={`Next leg ${data.stats.nextLeg}`} />
            <Stat label="Critical and high" value={data.stats.critical} unit="need sign-off" note={data.stats.criticalNote} tone="danger" />
            <Stat label="Parts in van" value={`${data.stats.parts}%`} note={data.stats.partsNote} />
          </StatRow>

          <Panel>
            <PanelBody className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <label className="relative block w-full md:max-w-sm">
                  <span className="sr-only">Search work orders</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Customer name, street address or work order"
                    className="h-9 w-full rounded-control border border-line-2 bg-transparent px-3 text-body placeholder:text-fg-3 focus:border-fg"
                  />
                </label>
                <Select aria-label="Priority" className="w-auto" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="all">Priority: all levels</option>
                  <option value="Urgent">Urgent / critical</option>
                  <option value="High">High priority</option>
                  <option value="Normal">Normal priority</option>
                </Select>
                <Select aria-label="Bulk action" className="w-auto" disabled={selected.size === 0} defaultValue="">
                  <option value="" disabled>
                    Bulk action ({selected.size} selected)
                  </option>
                  <option>Mark en route</option>
                  <option>Reschedule batch</option>
                  <option>Export offline packets</option>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-meta text-fg-2">Timeline</span>
                  <FilterChips chips={[...data.timelines]} value={timeline} onChange={setTimeline} label="Timeline" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-meta text-fg-2">Type</span>
                  <FilterChips chips={[...data.types]} value={type} onChange={setType} label="Job type" />
                </div>
              </div>
            </PanelBody>
          </Panel>

          {rows.length === 0 ? (
            <EmptyState
              className="mt-6"
              title="No work orders match"
              description={timeline === 'today' ? 'Your route for today is clear under these filters.' : 'Nothing scheduled under these filters.'}
              action={
                <Button
                  size="sm"
                  onClick={() => {
                    setTimeline('today')
                    setType('all')
                    setPriority('all')
                    setSearch('')
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ul className="mt-8 divide-y divide-line border-t border-line">
              {rows.map((o) => (
                <li key={o.id} className="py-6">
                  <Panel>
                    <PanelBody className="grid gap-4 md:grid-cols-[180px_1fr_auto]">
                      <div>
                        <Checkbox
                          checked={selected.has(o.id)}
                          onChange={() => toggle(o.id)}
                          label={<span className="text-body font-medium">{o.id}</span>}
                        />
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge tone="accent">{JOB_LABEL[o.kind]}</Badge>
                          <Badge tone={PRIORITY_TONE[o.priority]}>{o.priority}</Badge>
                        </div>
                        <p className="tnum mt-2 text-body">{o.window}</p>
                        <p className="text-meta text-fg-2">{o.status}</p>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <p className="text-body font-semibold">{o.customer}</p>
                          <a href={`tel:${o.phone}`} className="tnum inline-flex items-center gap-1 text-body text-accent-fg hover:underline"> {o.phone}
                          </a>
                        </div>
                        <p className="text-body text-fg-2">
                          {o.address} <span className="text-fg-3">({o.distance})</span>
                        </p>
                        <div className="mt-3 rounded-control bg-surface-2 px-3 py-3 text-body">
                          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                            <p className="font-medium">{o.scope}</p>
                            <p className="tnum text-fg-2">{o.progress}</p>
                          </div>
                          <p className="text-meta text-fg-3">{o.scopeNote}</p>
                          {o.pct !== undefined && <Progress value={o.pct} label={`${o.id} progress`} className="mt-2" />}
                        </div>
                      </div>

                      <div className="flex flex-row gap-2 md:w-40 md:flex-col">
                        <Button size="sm" variant={o.actionPrimary ? 'primary' : 'secondary'}>
                          {o.action}
                        </Button>
                        {DETAIL_ROUTE[o.kind] ? (
                          <ButtonLink to={DETAIL_ROUTE[o.kind]!} size="sm" variant="ghost">
                            Work order
                          </ButtonLink>
                        ) : (
                          <Button size="sm" variant="ghost">
                            Work order
                          </Button>
                        )}
                      </div>
                    </PanelBody>
                  </Panel>
                </li>
              ))}
            </ul>
          )}

          <Panel className="mt-12">
            <PanelFooter className="justify-between border-t-0 text-body text-fg-2">
              <span>{data.footer.safety}</span>
              <span className="flex flex-wrap gap-x-4">
                <span>
                  Emergency dispatch <a href="tel:18005557652" className="tnum font-medium text-fg hover:underline">{data.footer.dispatch}</a>
                </span>
                <a href="#" className="text-accent-fg hover:underline">
                  Equipment returns
                </a>
              </span>
            </PanelFooter>
          </Panel>
        </>
      )}
    </QueryBoundary>
  )
}
