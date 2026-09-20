import { Link } from 'react-router'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { ActivityList, Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { ROUTES } from '@/constants/routes'
import { opsContext, salesDashboard } from '@/data/ops'
import { cx } from '@/lib/cx'
import { fmt } from '@/lib/format'
import { QueryBoundary, useMockQuery } from '@/services/mock'

const STAGE_FILL = ['bg-accent', 'bg-accent/70', 'bg-accent/45', 'bg-accent/25']

export function OpsDashboardPage() {
  const query = useMockQuery(['ops', 'dashboard'], salesDashboard)
  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            meta={<span>{opsContext.team}</span>}
            title={`${data.priorityCount} priority actions today`}
            description={`Across ${data.pipelineCount} active project pipelines. ${data.conditions}`}
            actions={<Button>Batch dispatch tasks</Button>}
          />

          <Panel className="mb-10">
            <PanelHeader title="Pipeline" description="Requests by stage, updated live." />
            <PanelBody>
              <ol className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 lg:grid-cols-8">
                {data.pipeline.map((s) => (
                  <li key={s.label} className="min-w-0 pr-3 lg:border-l lg:border-line lg:pl-3 lg:first:border-0 lg:first:pl-0">
                    <p className="tnum text-2xl font-semibold leading-8">{s.count}</p>
                    <p className="text-[14px] font-medium leading-5">{s.label}</p>
                    <p className="text-[13px] text-fg-3">{s.note}</p>
                  </li>
                ))}
              </ol>
            </PanelBody>
          </Panel>

          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <Panel>
                <PanelHeader
                  title="Priority tasks"
                  description="Critical-path SLA tasks that need closure today."
                  action={<Badge tone="warn">{data.tasks.length} pending</Badge>}
                />
                <PanelBody>
                  <ul className="divide-y divide-line">
                    {data.tasks.map((t) => (
                      <li key={t.customer} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 first:pt-0 last:pb-0">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{t.customer}</p>
                            <Badge>{t.task}</Badge>
                            <Badge tone={t.dueTone}>{t.due}</Badge>
                          </div>
                          <p className="mt-0.5 text-[14px] text-fg-2">{t.detail}</p>
                        </div>
                        <Button size="sm" variant={t.dueTone === 'danger' ? 'primary' : 'secondary'}>
                          {t.action}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader
                  title="Upcoming site surveys"
                  description="Field dispatch and inspection assignments."
                  action={
                    <Link to={ROUTES.ops.surveys} className="inline-flex items-center gap-1 text-[14px] text-accent-fg hover:underline">
                      Full field calendar
                    </Link>
                  }
                />
                <PanelBody>
                  <ul className="divide-y divide-line">
                    {data.surveys.map((s) => (
                      <li key={s.customer} className="grid gap-2 py-3 first:pt-0 last:pb-0 sm:grid-cols-[150px_1fr_auto] sm:items-center sm:gap-4">
                        <div>
                          <p className="tnum text-[14px] font-medium">{s.when}</p>
                          <Badge tone={s.tone} className="mt-1">
                            {s.status}
                          </Badge>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium">{s.customer}</p>
                          <p className="text-[14px] text-fg-2">{s.address}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar name={s.assignee} size="sm" />
                          <div className="leading-tight">
                            <p className="text-[14px]">{s.assignee}</p>
                            <p className="text-[13px] text-fg-3">{s.role}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title="Recent activity" description="Updated 4 minutes ago" />
                <PanelBody>
                  <ActivityList items={data.activity} />
                </PanelBody>
              </Panel>
            </div>

            <div className="space-y-8 lg:border-l lg:border-line lg:pl-10">
              <Panel>
                <PanelHeader title="Needs attention" />
                <PanelBody>
                  <ul className="divide-y divide-line">
                    {data.shortcuts.map((s) => (
                      <li key={s.label}>
                        <Link to={ROUTES.ops.consultations} className="-mx-2 flex items-center justify-between gap-3 rounded-md px-2 py-2.5 hover:bg-surface-2">
                          <span>
                            <span className="block text-[14px] font-medium">{s.label}</span>
                            <span className="block text-[13px] text-fg-3">{s.note}</span>
                          </span>
                          <Badge tone="accent">{s.count}</Badge>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title={`${data.quota.month} quota`} action={<span className="tnum text-lg font-semibold">{data.quota.pct}%</span>} />
                <PanelBody className="space-y-5">
                  <div>
                    <Progress value={data.quota.pct} label="Monthly quota progress" />
                    <div className="tnum mt-1.5 flex justify-between text-[13px] text-fg-2">
                      <span>Current {fmt.usd(data.quota.current)}</span>
                      <span>Target {fmt.usd(data.quota.target)}</span>
                    </div>
                  </div>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-[13px] text-fg-2">Active pipeline</dt>
                      <dd className="tnum text-xl font-semibold">{fmt.usd(data.quota.pipelineValue)}</dd>
                      <dd className="text-[13px] text-fg-3">{data.quota.pipelineDelta}</dd>
                    </div>
                    <div>
                      <dt className="text-[13px] text-fg-2">Close conversion</dt>
                      <dd className="tnum text-xl font-semibold">{data.quota.closeRate}%</dd>
                      <dd className="text-[13px] text-fg-3">{data.quota.closeNote}</dd>
                    </div>
                  </dl>
                  <div>
                    <p className="mb-2 text-[13px] text-fg-2">Stage distribution by value</p>
                    <div className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Pipeline value by stage">
                      {data.quota.stages.map((s, i) => (
                        <span key={s.label} className={cx('h-full', STAGE_FILL[i])} style={{ width: `${s.pct}%` }} />
                      ))}
                    </div>
                    <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[13px]">
                      {data.quota.stages.map((s, i) => (
                        <li key={s.label} className="flex items-center gap-1.5">
                          <span aria-hidden className={cx('size-2 rounded-sm', STAGE_FILL[i])} />
                          <span className="text-fg-2">{s.label}</span>
                          <span className="tnum ml-auto">{fmt.usd(s.value)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader
                  title="Recent inquiries"
                  action={
                    <Link to={ROUTES.ops.consultations} className="text-[14px] text-accent-fg hover:underline">
                      View all ({data.inquiriesTotal})
                    </Link>
                  }
                />
                <PanelBody>
                  <ul className="divide-y divide-line">
                    {data.inquiries.map((i) => (
                      <li key={i.name} className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
                        <Avatar name={i.name} size="sm" />
                        <div className="min-w-0 flex-1 leading-tight">
                          <p className="text-[14px] font-medium">{i.name}</p>
                          <p className="text-[13px] text-fg-3">{i.note}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
                <PanelFooter>
                  <ButtonLink to={ROUTES.ops.consultations} size="sm" variant="ghost">
                    Open intake queue
                  </ButtonLink>
                </PanelFooter>
              </Panel>
            </div>
          </div>
        </>
      )}
    </QueryBoundary>
  )
}
