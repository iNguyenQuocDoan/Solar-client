import { ButtonLink } from '@/components/common/ui/button'
import { PageHeader } from '@/components/common/ui/page-header'
import { EmptyState } from '@/components/common/ui/states'
import { PORTALS, type PortalKey } from '@/config/portals'

/* Route exists in the navigation but its screen is not part of this build yet. The way out is the portal's own home entry. */
export function PlaceholderPage({ title, portal }: { title: string; portal: PortalKey }) {
  const home = PORTALS[portal].groups[0]!.items[0]!
  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        title={`${title} chưa có trong bản này`}
        description="Mục này đã có trên menu, màn hình sẽ được bổ sung ở đợt sau."
        action={<ButtonLink to={home.to}>{home.label}</ButtonLink>}
      />
    </>
  )
}
