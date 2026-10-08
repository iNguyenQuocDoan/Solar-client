import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as surveyRequestService from '@/features/pre-surveys/services/surveyRequestService'
import type {
  ClaimSurveyRequestResponse,
  MySurveyRequestItem,
  PendingSurveyRequestItem,
  SurveyRequestDetail,
} from '@/types/res/surveyRequestsRes'
import type { ApiError } from '@/services/api/errors'

/*
 * Query + mutation cho yêu cầu khảo sát của sales. Nhận yêu cầu (hoặc bị người khác nhận trước)
 * đều làm mới cả hai danh sách, vì yêu cầu rời "Chờ nhận" và vào "Của tôi" cùng lúc.
 */

export const surveyRequestKeys = {
  all: ['survey-requests'] as const,
  pending: () => [...surveyRequestKeys.all, 'pending'] as const,
  my: () => [...surveyRequestKeys.all, 'my'] as const,
  detail: (id: string) => [...surveyRequestKeys.all, 'detail', id] as const,
}

/** Hàng chờ tự làm mới mỗi phút (số đếm trên menu và danh sách cùng dùng một cache). */
const QUEUE_REFRESH_MS = 60_000

/**
 * `enabled`: layout dùng để chỉ gọi khi đã chắc là sales. Layout còn được vẽ làm khung chờ (hydrateFallbackElement)
 * TRƯỚC RequireRole và trước khi phiên được khôi phục, lúc đó gọi API sẽ không có token.
 */
type QueueOptions = { enabled?: boolean }

export function usePendingSurveyRequestsQuery({ enabled = true }: QueueOptions = {}) {
  return useQuery<PendingSurveyRequestItem[], ApiError>({
    queryKey: surveyRequestKeys.pending(),
    queryFn: surveyRequestService.listPendingSurveyRequests,
    refetchInterval: QUEUE_REFRESH_MS,
    enabled,
  })
}

export function useMySurveyRequestsQuery({ enabled = true }: QueueOptions = {}) {
  return useQuery<MySurveyRequestItem[], ApiError>({
    queryKey: surveyRequestKeys.my(),
    queryFn: surveyRequestService.listMySurveyRequests,
    refetchInterval: QUEUE_REFRESH_MS,
    enabled,
  })
}

export function useSurveyRequestQuery(id: string | undefined) {
  return useQuery<SurveyRequestDetail, ApiError>({
    queryKey: surveyRequestKeys.detail(id ?? ''),
    queryFn: () => surveyRequestService.getSurveyRequest(id!),
    enabled: Boolean(id),
  })
}

export function useClaimSurveyRequestMutation() {
  const queryClient = useQueryClient()
  return useMutation<ClaimSurveyRequestResponse, ApiError, string>({
    mutationFn: (id) => surveyRequestService.claimSurveyRequest(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: surveyRequestKeys.all }),
  })
}
