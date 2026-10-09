import { useState, type ReactNode } from 'react'
import { Icon } from '@/components/common/stitch-ui/Icon'
import { Field, Input, Radio, Textarea } from '@/components/common/ui/field'
import { COMPASS_GRID, CUSTOMER_TYPES, SURFACE_TYPES } from '@/features/pre-surveys/components/preSurveyDisplay'
import type { FormErrors, ProfileForm, SiteForm } from '@/features/pre-surveys/components/assessmentForm'

/* Ô nhập của hai bước đầu màn đánh giá sơ bộ (hồ sơ, địa điểm) + la bàn và ô có đơn vị dùng ở bước mặt lắp, mô phỏng.
   Trang giữ state; component chỉ vẽ và báo thay đổi. */

type FieldsProps<F> = {
  value: F
  errors: FormErrors<F>
  onChange: (patch: Partial<F>) => void
}

/*
  Toạ độ không bắt buộc và ít khách biết: gập lại, chỉ mở sẵn khi đã có giá trị hoặc đang báo lỗi. Thiếu toạ độ thì
  backend vẫn xếp tấm được nhưng không ước tính sản lượng (PVGIS) và khí hậu (NASA POWER), nên chữ mở nói rõ điều đó.
*/
function CoordinateFields({ value, errors, onChange }: FieldsProps<SiteForm>) {
  const [open, setOpen] = useState(() => Boolean(value.latitude || value.longitude))
  const hasError = Boolean(errors.latitude || errors.longitude)
  const shown = open || hasError
  return (
    <details className="sm:col-span-2" open={shown} onToggle={(e) => setOpen(e.currentTarget.open)}>
      {/* `tap` là inline-flex nên mất mũi tên mặc định của summary: icon mở / thu cùng chữ đổi theo trạng thái thay cho mũi tên. */}
      <summary className="tap w-fit cursor-pointer gap-1 text-body font-medium text-accent-fg underline-offset-4 hover:underline">
        <Icon name={shown ? 'expand_less' : 'add_location_alt'} className="text-[20px]" />
        {shown ? 'Ẩn toạ độ' : 'Thêm toạ độ (cần để ước tính sản lượng điện)'}
      </summary>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Vĩ độ" htmlFor="latitude" hint="Trên Google Maps, nhấn giữ vào công trình để thấy toạ độ, ví dụ 10.9036." error={errors.latitude}>
          <Input
            id="latitude"
            inputMode="decimal"
            value={value.latitude}
            onChange={(e) => onChange({ latitude: e.target.value })}
            aria-invalid={Boolean(errors.latitude)}
          />
        </Field>
        <Field label="Kinh độ" htmlFor="longitude" hint="Số thứ hai trong cặp toạ độ, ví dụ 106.7686." error={errors.longitude}>
          <Input
            id="longitude"
            inputMode="decimal"
            value={value.longitude}
            onChange={(e) => onChange({ longitude: e.target.value })}
            aria-invalid={Boolean(errors.longitude)}
          />
        </Field>
      </div>
    </details>
  )
}

/*
  Hướng chọn trên la bàn 3×3 thay vì gõ góc phương vị: khách hiểu "mái quay về hướng Nam"
  chứ không hiểu "180°". Radio thật (ẩn) giữ đúng hành vi bàn phím: Tab vào nhóm, mũi tên đổi hướng.
  Dùng cho hướng mặt mái (bước mặt lắp) và hướng tấm pin của khung nghiêng (bước mô phỏng): `name` phải khác nhau.
*/
export function CompassPicker({
  value,
  error,
  onChange,
  name = 'azimuth',
  legend = 'Mặt mái quay về hướng nào?',
  hint = 'Hướng mặt mái nhìn ra (phía mép thấp). Mái bằng thì chọn Nam.',
  className = 'sm:col-span-2',
}: {
  value: string
  error?: string
  onChange: (degree: string) => void
  name?: string
  legend?: string
  hint?: string
  className?: string
}) {
  return (
    <fieldset className={className}>
      <legend className="text-body font-medium text-fg">{legend}</legend>
      <p className="mt-1 mb-3 text-meta text-fg-3">{hint}</p>
      <div className="grid max-w-sm grid-cols-3 gap-2">
        {COMPASS_GRID.map((cell, i) =>
          cell === null ? (
            <div
              key="roof"
              aria-hidden
              className="flex h-11 items-center justify-center rounded-control border border-dashed border-line-2 text-meta text-fg-3"
            >
              Mái
            </div>
          ) : (
            <label
              key={i}
              className="press flex h-11 cursor-pointer items-center justify-center rounded-control border border-line-2 px-2 text-center text-body text-fg-2 hover:border-fg hover:text-fg has-checked:border-accent has-checked:bg-accent-soft has-checked:font-semibold has-checked:text-fg has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
            >
              <input
                type="radio"
                name={name}
                className="sr-only"
                value={String(cell.degree)}
                checked={value !== '' && Number(value) === cell.degree}
                onChange={() => onChange(String(cell.degree))}
                aria-invalid={Boolean(error)}
              />
              {cell.label}
            </label>
          ),
        )}
      </div>
      {error && (
        <p className="mt-2 text-meta text-danger" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export function WithUnit({ unit, children }: { unit: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {children}
      <span className="text-body text-fg-2">{unit}</span>
    </div>
  )
}

export function ProfileFields({ value, errors, onChange }: FieldsProps<ProfileForm>) {
  const business = value.customerType === '2'
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <fieldset className="sm:col-span-2">
        <legend className="mb-2 text-body font-medium text-fg">Bạn lắp đặt cho</legend>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {CUSTOMER_TYPES.map((t) => (
            <Radio
              key={t.value}
              name="customerType"
              value={String(t.value)}
              checked={value.customerType === String(t.value)}
              onChange={() => onChange({ customerType: String(t.value) as ProfileForm['customerType'] })}
              label={t.label}
            />
          ))}
        </div>
      </fieldset>
      {business && (
        <>
          <Field label="Tên doanh nghiệp" htmlFor="companyName" hint="Không bắt buộc." error={errors.companyName}>
            <Input
              id="companyName"
              autoComplete="organization"
              value={value.companyName}
              onChange={(e) => onChange({ companyName: e.target.value })}
              aria-invalid={Boolean(errors.companyName)}
            />
          </Field>
          <Field label="Mã số thuế" htmlFor="taxCode" hint="Không bắt buộc." error={errors.taxCode}>
            <Input
              id="taxCode"
              inputMode="numeric"
              value={value.taxCode}
              onChange={(e) => onChange({ taxCode: e.target.value })}
              aria-invalid={Boolean(errors.taxCode)}
            />
          </Field>
        </>
      )}
      <Field label="Ghi chú" htmlFor="profileNote" hint="Không bắt buộc." className="sm:col-span-2" error={errors.note}>
        <Textarea id="profileNote" rows={3} value={value.note} onChange={(e) => onChange({ note: e.target.value })} />
      </Field>
    </div>
  )
}

export function SiteFields({ value, errors, onChange }: FieldsProps<SiteForm>) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Tên địa điểm" htmlFor="siteName" hint="Để phân biệt khi bạn có nhiều công trình." className="sm:col-span-2" error={errors.name}>
        <Input id="siteName" value={value.name} onChange={(e) => onChange({ name: e.target.value })} aria-invalid={Boolean(errors.name)} />
      </Field>
      <Field label="Số nhà, tên đường" htmlFor="streetLine" hint="Không bắt buộc." className="sm:col-span-2" error={errors.streetLine}>
        <Input
          id="streetLine"
          autoComplete="address-line1"
          value={value.streetLine}
          onChange={(e) => onChange({ streetLine: e.target.value })}
          aria-invalid={Boolean(errors.streetLine)}
        />
      </Field>
      <Field label="Phường, xã" htmlFor="ward" hint="Không bắt buộc." error={errors.ward}>
        <Input id="ward" value={value.ward} onChange={(e) => onChange({ ward: e.target.value })} aria-invalid={Boolean(errors.ward)} />
      </Field>
      <Field label="Quận, huyện" htmlFor="district" hint="Không bắt buộc." error={errors.district}>
        <Input id="district" value={value.district} onChange={(e) => onChange({ district: e.target.value })} aria-invalid={Boolean(errors.district)} />
      </Field>
      <Field label="Tỉnh, thành phố" htmlFor="province" error={errors.province}>
        <Input
          id="province"
          autoComplete="address-level1"
          value={value.province}
          onChange={(e) => onChange({ province: e.target.value })}
          aria-invalid={Boolean(errors.province)}
        />
      </Field>
      <CoordinateFields value={value} errors={errors} onChange={onChange} />
      <fieldset className="sm:col-span-2">
        <legend className="mb-3 text-body font-medium text-fg">Lắp trên bề mặt nào?</legend>
        <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {SURFACE_TYPES.map((t) => (
            <Radio
              key={t.value}
              name="installationSurfaceType"
              value={String(t.value)}
              checked={value.installationSurfaceType === String(t.value)}
              onChange={() => onChange({ installationSurfaceType: String(t.value) })}
              label={t.label}
              description={t.hint}
            />
          ))}
        </div>
        {errors.installationSurfaceType && (
          <p className="mt-2 text-meta text-danger" role="alert">
            {errors.installationSurfaceType}
          </p>
        )}
      </fieldset>
      <Field label="Vật liệu bề mặt" htmlFor="surfaceMaterial" hint="Không bắt buộc. Ví dụ: mái tôn, bê tông." error={errors.surfaceMaterial}>
        <Input id="surfaceMaterial" value={value.surfaceMaterial} onChange={(e) => onChange({ surfaceMaterial: e.target.value })} />
      </Field>
      <Field label="Ghi chú" htmlFor="siteNote" hint="Không bắt buộc. Ví dụ: giờ vào được công trình." className="sm:col-span-2" error={errors.note}>
        <Textarea id="siteNote" rows={3} value={value.note} onChange={(e) => onChange({ note: e.target.value })} />
      </Field>
    </div>
  )
}
