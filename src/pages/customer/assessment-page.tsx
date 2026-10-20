import { useIsMutating, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { Icon } from '@/components/common/stitch-ui/Icon'
import { ActionBar } from '@/components/common/ui/action-bar'
import { Count } from '@/components/common/ui/badge'
import { Button } from '@/components/common/ui/button'
import { Dialog, DialogFooter, DialogTitle } from '@/components/common/ui/dialog'
import { KeyValueList, Notice } from '@/components/common/ui/lists'
import { PageHeader } from '@/components/common/ui/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/common/ui/panel'
import { EmptyState, ErrorState, PageSkeleton } from '@/components/common/ui/states'
import { WizardSteps, type WizardStep } from '@/components/common/ui/wizard-steps'
import { usePageCrumb } from '@/components/layout/page-crumb'
import { useAuth } from '@/context/AuthProvider'
import { ProfileFields, SiteFields } from '@/features/pre-surveys/components/AssessmentFields'
import {
  clearDraft,
  clearWork,
  readDraft,
  readWork,
  writeDraft,
  writeWork,
  type AssessmentDraft,
} from '@/features/pre-surveys/components/assessmentDraft'
import {
  EMPTY_PROFILE,
  EMPTY_SITE,
  check,
  profileSchema,
  serverFieldErrors,
  siteSchema,
  siteToForm,
  type FormErrors,
  type ProfileForm,
  type SiteForm,
} from '@/features/pre-surveys/components/assessmentForm'
import {
  customerTypeLabel,
  directionLabel,
  formatAddress,
  hasCoordinates,
  shortCode,
  surfaceTypeLabel,
} from '@/features/pre-surveys/components/preSurveyDisplay'
import {
  formatKwh,
  formatM2,
  formatOne,
  formatTwo,
  mountingLabel,
} from '@/features/pre-surveys/components/simulationDisplay'
import { EMPTY_SIMULATION_FORM, type SimulationForm } from '@/features/pre-surveys/components/simulationForm'
import { SimulationHistory } from '@/features/pre-surveys/components/SimulationHistory'
import { SimulationWorkspace } from '@/features/pre-surveys/components/SimulationWorkspace'
import { SurfaceEditor } from '@/features/pre-surveys/components/SurfaceEditor'
import {
  EMPTY_SURFACE_FORM,
  autoDeclared,
  declaredDiffers,
  meterText,
  serverSurfaceErrors,
  surfaceChanged,
  surfaceDiffers,
  surfaceToForm,
  toDeclaredRequest,
  toSurfaceRequest,
  validateSurface,
  type SurfaceErrors,
  type SurfaceForm,
} from '@/features/pre-surveys/components/surfaceForm'
import {
  preSurveyKeys,
  useCreateCustomerProfileMutation,
  useCreatePreSurveyMutation,
  useCreatePropertySiteMutation,
  useSaveSurfaceMutation,
  useSubmitPreSurveyMutation,
  useSurfaceQuery,
  useUpdatePreSurveyMutation,
} from '@/features/pre-surveys/hooks/usePreSurveys'
import { useHcmWardsQuery } from '@/features/pre-surveys/hooks/useHcmWards'
import { CREATE_SIMULATION_KEY, useSimulationsQuery } from '@/features/pre-surveys/hooks/useSimulations'
import { getSurface } from '@/features/pre-surveys/services/preSurveyService'
import { ROUTES, withId } from '@/routes/paths'
import { errorMessage, isApiError } from '@/services/api/errors'
import { cx } from '@/utils/cx'

// Wizard đánh giá sơ bộ gồm 5 bước: hồ sơ, địa điểm, mặt lắp, mô phỏng, xem lại và gửi
// Hồ sơ và địa điểm không có API sửa, đổi địa điểm thì tạo địa điểm và bản nháp mới
// Lưu mặt lắp trước số liệu khai, vì cả hai API đều ghi độ dốc và hướng

const STEP_LABELS = ['Thông tin khách hàng', 'Địa điểm lắp đặt', 'Mặt lắp', 'Mô phỏng', 'Xem lại và gửi']
const STEP_HINTS = [
  'Cho biết bạn lắp đặt cho cá nhân hay doanh nghiệp. Chỉ khai một lần cho tài khoản này.',
  'Công trình ở đâu và tấm pin sẽ lắp trên bề mặt nào.',
  'Đo mặt mái định lắp, chọn hướng mái và đánh dấu các vật cản trên mái.',
  'Chọn tấm pin và kiểu lắp để xem xếp được bao nhiêu tấm và ước tính sản lượng điện.',
  'Kiểm tra lại thông tin rồi gửi. Gửi xong bạn chọn ngày giờ để kỹ thuật viên tới khảo sát.',
]
const SITE = 1
const SURFACE = 2
const SIMULATION = 3
const REVIEW = 4
/** Lưu bước trên URL để nút Back / Forward của trình duyệt chuyển được bước */
const STEP_PARAM = 'buoc'
const STEP_SLUGS = ['ho-so', 'dia-diem', 'mat-lap', 'mo-phong', 'xem-lai']

const FIX_FIELDS = 'Sửa các ô được đánh dấu để tiếp tục.'

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
    // localStorage bị chặn: bỏ qua
  }
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

export function AssessmentPage() {
  const { user } = useAuth()
  const account = user?.userId ?? user?.email ?? 'anonymous'
  const flagKey = profileFlagKey(account)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [saved, setSavedState] = useState<AssessmentDraft>(() => readDraft(account))
  const [profileDone, setProfileDone] = useState(() => readFlag(flagKey))
  // Mặt lắp trên máy chỉ dùng nếu thuộc đúng bản nháp đang mở
  const [work] = useState(() => readWork(account))
  const workSurface = work && work.preSurveyId === saved.preSurveyId ? work : null
  const [profile, setProfile] = useState<ProfileForm>(() => work?.profile ?? EMPTY_PROFILE)
  const [site, setSite] = useState<SiteForm>(() => work?.site ?? (saved.site ? siteToForm(saved.site) : EMPTY_SITE))
  const [surface, setSurface] = useState<SurfaceForm>(() => workSurface?.surface ?? EMPTY_SURFACE_FORM)
  const [simForm, setSimForm] = useState<SimulationForm>(() => work?.simForm ?? EMPTY_SIMULATION_FORM)
  const [viewId, setViewId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [conflict, setConflict] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(null)
  /** Gửi làm expectedRevision khi lưu, null là chưa nạp từ server */
  const [baseRevision, setBaseRevision] = useState<number | null>(() => workSurface?.baseRevision ?? null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const surfaceQuery = useSurfaceQuery(saved.preSurveyId)
  const loaded = surfaceQuery.data

  // Bước lấy từ URL, không có thì lấy bước đã lưu, rồi giới hạn để không nhảy qua bước chưa làm
  const [searchParams, setSearchParams] = useSearchParams()
  const [initialStep] = useState(
    () => work?.step ?? (saved.preSurveyId || saved.siteId ? SURFACE : readFlag(flagKey) ? SITE : 0),
  )
  /** Đã biết bước từ URL hoặc localStorage thì không tự nhảy sang bước mô phỏng */
  const [explicitStep] = useState(() => searchParams.has(STEP_PARAM) || work !== null)
  /** Giữ bước hiện tại khi URL mất ?buoc (bấm lại menu) */
  const lastStep = useRef<number | null>(null)
  const urlStep = STEP_SLUGS.indexOf(searchParams.get(STEP_PARAM) ?? '')
  const firstStep = profileDone ? SITE : 0
  const maxStep =
    !saved.siteId && !saved.preSurveyId ? firstStep : saved.preSurveyId && loaded?.surfaceDefined ? REVIEW : SURFACE
  const step = Math.min(maxStep, Math.max(firstStep, urlStep >= 0 ? urlStep : (lastStep.current ?? initialStep)))
  /** Chuyển bước do code: thay URL hiện tại và không cuộn trang */
  const silentMove = useRef(false)
  function moveTo(target: number, { replace = false } = {}) {
    // Chỉ bật cờ khi bước thật sự đổi, tránh cờ bị sót lại
    silentMove.current = replace && target !== step
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set(STEP_PARAM, STEP_SLUGS[target]!)
        return next
      },
      { replace },
    )
  }
  // Ref để effect luôn gọi được bản moveTo mới nhất
  const moveRef = useRef(moveTo)
  useEffect(() => {
    moveRef.current = moveTo
    lastStep.current = step
  })
  // Mở từ menu (chưa có ?buoc) thì ghi bước vào URL
  useEffect(() => {
    if (!searchParams.has(STEP_PARAM)) moveRef.current(lastStep.current ?? step, { replace: true })
  }, [searchParams, step])

  const createProfile = useCreateCustomerProfileMutation()
  const createSite = useCreatePropertySiteMutation()
  const createPreSurvey = useCreatePreSurveyMutation()
  const updatePreSurvey = useUpdatePreSurveyMutation()
  const saveSurfaceMutation = useSaveSurfaceMutation()
  const submitPreSurvey = useSubmitPreSurveyMutation()
  const wards = useHcmWardsQuery()
  const simulations = useSimulationsQuery(step >= SIMULATION ? saved.preSurveyId : null)
  const [savingSurface, setSavingSurface] = useState(false)
  // Đang chạy mô phỏng cũng tính là bận
  const runningSimulation = useIsMutating({ mutationKey: CREATE_SIMULATION_KEY }) > 0
  const busy =
    savingSurface ||
    runningSimulation ||
    [createProfile, createSite, createPreSurvey, updatePreSurvey, saveSurfaceMutation, submitPreSurvey].some(
      (m) => m.isPending,
    )

  function setSaved(next: AssessmentDraft) {
    setSavedState(next)
    writeDraft(account, next)
  }

  // Mở lại bản nháp đã lưu, mỗi id chỉ nạp vào form một lần
  // 403, 404 hoặc đã gửi thì bỏ bản nháp, lỗi khác thì cho thử lại
  const [hydratedFor, setHydratedFor] = useState<string | null>(null)
  /** Id bản nháp có mặt lắp đang giữ trên máy */
  const restoreLocal = useRef(workSurface?.preSurveyId ?? null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [resumeAttempt, setResumeAttempt] = useState(0)
  useEffect(() => {
    const id = saved.preSurveyId
    if (!id || hydratedFor === id) return
    let cancelled = false
    const dropDraft = (message: string) => {
      clearDraft(account)
      clearWork(account)
      setSavedState({ profile: saved.profile })
      setHydratedFor(null)
      moveRef.current(readFlag(flagKey) ? SITE : 0, { replace: true })
      toast(message)
    }
    queryClient.fetchQuery({ queryKey: preSurveyKeys.surface(id), queryFn: () => getSurface(id) }).then(
      (view) => {
        if (cancelled) return
        if (view.status !== 'DRAFT') return dropDraft('Bản đánh giá trước đã được gửi. Bắt đầu một bản mới.')
        setHydratedFor(id)
        setResumeError(null)
        if (restoreLocal.current === id) {
          // Server đã đổi revision so với bản trên máy thì báo xung đột
          restoreLocal.current = null
          if (workSurface?.baseRevision != null && workSurface.baseRevision !== view.revision) setConflict(true)
        } else {
          setBaseRevision(view.revision)
          if (view.surfaceDefined) setSurface(surfaceToForm(view))
          else
            // Chưa lưu mặt lắp: vẫn nạp lại độ dốc, hướng đã gửi lúc tạo bản nháp
            setSurface((f) => ({
              ...f,
              tiltDegree: view.surfaceTiltDegree == null ? f.tiltDegree : meterText(view.surfaceTiltDegree),
              azimuthDegree: view.surfaceAzimuthDegree == null ? f.azimuthDegree : String(view.surfaceAzimuthDegree),
            }))
        }
        setViewId(view.selectedSimulationId)
        // Mặt lắp đã lưu thì đi thẳng tới bước mô phỏng
        if (!explicitStep && view.surfaceDefined) moveRef.current(SIMULATION, { replace: true })
      },
      (error: unknown) => {
        if (cancelled) return
        if (isApiError(error) && [403, 404].includes(error.status))
          dropDraft('Không mở được bản nháp trước. Bắt đầu một bản đánh giá mới.')
        else setResumeError(errorMessage(error))
      },
    )
    return () => {
      cancelled = true
    }
  }, [
    account,
    explicitStep,
    flagKey,
    hydratedFor,
    queryClient,
    resumeAttempt,
    saved.preSurveyId,
    saved.profile,
    workSurface,
  ])

  usePageCrumb(STEP_LABELS[step])

  function editor<F>(setter: (fn: (f: F) => F) => void) {
    return (patch: Partial<F>) => {
      setter((f) => ({ ...f, ...patch }))
      clearErrors(Object.keys(patch))
    }
  }

  /** Hết lỗi thì tắt câu nhắc chung (lỗi từ server thì giữ) */
  function clearErrors(keys: string[]) {
    const next = { ...errors }
    for (const key of keys) delete next[key]
    setErrors(next)
    if (Object.keys(next).length === 0) setFormError((f) => (f === FIX_FIELDS ? null : f))
  }

  function goTo(target: number) {
    setErrors({})
    setFormError(null)
    setConflict(false)
    moveTo(target)
  }

  // Khách chuyển bước: cuộn lên đầu trang và focus tiêu đề của bước
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const shownStep = useRef(step)
  useEffect(() => {
    if (shownStep.current === step) return
    shownStep.current = step
    const silent = silentMove.current
    silentMove.current = false
    if (silent) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    stepHeadingRef.current?.focus({ preventScroll: true })
  }, [step])

  function showErrors(found: Record<string, string | undefined>) {
    setErrors(Object.fromEntries(Object.entries(found).filter((e): e is [string, string] => Boolean(e[1]))))
    setFormError(FIX_FIELDS)
  }

  /** Lỗi server: gắn vào ô nếu được, còn lại hiện ở thanh dưới */
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
    if (result.errors) return showErrors(result.errors as FormErrors<ProfileForm>)
    try {
      await createProfile.mutateAsync(result.data)
      setSaved({ ...saved, profile: result.data })
    } catch (error) {
      if (!isApiError(error) || error.code !== 'CUSTOMER_ALREADY_EXISTS') return fail(error, profile)
      toast('Tài khoản đã có hồ sơ khách hàng, hệ thống dùng hồ sơ hiện có.')
    }
    markProfileDone()
    goTo(SITE)
  }

  async function saveSite() {
    // Không sửa gì thì đi tiếp, không validate lại vì địa điểm cũ có thể chưa có phường theo danh sách mới
    // Trừ khi thiếu toạ độ, vì cần toạ độ để đặt lịch khảo sát
    if (
      saved.siteId &&
      saved.site &&
      same(site, siteToForm(saved.site)) &&
      hasCoordinates(saved.site.latitude, saved.site.longitude)
    )
      return goTo(SURFACE)
    const result = check(siteSchema, site)
    const wardNames = wards.data?.map((w) => w.name)
    // Không tải được danh sách phường thì cho gõ tay
    const wardIssue =
      wardNames && site.ward.trim() && !wardNames.includes(site.ward.trim())
        ? 'Chọn phường, xã trong danh sách.'
        : undefined
    if (result.errors || wardIssue) return showErrors({ ...result.errors, ...(wardIssue ? { ward: wardIssue } : {}) })
    if (saved.siteId && same(saved.site, result.data)) return goTo(SURFACE)
    try {
      const { propertySiteId } = await createSite.mutateAsync(result.data)
      // Địa điểm mới thì bản nháp mới, mặt lắp trong form vẫn giữ
      setSaved({ profile: saved.profile, site: result.data, siteId: propertySiteId })
      setHydratedFor(null)
      setBaseRevision(null)
      setViewId(null)
      goTo(SURFACE)
    } catch (error) {
      if (isApiError(error) && error.code === 'CUSTOMER_PROFILE_NOT_FOUND') {
        // Cờ hồ sơ trong localStorage bị sai: quay lại bước hồ sơ
        writeFlag(flagKey, false)
        setProfileDone(false)
        moveTo(0, { replace: true })
      }
      fail(error, site)
    }
  }

  /** Bỏ qua cache để lấy revision mới nhất */
  function fetchSurface(id: string) {
    return queryClient.fetchQuery({ queryKey: preSurveyKeys.surface(id), queryFn: () => getSurface(id), staleTime: 0 })
  }

  // Lưu mặt lắp: tạo bản nháp nếu chưa có, PUT surface, PUT số liệu khai, rồi đọc lại revision
  // overwrite: khách chọn lưu đè sau khi bị 409
  async function saveSurface({ overwrite = false } = {}) {
    const found = validateSurface(surface)
    if (Object.keys(found).length > 0) {
      showErrors(found)
      return false
    }
    if (!saved.siteId) {
      goTo(SITE)
      return false
    }
    setSavingSurface(true)
    setConflict(false)
    try {
      let id = saved.preSurveyId
      let server = id ? loaded : undefined
      let revision = baseRevision
      if (!id) {
        id = (await createPreSurvey.mutateAsync({ propertySiteId: saved.siteId, ...toDeclaredRequest(surface) }))
          .preSurveyId
        setHydratedFor(id)
        setSaved({ ...saved, preSurveyId: id })
        server = await fetchSurface(id)
        revision = server.revision
      } else if (overwrite || !server || revision === null) {
        server = await fetchSurface(id)
        revision = server.revision
      }
      const body = toSurfaceRequest(surface, revision!)
      if (surfaceDiffers(server!, body)) {
        const written = await saveSurfaceMutation.mutateAsync({ id, body })
        // Cập nhật revision ngay, để lỗi ở bước sau không gây xung đột giả
        setBaseRevision(written.revision)
        server = {
          ...server!,
          surfaceTiltDegree: body.surfaceTiltDegree ?? null,
          surfaceAzimuthDegree: body.surfaceAzimuthDegree ?? null,
        }
      }
      const declared = toDeclaredRequest(surface)
      if (declaredDiffers(server!, declared)) await updatePreSurvey.mutateAsync({ id, body: declared })
      const fresh = await fetchSurface(id)
      setBaseRevision(fresh.revision)
      setErrors({})
      setFormError(null)
      return true
    } catch (error) {
      if (isApiError(error) && error.code === 'PRE_SURVEY_CONCURRENTLY_MODIFIED') {
        // Đã có khối báo xung đột riêng
        setConflict(true)
      } else if (
        isApiError(error) &&
        (error.code === 'PRE_SURVEY_NOT_EDITABLE' || error.code === 'PRE_SURVEY_ALREADY_SUBMITTED')
      ) {
        restartDraft()
      } else if (isApiError(error) && error.code === 'PRESURVEY_VALIDATION_FAILED') {
        const mapped = serverSurfaceErrors(error.fieldErrors)
        if (mapped.totalAreaM2 || mapped.usableAreaM2) {
          // Diện tích tự tính bị từ chối: chuyển sang tự khai để khách sửa
          const auto = autoDeclared(surface)
          setSurface((f) => ({
            ...f,
            declaredManual: true,
            totalAreaM2: f.totalAreaM2 || (auto ? meterText(auto.totalAreaM2) : ''),
            usableAreaM2: f.usableAreaM2 || (auto ? meterText(auto.usableAreaM2) : ''),
          }))
        }
        setErrors(mapped)
        setFormError(error.message)
      } else fail(error)
      return false
    } finally {
      setSavingSurface(false)
    }
  }

  /** Bản nháp đã gửi ở tab khác: bỏ id, lần lưu sau sẽ tạo bản nháp mới */
  function restartDraft() {
    setSaved({ profile: saved.profile, site: saved.site, siteId: saved.siteId })
    setHydratedFor(null)
    setBaseRevision(null)
    setViewId(null)
    setConflict(false)
    goTo(SURFACE)
    toast('Bản đánh giá này đã được gửi ở nơi khác. Lưu mặt lắp để tạo bản đánh giá mới cho địa điểm này.')
  }

  /** Bỏ thay đổi, nạp lại mặt lắp từ server */
  async function reloadSurface() {
    if (!saved.preSurveyId) return
    try {
      const fresh = await fetchSurface(saved.preSurveyId)
      setSurface(fresh.surfaceDefined ? surfaceToForm(fresh) : EMPTY_SURFACE_FORM)
      setBaseRevision(fresh.revision)
      setConflict(false)
      setErrors({})
      setFormError(null)
      toast('Đã tải bản mặt lắp mới nhất.')
    } catch (error) {
      fail(error)
    }
  }

  async function saveDraft() {
    if (await saveSurface()) toast.success('Đã lưu mặt lắp.')
  }

  async function submit() {
    if (!saved.preSurveyId) return goTo(SURFACE)
    // Thiếu toạ độ thì không đặt được lịch, bắt nhập trước khi gửi
    if (saved.site && !hasCoordinates(saved.site.latitude, saved.site.longitude)) {
      goTo(SITE)
      return showErrors({ latitude: 'Nhập toạ độ công trình để đặt được lịch khảo sát.' })
    }
    try {
      const { surveyRequestId } = await submitPreSurvey.mutateAsync(saved.preSurveyId)
      clearDraft(account)
      clearWork(account)
      setRequestId(surveyRequestId)
      dialogRef.current?.showModal()
    } catch (error) {
      // Lần gửi trước đã thành công nhưng mất phản hồi: coi như xong
      if (isApiError(error) && error.code === 'PRE_SURVEY_ALREADY_SUBMITTED') {
        clearDraft(account)
        clearWork(account)
        setRequestId('')
        dialogRef.current?.showModal()
        return
      }
      if (isApiError(error) && error.code === 'PRE_SURVEY_INCOMPLETE') moveTo(SURFACE, { replace: true })
      fail(error)
    }
  }

  async function next(e?: FormEvent) {
    e?.preventDefault()
    if (busy) return
    setFormError(null)
    if (step === 0) return saveProfile()
    if (step === SITE) return saveSite()
    if (step === SURFACE) {
      if (await saveSurface()) goTo(SIMULATION)
      return
    }
    if (step === SIMULATION) return goTo(REVIEW)
    return submit()
  }

  function startOver() {
    dialogRef.current?.close()
    setSite(EMPTY_SITE)
    setSurface(EMPTY_SURFACE_FORM)
    setSimForm(EMPTY_SIMULATION_FORM)
    setSavedState({ profile: saved.profile })
    setHydratedFor(null)
    setBaseRevision(null)
    setViewId(null)
    setRequestId(null)
    goTo(SITE)
  }

  const submitted = requestId !== null
  const waitingDraft = Boolean(saved.preSurveyId) && hydratedFor !== saved.preSurveyId
  // Lưu form vào localStorage, đợi nạp bản nháp xong để không ghi đè bằng form rỗng
  useEffect(() => {
    if (waitingDraft || submitted) return
    writeWork(account, { step, profile, site, surface, simForm, preSurveyId: saved.preSurveyId, baseRevision })
  }, [account, baseRevision, profile, saved.preSurveyId, simForm, site, step, submitted, surface, waitingDraft])
  // Mặt lắp có thay đổi chưa lưu: nhắc ở bước mô phỏng và xem lại
  const surfaceUnsaved = surfaceChanged(surface, loaded)
  const selectedRun = simulations.data?.find((s) => s.isSelected) ?? null
  const stepSummaries: (string | undefined)[] = [
    saved.profile
      ? [customerTypeLabel(saved.profile.customerType), saved.profile.companyName].filter(Boolean).join(', ')
      : 'Đã có hồ sơ',
    saved.site ? [saved.site.name, saved.site.ward].filter(Boolean).join(', ') : undefined,
    loaded?.surfaceDefined
      ? `${formatTwo(loaded.surfaceWidthM)} × ${formatTwo(loaded.surfaceLengthM)} m, ${loaded.obstacles.length > 0 ? `${loaded.obstacles.length} vật cản` : 'không có vật cản'}`
      : undefined,
    selectedRun
      ? `${selectedRun.panelCount} tấm, ${formatOne(selectedRun.installedCapacityKwp)} kWp`
      : 'Chưa chạy mô phỏng',
    undefined,
  ]
  const steps: WizardStep[] = STEP_LABELS.map((label, i) => {
    const state = i < step || (i === 0 && profileDone) ? 'done' : i === step ? 'active' : 'upcoming'
    return {
      label,
      state,
      summary: state === 'done' ? stepSummaries[i] : undefined,
      // Hồ sơ không sửa được nên không cho bấm
      onSelect: state === 'done' && i >= firstStep && !busy && !submitted ? () => goTo(i) : undefined,
    }
  })
  // Bước mặt lắp và mô phỏng dùng hết chiều ngang
  const wide = step === SURFACE || (step === SIMULATION && Boolean(saved.preSurveyId && loaded?.surfaceDefined))
  const aside = (
    <>
      {step === SIMULATION && simulations.data && simulations.data.length > 0 && (
        <Panel>
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                Các lần chạy <Count value={simulations.data.length} />
              </span>
            }
          />
          <PanelBody>
            <SimulationHistory
              items={simulations.data}
              viewingId={viewId ?? loaded?.selectedSimulationId ?? null}
              onView={setViewId}
            />
          </PanelBody>
        </Panel>
      )}
      <Notice tone="info" title="Sau khi gửi">
        Bạn chọn ngày giờ khảo sát trong 30 ngày tới. Bộ phận kinh doanh phân công kỹ thuật viên tới công trình để kiểm
        tra lại các số đo bạn khai.
      </Notice>
      {saved.preSurveyId && !submitted && (
        <Notice tone="ok">
          Bản nháp <span className="tnum font-medium text-fg">{shortCode(saved.preSurveyId)}</span> đã lưu trên hệ
          thống. Phần đang nhập dở được giữ trên máy này, rời trang hay tải lại vẫn còn.
        </Notice>
      )}
    </>
  )

  if (waitingDraft) {
    return resumeError ? (
      <ErrorState
        title="Không mở được bản nháp đang làm."
        message={resumeError}
        onRetry={() => {
          setResumeError(null)
          setResumeAttempt((n) => n + 1)
        }}
      />
    ) : (
      <PageSkeleton />
    )
  }

  return (
    <>
      <PageHeader title="Đánh giá sơ bộ" description={STEP_HINTS[step]} />

      <WizardSteps steps={steps} label="Các bước đánh giá sơ bộ" className="mb-8" />
      <h2 ref={stepHeadingRef} tabIndex={-1} className="sr-only">
        Bước {step + 1}/{STEP_LABELS.length}: {STEP_LABELS[step]}
      </h2>

      <div className={cx('grid gap-6', !wide && 'lg:grid-cols-3')}>
        <form
          id="assessment-step"
          noValidate
          onSubmit={next}
          className={cx('min-w-0 space-y-4', !wide && 'lg:col-span-2')}
        >
          {(step === SIMULATION || step === REVIEW) && loaded?.surfaceDefined && surfaceUnsaved && (
            <Notice tone="warn" title="Mặt lắp có thay đổi chưa lưu">
              Mô phỏng và phần xem lại đang dùng mặt lắp đã lưu trước đó. Thay đổi vẫn được giữ trên máy này.{' '}
              <button type="button" className="tap ui-link font-medium" onClick={() => goTo(SURFACE)}>
                Về bước mặt lắp để lưu
              </button>
            </Notice>
          )}
          {step === 0 && (
            <Panel>
              <PanelHeader title="Thông tin khách hàng" description="Khai một lần cho tài khoản này." />
              <PanelBody>
                <ProfileFields value={profile} errors={errors} onChange={editor(setProfile)} />
              </PanelBody>
            </Panel>
          )}

          {step === SITE && saved.preSurveyId && (
            <Notice tone="warn">
              Bản đánh giá đang làm gắn với địa điểm này. Đổi thông tin địa điểm sẽ tạo địa điểm và bản đánh giá mới:
              mặt lắp giữ nguyên, các lần mô phỏng phải chạy lại.
            </Notice>
          )}
          {step === SITE && (
            <Panel>
              <PanelHeader title="Địa điểm lắp đặt" />
              <PanelBody>
                <SiteFields value={site} errors={errors} onChange={editor(setSite)} />
              </PanelBody>
            </Panel>
          )}

          {step === SURFACE && (
            <>
              {conflict && (
                <Notice tone="danger" title="Mặt lắp vừa được sửa ở nơi khác">
                  Có thể bạn đang mở bản đánh giá này ở một tab khác. Tải bản mới nhất để xem trước khi lưu, hoặc lưu đè
                  bằng bản đang sửa ở đây.
                  <span className="mt-3 flex flex-wrap gap-3">
                    <Button size="sm" icon="refresh" onClick={reloadSurface} disabled={busy}>
                      Tải bản mới nhất
                    </Button>
                    <Button
                      size="sm"
                      variant="warn"
                      onClick={() => void saveSurface({ overwrite: true })}
                      disabled={busy}
                    >
                      Lưu đè bằng bản đang sửa
                    </Button>
                  </span>
                </Notice>
              )}
              <SurfaceEditor
                value={surface}
                errors={errors as SurfaceErrors}
                onChange={(nextForm, touched) => {
                  setSurface(nextForm)
                  clearErrors(touched)
                }}
                aside={aside}
              />
            </>
          )}

          {step === SIMULATION && !loaded?.surfaceDefined && (
            <EmptyState
              title="Chưa lưu mặt lắp"
              description="Mô phỏng xếp tấm trên mặt lắp đã lưu. Nhập kích thước mặt lắp trước."
              action={<Button onClick={() => goTo(SURFACE)}>Về bước mặt lắp</Button>}
            />
          )}
          {step === SIMULATION && saved.preSurveyId && loaded?.surfaceDefined && (
            <SimulationWorkspace
              preSurveyId={saved.preSurveyId}
              surface={loaded}
              form={simForm}
              onFormChange={setSimForm}
              viewId={viewId ?? loaded.selectedSimulationId}
              onView={setViewId}
              onEditSurface={() => goTo(SURFACE)}
              onEditSite={() => goTo(SITE)}
              onDraftClosed={restartDraft}
              aside={aside}
            />
          )}

          {step === REVIEW && (
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
                    <Button size="sm" variant="soft" icon="edit" disabled={submitted} onClick={() => goTo(SITE)}>
                      Sửa
                    </Button>
                  }
                />
                <PanelBody>
                  {saved.site ? (
                    // Địa chỉ dài nên để 1 cột
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
                  ) : (
                    <p className="text-body text-fg-2">Địa điểm đã lưu cùng bản nháp.</p>
                  )}
                </PanelBody>
              </Panel>
              {loaded && (
                <Panel>
                  <PanelHeader
                    title="Mặt lắp"
                    action={
                      <Button size="sm" variant="soft" icon="edit" disabled={submitted} onClick={() => goTo(SURFACE)}>
                        Sửa
                      </Button>
                    }
                  />
                  <PanelBody>
                    <KeyValueList
                      columns={2}
                      items={[
                        {
                          k: 'Kích thước',
                          v: `${formatTwo(loaded.surfaceWidthM)} × ${formatTwo(loaded.surfaceLengthM)} m`,
                        },
                        {
                          k: 'Độ dốc, hướng',
                          v: `${formatTwo(loaded.surfaceTiltDegree)}°, ${directionLabel(loaded.surfaceAzimuthDegree)}`,
                        },
                        {
                          k: 'Vật cản',
                          v: loaded.obstacles.length > 0 ? loaded.obstacles.map((o) => o.name).join(', ') : 'Không',
                        },
                        { k: 'Tổng diện tích khai', v: formatM2(loaded.declared.totalAreaM2) },
                        { k: 'Dùng được', v: formatM2(loaded.declared.usableAreaM2) },
                      ]}
                    />
                  </PanelBody>
                </Panel>
              )}
              <Panel>
                <PanelHeader
                  title="Mô phỏng chính"
                  action={
                    <Button size="sm" disabled={submitted} onClick={() => goTo(SIMULATION)}>
                      {selectedRun ? 'Xem' : 'Chạy mô phỏng'}
                    </Button>
                  }
                />
                <PanelBody className="space-y-3">
                  {selectedRun ? (
                    <>
                      <KeyValueList
                        columns={2}
                        items={[
                          { k: 'Tấm pin', v: selectedRun.productName },
                          { k: 'Kiểu lắp', v: mountingLabel(selectedRun.mountingType) },
                          { k: 'Số tấm', v: `${selectedRun.panelCount} tấm` },
                          { k: 'Công suất', v: `${formatOne(selectedRun.installedCapacityKwp)} kWp` },
                          {
                            k: 'Sản lượng năm',
                            v:
                              selectedRun.annualEnergyKwh == null
                                ? 'Chưa có dữ liệu'
                                : `${formatKwh(selectedRun.annualEnergyKwh)} kWh`,
                          },
                        ]}
                      />
                      {selectedRun.isStale && (
                        <Notice tone="warn">
                          Mô phỏng này tính theo mặt lắp cũ. Chạy lại để chuyên viên thấy kết quả theo mặt lắp mới.
                        </Notice>
                      )}
                    </>
                  ) : (
                    <Notice tone="warn">
                      Chưa chạy mô phỏng. Vẫn gửi được, nhưng chạy trước giúp chuyên viên thấy số tấm và sản lượng dự
                      kiến khi gọi bạn.
                    </Notice>
                  )}
                </PanelBody>
              </Panel>
            </>
          )}
        </form>

        {!wide && <div className="min-w-0 space-y-4 self-start">{aside}</div>}
      </div>

      <ActionBar>
        <Button onClick={() => goTo(Math.max(firstStep, step - 1))} disabled={step <= firstStep || busy || submitted}>
          Quay lại
        </Button>
        {step === SURFACE && (
          <Button variant="ghost" icon="save" onClick={saveDraft} disabled={busy}>
            Lưu nháp
          </Button>
        )}
        {step === SURFACE && surfaceUnsaved && !busy && (
          <span className="text-meta text-fg-2">Chưa lưu lên hệ thống, vẫn giữ trên máy này</span>
        )}
        <div className="flex w-full flex-wrap items-center gap-3 sm:ml-auto sm:w-auto">
          {formError && (
            <span className="flex items-center gap-1.5 text-body font-medium text-danger" role="alert">
              <Icon name="error" className="shrink-0 text-[20px]" />
              {formError}
            </span>
          )}
          <Button
            type="submit"
            form="assessment-step"
            variant="primary"
            className="w-full sm:w-auto"
            disabled={busy || submitted || (step === SIMULATION && !loaded?.surfaceDefined)}
          >
            {runningSimulation
              ? 'Đang chạy mô phỏng…'
              : busy
                ? 'Đang lưu…'
                : step === REVIEW
                  ? 'Gửi yêu cầu khảo sát'
                  : `Tiếp tục: ${STEP_LABELS[step + 1]}`}
          </Button>
        </div>
      </ActionBar>

      <Dialog ref={dialogRef} className="max-w-lg">
        <DialogTitle>Đã gửi yêu cầu khảo sát</DialogTitle>
        <p className="mt-2 text-body text-fg-2">
          Bước cuối: chọn ngày giờ để kỹ thuật viên tới khảo sát {saved.site?.name ?? 'địa điểm của bạn'}. Bạn cũng có
          thể chọn sau ở mục Yêu cầu khảo sát.
        </p>
        {requestId && (
          <KeyValueList
            className="mt-4 border-t border-line pt-4"
            items={[{ k: 'Mã yêu cầu', v: <span className="tnum">{shortCode(requestId)}</span> }]}
          />
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={startOver}>
            Đánh giá địa điểm khác
          </Button>
          {/* Không có mã yêu cầu thì mở danh sách yêu cầu */}
          <Button
            variant="primary"
            onClick={() => navigate(requestId ? withId(ROUTES.customer.request, requestId) : ROUTES.customer.requests)}
          >
            Chọn giờ khảo sát
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}
