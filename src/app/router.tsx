import { createBrowserRouter } from 'react-router'
import { ROUTES } from '@/constants/routes'
import { HomePage } from '@/pages/home-page'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
])
