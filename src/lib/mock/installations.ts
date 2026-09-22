/*
 * Dữ liệu giả cho hai màn lắp đặt dùng chung một installation id:
 * - Màn 11 installation_task           → /tech/installations/:id
 * - Màn 12 installation_task_checklist → /tech/installations/:id/checklist (mở rộng ở cuối file)
 * Mọi số liệu (số panel, phần trăm, tên khách, crew…) phải khớp nhau giữa hai màn.
 */

import type { ChecklistPhaseTone, ChecklistTaskItem } from '@/components/tech/ChecklistPhaseCard'
import type { EvidenceDropzoneItem, EvidencePhotoItem } from '@/components/tech/EvidenceGallery'
import type { ExecutionStepItem } from '@/components/tech/ExecutionStepList'
import type { InfoTileData } from '@/components/tech/InfoTile'
import type { JobHeaderAction, JobProgress } from '@/components/tech/JobHeaderCard'
import type { MeasurementReading } from '@/components/tech/MeasurementCard'
import type { PanelCell, PanelState } from '@/components/tech/PanelArrayGrid'
import type { StatusVariant } from '@/components/stitch-ui/StatusBadge'

export type SpecCard = {
  icon: string
  /** secondary = khối OSHA màu cam trong thiết kế */
  tone: 'primary' | 'secondary'
  title: string
  description: string
  /** Chip nổi bật giữa khối */
  chip: string
  chipTone: 'neutral' | 'warning'
  footnote: string
}

/** Một bước của "Execution Sequence"; bước active có thêm bộ đếm panel đã lắp. */
export type InstallationStep = ExecutionStepItem & {
  counter?: { label: string; unitLabel: string; total: number; initial: number }
  defaultChecked: boolean
}

export type EvidencePhase = {
  title: string
  photos: EvidencePhotoItem[]
}

export type SerialField = {
  id: string
  label: string
  value: string
  /** Dòng xác nhận màu primary dưới ô nhập */
  confirmation: string
}

export type InstallationTask = {
  id: string
  /** Nhãn pill trước mã job */
  kindLabel: string
  code: string
  stage: { label: string; variant: StatusVariant }
  summary: string
  headerActions: JobHeaderAction[]
  meta: InfoTileData[]
  progress: JobProgress
  specs: {
    title: string
    icon: string
    toggleLabels: { collapse: string; expand: string }
    cards: SpecCard[]
    request: { text: string; verdict: string }
  }
  execution: {
    title: string
    icon: string
    steps: InstallationStep[]
  }
  fieldLog: {
    title: string
    icon: string
    serials: SerialField[]
    notesLabel: string
    notesPlaceholder: string
    notes: string
  }
  arrayGrid: {
    title: string
    icon: string
    planLabel: string
    cells: PanelCell[]
    legend: { label: string; state: PanelState }[]
  }
  evidence: {
    title: string
    icon: string
    uploadedLabel: string
    phases: EvidencePhase[]
    dropzoneTitle: string
    dropzones: EvidenceDropzoneItem[]
  }
  contact: {
    initials: string
    name: string
    note: string
    phoneHref: string
  }
  footer: {
    activeTime: string
    estimate: string
    syncLabel: string
    syncingLabel: string
    syncedLabel: string
    completeLabel: string
  }
}

/** 24 panel: 18 đã lắp, 1 đang kéo lên, 5 đang chờ – khớp bộ đếm "18 / 24 Mounted". */
const southArrayCells: PanelCell[] = Array.from({ length: 24 }, (_, i) => {
  const index = i + 1
  if (index <= 18) return { index, state: 'mounted' }
  if (index === 19) return { index, state: 'active' }
  return { index, state: 'queued' }
})

export const installationTasks: InstallationTask[] = [
  {
    id: 'INS-7704',
    kindLabel: 'Job Order',
    code: '#INS-7704',
    stage: { label: 'Stage 3: Mechanical & Electrical Run', variant: 'in-progress' },
    summary: 'Solar Roof Array (9.6 kW) & Tesla Powerwall 3 Storage System',
    headerActions: [
      { label: 'Permit Pack #SARA-24-09', icon: 'verified', tone: 'primary' },
      { label: 'Crew Radio (Ch 4)', icon: 'group', tone: 'plain' },
    ],
    meta: [
      {
        icon: 'person_pin_circle',
        label: 'Customer',
        value: 'David Chen',
        hint: '1240 Oak Knolls Way, Saratoga',
      },
      {
        icon: 'request_quote',
        label: 'Approved Quotation',
        value: '#QT-2024-918',
        hint: '$28,450 Contract Scope',
      },
      {
        icon: 'schedule',
        label: 'Schedule Window',
        value: 'Today 08:30 AM - 04:30 PM',
        hint: 'T+4h 15m on site',
        hintTone: 'primary',
      },
      {
        icon: 'badge',
        label: 'Lead & Deployment',
        value: 'Marcus Vance (You)',
        hint: '+ J. Alvarez, T. Nuyen',
      },
    ],
    progress: {
      title: 'Overall Installation Milestone',
      note: 'Stage 3 of 4 (Mechanical Array Setup)',
      percent: 65,
      milestones: [
        { label: '1. Safety & Ingress', done: true },
        { label: '2. Penetrations & Flashing', done: true },
        { label: '3. Racking & Panels (Now)', done: true },
        { label: '4. Commissioning & QA', done: false },
      ],
    },
    specs: {
      title: 'Technical Blueprints & Safety Mandate',
      icon: 'architecture',
      toggleLabels: { collapse: 'Collapse Specs', expand: 'Expand Specs' },
      cards: [
        {
          icon: 'grid_view',
          tone: 'primary',
          title: 'Racking & Modules',
          description: 'IronRidge XR100, flush profile mount.',
          chip: '24x REC Alpha 400W',
          chipTone: 'neutral',
          footnote: 'Tile hooks spaced max 48" O.C.',
        },
        {
          icon: 'bolt',
          tone: 'primary',
          title: 'Electrical Backbone',
          description: '3/4" EMT along North fascia to main panel.',
          chip: '40A Dedicated Breaker',
          chipTone: 'neutral',
          footnote: 'Slots 18/20 labeled "Solar PV"',
        },
        {
          icon: 'health_and_safety',
          tone: 'secondary',
          title: 'Mandatory OSHA',
          description: '100% Tie-Off required: 28° Spanish clay tile pitch.',
          chip: 'Dual Ridge Anchors Active',
          chipTone: 'warning',
          footnote: 'Walk tiles on lower-third contact only.',
        },
      ],
      request: {
        text: 'Customer special request: Route conduit inside garage wall cavity if feasible.',
        verdict: 'Verified Feasible ✓',
      },
    },
    execution: {
      title: 'Execution Sequence & Sign-off',
      icon: 'fact_check',
      steps: [
        {
          id: 'ins-7704-step-1',
          order: 1,
          title: 'Site arrival, safety briefing & fall protection anchored',
          description:
            'JSA signed by Marcus Vance, J. Alvarez, T. Nuyen. Anchor torque confirmed at 45 ft-lbs.',
          state: 'done',
          statusText: '08:45 AM',
          defaultChecked: true,
        },
        {
          id: 'ins-7704-step-2',
          order: 2,
          title: 'Roof layout chalking & bracket penetrations sealed with flashing',
          description: 'QuickMount PV flashings seated with ChemLink M-1 sealant. No broken tiles reported.',
          state: 'done',
          statusText: '11:15 AM',
          defaultChecked: true,
        },
        {
          id: 'ins-7704-step-3',
          order: 3,
          title: 'Rail mounting, microinverter cabling & panel placement',
          description:
            'Enphase IQ8+ microinverters clicked into Q-Cable harness. Final 6 modules on south array currently being hoisted.',
          state: 'active',
          statusText: 'Active',
          activeMetric: '18 / 24 Mounted',
          counter: { label: 'Mounted Panels:', unitLabel: 'of 24 Total Panels', total: 24, initial: 18 },
          defaultChecked: false,
        },
        {
          id: 'ins-7704-step-4',
          order: 4,
          title: 'DC/AC conduit pull to inverter & disconnect switch',
          description: 'THHN 10AWG wire pull through north exterior conduit to Tesla Backup Gateway 2.',
          state: 'pending',
          statusText: 'Queue next',
          defaultChecked: false,
        },
        {
          id: 'ins-7704-step-5',
          order: 5,
          title: 'Rapid shutdown & ground fault testing',
          description: 'Verify RSD initiator drops array voltage < 30V within 30 seconds as per NEC 690.12.',
          state: 'pending',
          statusText: 'Pending',
          defaultChecked: false,
        },
        {
          id: 'ins-7704-step-6',
          order: 6,
          title: 'Customer system walk-through & gateway app pairing',
          description:
            'Demonstrate main switch shutoff, hand over warranty envelope, register Tesla Powerwall app on homeowner device.',
          state: 'pending',
          statusText: 'Pending',
          defaultChecked: false,
        },
      ],
    },
    fieldLog: {
      title: 'Field Notes & Serial Asset Log',
      icon: 'edit_note',
      serials: [
        {
          id: 'battery-sn',
          label: 'Tesla Powerwall 3 Serial No.',
          value: 'TG3-2024-PW3-094188',
          confirmation: '✓ Verified with Tesla Hub Registry',
        },
        {
          id: 'gateway-sn',
          label: 'Backup Gateway 2 Serial No.',
          value: 'GW2-9844-019B',
          confirmation: '✓ Pre-commissioning link valid',
        },
      ],
      notesLabel: 'Technician Field Log / Structural Notes',
      notesPlaceholder:
        'Enter notes regarding weather conditions, minor plan variances, attic wire runs, or customer inquiries...',
      notes:
        'Tile condition is sturdy. South-facing pitch receives zero shade until 17:15 PM. Extra sealant applied to eave penetrations due to upcoming coastal fog front.',
    },
    arrayGrid: {
      title: 'South Roof Array Grid',
      icon: 'solar_power',
      planLabel: '24-Panel Plan',
      cells: southArrayCells,
      legend: [
        { label: 'Mounted (18)', state: 'mounted' },
        { label: 'Active Hoist (1)', state: 'active' },
        { label: 'Queued (5)', state: 'queued' },
      ],
    },
    evidence: {
      title: 'Field Evidence Photos',
      icon: 'photo_camera',
      uploadedLabel: '5 of 7 Uploaded',
      phases: [
        {
          title: 'Phase 1: Pre-Install Conditions',
          photos: [
            {
              src: '/placeholders/photo-roof.svg',
              alt: 'Clay barrel roof tiles before solar panel mounting',
              title: 'Roof Condition',
              meta: '08:35 AM, Verified intact',
            },
            {
              src: '/placeholders/photo-breaker.svg',
              alt: 'Open 200A residential service breaker panel',
              title: 'Open Breaker Panel',
              meta: '08:42 AM, Slot 18/20 clear',
            },
          ],
        },
        {
          title: 'Phase 2: In-Progress Construction',
          photos: [
            {
              src: '/placeholders/photo-flashing.svg',
              alt: 'Racking rail clamped with waterproof flashing under roof tile',
              title: 'Flashing & Lag Seal',
              meta: '11:20 AM, 45 ft-lbs',
            },
            {
              src: '/placeholders/photo-microinverter.svg',
              alt: 'Microinverter mounted beneath solar panel rail with grounding lug',
              title: 'Microinverter Rail Bus',
              meta: '12:15 PM, Grounded',
            },
          ],
        },
      ],
      dropzoneTitle: 'Phase 3: Completion Dropzones (Required for QA)',
      dropzones: [
        { icon: 'add_a_photo', title: 'Street Array Angle', hint: 'Tap to capture / upload' },
        { icon: 'add_a_photo', title: 'Wall / Inverter Bends', hint: 'Tap to capture / upload' },
      ],
    },
    contact: {
      initials: 'DC',
      name: 'David Chen (Homeowner)',
      note: 'Present on premise (Front office)',
      phoneHref: 'tel:4085550192',
    },
    footer: {
      activeTime: 'Active Time: 04h 15m',
      estimate: 'Estimated completion: 03:45 PM today',
      syncLabel: 'Update Progress Sync',
      syncingLabel: 'Syncing Telemetry...',
      syncedLabel: 'Cloud Synced',
      completeLabel: 'Complete Task & Request QA Sign-off',
    },
  },
]

/** Tra job order theo id trên URL; chấp nhận cả dạng có và không có tiền tố "#". */
export function getInstallationTask(id: string | undefined): InstallationTask | undefined {
  if (!id) return undefined
  const normalized = id.replace(/^#/, '').toUpperCase()
  return installationTasks.find((task) => task.id.toUpperCase() === normalized)
}

/** Nhãn đếm bước dưới tiêu đề "Execution Sequence & Sign-off". */
export const executionCounterLabel = (done: number, total: number) => `${done} of ${total} Steps Done`

/* ------------------------------------------------------------------ *
 * Màn 12 – installation_task_checklist (/tech/installations/:id/checklist)
 * Mở rộng cùng job order INS-7704: khách David Chen, 24 module REC Alpha 400W
 * (9.6 kW DC), 18/24 panel đã lắp và các mốc giờ trùng với màn 11.
 * ------------------------------------------------------------------ */

export type ChecklistPhase = {
  id: string
  icon: string
  tone: ChecklistPhaseTone
  title: string
  description: string
  /** Icon trong badge tiến độ của phase */
  badgeIcon: string
  /** Hậu tố badge: "Verified" hoặc "Complete" */
  badgeSuffix: string
  tasks: ChecklistTaskItem[]
}

export type InstallationChecklist = {
  /** Banner trạng thái kết nối trên cùng */
  session: { label: string; mode: string; database: string; signal: string }
  header: {
    projectCode: string
    customerLabel: string
    status: { label: string; variant: StatusVariant }
    timer: string
    title: string
    address: string
    phone: { label: string; href: string }
    window: string
    actions: JobHeaderAction[]
    stats: { label: string; value: string; unit: string; tone?: 'default' | 'primary' | 'secondary' }[]
  }
  phases: ChecklistPhase[]
  photos: {
    id: string
    icon: string
    tone: ChecklistPhaseTone
    title: string
    description: string
    badgeLabel: string
    items: EvidencePhotoItem[]
    dropzones: EvidenceDropzoneItem[]
  }
  measurements: {
    title: string
    icon: string
    badge: string
    readings: MeasurementReading[]
    topology: { title: string; note: string; combinerLabel: string }
  }
  notes: {
    title: string
    icon: string
    autosaveLabel: string
    placeholder: string
    techLead: string
    appendLabel: string
  }
  hotline: { eyebrow: string; icon: string; name: string; note: string; phoneHref: string }
  dock: {
    title: string
    stageLabel: string
    counterLabel: (done: number, total: number) => string
    saveLabel: string
    savedMessage: string
    signLabel: string
  }
  signature: {
    title: string
    subtitle: string
    rows: { label: string; value: string; highlight?: boolean }[]
    consent: string
    canvasLabel: string
    hint: string
    clearLabel: string
    cancelLabel: string
    submitLabel: string
    successMessage: string
  }
}

export const installationChecklists: Record<string, InstallationChecklist> = {
  'INS-7704': {
    session: {
      label: 'Active Field Session',
      mode: 'Field App Mode: Auto-sync buffered (8 offline events synced)',
      database: 'Grid DB Linked',
      signal: 'Signal: 4G LTE (-82 dBm)',
    },
    header: {
      projectCode: '#INS-7704',
      customerLabel: 'David Chen Residence',
      status: { label: 'In Progress', variant: 'active' },
      timer: '04h 15m on site',
      title: 'Stage 3: Racking, Array Mounting & Inverter Commissioning',
      address: '1240 Oak Knolls Way, Saratoga',
      phone: { label: '(408) 555-0192', href: 'tel:4085550192' },
      window: 'Today: 08:30 AM – 04:30 PM',
      actions: [
        { label: 'Pause Task', icon: 'pause_circle', tone: 'plain' },
        { label: 'Update Progress', icon: 'sync', tone: 'primary' },
      ],
      stats: [
        { label: 'Total Modules', value: '24', unit: 'x 400W REC' },
        { label: 'DC System Capacity', value: '9.6', unit: 'kW DC', tone: 'primary' },
        { label: 'Microinverters', value: '24', unit: 'Enphase IQ8+' },
        { label: 'Weather Ambient', value: '82°F', unit: 'Clear, 6mph S', tone: 'secondary' },
      ],
    },
    phases: [
      {
        id: 'phase-1',
        icon: 'health_and_safety',
        tone: 'safety',
        title: '1. Pre-Installation Safety & Site Check',
        description: 'OSHA fall protection compliance and hazardous energy isolation protocols',
        badgeIcon: 'verified',
        badgeSuffix: 'Verified',
        tasks: [
          {
            id: 'ins-7704-chk-1-1',
            title: 'Personal Protective Equipment (Harnesses & Anchor Points Secured)',
            description: 'Full-body fall arrest harness inspect stamp: current. Dual ridge anchor clamps torqued.',
            doneText: 'Verified 08:45',
            pendingText: 'Pending',
            defaultChecked: true,
          },
          {
            id: 'ins-7704-chk-1-2',
            title: 'Main Service Panel Lockout / Tagout (LOTO) Completed',
            description:
              '200A main breaker de-energized. Padlock ID #TX-489 tag fastened with zero energy confirmed.',
            doneText: 'Verified 08:52',
            pendingText: 'Pending',
            defaultChecked: true,
          },
          {
            id: 'ins-7704-chk-1-3',
            title: 'Material Inventory Staged & Verified',
            description: '24x REC Alpha 400W panels, IronRidge XR100 rails, Enphase IQ Combiner 4C.',
            doneText: 'Verified 09:05',
            pendingText: 'Pending',
            defaultChecked: true,
          },
        ],
      },
      {
        id: 'phase-2',
        icon: 'solar_power',
        tone: 'execution',
        title: '2. Mounting & Electrical Execution Checklist',
        description: 'Physical array structural fastening, electrical homerun runs, and bonding',
        badgeIcon: 'pending_actions',
        badgeSuffix: 'Complete',
        tasks: [
          {
            id: 'ins-7704-chk-2-1',
            title: 'Roof Flashings & L-Feet Lag Bolted to Rafters',
            description:
              '32 penetrations with ChemLink M-1 sealant. Rafter centers pre-drilled with 7/32 in pilot bits.',
            doneText: '45 ft-lbs torque checked',
            pendingText: 'Pending',
            defaultChecked: true,
          },
          {
            id: 'ins-7704-chk-2-2',
            title: 'Microinverters Mounted & Q-Cable Trunk Cable Routed',
            description: '24 microinverters bolted to rail upper slots. End caps sealed with Enphase terminators.',
            doneText: 'Complete',
            pendingText: 'Pending',
            defaultChecked: true,
          },
          {
            id: 'ins-7704-chk-2-3',
            title: 'DC Module Connections & Wire Management (18 / 24 Done)',
            description: 'Click MC4 connections fully seated. Stainless clips every 12 inches off roof surface.',
            doneText: 'Complete',
            pendingText: 'Pending',
            active: true,
            activeLabel: 'Active Now',
            progress: { value: 75, leftText: '6 panels remaining on South Plane array', rightText: '75% of step' },
            defaultChecked: false,
          },
          {
            id: 'ins-7704-chk-2-4',
            title: 'AC Disconnect Switch Installed & Grounded',
            description:
              '60A fused exterior AC disconnect adjacent to utility revenue meter with visible break blades.',
            doneText: 'Complete',
            pendingText: 'Pending',
            defaultChecked: false,
          },
          {
            id: 'ins-7704-chk-2-5',
            title: 'Final Inverter Gateway Pairing & Enlighten Registration',
            description:
              'Commissioning scanner map upload, 24 PLC communication checks, then pair Tesla Backup Gateway 2 with the homeowner app.',
            doneText: 'Complete',
            pendingText: 'Pending',
            defaultChecked: false,
          },
        ],
      },
    ],
    photos: {
      id: 'phase-3',
      icon: 'photo_camera',
      tone: 'audit',
      title: '3. Site Photo Verification & Audit Trail',
      description: 'AHJ and permit compliance imagery (GPS & timestamp watermarked)',
      badgeLabel: '3 Uploaded, 1 Required',
      items: [
        {
          src: '/placeholders/photo-roof.svg',
          alt: 'Roof slope with chalk layout lines before rail installation',
          title: 'Before Installation',
          meta: '08:35, Roof South-facing',
          verified: true,
        },
        {
          src: '/placeholders/photo-flashing.svg',
          alt: 'Racking rails lag bolted with flashings to the roof deck',
          title: 'Rail & Flashing Check',
          meta: '11:20, 32 Penetrations',
          verified: true,
        },
        {
          src: '/placeholders/photo-microinverter.svg',
          alt: 'Module being mounted onto roof rails with microinverter bus',
          title: 'Active Module Mounting',
          meta: '12:15, Row 2 In Progress',
          verified: true,
        },
      ],
      dropzones: [{ icon: 'add_a_photo', title: '+ Add Live Photo', hint: 'Required: Inverter Wiring' }],
    },
    measurements: {
      title: 'Measurements',
      icon: 'speed',
      badge: 'NEC 690 Tested',
      readings: [
        {
          label: 'String 1 Open Circuit (Voc)',
          target: 'Target: 405-418 V',
          value: '412',
          unit: 'V DC',
          verdict: { label: 'PASS', icon: 'check' },
          scale: 96,
        },
        {
          label: 'String 2 Open Circuit (Voc)',
          target: 'Target: 405-418 V',
          value: '410',
          unit: 'V DC',
          verdict: { label: 'PASS', icon: 'check' },
          scale: 94,
        },
        {
          label: 'Insulation Resistance to Ground',
          target: 'Req: >50 MΩ',
          value: '> 100',
          unit: 'MΩ',
          valueSize: 'headline',
          verdict: { label: 'Megger Clear', icon: 'verified' },
        },
      ],
      topology: {
        title: 'Array Topology Map',
        note: '2x 12-module strings',
        combinerLabel: 'IQ Combiner 4C (Online)',
      },
    },
    notes: {
      title: 'Tech Field Notes',
      icon: 'edit_note',
      autosaveLabel: 'Autosaved 14:18',
      placeholder: 'Enter structural conditions, lag depths, customer discussions...',
      techLead: 'Tech Lead: M. Vance #4402',
      appendLabel: 'Append Note',
    },
    hotline: {
      eyebrow: 'Field Safety & Dispatch Hotline',
      icon: 'support_agent',
      name: 'Operations Dispatch',
      note: 'Desk 4 — NorCal Zone 4',
      phoneHref: 'tel:18005550199',
    },
    dock: {
      title: 'Installation Completion Status',
      stageLabel: 'Stage 3 of 4',
      counterLabel: (done, total) => `${done} of ${total} milestone safety & assembly steps signed off`,
      saveLabel: 'Save Progress',
      savedMessage: 'Installation progress synced to cloud.',
      signLabel: 'Complete Installation & Sign',
    },
    signature: {
      title: 'Customer Handover & Signature',
      subtitle: 'Job order #INS-7704, David Chen',
      rows: [
        { label: 'Panels Installed:', value: '24x REC Alpha 400W' },
        { label: 'Microinverters:', value: '24x Enphase IQ8+' },
        { label: 'Grid Disconnect Status:', value: 'Restored & Ready for PTO', highlight: true },
      ],
      consent:
        'By signing below, the homeowner or authorized agent verifies that the roof-mounted photovoltaic array has been mechanically fastened, wiring concealed, and yard cleaned of debris.',
      canvasLabel: 'Sign Here (Touch or Stylus)',
      hint: 'Customer Sign Above',
      clearLabel: 'Clear Signature',
      cancelLabel: 'Cancel',
      submitLabel: 'Sign & Complete Job',
      successMessage: 'Handover signed. QA packet dispatched to Regional Lead.',
    },
  },
}

/** Checklist theo phase của một job order; dùng chung id với getInstallationTask. */
export function getInstallationChecklist(id: string | undefined): InstallationChecklist | undefined {
  if (!id) return undefined
  return installationChecklists[id.replace(/^#/, '').toUpperCase()]
}
