import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Notice } from "@/components/common/ui/lists";
import { ErrorState, PageSkeleton } from "@/components/common/ui/states";
import { isApiError } from "@/services/api/errors";

/* 4xx (không có quyền, không tìm thấy…) gọi lại vẫn vậy: không bày nút "Thử lại" vô ích. */
const retryable = (error: unknown) => !(isApiError(error) && error.status >= 400 && error.status < 500);

/* Tiêu đề nói đúng chuyện gì xảy ra; đường quay lại danh sách nằm ở thanh định vị của shell. */
function errorTitle(error: unknown) {
  if (isApiError(error) && error.status === 404) return "Không tìm thấy nội dung này.";
  if (isApiError(error) && error.status === 403) return "Bạn không có quyền xem nội dung này.";
  return undefined;
}

/*
  Loading → skeleton; nothing loaded yet and it failed → error state.
  If data is already on screen and a background refresh fails (polling, window focus), the data stays
  and a quiet notice sits above it: replacing a working list with an error page would hide what the
  person was reading.
*/
export function QueryBoundary<T>({
  query,
  children,
}: {
  query: UseQueryResult<T>;
  children: (data: T) => ReactNode;
}) {
  if (query.isPending) return <PageSkeleton />;
  if (query.data === undefined)
    return (
      <ErrorState
        title={errorTitle(query.error)}
        message={query.error?.message}
        onRetry={retryable(query.error) ? () => query.refetch() : undefined}
      />
    );
  return (
    <>
      {query.isError && (
        <div role="status" className="mb-4">
          <Notice tone="warn">
            Không làm mới được dữ liệu, đang hiện bản tải lúc trước.{" "}
            <button type="button" className="tap ui-link font-medium" onClick={() => query.refetch()}>
              Thử lại
            </button>
          </Notice>
        </div>
      )}
      {children(query.data)}
    </>
  );
}
