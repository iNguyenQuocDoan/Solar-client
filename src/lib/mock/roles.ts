import type { Crumb } from '@/components/stitch-ui/Breadcrumb'
import type { StatusVariant } from '@/components/stitch-ui/StatusBadge'
import { ROUTES } from '@/constants/routes'

/* Dữ liệu giả cho /admin/roles, nội dung lấy từ roles_permissions/screen.png. */

export const rolesPageHeader = {
  breadcrumb: [
    { label: 'Administration', icon: 'admin_panel_settings', href: ROUTES.ADMIN.DASHBOARD },
    { label: 'Security & Governance' },
    { label: 'Roles & Permissions' },
  ] satisfies Crumb[],
  engineChip: 'RBAC Engine v2.4',
  policyChip: 'Strict Zero-Trust Active',
  badge: 'Platform Security',
  policyCode: 'SEC-POLICY-2025.04',
  title: 'Role-Based Access Control (RBAC) & Governance Matrix',
  description:
    'Manage system roles, configure granular functional capabilities, and audit access control boundaries across all residential microgrids, installer fleets, and pricing engines.',
  actions: { export: 'Export Matrix', audit: 'Audit Drift', create: 'Create Custom Role' },
}

export type RoleId = 'super-admin' | 'ops-manager' | 'sales-rep' | 'field-tech' | 'customer' | 'compliance-auditor'

export type RoleScopeTone = 'protected' | 'custom' | 'readonly'

export type RoleSummary = {
  id: RoleId
  name: string
  tagline: string
  description: string
  icon: string
  users: number
  scopeLabel: string
  scopeIcon: string
  scopeTone: RoleScopeTone
  protected?: boolean
  detail: {
    subtitle: string
    scope: string
    badge?: { label: string; variant: StatusVariant }
    warning?: { title: string; before: string; strong: string; after: string }
  }
}

export const roles: RoleSummary[] = [
  {
    id: 'super-admin',
    name: 'Super Administrator',
    tagline: 'Root platform governance & policies',
    description: 'Unrestricted administrative authority across all telemetry, commercial, dispatch, and AI vectors.',
    icon: 'shield_person',
    users: 6,
    scopeLabel: 'Protected',
    scopeIcon: 'lock',
    scopeTone: 'protected',
    protected: true,
    detail: {
      subtitle: 'Full root platform governance, policy orchestration, and unconstrained engineering control.',
      scope: 'Global Root',
      badge: { label: 'System Protected Role', variant: 'success' },
      warning: {
        title: 'Caution: High Impact Governance Scope',
        before: 'Changes to this role affect ',
        strong: '6 active administrative accounts',
        after:
          ' immediately. High-risk actions will require second-party dual authorization from another Super Admin prior to execution.',
      },
    },
  },
  {
    id: 'ops-manager',
    name: 'Operations Manager',
    tagline: 'Field dispatch & operational oversight',
    description: 'Manages crew schedules, engineering signoffs, and high-tier hardware replacement protocols.',
    icon: 'engineering',
    users: 12,
    scopeLabel: 'Custom Scoped',
    scopeIcon: 'tune',
    scopeTone: 'custom',
    detail: {
      subtitle: 'Dispatch scheduling, installation stage progression, and crew capacity orchestration.',
      scope: 'Regional Operations',
      badge: { label: 'Custom Role', variant: 'neutral' },
    },
  },
  {
    id: 'sales-rep',
    name: 'Sales Representative',
    tagline: 'Quotes, proposals & energy estimates',
    description:
      'Creates customer energy savings forecasts, builds system packages, and initiates standard sales agreements.',
    icon: 'point_of_sale',
    users: 84,
    scopeLabel: 'Commercial',
    scopeIcon: 'tune',
    scopeTone: 'custom',
    detail: {
      subtitle: 'Customer proposal builder, tariff calculator, and lead intake manager.',
      scope: 'Commercial',
      badge: { label: 'Custom Role', variant: 'neutral' },
    },
  },
  {
    id: 'field-tech',
    name: 'Field Lead Technician',
    tagline: 'Site inspection, wiring & PTO checks',
    description:
      'Uploads roof mounting imagery, records string inverter telemetry, and completes interconnection punch-lists.',
    icon: 'construction',
    users: 42,
    scopeLabel: 'Field Operations',
    scopeIcon: 'tune',
    scopeTone: 'custom',
    detail: {
      subtitle: 'Onsite electrical inspection, panel array serial scans, and safety compliance signoffs.',
      scope: 'Field Zones',
      badge: { label: 'Custom Role', variant: 'neutral' },
    },
  },
  {
    id: 'customer',
    name: 'Customer / Homeowner',
    tagline: 'Telemetry view & billing statements',
    description:
      'Reads rooftop generation, requests support service tickets, and inspects verified utility offset milestones.',
    icon: 'cottage',
    users: 1284,
    scopeLabel: 'Scoped Tenant',
    scopeIcon: 'lock_clock',
    scopeTone: 'custom',
    detail: {
      subtitle: 'Telemetry monitoring view, billing invoice archives, and customer support tickets.',
      scope: 'Tenant',
      badge: { label: 'Tenant Scoped', variant: 'neutral' },
    },
  },
  {
    id: 'compliance-auditor',
    name: 'Compliance Auditor',
    tagline: 'Read-only security & safety logs',
    description:
      'Non-destructive immutable audit access across grid interconnection compliance records and SOC 2 traces.',
    icon: 'fact_check',
    users: 2,
    scopeLabel: 'Read-Only',
    scopeIcon: 'visibility',
    scopeTone: 'readonly',
    detail: {
      subtitle: 'Read-only safety records, utility interconnection audits, and SOC-2 event timelines.',
      scope: 'Audit',
      badge: { label: 'Read-Only', variant: 'warning' },
    },
  },
]

export type PermissionItem = {
  id: string
  label: string
  description: string
  /** Quyền phá hủy: chữ đỏ, checkbox đỏ, icon crisis_alert */
  destructive?: boolean
}

export type PermissionModule = {
  id: string
  index: number
  title: string
  icon: string
  columns: 2 | 3
  items: PermissionItem[]
}

export const permissionModules: PermissionModule[] = [
  {
    id: 'identity',
    index: 1,
    title: 'User & Identity Management',
    icon: 'manage_accounts',
    columns: 2,
    items: [
      { id: 'view-users', label: 'View Users', description: 'Search directory, user profiles, status' },
      { id: 'create-edit-users', label: 'Create & Edit Users', description: 'Provision credentials & contact data' },
      {
        id: 'deactivate-accounts',
        label: 'Deactivate / Delete Accounts',
        description: 'Revoke SSO, purge accounts (Destructive)',
        destructive: true,
      },
      { id: 'assign-admin-roles', label: 'Assign Administrative Roles', description: 'Elevate permission boundaries' },
    ],
  },
  {
    id: 'pricing',
    index: 2,
    title: 'Pricing & Quotation Approval',
    icon: 'price_change',
    columns: 3,
    items: [
      { id: 'view-quotations', label: 'View Official Quotations', description: 'Review solar proposal finances' },
      { id: 'authorize-discounts', label: 'Authorize Discounts > 10%', description: 'Grant commercial variance' },
      { id: 'bypass-signoff', label: 'Bypass Manager Sign-Off', description: 'Force contract execution' },
    ],
  },
  {
    id: 'catalogue',
    index: 3,
    title: 'Product & Service Catalogue',
    icon: 'solar_power',
    columns: 3,
    items: [
      { id: 'publish-skus', label: 'Publish Hardware SKUs', description: 'Panels, inverters & batteries' },
      { id: 'baseline-cost', label: 'Set Baseline Cost & Labor', description: 'Regional installation tables' },
      { id: 'archive-modules', label: 'Archive Obsolete Modules', description: 'Deprecate past hardware runs' },
    ],
  },
  {
    id: 'engine',
    index: 4,
    title: 'Technical Calculations & System Engine',
    icon: 'tune',
    columns: 3,
    items: [
      { id: 'degradation', label: 'Modify Degradation Factor', description: '25-year panel degradation rates' },
      { id: 'cec-presets', label: 'Inverter CEC Presets', description: 'Calibrate efficiency curve specs' },
      { id: 'warranty-terms', label: 'Update Warranty Terms', description: 'Workmanship guarantee policies' },
    ],
  },
  {
    id: 'knowledge',
    index: 5,
    title: 'AI Knowledge Base & RAG Pipeline',
    icon: 'smart_toy',
    columns: 3,
    items: [
      { id: 'upload-pdfs', label: 'Upload Regulatory PDFs', description: 'Feed municipal solar codes' },
      { id: 'reindex', label: 'Trigger Vector Re-indexing', description: 'Recompute embeddings in pinecone' },
      { id: 'purge-chunks', label: 'Purge AI Vector Chunks', description: 'Erase out-of-date document slices' },
    ],
  },
]

export const allPermissionIds = permissionModules.flatMap((module) => module.items.map((item) => item.id))

/** Baseline quyền của từng role (id trong permissionModules). */
export const roleDefaults: Record<RoleId, string[]> = {
  'super-admin': allPermissionIds,
  'ops-manager': allPermissionIds.filter(
    (id) => !['deactivate-accounts', 'assign-admin-roles', 'bypass-signoff', 'purge-chunks'].includes(id),
  ),
  'sales-rep': ['view-users', 'view-quotations', 'authorize-discounts', 'publish-skus', 'baseline-cost'],
  'field-tech': ['view-users', 'view-quotations', 'publish-skus', 'cec-presets', 'warranty-terms', 'upload-pdfs', 'reindex'],
  customer: ['view-users', 'view-quotations'],
  'compliance-auditor': ['view-users', 'view-quotations', 'baseline-cost', 'cec-presets', 'upload-pdfs'],
}

export const systemRolesPanel = {
  title: 'System Roles',
  countLabel: (count: number) => `${count} Defined`,
  searchPlaceholder: 'Filter roles or scope...',
  governed: { label: 'Accounts Governed', value: '1,430', note: '100% Policy Enforced', percent: 94 },
}

export const governanceCallout = {
  image: '/placeholders/photo-panel.svg',
  eyebrow: 'Permission Governance',
  title: 'Hardware & Grid Guardrails',
  note: 'Inverter safety caps cannot be overridden without 2-factor MFA.',
}

export const matrixLabels = {
  title: 'Functional Capability Matrix',
  collapse: 'Collapse Modules',
  expand: 'Expand Modules',
  grantAll: 'Grant All',
  revokeAll: 'Revoke All',
  allowed: 'Capabilities Allowed',
  reset: 'Reset to System Default',
  save: 'Save Permission Matrix',
}

export const matrixStatus = {
  clean: 'No unsaved permission changes',
  dirty: 'Unsaved changes pending approval',
  loaded: (name: string) => `Loaded baseline for ${name}`,
  saved: 'All capability changes persisted across production',
  reset: 'Restored role to platform gold-standard policy',
}

export const rolesToasts = {
  saved: 'Permission matrix synced with Zero-Trust enforcement cluster',
  reset: 'Reverted to system baseline configuration',
  export: 'RBAC Matrix export queued: Generating PDF/CSV report...',
  audit: 'Running drift scan: No unauthorized privilege escalations detected.',
}

export const auditTrailFooter = {
  title: 'Immutable Access Audit Trail',
  before: 'Last authorized commit: ',
  strong: 'Today, 09:14 AM',
  after: ' by Eleanor Sterling (Super Admin)',
  linkLabel: 'View Detailed Changelog',
}
