/*
 * Dữ liệu giả cho màn 14 – warranty_request (/tech/warranty/:id).
 * Dựng theo warranty_request/screen.png: hồ sơ bảo hành một ca lỗi microinverter,
 * gồm bằng chứng của khách, kết quả đo hiện trường và biểu mẫu chốt bảo hành.
 */

import type { MeasurementReading } from '@/components/tech/MeasurementCard'
import type { StatusVariant } from '@/components/ui/StatusBadge'

export type WarrantyStat = {
  label: string
  value: string
  caption: string
  tone?: 'default' | 'primary' | 'error'
}

export type WarrantyMediaItem = {
  label: string
  src: string
  alt: string
  /** Tên file hiện đè lên ảnh */
  fileName: string
}

export type WarrantyAuditPhoto = {
  /** "Before: Physical Fault" */
  phase: string
  phaseTone: 'error' | 'primary'
  time: string
  src: string
  alt: string
  caption: string
}

export type RootCauseOption = {
  value: string
  label: string
  description: string
}

export type CorrectiveAction = {
  value: string
  label: string
  /** Chọn sẵn khi mở màn */
  defaultChecked: boolean
}

export type WarrantyCase = {
  id: string
  priority: { label: string; variant: StatusVariant }
  caseLabel: string
  guarantee: string
  dispatchWindow: string
  title: string
  subtitle: string
  productionDrop: string
  stats: WarrantyStat[]
  reported: {
    title: string
    loggedLabel: string
    quote: string
    media: WarrantyMediaItem[]
  }
  diagnostics: {
    title: string
    toolsLabel: string
    readings: MeasurementReading[]
    rootCause: {
      label: string
      options: RootCauseOption[]
      /** Lựa chọn mặc định khi mở màn */
      defaultValue: string
    }
    corrective: {
      label: string
      actions: CorrectiveAction[]
      narrativeLabel: string
      narrativePlaceholder: string
      narrative: string
    }
    hardwareSwap: {
      title: string
      badge: string
      removedLabel: string
      removedSerial: string
      replacementLabel: string
      replacementSerial: string
    }
  }
  audit: {
    title: string
    description: string
    addLabel: string
    photos: WarrantyAuditPhoto[]
    attachment: { title: string; description: string; actionLabel: string }
  }
  site: {
    title: string
    region: string
    initials: string
    name: string
    premiseId: string
    address: string
    phone: { label: string; href: string }
    email: string
    mapSrc: string
    mapCaption: string
    accessLabel: string
    accessNote: string
  }
  burnIn: {
    title: string
    badge: string
    ringLabel: string
    value: string
    unit: string
    /** Phần trăm vòng tròn, theo stroke-dashoffset trong thiết kế */
    percent: number
    metrics: { label: string; value: string; tone?: 'default' | 'primary' }[]
    note: string
  }
  signOff: {
    title: string
    sectionLabel: string
    description: string
    signatureLabel: string
    clearLabel: string
    signatureHint: string
    signatureCaption: string
    confirmations: { id: string; label: string; defaultChecked: boolean }[]
    submitLabel: string
    receiptLabel: string
    successMessage: string
  }
  /** Thông báo lỗi của biểu mẫu chốt bảo hành */
  validation: {
    rootCause: string
    actions: string
    narrative: string
    serial: string
    signature: string
    confirmations: string
  }
}

export const warrantyCases: WarrantyCase[] = [
  {
    id: 'WAR-3309',
    priority: { label: 'High Priority Fault', variant: 'error' },
    caseLabel: 'CASE ID • #WAR-3309',
    guarantee: '25-Yr System Guarantee',
    dispatchWindow: 'Dispatch Window: 01:30 PM – 03:00 PM',
    title: 'Microinverter Fault & DC String Drop',
    subtitle: 'South Rooftop Array • Circuit Segment Bravo-2 • Grid Arc Interruption',
    productionDrop: '-35% Production',
    stats: [
      { label: 'Active Array', value: '7.2 kW', caption: '18 × SunPower 400W' },
      { label: 'Install Commission', value: 'March 2022', caption: '38 Months In-Service' },
      { label: 'Fault Code', value: 'AFE-094', caption: 'Ground Arc Triggered', tone: 'error' },
      { label: 'Warranty Path', value: 'RMA Express', caption: 'Tier 1 OEM Coverage', tone: 'primary' },
    ],
    reported: {
      title: 'Reported Telemetry & Customer Notes',
      loggedLabel: 'Logged 4 days ago via SmartSolar App',
      quote:
        '"App shows Inverter #4 in critical error state \'Ground Fault / Arc Detected\'. Three panels on South roof are showing zero production for 4 days. Noticed sudden drop on Thursday afternoon after heavy rain."',
      media: [
        {
          label: 'Homeowner Telemetry Upload',
          src: '/placeholders/photo-app-alert.svg',
          alt: 'Monitoring app showing a ground fault alert on microinverter four',
          fileName: 'IMG_AppAlert_0411.png',
        },
        {
          label: 'Homeowner Exterior Junction Box Photo',
          src: '/placeholders/photo-junction-box.svg',
          alt: 'Exterior AC disconnect and junction box mounted on a stucco wall',
          fileName: 'IMG_JunctionBox_0412.jpg',
        },
      ],
    },
    diagnostics: {
      title: 'Field Diagnostics & Physical Inspection',
      toolsLabel: 'FLIR E8-XT & Fluke 1587 FC Linked',
      readings: [
        {
          label: 'Open Circuit Voltage (Voc)',
          icon: 'electric_bolt',
          value: '48.2',
          unit: 'VDC',
          verdict: { label: 'Pass' },
          footer: { left: 'Nominal Baseline: 47.5V – 49.0V', right: '±0.8% Target' },
          scale: 82,
        },
        {
          label: 'Insulation Resistance (Megger)',
          icon: 'emergency_heat',
          tone: 'error',
          value: '0.12',
          unit: 'MΩ',
          verdict: { label: 'Critical Fail' },
          footer: { left: 'Standard Min: ≥ 1.0 MΩ @ 500VDC', right: 'Short to Ground' },
          scale: 12,
        },
      ],
      rootCause: {
        label: 'Root Cause Identification',
        defaultValue: 'cable-insulation',
        options: [
          {
            value: 'factory-defect',
            label: 'Factory Microinverter Defect',
            description: 'Internal IGBT breakdown or bridge diode failure',
          },
          {
            value: 'cable-insulation',
            label: 'Damaged Cable Insulation',
            description: 'Rodent chew & abrasion on South String 2 harness',
          },
          {
            value: 'water-ingress',
            label: 'Water Ingress / Seal Breach',
            description: 'Moisture corrosion inside MC4 quick-connect socket',
          },
        ],
      },
      corrective: {
        label: 'Corrective Warranty Action Taken',
        actions: [
          { value: 'dc-cable', label: 'Replaced 4m UV DC Cable', defaultChecked: true },
          { value: 'mc4', label: 'Stäubli MC4 Re-crimped', defaultChecked: true },
          { value: 'critter-guard', label: 'Heavy-Duty Critter Guard Mesh Installed', defaultChecked: true },
          { value: 'grounding', label: 'Grounding Lug Re-bonded', defaultChecked: false },
        ],
        narrativeLabel: 'Technician field narrative',
        narrativePlaceholder: 'Technician field narrative notes...',
        narrative:
          'Excavated squirrel nest behind panel array 4B. Cleaned exposed grounding wire. Replaced 4m section of UV-resistant DC wire, re-crimped MC4 connectors with calibrated tool, and secured entire south rake with galvanized steel pest guard mesh.',
      },
      hardwareSwap: {
        title: 'OEM Hardware Swap • Enphase IQ8+ Microinverter',
        badge: 'Barcodes Verified',
        removedLabel: 'Defective Removed Unit',
        removedSerial: 'EN-98214-X02',
        replacementLabel: 'Commissioned Replacement',
        replacementSerial: 'EN-11048-Y09',
      },
    },
    audit: {
      title: 'Photographic Audit Verification',
      description: 'Mandatory warranty compliance deliverables for OEM claim approval',
      addLabel: 'Add Angle',
      photos: [
        {
          phase: 'Before: Physical Fault',
          phaseTone: 'error',
          time: '13:42 PST',
          src: '/placeholders/photo-cable-fault.svg',
          alt: 'Chewed DC wiring harness with exposed copper strands under a solar panel',
          caption: 'Severe Outer Sheath Degradation',
        },
        {
          phase: 'After: Warranty Repair',
          phaseTone: 'primary',
          time: '14:26 PST',
          src: '/placeholders/photo-cable-repaired.svg',
          alt: 'Newly spliced UV resistant cables clipped along the panel array frame',
          caption: 'Spliced, Tested & Pest Shielded',
        },
      ],
      attachment: {
        title: 'Thermal Imaging Post-Repair File',
        description: 'FLIR radiometric file: IR_20240415_0912.seq',
        actionLabel: 'Attach Measurement',
      },
    },
    site: {
      title: 'Site Profile',
      region: 'Los Gatos, CA',
      initials: 'ER',
      name: 'Elena Rostova',
      premiseId: 'Premise ID #992-410',
      address: '842 Crestview Terrace, Los Gatos, CA 95032',
      phone: { label: '(408) 555-0199', href: 'tel:4085550199' },
      email: 'elena.rostova@icloud.com',
      mapSrc: '/placeholders/map-site.svg',
      mapCaption: 'Roof Pitch: 22° • South Face',
      accessLabel: 'Access Gate Pin & Instructions',
      accessNote:
        'Gate Code: 4921 • Dog inside house, access via West side garden gate directly to ladder placement.',
    },
    burnIn: {
      title: '15-Min Live Burn-In',
      badge: 'All 18 Online',
      ringLabel: 'Current Gen',
      value: '5.84',
      unit: 'kW Realtime',
      percent: 86,
      metrics: [
        { label: 'Grid Frequency', value: '60.02 Hz' },
        { label: 'String 2 Impedance', value: '> 12.4 MΩ', tone: 'primary' },
      ],
      note: 'Zero arc errors detected over 15 continuous active minutes.',
    },
    signOff: {
      title: 'Field Sign-Off & Closeout',
      sectionLabel: 'Section 4.3',
      description:
        'Customer or designated agent acknowledges completion of warranty service and verification of normal production values.',
      signatureLabel: 'Client Signature',
      clearLabel: 'Clear',
      signatureHint: 'Sign in this box',
      signatureCaption: 'Elena Rostova • Sign & Verify',
      confirmations: [
        {
          id: 'wattage',
          label: 'Customer verified live wattage increase via homeowner mobile dashboard.',
          defaultChecked: true,
        },
        {
          id: 'rma',
          label: 'OEM hardware serial swap logged to manufacturer portal (RMA #ENP-449102).',
          defaultChecked: true,
        },
      ],
      submitLabel: 'Submit Warranty & Restore',
      receiptLabel: 'Generate Field Warranty Receipt (PDF)',
      successMessage: 'Warranty claim #WAR-3309 submitted. RMA packet queued for OEM review.',
    },
    validation: {
      rootCause: 'Chọn một nguyên nhân gốc trước khi gửi.',
      actions: 'Chọn ít nhất một hạng mục đã khắc phục.',
      narrative: 'Mô tả hiện trường cần ít nhất 20 ký tự.',
      serial: 'Số sê-ri theo định dạng EN-00000-X00.',
      signature: 'Cần chữ ký của khách hàng.',
      confirmations: 'Phải xác nhận cả hai mục trước khi gửi.',
    },
  },
]

/** Tra hồ sơ bảo hành theo id trên URL; chấp nhận cả dạng có và không có "#". */
export function getWarrantyCase(id: string | undefined): WarrantyCase | undefined {
  if (!id) return undefined
  const normalized = id.replace(/^#/, '').toUpperCase()
  return warrantyCases.find((item) => item.id.toUpperCase() === normalized)
}
