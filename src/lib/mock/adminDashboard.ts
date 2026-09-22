import type { AuditEntry } from '@/components/admin/AuditTrailTable'
import type { DistributionSegment } from '@/components/admin/DistributionBar'
import type { KeyValueRowProps } from '@/components/admin/KeyValueList'
import type { QuickLaunchCardProps } from '@/components/admin/QuickLaunchCard'
import type { MetricCardProps } from '@/components/stitch-ui/MetricCard'
import type { Crumb } from '@/components/stitch-ui/PageHeader'
import { ROUTES } from '@/constants/routes'

/* Dữ liệu giả cho /admin, nội dung lấy từ admin_dashboard/screen.png. */

export const adminDashboardHeader = {
  breadcrumb: [{ label: 'Administration' }, { label: 'System Overview' }] satisfies Crumb[],
  clusterNode: 'Cluster Node: US-Central-Primary (Active)',
  engineVersion: 'Engine v3.4.2',
  title: 'System Overview',
  description: 'Platform metrics, calculation defaults, and the audit log.',
  actions: {
    healthCheck: 'Run System Health Check',
    exportLogs: 'Export Audit Logs (CSV)',
    quickCreate: 'Quick Create',
  },
}

export const quickCreateItems = [
  { key: 'user', icon: 'person_add', label: '+ New User Account', href: ROUTES.ADMIN.USERS },
  { key: 'sku', icon: 'inventory_2', label: '+ Product SKU', href: ROUTES.ADMIN.PRODUCTS },
  { key: 'doc', icon: 'upload_file', label: '+ Knowledge Document', href: ROUTES.ADMIN.KNOWLEDGE_BASE },
]

/** Footer của từng thẻ KPI khác nhau nên mô tả bằng union. */
export type KpiFooter =
  | { kind: 'chips'; chips: { label: string; active?: boolean }[] }
  | { kind: 'progress'; title: string; percent: number; left: string; right: string }
  | { kind: 'stat'; icon: string; label: string; sublabel: string; badge: string }
  | { kind: 'status'; label: string; note: string }

export type AdminKpi = Omit<MetricCardProps, 'children' | 'layout'> & { key: string; footer: KpiFooter }

export const adminKpis: AdminKpi[] = [
  {
    key: 'users',
    label: 'Total Platform Users',
    value: '1,428',
    icon: 'group',
    tone: 'primary',
    delta: { text: '+14 this wk', direction: 'up' },
    description: 'Verified active accounts across 5 access tiers',
    footer: {
      kind: 'chips',
      chips: [
        { label: '1,120 Homeowners' },
        { label: '84 Sales' },
        { label: '42 Techs' },
        { label: '12 Mgrs' },
        { label: '6 Admins', active: true },
      ],
    },
  },
  {
    key: 'catalogue',
    label: 'Catalogue Assets',
    value: '348',
    icon: 'solar_power',
    tone: 'secondary',
    delta: { text: 'Active SKUs', direction: 'flat' },
    description: 'Global solar modules, micro-inverters & service contracts',
    footer: {
      kind: 'progress',
      title: '214 Hardware Products',
      percent: 61.5,
      left: '134 Standardized Services',
      right: '8 Global Categories',
    },
  },
  {
    key: 'knowledge',
    label: 'AI Knowledge Base',
    value: '94',
    icon: 'neurology',
    tone: 'primary',
    delta: { text: 'Verified Docs', direction: 'flat', tone: 'positive' },
    description: 'RAG pipeline supporting SolarGPT residential assistant',
    footer: {
      kind: 'stat',
      icon: 'dataset',
      label: '842 Embeddings',
      sublabel: 'SLA Retrieval 99.8%',
      badge: '4 Queued',
    },
  },
  {
    key: 'engine',
    label: 'Configuration Engine',
    value: 'Optimal / Green',
    valueSize: 'headline',
    valueTone: 'tertiary',
    icon: 'verified',
    tone: 'tertiary',
    description: 'Solar calculation engine v3.4.2 active & synchronized',
    footer: { kind: 'status', label: '6 Active Warranties', note: 'Sync 12m ago' },
  },
]

export const auditTrail = {
  title: 'Audit Trail',
  streamLabel: 'Live',
  total: 1290,
  periodLabel: 'logged in the past 7 days',
  linkLabel: 'View Complete Audit Trail',
  entries: [
    {
      id: 'a1',
      timestamp: 'Today, 14:32:10',
      actor: { initials: 'ES', name: 'Eleanor Sterling', tone: 'primary-container' },
      action: 'Updated Solar Degradation Factor:',
      actionCode: '0.50% → 0.48%/yr',
      actionCodeTone: 'tertiary',
      target: 'Global Energy Yield Parameters',
      origin: { ip: '192.168.4.12', site: 'Austin TX HQ' },
      integrity: { label: 'Success', variant: 'positive' },
    },
    {
      id: 'a2',
      timestamp: 'Today, 13:18:04',
      actor: { initials: 'MV', name: 'Marcus Vance', tone: 'secondary' },
      action: 'Revoked credentials: Jack Reynolds (Field Ops)',
      target: 'Identity & Access Control (RBAC)',
      origin: { ip: '172.56.21.90', site: 'Denver Co-Lo' },
      integrity: { label: 'Verified', variant: 'neutral' },
    },
    {
      id: 'a3',
      timestamp: 'Today, 11:45:22',
      actor: { initials: 'ES', name: 'Eleanor Sterling', tone: 'primary' },
      action: 'Published SKU:',
      actionCode: 'SE7600H-US HD-Wave',
      actionCodeTone: 'primary',
      target: 'Inverter Hardware Catalogue',
      origin: { ip: '192.168.4.12', site: 'Austin TX HQ' },
      integrity: { label: 'Success', variant: 'positive' },
    },
    {
      id: 'a4',
      timestamp: 'Today, 09:12:48',
      actor: { initials: 'AI', name: 'AutoIngest Bot', tone: 'neutral' },
      action: 'Uploaded RAG Doc: NEC-2023-Solar-Compliance-V2.pdf',
      target: 'Vector Corpus (Pinecone)',
      origin: { ip: '10.0.8.214', site: 'VPC Private Subnet' },
      integrity: { label: 'Flagged (4 chunks)', variant: 'warning' },
    },
    {
      id: 'a5',
      timestamp: 'Yesterday, 18:05:01',
      actor: { initials: 'MV', name: 'Marcus Vance', tone: 'secondary' },
      action: 'Updated Tier 2 Net Metering Utility Tariff in ERCOT',
      target: 'Tariff Configuration Table',
      origin: { ip: '172.56.21.90', site: 'Denver Co-Lo' },
      integrity: { label: 'Success', variant: 'positive' },
    },
  ] satisfies AuditEntry[],
}

export const engineDefaults = {
  title: 'Engine Defaults',
  editLabel: 'Edit',
  rows: [
    { icon: 'screen_rotation', label: 'Standard Tilt Default', sublabel: 'CA/TX Baseline', value: '25.0°' },
    {
      icon: 'bolt',
      iconClassName: 'text-tertiary-container',
      label: 'Inverter Efficiency',
      sublabel: 'CEC Weighted Base',
      value: '97.5%',
      valueClassName: 'text-tertiary-container',
    },
    {
      icon: 'verified_user',
      iconClassName: 'text-secondary',
      label: 'Standard Warranty Term',
      sublabel: 'Panel / Inverter',
      value: '25y / 10y',
      valueClassName: 'text-label-md',
    },
    {
      icon: 'event_repeat',
      iconClassName: 'text-on-surface-variant',
      label: 'Maintenance Cycle',
      sublabel: 'Automated Prompt',
      value: '12 Months',
      valueClassName: 'text-label-md',
    },
  ] satisfies KeyValueRowProps[],
  vectorHub: {
    icon: 'hub',
    label: 'Pinecone Vector Hub',
    sublabel: 'Connected (14ms latency)',
  },
}

export const userDistribution = {
  title: 'User Distribution',
  total: 1428,
  linkLabel: 'Access User Management Directory',
  linkHref: ROUTES.ADMIN.USERS,
  segments: [
    { key: 'homeowners', label: 'Homeowners / Clients', count: 1120, percent: 78.4, colorClass: 'bg-primary' },
    { key: 'sales', label: 'Solar Sales Consultants', count: 84, percent: 5.8, colorClass: 'bg-secondary' },
    { key: 'techs', label: 'Certified Field Techs', count: 42, percent: 2.9, colorClass: 'bg-tertiary-container' },
    { key: 'managers', label: 'Regional Ops Managers', count: 12, percent: 0.8, colorClass: 'bg-surface-tint' },
    { key: 'admins', label: 'Super Administrators', count: 6, percent: 0.4, colorClass: 'bg-on-surface' },
  ] satisfies DistributionSegment[],
}

export const launchpads = {
  title: 'Common Tasks',
  items: [
    {
      icon: 'person_add',
      tone: 'primary',
      title: 'Provision New Staff Member',
      description: 'Create an account and assign its role.',
      ctaLabel: 'Open Staff Onboarding',
      href: ROUTES.ADMIN.USERS,
    },
    {
      icon: 'tune',
      tone: 'secondary',
      title: 'Configure Solar Yield Constants',
      description: 'Change the derating, loss, and tilt values used in every estimate.',
      ctaLabel: 'Technical Configuration',
      href: ROUTES.ADMIN.TECH_CONFIG,
    },
    {
      icon: 'auto_stories',
      tone: 'primary-container',
      title: 'Index Customer FAQs for AI Assistant',
      description: 'Add documents the assistant can answer from.',
      ctaLabel: 'Access AI Knowledge Base',
      href: ROUTES.ADMIN.KNOWLEDGE_BASE,
    },
    {
      icon: 'policy',
      tone: 'tertiary',
      title: 'Manage Role Permission Matrices',
      description: 'Review what each role can see and approve.',
      ctaLabel: 'Configure RBAC Matrix',
      href: ROUTES.ADMIN.ROLES,
    },
  ] satisfies QuickLaunchCardProps[],
}

export const maintenanceAdvisory = {
  icon: 'calendar_clock',
  eyebrow: 'Maintenance Advisory',
  title: 'Database Re-indexing',
  bodyBefore: 'Next scheduled database index optimization in ',
  bodyStrong: '3 days, 02:00 UTC',
  bodyAfter: '. High read/write queries will experience brief latency buffers (<120ms).',
  reference: 'Change Request #CR-8821',
  actionLabel: 'View Schedule Details',
}
