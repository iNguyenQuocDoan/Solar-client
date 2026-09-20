import { Link } from 'react-router'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { ActivityList, KeyValueList, Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stat, StatRow } from '@/components/ui/stat'
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

          <Panel className="mb-12">
            <PanelHeader title="Solar journey" description="From assessment to a working rooftop system." />
            <PanelBody>
              <Stepper steps={data.journey} />
            </PanelBody>
          </Panel>

          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <Panel>
                <PanelHeader
                  title={data.consultation.title}
                  description={`Consultation ${data.consultation.id}`}
                  action={<Badge tone="accent">{data.consultation.status}</Badge>}
                />
                <PanelBody className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-meta text-fg-3">When</p>
                      <p className="mt-1 font-medium">{data.consultation.date}</p>
                      <p className="text-meta text-fg-3">{data.consultation.duration}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Avatar name={advisor.name} />
                      <div className="min-w-0">
                        <p className="font-medium">{advisor.name}</p>
                        <p className="text-meta text-fg-3">Certified energy advisor</p>
                        <a href={`mailto:${advisor.email}`} className="text-body text-accent-fg hover:underline">
                          {advisor.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-body font-medium">Before the visit</p>
                    <ul className="mt-2 list-disc space-y-1 pl-6 text-body text-fg-2">
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
                  <StatRow className="md:grid-cols-3">
                    <Stat label="System size" value={data.proposal.sizeKw} unit="kW DC" note={`${data.proposal.panels} panels`} />
                    <Stat label="Estimated annual offset" value={`${data.proposal.offsetPct}%`} note={`Covers ${fmt.num(data.proposal.coversKwh)} kWh per year`} />
                    <Stat label="Estimated savings" value={fmt.usd(data.proposal.savingsPerYear)} unit="/ yr" note="Includes the 30% federal tax credit" />
                  </StatRow>
                  <KeyValueList
                    className="mt-6 border-t border-line pt-4"
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
                    <Link to="#" className="text-body text-accent-fg hover:underline">
                      View calendar
                    </Link>
                  }
                />
                <PanelBody>
                  <ul className="divide-y divide-line">
                    {data.events.map((e) => (
                      <li key={e.title} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="w-11 shrink-0 text-center">
                          <p className="text-meta text-fg-3">{e.day}</p>
                          <p className="tnum text-figure font-semibold">{e.date}</p>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{e.title}</p>
                            <Badge>{e.kind}</Badge>
                          </div>
                          <p className="tnum text-body text-fg-2">{e.time}</p>
                          <p className="text-body text-fg-3">{e.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
              </Panel>
            </div>

            <div className="space-y-8 lg:border-l lg:border-line lg:pl-8">
              <Panel>
                <PanelHeader title="Site readiness" action={<span className="tnum text-title font-semibold">{data.readiness.pct}%</span>} />
                <PanelBody>
                  <Progress value={data.readiness.pct} label="Site readiness" />
                  <ul className="mt-4 space-y-3">
                    {data.readiness.items.map((item) => (
                      <li key={item.label} className="flex items-start justify-between gap-3 text-body">
                        <span>{item.label}</span>
                        <Badge tone={item.tone}>{item.status}</Badge>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 border-t border-line pt-3 text-meta text-fg-3">Assigned crew: {data.readiness.crew}</p>
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
                  <p className="text-body text-fg-2">{data.warranty.summary}</p>
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
                <PanelFooter>
                  <p className="text-body text-fg-2">
                    Questions about permits?{' '}
                    <Link to={ROUTES.customer.assistant} className="text-accent-fg hover:underline">
                      Ask the assistant
                    </Link>
                  </p>
                </PanelFooter>
              </Panel>
            </div>
          </div>
        </>
      )}
    </QueryBoundary>
  )
}
