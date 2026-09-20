import type { Tone } from '@/components/ui/badge'
import type { Step } from '@/components/ui/stepper'
import { img } from '@/services/mock'

export const manageContext = { period: 'Q4 2024, month to date', region: 'Regional overview', gridCapacity: 94.2 }

/* Executive dashboard */
export const execDashboard = {
  portfolio: 142,
  runRate: '104% vs forecast',
  kpis: [
    { label: 'Active portfolio', value: 142, note: '+8.2% vs last month' },
    { label: 'Awaiting action', value: 12, note: '4 high-risk anomalies flagged', tone: 'warn' as const },
    { label: 'Quote approvals', value: 5, note: '$148,200 pipeline' },
    { label: 'In installation', value: 18, note: '2 delayed by permits' },
    { label: 'Service and warranty', value: 7, note: '1 critical inverter fault', tone: 'danger' as const },
    { label: 'Q4 revenue', value: '$1,420k', note: '79% of the $1,800,000 target' },
  ],
  pipeline: {
    live: 142,
    medianCycle: '19.4 days',
    bottleneck: 'Quotation review, +2.1 days average lag',
    phases: [
      { label: 'Consultation', count: 24, note: 'Lead time 3.2 days' },
      { label: 'Site survey', count: 19, note: 'Lead time 4.1 days' },
      { label: 'Quotation', count: 31, note: '+2.1 day average delay', friction: true },
      { label: 'Contract signed', count: 22, note: 'Lead time 2.0 days' },
      { label: 'Installation', count: 18, note: 'Average duration 3.5 days' },
      { label: 'Warranty and ops', count: 28, note: '99.4% fleet uptime' },
    ],
  },
  exceptions: [
    { kind: 'Margin waiver required', tone: 'warn' as Tone, ref: 'QT-8824', value: '$28,450', title: 'David Miller, 9.6 kW Tier-1 SunPower system', body: 'Discount requested at 16.4%, above the standard 15% branch threshold. Submitted by senior account exec Marcus Chen to match a regional competing quote.', meta: 'Waiting 4h 12m. Margin projected 28.1%.', actions: ['Decline or counter', 'Approve discount'], link: 'approval' },
    { kind: 'Structural blocker', tone: 'danger' as Tone, ref: 'INS-7704', value: 'Day 2 of 3', title: 'Chen Residence, 14.2 kW + Tesla Powerwall', body: 'Lead installer flagged Spanish tile truss decay under the south array. Structural engineering redesign needed before city inspector sign-off. Work halted.', meta: 'Crew idle: 6 technicians on site.', actions: ['Reassign crew', 'View blocker and plans'], link: 'alerts' },
    { kind: 'Scope revision', tone: 'info' as Tone, ref: 'QT-8831', value: '$18,900', title: 'Elena Rostova, Enphase storage retrofit', body: 'Customer requested an add-on change from a 5 kWh to a 10 kWh battery module. Net quote revised upward by $6,200. Rebate documentation updated.', meta: 'Storage capacity +100%.', actions: ['Compare diff', 'Approve scope'], link: 'approval' },
    { kind: 'Critical SLA breach (over 48h)', tone: 'danger' as Tone, ref: 'WAR-3309', value: 'Priority 1', title: 'Pemberton Estate, ground fault outage', body: 'Inverter arc-fault error code AFE-094 persistent. Production currently zero. Customer escalation logged with executive support.', meta: 'Production loss 42.8 kWh per day.', actions: ['Dispatch senior field tech'], link: 'alerts' },
  ],
  sprint: {
    week: 48,
    summary: '12 installations this sprint: 6 completed, 4 in progress, 2 awaiting utility inspection.',
    rows: [
      { project: 'Morrison Residence', location: 'Oakridge', id: 'INS-7711', size: '11.4 kW', hardware: '28 panels + 1 Powerwall', crew: 'Alpha Crew', lead: 'T. Vance', status: 'Mounting and racking done (80%)', tone: 'accent' as Tone },
      { project: 'Harrington Farm Estate', location: 'West Valley', id: 'INS-7709', size: '22.8 kW ground', hardware: 'Commercial inverters', crew: 'Bravo Ground Squad', lead: '', status: 'Utility inspection booked (Thu)', tone: 'info' as Tone },
      { project: 'Gomez Villa', location: 'Highland Hills', id: 'INS-7698', size: '8.2 kW rooftop', hardware: 'Enphase microinverters', crew: 'Charlie Rapid Crew', lead: '', status: 'PTO granted, active today', tone: 'ok' as Tone },
      { project: 'Snyder Property', location: 'Riverside Ridge', id: 'INS-7714', size: '16.0 kW', hardware: 'SolarEdge + 20 kWh battery', crew: 'Alpha Electric Specialists', lead: '', status: 'Subpanel tie-in delayed', tone: 'warn' as Tone },
    ],
    stats: [
      { k: 'Install pace', v: '2.4 days per job' },
      { k: 'Hardware in stock', v: '98.5% staged' },
      { k: 'First-pass inspection', v: '94.8% pass rate' },
    ],
  },
  photos: [
    { src: img('exec-7711', 640, 400), caption: 'INS-7711, Alpha Crew', meta: '32 SunPower black panels, south pitch. Flashing passed.' },
    { src: img('exec-7698', 640, 400), caption: 'INS-7698, Charlie Crew', meta: '2 Tesla Powerwall 3 units grounded, inspection ready.' },
  ],
  photoTotal: 48,
  audit: [
    { time: '18m ago', title: 'Utility permission to operate issued', body: 'Pacific Electric confirmed grid interconnect for Gomez Villa (INS-7698). Smart meter programmed and warranty activated.', by: 'Auditor: GridOps' },
    { time: '1h 04m ago', title: 'Contract countersigned and deposit received, $34,800 total', body: 'DocuSign completed by Dr. Wayne Bennett. Initial engineering retainer ($3,480) processed via Stripe.', by: 'Rep: Sarah Lin' },
    { time: '2h 45m ago', title: 'Site survey drone scan certified', body: 'Structural survey lead Carlos Mendez verified pitch, azimuth and shading metrics for Westfield Plaza (SV-4402).', by: 'Field Ops South' },
    { time: '4h 10m ago', title: 'City electrical permit approved', body: 'City of Glendale signed off on the plan revision for Bellingham Residence (PER-0912). Construction crew cleared to mobilize.', by: 'Expediter: CityDesk' },
  ],
  revenue: {
    pct: 79,
    recognized: '$1.42M',
    remaining: '$380k',
    mix: [
      { label: 'Residential rooftop solar', value: 910000, pct: 64 },
      { label: 'Storage and EV add-ons', value: 340000, pct: 24 },
      { label: 'Operations and maintenance contracts', value: 170000, pct: 12 },
    ],
  },
}

/* Project portfolio */
export type PortfolioStage = 'consultation' | 'survey' | 'quotation' | 'permitting' | 'installation' | 'inspection' | 'warranty'

export type PortfolioRow = {
  id: string
  type: string
  customer: string
  address: string
  owner: string
  territory: string
  system: string
  hardware: string
  stage: PortfolioStage
  stageLabel: string
  stageNote: string
  progressLabel: string
  pct: number
  milestone: string
  pto: string
  health: string
  healthTone: Tone
  action: string
}

export const portfolioStages: { value: PortfolioStage | 'all'; label: string; count: number }[] = [
  { value: 'all', label: 'All stages', count: 142 },
  { value: 'consultation', label: 'Consultation', count: 18 },
  { value: 'survey', label: 'Survey and engineering', count: 26 },
  { value: 'quotation', label: 'Quotation and finance', count: 14 },
  { value: 'permitting', label: 'Permitting', count: 19 },
  { value: 'installation', label: 'Installation', count: 21 },
  { value: 'inspection', label: 'Inspection and PTO', count: 12 },
  { value: 'warranty', label: 'Active warranty', count: 32 },
]

export const portfolioRows: PortfolioRow[] = [
  { id: 'PRJ-8821', type: 'Residential rooftop', customer: 'Eleanor Hawthorne', address: '742 Evergreen Terrace, Springfield', owner: 'Marcus Chen', territory: 'Territory 04', system: '8.4 kW, 22 panels', hardware: 'Tesla Powerwall 3 (13.5 kWh)', stage: 'installation', stageLabel: 'Stage 5: Installation', stageNote: 'Racking verified', progressLabel: 'Mounting', pct: 68, milestone: 'Nov 14, 2024', pto: 'Dec 20, 2024', health: 'On track', healthTone: 'ok', action: 'View detail' },
  { id: 'PRJ-8824', type: 'Residential battery add', customer: 'Robert Montgomery', address: '124 Conch Street, Pacific Palisades', owner: 'Elena Vance', territory: 'Territory 01', system: '12.8 kW, 32 panels', hardware: 'Enphase IQ8+, dual Encharge 10T', stage: 'quotation', stageLabel: 'Stage 3: Quotation', stageNote: 'Financing pending signature', progressLabel: 'Customer docs', pct: 90, milestone: 'Nov 28, 2024', pto: 'Feb 15, 2025', health: 'Review needed', healthTone: 'warn', action: 'View detail' },
  { id: 'PRJ-7704', type: 'Commercial agriculture', customer: 'Skyline Vineyards LLC', address: '4800 Napa Valley Hwy, St Helena', owner: 'David Miller', territory: 'Commercial West', system: '45.0 kW ground array', hardware: 'SolarEdge Commercial 50K inverters', stage: 'permitting', stageLabel: 'Stage 4: Permitting', stageNote: 'County utility easement hold', progressLabel: 'Permit resubmission', pct: 42, milestone: 'Oct 10, 2024', pto: 'Delayed (+30 days)', health: 'Delayed permit', healthTone: 'danger', action: 'Resolve hold' },
  { id: 'PRJ-8492', type: 'Residential tile roof', customer: 'Dr. Clara Wallace', address: '883 Silver Lake Blvd, Los Angeles', owner: 'Marcus Chen', territory: 'Territory 04', system: '9.6 kW, 24 panels', hardware: 'REC Alpha Pure-R, Span smart panel', stage: 'inspection', stageLabel: 'Stage 6: Inspection', stageNote: 'Municipal sign-off passed', progressLabel: 'PTO application', pct: 95, milestone: 'Nov 02, 2024', pto: 'Dec 05, 2024', health: 'On track', healthTone: 'ok', action: 'View detail' },
  { id: 'PRJ-9042', type: 'Residential ground mount', customer: 'Thomas & Allison Reyes', address: '3100 Oak Ridge Rd, Calabasas', owner: 'Sarah Jenkins', territory: 'Territory 02', system: '15.2 kW, 38 panels', hardware: 'FranklinWH FHP (27 kWh)', stage: 'warranty', stageLabel: 'Stage 7: Warranty', stageNote: '25-year coverage active', progressLabel: 'Complete', pct: 100, milestone: 'Sep 19, 2024', pto: 'Nov 10, 2024', health: 'Completed', healthTone: 'neutral', action: 'View detail' },
  { id: 'PRJ-6619', type: 'Residential composition', customer: 'Gabriel & Linus Vance', address: '512 Meadowlark Way, Pasadena', owner: 'Elena Vance', territory: 'Territory 01', system: '6.8 kW, 17 panels', hardware: 'SolarEdge HD-Wave, EV charger ready', stage: 'survey', stageLabel: 'Stage 2: Survey and engineering', stageNote: 'Drone LiDAR scan complete', progressLabel: 'Structural calculation', pct: 45, milestone: 'Nov 22, 2024', pto: 'Jan 28, 2025', health: 'On track', healthTone: 'ok', action: 'View detail' },
]

export const portfolio = {
  stats: [
    { label: 'All projects', value: 142, note: '+8.4% month over month' },
    { label: 'Active pipeline', value: 98, note: '69.0% load: surveys, permits, installs' },
    { label: 'Requiring review', value: 12, note: '4 AHJ holds, 8 site redesigns', tone: 'warn' as const },
    { label: 'Completed this quarter', value: 32, note: '100% interconnected to grid' },
  ],
  filters: {
    staff: ['All team members', 'Marcus Chen (Senior Spec)', 'Elena Vance (Regional Lead)', 'David Miller (Commercial Rep)', 'Sarah Jenkins (Fleet Advisor)'],
    health: ['All health states', 'On track', 'Review needed', 'Delayed permit / AHJ', 'Completed / commissioned'],
    period: ['Q4 (rolling 90 days)', 'This month', 'Last 30 days'],
  },
  total: 142,
  valueInView: 348200,
  interconnection: {
    avg: '18.4 days to PTO',
    queues: [
      { utility: 'SCE Territory', days: 14, note: '3 days faster', tone: 'ok' as Tone },
      { utility: 'PG&E Main Grid', days: 26, note: '5 day backlog', tone: 'danger' as Tone },
      { utility: 'SDG&E Coastal', days: 11, note: 'Target met', tone: 'ok' as Tone },
      { utility: 'LADWP Metro', days: 19, note: 'Moderate', tone: 'warn' as Tone },
    ],
    refresh: 'Telemetry refreshes every 15 minutes.',
  },
  crews: {
    active: 6,
    rows: [
      { crew: 'Alpha Crew (Truck 04)', task: 'Installing PRJ-8821, Hawthorne', status: 'On roof', tone: 'accent' as Tone },
      { crew: 'Beta Crew (Truck 07)', task: 'Site survey PRJ-6619, Vance', status: 'In transit', tone: 'neutral' as Tone },
    ],
  },
}

/* Project detail (management view) */
export const projectFile = {
  id: 'PRJ-8821',
  tier: 'Tier 1 residential retrofit',
  synced: 'Last synchronized 4 minutes ago via CrewHub telemetry',
  stage: 'Stage 5 of 7: installation active, day 2 of 3',
  variance: 'Schedule variance 0 days',
  type: 'Single family residential, Net Metering 3.0',
  customer: 'Eleanor Vance',
  title: 'Oakwood Residence solar transition',
  address: '742 Evergreen Terrace, Springfield, CA 95814',
  people: [
    { role: 'Sales account owner', name: 'Marcus Chen' },
    { role: 'Lead installation tech', name: 'David Miller', note: 'Squad 3' },
    { role: 'Executive sign-off', name: 'Jonathan Mercer' },
  ],
  contract: { total: 28450, cleared: 17480, clearedPct: 61.4 },
  specs: [
    { k: 'System physical spec', v: '8.40 kW DC / 7.68 kW AC max' },
    { k: 'Year 1 projected yield', v: '12,680 kWh per year' },
    { k: 'Structural solar plane', v: '21 panels, 2 roof arrays (south and west)' },
    { k: 'Installation progress', v: '68% physically complete' },
  ],
  targetPto: 'November 04, 2024',
  steps: [
    { label: 'Consultation', meta: 'Oct 12, energy audit validated', state: 'done' },
    { label: 'Site survey', meta: 'Oct 19, 85 m² roof, 28° pitch', state: 'done' },
    { label: 'Quotation', meta: 'Oct 21, approved by J. Mercer', state: 'done' },
    { label: 'Contract signed', meta: 'Oct 22, $3,480 deposit paid', state: 'done' },
    { label: 'Installation', meta: 'Active, day 2 of 3', state: 'active' },
    { label: 'Grid interconnect', meta: 'Target Nov 04, AHJ booking pending', state: 'upcoming' },
    { label: 'Warranty and ops', meta: 'Post-PTO kickoff', state: 'upcoming' },
  ] satisfies Step[],
  pulse: {
    title: 'Array railing and DC home runs completed',
    body: 'David Miller logged the array racking torque certification (14.2 Nm) at 11:34 AM today. Inverter micro-trunk cabling underway on the west roof tier.',
    tags: ['Zero material shortages', 'City electrical inspection window opens Nov 01'],
  },
  bom: {
    rev: 'BOM locked, REV-3',
    items: [
      { k: 'Photovoltaic modules', v: '21 × REC 400W', note: 'Alpha Pure Black series, 22.3% cell efficiency, 0.25% degradation per year' },
      { k: 'Inversion', v: '21 × IQ8+ micro', note: 'Enphase rapid shutdown integrated, Envoy-S metered gateway' },
      { k: 'Racking and flashing', v: 'IronRidge XR100', note: 'FlashFoot2 comp shingle mounts, 120 mph wind rated' },
    ],
    arrays: [
      { k: 'Branch 1 (south roof)', v: '12 panels (4.80 kW)' },
      { k: 'Branch 2 (west roof)', v: '9 panels (3.60 kW)' },
      { k: 'AC combiner box', v: 'IQ Combiner 5C' },
      { k: 'Main panel tie-in', v: '200A bus, 40A solar breaker' },
    ],
  },
  telemetry: {
    crew: 'Crew Squad 3 on site, 3 technicians',
    readings: [
      { k: 'DC open circuit string', v: '412.4 V DC', note: 'Within nominal, ±2.1%' },
      { k: 'Ground bond resistance', v: '0.08 Ω', note: 'Passed NEC 250 test' },
      { k: 'Weather and wind window', v: '68°F, 4 mph', note: 'Clear roof conditions' },
    ],
    photos: [
      { src: img('prj-south-racking', 480, 320), caption: 'South racking and flashing', meta: '10:18 AM, lead Miller' },
      { src: img('prj-combiner', 480, 320), caption: 'Combiner 5C conduit routing', meta: '12:44 PM, lead Miller' },
      { src: img('prj-voltmeter', 480, 320), caption: 'DC string voltmeter verification', meta: '1:15 PM, spec pass' },
    ],
    photoTotal: 14,
  },
  audit: {
    tolerance: 'Tolerance variance under 4%',
    rows: [
      { metric: 'Annual utility draw', self: '11,200 kWh per year', survey: '12,140 kWh per year (PG&E 12-month bills)', variance: '+8.3% higher baseline', resolution: 'System sized to 104% offset' },
      { metric: 'Usable roof solar aperture', self: 'About 90 m² estimated', survey: '85.4 m² drone 3D photogrammetry', variance: '-5.1% (HVAC clearance)', resolution: 'Split-array layout adopted' },
      { metric: 'Roof pitch and decking', self: 'Standard gabled', survey: '28° pitch, 1/2" CDX plywood sound', variance: 'Optimal sun angles', resolution: 'No re-sheathing required' },
      { metric: 'Main electrical service panel', self: '200A breaker stated', survey: '200A Square D (copper bus)', variance: 'Zero discrepancy', resolution: '120% NEC rule verified' },
    ],
  },
  ledger: {
    status: 'Good standing',
    split: [
      { label: 'Deposit', pct: 12.2 },
      { label: 'Installation', pct: 49.2 },
      { label: 'Final retainage', pct: 38.6 },
    ],
    rows: [
      { name: 'Initial commitment deposit', note: 'Collected Oct 22, Stripe ACH TX-9011', amount: 3480, state: 'done' },
      { name: 'Hardware drop and mount milestone', note: 'Released Oct 26, auto-cleared on dispatch', amount: 14000, state: 'done' },
      { name: 'Final retainage balance', note: 'Pending city final and utility permission to operate', amount: 10970, state: 'pending' },
    ],
  },
  permits: [
    { authority: 'Authority having jurisdiction (AHJ)', status: 'Approved', tone: 'ok' as Tone, name: 'City of Springfield Dept. of Building', ref: 'SF-9912-SOL', body: 'Issued Oct 24, 2024. Physical posting affixed to the service panel.' },
    { authority: 'Utility provider interconnect', status: 'Review in progress', tone: 'warn' as Tone, name: 'PG&E Net Energy Metering (NEM 3.0)', ref: 'PGE-2024-81992', body: 'Interconnection engineering study passed. Awaiting city final stamp to execute bidirectional meter deployment.' },
  ],
  permitSla: '4 business days remaining in the AHJ final SLA window',
  trail: [
    { time: '1:18 PM', title: 'David Miller (lead tech)', body: 'Array 1 rails secured and grounded. Attaching IQ8+ microinverters now. Customer provided garage access for subpanel breakers.' },
    { time: '10:45 AM', title: 'Marcus Chen (sales)', body: 'Confirmed the homeowner was briefed on roof ladder placement. Ms. Vance verified the Oakwood HOA aesthetic sign-off is on file.' },
    { time: 'Yesterday 4:10 PM', title: 'Jonathan Mercer (regional director)', body: 'Approved expedited racking hardware transfer from Warehouse North to prevent a staging bottleneck.' },
  ],
  compliance: 'Full regulatory clearance: 2024 NEC compliant, UL 1741-SB grid support inverters verified.',
  hotline: '+1 (800) 555-0199',
}

/* Quotation approvals */
export type ApprovalFlag = 'margin' | 'engineering' | 'high-value'

export type Approval = {
  id: string
  customer: string
  address: string
  rep: string
  gross: number
  net: number
  flag: string
  flagTone: Tone
  flags: ApprovalFlag[]
  submitted: string
  stage: string
  slaHours?: number
  specs: { k: string; v: string }[]
  note: string
  margin: string
  criteria: { label: string; tone: Tone }[]
  breakdown: { label: string; amount: number }[]
  actionLabel: string
}

export const approvalQueue = {
  authority: 'Manager authority level 3: $25,000+ and discretionary redlines',
  stats: [
    { label: 'Actionable backlog', value: 5, unit: 'quotations', note: '2 require escrow, 3 ready for one-tap' },
    { label: 'Total value in queue', value: '$148,200', note: 'Average margin 32.8%, gross $163.5k' },
    { label: 'Average turnaround', value: 2.4, unit: 'hours', note: '42 minutes faster than the Q3 SLA target' },
    { label: 'Critical SLA alerts', value: 1, unit: 'over 24h', note: 'QT-8492, 26 hours elapsed', tone: 'danger' as const },
  ],
  chips: [
    { value: 'all', label: 'All pending', count: 5 },
    { value: 'margin', label: 'Margin exception', count: 2 },
    { value: 'engineering', label: 'Custom engineering', count: 1 },
    { value: 'high-value', label: 'High value, over $25k', count: 2 },
  ] as const,
  recentlyApproved: 28,
  sorts: ['Longest in queue (SLA)', 'Quotation value (high to low)', 'Discount percentage'],
  cad: { src: img('cad-roof-8824', 640, 400), caption: 'South azimuth 180°, 0% shading', meta: 'Aurora verified. Calculated year 1 output 14,240 kWh.' },
}

export const approvals: Approval[] = [
  {
    id: 'QT-8824', customer: 'David Miller', address: '104 Elmwood Rd, Westside Hills', rep: 'Marcus Chen', gross: 32450, net: 28450, flag: '12.3% promo discount flagged', flagTone: 'warn', flags: ['margin', 'high-value'], submitted: '3h ago', stage: 'Awaiting regional director sign-off',
    specs: [{ k: 'System array', v: '9.6 kW REC Alpha Pure' }, { k: 'Storage unit', v: '1 Tesla Powerwall 3' }, { k: 'Estimated offset', v: '118% grid coverage' }],
    note: 'Customer had a competitor quote from Sunrun at $29k flat without a backup battery. The extra $4k promo closes the deal today before the federal tax incentive change.',
    margin: '28.4% (minimum policy 26.0%)',
    criteria: [{ label: 'Discount over 10% (12.3% applied)', tone: 'warn' }, { label: 'Gross value over $30,000', tone: 'info' }, { label: 'Storage battery pack added', tone: 'ok' }],
    breakdown: [{ label: 'Base array (9.6 kW REC)', amount: 22500 }, { label: 'Tesla Powerwall 3 (integrated inverter)', amount: 9950 }, { label: 'Rep VIP discretionary discount', amount: -4000 }],
    actionLabel: 'Review detail and redline',
  },
  {
    id: 'QT-8492', customer: 'Robert Jenkins', address: '1420 Meadowview Way', rep: 'Marcus Chen', gross: 41200, net: 41200, flag: 'SLA overdue, 26 hours elapsed', flagTone: 'danger', flags: ['engineering', 'high-value'], submitted: '26h ago', stage: 'Customer scheduled a design debrief in 2 hours', slaHours: 26,
    specs: [{ k: 'Array scale', v: '11.4 kW commercial tier' }, { k: 'Permit complexity', v: 'Seismic rafter sistering' }, { k: 'Financing', v: 'GoodLeap 25-year, 3.99%' }],
    note: 'Structural engineer approved the load calculation for rafter reinforcements. Customer agreed to a 50% split on specialized sistering timber costs.',
    margin: '31.2% after sistering',
    criteria: [{ label: 'SLA overdue, 26 hours', tone: 'danger' }, { label: 'Custom structural line, $3,400', tone: 'warn' }, { label: 'High-value tier, $41,200', tone: 'info' }],
    breakdown: [{ label: 'Base system', amount: 37800 }, { label: 'Custom structural add', amount: 3400 }],
    actionLabel: 'Review and approve engineering',
  },
  {
    id: 'QT-8831', customer: 'Elena Rostova', address: '842 Crestview Terrace', rep: 'Elena Vance', gross: 18900, net: 18900, flag: 'Battery add-on requested', flagTone: 'info', flags: [], submitted: '6h ago', stage: 'Add-on margin meets the nominal target',
    specs: [{ k: 'System specification', v: '7.2 kW + IQ8 microinverters' }, { k: 'Roof assessment', v: 'Composite shingle, good condition' }, { k: 'Estimated 25-year net gain', v: '$38,200 savings' }],
    note: 'Added an Enphase storage unit after the site audit revealed a critical freezer backup need in utility zone 4.',
    margin: '34.1%',
    criteria: [{ label: 'Post-survey scope change', tone: 'info' }, { label: 'IQ8 microinverter paired', tone: 'ok' }],
    breakdown: [{ label: 'Base system', amount: 12700 }, { label: 'Enphase storage retrofit', amount: 6200 }],
    actionLabel: 'Review detail',
  },
  {
    id: 'QT-8819', customer: 'Sarah Lin', address: '88 Oakwood Dr, North Ridge', rep: 'Elena Vance', gross: 23500, net: 23500, flag: 'Standard high tier', flagTone: 'neutral', flags: [], submitted: '1d ago', stage: 'Standard manager clearance',
    specs: [{ k: 'Module brand', v: '8.8 kW SunPower 400W' }, { k: 'Warranty', v: '25-year Complete Confidence' }, { k: 'Payment plan', v: 'Cash purchase' }],
    note: 'Standard cash deal, customer ready for immediate agreement execution.',
    margin: '35.6%',
    criteria: [{ label: 'SunPower premium brand tier', tone: 'info' }, { label: 'Cash purchase terms', tone: 'ok' }],
    breakdown: [{ label: 'Base system', amount: 23500 }],
    actionLabel: 'View details',
  },
  {
    id: 'QT-9012', customer: 'Michael Chang', address: '905 Pine Crest Ave', rep: 'Marcus Chen', gross: 17100, net: 15600, flag: 'Regional clean air rebate ($1,500)', flagTone: 'warn', flags: ['margin'], submitted: '4h ago', stage: 'Rebate documentation pre-validated',
    specs: [{ k: 'Package', v: 'Entry tier, 6.4 kW array' }],
    note: 'Utility rebate paperwork attached and verified in the regional portal.',
    margin: '29.8%',
    criteria: [{ label: 'Regional clean air rebate ($1,500)', tone: 'warn' }, { label: 'Entry tier 6.4 kW package', tone: 'info' }],
    breakdown: [{ label: 'Base system', amount: 17100 }, { label: 'Regional clean air rebate', amount: -1500 }],
    actionLabel: 'Inspect rebate files',
  },
]

export const approvalDetail = {
  id: 'QT-8824',
  status: 'Pending executive sign-off',
  submitted: '2h ago by Marcus Chen (senior rep)',
  exception: {
    policy: 'POL-FIN-084',
    title: 'Requires manager level 3 sign-off',
    body: 'The applied 12.3% promotional discount ($4,000 deduction) exceeds the sales rep discretionary threshold of 10.0%.',
    repNote: 'Customer David Miller presented a counter-offer Sunrun quote at $29,000 flat with comparable battery chemistry. Approving $28,450 matches the Sunrun incentive plus $550 to lock in before the month-end target cutoff.',
  },
  margin: { pct: 28.4, floor: 26.0, contribution: 8079.8, tier: 'Pre-commission tier 1' },
  customer: {
    name: 'David Miller',
    credit: 'Tier 1 credit (790+)',
    address: '104 Elmwood Road, Pleasant Valley, CA 94523',
    profile: 'Single family residence, owner occupied 11 years',
    utility: 'PG&E Tier E-1, $385 per month average',
    financing: 'Cash purchase, 100% escrow funded',
  },
  survey: {
    id: 'SRV-4402',
    status: 'Approved',
    photos: [
      { src: img('srv-4402-drone', 480, 320), caption: 'South pitch drone' },
      { src: img('srv-4402-msp', 480, 320), caption: '200A MSP audit' },
    ],
    facts: [
      { k: 'Roof feasibility', v: '24 panels south plane, 100% solar access' },
      { k: 'Main service panel', v: '200A busbar, no derate needed' },
      { k: 'Obstruction / shading', v: '0.0% TSRF impact, zero shade' },
      { k: 'Field auditor', v: 'Marcus Vance, completed yesterday' },
    ],
    attachments: 4,
  },
  trail: [
    { time: '09:14 AM', title: 'Promotional discount escalated', body: 'Automated rule engine' },
    { time: '08:52 AM', title: 'Quotation draft finalized by Marcus Chen', body: 'v2.4 revision' },
    { time: 'Yesterday 4:30 PM', title: 'Physical site survey cleared', body: 'Auditor sign-off' },
  ],
  architecture: '9.60 kW DC / 13.5 kWh AC',
  items: [
    { name: 'REC Alpha Pure 400W modules', detail: 'All-black hetero-junction premium PV', qty: '24', cost: 5400, retail: 7980 },
    { name: 'Enphase IQ8+ microinverters and trunk', detail: '290 VA peak AC output with grid-forming microgrid', qty: '24', cost: 3120, retail: 4440 },
    { name: 'Tesla Powerwall 3 (13.5 kWh ESS)', detail: 'Integrated solar inverter and whole-home gateway', qty: '1', cost: 7200, retail: 9950 },
    { name: 'IronRidge XR100 racking and flashings', detail: 'Class A fire-rated structural extruded aluminum', qty: '1 kit', cost: 980, retail: 1450 },
    { name: 'Engineering, PE-stamped plans and interconnect', detail: 'City AHJ permit fees and utility net-metering pack', qty: '1 pkg', cost: 750, retail: 1150 },
    { name: 'Turnkey certified labor and master electrician', detail: '2-day crew install, commissioning and PTO coordination', qty: '1 job', cost: 2920, retail: 3480 },
  ],
  gross: 32450,
  discount: { label: 'Applied Sunrun match incentive (12.3%)', amount: -4000, overCap: true },
  final: 28450,
  perWatt: '$2.96 per watt DC',
  guardrails: {
    cogs: 20370.2,
    hardMin: 27527,
    budget: { remaining: 1420, total: 8000, note: 'Will consume the full tier if authorized' },
    competitor: { name: 'Sunrun Northern CA', rate: '$3.02 per watt', winRate: '78% win rate in territory' },
  },
  presets: ['Match $29,000 flat', 'Adjust workmanship'],
  rejectReasons: ['Margin below organizational floor', 'Competitor bid unverified or predatory', 'Customer requires MSP replacement', 'Sales rep discount quota exhausted'],
  hash: '0x8F92...B41E',
}

/* Alerts */
export type AlertGroup = 'critical' | 'financial' | 'field'

export const alerts = {
  summary: { active: 7, districts: 4, exposure: 142650, crews: 3 },
  stats: [
    { label: 'Active bottlenecks', value: 7, note: 'Total pipeline exposure $142.6k' },
    { label: 'Critical SLA breaches', value: 2, note: 'Max stagnation 48h', tone: 'danger' as const },
    { label: 'Margin overrides', value: 2, note: 'Pending director sign, $69,650 volume', tone: 'warn' as const },
    { label: 'Delayed inspections', value: 3, note: 'Fleet impact 2 crews, +26 day utility queue' },
  ],
  chips: [
    { value: 'all', label: 'All issues', count: 7 },
    { value: 'critical', label: 'Critical SLA only', count: 2 },
    { value: 'financial', label: 'Financial / margin', count: 2 },
    { value: 'field', label: 'Field and operations', count: 3 },
  ] as const,
  sections: [
    {
      key: 'quotes', group: 'financial' as AlertGroup, title: 'Quotations awaiting director sign-off', description: 'Standard 8% rep discount cap exceeded or SLA threshold expired.', count: '2 pending approvals',
      items: [
        { ref: 'QT-8824', tone: 'warn' as Tone, tag: 'Promo exceeded', title: 'David Miller', meta: '$28,450 contract value. Rep: Sarah Lin (NW region).', body: 'Policy alert: 12.3% promo discount applied (+$1,220 beyond the automated representative allowance of 8%). System payback window drops to 6.2 years.', actions: ['Approve override', 'Reject and counter'], critical: false },
        { ref: 'QT-8492', tone: 'danger' as Tone, tag: 'Overdue 26h', title: 'Robert Jenkins', meta: '$41,200 contract value. Tier 2 commercial battery add-on.', body: 'Queue timeout: overdue at the regional approval desk by 26 hours. Customer has inquired twice via the client portal. Standard pricing verified clean.', actions: ['Quick approve', 'View full audit'], critical: true },
      ],
    },
    {
      key: 'projects', group: 'field' as AlertGroup, title: 'Critical project escalations', description: 'Work-stoppage risks, municipal AHJ halts and formal client disputes.', count: '2 halted projects',
      items: [
        { ref: 'PRJ-7704', tone: 'danger' as Tone, tag: 'Permit blocked 48h', title: 'Chen Residence', meta: 'City of Pasadena Dept. of Building and Safety. Lead engineer Marcus Boyd.', body: 'AHJ inspector rejection: a structural rafter sistering calculation stamped by a licensed PE is required before the PV permit is issued. Roof installation halted for 48 hours; crew standby costs $650 per day. Milestone delayed: $18,900 PTO.', actions: ['Reassign structural PE', 'View permit ticket'], critical: true },
        { ref: 'PRJ-8819', tone: 'warn' as Tone, tag: 'Aesthetic dispute', title: 'Morales Property', meta: 'Install stage: day 1 electrical rough-in. Account manager Alicia Vance.', body: 'On-site client stop request: the homeowner halted electricians over visible exterior conduit across the front stucco elevation instead of the attic pathing specified in design consultations. Crew paused; HOA aesthetic guideline dispute pending.', actions: ['Contact customer success lead', 'Authorize attic reroute (+$420)'], critical: false },
      ],
    },
    {
      key: 'ops', group: 'field' as AlertGroup, title: 'Delayed operational and field tasks', description: 'Fleet positioning delays and external utility interconnection queues.', count: '2 field actions',
      items: [
        { ref: 'Van 12', tone: 'warn' as Tone, tag: 'Survey window miss', title: 'Service Van 12 (Zone 4)', meta: 'Job 8129 main panel upgrade running long.', body: 'The crew will miss the 2:00 PM site survey window for client Michael Chang. Recommendation: auto-reroute the nearest idle surveyor in Van 08 (4.2 miles away).', actions: ['Auto-reroute to Van 08'], critical: false },
        { ref: 'PTO queue', tone: 'warn' as Tone, tag: 'Systemic delay', title: 'Interconnection PTO bottleneck', meta: 'PG&E Northern Territory.', body: 'Average turnaround spiked from 9 to 26 days across 14 finished residential sites awaiting meter swap. Impacting regional NPS and $68k in retention payments.', actions: ['Escalate with utility liaison'], critical: false },
      ],
    },
    {
      key: 'hardware', group: 'critical' as AlertGroup, title: 'Critical system hardware fault', description: 'Persistent electrical hazards and production failure.', count: 'Priority red',
      items: [
        { ref: 'WAR-3309', tone: 'danger' as Tone, tag: 'Arc fault persistent over 48h', title: 'Pemberton Estate (18.4 kW array)', meta: 'Telemetry code AFE-094, string 3 DC ground inversion. Output 0.00 kWh. South Hills sector, 14 miles from the regional hub.', body: 'Microinverter branch shutdown triggered by the arc fault safeguard; the inverter locked out automatically. The premium warranty SLA guarantees on-site dispatch within 48 hours. Time remaining before SLA breach penalty: 3 hours 12 minutes.', actions: ['Dispatch senior field specialist'], critical: true },
      ],
    },
  ],
  fleet: [
    { van: 'Van 12', status: 'Delayed', note: 'Zone 4, en route', tone: 'warn' as Tone },
    { van: 'Van 08', status: 'Standby', note: 'Zone 4, 4.2 mi away', tone: 'ok' as Tone },
    { van: 'Van 03', status: 'En route to arc ticket', note: 'Zone 1, South Hills', tone: 'danger' as Tone },
  ],
  leads: [
    { name: 'Marcus Boyd', role: 'Lead structural PE' },
    { name: 'Alicia Vance', role: 'Customer success lead' },
    { name: 'Derek Lawson', role: 'PG&E regulatory liaison' },
  ],
  sla: { current: 86, target: 92.4, note: 'Dipped 6.4 points below the 92.4% standard due to PG&E grid interconnection queue spikes in the Alameda and San Joaquin zones.' },
  resolved: [
    { time: '10:45 AM', title: 'QT-8790 override', body: 'Approved a 9.5% discount for Henderson Residence. Margin saved +18.4%.', by: 'J. Mercer' },
    { time: '09:15 AM', title: 'Crew reassignment', body: 'Van 04 diverted to fix a tripped rapid shutdown box at the Ortiz job. Resolved in 34 minutes.' },
    { time: 'Yesterday', title: 'Utility escalation 1102', body: 'SoCal Edison PTO batch release expedited for 6 homes. $54,000 milestone cleared.' },
  ],
  resolvedTotal: 14,
}

/* Operational reports */
export const operations = {
  filters: { horizon: ['Last 90 days', 'Last 30 days', 'Quarter to date'], territory: ['All regions (3 metros)', 'Bay Area', 'Austin', 'Southern California'], asset: ['Residential turnkey', 'Commercial', 'All asset classes'] },
  feeds: 142,
  kpis: [
    { label: 'Projects handled', value: 142, note: '+16.4% vs last quarter, 128 on schedule' },
    { label: 'Average days to PTO', value: 18.4, unit: 'days', note: 'Improved 3.2 days, cap under 21' },
    { label: 'AHJ pass rate', value: '94.8%', note: '135 of 142 first attempt, 92.0% SLA target' },
    { label: 'Crew utilization', value: '88.2%', note: 'Optimized routing' },
    { label: 'Warranty MTTR', value: 28.5, unit: 'hours', note: 'Within the 36h guarantee, 11 open tickets' },
  ],
  throughput: {
    handshakes: 14,
    conversion: '84.1% lead to commission',
    phases: [
      { label: 'Consultation', count: 24, note: 'Discovery and load', avg: '3.4 d' },
      { label: 'Site surveys', count: 19, note: 'LiDAR structural', avg: '2.1 d' },
      { label: 'Quotes pending', count: 31, note: '4 ready for review', avg: '1.8 d' },
      { label: 'Contract sign', count: 22, note: 'Deposit escrow', avg: '2.9 d' },
      { label: 'Active installs', count: 18, note: 'Racking and panels', avg: '2.1 d' },
      { label: 'Interconnection', count: 14, note: 'Utility PTO check', avg: '4.8 d' },
      { label: 'Completed', count: 14, note: 'Grid live this month', avg: '100% PTO' },
    ],
  },
  squads: {
    avgSpeed: '2.1 days per system',
    rows: [
      { name: 'Alpha Squad', metro: 'Bay Area Metro', lead: 'Lead foreman Marcus Vance, 6 journeyman technicians', turnaround: '1.9 d', pass: '96.4%', installs: 7, utilization: '92.4%', safety: '148 days' },
      { name: 'Bravo Squad', metro: 'Austin Metro Hub', lead: 'Lead foreman Elena Rostova, 5 certified techs', turnaround: '2.1 d', pass: '94.1%', installs: 6, utilization: '87.5%', safety: '210 days' },
      { name: 'Delta Techs', metro: 'Southern California', lead: 'Lead master electrician Devon Patel, 5 field techs', turnaround: '2.3 d', pass: '93.8%', installs: 5, utilization: '84.8%', safety: '94 days' },
    ],
    benchmark: { src: img('ortega-residence', 800, 450), title: 'Ortega Residence (Austin, TX)', meta: 'Turnkey turnaround 1.8 days. 10.8 kW array with Powerwall 3. Inspected and PTO active.' },
  },
  reliability: {
    uptime: '98.2% fleet uptime',
    incidents: [
      { label: 'Microinverter communication', pct: 42, note: 'Enphase PLC signal re-pairing and gateway re-association' },
      { label: 'Bird guard / perimeter debris', pct: 28, note: 'Mesh barrier repositioning after high wind or foliage build-up' },
      { label: 'Gateway WiFi disconnects', pct: 18, note: 'Homeowner router credential updates and cellular fallback' },
      { label: 'Rafter flashing seal checks', pct: 12, note: 'Preemptive silicone thermal barrier inspection' },
    ],
    mttrTrend: '7.2 hours faster month over month',
    closed: 89,
    open: 11,
  },
  ahj: {
    rows: [
      { authority: 'City of San Jose Dept. of Planning', note: 'Fast-track SolarApp+ partner', region: 'Bay Area Zone 4', days: 1.2, pass: '98.1%', audits: 18, risk: 'Low latency', tone: 'ok' as Tone },
      { authority: 'Austin Energy Interconnection Services', note: 'Bi-directional meter exchange', region: 'Austin Metro', days: 3.8, pass: '93.4%', audits: 14, risk: 'Controlled', tone: 'warn' as Tone },
      { authority: 'Southern California Edison (SCE)', note: 'NEM 3.0 telemetry gateway', region: 'SoCal Territory', days: 6.4, pass: '89.2%', audits: 22, risk: 'Backlog flag', tone: 'danger' as Tone },
    ],
    total: 19,
    share: '78% of active volume',
  },
}

/* Revenue */
export const revenue = {
  scope: 'Western California',
  kpis: [
    { label: 'Q4 revenue closed', value: '$1,420,000', note: '79% of the $1.80M quota, +$214k vs Q3' },
    { label: 'Active pipeline TCV', value: '$2,840,000', note: '64 contracts in engineering or permit, 81% weighted 30-day conversion' },
    { label: 'Blended ACV', value: '$24,650', note: 'Residential; $58,200 commercial. +8.4% from higher battery attach' },
    { label: 'Average gross margin', value: '32.8%', note: '+2.8 points, floor 30.0%', tone: 'ok' as const },
    { label: 'Forecast pacing', value: '$1,890,000', note: '105% of monthly quota, +$90,000 estimated surplus', tone: 'ok' as const },
  ],
  series: {
    months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    booked: [1.05, 1.18, 1.22, 1.39, 1.42, 1.89],
    realized: [0.82, 0.94, 1.01, 1.12, 1.19, 1.52],
    note: 'Recognition sequence: 10% initial deposit, 50% structural rough-in, 40% PTO final. Nov is month to date, Dec projected.',
    insight: 'Solar PV with dual battery configurations is driving +14.2% year-over-year growth in unit contract margin.',
  },
  tiers: [
    { label: 'Solar + storage bundle', value: 710000, pct: 50.0, note: 'Tesla Powerwall 3 / Enphase 5P' },
    { label: 'Grid-tied PV only', value: 620000, pct: 43.6, note: 'REC Alpha Pure-RX 430W modules' },
    { label: 'Commercial / light C&I', value: 90000, pct: 6.4, note: '3-phase SolarEdge inverters' },
  ],
  backlog: '98.4% hardware available',
  ledger: {
    filters: { advisers: ['All sales advisers', 'Darren Hayes', 'Marissa Sullivan', 'Elena Stone', 'Julian Vance'], margin: ['All margin health', 'Above target (30% and up)', 'Narrow (25% to 29.9%)', 'Flagged (under 25%)'], range: 'Nov 1 to Nov 30' },
    rows: [
      { id: 'PRJ-8821', customer: 'Dr. Evelyn Vance', city: 'Carmel Valley, CA', adviser: 'Darren Hayes', tier: 'Tier 1 elite', system: '12.4 kW DC, 28 panels', hardware: '2 Tesla Powerwall 3 (27 kWh)', gross: 48500, discount: -1200, net: 47300, margin: 36.4, stage: 'Rough-in done (60%)' },
      { id: 'PRJ-8824', customer: 'Marcus & Claire Thorne', city: 'Del Mar, CA', adviser: 'Marissa Sullivan', tier: 'Regional lead', system: '8.6 kW DC, 20 panels', hardware: 'Enphase IQ8+ microinverters', gross: 25200, discount: 0, net: 25200, margin: 33.1, stage: 'Deposit paid (10%)' },
      { id: 'PRJ-7704', customer: 'Pacific Heights Vineyard', city: 'Temecula AVA', adviser: 'Elena Stone', tier: 'Commercial specialist', system: '42.0 kW DC commercial ground mount', hardware: 'SolarEdge SE43.2K + backup hub', gross: 94500, discount: -4500, net: 90000, margin: 30.5, stage: 'PTO retainage (40%)' },
      { id: 'PRJ-8492', customer: 'Harrison & Mia Sterling', city: 'La Jolla, CA', adviser: 'Julian Vance', tier: 'Associate rep', system: '10.2 kW DC, clay tile roof', hardware: '1 Enphase IQ Battery 5P', gross: 36900, discount: -2800, net: 34100, margin: 27.8, stage: 'Deposit paid (10%)' },
      { id: 'PRJ-9042', customer: 'Sunil & Anita Kapoor', city: 'Encinitas, CA', adviser: 'Darren Hayes', tier: 'Tier 1 elite', system: '11.6 kW DC, comp shingle', hardware: '1 Tesla Powerwall 3 (13.5 kWh)', gross: 39400, discount: 0, net: 39400, margin: 35.2, stage: 'PTO approved (100%)' },
    ],
    total: 64,
    flagged: 1,
  },
  phases: [
    { label: 'Initial deposits', amount: 142000, body: '10% contract signing retainer held in escrow', note: 'Conversion lag 2.1 days, 100% cleared', tone: 'ok' as Tone },
    { label: 'Racking and rough-in', amount: 710000, body: '50% milestone billing on mount and DC string completion', note: '22 sites in progress, pacing normal', tone: 'accent' as Tone },
    { label: 'Utility interconnection', amount: 568000, body: '40% final retainage released after NEM or net-billing sign-off', note: 'SDG&E and SCE pending, average 18 days', tone: 'warn' as Tone },
  ],
}
