import { useState } from 'react'
import { Link } from 'react-router'
import { AdvisoryCard } from '@/components/admin/AdvisoryCard'
import { AuditTrailTable } from '@/components/admin/AuditTrailTable'
import { DistributionBar } from '@/components/admin/DistributionBar'
import { KeyValueList, KeyValueRow } from '@/components/admin/KeyValueList'
import { QuickLaunchCard } from '@/components/admin/QuickLaunchCard'
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  IconButton,
  MetricCard,
  PageHeader,
  ProgressBar,
  StatusBadge,
} from '@/components/stitch-ui'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/cn'
import {
  adminDashboardHeader,
  adminKpis,
  auditTrail,
  engineDefaults,
  launchpads,
  maintenanceAdvisory,
  quickCreateItems,
  userDistribution,
  type KpiFooter,
} from '@/lib/mock/adminDashboard'

/* Dựng từ admin_dashboard/code.html + screen.png. */

function KpiFooterBlock({ footer }: { footer: KpiFooter }) {
  switch (footer.kind) {
    case 'chips':
      return (
        <div className="rounded-xl bg-surface-container-low p-space-xs">
          <div className="flex flex-wrap items-center gap-1 text-[10px] font-medium text-on-surface-variant">
            {footer.chips.map((chip) => (
              <span
                key={chip.label}
                className={cn(
                  'rounded-full px-2 py-0.5',
                  chip.active ? 'bg-primary-container text-on-primary' : 'bg-surface-container-lowest text-on-surface',
                )}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>
      )
    case 'progress':
      return (
        <div className="flex flex-col gap-1.5 rounded-xl bg-surface-container-low p-space-xs">
          <div className="flex justify-between text-label-sm text-on-surface">
            <span>{footer.title}</span>
            <span className="font-semibold text-primary">{footer.percent}%</span>
          </div>
          <ProgressBar value={footer.percent} size="sm" label={footer.title} />
          <div className="flex justify-between text-[11px] text-outline">
            <span>{footer.left}</span>
            <span>{footer.right}</span>
          </div>
        </div>
      )
    case 'stat':
      return (
        <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-space-xs">
          <div className="flex items-center gap-space-xs">
            <Icon name={footer.icon} className="text-[18px] text-tertiary-container" />
            <div className="flex flex-col">
              <span className="text-label-sm font-semibold text-on-surface">{footer.label}</span>
              <span className="text-[10px] text-outline">{footer.sublabel}</span>
            </div>
          </div>
          <StatusBadge variant="warning" dot={false} size="sm" className="py-1 text-[10px] font-semibold">
            {footer.badge}
          </StatusBadge>
        </div>
      )
    case 'status':
      return (
        <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-space-xs text-label-sm">
          <div className="flex items-center gap-1.5 text-on-surface">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-tertiary-container" />
            <span>{footer.label}</span>
          </div>
          <span className="text-[11px] text-outline">{footer.note}</span>
        </div>
      )
  }
}

function QuickCreateMenu({
  label,
  items,
}: {
  label: string
  items: { key: string; icon: string; label: string; href: string }[]
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <Button
        iconLeft="add_circle"
        iconRight="expand_more"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
      </Button>
      {open && (
        <>
          <div aria-hidden="true" className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-56 rounded-xl bg-surface-container-lowest p-space-xs shadow-level-3"
          >
            {items.map((item) => (
              <Link
                key={item.key}
                role="menuitem"
                to={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-space-sm rounded-lg px-space-sm py-2 text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
              >
                <Icon name={item.icon} className="text-[18px] text-primary" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function AdminDashboardPage() {
  const header = adminDashboardHeader

  return (
    <>
      <PageHeader
        breadcrumb={header.breadcrumb}
        meta={
          <>
            <span aria-hidden="true" className="inline-block h-2 w-2 animate-pulse rounded-full bg-tertiary-container" />
            <span>{header.clusterNode}</span>
            <span className="text-outline">/</span>
            <span>{header.engineVersion}</span>
          </>
        }
        eyebrow={header.eyebrow}
        title={header.title}
        description={header.description}
        actions={
          <>
            <Button variant="tonal" iconLeft="health_and_safety">
              {header.actions.healthCheck}
            </Button>
            <Button variant="tonal" iconLeft="download" className="text-on-surface-variant">
              {header.actions.exportLogs}
            </Button>
            <QuickCreateMenu label={header.actions.quickCreate} items={quickCreateItems} />
          </>
        }
      />

      {/* KPI */}
      <section className="mb-space-2xl grid grid-cols-1 gap-space-lg md:grid-cols-2 xl:grid-cols-4">
        {adminKpis.map(({ key, footer, ...kpi }) => (
          <MetricCard key={key} layout="inline" {...kpi}>
            <KpiFooterBlock footer={footer} />
          </MetricCard>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12">
        {/* Cột trái: audit trail + launchpads */}
        <div className="flex flex-col gap-space-xl lg:col-span-8">
          <Card className="flex flex-col">
            <div className="mb-space-lg flex flex-col justify-between gap-space-sm sm:flex-row sm:items-center">
              <div>
                <CardTitle icon="history_edu">{auditTrail.title}</CardTitle>
                <CardDescription className="mt-0.5">{auditTrail.description}</CardDescription>
              </div>
              <div className="flex items-center gap-space-xs self-start sm:self-auto">
                <span className="rounded-full bg-surface-container-low px-2.5 py-1 text-label-sm text-on-surface">
                  {auditTrail.streamLabel}
                </span>
                <IconButton icon="filter_list" label="Filter log stream" />
              </div>
            </div>
            <AuditTrailTable entries={auditTrail.entries} />
            <div className="mt-space-md flex flex-col justify-between gap-space-xs pt-space-xs text-body-sm text-outline sm:flex-row sm:items-center">
              <span>
                Showing {auditTrail.entries.length} of {auditTrail.total.toLocaleString()} audit entries{' '}
                {auditTrail.periodLabel}
              </span>
              <Link
                to={ROUTES.ADMIN.REPORTS}
                className="flex items-center gap-1 text-label-md text-primary hover:underline"
              >
                {auditTrail.linkLabel}
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
          </Card>

          <div>
            <div className="mb-space-md flex items-center justify-between">
              <h2 className="text-headline-md text-on-surface">{launchpads.title}</h2>
              <span className="text-label-sm text-outline">{launchpads.caption}</span>
            </div>
            <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
              {launchpads.items.map((item) => (
                <QuickLaunchCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: engine defaults, phân bố user, advisory */}
        <div className="flex flex-col gap-space-xl lg:col-span-4">
          <Card>
            <CardHeader className="mb-space-md">
              <CardTitle icon="display_settings">{engineDefaults.title}</CardTitle>
              <Link
                to={ROUTES.ADMIN.TECH_CONFIG}
                className="text-label-sm font-semibold text-primary hover:underline"
              >
                {engineDefaults.editLabel}
              </Link>
            </CardHeader>
            <CardDescription className="mb-space-md">{engineDefaults.description}</CardDescription>
            <KeyValueList>
              {engineDefaults.rows.map((row) => (
                <KeyValueRow key={row.label} {...row} />
              ))}
              <KeyValueRow
                icon={engineDefaults.vectorHub.icon}
                label={engineDefaults.vectorHub.label}
                sublabel={engineDefaults.vectorHub.sublabel}
                sublabelClassName="font-semibold text-tertiary-container"
                trailing={
                  <span aria-hidden="true" className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-tertiary-container" />
                }
              />
            </KeyValueList>
          </Card>

          <Card>
            <CardHeader className="mb-space-sm">
              <CardTitle icon="pie_chart">{userDistribution.title}</CardTitle>
              <span className="text-label-sm text-outline">{userDistribution.total.toLocaleString()} Total</span>
            </CardHeader>
            <CardDescription className="mb-space-md">{userDistribution.description}</CardDescription>
            <DistributionBar segments={userDistribution.segments} />
            <div className="mt-space-md pt-space-xs text-center">
              <Link
                to={userDistribution.linkHref}
                className="inline-flex items-center gap-1 text-label-md font-semibold text-primary hover:underline"
              >
                {userDistribution.linkLabel}
                <Icon name="chevron_right" className="text-[16px]" />
              </Link>
            </div>
          </Card>

          <AdvisoryCard
            icon={maintenanceAdvisory.icon}
            eyebrow={maintenanceAdvisory.eyebrow}
            title={maintenanceAdvisory.title}
            reference={maintenanceAdvisory.reference}
            actionLabel={maintenanceAdvisory.actionLabel}
          >
            {maintenanceAdvisory.bodyBefore}
            <strong>{maintenanceAdvisory.bodyStrong}</strong>
            {maintenanceAdvisory.bodyAfter}
          </AdvisoryCard>
        </div>
      </div>
    </>
  )
}
