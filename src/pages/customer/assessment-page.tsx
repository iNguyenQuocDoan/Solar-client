import { useRef, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { ActionBar } from '@/components/common/ui/action-bar'
import { Button } from '@/components/common/ui/button'
import { Dialog, DialogFooter, DialogTitle } from '@/components/common/ui/dialog'
import { KeyValueList, Notice } from '@/components/common/ui/lists'
import { PageHeader } from '@/components/common/ui/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/common/ui/panel'
import { Stepper, type Step } from '@/components/common/ui/stepper'
import { useAuth } from '@/context/AuthProvider'
import { ProfileFields, SiteFields, SurfaceFields } from '@/features/pre-surveys/components/AssessmentFields'
import { RoofSimulation } from '@/features/pre-surveys/components/RoofSimulation'
import {
  EMPTY_PROFILE,
  EMPTY_SITE,
  EMPTY_SURFACE,
  check,
  profileSchema,
  serverFieldErrors,
  siteSchema,
  surfaceSchema,
  toNumber,
  type FormErrors,
  type ProfileForm,
  type SiteForm,
  type SurfaceForm,
} from '@/features/pre-surveys/components/assessmentForm'
import {
  customerTypeLabel,
  directionLabel,
  formatAddress,
  formatArea,
  formatDegree,
  shortCode,
  surfaceTypeLabel,
} from '@/features/pre-surveys/components/preSurveyDisplay'
import {
  useCreateCustomerProfileMutation,
  useCreatePreSurveyMutation,
  useCreatePropertySiteMutation,
  useSubmitPreSurveyMutation,
  useUpdatePreSurveyMutation,
} from '@/features/pre-surveys/hooks/usePreSurveyMutations'
import { errorMessage, isApiError } from '@/services/api/errors'
import type { CreateCustomerProfileRequest, CreatePropertySiteRequest } from '@/types/req/customersReq'
import type { UpdatePreSurveyRequest } from '@/types/req/preSurveysReq'

/*
 * Đánh giá sơ bộ: hồ sơ khách hàng → địa điểm → số liệu mặt lắp → gửi.
 * Mỗi bước ghi lên server khi bấm "Tiếp tục". Backend chưa có endpoint GET cho khách hàng,
 * nên trang tự giữ id đã tạo; tải lại trang thì bắt đầu lại (bản nháp cũ vẫn nằm trên server).
 * - Hồ sơ không sửa được: tạo một lần, nhớ cờ trong localStorage theo tài khoản.
 * - Địa điểm không sửa được: đổi thông tin thì tạo địa điểm mới, và bản nháp cũ (gắn với địa điểm cũ)
 *   được thay bằng bản nháp mới.
 */

const STEP_LABELS = ['Thông tin khách hàng', 'Địa điểm lắp đặt', 'Số liệu mặt lắp', 'Xem lại và gửi']
const REVIEW = 3

const profileFlagKey = (account: string) => `smartsolar.customer-profile.${account}`

function readFlag(key: string) {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeFlag(key: string, on: boolean) {
  try {
    if (on) localStorage.setItem(key, '1')
    else localStorage.removeItem(key)
  } catch {
    /* Trình duyệt chặn storage: lần sau chỉ phải đi qua bước hồ sơ một lần nữa. */
  }
}

type Saved = {
  profile?: CreateCustomerProfileRequest
  site?: CreatePropertySiteRequest
  siteId?: string
  surface?: UpdatePreSurveyRequest
  preSurveyId?: string
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

export function AssessmentPage() {
  const { user } = useAuth()
  const flagKey = profileFlagKey(user?.userId ?? user?.email ?? 'anonymous')
  const [profileDone, setProfileDone] = useState(() => readFlag(flagKey))
  const [step, setStep] = useState(() => (readFlag(flagKey) ? 1 : 0))
  const [profile, setProfile] = useState<ProfileForm>(EMPTY_PROFILE)
  const [site, setSite] = useState<SiteForm>(EMPTY_SITE)
  const [surface, setSurface] = useState<SurfaceForm>(EMPTY_SURFACE)
  const [saved, setSaved] = useState<Saved>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const createProfile = useCreateCustomerProfileMutation()
  const createSite = useCreatePropertySiteMutation()
  const createPreSurvey = useCreatePreSurveyMutation()
  const updatePreSurvey = useUpdatePreSurveyMutation()
  const submitPreSurvey = useSubmitPreSurveyMutation()
  const busy = [createProfile, createSite, createPreSurvey, updatePreSurvey, submitPreSurvey].some((m) => m.isPending)

  const firstStep = profileDone ? 1 : 0
  const steps: Step[] = STEP_LABELS.map((label, i) => ({
    label,
    state: i < step || (i === 0 && profileDone) ? 'done' : i === step ? 'active' : 'upcoming',
  }))

  function editor<F>(setter: (fn: (f: F) => F) => void) {
    return (patch: Partial<F>) => {
      setter((f) => ({ ...f, ...patch }))
      setErrors((e) => {
        const next = { ...e }
        for (const key of Object.keys(patch)) delete next[key]
        return next
      })
    }
  }

  function goTo(target: number) {
    setErrors({})
    setFormError(null)
    setStep(target)
  }

  function showErrors<F extends object>(found: FormErrors<F>) {
    setErrors(found as Record<string, string>)
    setFormError('Sửa các ô được đánh dấu để tiếp tục.')
  }

  /** Lỗi từ server: gắn vào ô nếu được, còn lại hiện ở thanh thao tác. */
  function fail<F extends object>(error: unknown, form?: F) {
    const fieldErrors = form && isApiError(error) ? serverFieldErrors(error, form) : {}
    setErrors(fieldErrors as Record<string, string>)
    setFormError(errorMessage(error))
  }

  function markProfileDone() {
    writeFlag(flagKey, true)
    setProfileDone(true)
  }

  async function saveProfile() {
    const result = check(profileSchema, profile)
    if (result.errors) return showErrors(result.errors)
    try {
      await createProfile.mutateAsync(result.data)
      setSaved((s) => ({ ...s, profile: result.data }))
    } catch (error) {
      if (!isApiError(error) || error.code !== 'CUSTOMER_ALREADY_EXISTS') return fail(error, profile)
      toast('Tài khoản đã có hồ sơ khách hàng, hệ thống dùng hồ sơ hiện có.')
    }
    markProfileDone()
    goTo(1)
  }

  async function saveSite() {
    const result = check(siteSchema, site)
    if (result.errors) return showErrors(result.errors)
    if (saved.siteId && same(saved.site, result.data)) return goTo(2)
    try {
      const { propertySiteId } = await createSite.mutateAsync(result.data)
      // Bản nháp gắn với địa điểm; địa điểm mới thì bản nháp mới.
      setSaved((s) => ({ profile: s.profile, site: result.data, siteId: propertySiteId }))
      goTo(2)
    } catch (error) {
      if (isApiError(error) && error.code === 'CUSTOMER_PROFILE_NOT_FOUND') {
        // Cờ trong localStorage sai (ví dụ đổi máy chủ): quay lại khai hồ sơ.
        writeFlag(flagKey, false)
        setProfileDone(false)
        setStep(0)
      }
      fail(error, site)
    }
  }

  /** Tạo bản nháp lần đầu, các lần sau chỉ PUT khi số liệu đổi. Trả về id bản nháp. */
  async function saveSurface(required: boolean) {
    const result = check(surfaceSchema(required), surface)
    if (result.errors) {
      showErrors(result.errors)
      return null
    }
    if (!saved.siteId) {
      goTo(1)
      return null
    }
    try {
      let id = saved.preSurveyId
      if (!id) id = (await createPreSurvey.mutateAsync({ propertySiteId: saved.siteId, ...result.data })).preSurveyId
      else if (!same(saved.surface, result.data)) await updatePreSurvey.mutateAsync({ id, body: result.data })
      setSaved((s) => ({ ...s, surface: result.data, preSurveyId: id }))
      setErrors({})
      setFormError(null)
      return id
    } catch (error) {
      fail(error, surface)
      return null
    }
  }

  async function saveDraft() {
    if (await saveSurface(false)) toast.success('Đã lưu nháp.')
  }

  async function submit() {
    if (!saved.preSurveyId) return goTo(2)
    try {
      const { surveyRequestId } = await submitPreSurvey.mutateAsync(saved.preSurveyId)
      setRequestId(surveyRequestId)
      dialogRef.current?.showModal()
    } catch (error) {
      if (isApiError(error) && error.code === 'PRE_SURVEY_INCOMPLETE') setStep(2)
      fail(error)
    }
  }

  async function next(e?: FormEvent) {
    e?.preventDefault()
    if (busy) return
    setFormError(null)
    if (step === 0) return saveProfile()
    if (step === 1) return saveSite()
    if (step === 2) {
      if (await saveSurface(true)) goTo(REVIEW)
      return
    }
    return submit()
  }

  function startOver() {
    dialogRef.current?.close()
    setSite(EMPTY_SITE)
    setSurface(EMPTY_SURFACE)
    setSaved((s) => ({ profile: s.profile }))
    setRequestId(null)
    goTo(1)
  }

  const submitted = requestId !== null

  return (
    <>
      <PageHeader title="Đánh giá sơ bộ" meta={<span>Bước {step + 1}/4</span>} />

      <Panel className="mb-6 border-t-0! pt-0!">
        <PanelBody>
          <Stepper steps={steps} />
        </PanelBody>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <form id="assessment-step" noValidate onSubmit={next} className="space-y-4 lg:col-span-2">
          {step === 0 && (
            <Panel>
              <PanelHeader title="Thông tin khách hàng" description="Khai một lần cho tài khoản này." />
              <PanelBody>
                <ProfileFields value={profile} errors={errors} onChange={editor(setProfile)} />
              </PanelBody>
            </Panel>
          )}

          {step === 1 && (
            <Panel>
              <PanelHeader title="Địa điểm lắp đặt" />
              <PanelBody>
                <SiteFields value={site} errors={errors} onChange={editor(setSite)} />
              </PanelBody>
            </Panel>
          )}

          {step === 2 && (
            <Panel>
              <PanelHeader title="Số liệu mặt lắp" description="Đo mặt lắp lớn nhất. Chưa đủ số liệu thì lưu nháp, điền tiếp sau." />
              <PanelBody>
                <SurfaceFields value={surface} errors={errors} onChange={editor(setSurface)} />
              </PanelBody>
            </Panel>
          )}
          {step === 2 && (
            <Panel>
              <PanelHeader title="Mô phỏng bố trí" description="Cập nhật theo số liệu bạn nhập ở trên." />
              <PanelBody>
                <RoofSimulation
                  totalAreaM2={toNumber(surface.totalAreaM2)}
                  usableAreaM2={toNumber(surface.usableAreaM2)}
                  tiltDegree={toNumber(surface.tiltDegree)}
                  azimuthDegree={toNumber(surface.azimuthDegree)}
                  hasObstruction={surface.hasObstruction === '' ? null : surface.hasObstruction === 'yes'}
                />
              </PanelBody>
            </Panel>
          )}

          {step === REVIEW && saved.site && saved.surface && (
            <>
              <Panel>
                <PanelHeader title="Thông tin khách hàng" />
                <PanelBody>
                  {saved.profile ? (
                    <KeyValueList
                      columns={2}
                      items={[
                        { k: 'Loại khách hàng', v: customerTypeLabel(saved.profile.customerType) },
                        ...(saved.profile.companyName ? [{ k: 'Doanh nghiệp', v: saved.profile.companyName }] : []),
                        ...(saved.profile.taxCode ? [{ k: 'Mã số thuế', v: saved.profile.taxCode }] : []),
                      ]}
                    />
                  ) : (
                    <p className="text-body text-fg-2">Dùng hồ sơ khách hàng đã có của tài khoản.</p>
                  )}
                </PanelBody>
              </Panel>
              <Panel>
                <PanelHeader
                  title="Địa điểm lắp đặt"
                  action={
                    <Button size="sm" variant="ghost" disabled={submitted} onClick={() => goTo(1)}>
                      Sửa
                    </Button>
                  }
                />
                <PanelBody>
                  {/* Một cột: địa chỉ dài, chia hai cột thì bị bẻ từng chữ. */}
                  <KeyValueList
                    items={[
                      { k: 'Tên địa điểm', v: saved.site.name },
                      { k: 'Địa chỉ', v: formatAddress(saved.site) },
                      { k: 'Bề mặt', v: surfaceTypeLabel(saved.site.installationSurfaceType) },
                      { k: 'Vật liệu', v: saved.site.surfaceMaterial ?? '—' },
                      ...(saved.site.latitude != null && saved.site.longitude != null
                        ? [{ k: 'Toạ độ', v: `${saved.site.latitude}, ${saved.site.longitude}` }]
                        : []),
                    ]}
                  />
                </PanelBody>
              </Panel>
              <Panel>
                <PanelHeader
                  title="Số liệu mặt lắp"
                  action={
                    <Button size="sm" variant="ghost" disabled={submitted} onClick={() => goTo(2)}>
                      Sửa
                    </Button>
                  }
                />
                <PanelBody>
                  <KeyValueList
                    columns={2}
                    items={[
                      { k: 'Tổng diện tích', v: formatArea(saved.surface.totalAreaM2) },
                      { k: 'Diện tích dùng được', v: formatArea(saved.surface.usableAreaM2) },
                      { k: 'Độ dốc mái', v: formatDegree(saved.surface.tiltDegree) },
                      { k: 'Hướng mái', v: directionLabel(saved.surface.azimuthDegree) },
                      { k: 'Vật cản', v: saved.surface.hasObstruction ? 'Có' : 'Không' },
                    ]}
                  />
                </PanelBody>
              </Panel>
              <Panel>
                <PanelHeader title="Mô phỏng bố trí" />
                <PanelBody>
                  <RoofSimulation {...saved.surface} />
                </PanelBody>
              </Panel>
            </>
          )}
        </form>

        <div className="space-y-4 lg:border-l lg:border-line lg:pl-6">
          <Notice title="Sau khi gửi">
            Yêu cầu chuyển tới bộ phận kinh doanh. Chuyên viên nhận yêu cầu sẽ liên hệ để hẹn ngày khảo sát tại công trình
            và kiểm tra lại các số đo bạn khai.
          </Notice>
          {saved.preSurveyId && !submitted && (
            <p className="text-body text-fg-2">
              Bản nháp <span className="tnum font-medium text-fg">{shortCode(saved.preSurveyId)}</span> đã lưu trên hệ thống.
            </p>
          )}
        </div>
      </div>

      <ActionBar>
        <Button onClick={() => goTo(Math.max(firstStep, step - 1))} disabled={step <= firstStep || busy || submitted}>
          Quay lại
        </Button>
        {step === 2 && (
          <Button variant="ghost" onClick={saveDraft} disabled={busy}>
            Lưu nháp
          </Button>
        )}
        <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
          {formError && (
            <span className="text-body text-danger" role="alert">
              {formError}
            </span>
          )}
          <Button type="submit" form="assessment-step" variant="primary" className="w-full sm:w-auto" disabled={busy || submitted}>
            {busy ? 'Đang lưu…' : step === REVIEW ? 'Gửi yêu cầu khảo sát' : 'Tiếp tục'}
          </Button>
        </div>
      </ActionBar>

      <Dialog ref={dialogRef}>
        <DialogTitle>Đã gửi yêu cầu khảo sát</DialogTitle>
        <p className="mt-2 text-body text-fg-2">
          Chuyên viên kinh doanh sẽ nhận yêu cầu cho {saved.site?.name ?? 'địa điểm của bạn'} và liên hệ để hẹn ngày khảo sát.
        </p>
        <KeyValueList
          className="mt-4 border-t border-line pt-4"
          items={[{ k: 'Mã yêu cầu', v: <span className="tnum">{shortCode(requestId)}</span> }]}
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => dialogRef.current?.close()}>
            Đóng
          </Button>
          <Button variant="primary" onClick={startOver}>
            Đánh giá địa điểm khác
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}
