import type { ReactNode } from 'react'
import { Badge } from '@/components/common/ui/badge'
import { Button, ButtonLink } from '@/components/common/ui/button'
import { ListRow, ListRowActions } from '@/components/common/ui/list-row'
import { Facts } from '@/features/pre-surveys/components/Facts'
import {
  formatArea,
  formatDateTime,
  formatRelative,
  isOverdue,
  surfaceTypeLabel,
  surveyStatusMeta,
} from '@/features/pre-surveys/components/preSurveyDisplay'
import { ROUTES, withId } from '@/routes/paths'
import type { MySurveyRequestItem, PendingSurveyRequestItem, SurveyRequestStatus } from '@/types/res/surveyRequestsRes'

/*
  Hàng chờ yêu cầu khảo sát của sales, dạng danh sách thay vì bảng: mỗi yêu cầu là một khối đọc được
  một lượt (công trình, khu vực, vài con số), thao tác nằm ngay dưới. Yêu cầu chờ quá một ngày có vạch
  cảnh báo ở lề kèm chữ, không chỉ dựa vào màu.
*/

function RequestHeading({ name, aside }: { name: string | null; aside: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
      <h3 className="text-title font-semibold">{name || 'Công trình chưa đặt tên'}</h3>
      <div className="text-meta text-fg-3">{aside}</div>
    </div>
  )
}

function Area({ district, province }: { district: string | null; province: string | null }) {
  const text = [district, province].filter(Boolean).join(', ')
  return text ? <p className="mt-1 text-body text-fg-2">{text}</p> : null
}

/* Giờ tương đối dễ đọc hơn; giờ chính xác nằm trong title khi rê chuột. */
function When({ iso, prefix }: { iso: string; prefix?: string }) {
  return (
    <time dateTime={iso} title={formatDateTime(iso)}>
      {prefix ? `${prefix} ` : ''}
      {formatRelative(iso)}
    </time>
  )
}

/** Chờ lâu nhất lên đầu: hàng chờ phục vụ theo thứ tự đến. */
function oldestFirst(a: PendingSurveyRequestItem, b: PendingSurveyRequestItem) {
  return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
}

export function PendingRequestList({
  rows,
  claimingId,
  onClaim,
}: {
  rows: PendingSurveyRequestItem[]
  claimingId: string | null
  onClaim: (row: PendingSurveyRequestItem) => void
}) {
  return (
    <ul className="divide-y divide-line">
      {[...rows].sort(oldestFirst).map((r) => {
        const overdue = isOverdue(r.submittedAt)
        return (
          <ListRow key={r.surveyRequestId} tone={overdue ? 'warn' : undefined}>
            <RequestHeading
              name={r.propertyName}
              aside={
                <>
                  <When iso={r.submittedAt} prefix="Gửi" />
                  {overdue && <span className="font-medium text-warn">, chờ hơn 1 ngày</span>}
                </>
              }
            />
            <Area district={r.district} province={r.province} />
            <Facts
              className="mt-3"
              items={[
                { k: 'Khách hàng', v: r.customerName || '—' },
                { k: 'Bề mặt', v: surfaceTypeLabel(r.installationSurfaceType) },
                { k: 'Dùng được / tổng', v: `${formatArea(r.usableAreaM2)} / ${formatArea(r.totalAreaM2)}` },
              ]}
            />
            <ListRowActions>
              <Button size="sm" disabled={claimingId !== null} onClick={() => onClaim(r)}>
                {claimingId === r.surveyRequestId ? 'Đang nhận…' : 'Nhận yêu cầu'}
              </Button>
            </ListRowActions>
          </ListRow>
        )
      })}
    </ul>
  )
}

/* Việc cần làm trước: đã nhận / đang xem xét → đã hẹn → còn lại; cùng nhóm thì mới nhận lên trước. */
const STATUS_ORDER: Record<SurveyRequestStatus, number> = { 2: 0, 3: 1, 4: 2, 1: 3, 5: 4, 6: 5 }

function byNextAction(a: MySurveyRequestItem, b: MySurveyRequestItem) {
  const rank = (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
  if (rank !== 0) return rank
  return new Date(b.assignedAt ?? 0).getTime() - new Date(a.assignedAt ?? 0).getTime()
}

/** Gợi ý bước tiếp theo theo trạng thái; trạng thái đã xong thì không cần gợi ý. */
function nextStep(r: MySurveyRequestItem) {
  if (r.status === 2 || r.status === 3) return 'Gọi khách để hẹn ngày khảo sát.'
  if (r.status === 4 && r.scheduledAt) return `Khảo sát lúc ${formatDateTime(r.scheduledAt)}.`
  return null
}

export function MyRequestList({ rows }: { rows: MySurveyRequestItem[] }) {
  return (
    <ul className="divide-y divide-line">
      {[...rows].sort(byNextAction).map((r) => {
        const status = surveyStatusMeta(r.status)
        const hint = nextStep(r)
        return (
          <ListRow key={r.surveyRequestId}>
            <RequestHeading name={r.propertyName} aside={<Badge tone={status.tone}>{status.label}</Badge>} />
            <Area district={r.district} province={r.province} />
            <Facts
              className="mt-3"
              items={[
                { k: 'Khách hàng', v: r.customerName || '—' },
                { k: 'Bạn nhận', v: r.assignedAt ? <When iso={r.assignedAt} /> : '—' },
                { k: 'Hẹn khảo sát', v: r.scheduledAt ? formatDateTime(r.scheduledAt) : 'Chưa hẹn' },
              ]}
            />
            <ListRowActions>
              <ButtonLink to={withId(ROUTES.ops.survey, r.surveyRequestId)} size="sm">
                Mở yêu cầu
              </ButtonLink>
              {hint && <span className="text-body text-fg-2">{hint}</span>}
            </ListRowActions>
          </ListRow>
        )
      })}
    </ul>
  )
}
