import { Outlet } from 'react-router'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/field'
import { PORTALS } from '@/constants/nav'
import { manageContext } from '@/data/manage'

export function ManageLayout() {
  return (
    <AppShell
      portal={PORTALS.manage}
      context={<p className="font-medium text-fg">{manageContext.region}</p>}
      tools={
        <>
          <Select aria-label="Reporting period" className="h-9 w-full text-[14px]" defaultValue={manageContext.period}>
            <option>{manageContext.period}</option>
            <option>Q3 2024</option>
            <option>Last 30 days</option>
          </Select>
          <Button variant="primary" size="sm">
            Export brief
          </Button>
          <p className="text-[14px] text-fg-2">
            <a href="#" className="underline-offset-4 hover:text-fg hover:underline">
              3 unread notifications
            </a>
          </p>
        </>
      }
    >
      <Outlet />
    </AppShell>
  )
}
