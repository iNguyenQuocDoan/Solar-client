import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ActionBar } from '@/components/ui/action-bar'
import { Button } from '@/components/ui/button'
import { Field, Textarea } from '@/components/ui/field'
import { Notice, Photo, Progress } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/ui/panel'
import { ROUTES } from '@/constants/routes'
import { installJob } from '@/data/field'
import { cx } from '@/lib/cx'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function FieldInstallationPage() {
  const query = useMockQuery(['field', 'installation', installJob.id], installJob)
  const [doneSteps, setDoneSteps] = useState<boolean[]>(installJob.steps.map((s) => s.done))
  const [panels, setPanels] = useState(14)
  const [notes, setNotes] = useState(installJob.notes)
  const total = 18
  const completed = doneSteps.filter(Boolean).length
  const activeIndex = doneSteps.findIndex((d) => !d)

  function completeActive() {
    setPanels(total)
    setDoneSteps((s) => s.map((d, i) => (i === activeIndex ? true : d)))
  }

  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            back={{ to: ROUTES.field.tasks, label: 'My Tasks' }}
            meta={
              <>
                <span className="text-fg-2">{data.id}</span>
                <span>{data.day}</span>
                <Badge tone="accent">{data.status}</Badge>
                <Badge tone="ok">{data.safetyBrief}</Badge>
              </>
            }
            title={data.title}
            description={`${data.customer}, ${data.address}`}
            actions={<Button>Call client</Button>}
          />

          <Panel className="mb-12">
            <PanelBody>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
                {data.specs.map((s) => (
                  <div key={s.k} className="md:border-l md:border-line md:pl-6 md:first:border-0 md:first:pl-0">
                    <dt className="text-meta text-fg-2">{s.k}</dt>
                    <dd className="tnum text-title font-semibold">{s.v}</dd>
                    <dd className="text-meta text-fg-3">{s.note}</dd>
                  </div>
                ))}
              </dl>
            </PanelBody>
          </Panel>

          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
              <Panel>
                <PanelHeader
                  title="Field verification checklist"
                  action={<Badge>{completed} of {data.steps.length} complete</Badge>}
                />
                <PanelBody>
                  <ol className="divide-y divide-line">
                    {data.steps.map((step, i) => {
                      const isDone = doneSteps[i]
                      const isActive = i === activeIndex
                      return (
                        <li key={step.title} className={cx('flex gap-3 py-4 first:pt-0 last:pb-0', !isDone && !isActive && 'opacity-70')}>
                          <input
                            type="checkbox"
                            aria-label={`Step ${i + 1} complete`}
                            checked={isDone}
                            disabled={!isDone && !isActive}
                            onChange={(e) => setDoneSteps((s) => s.map((d, j) => (j === i ? e.target.checked : d)))}
                            className="mt-1 size-4 shrink-0 accent-accent"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-medium">
                                Step {i + 1}: {step.title}
                              </p>
                              {isDone ? <Badge tone="ok">Done</Badge> : isActive ? <Badge tone="accent">In progress</Badge> : <Badge>Pending</Badge>}
                            </div>
                            <p className="mt-1 text-body text-fg-2">{step.body}</p>
                            {'signed' in step && isDone && (
                              <p className="mt-2 text-meta text-fg-3">
                                Signed by {step.signed}. Logged {step.logged}.
                              </p>
                            )}
                            {'panels' in step && (
                              <div className="mt-3 rounded-container bg-surface-2 px-3 py-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-body font-medium">Panels clamped and wired</p>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Button size="sm" aria-label="Remove one panel" onClick={() => setPanels((p) => Math.max(0, p - 1))} disabled={isDone}>
                                      Remove one
                                    </Button>
                                    <span className="tnum min-w-20 text-center text-body font-semibold">
                                      {panels} of {total}
                                    </span>
                                    <Button size="sm" aria-label="Add one panel" onClick={() => setPanels((p) => Math.min(total, p + 1))} disabled={isDone}>
                                      Add one
                                    </Button>
                                  </div>
                                </div>
                                <Progress value={(panels / total) * 100} label="Panels mounted" className="mt-2" />
                                <p className="mt-2 text-meta text-fg-3">
                                  Lead tech {step.lead}. Updated {step.updated}.
                                </p>
                              </div>
                            )}
                            {'prerequisite' in step && (
                              <p className="mt-2 text-meta text-fg-3">
                                Prerequisite: {step.prerequisite}. Estimated duration {step.duration}.
                              </p>
                            )}
                            {'requirement' in step && <p className="mt-2 text-meta text-fg-3">{step.requirement}.</p>}
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title="Field diagnostics" />
                <PanelBody className="grid gap-4 sm:grid-cols-2">
                  {data.diagnostics.map((d) => (
                    <div key={d.label} className="border-t border-line pt-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-meta text-fg-2">{d.label}</p>
                        <Badge tone={d.tone}>{d.status}</Badge>
                      </div>
                      <p className="tnum mt-1 text-figure font-semibold">
                        {d.value} <span className="text-body font-normal text-fg-2">{d.unit}</span>
                      </p>
                      <p className="text-meta text-fg-3">{d.note}</p>
                    </div>
                  ))}
                </PanelBody>
              </Panel>

              <Panel>
                <PanelBody>
                  <Field label="Field notes for the municipal inspector and utility dispatch" htmlFor="notes" hint={`Auto-saved locally. ${notes.length} characters.`}>
                    <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </Field>
                </PanelBody>
              </Panel>
            </div>

            <div className="space-y-8 lg:col-span-2">
              <Panel>
                <PanelHeader
                  title="Site visual evidence"
                  action={
                    <Button size="sm">
                      Capture
                    </Button>
                  }
                />
                <PanelBody className="space-y-6">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-body font-medium">Before pre-work records ({data.before.length})</p>
                      <Badge tone="ok">Verified by QA</Badge>
                    </div>
                    <ul className="grid grid-cols-2 gap-3">
                      {data.before.map((p) => (
                        <li key={p.caption}>
                          <Photo src={p.src} alt={p.caption} ratio="aspect-[4/3]" caption={p.caption} meta={p.meta} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-body font-medium">Active construction ({data.during.length + 2})</p>
                      <Badge tone="warn">1 pending after photo</Badge>
                    </div>
                    {data.during.map((p) => (
                      <Photo key={p.caption} src={p.src} alt={p.caption} ratio="aspect-[16/9]" caption={p.caption} meta={p.meta} />
                    ))}
                    <button
                      type="button"
                      className="press mt-3 flex w-full flex-col items-center gap-1 rounded-container border border-dashed border-line-2 px-4 py-6 text-body text-fg-2 hover:bg-surface-2"
                    >
                      <span className="font-medium text-fg">Upload inverter and battery final setup</span>
                      <span className="text-center text-meta text-fg-3">AC disconnect, inverter sticker ratings and the finished array for the inspection handoff.</span>
                    </button>
                  </div>
                </PanelBody>
              </Panel>

              <Notice tone={data.weather.tone} title={data.weather.summary}>
                {data.weather.detail}. Safe to work.
              </Notice>
            </div>
          </div>

          <ActionBar>
              <div className="text-body">
                <p className="font-medium">Active session: {data.session.tech}</p>
                <p className="tnum text-meta text-fg-3">
                  {data.session.timer}. {data.session.wrap}.
                </p>
              </div>
              <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
                <Button>Log work pause</Button>
                <Button>Request support</Button>
                <Button variant="ghost">Sync logs</Button>
                <Button variant="primary" className="w-full sm:w-auto" disabled={activeIndex === -1} onClick={completeActive}>
                  {activeIndex === -1 ? 'All steps complete' : `Complete step ${activeIndex + 1}`}
                </Button>
              </div>
          </ActionBar>
        </>
      )}
    </QueryBoundary>
  )
}
