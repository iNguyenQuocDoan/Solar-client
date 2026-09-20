import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { ROUTES } from '@/constants/routes'

/* Root error boundary: 404s and unexpected render errors land here. */
export function NotFoundPage() {
  const error = useRouteError()
  const notFound = error == null || (isRouteErrorResponse(error) && error.status === 404)
  const message = !notFound && error instanceof Error ? error.message : undefined

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col justify-center px-6 py-16">
      <p className="tnum text-[14px] text-fg-2">{notFound ? 'Error 404' : 'Something went wrong'}</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{notFound ? 'This page does not exist' : 'The page could not be displayed'}</h1>
      <p className="mt-2 text-[15px] text-fg-2">
        {notFound ? 'The link may be out of date or the record may have moved.' : 'Reload the page or go back to the overview. If it keeps happening, contact your advisor.'}
      </p>
      {message && <pre className="mt-3 overflow-x-auto rounded-md bg-surface-2 px-3 py-2 font-mono text-[13px] text-fg-2">{message}</pre>}
      <div className="mt-6 flex flex-wrap gap-2">
        <Link to={ROUTES.customer.home} className="press inline-flex h-9 items-center rounded-md bg-accent px-3.5 text-[15px] font-medium text-on-accent hover:bg-accent-hover">
          Go to overview
        </Link>
        <button type="button" onClick={() => window.location.reload()} className="press inline-flex h-9 items-center rounded-md border border-line-2 bg-surface px-3.5 text-[15px] font-medium hover:bg-surface-2">
          Reload
        </button>
      </div>
    </main>
  )
}
