import { ROUTES } from '@/constants/routes'

export type PortalKey = 'customer' | 'ops' | 'field' | 'manage'

export type NavItem = { label: string; to: string; end?: boolean; badge?: string }
export type NavGroup = { label?: string; items: NavItem[] }

export type Portal = {
  key: PortalKey
  name: string
  home: string
  groups: NavGroup[]
  support?: NavItem[]
  user: { name: string; role: string }
}

export const PORTALS: Record<PortalKey, Portal> = {
  customer: {
    key: 'customer',
    name: 'Homeowner portal',
    home: ROUTES.customer.home,
    user: { name: 'Eleanor Vance', role: 'Oakwood Residence' },
    groups: [
      {
        label: 'Solar journey',
        items: [
          { label: 'Overview', to: ROUTES.customer.home, end: true },
          { label: 'Preliminary Assessment', to: ROUTES.customer.assessment },
          { label: 'Consultation Requests', to: ROUTES.customer.consultations },
          { label: 'Quotations', to: ROUTES.customer.quotations },
          { label: 'My Projects', to: ROUTES.customer.projects },
          { label: 'Warranty & Maintenance', to: ROUTES.customer.warranty },
          { label: 'AI Chatbot', to: ROUTES.customer.assistant },
        ],
      },
    ],
    support: [
      { label: 'Help & FAQs', to: '#' },
      { label: 'Contact Advisor', to: '#' },
    ],
  },
  ops: {
    key: 'ops',
    name: 'Sales & operations',
    home: ROUTES.ops.home,
    user: { name: 'Elena Vance', role: 'Senior consultant' },
    groups: [
      {
        label: 'Solar lifecycle',
        items: [
          { label: 'Dashboard', to: ROUTES.ops.home, end: true },
          { label: 'Consultations', to: ROUTES.ops.consultations },
          { label: 'Customers', to: ROUTES.ops.customers },
          { label: 'Surveys', to: ROUTES.ops.surveys },
          { label: 'Quotations', to: ROUTES.ops.quotations },
          { label: 'Contracts', to: ROUTES.ops.contracts },
          { label: 'Projects', to: ROUTES.ops.projects },
        ],
      },
    ],
    support: [
      { label: 'Notifications', to: '#', badge: '4' },
      { label: 'Profile & Settings', to: '#' },
    ],
  },
  field: {
    key: 'field',
    name: 'Field service',
    home: ROUTES.field.home,
    user: { name: 'Marcus Vance', role: 'Senior field technician' },
    groups: [
      {
        items: [
          { label: 'Dashboard', to: ROUTES.field.home, end: true },
          { label: 'My Tasks', to: ROUTES.field.tasks },
          { label: 'Site Surveys', to: ROUTES.field.surveys },
          { label: 'Installations', to: ROUTES.field.installations },
          { label: 'Warranty & Maintenance', to: ROUTES.field.warranty },
          { label: 'Schedule', to: ROUTES.field.schedule },
          { label: 'Notifications', to: ROUTES.field.notifications },
          { label: 'Profile', to: ROUTES.field.profile },
        ],
      },
    ],
  },
  manage: {
    key: 'manage',
    name: 'Management',
    home: ROUTES.manage.home,
    user: { name: 'Jonathan Mercer', role: 'Regional Director & GM' },
    groups: [
      {
        label: 'Management suite',
        items: [
          { label: 'Executive Dashboard', to: ROUTES.manage.home, end: true },
          { label: 'Projects', to: ROUTES.manage.projects },
          { label: 'Quotation Approvals', to: ROUTES.manage.approvals, badge: '4' },
          { label: 'Operations', to: ROUTES.manage.operations },
          { label: 'Revenue Reports', to: ROUTES.manage.revenue },
        ],
      },
      {
        label: 'System monitor',
        items: [
          { label: 'Alerts & Attention', to: ROUTES.manage.alerts, badge: '7' },
          { label: 'Notifications', to: ROUTES.manage.notifications },
          { label: 'Profile', to: ROUTES.manage.profile },
        ],
      },
    ],
  },
}
