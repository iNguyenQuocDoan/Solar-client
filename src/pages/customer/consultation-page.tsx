import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, Textarea } from '@/components/ui/field'
import { ActivityList, KeyValueList, Notice, Photo } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stepper } from '@/components/ui/stepper'
import { ROUTES } from '@/constants/routes'
import { advisor, consultation } from '@/data/customer'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function ConsultationPage() {
  const query = useMockQuery(['customer', 'consultation', consultation.id], consultation)
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState<string[]>([])

  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            back={{ to: ROUTES.customer.home, label: 'Overview' }}
            meta={
              <>
                <Badge>{data.type}</Badge>
                <span>Submitted {data.submitted}</span>
              </>
            }
            title={`Request ${data.id}`}
            actions={<Button>Download summary</Button>}
          />

          <Panel className="mb-12">
            <PanelHeader title={data.status} description={`Estimated step completion: ${data.estimatedCompletion}`} />
            <PanelBody>
              <Stepper steps={data.steps} />
            </PanelBody>
          </Panel>

          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <Panel>
                <PanelHeader title="Assigned solar expert" action={<Badge tone="ok">Assigned and active</Badge>} />
                <PanelBody className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={advisor.name} size="lg" />
                    <div className="min-w-0">
                      <p className="font-medium">{advisor.name}</p>
                      <p className="text-meta text-fg-3">
                        {advisor.title}, {advisor.team}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-body">
                        <a href={`tel:${advisor.phone}`} className="text-fg-2 hover:text-fg">
                          {advisor.phone}
                        </a>
                        <a href={`mailto:${advisor.email}`} className="text-fg-2 hover:text-fg">
                          {advisor.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  <Notice tone="ok" title="Inspection confirmed">
                    {advisor.name.split(' ')[0]} has scheduled your in-person roof inspection for {data.inspection.when}.{' '}
                    {data.inspection.scope}
                  </Notice>
                </PanelBody>
                <PanelFooter>
                  <Button>Reschedule visit</Button>
                </PanelFooter>
              </Panel>

              <Panel>
                <PanelHeader
                  title="Submitted property data"
                  action={
                    <Button size="sm" variant="ghost">
                      Edit property specs
                    </Button>
                  }
                />
                <PanelBody>
                  <KeyValueList columns={2} items={data.propertyData} />
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader
                  title="Submitted photos"
                  description="Images from your self-assessment help prepare the satellite and physical site blueprint."
                  action={
                    <Button size="sm" variant="ghost">
                      Upload more
                    </Button>
                  }
                />
                <PanelBody>
                  <ul className="grid gap-4 sm:grid-cols-3">
                    {data.photos.map((p) => (
                      <li key={p.name}>
                        <Photo src={p.src} alt={p.name} caption={p.name} meta={p.meta} />
                      </li>
                    ))}
                  </ul>
                </PanelBody>
              </Panel>
            </div>

            <div className="space-y-8 lg:border-l lg:border-line lg:pl-8">
              <Panel>
                <PanelHeader title="What happens on Oct 24?" />
                <PanelBody className="space-y-4 text-body">
                  <p className="text-fg-2">
                    The survey takes {data.inspection.duration}. {data.inspection.access}
                  </p>
                  <ul className="space-y-2">
                    {data.inspection.checklist.map((c) => (
                      <li key={c} className="flex gap-2">
                        <span aria-hidden className="mt-2 size-1 shrink-0 rounded-control bg-fg-3" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
                <PanelFooter>
                  <Button size="sm">
                    Add to calendar
                  </Button>
                </PanelFooter>
              </Panel>

              <Panel>
                <PanelHeader title="Activity" description={`${data.activity.length} updates`} />
                <PanelBody>
                  <ActivityList items={data.activity} />
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title="Notes for the inspector" />
                <PanelBody className="space-y-4">
                  <blockquote className="border-l-2 border-line-2 pl-3 text-body text-fg-2">
                    <p>{data.homeownerNote}</p>
                    <footer className="mt-1 text-meta text-fg-3">{data.homeownerNoteMeta}</footer>
                  </blockquote>
                  {notes.map((n, i) => (
                    <blockquote key={i} className="border-l-2 border-accent pl-3 text-body text-fg-2">
                      <p>{n}</p>
                      <footer className="mt-1 text-meta text-fg-3">Eleanor V., just now</footer>
                    </blockquote>
                  ))}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (!note.trim()) return
                      setNotes((list) => [...list, note.trim()])
                      setNote('')
                    }}
                    className="space-y-2"
                  >
                    <Field label={`Add a note for ${advisor.name.split(' ')[0]}`} htmlFor="note">
                      <Textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Gate code, parking, pets"
                        rows={3}
                      />
                    </Field>
                    <Button type="submit" size="sm" variant="primary" disabled={!note.trim()}>
                      Send note
                    </Button>
                  </form>
                </PanelBody>
              </Panel>
            </div>
          </div>

          <p className="mt-6 border-t border-line pt-4 text-body text-fg-2">
            Need help with this booking? {data.support}{' '}
            <a href="tel:18005557652" className="text-accent-fg hover:underline">
              Call desk support
            </a>
          </p>
        </>
      )}
    </QueryBoundary>
  )
}
