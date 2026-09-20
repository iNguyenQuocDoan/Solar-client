import type { Step } from '@/components/ui/stepper'
import { img } from '@/services/mock'

export const property = {
  name: 'Oakwood Residence',
  projectId: 'OAK-782',
  address: '742 Evergreen Terrace, Springfield, IL',
  liveOutputKw: 6.4,
  owner: 'Eleanor Vance',
}

export const advisor = {
  name: 'Marcus Chen',
  title: 'Senior Solar Solutions Consultant',
  team: 'Springfield Regional Team',
  phone: '+1 (555) 382-9910',
  email: 'marcus.chen@smartsolar.io',
}

/* Overview */
export const overview = {
  milestone: {
    title: 'On-site survey',
    when: 'Thursday, Oct 24 at 10:00 AM',
    daysAway: 3,
    with: advisor.name,
  },
  journey: [
    { label: 'Assessment completed', meta: 'Oct 12, 8.4 kW roof score', state: 'done' },
    { label: 'Consultation active', meta: `${advisor.name} assigned`, state: 'done' },
    { label: 'Survey scheduled', meta: 'Thu, Oct 24, 10:00 AM', state: 'active' },
    { label: 'Official quotation', meta: 'Pre-approval ready', state: 'upcoming' },
    { label: 'Rooftop installation', meta: 'Expected Nov 2024', state: 'upcoming' },
  ] satisfies Step[],
  consultation: {
    id: 'SOL-8492',
    title: 'On-site survey',
    status: 'Survey scheduled',
    date: 'Thursday, Oct 24 at 10:00 AM',
    duration: 'About 45 minutes',
    prep: ['Clear access to the main electrical breaker box.', 'Keep pets indoors during the roof measurement.'],
  },
  proposal: {
    id: 'Q-2024-108',
    status: 'Drafting quote',
    sizeKw: 8.4,
    panels: 21,
    offsetPct: 96,
    coversKwh: 11400,
    savingsPerYear: 2180,
    inverter: 'Enphase IQ8+ microinverters',
    battery: 'Tesla Powerwall 3 (optional)',
  },
  readiness: {
    pct: 35,
    items: [
      { label: 'Remote LiDAR shade analysis', status: 'Completed', tone: 'ok' },
      { label: 'Site inspection and structural check', status: 'In queue', tone: 'accent' },
      { label: 'Township engineering permits', status: 'Pending survey', tone: 'neutral' },
    ] as const,
    crew: 'Bay Area Team Bravo, NABCEP certified installers',
  },
  warranty: {
    plan: 'Smart Solar Protect, 25-year coverage',
    summary: 'Guaranteed 92% production efficiency after 25 years, including inverter replacement and roof penetration protection.',
  },
  events: [
    {
      day: 'Thu',
      date: '24',
      title: 'Roof structural and electrical audit',
      time: '10:00 AM to 10:45 AM',
      kind: 'Field survey',
      detail: `Lead: ${advisor.name}. In person at the residence, driveway access needed.`,
    },
    {
      day: 'Mon',
      date: '28',
      title: 'Design review and financial finalization',
      time: '2:00 PM to 2:30 PM',
      kind: 'Video call',
      detail: 'Google Meet link will be provided.',
    },
  ],
  activity: [
    {
      time: 'Today 9:15 AM',
      title: `${advisor.name} confirmed the site survey`,
      body: 'Appointment locked in for Thursday, Oct 24 at 10:00 AM. Confirmation sent to your phone.',
    },
    {
      time: 'Yesterday 3:40 PM',
      title: 'Preliminary price estimate updated',
      body: 'Recalculated with the 2024 local utility net-metering rebate changes ($420 additional savings per year).',
    },
    {
      time: 'Oct 14',
      title: 'Satellite roof layout generated',
      body: 'Initial orientation mapped: 14 south-facing panels and 7 west-facing panels for peak afternoon generation.',
    },
  ],
}

/* Preliminary self-assessment */
export type AssessmentDraft = {
  address: string
  houseType: string
  roofAge: string
  length: string
  width: string
  tilt: string
  azimuth: string
  photos: { name: string; label: string; size: string; note: string; src: string }[]
  ownerConfirmed: boolean
  smsUpdates: boolean
}

export const assessmentDraft: AssessmentDraft = {
  address: '742 Evergreen Terrace, Springfield, IL',
  houseType: 'Single family, 2 story',
  roofAge: '6',
  length: '12.5',
  width: '6.8',
  tilt: '28',
  azimuth: '180',
  photos: [
    { name: 'IMG_4821_SouthPlane.heic', label: 'South roof angle', size: '3.4 MB', note: 'High resolution', src: img('oakwood-south-roof', 640, 480) },
    { name: 'Service_Box_200A.jpg', label: 'Main electric meter panel', size: '2.1 MB', note: '200A compatible', src: img('oakwood-service-box', 640, 480) },
    { name: 'Roof_Chimney_Flashing.jpg', label: 'Obstruction view, chimney', size: '2.8 MB', note: 'Clear margins', src: img('oakwood-chimney', 640, 480) },
  ],
  ownerConfirmed: true,
  smsUpdates: true,
}

export const assessmentResult = {
  suitabilityScore: 9.8,
  usableAreaM2: 85,
  capacityKw: 11.4,
  grade: 'A+',
  annualKwh: 14280,
  offsetPct: 94,
  specialist: { name: 'Marcus Thorne', cert: 'Illinois Clean Energy Certified' },
  referenceCode: 'SOL-2024-EVG-881',
}

/* Preliminary estimate */
export const estimate = {
  viabilityScore: 94,
  grossRange: [14200, 16800] as const,
  netRange: [9940, 11760] as const,
  paybackYears: '5.8 to 6.5',
  year1Savings: 1480,
  lifetimeCo2Tons: 192,
  system: {
    name: 'Smart Solar EcoPrime 8.4 kW system',
    summary: 'Engineered for pitched residential rooftops with a southern sun trajectory.',
    parts: [
      { name: '21 monocrystalline panels', detail: '400W Tier-1 all-black panels with 21.8% efficiency.' },
      { name: 'Smart microinverters', detail: 'Enphase IQ8 microinverters for panel-level yield.' },
      { name: '24/7 smart gateway', detail: 'Smartphone telemetry for consumption and feed-in monitoring.' },
      { name: '25-year protection', detail: 'Equipment, workmanship and power yield guarantees.' },
    ],
    render: img('oakwood-render', 1200, 800),
    panelsMapped: 21,
  },
  assumptions: [
    { k: 'Annual clean generation', v: 'About 11,200 kWh', note: 'Solar irradiance model' },
    { k: 'Roof usable area', v: '75 m²', note: 'Unshaded pitch surface' },
    { k: 'Orientation and azimuth', v: 'South (182°)', note: 'Optimal daily exposure' },
    { k: 'Utility offset target', v: '104%', note: 'Against a 10,750 kWh baseline' },
  ],
  disclaimer:
    'This is an automated preliminary estimate calculated from your self-assessment measurements and satellite irradiance data. It is not a binding quotation. Official pricing is confirmed after the on-site structural and electrical review by a certified solar engineer.',
}

/* Consultation request */
export const consultation = {
  id: 'CR-9042',
  type: 'Residential consultation',
  submitted: 'October 18, 2024 at 2:15 PM',
  status: 'Site assessment in progress',
  estimatedCompletion: 'Oct 24, 2024',
  steps: [
    { label: 'Submitted', meta: 'Oct 18', state: 'done' },
    { label: 'Under review', meta: 'Approved Oct 19', state: 'done' },
    { label: 'Survey scheduled', meta: 'Thu, Oct 24, 10:00 AM', state: 'active' },
    { label: 'Survey completed', state: 'upcoming' },
    { label: 'Quotation preparing', state: 'upcoming' },
  ] satisfies Step[],
  inspection: {
    when: 'Thursday, Oct 24 at 10:00 AM EST',
    scope: 'Marcus will inspect the structural rafters, the electrical meter box and shading factors.',
    duration: '45 to 60 minutes',
    access: 'Brief exterior yard access and a clear path to your garage or electrical breaker panel.',
    checklist: [
      'Gate unlocked or dogs secured in the house',
      '3-foot clearance around the main breaker panel',
      'Recent electric bills handy in case of questions',
    ],
  },
  propertyData: [
    { k: 'Address', v: '742 Evergreen Terrace, Springfield, OR 97477' },
    { k: 'Parcel', v: 'Verified' },
    { k: 'Roof', v: 'Asphalt shingle, south facing, 28° pitch' },
    { k: 'Target capacity', v: '8.4 kW, about 21 panels, 94% energy offset' },
    { k: 'Utility', v: 'Springfield Power & Light, account SP-88319' },
    { k: 'Main panel', v: '200A breaker' },
  ],
  photos: [
    { src: img('cr-roof-south', 640, 480), name: 'Roof South Plane.jpg', meta: '4.2 MB, clear pitch' },
    { src: img('cr-breaker', 640, 480), name: 'Main Breaker Box.jpg', meta: '3.8 MB, 200A bus' },
    { src: img('cr-obstruction', 640, 480), name: 'Obstruction View.jpg', meta: '5.1 MB, tree buffer' },
  ],
  activity: [
    { time: 'Today 9:40 AM', title: 'Site survey confirmed', body: 'Marcus Chen confirmed the Oct 24, 10:00 AM slot. A calendar invite was sent to eleanor.vance@example.com.' },
    { time: 'Oct 19 3:12 PM', title: 'Senior consultant assigned', body: 'Marcus Chen assigned based on experience with residential shingle roofing in Springfield.' },
    { time: 'Oct 19 11:04 AM', title: 'Satellite LiDAR analysis completed', body: 'Roof radiance model calculated 1,480 peak sun hours per year with southern exposure. Estimated suitability: 98%.' },
    { time: 'Oct 18 2:15 PM', title: 'Consultation request created', body: 'Eleanor Vance submitted property details and 3 reference photos.' },
  ],
  homeownerNote:
    'Side yard gate has a mechanical code latch: 4182. Feel free to enter the backyard directly if I am briefly on a work call when you arrive. Also, please check whether the chimney creates partial shade on the east quadrant after 3 PM.',
  homeownerNoteMeta: 'Eleanor V., added Oct 18',
  support: 'Concierge support is available Monday through Saturday, 8 AM to 7 PM EST.',
}

/* Official quotation */
export const quotation = {
  id: 'QT-8821',
  status: 'Pending customer review',
  validDays: 18,
  expires: 'Nov 25, 2024',
  title: 'Oakwood Residence solar installation',
  issued: 'October 25, 2024',
  preparedBy: advisor.name,
  site: {
    address: '742 Evergreen Terrace, Springfield',
    detail: 'South-facing composite shingle, 28° tilt, 4.8 sun hours per day',
    photo: img('oakwood-quote-site', 1000, 700),
  },
  capacityKw: 8.4,
  year1Kwh: 11400,
  offsetPct: 102,
  lines: [
    { name: 'Solar PV modules', qty: '21 units', detail: 'Smart Solar Black 400W monocrystalline panels, $380 per unit', amount: 7980 },
    { name: 'Microinverters', qty: '21 units', detail: 'Enphase IQ8+ with module-level rapid shutdown, $185 per unit', amount: 3885 },
    { name: 'Racking and rooftop mounting', qty: 'Turnkey', detail: 'QuickMount PV flashed brackets, anodized aluminum rails and grounding clips', amount: 1250 },
    { name: 'Smart monitoring gateway', qty: 'Cellular + WiFi', detail: 'Envoy production meter with split-core consumption CT clamps', amount: 650 },
    { name: 'Engineering, permitting and interconnection', qty: '', detail: 'PE-stamped electrical CAD, Springfield City structural review, utility interconnection filing', amount: 1150 },
    { name: 'Certified installation', qty: 'NABCEP', detail: 'Complete labor, AC disconnect switch, conduit runs and municipal safety inspection sign-off', amount: 2850 },
  ],
  gross: 17765,
  incentives: [
    { name: 'Federal solar tax credit (ITC)', detail: '30% non-refundable tax reduction', amount: -5329.5 },
    { name: 'State clean energy grant', detail: 'Automatic upfront utility incentive', amount: -750 },
  ],
  net: 11685.5,
  cashflow: { currentBill: 195, loanPayment: 89, savings: 106, terms: '15-year clean energy loan at 5.49% APR with $0 down.' },
  warranties: [
    { name: '25-year power yield', detail: 'At least 85% production at year 25' },
    { name: '10-year weather seal', detail: 'Zero-leak roof penetration warranty' },
    { name: 'Workmanship', detail: 'Full labor and service warranty' },
  ],
  license: 'NABCEP Certified Master Installer and Licensed Master Electrician. Contractor license SOL-98442-SP, insured and bonded ($2,000,000 general liability).',
}

/* Project lifecycle */
export const project = {
  id: 'SS-8842-CA',
  type: 'Standard grid-tied 8.4 kW system',
  title: 'Oakwood Residence solar transition',
  address: '2428 Oakwood Crest Lane, Santa Clara, CA 95054',
  stage: 5,
  stageCount: 7,
  steps: [
    { label: 'Consultation', meta: 'Sep 12', state: 'done' },
    { label: 'On-site survey', meta: 'Sep 24', state: 'done' },
    { label: 'Quotation', meta: 'Oct 02', state: 'done' },
    { label: 'Contract signed', meta: 'Oct 10', state: 'done' },
    { label: 'Installation', meta: 'Oct 28 to 30', state: 'active' },
    { label: 'Grid interconnect', meta: 'Target Nov 04', state: 'upcoming' },
    { label: 'Warranty', meta: '25-year system', state: 'upcoming' },
  ] satisfies Step[],
  current: {
    title: 'Rooftop installation in progress',
    summary: 'The installation crew is on site mounting bifacial panels, flashing penetrations and wiring Enphase microinverters.',
    window: 'Oct 28 to Oct 30, 2024',
    health: 'On schedule',
    pct: 68,
  },
  crew: {
    squad: 'Bay Area Squad 3',
    lead: { name: 'David Miller', role: 'Master electrician, lead installer and safety marshal', exp: '12 years', phone: '+1 (555) 714-2209' },
    size: '4 technicians',
    vehicle: 'Van 14 (Ford EV)',
    license: 'C-10 104829',
  },
  schedule: [
    { day: 'Day 1', title: 'Racking and roof safety anchor attachment', when: 'Oct 28', status: 'Completed', tone: 'ok', body: 'IronRidge XR100 rails secured into structural rafters with waterproof flashings. Thermal barrier sealant cured.', notes: ['42 roof penetrations torqued', 'Quality inspection signed'] },
    { day: 'Day 2', title: '21-panel array wiring and microinverter placement', when: 'Today', status: 'In progress', tone: 'accent', body: 'Positioning REC Alpha Pure-R 400W panels with individual Enphase IQ8+ microinverters. Trunk cables clipped into protected raceways.', progress: { done: 14, total: 21 } },
    { day: 'Day 3', title: 'Electrical panel conduit tie-in and smart gateway sync', when: 'Oct 30', status: 'Scheduled', tone: 'neutral', body: 'AC disconnect switch installation, 200A main breaker interlock and Envoy gateway cellular pairing.' },
    { day: 'Inspection', title: 'City building and electrical final inspection', when: 'Nov 04', status: 'Planned', tone: 'neutral', body: 'City of Santa Clara inspector review to grant Permission to Operate and close permit SF-9912.' },
  ] as const,
  feed: [
    { time: '1:42 PM', title: 'Trunk line resistance validated', body: 'David Miller ran continuity checks on the south subarray. All 14 microinverters verified clear impedance.' },
    { time: '11:15 AM', title: 'Mid-day inspection photo uploaded', body: 'Rafter anchoring snapshot added to the city compliance folder.' },
    { time: '8:30 AM', title: 'Hardware delivered to site', body: '21 REC Alpha panels and the Enphase combiner kit unloaded into the driveway staging area.' },
    { time: 'Yesterday', title: 'Day 1 flashing checklist complete', body: 'Water-tight flashings passed electronic sealant verification.' },
  ],
  feedTotal: 18,
  documents: [
    { name: 'Signed solar installation agreement', meta: 'PDF, 2.4 MB, countersigned Oct 10' },
    { name: 'City building permit SF-9912', meta: 'Approved, Santa Clara Dept. of Building' },
    { name: 'Single-line electrical diagram (SLD)', meta: 'PE-stamped blueprint, schematics rev 3' },
  ],
  photos: [
    { src: img('oakwood-before', 800, 600), caption: 'Initial rooftop assessment', meta: 'Before installation, Sep 24, 2024', body: 'South-facing roof pitch verified at 24°. Shingle layer inspected with no dry rot or framing degradation.' },
    { src: img('oakwood-day2', 800, 600), caption: 'Hardware staging and rafter mounts', meta: 'Day 2, today 11:15 AM', body: 'IronRidge racking mounted with stainless lag bolts into center rafters. Microinverter trunk pre-wired.' },
    { src: img('oakwood-cad', 800, 600), caption: 'Digital 3D layout simulation', meta: 'Projected completion, CAD', body: 'Final visualization of 21 symmetrical all-black panels. Estimated 11,240 kWh per year.' },
  ],
}

/* Warranty and maintenance */
export const warranty = {
  policyId: 'SS-PRT-88291-OAK',
  status: 'Active and in good standing',
  plan: 'Smart Solar Protect 25-year full coverage',
  summary: 'Guaranteed energy production, proactive roof integrity protection and 100% replacement coverage on critical generation hardware.',
  expires: 'October 2049',
  remaining: '24 years, 11 months remaining',
  site: 'Oakwood Residence, 8.4 kW monocrystalline array',
  coverage: [
    { k: 'PV solar panels', v: '25 years' },
    { k: 'Microinverters and hub', v: '25 years' },
    { k: 'Workmanship and roof', v: '10 years' },
  ],
  telemetry: { status: 'System operating normally', detail: 'Health report polled 4 minutes ago. All 24 panels synced.', efficiencyPct: 99.8 },
  activeRequests: [
    { id: 'WR-3091', title: 'Panel bird guard inspection and adjustment', status: 'Scheduled for Nov 12', body: 'Annual perimeter check and alignment of the critter guard mesh.', technician: 'Alex Roy', window: '9:00 AM to 11:30 AM' },
  ],
  history: [
    { title: 'Annual preventive health check', result: 'Passed', body: 'Certified field audit. DC array voltage balances verified, rapid shutdown switch operational, no micro-cracking detected via thermography.', when: 'October 18, 2024', ref: 'Service certificate SS-8831' },
    { title: 'Inverter firmware update', result: 'Automated cloud OTA', body: 'Microinverter software updated to build v4.19.2 for improved reactive power response during grid voltage spikes. No interruption.', when: 'October 02, 2024, 2:30 AM UTC', ref: 'Host: SolarCloud Edge 04' },
  ],
  systems: ['Oakwood Residence, 8.4 kW system (24 panels)', 'Pine Cabin, 4.2 kW auxiliary array'],
  serviceTypes: ['Diagnostic check', 'Physical repair', 'Panel cleaning', 'Other inquiry'],
  contact: { phone: '(555) 234-8901', email: 'eleanor.vance@example.com' },
  emergencyPhone: '(800) 555-SOLAR',
}

export const warrantyRequest = {
  id: 'WR-3091',
  altId: '88402-A',
  status: 'Scheduled',
  tier: 'Residential 25-year system protection',
  title: 'Panel bird guard adjustment and rafter seal check',
  site: 'Oakwood Residence, north-east roof plane, 18 SunPower Maxeon 400W panels',
  window: { date: 'Tue, Nov 12', time: '9:00 AM to 11:30 AM EST', access: 'Site access confirmed' },
  steps: [
    { label: 'Ticket submitted', meta: 'Oct 22, 4:18 PM', state: 'done' },
    { label: 'Diagnostic review', meta: 'Oct 23, 10:05 AM', state: 'done' },
    { label: 'Technician assigned', meta: 'Oct 24, 2:30 PM', state: 'done' },
    { label: 'Scheduled visit', meta: 'Nov 12 at 9:00 AM', state: 'active' },
    { label: 'Resolution complete', meta: 'Pending site sign-off', state: 'upcoming' },
  ] satisfies Step[],
  description:
    'Noticed small twigs accumulating near the north-east solar array edge and heard fluttering. Requesting a check of the protective wire mesh netting.',
  photos: [
    { src: img('wr-array-edge', 640, 480), caption: 'North-east array margin', meta: 'photo_array_edge_1.jpg' },
    { src: img('wr-gutter', 640, 480), caption: 'Gutter junction and netting', meta: 'photo_gutter_seam_2.jpg' },
  ],
  plan: {
    brief:
      'Standard perimeter critter guard adjustment kit will be brought to site. No system shutdown required. Rafter seals around flashings will be inspected to confirm the barrier is intact.',
    impact: [
      { k: 'System impact', v: 'Zero downtime, inverters stay active' },
      { k: 'Safety and access', v: 'External ladder, exterior only' },
      { k: 'Warranty coverage', v: '100% covered, $0 deductible' },
    ],
  },
  technician: {
    name: 'Alex Roy',
    cert: 'NABCEP certified solar specialist',
    exp: '8+ years rooftop service',
    phone: '+1 (555) 670-3490',
    background: 'Verified',
    van: 'Van 08 (Smart Solar EV)',
  },
  verification: {
    protocol: 'SEC-PV-2024',
    before: { date: 'Oct 22, 2024', src: img('wr-baseline', 640, 480), body: 'Initial photo documented by the customer showing a localized intrusion gap (under 2.5 cm) along the perimeter flange.' },
    after: 'Alex Roy will upload sealing verification photos and generate the digital QA certificate on site. Both records are archived in your warranty vault.',
  },
  guarantee: 'All service items under this request include an unconditional 24-month craftsmanship extension on mesh adjustments and weather seals.',
  supportPhone: '1-800-555-SOLAR (24/7)',
}

/* Assistant */
export const assistant = {
  profile: { system: 'Oakwood 8.8 kW', contract: 'SS-2024-884', status: 'Connected' },
  domains: ['Products and hardware', 'Installation timeline', 'Warranty and care', 'Billing and permits'],
  recent: [
    { when: 'Yesterday', title: 'Inverter warranty vs panel warranty', meta: '3 highlights, policy SS-PRT-88291' },
    { when: 'Today, 10:14 AM', title: 'Federal solar tax credit and incentives', meta: 'IRS Form 5695 review, $7,920 estimate' },
    { when: '3 days ago', title: 'How does net metering work with PG&E?', meta: 'NEM 3.0 export credits and true-up month' },
  ],
  suggestions: [
    'How does rainy weather affect my daily production?',
    'Explain the 30% federal clean energy tax credit',
    'What should I prepare for the installation crew tomorrow?',
    'How do I transfer my 25-year warranty if I sell my home?',
  ],
  thread: [
    {
      role: 'user' as const,
      time: 'Yesterday, 4:28 PM',
      text: 'Can you break down what the 25-year warranty covers versus the 10-year roof penetration warranty?',
    },
    {
      role: 'assistant' as const,
      time: 'Yesterday, 4:29 PM',
      title: 'Smart Solar multi-tier protection plan',
      text: 'Hi Eleanor. Your Oakwood Residence installation includes two warranty tiers that work together:',
      tiers: [
        { years: '25 years', name: 'PV monocrystalline panels', body: 'At least 85% linear power output through year 25. Includes physical defect repair and factory parts.' },
        { years: '25 years', name: 'Enphase microinverters', body: 'Full hardware replacement and certified technician dispatch if any inverter fails. Zero deductible.' },
        { years: '10 years', name: 'Roof penetration and flashing', body: 'Watertight guarantee on every mounting lag and flashing point against water ingress or tile displacement.' },
      ],
      attachment: { name: 'Oakwood-Warranty-Summary.pdf', meta: 'Policy SS-PRT-88291, 1.4 MB' },
      footer: 'Both policies transfer to a new homeowner at no cost if you sell Oakwood Residence. Would you like to see the transfer procedure?',
    },
  ],
  cannedReply:
    'Referencing your Oakwood Residence microinverter telemetry: even with dense cloud cover or rainfall, the array captures diffuse irradiance and produces between 18% and 32% of rated peak output. On overcast days the historical net reserve is about 1.8 kWh.',
  disclaimer: 'The assistant answers from your Oakwood Residence design documents. For urgent electrical concerns call the 24/7 hotline at (800) 555-SOLAR.',
}
