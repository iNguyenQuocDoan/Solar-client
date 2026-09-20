import { Link } from 'react-router'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { ActivityList, KeyValueList, Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stepper } from '@/components/ui/stepper'
import { ROUTES, withId } from '@/constants/routes'
import { advisor, overview, property } from '@/data/customer'
import { fmt } from '@/lib/format'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function OverviewPage() {
  const query = useMockQuery(['customer', 'overview'], overview)
  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            meta={
              <>
                <span>Project {property.projectId}</span>
                <span aria-hidden>/</span>
                <span>{property.address}</span>
              </>
            }
            title={`${data.milestone.title} in ${data.milestone.daysAway} days`}
            description={`${data.milestone.when}, confirmed with ${data.milestone.with}. Phase 3 of 5 in your solar journey.`}
            actions={
              <ButtonLink to={withId(ROUTES.customer.consultation, 'CR-9042')}>
                View timeline
              </ButtonLink>
            }
          />

          <Panel className="mb-10">
            <PanelHeader title="Solar journey" description="From assessment to a working rooftop system." />
            <PanelBody>
              <Stepper steps={data.journey} />
            </PanelBody>
          </Panel>

          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <Panel>
                <PanelHeader
                  title={data.consultation.title}
                  description={`Consultation ${data.consultation.id}`}
                  action={<Badge tone="accent">{data.consultation.status}</Badge>}
                />
                <PanelBody className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-[14px] text-fg-2">When</p>
                      <p className="mt-0.5 font-medium">{data.consultation.date}</p>
                      <p className="text-[14px] text-fg-2">{data.consultation.duration}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Avatar name={advisor.name} />
                      <div className="min-w-0">
                        <p className="font-medium">{advisor.name}</p>
                        <p className="text-[14px] text-fg-2">Certified energy advisor</p>
                        <a href={`mailto:${advisor.email}`} className="text-[14px] text-accent-fg hover:underline">
                          {advisor.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium">Before the visit</p>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[14px] text-fg-2">
                      {data.consultation.prep.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </PanelBody>
                <PanelFooter>
                  <Button variant="primary">
                    Call {advisor.name.split(' ')[0]}
                  </Button>
                  <Button>Reschedule</Button>
                </PanelFooter>
              </Panel>

              <Panel>
                <PanelHeader
                  title="System proposal"
                  description={`Quote ${data.proposal.id}`}
                  action={<Badge tone="warn">{data.proposal.status}</Badge>}
                />
                <PanelBody>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <p className="text-[14px] text-fg-2">System size</p>
                      <p className="tnum mt-0.5 text-2xl font-semibold tracking-tight">
                        {data.proposal.sizeKw} <span className="text-[15px] font-normal text-fg-2">kW DC</span>
                      </p>
                      <p className="text-[13px] text-fg-3">{data.proposal.panels} panels</p>
                    </div>
                    <div>
                      <p className="text-[14px] text-fg-2">Estimated annual offset</p>
                      <p className="tnum mt-0.5 text-2xl font-semibold tracking-tight">{data.proposal.offsetPct}%</p>
                      <p className="text-[13px] text-fg-3">Covers {fmt.num(data.proposal.coversKwh)} kWh per year</p>
                    </div>
                    <div>
                      <p className="text-[14px] text-fg-2">Estimated savings</p>
                      <p className="tnum mt-0.5 text-2xl font-semibold tracking-tight">
                        {fmt.usd(data.proposal.savingsPerYear)} <span className="text-[15px] font-normal text-fg-2">/ yr</span>
                      </p>
                      <p className="text-[13px] text-fg-3">Includes the 30% federal tax credit</p>
                    </div>
                  </div>
                  <KeyValueList
                    className="mt-5 border-t border-line pt-4"
                    items={[
                      { k: 'Inverter', v: data.proposal.inverter },
                      { k: 'Battery storage', v: data.proposal.battery },
                    ]}
                  />
                </PanelBody>
                <PanelFooter>
                  <ButtonLink to={withId(ROUTES.customer.quotation, 'QT-8821')}>Review draft breakdown</ButtonLink>
                </PanelFooter>
              </Panel>

              <Panel>
                <PanelHeader
                  title="Scheduled events"
                  action={
                    <Link to="#" className="text-[14px] text-accent-fg hover:underline">
                      View calendar
                    </Link>
                  }
                />
                <PanelBody>
                  <ul className="divide-y divide-line">
                    {data.events.map((e) => (
                      <li key={e.title} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="w-11 shrink-0 text-center">
                          <p className="text-[11px] text-fg-3">{e.day}</p>
                          <p className="tnum text-xl font-semibold leading-6">{e.date}</p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{e.title}</p>
                            <Badge>{e.kind}</Badge>
                          </div>
                          <p className="tnum text-[14px] text-fg-2">{e.time}</p>
                          <p className="text-[14px] text-fg-3">{e.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
              </Panel>
            </div>

            <div className="space-y-8 lg:border-l lg:border-line lg:pl-10">
              <Panel>
                <PanelHeader title="Site readiness" action={<span className="tnum text-lg font-semibold">{data.readiness.pct}%</span>} />
                <PanelBody>
                  <Progress value={data.readiness.pct} label="Site readiness" />
                  <ul className="mt-4 space-y-2.5">
                    {data.readiness.items.map((item) => (
                      <li key={item.label} className="flex items-start justify-between gap-3 text-[14px]">
                        <span>{item.label}</span>
                        <Badge tone={item.tone}>{item.status}</Badge>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 border-t border-line pt-3 text-[13px] text-fg-3">Assigned crew: {data.readiness.crew}</p>
                </PanelBody>
                <PanelFooter>
                  <ButtonLink to={withId(ROUTES.customer.project, 'SS-8842-CA')} size="sm">
                    Project milestones
                  </ButtonLink>
                </PanelFooter>
              </Panel>

              <Panel>
                <PanelHeader title="Warranty" description={data.warranty.plan} />
                <PanelBody>
                  <p className="text-[14px] text-fg-2">{data.warranty.summary}</p>
                </PanelBody>
                <PanelFooter>
                  <ButtonLink to={ROUTES.customer.warranty} size="sm">
                    Warranty details
                  </ButtonLink>
                </PanelFooter>
              </Panel>

              <Panel>
                <PanelHeader title="Project activity" action={<Badge tone="accent">2 new</Badge>} />
                <PanelBody>
                  <ActivityList items={data.activity} />
                </PanelBody>
                <PanelFooter className="text-[14px] text-fg-2">
                  Questions about permits?{' '}
                  <Link to={ROUTES.customer.assistant} className="text-accent-fg hover:underline">
                    Ask the assistant
                  </Link>
                </PanelFooter>
              </Panel>
            </div>
          </div>
        </>
      )}
    </QueryBoundary>
  )
}
