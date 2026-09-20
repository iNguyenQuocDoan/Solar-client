import { PageHeader } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/states'

/* Route exists in the navigation but its screen is not part of this build yet. */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState title={`${title} is not available in this build`} description="The navigation entry is reserved. The screen will be added with the next iteration." />
    </>
  )
}
