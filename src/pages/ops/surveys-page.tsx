import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/common/ui/button'
import { FilterChips } from '@/components/common/ui/chips'
import { PageHeader } from '@/components/common/ui/page-header'
import { QueryBoundary } from '@/components/common/ui/query-boundary'
import { EmptyState } from '@/components/common/ui/states'
import { MyRequestList, PendingRequestList } from '@/features/pre-surveys/components/SurveyRequestLists'
import {
  useClaimSurveyRequestMutation,
  useMySurveyRequestsQuery,
  usePendingSurveyRequestsQuery,
} from '@/features/pre-surveys/hooks/useSurveyRequests'
import { ROUTES, withId } from '@/routes/paths'
import { errorMessage } from '@/services/api/errors'
import type { PendingSurveyRequestItem } from '@/types/res/surveyRequestsRes'

type Tab = 'pending' | 'my'

/* Yêu cầu khảo sát sinh ra khi khách hàng gửi bản đánh giá sơ bộ. Sales nhận yêu cầu rồi xem chi tiết để liên hệ. */
export function OpsSurveysPage() {
  const [tab, setTab] = useState<Tab>('pending')
  const pending = usePendingSurveyRequestsQuery()
  const my = useMySurveyRequestsQuery()
  const claim = useClaimSurveyRequestMutation()
  const navigate = useNavigate()

  async function onClaim(row: PendingSurveyRequestItem) {
    try {
      await claim.mutateAsync(row.surveyRequestId)
      toast.success(`Đã nhận yêu cầu của ${row.customerName || 'khách hàng'}.`)
      navigate(withId(ROUTES.ops.survey, row.surveyRequestId))
    } catch (error) {
      // Người khác nhận trước: hook đã làm mới danh sách, dòng đó sẽ biến mất.
      toast.error(errorMessage(error))
    }
  }

  return (
    <>
      <PageHeader title="Yêu cầu khảo sát" />

      <FilterChips
        label="Danh sách yêu cầu"
        className="mb-4"
        value={tab}
        onChange={setTab}
        chips={[
          { value: 'pending', label: 'Chờ nhận', count: pending.data?.length },
          { value: 'my', label: 'Của tôi', count: my.data?.length },
        ]}
      />

      {tab === 'pending' ? (
        <QueryBoundary query={pending}>
          {(rows) =>
            rows.length === 0 ? (
              <EmptyState title="Chưa có yêu cầu nào chờ nhận" description="Yêu cầu mới xuất hiện ở đây khi khách hàng gửi bản đánh giá sơ bộ." />
            ) : (
              <PendingRequestList rows={rows} claimingId={claim.isPending ? (claim.variables ?? null) : null} onClaim={onClaim} />
            )
          }
        </QueryBoundary>
      ) : (
        <QueryBoundary query={my}>
          {(rows) =>
            rows.length === 0 ? (
              <EmptyState
                title="Bạn chưa nhận yêu cầu nào"
                action={
                  <Button size="sm" onClick={() => setTab('pending')}>
                    Xem yêu cầu chờ nhận
                  </Button>
                }
              />
            ) : (
              <MyRequestList rows={rows} />
            )
          }
        </QueryBoundary>
      )}
    </>
  )
}
