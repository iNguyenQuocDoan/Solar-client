import type { CompletedTask } from '@/components/tech/CompletedTaskCard'
import type { ScheduleDay } from '@/components/tech/ScheduleList'
import type { StatRibbonItem } from '@/components/tech/StatRibbon'
import type { ButtonVariant } from '@/components/stitch-ui/Button'
import type { StatusVariant } from '@/components/stitch-ui/StatusBadge'
import type { TaskAccent, TaskSpec } from '@/components/stitch-ui/TaskCard'

/*
 * Dữ liệu giả cho /tech, nội dung lấy từ technician_dashboard_1/screen.png.
 * id của 4 assignment trùng với lib/mock/tasks.ts và lib/mock/taskDetail.ts;
 * các việc đã xong dùng tiền tố CMP- để không đụng mã work order đang mở.
 */

export const dispatchRibbon = {
  unitLabel: 'Service Unit 12',
  readyLabel: 'Ready for Dispatch',
  busyLabel: 'On Break / En Route',
}

export const dailyStats: StatRibbonItem[] = [
  { key: 'active', icon: 'assignment_turned_in', value: '4', label: 'Active Today', tone: 'primary' },
  { key: 'surveys', icon: 'square_foot', value: '2', label: 'Pending Surveys', tone: 'neutral' },
  { key: 'installs', icon: 'solar_power', value: '1', label: 'Installation Active', tone: 'secondary' },
  { key: 'dispatches', icon: 'build_circle', value: '3', label: 'Dispatches', tone: 'success' },
]

export const todayHeading = {
  title: "Today's Assignments",
  subtitle: 'Wednesday, Oct 23',
  meta: 'Ordered by Schedule',
}

export type TodayAssignment = {
  id: string
  accent: TaskAccent
  type: { label: string; variant: StatusVariant }
  priority: { label: string; variant: StatusVariant }
  /** Góc phải thẻ: "Next Up • Starts in 24m" (boxed) hoặc khung giờ */
  meta: { icon: string; emphasis?: string; text: string; boxed?: boolean }
  title: string
  address: string
  phoneHref: string
  specs: TaskSpec[]
  primaryAction: { label: string; icon: string; variant?: ButtonVariant }
  mapAction: { label: string; icon: string }
}

export const todayAssignments: TodayAssignment[] = [
  {
    id: 'ORD-8821',
    accent: 'primary',
    type: { label: 'Site Survey', variant: 'primary' },
    priority: { label: 'High Priority', variant: 'error' },
    meta: { icon: 'timer', emphasis: 'Next Up', text: '• Starts in 24m', boxed: true },
    title: 'Elena Rostova',
    address: '842 Crestview Terrace, Los Gatos, CA',
    phoneHref: 'tel:5550192834',
    specs: [
      { label: 'Window', value: '09:00 - 10:30 AM' },
      { label: 'Roof Material', value: 'Spanish Tile (28°)' },
      { label: 'System Estimate', value: '11.4 kW • 26 Mod' },
    ],
    primaryAction: { label: 'Start Survey', icon: 'play_arrow' },
    mapAction: { label: 'Map', icon: 'directions' },
  },
  {
    id: 'ORD-8824',
    accent: 'secondary',
    type: { label: 'Installation (Day 2 of 2)', variant: 'warning' },
    priority: { label: 'Standard', variant: 'neutral' },
    meta: { icon: 'schedule', text: '11:15 AM - 02:30 PM' },
    title: 'David Chen • The Chen Residence',
    address: '1240 Oak Knolls Way, Saratoga, CA',
    phoneHref: 'tel:5550482910',
    specs: [
      { label: 'Sub-Panel', value: '200A Main Breaker' },
      { label: 'Inverter Pair', value: 'Enphase IQ8+ (x32)' },
      { label: 'Storage Unit', value: 'Tesla Powerwall 3' },
    ],
    primaryAction: { label: 'Resume Installation', icon: 'engineering' },
    mapAction: { label: 'Map', icon: 'directions' },
  },
  {
    id: 'ORD-8830',
    accent: 'error',
    type: { label: 'Warranty Dispatch', variant: 'error' },
    priority: { label: 'High Priority', variant: 'error' },
    meta: { icon: 'schedule', text: '03:00 - 04:15 PM' },
    title: 'Garrett • Highland Plaza',
    address: '339 Redwood Ave, San Jose, CA',
    phoneHref: 'tel:5550991122',
    specs: [
      { label: 'Alert Trigger', value: 'Microinverter Arc #04', tone: 'error' },
      { label: 'System Age', value: '11 Months (Gold Tier)' },
      { label: 'Replacement Unit', value: 'IQ8+ In Truck Stock' },
    ],
    primaryAction: { label: 'Inspect System', icon: 'build' },
    mapAction: { label: 'Map', icon: 'directions' },
  },
  {
    id: 'ORD-8833',
    accent: 'success',
    type: { label: 'Site Survey', variant: 'primary' },
    priority: { label: 'Standard', variant: 'neutral' },
    meta: { icon: 'schedule', text: '04:45 - 05:45 PM' },
    title: 'Theresa Montgomery',
    address: '510 Skyview Ridge, Cupertino, CA',
    phoneHref: 'tel:5550239918',
    specs: [
      { label: 'Scope', value: 'Attic • MSP • Rafters' },
      { label: 'Panel Upgrade', value: 'Required (125A → 200A)' },
      { label: 'Drone Flight', value: 'Permit Cleared' },
    ],
    primaryAction: { label: 'Upload Photos', icon: 'add_a_photo', variant: 'ghost' },
    mapAction: { label: 'Map', icon: 'directions' },
  },
]

export const upcomingHeading = {
  title: 'Upcoming Schedule (3-Day)',
  meta: '6 Dispatches Slated',
}

export const upcomingSchedule: ScheduleDay[] = [
  {
    id: 'thu-oct-24',
    label: 'Tomorrow • Thu Oct 24',
    tone: 'primary',
    note: '2 Inspections, 1 Comm Check',
    rows: [
      {
        id: 'ORD-8851',
        icon: 'verified',
        iconTone: 'primary',
        title: 'City AHJ Rough Inspection',
        subtitle: 'B. Sterling • 4410 Paseo Dr, Campbell',
        time: '08:30 AM',
        detail: 'Plans On-Site',
        badge: { label: 'Permit Ready', variant: 'ready' },
      },
      {
        id: 'ORD-8852',
        icon: 'solar_power',
        iconTone: 'secondary',
        title: 'Array Commissioning',
        subtitle: 'R. Patel • 900 Monte Vista, Sunnyvale',
        time: '01:00 PM',
        detail: 'SolarEdge SE7600',
        badge: { label: 'Pre-Staged', variant: 'neutral' },
      },
    ],
  },
  {
    id: 'fri-oct-25',
    label: 'Friday • Oct 25',
    tone: 'default',
    note: '1 Full Install kickoff',
    rows: [
      {
        id: 'ORD-8853',
        icon: 'roofing',
        iconTone: 'primary',
        title: 'Full Mount & Rail Installation',
        subtitle: 'Dr. J. Miller • 108 Blossom Hill, Los Gatos',
        time: '07:30 AM',
        detail: 'IronRidge XR100',
        badge: { label: 'Staged', variant: 'warning' },
      },
    ],
  },
]

export const completedHeading = {
  title: 'Recently Completed',
  meta: 'Verified QA',
}

export const recentlyCompleted: CompletedTask[] = [
  {
    id: 'CMP-8821',
    title: 'Site Survey #8821',
    address: '420 University Ave, Palo Alto',
    timestamp: 'Today • 08:15 AM',
    evidence: '18 Photos Uploaded',
    verification: 'Customer Signed',
  },
  {
    id: 'CMP-8814',
    title: 'Inverter Gateway Reset',
    address: '1921 Sunny Glen Way, San Jose',
    timestamp: 'Yesterday • 4:40 PM',
    evidence: '6 Photos Uploaded',
    verification: 'Remote Sync Active',
  },
  {
    id: 'CMP-8809',
    title: 'Main Lug Only Conversion',
    address: '885 Almaden Expy, San Jose',
    timestamp: 'Yesterday • 2:10 PM',
    evidence: '12 Photos • Torque Cert',
    verification: 'Passed QA',
  },
]
