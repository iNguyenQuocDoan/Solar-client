export const ROUTES = {
  /* Portals built on src/components/ui (customer, sales & operations, field, management). */
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

  /* Portals built on src/components/stitch-ui (admin, technician) and its styleguide. */
  HOME: '/',
  STYLEGUIDE: '/styleguide',
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    ROLES: '/admin/roles',
    PRODUCTS: '/admin/products',
    SERVICES: '/admin/services',
    CATEGORIES: '/admin/categories',
    KNOWLEDGE_BASE: '/admin/knowledge-base',
    TECH_CONFIG: '/admin/config',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
    PROFILE: '/admin/profile',
  },
  TECH: {
    DASHBOARD: '/tech',
    TASKS: '/tech/tasks',
    SURVEYS: '/tech/surveys',
    INSTALLATIONS: '/tech/installations',
    MAINTENANCE: '/tech/maintenance',
    WARRANTY: '/tech/warranty',
    SCHEDULE: '/tech/schedule',
    ALERTS: '/tech/alerts',
    SETTINGS: '/tech/settings',
  },
} as const

export function withId(pattern: string, id: string) {
  return pattern.replace(':id', id)
}

/** Đường dẫn chi tiết một task của technician: /tech/tasks/:id */
export const techTaskPath = (id: string) => `${ROUTES.TECH.TASKS}/${id}`

/** Luồng khảo sát: /tech/surveys/:id, .../verify, .../photos */
export const surveyPath = (id: string) => `${ROUTES.TECH.SURVEYS}/${id}`
export const surveyVerifyPath = (id: string) => `${surveyPath(id)}/verify`
export const surveyPhotosPath = (id: string) => `${surveyPath(id)}/photos`

/** Luồng lắp đặt: /tech/installations/:id và .../checklist */
export const installationPath = (id: string) => `${ROUTES.TECH.INSTALLATIONS}/${id}`
export const installationChecklistPath = (id: string) => `${installationPath(id)}/checklist`

/** Bảo trì và bảo hành: /tech/maintenance/:id, /tech/warranty/:id */
export const maintenancePath = (id: string) => `${ROUTES.TECH.MAINTENANCE}/${id}`
export const warrantyPath = (id: string) => `${ROUTES.TECH.WARRANTY}/${id}`
