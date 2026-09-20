export const ROUTES = {
  customer: {
    home: '/',
    assessment: '/assessment',
    estimate: '/assessment/estimate',
    consultations: '/consultations',
    consultation: '/consultations/:id',
    quotations: '/quotations',
    quotation: '/quotations/:id',
    projects: '/projects',
    project: '/projects/:id',
    warranty: '/warranty',
    warrantyRequest: '/warranty/:id',
    assistant: '/assistant',
  },
  ops: {
    home: '/ops',
    consultations: '/ops/consultations',
    customers: '/ops/customers',
    surveys: '/ops/surveys',
    quotations: '/ops/quotations',
    contracts: '/ops/contracts',
    projects: '/ops/projects',
  },
  field: {
    home: '/field',
    tasks: '/field/tasks',
    surveys: '/field/surveys',
    survey: '/field/surveys/:id',
    installations: '/field/installations',
    installation: '/field/installations/:id',
    warranty: '/field/warranty',
    schedule: '/field/schedule',
    notifications: '/field/notifications',
    profile: '/field/profile',
  },
  manage: {
    home: '/manage',
    projects: '/manage/projects',
    project: '/manage/projects/:id',
    approvals: '/manage/approvals',
    approval: '/manage/approvals/:id',
    operations: '/manage/operations',
    revenue: '/manage/revenue',
    alerts: '/manage/alerts',
    notifications: '/manage/notifications',
    profile: '/manage/profile',
  },
} as const

export function withId(pattern: string, id: string) {
  return pattern.replace(':id', id)
}
