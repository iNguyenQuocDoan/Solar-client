import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { Field } from '@/components/ui/Field'
import { Select } from '@/components/ui/FilterBar'
import { Icon } from '@/components/ui/Icon'
import { Input } from '@/components/ui/Input'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/cn'
import { regionZones, userRoleMap, userRoleValues, userRoles, type UserRecord } from '@/lib/mock/users'

/*
 * "Governance Drawer" trong user_management chuyển thành Dialog (theo yêu cầu):
 * mode create = "+ Invite New User" (thêm ô tên/email/phòng ban), mode edit = sửa role, zone, MFA.
 * Validate bằng zod + react-hook-form.
 */
const userFormSchema = z.object({
  name: z.string().trim().min(2, 'Full name is required'),
  email: z.email('Enter a valid email address'),
  department: z.string().trim().min(2, 'Department is required'),
  role: z.enum(userRoleValues, { message: 'Select a platform role' }),
  regions: z.array(z.string()).min(1, 'Assign at least one regional zone'),
  mfaEnforced: z.boolean(),
})

export type UserFormValues = z.infer<typeof userFormSchema>

export type UserFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  /** Bắt buộc ở mode edit */
  user?: UserRecord
  onSubmit: (values: UserFormValues) => void
}

const emptyValues: UserFormValues = {
  name: '',
  email: '',
  department: '',
  role: 'field-technician',
  regions: [],
  mfaEnforced: true,
}

function valuesFromUser(user: UserRecord): UserFormValues {
  return {
    name: user.name,
    email: user.email,
    department: user.department,
    role: user.role,
    regions: user.regions,
    mfaEnforced: user.mfaEnforced,
  }
}

const roleOptions = userRoles.map((role) => ({ value: role.value, label: role.label }))

function UserForm({ mode, user, onSubmit }: Pick<UserFormDialogProps, 'mode' | 'user' | 'onSubmit'>) {
  const idPrefix = useId()
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user ? valuesFromUser(user) : emptyValues,
  })

  const role = userRoleMap[watch('role')]
  const isEdit = mode === 'edit'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-space-md" noValidate>
      <DialogHeader>
        <span className="text-label-sm font-semibold uppercase tracking-wider text-outline">
          {isEdit ? 'Governance Drawer' : 'Invite New User'}
        </span>
        <DialogTitle className="mt-0.5">{isEdit && user ? user.name : 'New platform account'}</DialogTitle>
        <DialogDescription className="font-mono text-[11px]">
          {isEdit && user ? `${user.employeeId} • ${user.department}` : 'Provision credentials, role and regional scope'}
        </DialogDescription>
      </DialogHeader>
      <div className="h-px w-full bg-surface-container-high" />

      {!isEdit && (
        <>
          <Field label="Full Name" htmlFor={`${idPrefix}-name`} error={errors.name?.message}>
            <Input id={`${idPrefix}-name`} placeholder="e.g. Jordan Ellis" invalid={!!errors.name} {...register('name')} />
          </Field>
          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
            <Field label="Work Email" htmlFor={`${idPrefix}-email`} error={errors.email?.message}>
              <Input
                id={`${idPrefix}-email`}
                type="email"
                placeholder="name@smartsolar.io"
                invalid={!!errors.email}
                {...register('email')}
              />
            </Field>
            <Field label="Department" htmlFor={`${idPrefix}-department`} error={errors.department?.message}>
              <Input
                id={`${idPrefix}-department`}
                placeholder="e.g. Field Operations"
                invalid={!!errors.department}
                {...register('department')}
              />
            </Field>
          </div>
        </>
      )}

      <Field
        label="Primary Platform Role"
        htmlFor={`${idPrefix}-role`}
        hint={`Clearance: ${role.clearance}`}
        help={role.description}
        error={errors.role?.message}
      >
        <Select id={`${idPrefix}-role`} size="md" options={roleOptions} {...register('role')} />
      </Field>

      <Controller
        control={control}
        name="regions"
        render={({ field }) => {
          const remaining = regionZones.filter((zone) => !field.value.includes(zone.value))
          return (
            <Field label="Regional Access Authority" error={errors.regions?.message}>
              <div className="flex flex-wrap gap-1.5">
                {field.value.map((zoneValue) => {
                  const zone = regionZones.find((z) => z.value === zoneValue)
                  return (
                    <span
                      key={zoneValue}
                      className="inline-flex items-center gap-1 rounded-lg bg-surface-container px-3 py-1 text-label-sm font-medium text-on-surface"
                    >
                      <span>{zone?.label ?? zoneValue}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${zone?.label ?? zoneValue}`}
                        onClick={() => field.onChange(field.value.filter((v) => v !== zoneValue))}
                        className="flex items-center hover:text-error"
                      >
                        <Icon name="close" className="text-[13px]" />
                      </button>
                    </span>
                  )
                })}
                {remaining.length > 0 && (
                  <label className="relative inline-flex items-center gap-1 rounded-lg bg-surface-container-low px-3 py-1 text-label-sm text-primary transition-colors hover:bg-surface-container">
                    <Icon name="add" className="text-[14px]" />
                    <span>Add Zone</span>
                    <select
                      aria-label="Add regional zone"
                      value=""
                      onChange={(e) => e.target.value && field.onChange([...field.value, e.target.value])}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    >
                      <option value="">Add Zone</option>
                      {remaining.map((zone) => (
                        <option key={zone.value} value={zone.value}>
                          {zone.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </Field>
          )
        }}
      />

      <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-sm">
        <Controller
          control={control}
          name="mfaEnforced"
          render={({ field }) => (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  name="verified_user"
                  className={cn('text-[20px]', field.value ? 'text-tertiary-container' : 'text-outline')}
                />
                <div className="flex flex-col">
                  <span className="text-label-md font-semibold text-on-surface">Hardware FIDO2 / MFA</span>
                  <span
                    className={cn(
                      'text-[11px] font-medium',
                      field.value ? 'text-tertiary-container' : 'text-outline',
                    )}
                  >
                    {field.value ? 'Enforced via YubiKey' : 'Not enforced'}
                  </span>
                </div>
              </div>
              <Switch
                aria-label="Enforce hardware MFA"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            </div>
          )}
        />
        {isEdit && user && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <Icon name="key" className="text-[20px] text-outline" />
              <div className="flex flex-col">
                <span className="text-label-md font-semibold text-on-surface">API Secret Tokens</span>
                <span className="text-[11px] text-outline">{user.apiTokens} active personal keys</span>
              </div>
            </div>
            <button type="button" className="text-label-sm text-error hover:underline">
              Revoke All
            </button>
          </div>
        )}
      </div>

      {isEdit && user && user.identityLog.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-label-sm font-semibold uppercase tracking-wider text-outline">Recent Identity Log</span>
          <ul className="flex flex-col gap-1.5 rounded-xl bg-surface-container-low/50 p-2.5 text-[11px] text-outline">
            {user.identityLog.map((entry) => (
              <li key={entry.event} className="flex items-center justify-between">
                <span>{entry.event}</span>
                <span>{entry.when}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="ghost" size="md" className="h-11 flex-1 font-semibold text-on-surface">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" size="md" iconLeft={isEdit ? 'save' : 'send'} disabled={isSubmitting} className="h-11 flex-1">
          {isEdit ? 'Save Changes' : 'Send Invite'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function UserFormDialog({ open, onOpenChange, mode, user, onSubmit }: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        {/* key để form khởi tạo lại defaultValues khi đổi user */}
        <UserForm key={user?.id ?? 'new'} mode={mode} user={user} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
