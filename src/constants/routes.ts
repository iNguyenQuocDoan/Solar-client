export const ROUTES = {
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
