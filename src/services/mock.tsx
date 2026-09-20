import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { ErrorState, PageSkeleton } from "@/components/ui/states";

/*
  Until the API lands, every page reads through this hook so loading and
  error states are exercised for real. Swap the queryFn for an apiClient call
  and the pages stay untouched.
*/
export function useMockQuery<T>(key: readonly unknown[], data: T, delay = 220) {
  return useQuery({
    queryKey: key,
    queryFn: () =>
      new Promise<T>((resolve) => setTimeout(() => resolve(data), delay)),
    staleTime: Infinity,
  });
}

export function QueryBoundary<T>({
  query,
  children,
}: {
  query: UseQueryResult<T>;
  children: (data: T) => ReactNode;
}) {
  if (query.isPending) return <PageSkeleton />;
  if (query.isError)
    return (
      <ErrorState
        message={query.error.message}
        onRetry={() => query.refetch()}
      />
    );
  return <>{children(query.data)}</>;
}

/* Placeholder photography while real project assets are not wired in. */
export function img(seed: string, w = 800, h = 600) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}
