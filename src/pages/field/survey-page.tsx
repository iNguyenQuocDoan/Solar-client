import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox, Field, Input } from '@/components/ui/field'
import { KeyValueList, Notice, Photo } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/ui/panel'
import { ROUTES } from '@/constants/routes'
import { surveyJob } from '@/data/field'
import { cx } from '@/lib/cx'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function FieldSurveyPage() {
  const query = useMockQuery(['field', 'survey', surveyJob.id], surveyJob)
  const [length, setLength] = useState('12.2')
  const [width, setWidth] = useState('7.4')
  const [profile, setProfile] = useState('Gable')
  const [tilt, setTilt] = useState(28)
  const [access, setAccess] = useState('Moderate')
  const [obstacles, setObstacles] = useState<Set<string>>(new Set(surveyJob.obstacles.map((o) => o.label)))
  const [done, setDone] = useState(false)

  const area = Number(length) * Number(width)
  const claimed = 90
  const delta = ((area - claimed) / claimed) * 100

  function toggleObstacle(label: string) {
    setObstacles((s) => {
      const next = new Set(s)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
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
                <Badge tone={done ? 'ok' : 'accent'}>{done ? 'Sent to sales' : data.status}</Badge>
                <span>{data.autosave}</span>
              </>
            }
            title={data.customer}
            description={data.address}
            actions={
              <>
                <Button>Call customer</Button>
                <Button>Open in maps</Button>
              </>
            }
          />

          <Panel className="mb-12">
            <PanelBody>
              <KeyValueList
                columns={2}
                items={[
                  { k: 'Scheduled window', v: data.window },
                  { k: 'Target system', v: data.target },
                ]}
              />
            </PanelBody>
          </Panel>

          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-5">
            <div className="space-y-8 lg:col-span-3">
              <Panel>
                <PanelHeader title="Customer preliminary assessment" action={<Badge>Intake baseline</Badge>} />
                <PanelBody className="space-y-4">
                  <KeyValueList columns={2} items={data.baseline} />
                  <div>
                    <p className="mb-2 text-body font-medium">Homeowner reference photos</p>
                    <ul className="grid grid-cols-2 gap-4">
                      {data.referencePhotos.map((p) => (
                        <li key={p.caption}>
                          <Photo src={p.src} alt={p.caption} ratio="aspect-[3/2]" caption={p.caption} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title="On-site verification and measurements" description="Laser measure synced." />
                <PanelBody className="space-y-6">
                  <fieldset>
                    <legend className="mb-2 text-body font-medium">Surface geometry</legend>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="Measured length" htmlFor="len">
                        <div className="flex items-center gap-2">
                          <Input id="len" inputMode="decimal" value={length} onChange={(e) => setLength(e.target.value)} />
                          <span className="text-body text-fg-2">m</span>
                        </div>
                      </Field>
                      <Field label="Measured width" htmlFor="wid">
                        <div className="flex items-center gap-2">
                          <Input id="wid" inputMode="decimal" value={width} onChange={(e) => setWidth(e.target.value)} />
                          <span className="text-body text-fg-2">m</span>
                        </div>
                      </Field>
                      <div className="rounded-control bg-surface-2 px-3 py-2">
                        <p className="text-meta text-fg-2">Verified area</p>
                        <p className="tnum text-figure font-semibold">
                          {Number.isFinite(area) ? area.toFixed(2) : '0.00'} <span className="text-meta font-normal text-fg-2">m²</span>
                        </p>
                        <p className="tnum text-meta text-fg-3">
                          {delta >= 0 ? '+' : ''}
                          {Number.isFinite(delta) ? delta.toFixed(1) : '0.0'}% vs claimed
                        </p>
                      </div>
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-2 text-body font-medium">Roof architectural profile</legend>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {data.profiles.map((p) => (
                        <label
                          key={p}
                          className={cx(
                            'press flex h-10 cursor-pointer items-center justify-center rounded-control border text-body',
                            profile === p ? 'border-accent bg-accent-soft font-medium text-accent-fg' : 'border-line-2 hover:bg-surface-2',
                          )}
                        >
                          <input type="radio" name="profile" value={p} checked={profile === p} onChange={() => setProfile(p)} className="sr-only" />
                          {p}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <div className="mb-2 flex items-baseline justify-between">
                      <label htmlFor="tilt" className="text-body font-medium">
                        Verified inclinometer tilt
                      </label>
                      <span className="tnum text-body">
                        <span className="text-title font-semibold">{tilt}°</span> <span className="text-fg-3">baseline 25°</span>
                      </span>
                    </div>
                    <input
                      id="tilt"
                      type="range"
                      min={10}
                      max={50}
                      value={tilt}
                      onChange={(e) => setTilt(Number(e.target.value))}
                      className="w-full accent-accent"
                    />
                    <div className="tnum flex justify-between text-meta text-fg-3">
                      <span>10° low slope</span>
                      <span>28° optimal</span>
                      <span>50° steep mansard</span>
                    </div>
                  </div>

                  <fieldset>
                    <legend className="mb-2 text-body font-medium">Technician accessibility grade</legend>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {data.access.map((a) => (
                        <label
                          key={a.label}
                          className={cx(
                            'press cursor-pointer rounded-control border px-3 py-2 text-left',
                            access === a.label ? 'border-accent bg-accent-soft' : 'border-line-2 hover:bg-surface-2',
                          )}
                        >
                          <input type="radio" name="access" value={a.label} checked={access === a.label} onChange={() => setAccess(a.label)} className="sr-only" />
                          <span className={cx('block text-body font-medium', access === a.label && 'text-accent-fg')}>{a.label}</span>
                          <span className="block text-meta text-fg-3">{a.note}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-2 text-body font-medium">Identified shading and obstacles</legend>
                    <ul className="divide-y divide-line border-t border-b border-line">
                      {data.obstacles.map((o) => (
                        <li key={o.label} className="flex items-center justify-between gap-3 px-3 py-3">
                          <Checkbox checked={obstacles.has(o.label)} onChange={() => toggleObstacle(o.label)} label={o.label} />
                          <Badge>{o.note}</Badge>
                        </li>
                      ))}
                    </ul>
                  </fieldset>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-body font-medium">Service panel compatibility</p>
                      <Badge tone="ok">{data.panelNote}</Badge>
                    </div>
                    <KeyValueList columns={2} items={data.panel} />
                  </div>

                  <Notice tone="ok" title="Field survey recommendation">
                    {data.recommendation}
                  </Notice>
                </PanelBody>
              </Panel>
            </div>

            <div className="space-y-8 lg:col-span-2">
              <Panel>
                <PanelHeader
                  title="Survey photos"
                  description={`${data.photos.length} of ${data.photos.length} critical zones captured`}
                  action={
                    <Button size="sm">
                      Capture
                    </Button>
                  }
                />
                <PanelBody className="space-y-4">
                  <button
                    type="button"
                    className="press flex w-full flex-col items-center gap-1 rounded-control border border-dashed border-line-2 px-4 py-6 text-body text-fg-2 hover:bg-surface-2"
                  >
                    <span>Capture or drop a new photo</span>
                    <span className="text-meta text-fg-3">High-res JPEG or RAW with embedded GPS coordinates</span>
                  </button>
                  <ol className="grid gap-4 sm:grid-cols-2">
                    {data.photos.map((p, i) => (
                      <li key={p.title}>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="text-body font-medium">
                            {i + 1}. {p.title}
                          </p>
                          <Badge tone="ok">{p.status}</Badge>
                        </div>
                        <Photo src={p.src} alt={p.title} ratio="aspect-[4/3]" meta={p.note} />
                      </li>
                    ))}
                  </ol>
                </PanelBody>
              </Panel>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 mt-6 -mx-4 border-t border-line bg-canvas/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
            <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-2">
              <Button>Save draft</Button>
              <Button variant="danger">
                Report blocker
              </Button>
              <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
                <span className="tnum text-body text-fg-2">
                  {done ? 'Survey sent to sales' : `Mandatory fields validated ${data.mandatory.done}/${data.mandatory.total}`}
                </span>
                <Button variant="primary" className="w-full sm:w-auto" disabled={done} onClick={() => setDone(true)}>
                  Complete survey and send to sales
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </QueryBoundary>
  )
}
