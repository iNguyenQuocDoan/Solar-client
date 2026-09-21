import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import {
  Button,
  Card,
  Checkbox,
  ChecklistItem,
  DataTable,
  FilterBar,
  FilterChip,
  Icon,
  IconButton,
  MetricCard,
  PageHeader,
  PhotoCard,
  PhotoDropzone,
  PhotoGrid,
  ProgressBar,
  StatusBadge,
  TaskCard,
  Timeline,
  type DataTableColumn,
} from '@/components/stitch-ui'
import { ROUTES } from '@/constants/routes'
import {
  styleguideBadges,
  styleguideChecklist,
  styleguideMetrics,
  styleguidePageHeader,
  styleguidePhotos,
  styleguideRegionOptions,
  styleguideRoleOptions,
  styleguideStatusOptions,
  styleguideTaskCards,
  styleguideTimeChips,
  styleguideTimeline,
  styleguideTypeChips,
  styleguideUsers,
  type StyleguideUser,
} from '@/lib/mock/styleguide'

const sections = [
  { id: 'buttons', label: 'Button' },
  { id: 'badges', label: 'StatusBadge' },
  { id: 'metrics', label: 'MetricCard' },
  { id: 'page-header', label: 'PageHeader' },
  { id: 'filter-bar', label: 'FilterBar' },
  { id: 'data-table', label: 'DataTable' },
  { id: 'task-card', label: 'TaskCard' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'checklist', label: 'ChecklistItem' },
  { id: 'photos', label: 'PhotoGrid' },
  { id: 'primitives', label: 'Primitives' },
]

function Section({
  id,
  title,
  source,
  description,
  children,
}: {
  id: string
  title: string
  /** Màn thiết kế tham chiếu */
  source: string
  description?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-space-md">
      <div className="flex flex-wrap items-baseline justify-between gap-space-xs">
        <div>
          <h2 className="text-headline-lg text-on-surface">{title}</h2>
          {description && <p className="text-body-sm text-on-surface-variant">{description}</p>}
        </div>
        <span className="rounded-lg bg-surface-container px-2 py-0.5 font-mono text-[11px] text-on-surface-variant">
          {source}
        </span>
      </div>
      {children}
    </section>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const userColumns: DataTableColumn<StyleguideUser>[] = [
  {
    key: 'identity',
    header: 'User / Identity',
    render: (user) => (
      <div className="flex items-center gap-space-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-label-md font-bold text-on-primary">
          {initials(user.name)}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-body-lg font-bold text-on-surface">{user.name}</span>
          <div className="flex items-center gap-2 text-body-sm text-outline">
            <span className="rounded bg-surface-container-low px-1.5 py-0.5 font-mono text-[11px] text-on-surface-variant">
              {user.employeeId}
            </span>
            <span>• {user.department}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'contact',
    header: 'Contact & Comms',
    render: (user) => (
      <div className="flex flex-col">
        <span className="font-medium text-on-surface">{user.email}</span>
        <span className="text-body-sm text-outline">{user.phone}</span>
      </div>
    ),
  },
  {
    key: 'role',
    header: 'Platform Role',
    render: (user) => (
      <StatusBadge variant={user.roleVariant} size="sm" dot={false} className="font-semibold">
        {user.role}
      </StatusBadge>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (user) => (
      <StatusBadge variant={user.statusVariant} size="sm" className="font-semibold">
        {user.status}
      </StatusBadge>
    ),
  },
  {
    key: 'created',
    header: 'Created',
    className: 'text-body-sm text-on-surface-variant',
    render: (user) => user.created,
  },
  {
    key: 'activity',
    header: 'Last Activity',
    render: (user) => (
      <div className="flex flex-col">
        <span className="text-label-sm font-semibold text-on-surface">{user.lastActivity}</span>
        <span className="text-[11px] text-outline">{user.lastDevice}</span>
      </div>
    ),
  },
]

const defaultScopes = ['Enterprise Only', 'MFA Enforced']

export function StyleguidePage() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['EMP-1001', 'EMP-3319']))
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [checks, setChecks] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(styleguideChecklist.map((item) => [item.id, item.checked])),
  )
  const [timeChip, setTimeChip] = useState('today')
  const [typeChip, setTypeChip] = useState('all')
  const [search, setSearch] = useState('')
  const [scopes, setScopes] = useState(defaultScopes)
  const [notes, setNotes] = useState<string[]>(() => styleguidePhotos.map((photo) => photo.note ?? ''))
  const [demoChecked, setDemoChecked] = useState(true)

  const verifiedCount = styleguideChecklist.filter((item) => checks[item.id]).length

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-outline-card bg-surface-container-lowest/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-space-md px-space-xl py-space-sm">
          <Link to={ROUTES.HOME} className="text-headline-md text-primary">
            Smart Solar UI
          </Link>
          <nav aria-label="Sections" className="flex flex-wrap gap-space-2xs">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-lg px-space-sm py-1 text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1280px] flex-col gap-space-3xl px-space-xl py-space-xl">
        <Section id="buttons" title="Button" source="DESIGN.md › Buttons" description="primary / secondary / accent theo spec; tonal / ghost là nút phụ lặp lại trong code.html.">
          <Card className="flex flex-col gap-space-md">
            <div className="flex flex-wrap items-center gap-space-sm">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="accent" iconLeft="send">
                Accent
              </Button>
              <Button variant="tonal" iconLeft="health_and_safety">
                Tonal
              </Button>
              <Button variant="ghost" iconLeft="directions">
                Ghost
              </Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-space-sm">
              <Button size="sm" iconLeft="add">
                Small
              </Button>
              <Button size="md" iconLeft="add">
                Medium
              </Button>
              <Button size="lg" iconLeft="add_circle" iconRight="expand_more">
                Large (48px)
              </Button>
              <IconButton icon="tune" label="Edit permissions" />
              <IconButton icon="visibility" label="View profile" />
              <IconButton icon="notifications" label="Notifications" size="md" />
            </div>
          </Card>
        </Section>

        <Section id="badges" title="StatusBadge" source="DESIGN.md › Badges & Lifecycle Indicators" description="Pill rounded-full py-1 px-3 label-sm + chấm 6px. 5 variant đầu theo bảng Status & Lifecycle Palette.">
          <Card className="flex flex-col gap-space-md">
            <div className="flex flex-wrap items-center gap-space-xs">
              {styleguideBadges.map((badge) => (
                <StatusBadge key={badge.variant} variant={badge.variant} pulse={badge.pulse}>
                  {badge.label}
                </StatusBadge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-space-xs">
              <StatusBadge variant="success" size="sm">
                Active
              </StatusBadge>
              <StatusBadge variant="error" size="sm" dot={false}>
                High Priority
              </StatusBadge>
              <StatusBadge variant="primary" size="sm" dot={false} icon="shield_person">
                Super Admin
              </StatusBadge>
              <StatusBadge variant="neutral" size="sm" dot={false}>
                6 Showing
              </StatusBadge>
              <StatusBadge variant="complete" size="sm" icon="verified">
                3 of 3 Verified
              </StatusBadge>
            </div>
          </Card>
        </Section>

        <Section id="metrics" title="MetricCard" source="user_management › hàng KPI" description="label, giá trị data-metric, delta, icon, tone màu.">
          <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-4">
            {styleguideMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>
        </Section>

        <Section id="page-header" title="PageHeader" source="admin_dashboard › đầu trang" description="Breadcrumb + meta, eyebrow, h1 headline-xl, mô tả, cụm nút.">
          <div className="rounded-2xl border border-dashed border-outline-variant p-space-lg">
            <PageHeader
              breadcrumb={styleguidePageHeader.breadcrumb}
              meta={
                <>
                  <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-tertiary-container" />
                  <span>{styleguidePageHeader.metaText}</span>
                </>
              }
              eyebrow={styleguidePageHeader.eyebrow}
              title={styleguidePageHeader.title}
              description={styleguidePageHeader.description}
              actions={
                <>
                  <Button variant="tonal" iconLeft="health_and_safety">
                    Run System Health Check
                  </Button>
                  <Button variant="tonal" iconLeft="download" className="text-on-surface-variant">
                    Export Audit Logs (CSV)
                  </Button>
                  <Button iconLeft="add_circle" iconRight="expand_more">
                    Quick Create
                  </Button>
                </>
              }
            />
          </div>
        </Section>

        <Section id="filter-bar" title="FilterBar" source="user_management + my_tasks_1" description="Chip nhóm thời gian, search, select, chip lọc đang áp dụng, slot bulk action.">
          <FilterBar
            chips={
              <>
                <div className="flex flex-wrap items-center gap-space-2xs">
                  {styleguideTimeChips.map((chip) => (
                    <FilterChip
                      key={chip.key}
                      shape="pill"
                      label={chip.label}
                      count={chip.count}
                      active={timeChip === chip.key}
                      onClick={() => setTimeChip(chip.key)}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="text-label-sm text-on-surface-variant">Priority:</span>
                  <FilterChip label="All" active />
                  <FilterChip label="High (3)" active tone="error" />
                  <FilterChip label="Normal" />
                </div>
              </>
            }
            search={{
              placeholder: 'Search by full name, email, employee ID, phone...',
              value: search,
              onChange: (e) => setSearch(e.target.value),
              shortcutHint: 'Ctrl K',
            }}
            selects={[
              { key: 'role', options: styleguideRoleOptions, 'aria-label': 'Role' },
              { key: 'status', options: styleguideStatusOptions, 'aria-label': 'Status' },
              { key: 'region', options: styleguideRegionOptions, 'aria-label': 'Region' },
            ]}
            scopes={{
              label: 'Active scopes:',
              items: scopes.map((scope) => ({
                key: scope,
                label: scope,
                onRemove: () => setScopes((prev) => prev.filter((s) => s !== scope)),
              })),
              onReset: () => setScopes(defaultScopes),
            }}
            trailing={
              <>
                <span className="text-body-sm text-on-surface-variant">
                  Selected: <strong className="text-on-surface">{selected.size}</strong>
                </span>
                <Button size="sm" variant="ghost" iconLeft="block" className="text-on-surface-variant">
                  Deactivate Selected
                </Button>
              </>
            }
          />
          <Card padding="md" className="flex flex-wrap items-center gap-space-xs">
            {styleguideTypeChips.map((chip) => (
              <FilterChip
                key={chip.key}
                label={chip.label}
                icon={chip.icon}
                iconClassName={chip.iconClassName}
                active={typeChip === chip.key}
                onClick={() => setTypeChip(chip.key)}
              />
            ))}
          </Card>
        </Section>

        <Section id="data-table" title="DataTable" source="user_management › bảng user" description="Cột generic, chọn hàng, cột action, toolbar, phân trang.">
          <DataTable
            columns={userColumns}
            rows={styleguideUsers}
            rowKey={(user) => user.id}
            selectable
            selectedKeys={selected}
            onSelectionChange={setSelected}
            toolbar={
              <>
                <div className="flex items-center gap-space-xs">
                  <span className="text-headline-md text-on-surface">Platform Directory</span>
                  <StatusBadge variant="neutral" size="sm" dot={false}>
                    {styleguideUsers.length} Showing
                  </StatusBadge>
                </div>
                <div className="flex items-center gap-1">
                  <IconButton icon="file_download" label="Export CSV" />
                  <IconButton icon="view_column" label="Column layout" />
                </div>
              </>
            }
            actions={() => (
              <>
                <IconButton icon="tune" label="Edit permissions" />
                <IconButton icon="visibility" label="View profile" />
                <IconButton icon="more_vert" label="More actions" />
              </>
            )}
            pagination={{
              page,
              pageSize,
              total: 1428,
              onPageChange: setPage,
              pageSizeOptions: [10, 25, 50, 100],
              onPageSizeChange: (size) => {
                setPageSize(size)
                setPage(1)
              },
              itemLabel: 'users',
            }}
          />
        </Section>

        <Section id="task-card" title="TaskCard" source="technician_dashboard_1 › Today's Assignments" description="Vạch màu theo loại, badge loại + ưu tiên, meta, thông số 3 cột, 2 nút.">
          <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
            {styleguideTaskCards.map((task) => (
              <TaskCard key={task.title} {...task} />
            ))}
          </div>
        </Section>

        <Section id="timeline" title="Timeline / TimelineStep" source="task_detail_timeline › Lifecycle Progression" description="done / current / upcoming; dọc trên mobile, chia đều theo số bước từ md.">
          <Card>
            <div className="flex items-center justify-between pb-space-md">
              <div>
                <h3 className="text-headline-md text-on-surface">Lifecycle Progression</h3>
                <p className="text-body-sm text-on-surface-variant">
                  Deterministic status progression with end-to-end telemetry verifications
                </p>
              </div>
              <StatusBadge variant="primary" dot={false} icon="verified" className="hidden sm:inline-flex">
                4 of 5 Milestones
              </StatusBadge>
            </div>
            <Timeline steps={styleguideTimeline} />
          </Card>
        </Section>

        <Section id="checklist" title="ChecklistItem" source="installation_task_checklist" description="done (status xanh), pending (badge), active (viền, progress).">
          <Card>
            <div className="mb-space-md flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-fixed text-primary">
                  <Icon name="health_and_safety" className="text-[22px]" />
                </div>
                <div>
                  <h3 className="text-headline-md font-bold text-on-surface">Mounting & Electrical Execution</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Physical array structural fastening, electrical homerun runs, and bonding
                  </p>
                </div>
              </div>
              <StatusBadge variant="complete" dot={false} icon="verified" size="sm" className="font-bold">
                {verifiedCount} of {styleguideChecklist.length} Verified
              </StatusBadge>
            </div>
            <div className="flex flex-col gap-space-xs">
              {styleguideChecklist.map((item) => (
                <ChecklistItem
                  key={item.id}
                  id={`check-${item.id}`}
                  checked={checks[item.id] ?? false}
                  onCheckedChange={(value) => setChecks((prev) => ({ ...prev, [item.id]: value }))}
                  title={item.title}
                  description={item.description}
                  state={item.state}
                  status={item.status}
                  statusIcon={item.statusIcon}
                  progress={item.progress}
                />
              ))}
            </div>
          </Card>
        </Section>

        <Section id="photos" title="PhotoGrid / PhotoCard" source="survey_image_documentation › Section A" description="Thẻ ảnh có tag, giờ, GPS, ghi chú; ô trống để thêm ảnh bắt buộc.">
          <PhotoGrid columns={3}>
            {styleguidePhotos.map((photo, i) => (
              <PhotoCard
                key={photo.title}
                {...photo}
                note={notes[i] ?? ''}
                onNoteChange={(value) => setNotes((prev) => prev.map((n, j) => (j === i ? value : n)))}
                onZoom={() => undefined}
                onReplace={() => undefined}
              />
            ))}
            <PhotoDropzone
              title="Add Roof Photo"
              requirement="1 mandatory angle needed"
              required
              hint="West rake edge or attic truss"
            />
          </PhotoGrid>
        </Section>

        <Section id="primitives" title="Primitives" source="DESIGN.md › Form Inputs & Checkboxes" description="Checkbox 20px rounded-md tô primary khi checked; ProgressBar; Icon.">
          <Card className="flex flex-col gap-space-lg">
            <div className="flex flex-wrap items-center gap-space-lg">
              <label className="flex items-center gap-space-xs text-label-md text-on-surface">
                <Checkbox checked={demoChecked} onCheckedChange={(value) => setDemoChecked(value === true)} />
                Checked (toggle)
              </label>
              <label className="flex items-center gap-space-xs text-label-md text-on-surface">
                <Checkbox checked={false} />
                Unchecked
              </label>
              <label className="flex items-center gap-space-xs text-label-md text-on-surface-variant">
                <Checkbox checked disabled />
                Disabled
              </label>
              <label className="flex items-center gap-space-xs text-label-md text-on-surface">
                <Checkbox size="sm" checked />
                Small (bảng)
              </label>
            </div>
            <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
              <div className="flex flex-col gap-space-xs">
                <span className="text-label-sm text-on-surface-variant">Primary 65%</span>
                <ProgressBar value={65} label="Install progress" />
              </div>
              <div className="flex flex-col gap-space-xs">
                <span className="text-label-sm text-on-surface-variant">Secondary 40% (sm)</span>
                <ProgressBar value={40} tone="secondary" size="sm" label="Yield" />
              </div>
              <div className="flex flex-col gap-space-xs">
                <span className="text-label-sm text-on-surface-variant">Error 12%</span>
                <ProgressBar value={12} tone="error" label="Insulation" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-space-md text-primary">
              {['grid_view', 'solar_power', 'manage_accounts', 'square_foot', 'build_circle', 'calendar_today', 'verified', 'pin_drop'].map(
                (name) => (
                  <span key={name} className="flex flex-col items-center gap-1 text-[11px] text-on-surface-variant">
                    <Icon name={name} className="text-[24px] text-primary" />
                    {name}
                  </span>
                ),
              )}
            </div>
          </Card>
        </Section>
      </main>
    </div>
  )
}
