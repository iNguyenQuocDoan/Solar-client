import { RouterProvider } from 'react-router'
import { AppProviders } from '@/context/AppProviders'
import { router } from '@/routes/router'

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
