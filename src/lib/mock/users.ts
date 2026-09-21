import type { SelectOption } from '@/components/stitch-ui/FilterBar'
import type { MetricCardProps } from '@/components/stitch-ui/MetricCard'
import type { Crumb } from '@/components/stitch-ui/PageHeader'
import type { StatusVariant } from '@/components/stitch-ui/StatusBadge'

/* Dữ liệu giả cho /admin/users, nội dung lấy từ user_management/screen.png. */

export const userRoleValues = [
  'super-admin',
  'lead-technician',
  'operations-manager',
  'sales-rep',
  'homeowner',
  'field-technician',
] as const
export type UserRole = (typeof userRoleValues)[number]

export type UserRoleMeta = {
  value: UserRole
  label: string
  shortLabel: string
  icon: string
  badgeVariant: StatusVariant
  clearance: string
  description: string
}

export const userRoles: UserRoleMeta[] = [
  {
    value: 'super-admin',
    label: 'Super Administrator (All Privileges)',
    shortLabel: 'Super Admin',
    icon: 'shield_person',
    badgeVariant: 'solid',
    clearance: 'Level 5',
    description:
      'Unrestricted administrative authority across all telemetry, commercial, dispatch, and AI configuration.',
  },
  {
    value: 'lead-technician',
    label: 'Lead Technician (Install, Telemetry & Field Comm)',
    shortLabel: 'Lead Technician',
    icon: 'build',
    badgeVariant: 'warning',
    clearance: 'Level 3',
    description: 'Authorizes hardware telemetry tuning, grid safety test toggles, and live inverter pairing.',
  },
  {
    value: 'operations-manager',
    label: 'Solar Operations Manager',
    shortLabel: 'Operations Mgr',
    icon: 'hub',
    badgeVariant: 'scheduled',
    clearance: 'Level 4',
    description: 'Manages crew schedules, engineering sign-offs, and high-tier hardware replacement approvals.',
  },
  {
    value: 'sales-rep',
    label: 'Sales Representative',
    shortLabel: 'Sales Rep',
    icon: 'monetization_on',
    badgeVariant: 'review',
    clearance: 'Level 2',
    description: 'Creates customer energy savings forecasts, builds system packages, and initiates proposals.',
  },
  {
    value: 'homeowner',
    label: 'Customer / Residential Homeowner',
    shortLabel: 'Homeowner',
    icon: 'cottage',
    badgeVariant: 'neutral',
    clearance: 'Level 1',
    description: 'Reads rooftop generation, requests support tickets, and inspects verified utility bills.',
  },
  {
    value: 'field-technician',
    label: 'Field Technician',
    shortLabel: 'Field Technician',
    icon: 'engineering',
    badgeVariant: 'neutral',
    clearance: 'Level 2',
    description: 'Uploads roof mounting imagery, records string inverter telemetry, and completes checklists.',
  },
]

export const userRoleMap = Object.fromEntries(userRoles.map((role) => [role.value, role])) as Record<
  UserRole,
  UserRoleMeta
>

export type UserStatus = 'active' | 'pending' | 'locked'

export const userStatuses: Record<UserStatus, { label: string; badgeVariant: StatusVariant }> = {
  active: { label: 'Active', badgeVariant: 'success' },
  pending: { label: 'Pending Verification', badgeVariant: 'review' },
  locked: { label: 'Locked', badgeVariant: 'error' },
}

export const regionZones: SelectOption[] = [
  { value: 'austin', label: 'Austin Metro Hub' },
  { value: 'san-antonio', label: 'San Antonio Outpost' },
  { value: 'norcal', label: 'NorCal Cluster' },
  { value: 'socal', label: 'SoCal Territory' },
  { value: 'pnw', label: 'Pacific NW Zone' },
]

export type UserRecord = {
  id: string
  employeeId: string
  name: string
  initials: string
  avatarSrc?: string
  avatarTone: 'primary' | 'secondary' | 'neutral' | 'error'
  department: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  /** Icon SSO verified cạnh tên */
  ssoVerified?: boolean
  /** Chấm xanh "Current Active Editor" cạnh tên */
  activeEditor?: boolean
  created: string
  lastActivity: string
  lastDevice: string
  regions: string[]
  mfaEnforced: boolean
  apiTokens: number
  identityLog: { event: string; when: string }[]
}

export const users: UserRecord[] = [
  {
    id: 'EMP-1001',
    employeeId: '#EMP-1001',
    name: 'Eleanor Sterling',
    initials: 'ES',
    avatarSrc: '/placeholders/avatar-1.svg',
    avatarTone: 'primary',
    department: 'Executive Office',
    email: 'e.sterling@smartsolar.io',
    phone: '+1 (415) 890-2134',
    role: 'super-admin',
    status: 'active',
    ssoVerified: true,
    created: 'Jan 14, 2023',
    lastActivity: '2 mins ago',
    lastDevice: 'Web Platform (Chrome/OSX)',
    regions: ['austin'],
    mfaEnforced: true,
    apiTokens: 4,
    identityLog: [
      { event: 'Approved SKU publication #SE7600', when: '1h ago' },
      { event: 'MFA device re-enrolled', when: '2d ago' },
    ],
  },
  {
    id: 'EMP-3319',
    employeeId: '#EMP-3319',
    name: 'Marcus Vance',
    initials: 'MV',
    avatarSrc: '/placeholders/avatar-2.svg',
    avatarTone: 'secondary',
    department: 'Field Operations',
    email: 'm.vance@smartsolar.io',
    phone: '+1 (512) 441-9022',
    role: 'lead-technician',
    status: 'active',
    activeEditor: true,
    created: 'Mar 02, 2023',
    lastActivity: '5 mins ago',
    lastDevice: 'Mobile App (Austin Hub)',
    regions: ['austin', 'san-antonio'],
    mfaEnforced: true,
    apiTokens: 2,
    identityLog: [
      { event: 'Inverter Config Override #902', when: '12m ago' },
      { event: 'Role Updated by Eleanor Sterling', when: '3d ago' },
    ],
  },
  {
    id: 'EMP-2084',
    employeeId: '#EMP-2084',
    name: 'Sarah Lin',
    initials: 'SL',
    avatarSrc: '/placeholders/avatar-3.svg',
    avatarTone: 'primary',
    department: 'Grid Orchestration',
    email: 's.lin@smartsolar.io',
    phone: '+1 (415) 322-8819',
    role: 'operations-manager',
    status: 'active',
    created: 'Jun 18, 2023',
    lastActivity: '1 hr ago',
    lastDevice: 'Web Platform (Edge/Win)',
    regions: ['norcal'],
    mfaEnforced: true,
    apiTokens: 1,
    identityLog: [{ event: 'Crew schedule published (Week 43)', when: '1h ago' }],
  },
  {
    id: 'EMP-5520',
    employeeId: '#EMP-5520',
    name: 'David Chen',
    initials: 'DC',
    avatarTone: 'neutral',
    department: 'Residential Advisory',
    email: 'd.chen@smartsolar.io',
    phone: '+1 (619) 540-1129',
    role: 'sales-rep',
    status: 'pending',
    created: 'Sep 03, 2024',
    lastActivity: 'Yesterday',
    lastDevice: 'Web Platform (Safari/OSX)',
    regions: ['socal'],
    mfaEnforced: false,
    apiTokens: 0,
    identityLog: [{ event: 'Invitation accepted, awaiting verification', when: '1d ago' }],
  },
  {
    id: 'CUST-9812',
    employeeId: '#CUST-9812',
    name: 'Alex Rivera',
    initials: 'AR',
    avatarTone: 'neutral',
    department: '12.4kW Array (NorCal)',
    email: 'alex.rivera84@gmail.com',
    phone: '+1 (408) 773-9011',
    role: 'homeowner',
    status: 'active',
    created: 'Feb 27, 2025',
    lastActivity: '3 days ago',
    lastDevice: 'Homeowner App (Android)',
    regions: ['norcal'],
    mfaEnforced: false,
    apiTokens: 0,
    identityLog: [{ event: 'Viewed monthly production report', when: '3d ago' }],
  },
  {
    id: 'EMP-1904',
    employeeId: '#EMP-1904',
    name: 'Robert Morales',
    initials: 'RM',
    avatarTone: 'error',
    department: 'Suspended (Failed MFA x5)',
    email: 'r.morales@smartsolar.io',
    phone: '+1 (512) 880-9931',
    role: 'field-technician',
    status: 'locked',
    created: 'Jun 04, 2023',
    lastActivity: '3 days ago',
    lastDevice: 'Auth Lockout Triggered',
    regions: ['austin'],
    mfaEnforced: true,
    apiTokens: 0,
    identityLog: [
      { event: 'Auth lockout after 5 failed MFA attempts', when: '3d ago' },
      { event: 'Password reset requested', when: '3d ago' },
    ],
  },
]

export const usersPageHeader = {
  breadcrumb: [
    { label: 'Administration' },
    { label: 'Platform Governance' },
    { label: 'Users' },
  ] satisfies Crumb[],
  syncStatus: 'Live Sync: Directory Connected (Azure AD / Okta SSO)',
  badges: { primary: 'Identity Access Mgmt', version: 'v4.18 Enterprise' },
  title: 'Platform User Accounts & Directory',
  description:
    'Manage platform role delegations, regional technician territories, and residential homeowner identities.',
  actions: { export: 'Export CSV', invite: '+ Invite New User' },
}

export const usersKpis: MetricCardProps[] = [
  {
    label: 'Total Users',
    value: '1,428',
    icon: 'group',
    tone: 'primary',
    delta: { text: '+4.2% from last month', direction: 'up' },
  },
  {
    label: 'Internal Staff',
    value: '144',
    icon: 'badge',
    tone: 'secondary',
    description: 'Technicians, Operations, Leads',
  },
  {
    label: 'Active Live Sessions',
    value: '86',
    icon: 'sensors',
    tone: 'tertiary',
    valueTone: 'tertiary',
    delta: { text: 'Authenticated right now', direction: 'flat', tone: 'positive', live: true },
  },
  {
    label: 'Suspended / Inactive',
    value: '12',
    icon: 'lock_clock',
    tone: 'error',
    valueTone: 'error',
    delta: { text: 'Action required: 3 pending audit', direction: 'flat' },
  },
]

export type RoleFilter = 'all' | 'super-admin' | 'operations-manager' | 'technician' | 'sales-rep' | 'homeowner'
export type StatusFilter = 'all' | UserStatus | 'inactive'

export const usersFilterOptions = {
  roles: [
    { value: 'all', label: 'All Roles (1,428)' },
    { value: 'super-admin', label: 'Administrator (6)' },
    { value: 'operations-manager', label: 'Manager (12)' },
    { value: 'technician', label: 'Technician (42)' },
    { value: 'sales-rep', label: 'Sales (84)' },
    { value: 'homeowner', label: 'Customer (1,284)' },
  ] satisfies { value: RoleFilter; label: string }[],
  statuses: [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending Verification' },
    { value: 'locked', label: 'Locked / Suspended' },
  ] satisfies { value: StatusFilter; label: string }[],
  regions: [{ value: 'all', label: 'All Regions' }, ...regionZones],
  searchPlaceholder: 'Search by full name, email, employee ID, phone...',
}

/** Chip "Active Scopes" trong thiết kế chỉ là nhãn minh họa, không lọc dữ liệu. */
export const usersDefaultScopes = ['Enterprise Only', 'MFA Enforced']

export const usersBulkActions = [
  { key: 'deactivate', icon: 'block', label: 'Deactivate Selected', hover: 'hover:text-error' },
  { key: 'resend', icon: 'mail', label: 'Resend Invites', hover: 'hover:text-primary' },
]

export const usersDirectory = {
  /** Tổng số trong thư mục thật; bảng mock chỉ là trang mẫu đầu tiên */
  total: 1428,
  initiallySelected: ['EMP-1001', 'EMP-3319'],
  pageSizeOptions: [10, 25, 50, 100],
}
