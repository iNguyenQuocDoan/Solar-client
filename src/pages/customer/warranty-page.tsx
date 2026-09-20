import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button, ButtonLink } from '@/components/ui/button'
import { Field, Input, Radio, Select, Textarea } from '@/components/ui/field'
import { KeyValueList, Notice } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui/panel'
import { Stat, StatRow } from '@/components/ui/stat'
import { ROUTES, withId } from '@/constants/routes'
import { warranty } from '@/data/customer'
import { QueryBoundary, useMockQuery } from '@/services/mock'

export function WarrantyPage() {
  const query = useMockQuery(['customer', 'warranty'], warranty)
  const [form, setForm] = useState({ system: warranty.systems[0], type: warranty.serviceTypes[0], issue: '', phone: warranty.contact.phone, email: warranty.contact.email })
  const [submitted, setSubmitted] = useState(false)
  const issueError = submitted === false && form.issue.length > 0 && form.issue.trim().length < 10 ? 'Describe the issue in a few more words.' : undefined

  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            meta={
              <>
                <span className="text-fg-2">{data.policyId}</span>
                <Badge tone="ok">{data.status}</Badge>
              </>
            }
            title={data.plan}
            description={data.summary}
            actions={<Button>Policy contract</Button>}
          />

          <Panel className="mb-10">
            <PanelBody className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <StatRow className="md:grid-cols-3">
                <Stat label="Warranty expiration" value={data.expires} note={data.remaining} />
                <Stat label="Array efficiency" value={`${data.telemetry.efficiencyPct}%`} note="Optimal threshold" tone="ok" />
                <Stat label="Installation site" value={<span className="text-lg">{data.site.split(',')[0]}</span>} note={data.site.split(', ')[1]} />
              </StatRow>
              <div className="lg:border-l lg:border-line lg:pl-6">
                <p className="text-[14px] font-medium">Coverage terms</p>
                <KeyValueList className="mt-2" items={data.coverage} />
                <p className="mt-3 text-[13px] text-fg-3">
                  {data.telemetry.status}. {data.telemetry.detail}
                </p>
              </div>
            </PanelBody>
          </Panel>

          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-5">
            <div className="space-y-10 lg:col-span-3">
              <Panel>
                <PanelHeader
                  title="Active service requests"
                  description="Dispatched warranty visits and open technician inquiries"
                  action={<Badge>{data.activeRequests.length} active</Badge>}
                />
                <PanelBody>
                  <ul className="divide-y divide-line">
                    {data.activeRequests.map((r) => (
                      <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[14px] text-fg-2">{r.id}</span>
                          <Badge tone="warn">{r.status}</Badge>
                        </div>
                        <p className="mt-1 font-medium">{r.title}</p>
                        <p className="text-[14px] text-fg-2">{r.body}</p>
                        <p className="mt-1 text-[13px] text-fg-3">
                          Technician {r.technician}. Arrival window {r.window}.
                        </p>
                        <div className="mt-3 flex gap-2">
                          <ButtonLink to={withId(ROUTES.customer.warrantyRequest, r.id)} size="sm" variant="primary">
                            View case details
                          </ButtonLink>
                          <Button size="sm">Reschedule</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader
                  title="Maintenance history"
                  description="System diagnostics, firmware records and site servicing"
                  action={
                    <Button size="sm" variant="ghost">
                      Export log
                    </Button>
                  }
                />
                <PanelBody>
                  <ul className="divide-y divide-line">
                    {data.history.map((h) => (
                      <li key={h.title} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium">{h.title}</p>
                          <Badge tone={h.result === 'Passed' ? 'ok' : 'neutral'}>{h.result}</Badge>
                        </div>
                        <p className="mt-1 text-[14px] text-fg-2">{h.body}</p>
                        <p className="mt-1 text-[13px] text-fg-3">
                          {h.when}. {h.ref}
                        </p>
                      </li>
                    ))}
                  </ul>
                </PanelBody>
              </Panel>
            </div>

            <div className="space-y-10 lg:col-span-2">
              <Panel>
                <PanelHeader title="Request support" description="Zero co-pay warranty claims and maintenance" />
                {submitted ? (
                  <PanelBody>
                    <Notice tone="ok" title="Request received">
                      A case manager will be assigned within 2 business hours and will confirm the visit window by SMS.
                    </Notice>
                  </PanelBody>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (form.issue.trim().length < 10) return
                      setSubmitted(true)
                    }}
                  >
                    <PanelBody className="space-y-4">
                      <Field label="Property system" htmlFor="system">
                        <Select id="system" value={form.system} onChange={(e) => setForm({ ...form, system: e.target.value })}>
                          {data.systems.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </Select>
                      </Field>
                      <fieldset>
                        <legend className="mb-1.5 text-[14px] font-medium">Requested service type</legend>
                        <div className="grid grid-cols-2 gap-2">
                          {data.serviceTypes.map((t) => (
                            <Radio key={t} name="type" label={t} checked={form.type === t} onChange={() => setForm({ ...form, type: t })} />
                          ))}
                        </div>
                      </fieldset>
                      <Field label="Issue or observation" htmlFor="issue" error={issueError}>
                        <Textarea
                          id="issue"
                          value={form.issue}
                          onChange={(e) => setForm({ ...form, issue: e.target.value })}
                          placeholder="Inverter alert on the mobile app, loose bracket clamp, unexpected shading"
                          aria-invalid={Boolean(issueError)}
                        />
                      </Field>
                      <div>
                        <p className="mb-1.5 text-[14px] font-medium">Evidence or photos (optional)</p>
                        <button
                          type="button"
                          className="press flex w-full flex-col items-center gap-1 rounded-md border border-dashed border-line-2 px-4 py-5 text-[14px] text-fg-2 hover:bg-surface-2"
                        >
                          <span>Click to upload or drag and drop</span>
                          <span className="text-[13px] text-fg-3">PNG, JPG or PDF up to 15 MB</span>
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Contact phone" htmlFor="phone">
                          <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                        </Field>
                        <Field label="Email address" htmlFor="email">
                          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        </Field>
                      </div>
                      <p className="text-[13px] text-fg-3">Diagnostic visits, hardware replacements and ladder fees are covered with a $0 deductible.</p>
                    </PanelBody>
                    <PanelFooter>
                      <Button type="submit" variant="primary">
                        Submit service request
                      </Button>
                    </PanelFooter>
                  </form>
                )}
              </Panel>

              <Notice tone="warn" title="Emergency system shutdown?">
                For rapid roof access support or an inverter fault, call 24/7 dispatch at{' '}
                <a href="tel:18005557652" className="font-medium text-fg hover:underline">
                  {data.emergencyPhone}
                </a>
                .
              </Notice>
            </div>
          </div>
        </>
      )}
    </QueryBoundary>
  )
}
