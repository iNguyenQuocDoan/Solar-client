import type { Tone } from '@/components/ui/badge'
import { img } from '@/services/mock'

export const fieldContext = {
  team: 'Team Alpha',
  hub: 'Regional Deployment Hub, Zone 4',
  shift: 'On duty, Route B',
  shiftWindow: '07:30 to 16:30',
  sync: 'Live, synced just now',
}

export type JobKind = 'survey' | 'installation' | 'warranty' | 'maintenance'
export const JOB_LABEL: Record<JobKind, string> = {
  survey: 'Site survey',
  installation: 'Installation',
  warranty: 'Warranty service',
  maintenance: 'Maintenance',
}

export const techDashboard = {
  quota: { done: 2, total: 5 },
  date: 'Wednesday, Oct 24',
  queue: [
    { value: 'all', label: 'All tasks', count: 5 },
    { value: 'survey', label: 'Surveys', count: 3 },
    { value: 'installation', label: 'Installations', count: 2 },
    { value: 'warranty', label: 'Warranty requests', count: 2 },
    { value: 'maintenance', label: 'Maintenance', count: 1 },
  ] as const,
  schedule: [
    { time: '09:00 AM', kind: 'survey' as JobKind, status: 'Completed', tone: 'ok' as Tone, customer: 'Eleanor Vance', address: '742 Evergreen Terrace, Springfield', detail: 'Rooftop angle 34°, attic access clear.', action: 'View survey summary', primary: false },
    { time: '11:30 AM', kind: 'installation' as JobKind, status: 'In progress', tone: 'accent' as Tone, customer: 'Robert Jenkins', address: '1842 Willow Creek Rd', detail: 'System 8.4 kW direct, 22 monocrystalline panels, SolarEdge HD-Wave inverter.', step: 'Step 4 of 6: array wiring and microinverter trunk', pct: 68, onSite: 'Logged on site at 11:24 AM, 48 minutes elapsed', photo: img('field-racking', 640, 420), action: 'Resume installation checklist', primary: true },
    { time: '02:00 PM', kind: 'warranty' as JobKind, status: 'En route next', tone: 'warn' as Tone, customer: 'Michael Chang', address: '905 Pine Crest Ave, 7.4 mi away (about 18 min drive)', detail: 'Issue: microinverter string 2 reporting zero output, fault error 404.', action: 'Navigate and start visit', primary: true },
    { time: '04:15 PM', kind: 'maintenance' as JobKind, status: 'Upcoming', tone: 'neutral' as Tone, customer: 'Sarah Lindqvist', address: '312 Meadow Vista Way', detail: 'Annual clean, wire integrity assessment and firmware update.', action: 'View job sheet', primary: false },
  ],
  outlook: { week: 43, surveys: 3, installs: 2, warranty: 1 },
  tomorrow: [
    { time: '08:30 AM', kind: 'Survey', who: 'David K. (Oak Ridge Est.)' },
    { time: '11:00 AM', kind: 'Commissioning', who: 'Perez Residence (Unit 4B)' },
  ],
  completed: [
    { time: '10:42 AM', title: 'Eleanor Vance, survey', body: 'Attic wiring photographed; structural rafters approved for an 18-panel layout. 12 site photos uploaded.' },
    { time: '08:15 AM', title: 'Depot stock restock', body: 'Picked up a 250A breaker, mounting brackets and grounding wire reels from Hub Zone 4. Inventory reconciled.' },
  ],
  weather: { summary: 'Roof work clear, 74°F', detail: 'Dry surface, wind 4 mph NW', tone: 'ok' as const },
}

export type WorkOrder = {
  id: string
  kind: JobKind
  priority: 'Urgent' | 'High' | 'Normal'
  window: string
  status: string
  statusTone: Tone
  customer: string
  phone: string
  address: string
  distance: string
  scope: string
  scopeNote: string
  progress: string
  pct?: number
  action: string
  actionPrimary: boolean
  timeline: 'today' | 'upcoming' | 'completed'
}

export const workOrders: WorkOrder[] = [
  { id: 'WO-8821', kind: 'warranty', priority: 'Urgent', window: '08:30 AM to 10:30 AM', status: 'En route now', statusTone: 'accent', customer: 'Eleanor Vance Residence', phone: '555-019-8234', address: '742 Evergreen Terrace, West Hills, CA 91307', distance: '1.2 mi, 4 minutes away', scope: '3 of 5 steps complete', scopeNote: 'Next: rapid inverter arc fault diagnostic', progress: '60%', pct: 60, action: 'Complete step', actionPrimary: true, timeline: 'today' },
  { id: 'WO-8824', kind: 'survey', priority: 'High', window: '11:30 AM to 01:00 PM', status: 'Scheduled', statusTone: 'neutral', customer: 'David & Sarah Sterling', phone: '555-023-9912', address: '1204 Oak Ridge Way, Thousand Oaks, CA 91360', distance: '4.8 mi, 14 minutes travel', scope: 'Rooftop pitch and azimuth analysis', scopeNote: 'Attic breaker panel clearance 200A', progress: '0 of 6 completed', action: 'Start travel', actionPrimary: true, timeline: 'today' },
  { id: 'WO-8799', kind: 'installation', priority: 'Normal', window: '01:45 PM to 03:45 PM', status: 'Staged in van', statusTone: 'neutral', customer: 'Kenneth Morris Estates', phone: '555-099-2381', address: '8831 Sunrise Terrace, Calabasas, CA 91302', distance: '7.1 mi, 19 minutes travel', scope: 'Final PTO commissioning and battery integration', scopeNote: 'Enphase IQ8 microinverter sync', progress: 'Stage 4 of 5', action: 'Route next', actionPrimary: false, timeline: 'today' },
  { id: 'WO-8772', kind: 'maintenance', priority: 'Normal', window: '04:00 PM to 05:00 PM', status: 'Scheduled', statusTone: 'neutral', customer: 'Dr. Angela Wu', phone: '555-088-4920', address: '3302 Malibu Vista Point, Malibu, CA 90265', distance: '9.3 mi, 21 minutes travel', scope: 'Bi-annual array wash and ground wire resistance check', scopeNote: 'Customer requested gate code 4812', progress: '0 of 4 completed', action: 'Pre-notify', actionPrimary: false, timeline: 'today' },
]

export const tasksPage = {
  activeToday: 4,
  sync: 'All records synced 2 minutes ago, offline ready',
  stats: { jobs: { done: 4, planned: 6 }, miles: 18.4, nextLeg: '3.4 mi (12 min)', critical: 2, criticalNote: '1 inverter fail, 1 rapid survey', parts: 100, partsNote: 'All microinverters verified' },
  timelines: [
    { value: 'today', label: 'Today', count: 4 },
    { value: 'upcoming', label: 'Upcoming', count: 8 },
    { value: 'completed', label: 'Completed', count: 19 },
    { value: 'all', label: 'All', count: 31 },
  ] as const,
  types: [
    { value: 'all', label: 'All types', count: 6 },
    { value: 'survey', label: 'Site survey', count: 2 },
    { value: 'installation', label: 'Installation', count: 1 },
    { value: 'warranty', label: 'Warranty', count: 2 },
    { value: 'maintenance', label: 'Maintenance', count: 1 },
  ] as const,
  footer: { safety: 'EPA and OSHA safety checklist completed for today\'s assignments.', dispatch: '(800) 555-SOLAR' },
}

export const surveyJob = {
  id: 'SS-PRJ-2024-089',
  status: 'In progress',
  autosave: 'Autosaved just now',
  customer: 'David & Clara Miller',
  address: '1420 Sunburst Ridge, Austin, TX 78704',
  window: 'Today, 10:00 AM to 11:30 AM',
  target: '7.38 kW, 98% offset',
  baseline: [
    { k: 'Dimensions', v: '12.5 m × 7.2 m' },
    { k: 'Claimed area', v: 'About 90.0 m²' },
    { k: 'Reported tilt', v: '25° pitch' },
    { k: 'Azimuth', v: '200° (SSW)' },
  ],
  referencePhotos: [
    { src: img('survey-ref-roof', 640, 420), caption: 'Roof exterior (street)' },
    { src: img('survey-ref-panel', 640, 420), caption: 'Main electrical panel' },
  ],
  profiles: ['Segmented', 'Gable', 'Hip', 'Flat / low'],
  access: [
    { label: 'Easy', note: '1-story standard' },
    { label: 'Moderate', note: '2-story valley access' },
    { label: 'Scaffold required', note: 'High perimeter' },
    { label: 'Steep pitch', note: 'Over 35°, safety tie' },
  ],
  obstacles: [
    { label: 'Masonry chimney on northwest crest', note: 'Minimum setback 0.8 m' },
    { label: 'Mature live oak tree (east exposure)', note: 'About 15% morning shadow' },
    { label: 'Plumbing vent stacks (2 × 3" PVC)', note: 'Avoidance layout' },
  ],
  panel: [
    { k: 'Busbar rating', v: '200 A' },
    { k: 'Spare breaker bays', v: '2 slots (OK)' },
    { k: 'Earth ground rod', v: 'Bond verified' },
  ],
  panelNote: 'NEC compliant (120% rule)',
  recommendation:
    'Layout supports 18 × 410W monocrystalline modules (7.38 kWp) in a dual-row portrait configuration on the south facet. Microinverters mounted under sub-rail racking. Estimated conduit run: 18 m straight exterior run to the garage disconnect switch.',
  photos: [
    { src: img('survey-roof-tiles', 640, 420), title: 'Roof structure and tiles', status: 'Verified', note: 'Asphalt composition shingles in good condition' },
    { src: img('survey-meter', 640, 420), title: 'Main electrical panel and meter', status: 'Legible', note: 'Main breaker panel 200A, label legible' },
    { src: img('survey-horizon', 640, 420), title: 'Shading and horizon angle', status: 'Calculated', note: 'Solar Pathfinder capture: east live oak 15% shadow' },
    { src: img('survey-ground', 640, 420), title: 'Grounding and inverter location', status: 'Approved', note: 'Ground rod electrode and exterior sub-combiner area' },
  ],
  mandatory: { done: 12, total: 12 },
}

export const installJob = {
  id: 'SS-PRJ-2024-042',
  day: 'Day 1 of 2, 8:00 AM to 4:30 PM',
  status: 'In progress',
  title: 'Residential 7.4 kW solar array + battery',
  customer: 'Marcus & Sarah Brody',
  address: '528 Highland Park Blvd, Austin, TX',
  safetyBrief: 'Safety brief signed',
  specs: [
    { k: 'Photovoltaic array', v: '18 × 410W', note: 'Tier-1 mono PERC' },
    { k: 'Storage capacity', v: '10 kWh', note: 'LiFePO4 home storage' },
    { k: 'Inversion', v: 'IQ8 series', note: 'Enphase microinverters' },
    { k: 'Infrastructure', v: '24 ft run', note: '3/4" EMT conduit and isolator' },
  ],
  steps: [
    { title: 'Pre-installation roof safety inspection and anchor points set', body: 'Fall protection harness lines secured, joist integrity inspected, roof deck checked.', done: true, signed: 'M. Vance (T-44)', logged: 'Today, 08:42 AM' },
    { title: 'Racking and flashing installation, waterproof seal tested', body: 'L-feet fastened with chemical sealant; waterproof membrane torque verified to 12 Nm.', done: true, signed: 'M. Vance (T-44)', logged: 'Today, 11:15 AM' },
    { title: 'Panel mounting and DC string / microinverter wiring', body: 'Connecting Enphase trunk cable, bonding clips and modules in string orientation.', done: false, active: true, panels: { done: 14, total: 18 }, lead: 'Marcus Vance', updated: '6 minutes ago' },
    { title: 'AC isolator, conduit run and inverter wiring to main distribution board', body: 'Exterior 24 ft EMT conduit, pull box terminations and main service panel interlock.', done: false, prerequisite: 'String completion', duration: 'About 1.5 hours' },
    { title: 'Commissioning test, voltage verification and inverter grid sync', body: 'Measure Voc, test the anti-islanding protocol and connect the gateway to the cloud hub.', done: false, requirement: 'Utility witness or self-certification, AHJ photo upload required' },
  ],
  diagnostics: [
    { label: 'String 1 open circuit voltage (Voc)', value: '384', unit: 'V DC', note: 'Target nominal 378 to 392 V at 840 W/m²', status: 'Within range', tone: 'ok' as Tone },
    { label: 'Insulation resistance (Megger)', value: '> 100', unit: 'MΩ', note: 'Tested at 500 V DC rail to earth, no ground leakage', status: 'Passed', tone: 'ok' as Tone },
  ],
  notes: 'Customer requested conduit offset along the east fascia board for a cleaner facade. Main panel 200A busbar has 2 spare slots; installed a 40A dedicated solar backfeed breaker with hold-down kit per NEC 705.12.',
  before: [
    { src: img('install-roof-pre', 640, 420), caption: 'Roof pre-condition', meta: '08:14 AM, bare roof surface' },
    { src: img('install-panel-pre', 640, 420), caption: 'Main service panel', meta: '08:29 AM, 200A busbar baseline' },
  ],
  during: [{ src: img('install-mid', 1000, 600), caption: 'Mid-installation progress', meta: 'Just now, 14 of 18 modules attached and grounded' }],
  weather: { summary: 'Roof conditions 78°F, clear', detail: 'Wind 4 mph SW, dry shingle grip', tone: 'ok' as const },
  session: { tech: 'Marcus Vance', timer: '4h 18m on site', wrap: 'Estimated wrap 3:30 PM' },
}
