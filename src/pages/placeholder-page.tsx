import { ButtonLink } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/states'
import { PORTALS, type PortalKey } from '@/constants/nav'

/* Route exists in the navigation but its screen is not part of this build yet. The way out is the portal's own home entry. */
export function PlaceholderPage({ title, portal }: { title: string; portal: PortalKey }) {
  const home = PORTALS[portal].groups[0]!.items[0]!
  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        title={`${title} is not available in this build`}
        description="The navigation entry is reserved. The screen will be added with the next iteration."
        action={<ButtonLink to={home.to}>{home.label}</ButtonLink>}
      />
    </>
  )
}
