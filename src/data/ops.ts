import type { Tone } from '@/components/ui/badge'

export const opsContext = { team: 'California Residential Team A', region: 'CA region' }

export const salesDashboard = {
  priorityCount: 12,
  pipelineCount: 8,
  conditions: 'Weather and permitting conditions in Northern California are optimal.',
  pipeline: [
    { label: 'New inquiries', count: 5, note: 'Awaiting triage' },
    { label: 'Review requested', count: 3, note: 'Pending evaluation' },
    { label: 'To schedule', count: 4, note: 'Ready to book' },
    { label: 'Surveys done', count: 6, note: 'Review needed' },
    { label: 'Draft quotes', count: 2, note: 'In preparation' },
    { label: 'Manager approval', count: 3, note: 'Pending sign-off' },
    { label: 'Accepted', count: 4, note: 'Ready for contract' },
    { label: 'Contracts', count: 2, note: 'Deposit pending' },
  ],
  tasks: [
    { customer: 'Harrison Morales', task: 'Needs survey', due: 'Expires in 3h', dueTone: 'danger' as Tone, detail: '742 Evergreen Terrace, Palo Alto, CA. System: 11.4 kW DC roof mount.', action: 'Schedule' },
    { customer: 'Claire Beaumont', task: 'Review survey result', due: 'Expires in 5h', dueTone: 'warn' as Tone, detail: '1204 Woodside Dr, Redwood City, CA. Tech notes: main panel upgrade required.', action: 'Review' },
    { customer: 'Marcus Vance (commercial lead)', task: 'Approve quotation', due: '24h grace period', dueTone: 'neutral' as Tone, detail: '480 Bernardo Ave, Sunnyvale, CA. Quote Q-8491: $48,600 with 3 Enphase batteries.', action: 'Authorize' },
    { customer: 'Dr. Aris Thorne', task: 'Record deposit', due: 'Due today 5:00 PM', dueTone: 'warn' as Tone, detail: '883 Crestline Dr, San Jose, CA. Wire reference WF-99420, $2,500 initial escrow.', action: 'Record' },
  ],
  surveys: [
    { when: 'Today, 10:30 AM', status: 'Survey today', tone: 'ok' as Tone, customer: 'Nathaniel Cross', address: '312 Fremont Blvd, Fremont', assignee: 'Dave Miller', role: 'Lead' },
    { when: 'Today, 2:15 PM', status: 'En route', tone: 'warn' as Tone, customer: 'Sarah & Kevin Lee', address: '941 Los Gatos Way, San Jose', assignee: 'Jake Kovacs', role: 'Tech' },
    { when: 'Tomorrow, 9:00 AM', status: 'Confirmed', tone: 'info' as Tone, customer: 'Priya Patel', address: '510 Alpine Terrace, Oakland', assignee: 'Ana Reyes', role: 'Lead' },
  ],
  activity: [
    { time: '14 min ago', title: 'Contract executed', body: 'Robert Chen signed the 9.8 kW solar + Tesla Powerwall 3 agreement ($31,200) through DocuSign.' },
    { time: '42 min ago', title: 'Drone LiDAR map uploaded', body: 'Survey tech Dave Miller uploaded the high-resolution roof azimuth scan for 114 Meadow Ln.' },
    { time: '1h 10m ago', title: 'Manager approved quotation', body: 'Regional Director approved a 5% bundle discount on quotation Q-8488.' },
  ],
  shortcuts: [
    { label: 'New inbound leads', note: 'Triage intake funnel', count: 5 },
    { label: 'Draft quotations', note: 'Ready for pricing review', count: 2 },
    { label: 'Awaiting deposit', note: 'Signed agreements holding', count: 2 },
  ],
  quota: {
    month: 'October',
    pct: 76.6,
    current: 184000,
    target: 240000,
    pipelineValue: 320500,
    pipelineDelta: '+14% vs last month',
    closeRate: 41.8,
    closeNote: 'Top 10% of reps',
    stages: [
      { label: 'Contracts', value: 184000, pct: 57 },
      { label: 'Accepted', value: 78000, pct: 24 },
      { label: 'Survey', value: 42000, pct: 13 },
      { label: 'Leads', value: 16000, pct: 6 },
    ],
  },
  inquiries: [
    { name: 'Grace Lin', note: 'Estimated $280/mo bill' },
    { name: 'Thomas Anstead', note: 'EV charger + solar' },
    { name: 'Whitney & Kyle Ross', note: 'Battery backup priority' },
  ],
  inquiriesTotal: 5,
}

export type RequestStage = 'new' | 'evaluation' | 'survey-needed' | 'survey-scheduled' | 'archived'

export type ConsultationRequest = {
  id: string
  type: string
  homeowner: string
  contact: string
  address: string
  city: string
  intake: string
  age: string
  sla: string
  slaTone: Tone
  highlights: { label: string; tone: Tone }[]
  stage: RequestStage
  stageLabel: string
  stageTone: Tone
  assignee: string | null
  action: string
}

export const requestStages: { value: RequestStage | 'all'; label: string; count: number }[] = [
  { value: 'all', label: 'All requests', count: 48 },
  { value: 'new', label: 'New assessment', count: 9 },
  { value: 'evaluation', label: 'Under evaluation', count: 14 },
  { value: 'survey-needed', label: 'Survey needed', count: 8 },
  { value: 'survey-scheduled', label: 'Survey scheduled', count: 11 },
  { value: 'archived', label: 'Archived', count: 6 },
]

export const consultationRequests: ConsultationRequest[] = [
  { id: 'REQ-8492', type: 'Tier 1 residential', homeowner: 'Robert & Sarah Jenkins', contact: '+1 (512) 890-4122', address: '1420 Meadowview Way', city: 'Austin, TX 78704', intake: 'Oct 24, 2024', age: '2h ago', sla: 'SLA warning, 58m left', slaTone: 'warn', highlights: [{ label: '42 m² south facing', tone: 'neutral' }, { label: 'Shading risk flagged', tone: 'danger' }], stage: 'evaluation', stageLabel: 'Review required', stageTone: 'warn', assignee: 'Elena Vance', action: 'Review assessment' },
  { id: 'REQ-8491', type: 'EV-ready storage', homeowner: 'David & Maya Chen', contact: 'd.chen.austin@gmail.com', address: '8804 West Oak Terrace', city: 'Austin, TX 78731', intake: 'Oct 24, 2024', age: '4h ago', sla: 'On track', slaTone: 'ok', highlights: [{ label: '65 m² standing seam', tone: 'neutral' }, { label: 'High solar gain', tone: 'ok' }], stage: 'survey-scheduled', stageLabel: 'Survey scheduled', stageTone: 'info', assignee: 'Marcus Thorne', action: 'Survey briefing' },
  { id: 'REQ-8488', type: 'Battery storage add-on', homeowner: 'Kathryn Long & Family', contact: '+1 (512) 349-9801', address: '302 Crestview Ridge', city: 'Lakeway, TX 78734', intake: 'Oct 23, 2024', age: '1d ago', sla: 'On track', slaTone: 'ok', highlights: [{ label: 'Standard sloped tile', tone: 'neutral' }, { label: '3-phase 200A panel', tone: 'neutral' }], stage: 'survey-needed', stageLabel: 'Survey pending', stageTone: 'accent', assignee: 'Sarah Chen', action: 'Schedule survey' },
  { id: 'REQ-8484', type: 'Grid-tied 11.2 kW', homeowner: 'Bradley & Lisa Wright', contact: 'wright_b@txtech.edu', address: '512 Barton Springs Rd', city: 'Austin, TX 78704', intake: 'Oct 22, 2024', age: '2d ago', sla: 'On track', slaTone: 'ok', highlights: [{ label: 'Survey verified by drone', tone: 'neutral' }, { label: 'Zero shading', tone: 'ok' }], stage: 'evaluation', stageLabel: 'Quotation ready', stageTone: 'ok', assignee: 'Elena Vance', action: 'Prepare quote' },
  { id: 'REQ-8479', type: 'Self-portal web', homeowner: 'Arthur & Nora Pendelton', contact: '+1 (512) 651-4099', address: '7401 Shoal Creek Blvd', city: 'Austin, TX 78757', intake: 'Oct 24, 2024', age: '18m ago', sla: 'New lead', slaTone: 'info', highlights: [{ label: '52 m² hip roof', tone: 'neutral' }, { label: 'High electric bill', tone: 'neutral' }], stage: 'new', stageLabel: 'New request', stageTone: 'info', assignee: null, action: 'Assign lead' },
  { id: 'REQ-8472', type: 'Retrofit panels', homeowner: 'Gabriel & Sofia Morales', contact: '+1 (512) 714-2210', address: '1904 Evergreen Ave', city: 'Austin, TX 78704', intake: 'Oct 23, 2024', age: '18h ago', sla: 'On track', slaTone: 'ok', highlights: [{ label: 'Tile roof replacement', tone: 'neutral' }, { label: 'Permit pending', tone: 'warn' }], stage: 'evaluation', stageLabel: 'Review required', stageTone: 'warn', assignee: 'Marcus Thorne', action: 'Review assessment' },
]

export const requestsDirectory = {
  stats: { activeIntake: 48, avgTriageSla: '1.8h', surveyBacklog: 8 },
  total: 48,
  filters: {
    assessment: ['All assessment types', 'Verified complete', 'Incomplete details', 'Flagged shading or roof'],
    stage: ['All funnel stages', 'Preliminary assessment', 'Sales review', 'Survey scheduled', 'Quotation draft'],
    consultant: ['All staff members', 'Elena Vance (Senior)', 'Marcus Thorne', 'Sarah Chen', 'Unassigned'],
    window: ['Last 7 days', 'This month', 'Last 30 days', 'Custom date range'],
  },
  region: {
    clusters: [
      { area: 'South Austin (78704)', pct: 42, leads: 20 },
      { area: 'Lakeway / Hills (78734)', pct: 31, leads: 15 },
    ],
    clusterNote: 'High rooftop irradiance index in zip 78704.',
    triage: { avg: '1h 48m', health: '94.2% healthy', note: '1 request currently inside the SLA escalation window.' },
    fleet: { vans: 3, nextSlot: 'Tomorrow, 10:30 AM', crew: 'Crew Delta' },
  },
}
