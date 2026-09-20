import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { FilterChips } from '@/components/ui/chips'
import { ActivityList, Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/ui/panel'
import { EmptyState } from '@/components/ui/states'
import { ROUTES, withId } from '@/constants/routes'
import { fieldContext, JOB_LABEL, techDashboard, type JobKind } from '@/data/field'
import { QueryBoundary, useMockQuery } from '@/services/mock'

type Filter = JobKind | 'all'

const JOB_ROUTE: Partial<Record<JobKind, string>> = {
  survey: withId(ROUTES.field.survey, 'SS-PRJ-2024-089'),
  installation: withId(ROUTES.field.installation, 'SS-PRJ-2024-042'),
}

export function FieldDashboardPage() {
  const query = useMockQuery(['field', 'dashboard'], techDashboard)
  const [filter, setFilter] = useState<Filter>('all')

  return (
    <QueryBoundary query={query}>
      {(data) => {
        const jobs = data.schedule.filter((j) => filter === 'all' || j.kind === filter)
        return (
          <>
            <PageHeader
              meta={<span>Shift {fieldContext.shiftWindow}</span>}
              title={fieldContext.shift}
              description={`${data.quota.done} of ${data.quota.total} tasks completed today. ${data.weather.summary}. ${data.weather.detail}.`}
              actions={
                <Button>
                  Call HQ dispatch
                </Button>
              }
            />

            <div className="mb-12 flex flex-wrap gap-3">
              <Button variant="primary">
                Start travel
              </Button>
              <Button>Add site photo</Button>
              <Button>Report site issue</Button>
            </div>

            <div className="grid gap-x-12 gap-y-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Panel>
                  <PanelHeader title="Today's schedule" description={data.date} />
                  <PanelBody className="mb-6">
                    <FilterChips chips={[...data.queue]} value={filter} onChange={setFilter} label="Filter today's queue" />
                  </PanelBody>
                  <PanelBody>
                    {jobs.length === 0 ? (
                      <EmptyState title="Nothing in this queue today" description="Switch the filter to see the rest of the route." />
                    ) : (
                      <ol className="divide-y divide-line">
                        {jobs.map((job) => (
                          <li key={job.time} className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[92px_1fr]">
                            <div>
                              <p className="tnum text-body font-semibold">{job.time}</p>
                              <p className="text-meta text-fg-3">{JOB_LABEL[job.kind]}</p>
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-body font-semibold">{job.customer}</p>
                                <Badge tone={job.tone}>{job.status}</Badge>
                              </div>
                              <p className="text-body text-fg-2">{job.address}</p>
                              <p className="mt-1 text-body text-fg-2">{job.detail}</p>
                              {'step' in job && (
                                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_140px]">
                                  <div>
                                    <div className="mb-2 flex justify-between text-meta">
                                      <span className="font-medium">{job.step}</span>
                                      <span className="tnum text-fg-2">{job.pct}%</span>
                                    </div>
                                    <Progress value={job.pct ?? 0} label="Installation progress" />
                                    <p className="mt-2 text-meta text-fg-3">{job.onSite}</p>
                                  </div>
                                  <img src={job.photo} alt="Roof racking phase" className="aspect-[3/2] w-full rounded-container object-cover" loading="lazy" />
                                </div>
                              )}
                              <div className="mt-3">
                                {JOB_ROUTE[job.kind] ? (
                                  <ButtonLink to={JOB_ROUTE[job.kind]!} size="sm">
                                    {job.action}
                                  </ButtonLink>
                                ) : (
                                  <Button size="sm">
                                    {job.action}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </PanelBody>
                </Panel>
              </div>

              <div className="space-y-8 lg:border-l lg:border-line lg:pl-8">
                <Panel>
                  <PanelHeader title={`Week ${data.outlook.week} outlook`} />
                  <PanelBody>
                    <dl className="grid grid-cols-3 divide-x divide-line">
                      {[
                        ['Surveys', data.outlook.surveys],
                        ['Installs', data.outlook.installs],
                        ['Warranty', data.outlook.warranty],
                      ].map(([label, n]) => (
                        <div key={label} className="px-3 first:pl-0 last:pr-0">
                          <dd className="tnum text-figure font-semibold">{n}</dd>
                          <dt className="text-meta text-fg-2">{label}</dt>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 mb-2 border-t border-line pt-3 text-body font-medium">Tomorrow's first calls</p>
                    <ul className="space-y-2">
                      {data.tomorrow.map((t) => (
                        <li key={t.time} className="flex gap-3 text-body">
                          <span className="tnum w-20 shrink-0 text-fg-2">{t.time}</span>
                          <span>
                            <span className="font-medium">{t.kind}</span>
                            <span className="block text-meta text-fg-3">{t.who}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </PanelBody>
                </Panel>

                <Panel>
                  <PanelHeader title="Completed today" action={<Badge tone="ok">{data.completed.length} synced</Badge>} />
                  <PanelBody>
                    <ActivityList items={data.completed} />
                  </PanelBody>
                </Panel>

              </div>
            </div>
          </>
        )
      }}
    </QueryBoundary>
  )
}
