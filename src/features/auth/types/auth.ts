import type { components } from '@/types/api-schema'

/*
 * Request/response DTO của 9 endpoint Auth. Tên field và kiểu lấy nguyên từ
 * src/types/api-schema.d.ts (sinh bằng `npm run gen:api` từ docs/api/swagger.json)
 * – không tự đặt lại.
 */

type Schemas = components['schemas']

export type RegisterRequest = Schemas['RegisterRequest']
export type RegisterResponse = Schemas['RegisterResponse']
export type VerifyEmailRequest = Schemas['VerifyEmailRequest']
export type VerifyEmailResponse = Schemas['VerifyEmailResponse']
export type ResendVerificationRequest = Schemas['ResendVerificationRequest']
export type ResendVerificationResponse = Schemas['ResendVerificationResponse']
export type LoginRequest = Schemas['LoginRequest']
export type AuthTokensResponse = Schemas['AuthTokensResponse']
export type RefreshTokenRequest = Schemas['RefreshTokenRequest']
export type LogoutRequest = Schemas['LogoutRequest']
export type LogoutResponse = Schemas['LogoutResponse']
export type ForgotPasswordRequest = Schemas['ForgotPasswordRequest']
export type ForgotPasswordResponse = Schemas['ForgotPasswordResponse']
export type ResetPasswordRequest = Schemas['ResetPasswordRequest']
export type ChangePasswordRequest = Schemas['ChangePasswordRequest']
export type PasswordChangedResponse = Schemas['PasswordChangedResponse']
