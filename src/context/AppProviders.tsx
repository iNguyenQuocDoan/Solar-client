import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthProvider'
import { isApiError } from '@/services/api/errors'

/* Lỗi 4xx (chưa đăng nhập, không có quyền, không tìm thấy…) thử lại cũng không khỏi: báo ngay. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isApiError(error) && error.status >= 400 && error.status < 500) return false
        return failureCount < 2
      },
    },
  },
})

/*
 * Toast dùng sonner, restyle theo Toast cũ trong roles_permissions:
 * nền inverse-surface, chữ inverse-on-surface, icon tertiary-fixed.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                'flex w-full items-center gap-space-sm rounded-xl bg-inverse-surface px-space-md py-3 text-inverse-on-surface shadow-level-3',
              title: 'text-label-md',
              description: 'text-body-sm text-inverse-on-surface/80',
              icon: 'text-tertiary-fixed',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}
