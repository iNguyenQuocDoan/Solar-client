import type { TaskBucket, TaskPriorityFilter, TaskTypeFilter } from '@/components/tech/TaskFilterBar'
import type { ViewOption } from '@/components/tech/ViewToggle'
import type { ButtonVariant } from '@/components/stitch-ui/Button'
import type { StatusVariant } from '@/components/stitch-ui/StatusBadge'
import type { TaskAccent } from '@/components/stitch-ui/TaskCard'

/*
 * Dữ liệu giả cho /tech/tasks, nội dung lấy từ my_tasks_1/screen.png.
 * Elena Rostova (ORD-8821) và David Chen (ORD-8824) dùng chung id với lib/mock/techDashboard.ts.
 */

export const tasksHeader = {
  eyebrow: 'Field Dispatch Operations',
  eyebrowAccent: 'Zone 04 • Priority Queue',
  title: 'Technician Work Orders',
  quickAction: 'Quick Dispatch Action',
}

export type TaskView = 'list' | 'bento'

export const taskViewOptions: ViewOption<TaskView>[] = [
  { value: 'list', label: 'List Matrix', icon: 'table_rows' },
  { value: 'bento', label: 'Bento Cards', icon: 'grid_view' },
]

export const taskBuckets: TaskBucket[] = [
  { key: 'today', label: 'Today', count: 4 },
  { key: 'upcoming', label: 'Upcoming', count: 12 },
  { key: 'completed', label: 'Completed', count: 38 },
  { key: 'all', label: 'All Tasks' },
]

export const taskPriorities: TaskPriorityFilter[] = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High (3)', tone: 'error' },
  { key: 'normal', label: 'Normal' },
]

export const taskTypes: TaskTypeFilter[] = [
  { key: 'all', label: 'All Types (16)' },
  { key: 'survey', label: 'Site Survey (5)', icon: 'square_foot', iconClassName: 'text-secondary' },
  { key: 'installation', label: 'Installation (3)', icon: 'solar_power', iconClassName: 'text-primary' },
  { key: 'warranty', label: 'Warranty (4)', icon: 'shield_with_heart', iconClassName: 'text-error' },
  { key: 'maintenance', label: 'Maintenance (4)', icon: 'tune', iconClassName: 'text-tertiary-container' },
]

export const taskFilterCopy = {
  priorityLabel: 'Priority:',
  searchPlaceholder: 'Search customer, ID, SN, inverter...',
  searchShortcut: 'Ctrl K',
}

export const taskSyncNotice = {
  icon: 'sync',
  prefix: 'Displaying ',
  strong: '4 active assignments',
  suffix: ' scheduled for Marcus Vance today in Sector 4B / NorCal Central',
  meta: 'GPS Auto-Routing Enabled',
}

export const taskTableHeaders = {
  workOrder: 'Work Order',
  customer: 'Customer & Site',
  address: 'Address / Zone',
  time: 'Time Window',
  status: 'Status',
  actions: 'Rapid Action',
}

export type WorkOrder = {
  id: string
  /** Mã hiển thị "#ORD-8821" */
  code: string
  highPriority: boolean
  /** Khớp với key trong taskTypes để lọc */
  typeKey: 'survey' | 'installation' | 'warranty' | 'maintenance'
  /** Loại việc + icon màu theo loại */
  work: { label: string; icon: string; iconClassName: string }
  /** Dòng phụ dưới loại việc: serial, thiết bị… */
  reference: string
  customer: { name: string; phone: string; property: string; propertyIcon: string }
  site: { street: string; zone: string; distance: string }
  schedule: { time: string; duration: string; note: string; noteTone: 'primary' | 'muted' }
  status: { label: string; variant: StatusVariant; pulse?: boolean }
  /** Bước đang sáng trong "Shift Job Lifecycle Stage" của Quick Status Drawer (1-4) */
  lifecycleStage: 1 | 2 | 3 | 4
  action: { label: string; variant: ButtonVariant }
  /** Dùng cho chế độ xem Bento (TaskCard) */
  accent: TaskAccent
  typeVariant: StatusVariant
}

export const workOrders: WorkOrder[] = [
  {
    id: 'ORD-8821',
    code: '#ORD-8821',
    typeKey: 'survey',
    highPriority: true,
    work: { label: 'Site Survey & Pitch Audit', icon: 'square_foot', iconClassName: 'text-secondary' },
    reference: 'INV-77291 / 9.8kWp',
    customer: {
      name: 'Elena Rostova',
      phone: '+1 (415) 883-9021',
      property: '2-Story Residential • Tile',
      propertyIcon: 'home',
    },
    site: { street: '742 Evergreen Terrace', zone: 'San Rafael • Zone NorCal 4B', distance: '1.2 mi away' },
    schedule: { time: 'Today, 08:30 AM', duration: 'Duration: 90 mins', note: 'Active slot', noteTone: 'primary' },
    status: { label: 'In Progress', variant: 'success', pulse: true },
    lifecycleStage: 3,
    action: { label: 'Update Status', variant: 'primary' },
    accent: 'primary',
    typeVariant: 'primary',
  },
  {
    id: 'ORD-8824',
    code: '#ORD-8824',
    typeKey: 'installation',
    highPriority: false,
    work: { label: 'Inverter Swap & Commissioning', icon: 'solar_power', iconClassName: 'text-primary' },
    reference: 'SN: SE-7600H-US',
    customer: {
      name: 'David Chen',
      phone: '+1 (510) 412-8809',
      property: 'Single Family • Composite',
      propertyIcon: 'home',
    },
    site: { street: '1204 Oak Ridge Way', zone: 'Novato • Zone NorCal 4B', distance: '5.4 mi away' },
    schedule: { time: 'Today, 11:00 AM', duration: 'Duration: 180 mins', note: 'Next queue', noteTone: 'muted' },
    status: { label: 'En Route', variant: 'warning' },
    lifecycleStage: 2,
    action: { label: 'Update Status', variant: 'neutral' },
    accent: 'secondary',
    typeVariant: 'warning',
  },
  {
    id: 'ORD-8827',
    code: '#ORD-8827',
    typeKey: 'warranty',
    highPriority: true,
    work: { label: 'Battery BMS Rapid Discharge Audit', icon: 'shield_with_heart', iconClassName: 'text-error' },
    reference: 'Tesla Powerwall 2 • Batt #44',
    customer: {
      name: 'Kavita Patel',
      phone: '+1 (415) 309-1120',
      property: 'Townhouse • Flat Deck',
      propertyIcon: 'apartment',
    },
    site: { street: '410 Vista Grande', zone: 'Mill Valley • Zone NorCal 4B', distance: '11.8 mi away' },
    schedule: { time: 'Today, 02:30 PM', duration: 'Duration: 60 mins', note: 'Afternoon Window', noteTone: 'muted' },
    status: { label: 'Scheduled', variant: 'neutral' },
    lifecycleStage: 1,
    action: { label: 'Start Job', variant: 'neutral' },
    accent: 'error',
    typeVariant: 'error',
  },
  {
    id: 'ORD-8819',
    code: '#ORD-8819',
    typeKey: 'maintenance',
    highPriority: false,
    work: { label: 'Array Rewire & Optimizers Check', icon: 'tune', iconClassName: 'text-tertiary-container' },
    reference: 'SolEdge P401 • Strings A+B',
    customer: {
      name: 'Robert Morales',
      phone: '+1 (415) 771-4923',
      property: 'Single Family • Standing Seam Metal',
      propertyIcon: 'home',
    },
    site: { street: '89 Circle Drive', zone: 'Tiburon • Zone NorCal 4B', distance: '14.2 mi away' },
    schedule: { time: 'Today, 04:45 PM', duration: 'Duration: 45 mins', note: 'Wrap-up inspection', noteTone: 'muted' },
    status: { label: 'Awaiting Signoff', variant: 'pending' },
    lifecycleStage: 4,
    action: { label: 'Sign Off', variant: 'neutral' },
    accent: 'success',
    typeVariant: 'neutral',
  },
]

/*
 * Quick Status Drawer (#quickStatusDrawer trong my_tasks_1/code.html).
 * Phần đầu drawer lấy theo work order đang chọn; các khối dưới là nội dung dùng chung của thiết kế.
 */
export type LifecycleStage = {
  /** 1-4, khớp WorkOrder.lifecycleStage */
  value: 1 | 2 | 3 | 4
  label: string
  /** Class cho chấm tròn 8px bên trái, theo đúng code.html */
  dotClassName: string
}

export type DrawerChecklistItem = {
  id: string
  label: string
  description: string
  defaultChecked: boolean
}

export type DrawerPhoto = {
  id: string
  src: string
  alt: string
}

export const quickStatusDrawer = {
  sync: { label: 'Field Sync Engine Active' },
  closeLabel: 'Close quick status drawer',
  /** drawerCustomer trong code.html: "<tên khách> • <địa chỉ>" */
  customerSeparator: ' • ',
  lifecycle: {
    title: 'Shift Job Lifecycle Stage',
    stages: [
      { value: 1, label: '1. Scheduled', dotClassName: 'bg-outline' },
      { value: 2, label: '2. En Route', dotClassName: 'bg-secondary' },
      { value: 3, label: '3. In Progress', dotClassName: 'bg-primary-fixed' },
      { value: 4, label: '4. Verification', dotClassName: 'bg-secondary-container' },
    ] as LifecycleStage[],
  },
  checklist: {
    title: 'Mandatory Phase Checklist',
    items: [
      {
        id: 'ppe',
        label: 'PPE & Fall Protection Anchored',
        description: 'OSHA Roof safety compliance confirmed',
        defaultChecked: true,
      },
      {
        id: 'msp',
        label: 'Main Service Panel (MSP) Busbar Inspected',
        description: '200A main service & breaker clearance shot',
        defaultChecked: true,
      },
      {
        id: 'pitch',
        label: 'Roof Pitch & Attic Rafter Dimensions Logged',
        description: 'Laser measure readings stored',
        defaultChecked: false,
      },
    ] as DrawerChecklistItem[],
  },
  observation: {
    title: 'Technician Site Observation',
    dictateLabel: 'Dictate Voice Memo',
    dictateIcon: 'mic',
    placeholder:
      'Enter on-site notes (e.g., south-facing rafter spacing is 24 inches on center, minor tree shading after 4 PM)...',
  },
  photos: {
    /** "Job Site Photos (3 uploaded)" – 2 ảnh + 1 ô Add Slot như code.html */
    titleTemplate: 'Job Site Photos ({count} uploaded)',
    uploadedCount: 3,
    captureLabel: 'Take Photo',
    captureIcon: 'camera_alt',
    addSlotLabel: 'Add Slot',
    addSlotIcon: 'add_circle',
    items: [
      {
        id: 'breaker',
        src: '/placeholders/photo-breaker.svg',
        alt: 'Close up photograph of electrical breaker panel showing labels and clean wiring inside residential utility room.',
      },
      {
        id: 'roof',
        src: '/placeholders/photo-roof.svg',
        alt: 'Rooftop perspective photo showing south facing tile layout with blue sky and natural sunlight.',
      },
    ] as DrawerPhoto[],
  },
  footer: {
    commitLabel: 'Autosave & Sync to Dispatch',
    commitIcon: 'cloud_done',
    cancelLabel: 'Cancel',
  },
  toast: 'Work order synced to dispatch.',
}
