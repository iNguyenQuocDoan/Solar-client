import { useMutation } from '@tanstack/react-query'
import * as preSurveyService from '@/features/pre-surveys/services/preSurveyService'
import type { CreateCustomerProfileRequest, CreatePropertySiteRequest } from '@/types/req/customersReq'
import type { CreatePreSurveyRequest, UpdatePreSurveyRequest } from '@/types/req/preSurveysReq'
import type { CreateCustomerProfileResponse, CreatePropertySiteResponse } from '@/types/res/customersRes'
import type { CreatePreSurveyResponse, SubmitPreSurveyResponse } from '@/types/res/preSurveysRes'
import type { ApiError } from '@/services/api/errors'

/* Mutation phía khách hàng. Không có query nào để làm mới vì backend chưa có endpoint GET. */

export function useCreateCustomerProfileMutation() {
  return useMutation<CreateCustomerProfileResponse, ApiError, CreateCustomerProfileRequest>({
    mutationFn: (body) => preSurveyService.createCustomerProfile(body),
  })
}

export function useCreatePropertySiteMutation() {
  return useMutation<CreatePropertySiteResponse, ApiError, CreatePropertySiteRequest>({
    mutationFn: (body) => preSurveyService.createPropertySite(body),
  })
}

export function useCreatePreSurveyMutation() {
  return useMutation<CreatePreSurveyResponse, ApiError, CreatePreSurveyRequest>({
    mutationFn: (body) => preSurveyService.createPreSurvey(body),
  })
}

export function useUpdatePreSurveyMutation() {
  return useMutation<unknown, ApiError, { id: string; body: UpdatePreSurveyRequest }>({
    mutationFn: ({ id, body }) => preSurveyService.updatePreSurvey(id, body),
  })
}

export function useSubmitPreSurveyMutation() {
  return useMutation<SubmitPreSurveyResponse, ApiError, string>({
    mutationFn: (id) => preSurveyService.submitPreSurvey(id),
  })
}
