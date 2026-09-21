import { useMutation } from '@tanstack/react-query'
import * as authApi from '@/lib/api/auth'
import type { ApiError } from '@/lib/api/errors'

/*
 * Mutation cho 9 endpoint Auth (trừ refresh – interceptor trong client.ts tự lo).
 * Lỗi luôn là ApiError nên component đọc được `status`, `code`, `fieldErrors`.
 *
 * Hai mutation có ảnh hưởng tới phiên đăng nhập (login / logout) nằm trong
 * AuthProvider vì còn phải lưu token và dựng user.
 */

export function useRegisterMutation() {
  return useMutation<authApi.RegisterResponse, ApiError, authApi.RegisterRequest>({
    mutationFn: (body) => authApi.register(body),
  })
}

export function useVerifyEmailMutation() {
  return useMutation<authApi.VerifyEmailResponse, ApiError, authApi.VerifyEmailRequest>({
    mutationFn: (body) => authApi.verifyEmail(body),
  })
}

export function useResendVerificationMutation() {
  return useMutation<authApi.ResendVerificationResponse, ApiError, authApi.ResendVerificationRequest>({
    mutationFn: (body) => authApi.resendVerification(body),
  })
}

export function useForgotPasswordMutation() {
  return useMutation<authApi.ForgotPasswordResponse, ApiError, authApi.ForgotPasswordRequest>({
    mutationFn: (body) => authApi.forgotPassword(body),
  })
}

export function useResetPasswordMutation() {
  return useMutation<authApi.PasswordChangedResponse, ApiError, authApi.ResetPasswordRequest>({
    mutationFn: (body) => authApi.resetPassword(body),
  })
}

export function useChangePasswordMutation() {
  return useMutation<authApi.PasswordChangedResponse, ApiError, authApi.ChangePasswordRequest>({
    mutationFn: (body) => authApi.changePassword(body),
  })
}
