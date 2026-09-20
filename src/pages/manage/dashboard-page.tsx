import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { ActivityList, Photo, Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stat, StatRow } from '@/components/ui/stat'
import { Table, Td, Th, Tr } from '@/components/ui/table'
import { ROUTES, withId } from '@/constants/routes'
import { execDashboard } from '@/data/manage'
import { cx } from '@/lib/cx'
import { fmt } from '@/lib/format'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function ManageDashboardPage() {
  const query = useMockQuery(['manage', 'dashboard'], execDashboard)
  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            meta={<Badge tone="ok">Q4 run rate {data.runRate}</Badge>}
            title="Executive dashboard"
            description={`Oversight of ${data.portfolio} portfolio installations, quotation approval gates and post-commissioning SLA commitments.`}
            actions={<Button>Batch actions</Button>}
          />

          <StatRow className="mb-10 md:grid-cols-3 lg:grid-cols-6">
            {data.kpis.map((k) => (
              <Stat key={k.label} label={k.label} value={k.value} note={k.note} tone={k.tone} />
            ))}
          </StatRow>

          <Panel className="mb-10">
            <PanelHeader
              title="Lifecycle velocity and pipeline balance"
              description={`${data.pipeline.live} projects live. Median pipeline cycle time ${data.pipeline.medianCycle}.`}
              action={<Badge tone="warn">Bottleneck: {data.pipeline.bottleneck}</Badge>}
            />
            <PanelBody>
              <ol className="grid grid-cols-2 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
                {data.pipeline.phases.map((p) => (
                  <li key={p.label} className="min-w-0 pr-3 lg:border-l lg:border-line lg:pl-3 lg:first:border-0 lg:first:pl-0">
                    <p className={cx('tnum text-2xl font-semibold leading-8', p.friction && 'text-warn')}>{p.count}</p>
                    <p className="text-[14px] font-medium leading-5">{p.label}</p>
                    <p className={cx('text-[13px]', p.friction ? 'text-warn' : 'text-fg-3')}>{p.note}</p>
                  </li>
                ))}
              </ol>
            </PanelBody>
          </Panel>

          <section className="mb-10" aria-labelledby="decisions">
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h2 id="decisions" className="text-[15px] font-semibold">
                Decisions required
              </h2>
              <p className="text-[14px] text-fg-2">{data.exceptions.length} blockers need executive sign-off. Auto-refreshed 2 minutes ago.</p>
            </div>
            <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              {data.exceptions.map((ex) => (
                <Panel key={ex.ref} className="flex flex-col border-t! pt-6!">
                  <PanelBody className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge tone={ex.tone}>{ex.kind}</Badge>
                      <span className="tnum text-[14px] font-medium">{ex.value}</span>
                    </div>
                    <p className="mt-2 font-medium">
                      {ex.title} <span className="text-[14px] font-normal text-fg-3">{ex.ref}</span>
                    </p>
                    <p className="mt-1 text-[14px] text-fg-2">{ex.body}</p>
                    <p className="mt-2 text-[13px] text-fg-3">{ex.meta}</p>
                  </PanelBody>
                  <PanelFooter>
                    {ex.actions.map((a, i) =>
                      i === ex.actions.length - 1 ? (
                        <ButtonLink
                          key={a}
                          to={ex.link === 'approval' ? withId(ROUTES.manage.approval, ex.ref) : ROUTES.manage.alerts}
                          size="sm"
                          variant="primary"
                        >
                          {a}
                        </ButtonLink>
                      ) : (
                        <Button key={a} size="sm">
                          {a}
                        </Button>
                      ),
                    )}
                  </PanelFooter>
                </Panel>
              ))}
            </div>
          </section>

          <div className="mb-10 grid gap-x-12 gap-y-10 lg:grid-cols-3 lg:items-start">
            <Panel className="lg:col-span-2">
              <PanelHeader title={`Week ${data.sprint.week} installation sprint`} description={data.sprint.summary} />
              <Table className="text-[14px]">
                <thead>
                  <tr>
                    <Th>Project</Th>
                    <Th>System</Th>
                    <Th>Crew</Th>
                    <Th>Milestone</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.sprint.rows.map((r) => (
                    <Tr key={r.id}>
                      <Td>
                        <p className="font-medium">{r.project}</p>
                        <p className="text-[13px] text-fg-3">
                          {r.location}, <span className="text-fg-2">{r.id}</span>
                        </p>
                      </Td>
                      <Td>
                        <p>{r.size}</p>
                        <p className="text-[13px] text-fg-3">{r.hardware}</p>
                      </Td>
                      <Td>
                        <p>{r.crew}</p>
                        {r.lead && <p className="text-[13px] text-fg-3">Lead {r.lead}</p>}
                      </Td>
                      <Td>
                        <Badge tone={r.tone}>{r.status}</Badge>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
              <PanelFooter className="gap-x-6 text-[14px]">
                {data.sprint.stats.map((s) => (
                  <span key={s.k}>
                    <span className="text-fg-2">{s.k}</span> <span className="tnum font-medium">{s.v}</span>
                  </span>
                ))}
              </PanelFooter>
            </Panel>

            <Panel>
              <PanelHeader title="Field verification" description="Array flashing and conduit runs uploaded within the hour." />
              <PanelBody className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {data.photos.map((p) => (
                  <Photo key={p.caption} src={p.src} alt={p.caption} ratio="aspect-[16/9]" caption={p.caption} meta={p.meta} />
                ))}
              </PanelBody>
              <PanelFooter>
                <Link to="#" className="inline-flex items-center gap-1 text-[14px] text-accent-fg hover:underline">
                  Open safety and QA gallery ({data.photoTotal} photos)
                </Link>
              </PanelFooter>
            </Panel>
          </div>

          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-3 lg:items-start">
            <Panel className="lg:col-span-2">
              <PanelHeader title="Audit and milestone feed" description="Compliance checkpoints and contractual signatures." />
              <PanelBody>
                <ActivityList items={data.audit} />
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader title="Q4 revenue pace" action={<span className="tnum text-lg font-semibold">{data.revenue.pct}%</span>} />
              <PanelBody className="space-y-5">
                <div>
                  <Progress value={data.revenue.pct} label="Q4 revenue achieved" />
                  <dl className="tnum mt-2 flex justify-between text-[13px] text-fg-2">
                    <div>
                      <dt className="inline">Recognized </dt>
                      <dd className="inline font-medium text-fg">{data.revenue.recognized}</dd>
                    </div>
                    <div>
                      <dt className="inline">Remaining </dt>
                      <dd className="inline font-medium text-fg">{data.revenue.remaining}</dd>
                    </div>
                  </dl>
                </div>
                <ul className="divide-y divide-line border-t border-line">
                  {data.revenue.mix.map((m) => (
                    <li key={m.label}>
                      <div className="mb-1 flex justify-between gap-3 text-[14px]">
                        <span>{m.label}</span>
                        <span className="tnum text-fg-2">
                          {fmt.usd(m.value)} ({m.pct}%)
                        </span>
                      </div>
                      <Progress value={m.pct} label={`${m.label} share`} />
                    </li>
                  ))}
                </ul>
              </PanelBody>
              <PanelFooter>
                <ButtonLink to={ROUTES.manage.revenue} size="sm" variant="ghost">
                  Full revenue analytics
                </ButtonLink>
              </PanelFooter>
            </Panel>
          </div>
        </>
      )}
    </QueryBoundary>
  )
}
