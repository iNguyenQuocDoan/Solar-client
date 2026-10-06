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

export function usePendingSurveyRequestsQuery() {
  return useQuery<PendingSurveyRequestItem[], ApiError>({
    queryKey: surveyRequestKeys.pending(),
    queryFn: surveyRequestService.listPendingSurveyRequests,
  })
}

export function useMySurveyRequestsQuery() {
  return useQuery<MySurveyRequestItem[], ApiError>({
    queryKey: surveyRequestKeys.my(),
    queryFn: surveyRequestService.listMySurveyRequests,
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
