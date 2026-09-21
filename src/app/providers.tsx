import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/lib/auth/AuthProvider'

const queryClient = new QueryClient()

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
