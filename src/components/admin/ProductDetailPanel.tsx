import { useId, useState } from 'react'
import { Button } from '@/components/stitch-ui/Button'
import { Card } from '@/components/stitch-ui/Card'
import { Checkbox } from '@/components/stitch-ui/Checkbox'
import { Field } from '@/components/stitch-ui/Field'
import { Select, type SelectOption } from '@/components/stitch-ui/FilterBar'
import { Icon } from '@/components/stitch-ui/Icon'
import { Input } from '@/components/stitch-ui/Input'
import { StatusBadge } from '@/components/stitch-ui/StatusBadge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/stitch-ui/Tabs'
import { cn } from '@/lib/cn'
import { formatUsd } from '@/lib/format'
import { productDetailLabels as labels, productDetailTabs, type ProductRecord } from '@/lib/mock/products'

/* Panel chi tiết bên phải trong product_catalogue: tab + form General Info, footer Archive/Cancel/Save. */

type Draft = {
  commercialTitle: string
  manufacturer: string
  category: string
  ratedOutput: string
  efficiency: string
  tempCoefficient: string
  dimensions: string
  baseCost: string
  salesPrice: string
  warranty: string
  includeInAi: boolean
}

function draftFromProduct(product: ProductRecord): Draft {
  return {
    commercialTitle: product.detail.commercialTitle,
    manufacturer: product.detail.manufacturer,
    category: product.category,
    ratedOutput: product.detail.ratedOutput,
    efficiency: product.detail.efficiency,
    tempCoefficient: product.detail.tempCoefficient,
    dimensions: product.detail.dimensions,
    baseCost: formatUsd(product.baseCost),
    salesPrice: formatUsd(product.salesPrice),
    warranty: product.detail.warranty,
    includeInAi: product.detail.includeInAi,
  }
}

function parseUsd(value: string, fallback: number) {
  const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ''))
  return Number.isFinite(parsed) ? parsed : fallback
}

const statusLabels = { active: 'Active', draft: 'Draft', discontinued: 'Discontinued' } as const
const statusVariants = { active: 'positive', draft: 'neutral', discontinued: 'error' } as const

export type ProductDetailPanelProps = {
  product: ProductRecord
  categories: SelectOption[]
  onSave: (product: ProductRecord) => void
  onDuplicate?: (product: ProductRecord) => void
  onArchive?: (product: ProductRecord) => void
  className?: string
}

export function ProductDetailPanel({ product, categories, onSave, onDuplicate, onArchive, className }: ProductDetailPanelProps) {
  const idPrefix = useId()
  const [draft, setDraft] = useState<Draft>(() => draftFromProduct(product))
  const update = (patch: Partial<Draft>) => setDraft((prev) => ({ ...prev, ...patch }))

  const handleSave = () => {
    const categoryLabel = categories.find((c) => c.value === draft.category)?.label ?? product.categoryLabel
    onSave({
      ...product,
      category: draft.category as ProductRecord['category'],
      categoryLabel: categoryLabel.replace(/ \(.*\)$/, ''),
      baseCost: parseUsd(draft.baseCost, product.baseCost),
      salesPrice: parseUsd(draft.salesPrice, product.salesPrice),
      detail: {
        ...product.detail,
        commercialTitle: draft.commercialTitle,
        manufacturer: draft.manufacturer,
        ratedOutput: draft.ratedOutput,
        efficiency: draft.efficiency,
        tempCoefficient: draft.tempCoefficient,
        dimensions: draft.dimensions,
        warranty: draft.warranty,
        includeInAi: draft.includeInAi,
      },
    })
  }

  const fieldId = (name: string) => `${idPrefix}-${name}`
  const categoryOptions = categories.filter((c) => c.value !== 'all')

  return (
    <Card padding="none" className={cn('flex flex-col overflow-hidden', className)}>
      <Tabs defaultValue="general" className="flex flex-1 flex-col">
        <div className="flex flex-col gap-space-xs bg-surface-container-low/30 p-space-lg">
          <div className="flex items-start justify-between gap-space-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <StatusBadge variant={statusVariants[product.status]} size="sm" className="px-2 font-semibold">
                  {statusLabels[product.status]}
                </StatusBadge>
                <span className="text-label-sm text-outline">{product.sku}</span>
              </div>
              <h2 className="mt-1 text-headline-md text-on-surface">{product.name}</h2>
            </div>
            <button
              type="button"
              title="Clone product parameters into new SKU"
              onClick={() => onDuplicate?.(product)}
              className="flex h-8 shrink-0 items-center gap-1 rounded-lg bg-surface-container-low px-3 text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              <Icon name="content_copy" className="text-[16px]" />
              <span>{labels.duplicate}</span>
            </button>
          </div>
          <TabsList className="mt-space-xs">
            {productDetailTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="general" className="flex flex-col gap-space-md p-space-lg">
          <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl bg-surface-container">
            <img src={product.detail.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end bg-linear-to-t from-inverse-surface/80 via-transparent to-transparent p-3">
              <div className="flex w-full items-center justify-between text-body-sm text-inverse-on-surface">
                <span className="text-label-sm">{product.detail.imageCaption}</span>
                <button type="button" className="flex items-center gap-1 text-xs underline hover:text-surface-bright">
                  <Icon name="upload" className="text-[14px]" /> {labels.replaceImage}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
            <Field variant="caps" label={labels.commercialTitle} htmlFor={fieldId('title')} help={labels.commercialTitleHelp} className="sm:col-span-2">
              <Input id={fieldId('title')} size="sm" value={draft.commercialTitle} onChange={(e) => update({ commercialTitle: e.target.value })} />
            </Field>
            <Field variant="caps" label={labels.manufacturer} htmlFor={fieldId('oem')}>
              <Input id={fieldId('oem')} size="sm" value={draft.manufacturer} onChange={(e) => update({ manufacturer: e.target.value })} />
            </Field>
            <Field variant="caps" label={labels.category} htmlFor={fieldId('category')}>
              <Select id={fieldId('category')} size="compact" options={categoryOptions} value={draft.category} onChange={(e) => update({ category: e.target.value })} />
            </Field>
            <Field variant="caps" label={labels.ratedOutput} htmlFor={fieldId('output')}>
              <Input
                id={fieldId('output')}
                size="sm"
                className="font-semibold"
                value={draft.ratedOutput}
                onChange={(e) => update({ ratedOutput: e.target.value })}
                trailing={<Icon name="bolt" className="text-[18px] text-tertiary-container" />}
              />
            </Field>
            <Field variant="caps" label={labels.efficiency} htmlFor={fieldId('efficiency')}>
              <Input id={fieldId('efficiency')} size="sm" className="font-semibold" value={draft.efficiency} onChange={(e) => update({ efficiency: e.target.value })} />
            </Field>
            <Field variant="caps" label={labels.tempCoefficient} htmlFor={fieldId('temp')}>
              <Input id={fieldId('temp')} size="sm" value={draft.tempCoefficient} onChange={(e) => update({ tempCoefficient: e.target.value })} />
            </Field>
            <Field variant="caps" label={labels.dimensions} htmlFor={fieldId('dimensions')}>
              <Input id={fieldId('dimensions')} size="sm" value={draft.dimensions} onChange={(e) => update({ dimensions: e.target.value })} />
            </Field>
            <Field variant="caps" label={labels.baseCost} htmlFor={fieldId('cost')}>
              <Input
                id={fieldId('cost')}
                size="sm"
                className="font-semibold"
                value={draft.baseCost}
                onChange={(e) => update({ baseCost: e.target.value })}
                trailing={<span className="text-xs font-semibold text-outline">USD</span>}
              />
            </Field>
            <Field variant="caps" label={labels.salesPrice} htmlFor={fieldId('price')} labelClassName="font-bold text-tertiary-container">
              <Input
                id={fieldId('price')}
                size="sm"
                className="font-bold text-primary"
                value={draft.salesPrice}
                onChange={(e) => update({ salesPrice: e.target.value })}
                trailing={<span className="text-xs font-semibold text-tertiary-container">USD</span>}
              />
            </Field>
            <Field variant="caps" label={labels.warranty} htmlFor={fieldId('warranty')} className="sm:col-span-2">
              <Input id={fieldId('warranty')} size="sm" value={draft.warranty} onChange={(e) => update({ warranty: e.target.value })} />
            </Field>
          </div>

          <div className="flex items-start gap-space-sm rounded-xl bg-surface-container-low/60 p-space-md">
            <Checkbox
              id={fieldId('ai')}
              checked={draft.includeInAi}
              onCheckedChange={(value) => update({ includeInAi: value === true })}
              className="mt-0.5"
            />
            <div className="flex flex-col">
              <label htmlFor={fieldId('ai')} className="cursor-pointer text-label-md font-semibold text-on-surface">
                {labels.aiTitle}
              </label>
              <p className="mt-0.5 text-body-sm text-on-surface-variant">{labels.aiHelp}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="electrical" className="p-space-lg">
          <SpecList items={product.detail.electrical} />
        </TabsContent>
        <TabsContent value="warranty" className="p-space-lg">
          <SpecList items={product.detail.warrantyPricing} />
        </TabsContent>
        <TabsContent value="compatibility" className="p-space-lg">
          <div className="flex flex-wrap gap-space-xs">
            {product.detail.compatibility.map((item) => (
              <span key={item} className="rounded-lg bg-surface-container px-3 py-1 text-label-sm font-medium text-on-surface">
                {item}
              </span>
            ))}
          </div>
        </TabsContent>

        <div className="mt-auto flex flex-col items-center justify-between gap-space-sm bg-surface-container-low/50 px-space-lg py-space-md sm:flex-row">
          <button
            type="button"
            onClick={() => onArchive?.(product)}
            className="order-2 flex items-center gap-1 text-label-md text-error transition-all hover:underline sm:order-1"
          >
            <Icon name="delete" className="text-[16px]" />
            <span>{labels.archive}</span>
          </button>
          <div className="order-1 flex w-full items-center justify-end gap-space-xs sm:order-2 sm:w-auto">
            <Button
              variant="ghost"
              size="md"
              className="bg-surface-container font-medium text-on-surface-variant hover:bg-surface-container-high"
              onClick={() => setDraft(draftFromProduct(product))}
            >
              {labels.cancel}
            </Button>
            <Button size="md" iconLeft="save" className="px-5" onClick={handleSave}>
              {labels.save}
            </Button>
          </div>
        </div>
      </Tabs>
    </Card>
  )
}

function SpecList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="flex flex-col gap-space-xs">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between rounded-xl bg-surface-container-low p-space-sm">
          <dt className="text-label-md text-on-surface-variant">{item.label}</dt>
          <dd className="text-label-md font-semibold text-on-surface">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
