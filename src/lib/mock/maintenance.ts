/*
 * Dữ liệu giả cho màn 13 – maintenance_task (/tech/maintenance/:id).
 * Dựng theo maintenance_task/screen.png: work order bảo trì định kỳ Tier-1 của
 * một hệ thương mại 45 kW, kèm số liệu lịch sử, telemetry và ký xác nhận.
 */

import type { EvidencePhotoItem } from '@/components/tech/EvidenceGallery'
import type { ExecutionStepItem } from '@/components/tech/ExecutionStepList'
import type { InfoTileData } from '@/components/tech/InfoTile'
import type { JobHeaderAction } from '@/components/tech/JobHeaderCard'
import type { StatTileProps } from '@/components/tech/StatTile'
import type { YieldSeriesPoint } from '@/components/tech/YieldImpactChart'
import type { StatusVariant } from '@/components/ui/StatusBadge'

/** Một bước của "Standardized Protocol Checklist"; bước đang đo có bảng số liệu riêng. */
export type MaintenanceStep = ExecutionStepItem & {
  defaultChecked: boolean
  /** Chỉ bước đang đo: các cặp nhãn / giá trị và nút xác nhận */
  readings?: {
    items: { label: string; value: string; tone?: 'primary' | 'default' }[]
    confirmLabel: string
    confirmedLabel: string
  }
}

export type MaintenanceTask = {
  id: string
  kindLabel: string
  code: string
  status: { label: string; variant: StatusVariant }
  title: string
  summary: string
  headerActions: JobHeaderAction[]
  meta: InfoTileData[]
  history: {
    title: string
    icon: string
    badge: string
    stats: StatTileProps[]
    note: { title: string; quote: string }
  }
  protocol: {
    title: string
    icon: string
    description: string
    verifiedSuffix: string
    steps: MaintenanceStep[]
  }
  telemetry: {
    title: string
    icon: string
    liveLabel: string
    sensors: { label: string; value: string; unit: string; caption: string; tone?: 'default' | 'secondary' }[]
    yield: {
      title: string
      badge: string
      description: string
      baseline: YieldSeriesPoint[]
      postWash: YieldSeriesPoint[]
      marker: YieldSeriesPoint
      startLabel: string
      endLabel: string
      baselineLabel: string
      postWashLabel: string
    }
  }
  photoLog: {
    title: string
    icon: string
    description: string
    addLabel: string
    photos: EvidencePhotoItem[]
  }
  signOff: {
    title: string
    icon: string
    ratingLabel: string
    ratingBadge: string
    summary: string
    cards: { label: string; value: string; caption: string; tone?: 'default' | 'primary' }[]
    footnote: string
  }
  toasts: {
    draftSaving: string
    draftSaved: string
    completed: string
    readingsConfirmed: string
  }
}

export const maintenanceTasks: MaintenanceTask[] = [
  {
    id: 'MNT-5521',
    kindLabel: 'Work Order',
    code: '#MNT-5521',
    status: { label: 'In Progress • Step 4 of 6 Completed', variant: 'in-progress' },
    title: 'Annual Tier-1 Preventative Health Check',
    summary: 'Scheduled Year 2 Life-Cycle Service Protocol & Array Verification',
    headerActions: [
      { label: 'Save Draft Log', icon: 'save', tone: 'plain' },
      { label: 'Complete & Generate Report', icon: 'verified', tone: 'solid' },
    ],
    meta: [
      {
        icon: 'apartment',
        label: 'Client / FM',
        value: 'Oakridge Comm. Center',
        hint: 'Frank Rossi (Facilities)',
        layout: 'stacked',
      },
      {
        icon: 'pin_drop',
        label: 'Site Location',
        value: '1100 Blossom Hill Rd',
        hint: 'San Jose, CA 95123',
        layout: 'stacked',
      },
      {
        icon: 'solar_power',
        label: 'System Architecture',
        value: '45 kW Comm. Array',
        hint: '2x SolarEdge SE20K Inverters',
        layout: 'stacked',
      },
      {
        icon: 'history',
        label: 'Service Benchmark',
        value: 'Last: Oct 2023 (A. Rivers)',
        hint: 'Benchmark Threshold: ≥ 96%',
        layout: 'stacked',
      },
    ],
    history: {
      title: 'Historical Diagnostics & Benchmark',
      icon: 'analytics',
      badge: 'Tier-1 Status',
      stats: [
        { label: 'Prior Service', value: 'Oct 14, 2023', caption: 'Tech Alex Rivers #3319' },
        { label: 'Yield Target', value: '≥ 96.0%', caption: 'Contract SLA Guaranteed', valueTone: 'primary' },
        {
          label: 'Historical Findings',
          value: '-4% Soiling',
          caption: 'East Array dust settled',
          valueTone: 'secondary',
        },
      ],
      note: {
        title: 'Field Note from Alex Rivers (Oct 2023):',
        quote:
          '"Mild dust soiling on East array (-4% efficiency). Breaker torque verified at 22 Nm. Recommend light automated water rinse before high summer irradiance."',
      },
    },
    protocol: {
      title: 'Standardized Protocol Checklist',
      icon: 'checklist',
      description: 'Verification procedure conforming to NEC 2023 & CalFire Standards',
      verifiedSuffix: 'Verified',
      steps: [
        {
          id: 'mnt-5521-step-1',
          title: 'Visual inspection of PV modules',
          description: 'No snail trails, delamination, hot-spot discoloration, or micro-cracked tempered glass.',
          state: 'done',
          statusText: 'Passed',
          activeMetric: 'Passed',
          defaultChecked: true,
        },
        {
          id: 'mnt-5521-step-2',
          title: 'Racking mechanical torque calibration',
          description:
            '12 random clamp bolts checked across South & West arrays to exact 15 ft-lbs specification. Zero slippage.',
          state: 'done',
          statusText: '15 ft-lbs',
          activeMetric: '15 ft-lbs',
          defaultChecked: true,
        },
        {
          id: 'mnt-5521-step-3',
          title: 'Inverter heat sink & exhaust intake cleaning',
          description:
            'High-pressure compressed air clearing conducted on both SolarEdge SE20K units. Grilles clear of debris.',
          state: 'done',
          statusText: 'Cleared',
          activeMetric: 'Cleared',
          defaultChecked: true,
        },
        {
          id: 'mnt-5521-step-4',
          title: 'String open-circuit voltage & short-circuit current',
          description: 'Multi-meter probe checks. Strings 1-6 normal (384V ± 2V). Evaluating Strings 7 & 8.',
          state: 'active',
          statusText: 'Measuring Now',
          defaultChecked: false,
          readings: {
            items: [
              { label: 'String 7 Voc:', value: '383.4 V', tone: 'primary' },
              { label: 'String 8 Voc:', value: '384.1 V', tone: 'primary' },
              { label: 'Delta:', value: '< 0.3%' },
            ],
            confirmLabel: 'Confirm Readings',
            confirmedLabel: 'Readings Logged',
          },
        },
        {
          id: 'mnt-5521-step-5',
          title: 'AC Disconnect & surge protector LED health verification',
          description: 'Check surge suppression cartridges (green indicator) and test emergency rotary lock switch.',
          state: 'pending',
          statusText: 'Pending',
          defaultChecked: false,
        },
        {
          id: 'mnt-5521-step-6',
          title: 'Panel surface cleaning assessment',
          description:
            'Light pollen film detected. De-ionized automated rinse deemed sufficient; no heavy abrasive scouring needed.',
          state: 'pending',
          statusText: 'Pending',
          defaultChecked: false,
        },
      ],
    },
    telemetry: {
      title: 'Environmental & Telemetry',
      icon: 'wb_sunny',
      liveLabel: 'Live Sensors',
      sensors: [
        { label: 'Ambient Temperature', value: '74', unit: '°F', caption: 'Cell Temp: 92°F (Optimal)' },
        {
          label: 'Solar Irradiance',
          value: '890',
          unit: 'W/m²',
          caption: 'Clear midday horizon',
          tone: 'secondary',
        },
      ],
      yield: {
        title: 'Generation Yield Impact',
        badge: '+6.2% Boost',
        description: 'Pre-cleaning baseline: 37.1 kW → Projected post-wash: 39.4 kW',
        baseline: [
          { x: 0, y: 110 },
          { x: 40, y: 95 },
          { x: 90, y: 75 },
          { x: 150, y: 60 },
          { x: 220, y: 55 },
          { x: 290, y: 62 },
          { x: 350, y: 78 },
          { x: 400, y: 100 },
        ],
        postWash: [
          { x: 0, y: 110 },
          { x: 40, y: 88 },
          { x: 90, y: 65 },
          { x: 150, y: 45 },
          { x: 220, y: 38 },
          { x: 290, y: 44 },
          { x: 350, y: 60 },
          { x: 400, y: 85 },
        ],
        marker: { x: 220, y: 38 },
        startLabel: '08:00 AM',
        endLabel: '04:00 PM',
        baselineLabel: 'Baseline',
        postWashLabel: 'Post-Wash',
      },
    },
    photoLog: {
      title: 'Photographic Log',
      icon: 'photo_camera',
      description: '3 mandatory audit captures submitted',
      addLabel: 'Add Photo',
      photos: [
        {
          src: '/placeholders/photo-breaker.svg',
          alt: 'Inverter diagnostic screen showing nominal operating voltage',
          title: 'Inverter Screen',
          meta: '11:22 AM • Verified',
        },
        {
          src: '/placeholders/photo-panel.svg',
          alt: 'Cleaned solar modules with water droplets under midday sun',
          title: 'Cleaned Module',
          meta: '11:38 AM • Verified',
        },
        {
          src: '/placeholders/photo-microinverter.svg',
          alt: 'AC disconnect switch box with maintenance lockout tag attached',
          title: 'Disconnect Tag',
          meta: '11:45 AM • Verified',
        },
      ],
    },
    signOff: {
      title: 'Condition & Sign-Off Summary',
      icon: 'assignment_turned_in',
      ratingLabel: 'Overall System Rating',
      ratingBadge: 'Excellent Condition',
      summary:
        'Minor atmospheric pollen accumulation completely cleared. All string parameters well within nominal manufacturer tolerances.',
      cards: [
        { label: 'Next Recommended Service', value: 'October 2025', caption: 'Annual Tier-1 Interval' },
        { label: 'Lead Tech Sign-Off', value: 'Marcus Vance', caption: 'ID #4402 • Certified', tone: 'primary' },
      ],
      footnote: 'Client facilities dashboard will auto-sync upon technician sign-off.',
    },
    toasts: {
      draftSaving: 'Saving draft log...',
      draftSaved: 'Draft log saved to field cache.',
      completed: 'Maintenance finalized. Service report generated for #MNT-5521.',
      readingsConfirmed: 'String 7 & 8 readings logged to the work order.',
    },
  },
]

/** Tra work order bảo trì theo id trên URL; chấp nhận cả dạng có và không có "#". */
export function getMaintenanceTask(id: string | undefined): MaintenanceTask | undefined {
  if (!id) return undefined
  const normalized = id.replace(/^#/, '').toUpperCase()
  return maintenanceTasks.find((task) => task.id.toUpperCase() === normalized)
}

/** Nhãn phần trăm bên phải tiêu đề checklist. */
export const protocolVerifiedLabel = (done: number, total: number) =>
  `${total === 0 ? 0 : Math.round((done / total) * 100)}%`
