/**
 * Cuộn khung `container` (không cuộn cả trang như scrollIntoView) vừa đủ để `element` hiện trọn: dùng cho danh sách có
 * thanh cuộn riêng (mục đang chọn của combobox, lần mô phỏng đang xem).
 */
export function keepInView(container: HTMLElement, element: HTMLElement) {
  const box = container.getBoundingClientRect()
  const item = element.getBoundingClientRect()
  if (item.top < box.top) container.scrollTop -= box.top - item.top
  else if (item.bottom > box.bottom) container.scrollTop += item.bottom - box.bottom
}
