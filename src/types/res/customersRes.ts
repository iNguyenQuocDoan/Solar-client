/*
 * VIẾT TAY – swagger chỉ khai "200 OK" cho tag Customers, không có schema response.
 * Tên kiểu và field lấy đúng theo contract trong SmartSolar.Api (namespace Contracts.Customers,
 * Contracts.PropertySites, image 05/10/2026). Khi backend khai response trong swagger,
 * `npm run gen:api` sẽ ghi đè file này bằng bản sinh tự động.
 */

export type CreateCustomerProfileResponse = {
  /** Format: uuid */
  customerId: string
}

export type CreatePropertySiteResponse = {
  /** Format: uuid */
  propertySiteId: string
}
