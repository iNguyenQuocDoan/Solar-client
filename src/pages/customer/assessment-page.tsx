import { useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ActionBar } from '@/components/ui/action-bar'
import { Button, ButtonLink } from '@/components/ui/button'
import { Dialog, DialogFooter, DialogTitle } from '@/components/ui/dialog'
import { Checkbox, Field, Input, Select } from '@/components/ui/field'
import { KeyValueList, Notice, Photo } from '@/components/ui/lists'
import { PageHeader } from '@/components/ui/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/ui/panel'
import { Stepper, type Step } from '@/components/ui/stepper'
import { ROUTES } from '@/constants/routes'
import { assessmentDraft, assessmentResult, type AssessmentDraft } from '@/data/customer'
import { fmt } from '@/lib/format'
import { z } from 'zod'

const STEP_LABELS = ['Installation location', 'Surface information', 'Images and photos', 'Review and submit']

const number = (label: string) => z.coerce.number({ error: `Enter the ${label} as a number.` })

/* One schema per step so errors surface where the field is edited. */
const STEP_SCHEMAS = [
  z.object({
    address: z.string().trim().min(8, 'Enter the full address, including street number and city.'),
    houseType: z.string().min(1, 'Choose a house type.'),
    roofAge: number('roof age').min(0, 'Roof age cannot be negative.').max(80, 'Check the roof age; 80 years is the maximum.'),
  }),
  z.object({
    length: number('plane length').positive('Length must be greater than 0.').max(60, 'Check the length; 60 m is the maximum.'),
    width: number('plane width').positive('Width must be greater than 0.').max(60, 'Check the width; 60 m is the maximum.'),
    tilt: number('tilt').min(0, 'Tilt is between 0 and 60 degrees.').max(60, 'Tilt is between 0 and 60 degrees.'),
    azimuth: number('azimuth').min(0, 'Azimuth is between 0 and 360 degrees.').max(360, 'Azimuth is between 0 and 360 degrees.'),
  }),
  z.object({ photos: z.array(z.unknown()).min(1, 'Add at least one roof photo.') }),
  z.object({ ownerConfirmed: z.literal(true, { error: 'Confirm that you own the property or act for the owner.' }) }),
] as const

type Errors = Partial<Record<keyof AssessmentDraft, string>>

function validate(step: number, draft: AssessmentDraft): Errors {
  const result = STEP_SCHEMAS[step]!.safeParse(draft)
  if (result.success) return {}
  const errors: Errors = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof AssessmentDraft
    if (key && !errors[key]) errors[key] = issue.message
  }
  return errors
}

export function AssessmentPage() {
  const [step, setStep] = useState(3)
  const [draft, setDraft] = useState<AssessmentDraft>(assessmentDraft)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const dialogRef = useRef<HTMLDialogElement>(null)

  const steps: Step[] = STEP_LABELS.map((label, i) => ({
    label,
    state: i < step ? 'done' : i === step ? 'active' : 'upcoming',
  }))

  const update = (patch: Partial<AssessmentDraft>) => {
    setDraft((d) => ({ ...d, ...patch }))
    setErrors((e) => {
      const next = { ...e }
      for (const key of Object.keys(patch) as (keyof AssessmentDraft)[]) delete next[key]
      return next
    })
  }
  const areaM2 = Math.round(Number(draft.length) * Number(draft.width))

  function next() {
    const found = validate(step, draft)
    setErrors(found)
    if (Object.keys(found).length === 0) setStep((s) => s + 1)
  }

  function goTo(target: number) {
    setErrors({})
    setStep(target)
  }

  function submit() {
    /* Re-check every step: the review screen is reachable from any edit. */
    const found = STEP_SCHEMAS.reduce<Errors>((acc, _, i) => ({ ...acc, ...validate(i, draft) }), {})
    setErrors(found)
    if (Object.keys(found).length > 0) return
    setSubmitted(true)
    dialogRef.current?.showModal()
  }

  return (
    <>
      <PageHeader
        title="Preliminary self-assessment"
        description="Tell us about the roof so an engineer can size the system before the on-site survey."
        meta={<span>Step {step + 1} of 4</span>}
      />

      <Panel className="mb-12 border-t-0! pt-0!">
        <PanelBody>
          <Stepper steps={steps} />
        </PanelBody>
      </Panel>

      <div className="grid gap-x-12 gap-y-12 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {step === 0 && (
            <Panel>
              <PanelHeader title="Installation location" />
              <PanelBody className="grid gap-4 sm:grid-cols-2">
                <Field label="Project address" htmlFor="address" className="sm:col-span-2" error={errors.address}>
                  <Input id="address" value={draft.address} onChange={(e) => update({ address: e.target.value })} aria-invalid={Boolean(errors.address)} />
                </Field>
                <Field label="House type" htmlFor="houseType" error={errors.houseType}>
                  <Select id="houseType" value={draft.houseType} onChange={(e) => update({ houseType: e.target.value })}>
                    <option>Single family, 1 story</option>
                    <option>Single family, 2 story</option>
                    <option>Townhouse</option>
                    <option>Detached garage or outbuilding</option>
                  </Select>
                </Field>
                <Field label="Roof age" htmlFor="roofAge" hint="Roofs under 10 years old qualify for standard racking." error={errors.roofAge}>
                  <div className="flex items-center gap-2">
                    <Input id="roofAge" inputMode="numeric" value={draft.roofAge} onChange={(e) => update({ roofAge: e.target.value })} aria-invalid={Boolean(errors.roofAge)} />
                    <span className="text-body text-fg-2">years</span>
                  </div>
                </Field>
              </PanelBody>
            </Panel>
          )}

          {step === 1 && (
            <Panel>
              <PanelHeader title="Surface information" description="Measure the largest unobstructed roof plane." />
              <PanelBody className="grid gap-4 sm:grid-cols-2">
                <Field label="Plane length" htmlFor="length" error={errors.length}>
                  <div className="flex items-center gap-2">
                    <Input id="length" inputMode="decimal" value={draft.length} onChange={(e) => update({ length: e.target.value })} aria-invalid={Boolean(errors.length)} />
                    <span className="text-body text-fg-2">m</span>
                  </div>
                </Field>
                <Field label="Plane width" htmlFor="width" hint={Number.isFinite(areaM2) && areaM2 > 0 ? `About ${fmt.num(areaM2)} m² usable plane` : undefined} error={errors.width}>
                  <div className="flex items-center gap-2">
                    <Input id="width" inputMode="decimal" value={draft.width} onChange={(e) => update({ width: e.target.value })} aria-invalid={Boolean(errors.width)} />
                    <span className="text-body text-fg-2">m</span>
                  </div>
                </Field>
                <Field label="Tilt angle" htmlFor="tilt" hint="28° south is the optimal pitch for Springfield." error={errors.tilt}>
                  <div className="flex items-center gap-2">
                    <Input id="tilt" inputMode="numeric" value={draft.tilt} onChange={(e) => update({ tilt: e.target.value })} aria-invalid={Boolean(errors.tilt)} />
                    <span className="text-body text-fg-2">degrees</span>
                  </div>
                </Field>
                <Field label="Azimuth" htmlFor="azimuth" hint="180° is due south." error={errors.azimuth}>
                  <div className="flex items-center gap-2">
                    <Input id="azimuth" inputMode="numeric" value={draft.azimuth} onChange={(e) => update({ azimuth: e.target.value })} aria-invalid={Boolean(errors.azimuth)} />
                    <span className="text-body text-fg-2">degrees</span>
                  </div>
                </Field>
              </PanelBody>
            </Panel>
          )}

          {step === 2 && (
            <Panel>
              <PanelHeader
                title="Roof photos"
                description="A south-facing roof view, the main electrical panel and any obstructions."
                action={
                  <Button size="sm">
                    Upload
                  </Button>
                }
              />
              <PanelBody>
                {errors.photos && (
                  <p className="mb-3 text-meta text-danger" role="alert">
                    {errors.photos}
                  </p>
                )}
                {draft.photos.length === 0 ? (
                  <div className="rounded-container border border-dashed border-line-2 px-6 py-8 text-center text-body text-fg-2">
                    No photos yet. PNG, JPG or HEIC up to 15 MB each.
                  </div>
                ) : (
                  <ul className="grid gap-4 sm:grid-cols-3">
                    {draft.photos.map((p) => (
                      <li key={p.name}>
                        <Photo src={p.src} alt={p.label} caption={p.label} meta={`${p.name}, ${p.size}`} />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2"
                          onClick={() => update({ photos: draft.photos.filter((x) => x.name !== p.name) })}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </PanelBody>
            </Panel>
          )}

          {step === 3 && (
            <>
              <Panel>
                <PanelHeader
                  title="Installation location"
                  action={
                    <Button size="sm" variant="ghost" onClick={() => goTo(0)}>
                      Edit
                    </Button>
                  }
                />
                <PanelBody>
                  <KeyValueList
                    columns={2}
                    items={[
                      { k: 'Project address', v: draft.address },
                      { k: 'House type', v: draft.houseType },
                      { k: 'Roof age', v: `${draft.roofAge} years` },
                    ]}
                  />
                </PanelBody>
              </Panel>
              <Panel>
                <PanelHeader
                  title="Surface information"
                  action={
                    <Button size="sm" variant="ghost" onClick={() => goTo(1)}>
                      Edit
                    </Button>
                  }
                />
                <PanelBody>
                  <KeyValueList
                    columns={2}
                    items={[
                      { k: 'Surface dimensions', v: `${draft.length} m × ${draft.width} m, about ${fmt.num(areaM2)} m²` },
                      { k: 'Tilt angle', v: `${draft.tilt}°` },
                      { k: 'Azimuth', v: `${draft.azimuth}° (south facing)` },
                      { k: 'Suitability score', v: `${assessmentResult.suitabilityScore} / 10, standard racking compatible` },
                    ]}
                  />
                </PanelBody>
              </Panel>
              <Panel>
                <PanelHeader
                  title={`Roof photos (${draft.photos.length})`}
                  action={
                    <Button size="sm" variant="ghost" onClick={() => goTo(2)}>
                      Edit
                    </Button>
                  }
                />
                <PanelBody>
                  {draft.photos.length === 0 ? (
                    <Notice tone="warn">At least one roof photo is required before submitting.</Notice>
                  ) : (
                    <ul className="grid gap-4 sm:grid-cols-3">
                      {draft.photos.map((p) => (
                        <li key={p.name}>
                          <Photo src={p.src} alt={p.label} caption={p.label} meta={`${p.size}, ${p.note}`} />
                        </li>
                      ))}
                    </ul>
                  )}
                </PanelBody>
              </Panel>
            </>
          )}
        </div>

        <div className="space-y-8 lg:border-l lg:border-line lg:pl-8">
          <Panel>
            <PanelHeader title="Preliminary potential" action={<Badge tone="ok">Grade {assessmentResult.grade}</Badge>} />
            <PanelBody>
              <p className="tnum text-figure font-semibold">
                {assessmentResult.capacityKw} <span className="text-body font-normal text-fg-3">kW capacity</span>
              </p>
              <p className="mt-1 text-body text-fg-2">
                Based on {assessmentResult.usableAreaM2} m² of roof plane at {draft.tilt}° pitch and southern Illinois irradiance.
              </p>
              <KeyValueList
                className="mt-4 border-t border-line pt-4"
                items={[
                  { k: 'Annual output', v: `${fmt.num(assessmentResult.annualKwh)} kWh` },
                  { k: 'Household offset', v: `About ${assessmentResult.offsetPct}%` },
                ]}
              />
            </PanelBody>
          </Panel>

          <Notice title="Homeowner certification">
            This assessment and the initial estimate depend on the accuracy of the measurements and images you provide. A
            certified engineer verifies every specification during the on-site survey.
          </Notice>

          <Panel raised>
            <PanelBody className="space-y-3">
              <Checkbox
                checked={draft.ownerConfirmed}
                onChange={(e) => update({ ownerConfirmed: e.target.checked })}
                label={`I confirm that I am the authorized property owner or proxy for ${draft.address.split(',')[0]}.`}
                aria-invalid={Boolean(errors.ownerConfirmed)}
              />
              {errors.ownerConfirmed && (
                <p className="text-meta text-danger" role="alert">
                  {errors.ownerConfirmed}
                </p>
              )}
              <Checkbox
                checked={draft.smsUpdates}
                onChange={(e) => update({ smsUpdates: e.target.checked })}
                label="Send SMS updates for engineer dispatch and quotation issuance."
              />
            </PanelBody>
          </Panel>

          <div className="text-body text-fg-2">
            <p className="font-medium text-fg">Assigned specialist</p>
            <p>
              {assessmentResult.specialist.name}, {assessmentResult.specialist.cert}
            </p>
          </div>
        </div>
      </div>

      <ActionBar>
          <Button onClick={() => goTo(Math.max(0, step - 1))} disabled={step === 0}>
            Back
          </Button>
          <Button variant="ghost">Save draft</Button>
          <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
            {step < 3 ? (
              <Button variant="primary" onClick={next}>
                Continue
              </Button>
            ) : (
              <>
                {Object.keys(errors).length > 0 && (
                  <span className="text-body text-danger" role="alert">
                    Fix the highlighted fields to submit.
                  </span>
                )}
                <Button variant="primary" className="w-full sm:w-auto" disabled={submitted} onClick={submit}>
                  Submit consultation request
                </Button>
              </>
            )}
          </div>
      </ActionBar>

      <Dialog ref={dialogRef}>
          <DialogTitle>Assessment sent</DialogTitle>
          <p className="mt-2 text-body text-fg-2">
            Your self-assessment for {draft.address.split(',')[0]} is logged. {assessmentResult.specialist.name} will finalize
            the preliminary system design and reach out within 2 business hours.
          </p>
          <KeyValueList
            className="mt-4 border-t border-line pt-4"
            items={[
              { k: 'Reference code', v: <span className="text-fg-2">{assessmentResult.referenceCode}</span> },
              { k: 'Estimated yield', v: `${assessmentResult.capacityKw} kW, ${fmt.num(assessmentResult.annualKwh)} kWh` },
            ]}
          />
          <DialogFooter>
            <ButtonLink to={ROUTES.customer.home} variant="ghost">
              Return to overview
            </ButtonLink>
            <ButtonLink to={ROUTES.customer.estimate} variant="primary">
              View preliminary estimate
            </ButtonLink>
          </DialogFooter>
      </Dialog>
    </>
  )
}
