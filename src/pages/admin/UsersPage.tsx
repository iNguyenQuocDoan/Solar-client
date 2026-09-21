import { useMemo, useState } from 'react'
import { UserFormDialog, type UserFormValues } from '@/components/admin/UserFormDialog'
import { UsersTable } from '@/components/admin/UsersTable'
import { Button, FilterBar, Icon, MetricCard, PageHeader, StatusBadge } from '@/components/stitch-ui'
import { cn } from '@/lib/cn'
import {
  users as initialUsers,
  usersBulkActions,
  usersDefaultScopes,
  usersDirectory,
  usersFilterOptions,
  usersKpis,
  usersPageHeader,
  type RoleFilter,
  type StatusFilter,
  type UserRecord,
} from '@/lib/mock/users'

/* Dựng từ user_management/code.html + screen.png. */

type DialogState = { mode: 'create' } | { mode: 'edit'; user: UserRecord } | null

function matchesRole(user: UserRecord, filter: RoleFilter) {
  if (filter === 'all') return true
  if (filter === 'technician') return user.role === 'lead-technician' || user.role === 'field-technician'
  return user.role === filter
}

function matchesStatus(user: UserRecord, filter: StatusFilter) {
  if (filter === 'all') return true
  if (filter === 'inactive') return false
  return user.status === filter
}

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers)
  const [selected, setSelected] = useState<Set<string>>(() => new Set(usersDirectory.initiallySelected))
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [scopes, setScopes] = useState(usersDefaultScopes)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(usersDirectory.pageSizeOptions[0] ?? 10)
  const [dialog, setDialog] = useState<DialogState>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return users.filter(
      (user) =>
        matchesRole(user, roleFilter) &&
        matchesStatus(user, statusFilter) &&
        (regionFilter === 'all' || user.regions.includes(regionFilter)) &&
        (query === '' ||
          [user.name, user.email, user.employeeId, user.phone].some((value) => value.toLowerCase().includes(query))),
    )
  }, [users, search, roleFilter, statusFilter, regionFilter])

  const isFiltering = search.trim() !== '' || roleFilter !== 'all' || statusFilter !== 'all' || regionFilter !== 'all'
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)
  const total = isFiltering ? filtered.length : usersDirectory.total

  const resetFilters = () => {
    setSearch('')
    setRoleFilter('all')
    setStatusFilter('all')
    setRegionFilter('all')
    setScopes(usersDefaultScopes)
    setPage(1)
  }

  const handleSubmit = (values: UserFormValues) => {
    if (dialog?.mode === 'edit') {
      const id = dialog.user.id
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...values } : user)))
    } else {
      const id = `EMP-${Math.floor(1000 + Math.random() * 9000)}`
      setUsers((prev) => [
        {
          id,
          employeeId: `#${id}`,
          initials: initialsOf(values.name),
          phone: '—',
          avatarTone: 'neutral',
          status: 'pending',
          created: 'Just now',
          lastActivity: 'Invite sent',
          lastDevice: 'Awaiting first sign-in',
          apiTokens: 0,
          identityLog: [{ event: 'Invitation sent', when: 'now' }],
          ...values,
        },
        ...prev,
      ])
    }
    setDialog(null)
  }

  return (
    <>
      <PageHeader
        breadcrumb={usersPageHeader.breadcrumb}
        meta={
          <>
            <Icon name="sync" className="text-[16px] text-tertiary-container" />
            <span className="text-outline">{usersPageHeader.syncStatus}</span>
          </>
        }
        eyebrow={
          <>
            <StatusBadge variant="solid" dot={false} size="sm" className="uppercase tracking-wider">
              {usersPageHeader.badges.primary}
            </StatusBadge>
            <StatusBadge variant="neutral" dot={false} size="sm">
              {usersPageHeader.badges.version}
            </StatusBadge>
          </>
        }
        title={usersPageHeader.title}
        titleClassName="text-primary"
        description={usersPageHeader.description}
        bottomSpacing="xl"
        actions={
          <>
            <Button variant="tonal" size="md" iconLeft="file_download" className="h-11 hover:bg-surface-container-high">
              {usersPageHeader.actions.export}
            </Button>
            <Button size="md" iconLeft="person_add" className="h-11 px-5 shadow-md" onClick={() => setDialog({ mode: 'create' })}>
              {usersPageHeader.actions.invite}
            </Button>
          </>
        }
      />

      <section className="mb-space-xl grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
        {usersKpis.map((kpi) => (
          <MetricCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <FilterBar
        className="mb-space-lg"
        search={{
          placeholder: usersFilterOptions.searchPlaceholder,
          value: search,
          onChange: (e) => {
            setSearch(e.target.value)
            setPage(1)
          },
        }}
        selects={[
          {
            key: 'role',
            'aria-label': 'Filter by role',
            options: usersFilterOptions.roles,
            value: roleFilter,
            onChange: (e) => {
              setRoleFilter(e.target.value as RoleFilter)
              setPage(1)
            },
            className: 'min-w-[170px]',
          },
          {
            key: 'status',
            'aria-label': 'Filter by status',
            options: usersFilterOptions.statuses,
            value: statusFilter,
            onChange: (e) => {
              setStatusFilter(e.target.value as StatusFilter)
              setPage(1)
            },
          },
          {
            key: 'region',
            'aria-label': 'Filter by region',
            options: usersFilterOptions.regions,
            value: regionFilter,
            onChange: (e) => {
              setRegionFilter(e.target.value)
              setPage(1)
            },
            className: 'min-w-[160px]',
          },
        ]}
        scopes={{
          label: 'Active Scopes:',
          items: scopes.map((scope) => ({
            key: scope,
            label: scope,
            onRemove: () => setScopes((prev) => prev.filter((s) => s !== scope)),
          })),
          onReset: resetFilters,
        }}
        trailing={
          <>
            <span className="text-body-sm text-on-surface-variant">
              Selected: <strong className="text-on-surface">{selected.size}</strong>
            </span>
            {usersBulkActions.map((action) => (
              <button
                key={action.key}
                type="button"
                disabled={selected.size === 0}
                className={cn(
                  'flex items-center gap-1 rounded-lg bg-surface-container-high px-2.5 py-1 text-label-sm text-on-surface-variant transition-colors disabled:opacity-50',
                  action.hover,
                )}
              >
                <Icon name={action.icon} className="text-[14px]" />
                <span>{action.label}</span>
              </button>
            ))}
          </>
        }
      />

      <UsersTable
        users={pageRows}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        activeUserId={dialog?.mode === 'edit' ? dialog.user.id : undefined}
        onEdit={(user) => setDialog({ mode: 'edit', user })}
        pagination={{
          page,
          pageSize,
          total,
          visibleCount: pageRows.length,
          onPageChange: setPage,
          pageSizeOptions: usersDirectory.pageSizeOptions,
          onPageSizeChange: (size) => {
            setPageSize(size)
            setPage(1)
          },
          itemLabel: 'users',
        }}
      />

      <UserFormDialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) setDialog(null)
        }}
        mode={dialog?.mode ?? 'create'}
        user={dialog?.mode === 'edit' ? dialog.user : undefined}
        onSubmit={handleSubmit}
      />
    </>
  )
}
