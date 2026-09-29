import { useRef, useState } from 'react'
import { Badge } from '@/components/common/ui/badge'
import { ActionBar } from '@/components/common/ui/action-bar'
import { Button, ButtonLink } from '@/components/common/ui/button'
import { Dialog, DialogFooter, DialogTitle } from '@/components/common/ui/dialog'
import { Checkbox, Field, Input, Select } from '@/components/common/ui/field'
import { KeyValueList, Notice, Photo } from '@/components/common/ui/lists'
import { PageHeader } from '@/components/common/ui/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/common/ui/panel'
import { Stepper, type Step } from '@/components/common/ui/stepper'
import { ROUTES } from '@/routes/paths'
import { assessmentDraft, assessmentResult, type AssessmentDraft } from '@/data/customer'
import { fmt } from '@/utils/format'
import { z } from 'zod'

const STEP_LABELS = ['Vị trí lắp đặt', 'Thông tin mặt mái', 'Hình ảnh', 'Xem lại và gửi']

const number = (label: string) => z.coerce.number({ error: `Nhập ${label} bằng số.` })

/* One schema per step so errors surface where the field is edited. */
const STEP_SCHEMAS = [
  z.object({
    address: z.string().trim().min(8, 'Nhập đầy đủ địa chỉ, gồm số nhà và thành phố.'),
    houseType: z.string().min(1, 'Chọn loại nhà.'),
    roofAge: number('tuổi mái').min(0, 'Tuổi mái không được âm.').max(80, 'Kiểm tra lại tuổi mái; tối đa 80 năm.'),
  }),
  z.object({
    length: number('chiều dài mặt mái').positive('Chiều dài phải lớn hơn 0.').max(60, 'Kiểm tra lại chiều dài; tối đa 60 m.'),
    width: number('chiều rộng mặt mái').positive('Chiều rộng phải lớn hơn 0.').max(60, 'Kiểm tra lại chiều rộng; tối đa 60 m.'),
    tilt: number('góc nghiêng').min(0, 'Góc nghiêng từ 0 đến 60 độ.').max(60, 'Góc nghiêng từ 0 đến 60 độ.'),
    azimuth: number('góc phương vị').min(0, 'Góc phương vị từ 0 đến 360 độ.').max(360, 'Góc phương vị từ 0 đến 360 độ.'),
  }),
  z.object({ photos: z.array(z.unknown()).min(1, 'Thêm ít nhất một ảnh mái.') }),
  z.object({ ownerConfirmed: z.literal(true, { error: 'Xác nhận bạn là chủ nhà hoặc người được chủ nhà uỷ quyền.' }) }),
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
        title="Tự đánh giá sơ bộ"
        meta={<span>Bước {step + 1}/4</span>}
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
              <PanelHeader title="Vị trí lắp đặt" />
              <PanelBody className="grid gap-4 sm:grid-cols-2">
                <Field label="Địa chỉ công trình" htmlFor="address" className="sm:col-span-2" error={errors.address}>
                  <Input id="address" value={draft.address} onChange={(e) => update({ address: e.target.value })} aria-invalid={Boolean(errors.address)} />
                </Field>
                <Field label="Loại nhà" htmlFor="houseType" error={errors.houseType}>
                  <Select id="houseType" value={draft.houseType} onChange={(e) => update({ houseType: e.target.value })}>
                    <option>Nhà riêng, 1 tầng</option>
                    <option>Nhà riêng, 2 tầng</option>
                    <option>Nhà phố</option>
                    <option>Gara hoặc nhà phụ tách riêng</option>
                  </Select>
                </Field>
                <Field label="Tuổi mái" htmlFor="roofAge" hint="Mái dưới 10 năm lắp được khung tiêu chuẩn." error={errors.roofAge}>
                  <div className="flex items-center gap-2">
                    <Input id="roofAge" inputMode="numeric" value={draft.roofAge} onChange={(e) => update({ roofAge: e.target.value })} aria-invalid={Boolean(errors.roofAge)} />
                    <span className="text-body text-fg-2">năm</span>
                  </div>
                </Field>
              </PanelBody>
            </Panel>
          )}

          {step === 1 && (
            <Panel>
              <PanelHeader title="Thông tin mặt mái" description="Đo mặt mái lớn nhất không bị vật cản." />
              <PanelBody className="grid gap-4 sm:grid-cols-2">
                <Field label="Chiều dài mặt mái" htmlFor="length" error={errors.length}>
                  <div className="flex items-center gap-2">
                    <Input id="length" inputMode="decimal" value={draft.length} onChange={(e) => update({ length: e.target.value })} aria-invalid={Boolean(errors.length)} />
                    <span className="text-body text-fg-2">m</span>
                  </div>
                </Field>
                <Field label="Chiều rộng mặt mái" htmlFor="width" hint={Number.isFinite(areaM2) && areaM2 > 0 ? `Khoảng ${fmt.num(areaM2)} m² mặt mái sử dụng được` : undefined} error={errors.width}>
                  <div className="flex items-center gap-2">
                    <Input id="width" inputMode="decimal" value={draft.width} onChange={(e) => update({ width: e.target.value })} aria-invalid={Boolean(errors.width)} />
                    <span className="text-body text-fg-2">m</span>
                  </div>
                </Field>
                <Field label="Góc nghiêng" htmlFor="tilt" hint="Hướng Nam, dốc 28° là tối ưu cho Springfield." error={errors.tilt}>
                  <div className="flex items-center gap-2">
                    <Input id="tilt" inputMode="numeric" value={draft.tilt} onChange={(e) => update({ tilt: e.target.value })} aria-invalid={Boolean(errors.tilt)} />
                    <span className="text-body text-fg-2">độ</span>
                  </div>
                </Field>
                <Field label="Góc phương vị" htmlFor="azimuth" hint="180° là chính Nam." error={errors.azimuth}>
                  <div className="flex items-center gap-2">
                    <Input id="azimuth" inputMode="numeric" value={draft.azimuth} onChange={(e) => update({ azimuth: e.target.value })} aria-invalid={Boolean(errors.azimuth)} />
                    <span className="text-body text-fg-2">độ</span>
                  </div>
                </Field>
              </PanelBody>
            </Panel>
          )}

          {step === 2 && (
            <Panel>
              <PanelHeader
                title="Ảnh mái"
                description="Ảnh mái hướng Nam, tủ điện chính và các vật cản nếu có."
                action={
                  <Button size="sm">
                    Tải lên
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
                    Chưa có ảnh. PNG, JPG hoặc HEIC, tối đa 15 MB mỗi ảnh.
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
                          Xoá
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
                  title="Vị trí lắp đặt"
                  action={
                    <Button size="sm" variant="ghost" onClick={() => goTo(0)}>
                      Sửa
                    </Button>
                  }
                />
                <PanelBody>
                  <KeyValueList
                    columns={2}
                    items={[
                      { k: 'Địa chỉ công trình', v: draft.address },
                      { k: 'Loại nhà', v: draft.houseType },
                      { k: 'Tuổi mái', v: `${draft.roofAge} năm` },
                    ]}
                  />
                </PanelBody>
              </Panel>
              <Panel>
                <PanelHeader
                  title="Thông tin mặt mái"
                  action={
                    <Button size="sm" variant="ghost" onClick={() => goTo(1)}>
                      Sửa
                    </Button>
                  }
                />
                <PanelBody>
                  <KeyValueList
                    columns={2}
                    items={[
                      { k: 'Kích thước mặt mái', v: `${draft.length} m × ${draft.width} m, khoảng ${fmt.num(areaM2)} m²` },
                      { k: 'Góc nghiêng', v: `${draft.tilt}°` },
                      { k: 'Góc phương vị', v: `${draft.azimuth}° (hướng Nam)` },
                      { k: 'Điểm phù hợp', v: `${assessmentResult.suitabilityScore} / 10, lắp được khung tiêu chuẩn` },
                    ]}
                  />
                </PanelBody>
              </Panel>
              <Panel>
                <PanelHeader
                  title={`Ảnh mái (${draft.photos.length})`}
                  action={
                    <Button size="sm" variant="ghost" onClick={() => goTo(2)}>
                      Sửa
                    </Button>
                  }
                />
                <PanelBody>
                  {draft.photos.length === 0 ? (
                    <Notice tone="warn">Cần ít nhất một ảnh mái trước khi gửi.</Notice>
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
            <PanelHeader title="Tiềm năng sơ bộ" action={<Badge tone="ok">Hạng {assessmentResult.grade}</Badge>} />
            <PanelBody>
              <p className="tnum text-figure font-semibold">
                {assessmentResult.capacityKw} <span className="text-body font-normal text-fg-3">kW công suất</span>
              </p>
              <p className="mt-1 text-body text-fg-2">
                Dựa trên {assessmentResult.usableAreaM2} m² mặt mái, dốc {draft.tilt}° và bức xạ mặt trời vùng nam Illinois.
              </p>
              <KeyValueList
                className="mt-4 border-t border-line pt-4"
                items={[
                  { k: 'Sản lượng mỗi năm', v: `${fmt.num(assessmentResult.annualKwh)} kWh` },
                  { k: 'Tỷ lệ bù điện gia đình', v: `Khoảng ${assessmentResult.offsetPct}%` },
                ]}
              />
            </PanelBody>
          </Panel>

          <Notice title="Cam kết của chủ nhà">
            Đánh giá này và giá ước tính ban đầu phụ thuộc vào độ chính xác của số đo và hình ảnh bạn cung cấp. Kỹ sư có
            chứng chỉ sẽ kiểm tra lại mọi thông số khi khảo sát tại nhà.
          </Notice>

          <Panel raised>
            <PanelBody className="space-y-3">
              <Checkbox
                checked={draft.ownerConfirmed}
                onChange={(e) => update({ ownerConfirmed: e.target.checked })}
                label={`Tôi xác nhận là chủ nhà hoặc người được uỷ quyền của ${draft.address.split(',')[0]}.`}
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
                label="Gửi SMS khi kỹ sư được cử tới và khi có báo giá."
              />
            </PanelBody>
          </Panel>

          <div className="text-body text-fg-2">
            <p className="font-medium text-fg">Chuyên viên phụ trách</p>
            <p>
              {assessmentResult.specialist.name}, {assessmentResult.specialist.cert}
            </p>
          </div>
        </div>
      </div>

      <ActionBar>
          <Button onClick={() => goTo(Math.max(0, step - 1))} disabled={step === 0}>
            Quay lại
          </Button>
          <Button variant="ghost">Lưu nháp</Button>
          <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
            {step < 3 ? (
              <Button variant="primary" onClick={next}>
                Tiếp tục
              </Button>
            ) : (
              <>
                {Object.keys(errors).length > 0 && (
                  <span className="text-body text-danger" role="alert">
                    Sửa các ô được đánh dấu để gửi.
                  </span>
                )}
                <Button variant="primary" className="w-full sm:w-auto" disabled={submitted} onClick={submit}>
                  Gửi yêu cầu tư vấn
                </Button>
              </>
            )}
          </div>
      </ActionBar>

      <Dialog ref={dialogRef}>
          <DialogTitle>Đã gửi đánh giá</DialogTitle>
          <p className="mt-2 text-body text-fg-2">
            Đã ghi nhận đánh giá của bạn cho {draft.address.split(',')[0]}. {assessmentResult.specialist.name} sẽ hoàn thiện
            thiết kế sơ bộ và liên hệ trong vòng 2 giờ làm việc.
          </p>
          <KeyValueList
            className="mt-4 border-t border-line pt-4"
            items={[
              { k: 'Mã tham chiếu', v: <span className="text-fg-2">{assessmentResult.referenceCode}</span> },
              { k: 'Sản lượng ước tính', v: `${assessmentResult.capacityKw} kW, ${fmt.num(assessmentResult.annualKwh)} kWh` },
            ]}
          />
          <DialogFooter>
            <ButtonLink to={ROUTES.customer.home} variant="ghost">
              Về trang tổng quan
            </ButtonLink>
            <ButtonLink to={ROUTES.customer.estimate} variant="primary">
              Xem giá ước tính sơ bộ
            </ButtonLink>
          </DialogFooter>
      </Dialog>
    </>
  )
}
