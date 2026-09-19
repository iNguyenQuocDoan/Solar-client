/*
 * Tương đương `notFound()` của Next.js cho react-router: ném Response 404.
 * Route nào dùng hàm này phải khai báo `errorElement` để RouteErrorPage bắt lỗi.
 */
export function notFound(message = 'Not Found'): never {
  throw new Response(message, { status: 404, statusText: 'Not Found' })
}
