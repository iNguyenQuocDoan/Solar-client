import { Link, isRouteErrorResponse, useRouteError } from 'react-router'
import { Button } from '@/components/stitch-ui/Button'
import { Card } from '@/components/stitch-ui/Card'
import { Icon } from '@/components/stitch-ui/Icon'
import { ROUTES } from '@/constants/routes'

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
      <span className="text-label-sm font-bold uppercase tracking-widest text-outline">Error {status}</span>
      <h1 className="text-headline-lg text-on-surface">
        {isNotFound ? 'Record not found' : 'Something went wrong'}
      </h1>
      <p className="text-body-md text-on-surface-variant">
        {isNotFound
          ? 'This work order is not in your assigned queue, or the reference has been retired.'
          : 'The field console could not render this view. Try again from your task list.'}
      </p>
      <Link to={ROUTES.TECH.TASKS} className="mt-space-xs">
        <Button size="md" iconLeft="arrow_back">
          Back to My Tasks
        </Button>
      </Link>
    </Card>
  )
}
