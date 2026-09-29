import { Link, isRouteErrorResponse, useRouteError } from 'react-router'
import { Button } from '@/components/common/stitch-ui/Button'
import { Card } from '@/components/common/stitch-ui/Card'
import { Icon } from '@/components/common/stitch-ui/Icon'
import { ROUTES } from '@/routes/paths'

/*
 * errorElement dùng chung cho các route có [id]: hiển thị khi notFound() ném Response 404.
 * `isRouteErrorResponse` chỉ bắt lỗi từ loader/action nên phải xét thêm Response ném lúc render.
 */
function readStatus(error: unknown): number {
  if (isRouteErrorResponse(error)) return error.status
  if (error instanceof Response) return error.status
  return 500
}

export function RouteErrorPage() {
  const status = readStatus(useRouteError())
  const isNotFound = status === 404

  return (
    <Card padding="lg" className="mx-auto flex max-w-md flex-col items-center gap-space-sm text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container text-primary">
        <Icon name={isNotFound ? 'search_off' : 'error'} className="text-[28px]" />
      </div>
      <span className="text-label-sm font-bold text-outline">Lỗi {status}</span>
      <h1 className="text-headline-lg text-on-surface">
        {isNotFound ? 'Không tìm thấy hồ sơ' : 'Đã xảy ra lỗi'}
      </h1>
      <p className="text-body-md text-on-surface-variant">
        {isNotFound
          ? 'Phiếu công việc này không nằm trong danh sách được giao cho bạn, hoặc mã phiếu đã bị hủy.'
          : 'Không hiển thị được màn hình này. Hãy mở lại từ danh sách công việc.'}
      </p>
      <Link to={ROUTES.TECH.TASKS} className="mt-space-xs">
        <Button size="md" iconLeft="arrow_back">
          Về Việc của tôi
        </Button>
      </Link>
    </Card>
  )
}
