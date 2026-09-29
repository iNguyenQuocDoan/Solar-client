import { useQuery } from "@tanstack/react-query";

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
