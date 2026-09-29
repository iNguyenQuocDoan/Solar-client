import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useFieldArray, useForm, type Path } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, IconButton } from '@/components/common/stitch-ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/common/stitch-ui/Dialog'
import { Field } from '@/components/common/stitch-ui/Field'
import { Select } from '@/components/common/stitch-ui/FilterBar'
import { Input } from '@/components/common/stitch-ui/Input'
import { useCreateProductMutation, useUpdateProductMutation } from '@/features/products/hooks/useProducts'
import { PRODUCT_STATUSES, specEntries } from '@/features/products/components/productDisplay'
import { errorMessage, isApiError } from '@/services/api/errors'
import type { UpdateProductRequest } from '@/types/req/adminProductsReq'
import type { ProductResponse } from '@/types/res/adminProductsRes'

/*
 * Form thêm / sửa sản phẩm (POST và PUT /api/admin/products).
 * Ràng buộc lấy từ lỗi validate thật của backend (29/09/2026):
 *   bắt buộc sku, productType, name, brand, unit, unitPrice, currency (đúng 3 ký tự);
 *   unitPrice, warrantyMonth ≥ 0; ratedPowerW, widthMm, heightMm > 0 khi có nhập;
 *   spec phải là JSON object; status chỉ ACTIVE | INACTIVE.
 * PUT không nhận status nên ô trạng thái chỉ hiện khi thêm mới.
 */

const required = (label: string) => z.string().trim().min(1, `Vui lòng nhập ${label}`)

/** Ô số để trống được; có nhập thì phải là số thoả điều kiện. */
const optionalNumber = (label: string, { allowZero }: { allowZero: boolean }) =>
  z
    .string()
    .trim()
    .refine((v) => v === '' || Number.isFinite(Number(v)), `${label} phải là số`)
    .refine((v) => v === '' || (allowZero ? Number(v) >= 0 : Number(v) > 0), `${label} phải ${allowZero ? 'từ 0 trở lên' : 'lớn hơn 0'}`)

const productFormSchema = z
  .object({
    sku: required('SKU'),
    name: required('tên sản phẩm'),
    productType: required('loại sản phẩm'),
    category: z.string().trim(),
    brand: required('hãng'),
    model: z.string().trim(),
    unit: required('đơn vị tính'),
    unitPrice: required('đơn giá').refine((v) => Number.isFinite(Number(v)) && Number(v) >= 0, 'Đơn giá phải là số từ 0 trở lên'),
    currency: z
      .string()
      .trim()
      .regex(/^[A-Za-z]{3}$/, 'Mã tiền tệ gồm đúng 3 chữ cái, ví dụ VND'),
    ratedPowerW: optionalNumber('Công suất', { allowZero: false }),
    widthMm: optionalNumber('Chiều rộng', { allowZero: false }),
    heightMm: optionalNumber('Chiều cao', { allowZero: false }),
    warrantyMonth: optionalNumber('Số tháng bảo hành', { allowZero: true }).refine(
      (v) => v === '' || Number.isInteger(Number(v)),
      'Số tháng bảo hành phải là số nguyên',
    ),
    imageUrl: z.string().trim(),
    status: z.enum(['ACTIVE', 'INACTIVE']),
    spec: z.array(z.object({ key: z.string().trim(), value: z.string().trim() })),
  })
  .superRefine((values, ctx) => {
    const seen = new Set<string>()
    values.spec.forEach((row, i) => {
      if (!row.key && row.value) ctx.addIssue({ code: 'custom', path: ['spec', i, 'key'], message: 'Nhập tên thông số' })
      if (row.key && seen.has(row.key)) ctx.addIssue({ code: 'custom', path: ['spec', i, 'key'], message: 'Thông số bị trùng' })
      seen.add(row.key)
    })
  })

type ProductFormValues = z.infer<typeof productFormSchema>

const emptyValues: ProductFormValues = {
  sku: '',
  name: '',
  productType: '',
  category: '',
  brand: '',
  model: '',
  unit: '',
  unitPrice: '',
  currency: 'VND',
  ratedPowerW: '',
  widthMm: '',
  heightMm: '',
  warrantyMonth: '',
  imageUrl: '',
  status: 'ACTIVE',
  spec: [],
}

const text = (value: number | string | null | undefined) => (value == null ? '' : String(value))

function valuesFromProduct(product: ProductResponse): ProductFormValues {
  return {
    sku: text(product.sku),
    name: text(product.name),
    productType: text(product.productType),
    category: text(product.category),
    brand: text(product.brand),
    model: text(product.model),
    unit: text(product.unit),
    unitPrice: text(product.unitPrice),
    currency: text(product.currency) || 'VND',
    ratedPowerW: text(product.ratedPowerW),
    widthMm: text(product.widthMm),
    heightMm: text(product.heightMm),
    warrantyMonth: text(product.warrantyMonth),
    imageUrl: text(product.imageUrl),
    status: product.status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    spec: specEntries(product.spec).map(({ key, value }) => ({ key, value })),
  }
}

const orNull = (value: string) => (value === '' ? null : value)
const numberOrNull = (value: string) => (value === '' ? null : Number(value))

/** Body chung của POST và PUT; status chỉ POST nhận nên thêm riêng ở chỗ tạo mới. */
function toRequest(values: ProductFormValues): UpdateProductRequest {
  const specRows = values.spec.filter((row) => row.key)
  return {
    sku: values.sku,
    name: values.name,
    productType: values.productType,
    category: orNull(values.category),
    brand: values.brand,
    model: orNull(values.model),
    unit: values.unit,
    unitPrice: Number(values.unitPrice),
    currency: values.currency.toUpperCase(),
    ratedPowerW: numberOrNull(values.ratedPowerW),
    widthMm: numberOrNull(values.widthMm),
    heightMm: numberOrNull(values.heightMm),
    warrantyMonth: numberOrNull(values.warrantyMonth),
    imageUrl: orNull(values.imageUrl),
    spec: specRows.length ? Object.fromEntries(specRows.map((row) => [row.key, row.value])) : null,
  }
}

/** Backend trả lỗi theo tên PascalCase ("UnitPrice"); form dùng camelCase. */
const FORM_FIELDS = new Set(Object.keys(emptyValues))
function toFormField(serverField: string): Path<ProductFormValues> | null {
  const name = serverField.charAt(0).toLowerCase() + serverField.slice(1)
  return FORM_FIELDS.has(name) && name !== 'spec' ? (name as Path<ProductFormValues>) : null
}

export type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Có thì là sửa, không có là thêm mới */
  product?: ProductResponse | null
  /** Gợi ý cho ô loại / nhóm, lấy từ các sản phẩm đã có */
  suggestions?: { productTypes: string[]; categories: string[] }
}

function ProductForm({ product, suggestions, onDone }: Pick<ProductFormDialogProps, 'product' | 'suggestions'> & { onDone: () => void }) {
  const id = useId()
  const isEdit = Boolean(product?.id)
  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? valuesFromProduct(product) : emptyValues,
  })
  const spec = useFieldArray({ control, name: 'spec' })

  const onSubmit = async (values: ProductFormValues) => {
    const body = toRequest(values)
    try {
      if (isEdit && product?.id) {
        await updateMutation.mutateAsync({ id: product.id, body })
        toast.success(`Đã lưu ${values.name}`)
      } else {
        await createMutation.mutateAsync({ ...body, status: values.status })
        toast.success(`Đã thêm ${values.name}`)
      }
      onDone()
    } catch (error) {
      let mapped = false
      if (isApiError(error)) {
        for (const [serverField, message] of Object.entries(error.fieldErrors)) {
          const field = toFormField(serverField)
          if (field) {
            setError(field, { type: 'server', message })
            mapped = true
          }
        }
      }
      setError('root', { type: 'server', message: mapped ? 'Một số ô chưa hợp lệ, xem thông báo ở từng ô.' : errorMessage(error) })
    }
  }

  const f = (name: string) => `${id}-${name}`

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-space-md" noValidate>
      <DialogHeader>
        <DialogTitle>{isEdit ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogDescription>{isEdit ? product?.sku : 'Ô có dấu * là bắt buộc.'}</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <Field label="Tên sản phẩm *" htmlFor={f('name')} error={errors.name?.message} className="sm:col-span-2">
          <Input id={f('name')} invalid={!!errors.name} {...register('name')} />
        </Field>
        <Field label="SKU *" htmlFor={f('sku')} error={errors.sku?.message}>
          <Input id={f('sku')} invalid={!!errors.sku} {...register('sku')} />
        </Field>
        <Field label="Hãng *" htmlFor={f('brand')} error={errors.brand?.message}>
          <Input id={f('brand')} invalid={!!errors.brand} {...register('brand')} />
        </Field>
        <Field label="Loại sản phẩm *" htmlFor={f('productType')} error={errors.productType?.message}>
          <Input id={f('productType')} list={f('types')} invalid={!!errors.productType} {...register('productType')} />
        </Field>
        <Field label="Nhóm hàng" htmlFor={f('category')} error={errors.category?.message}>
          <Input id={f('category')} list={f('categories')} invalid={!!errors.category} {...register('category')} />
        </Field>
        <Field label="Model" htmlFor={f('model')} error={errors.model?.message}>
          <Input id={f('model')} invalid={!!errors.model} {...register('model')} />
        </Field>
        <Field label="Đơn vị tính *" htmlFor={f('unit')} error={errors.unit?.message} help="Ví dụ: tấm, bộ, cái">
          <Input id={f('unit')} invalid={!!errors.unit} {...register('unit')} />
        </Field>
        <Field label="Đơn giá *" htmlFor={f('unitPrice')} error={errors.unitPrice?.message}>
          <Input id={f('unitPrice')} inputMode="decimal" invalid={!!errors.unitPrice} {...register('unitPrice')} />
        </Field>
        <Field label="Tiền tệ *" htmlFor={f('currency')} error={errors.currency?.message}>
          <Input id={f('currency')} maxLength={3} className="uppercase" invalid={!!errors.currency} {...register('currency')} />
        </Field>
        <Field label="Công suất định mức" htmlFor={f('ratedPowerW')} error={errors.ratedPowerW?.message}>
          <Input
            id={f('ratedPowerW')}
            inputMode="decimal"
            invalid={!!errors.ratedPowerW}
            trailing={<span className="text-label-sm text-outline">W</span>}
            {...register('ratedPowerW')}
          />
        </Field>
        <Field label="Bảo hành" htmlFor={f('warrantyMonth')} error={errors.warrantyMonth?.message}>
          <Input
            id={f('warrantyMonth')}
            inputMode="numeric"
            invalid={!!errors.warrantyMonth}
            trailing={<span className="text-label-sm text-outline">tháng</span>}
            {...register('warrantyMonth')}
          />
        </Field>
        <Field label="Chiều rộng" htmlFor={f('widthMm')} error={errors.widthMm?.message}>
          <Input
            id={f('widthMm')}
            inputMode="decimal"
            invalid={!!errors.widthMm}
            trailing={<span className="text-label-sm text-outline">mm</span>}
            {...register('widthMm')}
          />
        </Field>
        <Field label="Chiều cao" htmlFor={f('heightMm')} error={errors.heightMm?.message}>
          <Input
            id={f('heightMm')}
            inputMode="decimal"
            invalid={!!errors.heightMm}
            trailing={<span className="text-label-sm text-outline">mm</span>}
            {...register('heightMm')}
          />
        </Field>
        <Field label="Link ảnh" htmlFor={f('imageUrl')} error={errors.imageUrl?.message} className="sm:col-span-2">
          <Input id={f('imageUrl')} type="url" placeholder="https://" invalid={!!errors.imageUrl} {...register('imageUrl')} />
        </Field>
        {!isEdit && (
          <Field label="Trạng thái" htmlFor={f('status')} error={errors.status?.message}>
            <Select
              id={f('status')}
              size="md"
              options={PRODUCT_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
              {...register('status')}
            />
          </Field>
        )}
      </div>

      <fieldset className="flex flex-col gap-space-xs">
        <legend className="mb-space-xs text-label-md font-semibold text-on-surface">Thông số kỹ thuật</legend>
        {spec.fields.length === 0 && <p className="text-label-sm text-outline">Chưa có thông số nào.</p>}
        {spec.fields.map((row, i) => (
          <div key={row.id} className="grid grid-cols-[1fr_1fr_auto] items-start gap-space-xs">
            <Field label={<span className="sr-only">Tên thông số {i + 1}</span>} htmlFor={f(`spec-${i}-key`)} error={errors.spec?.[i]?.key?.message}>
              <Input id={f(`spec-${i}-key`)} size="sm" placeholder="Ví dụ: Hiệu suất" invalid={!!errors.spec?.[i]?.key} {...register(`spec.${i}.key`)} />
            </Field>
            <Field label={<span className="sr-only">Giá trị thông số {i + 1}</span>} htmlFor={f(`spec-${i}-value`)}>
              <Input id={f(`spec-${i}-value`)} size="sm" placeholder="Ví dụ: 21,8%" {...register(`spec.${i}.value`)} />
            </Field>
            <IconButton icon="close" label={`Bỏ thông số ${i + 1}`} size="md" className="mt-0.5" onClick={() => spec.remove(i)} />
          </div>
        ))}
        <div>
          <Button variant="ghost" size="sm" iconLeft="add" onClick={() => spec.append({ key: '', value: '' })}>
            Thêm thông số
          </Button>
        </div>
      </fieldset>

      <datalist id={f('types')}>
        {suggestions?.productTypes.map((value) => <option key={value} value={value} />)}
      </datalist>
      <datalist id={f('categories')}>
        {suggestions?.categories.map((value) => <option key={value} value={value} />)}
      </datalist>

      {errors.root?.message && (
        <p role="alert" className="rounded-xl bg-error-container px-space-sm py-space-xs text-label-md text-on-error-container">
          {errors.root.message}
        </p>
      )}

      <DialogFooter className="justify-end">
        <DialogClose asChild>
          <Button variant="ghost" size="md">
            Hủy
          </Button>
        </DialogClose>
        <Button type="submit" size="md" iconLeft="save" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu…' : isEdit ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function ProductFormDialog({ open, onOpenChange, product, suggestions }: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        {/* key: mở lại dialog cho sản phẩm khác thì form khởi tạo lại từ đầu */}
        {open && <ProductForm key={product?.id ?? 'new'} product={product} suggestions={suggestions} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}
