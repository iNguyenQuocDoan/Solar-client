import { useRef, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Field, Textarea } from '@/components/ui/field'
import { KeyValueList, Notice, Photo } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stepper } from '@/components/ui/stepper'
import { ROUTES } from '@/constants/routes'
import { warrantyRequest } from '@/data/customer'
import { QueryBoundary, useMockQuery } from '@/services/mock'

type Modal = { title: string; description: string; placeholder: string }

const MODALS: Record<'message' | 'reschedule', Modal> = {
  message: {
    title: 'Add a message for Alex',
    description: 'Alex receives this note on his field device when he navigates to Oakwood Residence.',
    placeholder: 'Side gate is unlatched. Friendly golden retriever inside.',
  },
  reschedule: {
    title: 'Request a new service window',
    description: 'Share preferred backup dates and whether morning or afternoon works better.',
    placeholder: 'Prefer Wednesday Nov 13 or Thursday Nov 14 in the morning window.',
  },
}

export function WarrantyRequestPage() {
  const query = useMockQuery(['customer', 'warranty-request', warrantyRequest.id], warrantyRequest)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [modal, setModal] = useState<keyof typeof MODALS>('message')
  const [text, setText] = useState('')
  const [sent, setSent] = useState<string | null>(null)

  function open(kind: keyof typeof MODALS) {
    setModal(kind)
    setText('')
    dialogRef.current?.showModal()
  }

  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            back={{ to: ROUTES.customer.warranty, label: 'Warranty & Maintenance' }}
            meta={
              <>
                <span className="text-fg-2">{data.id}</span>
                <Badge tone="warn">{data.status}</Badge>
                <span>{data.tier}</span>
              </>
            }
            title={data.title}
            description={data.site}
            actions={
              <>
                <Button>Export summary</Button>
                <Button variant="primary" onClick={() => open('message')}>
                  Message technician
                </Button>
              </>
            }
          />

          {sent && (
            <Notice tone="ok" className="mb-8">
              {sent}
            </Notice>
          )}

          <Panel className="mb-12">
            <PanelBody className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
              <div>
                <p className="mb-3 text-body font-medium">Ticket lifecycle, stage 4 of 5</p>
                <Stepper steps={data.steps} />
              </div>
              <div className="lg:border-l lg:border-line lg:pl-6">
                <p className="text-body text-fg-2">Service window</p>
                <p className="mt-1 text-title font-semibold">{data.window.date}</p>
                <p className="tnum text-body text-fg-2">{data.window.time}</p>
                <Badge tone="ok" className="mt-2">
                  {data.window.access}
                </Badge>
              </div>
            </PanelBody>
          </Panel>

          <div className="grid gap-x-12 gap-y-12 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <Panel>
                <PanelHeader title="Reported issue" action={<Badge>Logged by homeowner</Badge>} />
                <PanelBody className="space-y-4">
                  <blockquote className="border-l-2 border-line-2 pl-3 text-body text-fg-2">{data.description}</blockquote>
                  <div>
                    <p className="mb-2 text-body font-medium">Attached images ({data.photos.length})</p>
                    <ul className="grid gap-4 sm:grid-cols-2">
                      {data.photos.map((p) => (
                        <li key={p.caption}>
                          <Photo src={p.src} alt={p.caption} caption={p.caption} meta={p.meta} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title="Technician assessment and plan" description={`Dispatch brief prepared by ${data.technician.name}`} />
                <PanelBody className="space-y-4">
                  <blockquote className="border-l-2 border-accent pl-3 text-body text-fg-2">{data.plan.brief}</blockquote>
                  <KeyValueList items={data.plan.impact} />
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title="Service verification" description={`Submission baseline versus post-service sign-off. Protocol ${data.verification.protocol}.`} />
                <PanelBody className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-body font-medium">Incident reference</p>
                    <p className="text-meta text-fg-3">Submitted {data.verification.before.date}</p>
                    <Photo src={data.verification.before.src} alt="Client baseline photo" className="mt-2" />
                    <p className="mt-2 text-body text-fg-2">{data.verification.before.body}</p>
                  </div>
                  <div>
                    <p className="text-body font-medium">Post-service inspection</p>
                    <p className="text-meta text-fg-3">Pending visit</p>
                    <div className="mt-2 flex aspect-[4/3] items-center justify-center rounded-container border border-dashed border-line-2 px-4 text-center text-body text-fg-2">
                      Awaiting field completion
                    </div>
                    <p className="mt-2 text-body text-fg-2">{data.verification.after}</p>
                  </div>
                </PanelBody>
              </Panel>
            </div>

            <div className="space-y-8 lg:border-l lg:border-line lg:pl-8">
              <Panel>
                <PanelHeader title="Certified specialist" action={<Badge tone="ok">Confirmed</Badge>} />
                <PanelBody className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={data.technician.name} size="lg" />
                    <div className="min-w-0">
                      <p className="font-medium">{data.technician.name}</p>
                      <p className="text-body text-fg-2">{data.technician.cert}</p>
                      <p className="text-meta text-fg-3">{data.technician.exp}</p>
                    </div>
                  </div>
                  <KeyValueList
                    className="border-t border-line pt-4"
                    items={[
                      { k: 'Direct cell', v: <span className="tnum">{data.technician.phone}</span> },
                      { k: 'Background check', v: data.technician.background },
                      { k: 'Service van', v: data.technician.van },
                    ]}
                  />
                </PanelBody>
                <PanelFooter>
                  <Button className="w-full">
                    Call {data.technician.name.split(' ')[0]} directly
                  </Button>
                </PanelFooter>
              </Panel>

              <Panel>
                <PanelHeader title="Adjust this visit" />
                <PanelBody className="space-y-2">
                  <Button className="w-full justify-start" onClick={() => open('reschedule')}>
                    Reschedule visit
                  </Button>
                  <a href="tel:18005557652" className="flex h-9 items-center justify-between rounded-control px-3 text-body text-fg-2 hover:bg-surface-2">
                    <span>Call support desk</span>
                    <span className="tnum text-meta">{data.supportPhone}</span>
                  </a>
                </PanelBody>
              </Panel>

              <Notice title="Protection guarantee">
                {data.guarantee}{' '}
                <a href="#" className="text-accent-fg hover:underline">
                  Read the warranty terms
                </a>
              </Notice>
            </div>
          </div>

          <dialog
            ref={dialogRef}
            className="m-auto w-full max-w-md rounded-control border border-line-2 bg-canvas p-0 text-fg backdrop:bg-fg/40"
          >
            <form
              method="dialog"
              className="p-6"
              onSubmit={() => setSent(modal === 'message' ? `Your note was delivered to ${data.technician.name}.` : 'Your reschedule request was sent to dispatch. Expect confirmation within one business day.')}
            >
              <h2 className="text-title font-semibold">{MODALS[modal].title}</h2>
              <p className="mt-1 text-body text-fg-2">{MODALS[modal].description}</p>
              <Field label="Message" htmlFor="modal-text" className="mt-4">
                <Textarea id="modal-text" value={text} onChange={(e) => setText(e.target.value)} placeholder={MODALS[modal].placeholder} />
              </Field>
              <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => dialogRef.current?.close()}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={!text.trim()}>
                  Send
                </Button>
              </div>
            </form>
          </dialog>
        </>
      )}
    </QueryBoundary>
  )
}
