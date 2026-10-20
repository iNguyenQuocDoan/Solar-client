import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Icon } from '@/components/common/stitch-ui/Icon'
import { Button } from '@/components/common/ui/button'
import { DialogFooter, DialogTitle, ModalDialog } from '@/components/common/ui/dialog'
import { DateField, Field, Input, TimeSelect } from '@/components/common/ui/field'
import { EmptyState, ErrorState, Skeleton } from '@/components/common/ui/states'
import { ConflictList } from '@/features/scheduling/components/ConflictList'
import { conflictsOf } from '@/features/scheduling/components/schedulingDisplay'
import { formatMoment } from '@/features/scheduling/components/schedulingDisplay'
import {
  useAddUnavailablePeriodMutation,
  useRemoveUnavailablePeriodMutation,
  useUnavailablePeriodsQuery,
} from '@/features/scheduling/hooks/useTechnicianAdmin'
import { errorMessage } from '@/services/api/errors'
import type { UnavailablePeriodView } from '@/types/res/adminTechniciansRes'

const REASON_MAX = 500
const MAX_DAYS = 366

/** "2026-10-20T08:00" hiểu là giờ Việt Nam. */
const toVnIso = (local: string) => `${local}:00+07:00`

/*
  Mỗi mốc là ô ngày (13/10/2026) + ô giờ 24 giờ, thay cho ô datetime-local hiện theo ngôn ngữ trình duyệt
  ("10/13/2026, 01:00 PM" ở bản tiếng Anh, 12/10/2026). Giờ mặc định 08:00 đến 17:00 là một ngày làm việc.
*/
function AddPeriodForm({ technicianUserId }: { technicianUserId: string }) {
  const [fromDate, setFromDate] = useState('')
  const [fromTime, setFromTime] = useState('08:00')
  const [toDate, setToDate] = useState('')
  const [toTime, setToTime] = useState('17:00')
  const from = fromDate ? `${fromDate}T${fromTime}` : ''
  const to = toDate ? `${toDate}T${toTime}` : ''
  const [reason, setReason] = useState('')
  const [issue, setIssue] = useState<string | null>(null)
  const [failure, setFailure] = useState<unknown>(null)
  const add = useAddUnavailablePeriodMutation()

  async function submit(e: FormEvent) {
    e.preventDefault()
    setFailure(null)
    if (!from || !to) return setIssue('Nhập đủ thời điểm bắt đầu và kết thúc.')
    const start = new Date(toVnIso(from)).getTime()
    const end = new Date(toVnIso(to)).getTime()
    if (end <= start) return setIssue('Thời điểm kết thúc phải sau lúc bắt đầu.')
    if (end - start > MAX_DAYS * 86_400_000) return setIssue('Mỗi lần nghỉ tối đa một năm.')
    setIssue(null)
    try {
      await add.mutateAsync({
        id: technicianUserId,
        body: { startsAt: toVnIso(from), endsAt: toVnIso(to), reason: reason.trim() || null },
      })
      toast.success('Đã thêm lịch nghỉ.')
      setFromDate('')
      setFromTime('08:00')
      setToDate('')
      setToTime('17:00')
      setReason('')
    } catch (error) {
      setFailure(error)
    }
  }

  const conflicts = conflictsOf(failure)
  const message = issue ?? (failure !== null && conflicts.length === 0 ? errorMessage(failure) : null)
  return (
    <form noValidate onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Từ" htmlFor="leave-from" required>
          <div className="flex gap-2">
            <DateField
              id="leave-from"
              aria-required
              className="min-w-0 flex-1"
              value={fromDate}
              onChange={setFromDate}
            />
            <TimeSelect aria-label="Giờ bắt đầu" className="w-28" value={fromTime} onChange={setFromTime} />
          </div>
        </Field>
        <Field label="Đến" htmlFor="leave-to" required>
          <div className="flex gap-2">
            <DateField
              id="leave-to"
              aria-required
              className="min-w-0 flex-1"
              min={fromDate || undefined}
              value={toDate}
              onChange={setToDate}
            />
            <TimeSelect aria-label="Giờ kết thúc" className="w-28" value={toTime} onChange={setToTime} />
          </div>
        </Field>
      </div>
      <Field label="Lý do" htmlFor="leave-reason" hint={`Không bắt buộc, tối đa ${REASON_MAX} ký tự.`}>
        <Input id="leave-reason" maxLength={REASON_MAX} value={reason} onChange={(e) => setReason(e.target.value)} />
      </Field>
      <ConflictList conflicts={conflicts} />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="soft" icon="add" disabled={add.isPending}>
          {add.isPending ? 'Đang thêm…' : 'Thêm lịch nghỉ'}
        </Button>
        {message && (
          <span className="flex items-center gap-1.5 text-body font-medium text-danger" role="alert">
            <Icon name="error" className="shrink-0 text-[20px]" />
            {message}
          </span>
        )}
      </div>
    </form>
  )
}

/*
  Lịch nghỉ (nghỉ phép, bận việc khác) của một kỹ thuật viên: trong khoảng này hệ thống không xếp lịch cho người đó. Thêm
  lịch nghỉ đè lên lịch đã có thì backend từ chối và liệt kê lịch đó (không tự huỷ). Bỏ lịch nghỉ chỉ thêm giờ trống.
  Danh sách chỉ có các khoảng chưa kết thúc.
*/
export function UnavailablePeriods({ technicianUserId }: { technicianUserId: string }) {
  const query = useUnavailablePeriodsQuery(technicianUserId)
  const remove = useRemoveUnavailablePeriodMutation()
  const [removing, setRemoving] = useState<UnavailablePeriodView | null>(null)

  async function confirmRemove() {
    if (!removing) return
    try {
      await remove.mutateAsync({ id: technicianUserId, periodId: removing.id })
      toast.success('Đã bỏ lịch nghỉ.')
      setRemoving(null)
    } catch (error) {
      toast.error(errorMessage(error))
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      <section aria-labelledby="leave-list" className="space-y-3">
        <h3 id="leave-list" className="text-body font-semibold text-fg">
          Lịch nghỉ sắp tới
        </h3>
        {query.isPending ? (
          <Skeleton className="h-20" />
        ) : query.isError ? (
          <ErrorState message={errorMessage(query.error)} onRetry={() => query.refetch()} />
        ) : query.data.length === 0 ? (
          <EmptyState title="Không có lịch nghỉ nào sắp tới" />
        ) : (
          <ul className="divide-y divide-line">
            {[...query.data]
              .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
              .map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 first:pt-0">
                  <div className="min-w-0">
                    <p className="tnum font-medium text-fg">
                      {formatMoment(p.startsAt)} – {formatMoment(p.endsAt)}
                    </p>
                    {p.reason && <p className="text-meta text-fg-2">{p.reason}</p>}
                  </div>
                  <Button size="sm" variant="danger" icon="delete" onClick={() => setRemoving(p)}>
                    Bỏ
                  </Button>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="leave-add" className="space-y-3 border-t border-line pt-6">
        <h3 id="leave-add" className="text-body font-semibold text-fg">
          Thêm lịch nghỉ
        </h3>
        <AddPeriodForm technicianUserId={technicianUserId} />
      </section>

      <ModalDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        dismissible={!remove.isPending}
        aria-label="Bỏ lịch nghỉ"
      >
        <DialogTitle>Bỏ lịch nghỉ này?</DialogTitle>
        {removing && (
          <p className="mt-2 text-body text-fg-2">
            {formatMoment(removing.startsAt)} – {formatMoment(removing.endsAt)}. Khách đặt được giờ trong khoảng này
            ngay sau khi bỏ.
          </p>
        )}
        <DialogFooter>
          <Button variant="ghost" disabled={remove.isPending} onClick={() => setRemoving(null)}>
            Giữ lại
          </Button>
          <Button variant="danger" disabled={remove.isPending} onClick={() => void confirmRemove()}>
            {remove.isPending ? 'Đang bỏ…' : 'Bỏ lịch nghỉ'}
          </Button>
        </DialogFooter>
      </ModalDialog>
    </div>
  )
}
