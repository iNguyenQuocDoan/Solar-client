/** Định dạng tiền USD kiểu "$7,200.00" như bảng product_catalogue. */
export function formatUsd(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
