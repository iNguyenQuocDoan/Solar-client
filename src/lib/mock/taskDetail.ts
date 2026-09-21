import type { TimelineEntry } from '@/components/tech/VerticalTimeline'
import type { WorkOrderFact, WorkOrderMetric } from '@/components/tech/WorkOrderHeaderCard'
import type { Crumb } from '@/components/stitch-ui/PageHeader'
import type { StatusVariant } from '@/components/stitch-ui/StatusBadge'
import type { TimelineStepProps } from '@/components/stitch-ui/Timeline'
import { ROUTES } from '@/constants/routes'

/*
 * Dữ liệu giả cho /tech/tasks/:id, nội dung ORD-8821 lấy từ task_detail_timeline/screen.png.
 * id, tên khách và trạng thái khớp lib/mock/tasks.ts (bảng work order) và lib/mock/techDashboard.ts.
 * Thiết kế ghi chủ nhà là "Marcus Vance" – trùng tên kỹ thuật viên – nên dùng Elena Rostova
 * theo my_tasks_1 để ba màn nhất quán.
 */

export type TaskDetail = {
  id: string
  code: string
  breadcrumb: Crumb[]
  actions: { share: string; export: string; dossier: { label: string; icon: string } }
  summary: {
    icon: string
    status: { label: string; variant: StatusVariant }
    syncLabel?: string
    title: string
    facts: WorkOrderFact[]
    metrics: WorkOrderMetric[]
  }
  lifecycle: {
    title: string
    description: string
    badge: string
    steps: Omit<TimelineStepProps, 'index'>[]
  }
  auditLog: { title: string; meta: string; entries: TimelineEntry[] }
  fieldNote: {
    title: string
    hint: string
    dictation: { title: string; hint: string }
    placeholder: string
    submitLabel: string
  }
  geolocation: {
    title: string
    precision: string
    map: { src: string; alt: string; address: string; coords: string }
    checklistTitle: string
    checklist: string[]
  }
  signOff: {
    title: string
    badge: string
    badgeVariant: StatusVariant
    initials: string
    name: string
    contact: string
    signedNote: string
    hash: string
    verifyLabel: string
  } | null
}

const surveyCrumbs = (code: string): Crumb[] => [
  { label: 'Work Orders', href: ROUTES.TECH.TASKS },
  { label: 'Site Surveys', href: ROUTES.TECH.SURVEYS },
  { label: code },
]

const jobCrumbs = (section: string, href: string, code: string): Crumb[] => [
  { label: 'Work Orders', href: ROUTES.TECH.TASKS },
  { label: section, href },
  { label: code },
]

const fieldNote = {
  title: 'Add Field Note',
  hint: 'Append to log',
  dictation: { title: 'Voice Dictation', hint: 'Tap mic to speak note' },
  placeholder: 'Type or dictate observation (e.g. attic conduit access, customer gate code, dog on property)...',
  submitLabel: 'Post to Audit Log',
}

const actions = {
  share: 'Share with Rep',
  export: 'Export PDF Audit',
  dossier: { label: 'Open Survey Dossier', icon: 'menu_book' },
}

/** ORD-8821 – bản đầy đủ dựng đúng theo task_detail_timeline. */
const ord8821: TaskDetail = {
  id: 'ORD-8821',
  code: '#ORD-8821',
  breadcrumb: surveyCrumbs('#ORD-8821'),
  actions,
  summary: {
    icon: 'solar_power',
    status: { label: 'Completed & Synced to Dispatch', variant: 'ready' },
    syncLabel: 'Synced 10:48 AM',
    title: 'Residential Solar Site Survey & Electrical Feasibility Audit',
    facts: [
      { icon: 'person', text: 'Elena Rostova (Homeowner)', emphasis: true },
      { icon: 'pin_drop', text: '742 Evergreen Terrace, San Rafael CA 94901' },
      { icon: 'bolt', text: '200A Service • Tile Roof 28°' },
    ],
    metrics: [
      { label: 'Duration', value: '2h 10m', caption: 'On-site audit window' },
      { label: 'Assets', value: '8 Photos', caption: 'Verified Pitch & Breaker' },
      { label: 'Tech Lead', value: 'Marcus V.', caption: 'Unit 12 NorCal', valueTone: 'primary' },
    ],
  },
  lifecycle: {
    title: 'Lifecycle Progression',
    description: 'Deterministic status progression with end-to-end telemetry verifications',
    badge: 'All 5 Milestones Certified',
    steps: [
      { title: 'Assigned', description: 'Sarah Jenkins (Dispatch)', timestamp: 'Oct 22 • 02:15 PM', state: 'done' },
      {
        title: 'Scheduled & Confirmed',
        description: 'SMS Confirmed by Client',
        timestamp: 'Oct 22 • 03:30 PM',
        state: 'done',
      },
      { title: 'En Route', description: 'GPS Telemetry Check-in', timestamp: 'Oct 23 • 08:15 AM', state: 'done' },
      {
        title: 'On-Site In Progress',
        description: 'Surveyor Marcus Vance',
        timestamp: 'Oct 23 • 08:35 AM',
        state: 'done',
      },
      {
        title: 'Documentation & QA',
        description: 'Sign-Off & Sync Finished',
        timestamp: 'Oct 23 • 10:45 AM',
        state: 'current',
      },
    ],
  },
  auditLog: {
    title: 'Chronological Audit Log',
    meta: 'Immutable Ledger • 6 Entries',
    entries: [
      {
        id: 'log-1045',
        nodeIcon: 'photo_camera',
        nodeTone: 'primary',
        author: { name: 'Marcus Vance', initials: 'MV' },
        role: { label: 'Lead Tech', variant: 'ready' },
        timestamp: 'Today • 10:45 AM',
        body: {
          text: 'Uploaded 8 site survey photos (Roof slope, Main Inverter layout, 200A MSP, Shading obstacle at south edge). Verified structural roof pitch at 28° with inclinometer.',
        },
        media: [
          { src: '/placeholders/photo-roof.svg', alt: 'Mái ngói và rafter dưới nắng sớm', label: 'Roof 28°' },
          { src: '/placeholders/photo-breaker.svg', alt: 'Tủ điện chính 200A mở nắp', label: '200A MSP' },
          {
            src: '/placeholders/photo-microinverter.svg',
            alt: 'Đường ống dẫn của inverter trên tường ngoài',
            label: 'Inverter Path',
          },
          { src: '/placeholders/photo-yard.svg', alt: 'Toàn cảnh mái nhìn về hướng nam', overlay: '+5 more' },
        ],
        chips: [
          { icon: 'straighten', label: 'Pitch: 28° Confirmed' },
          { icon: 'check_circle', label: 'Rafter Spacing: 24" O.C.' },
          { icon: 'cloud_upload', label: '8 RAW Images Encrypted' },
        ],
      },
      {
        id: 'log-0930',
        nodeIcon: 'edit_note',
        nodeTone: 'accent',
        author: { name: 'Marcus Vance', initials: 'MV' },
        role: { label: 'Lead Tech', variant: 'ready' },
        timestamp: 'Today • 09:30 AM',
        body: {
          text: 'Updated inspection form: Main breaker has dual-pole 40A slot available at slots 18 & 20. Busbar rating 225A / Main 200A.',
          strong: 'No panel upgrade (MPU) required.',
          tail: 'Saves customer ~$2,800.',
        },
        note: {
          icon: 'verified_user',
          text: 'NEC 120% Rule Compliance Cleared: Busbar headroom sufficient for 7.6kW solar backfeed.',
        },
      },
      {
        id: 'log-0835',
        nodeIcon: 'near_me',
        nodeTone: 'tint',
        author: { name: 'System Auto-Log', initials: 'SYS', tone: 'neutral' },
        role: { label: 'Geofence IoT', variant: 'neutral' },
        timestamp: 'Today • 08:35 AM',
        body: {
          text: 'Technician arrived on site. Geofence verified within 50m of property perimeter (Lat: 37.7749, Lng: -122.4194).',
        },
        subNote: 'Mobile terminal #4402 handshake established with Homeowner BLE beacon.',
      },
      {
        id: 'log-0812',
        nodeIcon: 'local_shipping',
        nodeTone: 'muted',
        author: { name: 'Marcus Vance', initials: 'MV' },
        timestamp: 'Today • 08:12 AM',
        body: {
          text: 'Departed regional depot in Service Van #12. Real-time telemetry navigation started. Estimated arrival time: 18 minutes.',
        },
      },
      {
        id: 'log-1600',
        nodeIcon: 'home_repair_service',
        nodeTone: 'muted',
        author: { name: 'Marcus Vance', initials: 'MV' },
        timestamp: 'Oct 22 • 04:00 PM',
        body: {
          text: 'Confirmed vehicle equipment manifest: Inclinometer calibrated, 24ft fiberglass Type IA ladder secured, laser distance measurer loaded, drone inspection kit battery at 100%.',
        },
      },
      {
        id: 'log-1415',
        nodeIcon: 'assignment_ind',
        nodeTone: 'muted',
        author: { name: 'Sarah Jenkins', initials: 'SJ', tone: 'secondary' },
        role: { label: 'Dispatch Supervisor', variant: 'warning' },
        timestamp: 'Oct 22 • 02:15 PM',
        body: {
          text: 'Work order instantiated and assigned to Marcus Vance based on North Zone priority routing and licensed electrical cert #E-9912.',
        },
      },
    ],
  },
  fieldNote,
  geolocation: {
    title: 'Site Geolocation',
    precision: 'GPS Precision: 1.2m',
    map: {
      src: '/placeholders/map-site.svg',
      alt: 'Bản đồ vị trí 742 Evergreen Terrace',
      address: '742 Evergreen Terrace',
      coords: 'Lat: 37.77 • Lng: -122.41',
    },
    checklistTitle: 'Field Audit Checklist Results',
    checklist: ['Attic Rafters: Intact', 'MSP: 200A Clean', 'Roof Pitch: 28° South', 'Tree Shading: Minor'],
  },
  signOff: {
    title: 'Customer Sign-Off',
    badge: 'Signed Digitally',
    badgeVariant: 'ready',
    initials: 'ER',
    name: 'Elena Rostova',
    contact: 'e.rostova@email.com • (415) 883-9021',
    signedNote: 'Signed on mobile glass at 10:44 AM',
    hash: 'Audit SHA-256: 4f8a...c902',
    verifyLabel: 'Verify Hash',
  },
}

/** ORD-8824 – đang trên đường tới hiện trường (khớp trạng thái "En Route" ở bảng work order). */
const ord8824: TaskDetail = {
  id: 'ORD-8824',
  code: '#ORD-8824',
  breadcrumb: jobCrumbs('Installations', ROUTES.TECH.INSTALLATIONS, '#ORD-8824'),
  actions: { ...actions, dossier: { label: 'Open Install Packet', icon: 'menu_book' } },
  summary: {
    icon: 'solar_power',
    status: { label: 'En Route • ETA 12 mins', variant: 'warning' },
    syncLabel: 'Synced 10:52 AM',
    title: 'Inverter Swap & Commissioning – SolarEdge HD-Wave',
    facts: [
      { icon: 'person', text: 'David Chen (Homeowner)', emphasis: true },
      { icon: 'pin_drop', text: '1204 Oak Ridge Way, Novato CA 94947' },
      { icon: 'bolt', text: 'SN: SE-7600H-US • Composite Roof' },
    ],
    metrics: [
      { label: 'Duration', value: '180 min', caption: 'Planned service window' },
      { label: 'Assets', value: '2 Photos', caption: 'Staging check only' },
      { label: 'Tech Lead', value: 'Marcus V.', caption: 'Unit 12 NorCal', valueTone: 'primary' },
    ],
  },
  lifecycle: {
    title: 'Lifecycle Progression',
    description: 'Deterministic status progression with end-to-end telemetry verifications',
    badge: '2 of 5 Milestones Certified',
    steps: [
      { title: 'Assigned', description: 'Sarah Jenkins (Dispatch)', timestamp: 'Oct 22 • 09:10 AM', state: 'done' },
      {
        title: 'Scheduled & Confirmed',
        description: 'Call Confirmed by Client',
        timestamp: 'Oct 22 • 01:05 PM',
        state: 'done',
      },
      { title: 'En Route', description: 'GPS Telemetry Check-in', timestamp: 'Oct 23 • 10:48 AM', state: 'current' },
      { title: 'On-Site In Progress', description: 'Awaiting arrival', state: 'upcoming' },
      { title: 'Documentation & QA', description: 'Sign-Off & Sync pending', state: 'upcoming' },
    ],
  },
  auditLog: {
    title: 'Chronological Audit Log',
    meta: 'Immutable Ledger • 3 Entries',
    entries: [
      {
        id: 'log-8824-1048',
        nodeIcon: 'near_me',
        nodeTone: 'primary',
        author: { name: 'System Auto-Log', initials: 'SYS', tone: 'neutral' },
        role: { label: 'Route IoT', variant: 'neutral' },
        timestamp: 'Today • 10:48 AM',
        body: { text: 'Service Van #12 departed depot. Live routing estimates arrival at 11:00 AM for the 180 minute window.' },
        subNote: 'Traffic buffer 6 minutes • Next stop after ORD-8821.',
      },
      {
        id: 'log-8824-0920',
        nodeIcon: 'inventory_2',
        nodeTone: 'accent',
        author: { name: 'Marcus Vance', initials: 'MV' },
        role: { label: 'Lead Tech', variant: 'ready' },
        timestamp: 'Today • 09:20 AM',
        body: { text: 'Replacement inverter staged on truck and scanned against work order. Torque wrench and DC disconnect kit verified.' },
        note: { icon: 'verified_user', text: 'Serial SE-7600H-US matched to customer asset record.' },
      },
      {
        id: 'log-8824-1305',
        nodeIcon: 'assignment_ind',
        nodeTone: 'muted',
        author: { name: 'Sarah Jenkins', initials: 'SJ', tone: 'secondary' },
        role: { label: 'Dispatch Supervisor', variant: 'warning' },
        timestamp: 'Oct 22 • 01:05 PM',
        body: { text: 'Customer confirmed the 11:00 AM slot by phone. Gate code shared with the assigned technician only.' },
      },
    ],
  },
  fieldNote,
  geolocation: {
    title: 'Site Geolocation',
    precision: 'GPS Precision: 2.4m',
    map: {
      src: '/placeholders/map-site.svg',
      alt: 'Bản đồ vị trí 1204 Oak Ridge Way',
      address: '1204 Oak Ridge Way',
      coords: 'Lat: 38.10 • Lng: -122.56',
    },
    checklistTitle: 'Pre-Arrival Checklist',
    checklist: ['Inverter Staged', 'Permit On File', 'Roof Access Clear', 'Customer Notified'],
  },
  signOff: null,
}

/** ORD-8827 – đã lên lịch, chưa bắt đầu. */
const ord8827: TaskDetail = {
  id: 'ORD-8827',
  code: '#ORD-8827',
  breadcrumb: jobCrumbs('Warranty & Maintenance', ROUTES.TECH.WARRANTY, '#ORD-8827'),
  actions: { ...actions, dossier: { label: 'Open Warranty File', icon: 'menu_book' } },
  summary: {
    icon: 'shield_with_heart',
    status: { label: 'Scheduled • 02:30 PM', variant: 'neutral' },
    title: 'Battery BMS Rapid Discharge Audit – Tesla Powerwall 2',
    facts: [
      { icon: 'person', text: 'Kavita Patel (Homeowner)', emphasis: true },
      { icon: 'pin_drop', text: '410 Vista Grande, Mill Valley CA 94941' },
      { icon: 'bolt', text: 'Battery #44 • Townhouse Flat Deck' },
    ],
    metrics: [
      { label: 'Duration', value: '60 min', caption: 'Afternoon window' },
      { label: 'Assets', value: '0 Photos', caption: 'Capture on arrival' },
      { label: 'Tech Lead', value: 'Marcus V.', caption: 'Unit 12 NorCal', valueTone: 'primary' },
    ],
  },
  lifecycle: {
    title: 'Lifecycle Progression',
    description: 'Deterministic status progression with end-to-end telemetry verifications',
    badge: '2 of 5 Milestones Certified',
    steps: [
      { title: 'Assigned', description: 'Sarah Jenkins (Dispatch)', timestamp: 'Oct 22 • 04:40 PM', state: 'done' },
      {
        title: 'Scheduled & Confirmed',
        description: 'SMS Confirmed by Client',
        timestamp: 'Oct 23 • 07:05 AM',
        state: 'current',
      },
      { title: 'En Route', description: 'Departs after ORD-8824', state: 'upcoming' },
      { title: 'On-Site In Progress', description: 'Battery diagnostics', state: 'upcoming' },
      { title: 'Documentation & QA', description: 'Sign-Off & Sync pending', state: 'upcoming' },
    ],
  },
  auditLog: {
    title: 'Chronological Audit Log',
    meta: 'Immutable Ledger • 2 Entries',
    entries: [
      {
        id: 'log-8827-0705',
        nodeIcon: 'sms',
        nodeTone: 'accent',
        author: { name: 'System Auto-Log', initials: 'SYS', tone: 'neutral' },
        role: { label: 'Messaging', variant: 'neutral' },
        timestamp: 'Today • 07:05 AM',
        body: { text: 'Customer confirmed the 02:30 PM afternoon window by SMS. Access notes: park on the street, deck gate unlocked.' },
      },
      {
        id: 'log-8827-1640',
        nodeIcon: 'warning',
        nodeTone: 'muted',
        author: { name: 'Sarah Jenkins', initials: 'SJ', tone: 'secondary' },
        role: { label: 'Dispatch Supervisor', variant: 'warning' },
        timestamp: 'Oct 22 • 04:40 PM',
        body: {
          text: 'Escalated to high priority after telemetry flagged three rapid discharge events in 24 hours.',
          strong: 'Battery held under Gold Tier warranty.',
        },
      },
    ],
  },
  fieldNote,
  geolocation: {
    title: 'Site Geolocation',
    precision: 'GPS Precision: 3.1m',
    map: {
      src: '/placeholders/map-site.svg',
      alt: 'Bản đồ vị trí 410 Vista Grande',
      address: '410 Vista Grande',
      coords: 'Lat: 37.90 • Lng: -122.54',
    },
    checklistTitle: 'Pre-Visit Checklist',
    checklist: ['Warranty Valid', 'Spare BMS In Van', 'Deck Access Noted', 'Customer Reachable'],
  },
  signOff: null,
}

/** ORD-8819 – đã xong phần việc, chờ khách ký. */
const ord8819: TaskDetail = {
  id: 'ORD-8819',
  code: '#ORD-8819',
  breadcrumb: jobCrumbs('Warranty & Maintenance', ROUTES.TECH.WARRANTY, '#ORD-8819'),
  actions: { ...actions, dossier: { label: 'Open Service Report', icon: 'menu_book' } },
  summary: {
    icon: 'tune',
    status: { label: 'Awaiting Customer Signoff', variant: 'pending' },
    syncLabel: 'Synced 04:31 PM',
    title: 'Array Rewire & Optimizers Check – SolarEdge P401 Strings A+B',
    facts: [
      { icon: 'person', text: 'Robert Morales (Homeowner)', emphasis: true },
      { icon: 'pin_drop', text: '89 Circle Drive, Tiburon CA 94920' },
      { icon: 'bolt', text: 'Standing Seam Metal • Strings A+B' },
    ],
    metrics: [
      { label: 'Duration', value: '45 min', caption: 'Wrap-up inspection' },
      { label: 'Assets', value: '5 Photos', caption: 'String map & optimizers' },
      { label: 'Tech Lead', value: 'Marcus V.', caption: 'Unit 12 NorCal', valueTone: 'primary' },
    ],
  },
  lifecycle: {
    title: 'Lifecycle Progression',
    description: 'Deterministic status progression with end-to-end telemetry verifications',
    badge: '4 of 5 Milestones Certified',
    steps: [
      { title: 'Assigned', description: 'Sarah Jenkins (Dispatch)', timestamp: 'Oct 21 • 11:20 AM', state: 'done' },
      { title: 'Scheduled & Confirmed', description: 'Email Confirmed', timestamp: 'Oct 21 • 02:00 PM', state: 'done' },
      { title: 'En Route', description: 'GPS Telemetry Check-in', timestamp: 'Oct 23 • 04:05 PM', state: 'done' },
      { title: 'On-Site In Progress', description: 'Rewire completed', timestamp: 'Oct 23 • 04:20 PM', state: 'done' },
      { title: 'Documentation & QA', description: 'Waiting on signature', state: 'current' },
    ],
  },
  auditLog: {
    title: 'Chronological Audit Log',
    meta: 'Immutable Ledger • 3 Entries',
    entries: [
      {
        id: 'log-8819-1631',
        nodeIcon: 'draw',
        nodeTone: 'primary',
        author: { name: 'Marcus Vance', initials: 'MV' },
        role: { label: 'Lead Tech', variant: 'ready' },
        timestamp: 'Today • 04:31 PM',
        body: { text: 'Signature request sent to the homeowner tablet. Service report and torque certificate attached for review.' },
        chips: [
          { icon: 'check_circle', label: 'Optimizers: 24 Online' },
          { icon: 'straighten', label: 'String Voltage: Nominal' },
        ],
      },
      {
        id: 'log-8819-1620',
        nodeIcon: 'photo_camera',
        nodeTone: 'accent',
        author: { name: 'Marcus Vance', initials: 'MV' },
        role: { label: 'Lead Tech', variant: 'ready' },
        timestamp: 'Today • 04:20 PM',
        body: { text: 'Rewired strings A and B, replaced two corroded MC4 connectors and re-seated optimizer #14.' },
        media: [
          { src: '/placeholders/photo-panel.svg', alt: 'Dãy tấm pin sau khi đi lại dây', label: 'String A' },
          { src: '/placeholders/photo-microinverter.svg', alt: 'Optimizer sau khi lắp lại', label: 'Optimizer 14' },
        ],
      },
      {
        id: 'log-8819-1405',
        nodeIcon: 'assignment_ind',
        nodeTone: 'muted',
        author: { name: 'Sarah Jenkins', initials: 'SJ', tone: 'secondary' },
        role: { label: 'Dispatch Supervisor', variant: 'warning' },
        timestamp: 'Oct 21 • 11:20 AM',
        body: { text: 'Maintenance ticket created from the monitoring alert on strings A+B and routed to the North Zone queue.' },
      },
    ],
  },
  fieldNote,
  geolocation: {
    title: 'Site Geolocation',
    precision: 'GPS Precision: 1.8m',
    map: {
      src: '/placeholders/map-site.svg',
      alt: 'Bản đồ vị trí 89 Circle Drive',
      address: '89 Circle Drive',
      coords: 'Lat: 37.87 • Lng: -122.45',
    },
    checklistTitle: 'Field Audit Checklist Results',
    checklist: ['Strings A+B: Rewired', 'Optimizers: 24 Online', 'Torque Cert: Logged', 'Roof Seal: Intact'],
  },
  signOff: {
    title: 'Customer Sign-Off',
    badge: 'Awaiting Signature',
    badgeVariant: 'pending',
    initials: 'RM',
    name: 'Robert Morales',
    contact: 'r.morales@email.com • (415) 771-4923',
    signedNote: 'Signature link opened at 04:33 PM',
    hash: 'Audit SHA-256: 91c4...7ab1',
    verifyLabel: 'Verify Hash',
  },
}

/** ORD-8830 – phiếu bảo hành trên dashboard (Garrett • Highland Plaza). */
const ord8830: TaskDetail = {
  id: 'ORD-8830',
  code: '#ORD-8830',
  breadcrumb: jobCrumbs('Warranty & Maintenance', ROUTES.TECH.WARRANTY, '#ORD-8830'),
  actions: { ...actions, dossier: { label: 'Open Warranty File', icon: 'menu_book' } },
  summary: {
    icon: 'build_circle',
    status: { label: 'Dispatch Scheduled • 03:00 PM', variant: 'neutral' },
    title: 'Microinverter Arc Fault Inspection – Highland Plaza',
    facts: [
      { icon: 'person', text: 'Garrett (Site Manager)', emphasis: true },
      { icon: 'pin_drop', text: '339 Redwood Ave, San Jose CA 95110' },
      { icon: 'bolt', text: 'Microinverter Arc #04 • Gold Tier' },
    ],
    metrics: [
      { label: 'Duration', value: '75 min', caption: 'Afternoon dispatch' },
      { label: 'Assets', value: '1 Photo', caption: 'Alert screenshot' },
      { label: 'Tech Lead', value: 'Marcus V.', caption: 'Unit 12 NorCal', valueTone: 'primary' },
    ],
  },
  lifecycle: {
    title: 'Lifecycle Progression',
    description: 'Deterministic status progression with end-to-end telemetry verifications',
    badge: '2 of 5 Milestones Certified',
    steps: [
      { title: 'Assigned', description: 'Auto-routed from alert', timestamp: 'Oct 23 • 06:40 AM', state: 'done' },
      { title: 'Scheduled & Confirmed', description: 'Site manager notified', timestamp: 'Oct 23 • 07:15 AM', state: 'current' },
      { title: 'En Route', description: 'Departs after ORD-8827', state: 'upcoming' },
      { title: 'On-Site In Progress', description: 'Arc fault inspection', state: 'upcoming' },
      { title: 'Documentation & QA', description: 'Sign-Off & Sync pending', state: 'upcoming' },
    ],
  },
  auditLog: {
    title: 'Chronological Audit Log',
    meta: 'Immutable Ledger • 2 Entries',
    entries: [
      {
        id: 'log-8830-0715',
        nodeIcon: 'notifications_active',
        nodeTone: 'accent',
        author: { name: 'System Auto-Log', initials: 'SYS', tone: 'neutral' },
        role: { label: 'Fleet Telemetry', variant: 'neutral' },
        timestamp: 'Today • 07:15 AM',
        body: {
          text: 'Arc fault repeated on microinverter #04 for the third consecutive morning.',
          strong: 'Replacement IQ8+ confirmed in truck stock.',
        },
      },
      {
        id: 'log-8830-0640',
        nodeIcon: 'assignment_ind',
        nodeTone: 'muted',
        author: { name: 'Sarah Jenkins', initials: 'SJ', tone: 'secondary' },
        role: { label: 'Dispatch Supervisor', variant: 'warning' },
        timestamp: 'Today • 06:40 AM',
        body: { text: 'Warranty dispatch created from the monitoring alert and routed to the nearest certified technician.' },
      },
    ],
  },
  fieldNote,
  geolocation: {
    title: 'Site Geolocation',
    precision: 'GPS Precision: 2.0m',
    map: {
      src: '/placeholders/map-site.svg',
      alt: 'Bản đồ vị trí 339 Redwood Ave',
      address: '339 Redwood Ave',
      coords: 'Lat: 37.33 • Lng: -121.89',
    },
    checklistTitle: 'Pre-Visit Checklist',
    checklist: ['Alert Logged', 'IQ8+ In Truck Stock', 'Roof Access Booked', 'Site Manager Reachable'],
  },
  signOff: null,
}

/** ORD-8833 – khảo sát cuối ngày trên dashboard (Theresa Montgomery). */
const ord8833: TaskDetail = {
  id: 'ORD-8833',
  code: '#ORD-8833',
  breadcrumb: surveyCrumbs('#ORD-8833'),
  actions,
  summary: {
    icon: 'square_foot',
    status: { label: 'Scheduled • 04:45 PM', variant: 'neutral' },
    title: 'Residential Site Survey – Attic, MSP & Rafter Scope',
    facts: [
      { icon: 'person', text: 'Theresa Montgomery (Homeowner)', emphasis: true },
      { icon: 'pin_drop', text: '510 Skyview Ridge, Cupertino CA 95014' },
      { icon: 'bolt', text: 'Panel Upgrade Required (125A → 200A)' },
    ],
    metrics: [
      { label: 'Duration', value: '60 min', caption: 'Late afternoon slot' },
      { label: 'Assets', value: '0 Photos', caption: 'Drone permit cleared' },
      { label: 'Tech Lead', value: 'Marcus V.', caption: 'Unit 12 NorCal', valueTone: 'primary' },
    ],
  },
  lifecycle: {
    title: 'Lifecycle Progression',
    description: 'Deterministic status progression with end-to-end telemetry verifications',
    badge: '2 of 5 Milestones Certified',
    steps: [
      { title: 'Assigned', description: 'Sarah Jenkins (Dispatch)', timestamp: 'Oct 22 • 05:05 PM', state: 'done' },
      { title: 'Scheduled & Confirmed', description: 'SMS Confirmed by Client', timestamp: 'Oct 23 • 08:00 AM', state: 'current' },
      { title: 'En Route', description: 'Last stop of the day', state: 'upcoming' },
      { title: 'On-Site In Progress', description: 'Attic and MSP scope', state: 'upcoming' },
      { title: 'Documentation & QA', description: 'Sign-Off & Sync pending', state: 'upcoming' },
    ],
  },
  auditLog: {
    title: 'Chronological Audit Log',
    meta: 'Immutable Ledger • 2 Entries',
    entries: [
      {
        id: 'log-8833-0800',
        nodeIcon: 'flight_takeoff',
        nodeTone: 'accent',
        author: { name: 'System Auto-Log', initials: 'SYS', tone: 'neutral' },
        role: { label: 'Permits', variant: 'neutral' },
        timestamp: 'Today • 08:00 AM',
        body: { text: 'Drone flight permit cleared for the Cupertino airspace window between 04:30 PM and 06:00 PM.' },
        subNote: 'Ceiling 120ft • Visual line of sight required.',
      },
      {
        id: 'log-8833-1705',
        nodeIcon: 'assignment_ind',
        nodeTone: 'muted',
        author: { name: 'Sarah Jenkins', initials: 'SJ', tone: 'secondary' },
        role: { label: 'Dispatch Supervisor', variant: 'warning' },
        timestamp: 'Oct 22 • 05:05 PM',
        body: { text: 'Survey booked after the homeowner requested a service upgrade quote alongside the roof assessment.' },
      },
    ],
  },
  fieldNote,
  geolocation: {
    title: 'Site Geolocation',
    precision: 'GPS Precision: 1.5m',
    map: {
      src: '/placeholders/map-site.svg',
      alt: 'Bản đồ vị trí 510 Skyview Ridge',
      address: '510 Skyview Ridge',
      coords: 'Lat: 37.32 • Lng: -122.05',
    },
    checklistTitle: 'Pre-Visit Checklist',
    checklist: ['Drone Permit Cleared', 'Attic Access Confirmed', 'MSP Photos Needed', 'Rafter Scope Noted'],
  },
  signOff: null,
}

const taskDetails: Record<string, TaskDetail> = {
  [ord8821.id]: ord8821,
  [ord8824.id]: ord8824,
  [ord8827.id]: ord8827,
  [ord8819.id]: ord8819,
  [ord8830.id]: ord8830,
  [ord8833.id]: ord8833,
}

/** Tra chi tiết theo id trên URL; trả undefined để trang gọi notFound(). */
export function getTaskDetail(id: string | undefined): TaskDetail | undefined {
  if (!id) return undefined
  return taskDetails[id]
}
