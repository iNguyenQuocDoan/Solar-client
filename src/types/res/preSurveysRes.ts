/*
 * VIẾT TAY – swagger chỉ khai "200 OK" cho tag PreSurveys, không có schema response.
 * Tên kiểu và field lấy đúng theo contract trong SmartSolar.Api (namespace Contracts.PreSurveys,
 * image 05/10/2026). PUT /api/pre-surveys/{id} không trả data. Khi backend khai response trong
 * swagger, `npm run gen:api` sẽ ghi đè file này bằng bản sinh tự động.
 */

export type CreatePreSurveyResponse = {
  /** Format: uuid */
  preSurveyId: string
}

export type SubmitPreSurveyResponse = {
  /** Format: uuid */
  surveyRequestId: string
}
