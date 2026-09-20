import { Link } from 'react-router'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ActivityList, KeyValueList, Photo, Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stepper } from '@/components/ui/stepper'
import { ROUTES } from '@/constants/routes'
import { project } from '@/data/customer'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function ProjectPage() {
  const query = useMockQuery(['customer', 'project', project.id], project)
  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            meta={
              <>
                <span className="text-fg-2">{data.id}</span>
                <span>{data.type}</span>
                <Badge tone="accent">Crew on site</Badge>
              </>
            }
            title={data.title}
            description={data.address}
            actions={
              <Button variant="primary">
                Call crew lead
              </Button>
            }
          />

          <Panel className="mb-10">
            <PanelHeader title="Installation lifecycle" description={`Stage ${data.stage} of ${data.stageCount}`} />
            <PanelBody>
              <Stepper steps={data.steps} />
            </PanelBody>
          </Panel>

          <Panel className="mb-10">
            <PanelBody className="grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{data.current.title}</h2>
                <p className="mt-1 max-w-[60ch] text-[14px] text-fg-2">{data.current.summary}</p>
              </div>
              <div className="space-y-3">
                <KeyValueList
                  items={[
                    { k: 'Installation window', v: data.current.window },
                    { k: 'Build health', v: <Badge tone="ok">{data.current.health}</Badge> },
                  ]}
                />
                <div>
                  <div className="mb-1.5 flex justify-between text-[13px] text-fg-2">
                    <span>Overall progress</span>
                    <span className="tnum">{data.current.pct}%</span>
                  </div>
                  <Progress value={data.current.pct} label="Overall build progress" />
                </div>
              </div>
            </PanelBody>
          </Panel>

          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <Panel>
                <PanelHeader title="Daily build schedule" description="Pacific time" />
                <PanelBody>
                  <ol className="divide-y divide-line">
                    {data.schedule.map((s) => (
                      <li key={s.title} className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[96px_1fr]">
                        <div>
                          <p className="text-[14px] font-medium">{s.day}</p>
                          <p className="text-[13px] text-fg-3">{s.when}</p>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{s.title}</p>
                            <Badge tone={s.tone}>{s.status}</Badge>
                          </div>
                          <p className="mt-1 text-[14px] text-fg-2">{s.body}</p>
                          {'notes' in s && (
                            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-fg-3">
                              {s.notes.map((n) => (
                                <li key={n}>{n}</li>
                              ))}
                            </ul>
                          )}
                          {'progress' in s && (
                            <div className="mt-3">
                              <div className="mb-1.5 flex justify-between text-[13px] text-fg-2">
                                <span>
                                  {s.progress.done} of {s.progress.total} panels mounted and tested
                                </span>
                                <span className="tnum">{Math.round((s.progress.done / s.progress.total) * 100)}%</span>
                              </div>
                              <Progress value={(s.progress.done / s.progress.total) * 100} label={s.title} />
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title="Installation photos" description="Inspection imagery from the original survey through hardware mounting." />
                <PanelBody>
                  <ul className="grid gap-5 sm:grid-cols-3">
                    {data.photos.map((p) => (
                      <li key={p.caption}>
                        <Photo src={p.src} alt={p.caption} caption={p.caption} meta={p.meta} />
                        <p className="mt-1.5 text-[14px] text-fg-2">{p.body}</p>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
              </Panel>
            </div>

            <div className="space-y-8 lg:border-l lg:border-line lg:pl-10">
              <Panel>
                <PanelHeader title="Field crew" description={data.crew.squad} />
                <PanelBody className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={data.crew.lead.name} />
                    <div className="min-w-0">
                      <p className="font-medium">{data.crew.lead.name}</p>
                      <p className="text-[14px] text-fg-2">
                        {data.crew.lead.role}, {data.crew.lead.exp}
                      </p>
                      <a href={`tel:${data.crew.lead.phone}`} className="tnum text-[14px] text-accent-fg hover:underline">
                        {data.crew.lead.phone}
                      </a>
                    </div>
                  </div>
                  <KeyValueList
                    className="border-t border-line pt-4"
                    items={[
                      { k: 'Team size', v: data.crew.size },
                      { k: 'Vehicle', v: data.crew.vehicle },
                      { k: 'Licensure', v: data.crew.license },
                    ]}
                  />
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title="Field status feed" />
                <PanelBody>
                  <ActivityList items={data.feed} />
                </PanelBody>
                <PanelFooter>
                  <Link to="#" className="text-[14px] text-accent-fg hover:underline">
                    View complete dispatch log ({data.feedTotal} entries)
                  </Link>
                </PanelFooter>
              </Panel>

              <Panel>
                <PanelHeader title="Project documents" description={`${data.documents.length} authorized files, archived for 25 years`} />
                <PanelBody>
                  <ul className="divide-y divide-line">
                    {data.documents.map((d) => (
                      <li key={d.name} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <p className="text-[14px] font-medium">{d.name}</p>
                          <p className="text-[13px] text-fg-3">{d.meta}</p>
                        </div>
                        <Button size="sm" variant="ghost" aria-label={`Download ${d.name}`}>
                          Download
                        </Button>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
              </Panel>
            </div>
          </div>

          <p className="mt-6 border-t border-line pt-4 text-[14px] text-fg-2">
            Questions about noise, access or power shutoff?{' '}
            <Link to={ROUTES.customer.assistant} className="text-accent-fg hover:underline">
              Message the concierge
            </Link>{' '}
            or read the{' '}
            <Link to="#" className="text-accent-fg hover:underline">
              installation FAQ
            </Link>
            .
          </p>
        </>
      )}
    </QueryBoundary>
  )
}
