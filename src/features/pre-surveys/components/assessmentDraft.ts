import type { CreateCustomerProfileRequest, CreatePropertySiteRequest } from '@/types/req/customersReq'

/*
 * Bản nháp đánh giá đang làm, nhớ trong localStorage theo tài khoản. Backend không có API liệt kê hồ sơ, địa điểm hay
 * bản nháp của khách hàng; chỉ đọc lại được một bản nháp theo id (GET .../surface). Nhớ id để tải lại trang vẫn làm
 * tiếp được; nhớ thêm thông tin địa điểm vì không có API đọc lại địa điểm (bước xem lại cần hiển thị).
 * Gửi xong, hoặc bản nháp không còn (404 / không thuộc tài khoản / đã gửi ở tab khác) thì xoá.
 */

export type AssessmentDraft = {
  profile?: CreateCustomerProfileRequest
  site?: CreatePropertySiteRequest
  siteId?: string
  preSurveyId?: string
}

const draftKey = (account: string) => `smartsolar.assessment-draft.${account}`

export function readDraft(account: string): AssessmentDraft {
  try {
    const raw = localStorage.getItem(draftKey(account))
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as AssessmentDraft) : {}
  } catch {
    return {}
  }
}

export function writeDraft(account: string, draft: AssessmentDraft) {
  try {
    if (draft.siteId || draft.preSurveyId) localStorage.setItem(draftKey(account), JSON.stringify(draft))
    else localStorage.removeItem(draftKey(account))
  } catch {
    /* Trình duyệt chặn storage: tải lại trang thì bắt đầu lại, bản nháp vẫn nằm trên server. */
  }
}

export function clearDraft(account: string) {
  writeDraft(account, {})
}
