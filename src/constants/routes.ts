export const ROUTES = {
  /*
    Portals built on src/components/ui, one per signed-in role
    (customer, sales -> ops, technician -> field, manager -> manage). / is the public landing page.
  */
  customer: {
    home: '/customer',
    assessment: '/customer/assessment',
    estimate: '/customer/assessment/estimate',
    consultations: '/customer/consultations',
    consultation: '/customer/consultations/:id',
    quotations: '/customer/quotations',
    quotation: '/customer/quotations/:id',
    projects: '/customer/projects',
    project: '/customer/projects/:id',
    warranty: '/customer/warranty',
    warrantyRequest: '/customer/warranty/:id',
    assistant: '/customer/assistant',
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

  /* Public landing, auth screens, and the portals built on src/components/stitch-ui (admin, technician). */
  HOME: '/',
  STYLEGUIDE: '/styleguide',
  /** Màn công khai & xác thực (landing_home, auth_portal) */
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  FORBIDDEN: '/403',
  COMING_SOON: '/coming-soon',
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
