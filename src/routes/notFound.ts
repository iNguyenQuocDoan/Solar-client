/*
 * Tương đương `notFound()` của Next.js cho react-router: ném Response 404.
 * Lỗi được errorElement gốc (pages/not-found-page.tsx) bắt; chỉ các màn mock đã ẩn của kỹ thuật viên còn dùng.
 */
export function notFound(message = 'Không tìm thấy trang'): never {
  throw new Response(message, { status: 404, statusText: 'Not Found' })
}
