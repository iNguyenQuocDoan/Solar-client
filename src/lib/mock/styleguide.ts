import type { ChecklistState } from '@/components/stitch-ui/ChecklistItem'
import type { SelectOption } from '@/components/stitch-ui/FilterBar'
import type { MetricCardProps } from '@/components/stitch-ui/MetricCard'
import type { PhotoCardProps } from '@/components/stitch-ui/PhotoGrid'
import type { StatusVariant } from '@/components/stitch-ui/StatusBadge'
import type { TaskCardProps } from '@/components/stitch-ui/TaskCard'
import type { TimelineStepState } from '@/components/stitch-ui/Timeline'

/* Dữ liệu demo cho /styleguide, lấy từ nội dung các screen.png. */

export const styleguideBadges: { label: string; variant: StatusVariant; pulse?: boolean }[] = [
  { label: 'Submitted', variant: 'submitted' },
  { label: 'Under Review', variant: 'review' },
  { label: 'Survey Scheduled', variant: 'scheduled' },
  { label: 'In Progress', variant: 'in-progress' },
  { label: 'Active Warranty', variant: 'complete' },
  { label: 'High Priority Fault', variant: 'error', pulse: true },
  { label: 'Pending', variant: 'neutral' },
  { label: 'Site Survey', variant: 'primary' },
  { label: 'En Route', variant: 'warning' },
  { label: 'Active', variant: 'success' },
  { label: 'Active Now', variant: 'active', pulse: true },
]

export const styleguideMetrics: MetricCardProps[] = [
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
    delta: { text: 'Authenticated right now', direction: 'up', live: true },
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

export type StyleguideUser = {
  id: string
  name: string
  employeeId: string
  department: string
  email: string
  phone: string
  role: string
  roleVariant: StatusVariant
  status: string
  statusVariant: StatusVariant
  created: string
  lastActivity: string
  lastDevice: string
}

export const styleguideUsers: StyleguideUser[] = [
  {
    id: 'EMP-1001',
    name: 'Eleanor Sterling',
    employeeId: '#EMP-1001',
    department: 'Executive Office',
    email: 'e.sterling@smartsolar.io',
    phone: '+1 (415) 890-2134',
    role: 'Super Admin',
    roleVariant: 'primary',
    status: 'Active',
    statusVariant: 'success',
    created: 'Jan 14, 2023',
    lastActivity: '2 mins ago',
    lastDevice: 'Web Platform (Chrome/OSX)',
  },
  {
    id: 'EMP-3319',
    name: 'Marcus Vance',
    employeeId: '#EMP-3319',
    department: 'Field Operations',
    email: 'm.vance@smartsolar.io',
    phone: '+1 (512) 441-9022',
    role: 'Lead Technician',
    roleVariant: 'warning',
    status: 'Active',
    statusVariant: 'success',
    created: 'Mar 02, 2023',
    lastActivity: '14 mins ago',
    lastDevice: 'Field App (iOS)',
  },
  {
    id: 'EMP-2084',
    name: 'Sarah Lin',
    employeeId: '#EMP-2084',
    department: 'Grid Orchestration',
    email: 's.lin@smartsolar.io',
    phone: '+1 (415) 322-8819',
    role: 'Operations Manager',
    roleVariant: 'scheduled',
    status: 'Active',
    statusVariant: 'success',
    created: 'Jun 18, 2023',
    lastActivity: '1 hr ago',
    lastDevice: 'Web Platform (Edge/Win)',
  },
  {
    id: 'EMP-5520',
    name: 'David Chen',
    employeeId: '#EMP-5520',
    department: 'Residential Advisory',
    email: 'd.chen@smartsolar.io',
    phone: '+1 (619) 540-1129',
    role: 'Sales Consultant',
    roleVariant: 'review',
    status: 'Pending Verification',
    statusVariant: 'review',
    created: 'Sep 03, 2024',
    lastActivity: 'Yesterday',
    lastDevice: 'Web Platform (Safari/OSX)',
  },
  {
    id: 'CUST-9812',
    name: 'Alex Rivera',
    employeeId: '#CUST-9812',
    department: '12.4kW Array (NorCal)',
    email: 'alex.rivera84@gmail.com',
    phone: '+1 (408) 773-9011',
    role: 'Homeowner',
    roleVariant: 'neutral',
    status: 'Active',
    statusVariant: 'success',
    created: 'Feb 27, 2025',
    lastActivity: '3 days ago',
    lastDevice: 'Homeowner App (Android)',
  },
  {
    id: 'EMP-1904',
    name: 'Robert Morales',
    employeeId: '#EMP-1904',
    department: 'Field Operations',
    email: 'r.morales@smartsolar.io',
    phone: '+1 (512) 880-9931',
    role: 'Technician',
    roleVariant: 'warning',
    status: 'Suspended (Failed MFA x5)',
    statusVariant: 'error',
    created: 'Nov 11, 2022',
    lastActivity: '8 days ago',
    lastDevice: 'Field App (Android)',
  },
]

export const styleguideTaskCards: TaskCardProps[] = [
  {
    accent: 'primary',
    type: { label: 'Site Survey', variant: 'primary' },
    priority: { label: 'High Priority', variant: 'error' },
    meta: { icon: 'timer', emphasis: 'Next Up', text: 'Starts in 24m', boxed: true },
    title: 'Elena Rostova',
    address: '842 Crestview Terrace, Los Gatos, CA',
    phoneHref: 'tel:5550192834',
    specs: [
      { label: 'Window', value: '09:00 - 10:30 AM' },
      { label: 'Roof Material', value: 'Spanish Tile (28°)' },
      { label: 'System Estimate', value: '11.4 kW, 26 Mod' },
    ],
    primaryAction: { label: 'Start Survey', icon: 'play_arrow' },
    secondaryAction: { label: 'Map', icon: 'directions' },
  },
  {
    accent: 'error',
    type: { label: 'Warranty Dispatch', variant: 'error' },
    priority: { label: 'High Priority', variant: 'error' },
    meta: { icon: 'schedule', text: '03:00 - 04:15 PM' },
    title: 'Garrett, Highland Plaza',
    address: '339 Redwood Ave, San Jose, CA',
    phoneHref: 'tel:5550192835',
    specs: [
      { label: 'Alert Trigger', value: 'Microinverter Arc #04', tone: 'error' },
      { label: 'System Age', value: '11 Months (Gold Tier)' },
      { label: 'Replacement Unit', value: 'IQ8+ In Truck Stock' },
    ],
    primaryAction: { label: 'Inspect System', icon: 'build' },
    secondaryAction: { label: 'Map', icon: 'directions' },
  },
]

export const styleguideTimeline: {
  title: string
  description: string
  timestamp: string
  state: TimelineStepState
}[] = [
  { title: 'Assigned', description: 'Sarah Jenkins (Dispatch)', timestamp: 'Oct 22, 02:15 PM', state: 'done' },
  { title: 'Scheduled & Confirmed', description: 'SMS Confirmed by Client', timestamp: 'Oct 22, 03:30 PM', state: 'done' },
  { title: 'En Route', description: 'GPS Telemetry Check-in', timestamp: 'Oct 23, 08:15 AM', state: 'done' },
  { title: 'On-Site In Progress', description: 'Surveyor Marcus Vance', timestamp: 'Oct 23, 08:35 AM', state: 'current' },
  { title: 'Documentation & QA', description: 'Sign-Off & Sync', timestamp: 'Pending', state: 'upcoming' },
]

export type StyleguideChecklistItem = {
  id: string
  title: string
  description: string
  checked: boolean
  state?: ChecklistState
  status?: string
  statusIcon?: string
  progress?: { value: number; leftText: string; rightText: string }
}

export const styleguideChecklist: StyleguideChecklistItem[] = [
  {
    id: 'ppe',
    title: 'Personal Protective Equipment (Harnesses & Anchor Points Secured)',
    description: 'Full-body fall arrest harness inspect stamp: current. Dual ridge anchor clamps torqued.',
    checked: true,
    status: 'Verified 13:05',
  },
  {
    id: 'loto',
    title: 'Main Service Panel Lockout / Tagout (LOTO) Completed',
    description: '200A main breaker de-energized. Padlock ID #TX-489 tag fastened with zero energy confirmed.',
    checked: true,
    status: '12 ft-lbs torque checked',
    statusIcon: 'check_circle',
  },
  {
    id: 'dc-wire',
    title: 'DC Module Connections & Wire Management (18 / 24 Done)',
    description: 'Click MC4 connections fully seated. Stainless clips every 12 inches off roof surface.',
    checked: false,
    state: 'active',
    status: 'Active Now',
    progress: { value: 75, leftText: '6 panels remaining on South Plane array', rightText: '75% of step' },
  },
  {
    id: 'ac-disconnect',
    title: 'AC Disconnect Switch Installed & Grounded',
    description: '60A fused exterior AC disconnect adjacent to utility revenue meter with visible break blades.',
    checked: false,
    status: 'Pending',
  },
]

export const styleguidePhotos: Omit<PhotoCardProps, 'onZoom' | 'onReplace' | 'onNoteChange'>[] = [
  {
    src: '/placeholders/photo-roof.svg',
    alt: 'South face roof overview',
    tag: { label: 'South Face' },
    time: '10:14 AM',
    gpsTagged: true,
    title: 'South Face Overview',
    note: 'Shingle condition sound, 28° slope',
  },
  {
    src: '/placeholders/photo-panel.svg',
    alt: '200A main breaker panel',
    tag: { label: '200A Main Breaker' },
    time: '10:35 AM',
    gpsTagged: true,
    title: 'Busbar Label & 200A Breaker',
    note: '200A breaker / 225A bus',
  },
]

export const styleguideRoleOptions: SelectOption[] = [
  { value: 'all', label: 'All Roles (1,428)' },
  { value: 'admin', label: 'Administrator (6)' },
  { value: 'manager', label: 'Manager (12)' },
  { value: 'technician', label: 'Technician (42)' },
  { value: 'sales', label: 'Sales (84)' },
  { value: 'customer', label: 'Customer (1,284)' },
]

export const styleguideStatusOptions: SelectOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending Verification' },
  { value: 'locked', label: 'Locked / Suspended' },
]

export const styleguideRegionOptions: SelectOption[] = [
  { value: 'all', label: 'All Regions' },
  { value: 'norcal', label: 'NorCal Cluster' },
  { value: 'austin', label: 'Austin Metro Hub' },
  { value: 'socal', label: 'SoCal Territory' },
]

export const styleguideTimeChips: { key: string; label: string; count?: number }[] = [
  { key: 'today', label: 'Today', count: 4 },
  { key: 'upcoming', label: 'Upcoming', count: 12 },
  { key: 'completed', label: 'Completed', count: 38 },
  { key: 'all', label: 'All Tasks' },
]

export const styleguideTypeChips: { key: string; label: string; icon?: string; iconClassName?: string }[] = [
  { key: 'all', label: 'All Types (16)' },
  { key: 'survey', label: 'Site Survey (5)', icon: 'square_foot', iconClassName: 'text-secondary' },
  { key: 'install', label: 'Installation (3)', icon: 'solar_power', iconClassName: 'text-primary' },
  { key: 'warranty', label: 'Warranty (4)', icon: 'shield_with_heart', iconClassName: 'text-error' },
  { key: 'maintenance', label: 'Maintenance (4)', icon: 'tune', iconClassName: 'text-tertiary-container' },
]

export const styleguidePageHeader = {
  breadcrumb: [{ label: 'Administration', href: '/admin' }, { label: 'System Overview' }],
  metaText: 'Cluster Node: US-Central-Primary (Active)',
  title: 'System Overview',
  description:
    'Real-time surveillance of platform telemetry, algorithmic constant configurations, and enterprise audit trails.',
}
