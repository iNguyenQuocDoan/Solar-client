import { lazy, Suspense, useMemo, useState } from 'react'
import { Button } from '@/components/common/ui/button'
import { Field, Select } from '@/components/common/ui/field'
import { Notice } from '@/components/common/ui/lists'
import { EmptyState, Skeleton } from '@/components/common/ui/states'
import { Facts } from '@/features/pre-surveys/components/Facts'
import { directionLabel } from '@/features/pre-surveys/components/preSurveyDisplay'
import { ROOF_ASPECT, computeRoofLayout } from '@/features/pre-surveys/components/roofLayout'
import type { RoofView } from '@/features/pre-surveys/components/RoofScene'
import { SOLAR_PANEL_TYPE, formatPower, isProductActive } from '@/features/products/components/productDisplay'
import { useProductsQuery } from '@/features/products/hooks/useProducts'
import type { ProductResponse } from '@/types/res/adminProductsRes'

/*
  Mô phỏng 3D bố trí tấm pin từ số liệu đánh giá sơ bộ + tấm pin trong catalog (GET /api/products).
  Chỉ để hình dung: backend chưa có API lưu thiết kế, và kích thước mái là giả định (xem roofLayout.ts),
  nên luôn hiện kèm phần chữ nêu số tấm, công suất và giả định. Phần chữ cũng là bản thay thế cho
  người không xem được canvas.
*/

const RoofScene = lazy(() => import('@/features/pre-surveys/components/RoofScene').then((m) => ({ default: m.RoofScene })))

/** Backend đã lọc theo loại; ở đây chỉ lọc điều API không có tham số: đang bán, đủ công suất và kích thước. */
function canSimulate(p: ProductResponse) {
  return (
    isProductActive(p.status) &&
    (p.widthMm ?? 0) > 0 &&
    (p.heightMm ?? 0) > 0 &&
    (p.ratedPowerW ?? 0) > 0
  )
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

const VIEWS: { value: RoofView; label: string }[] = [
  { value: 'angle', label: 'Góc nghiêng' },
  { value: 'top', label: 'Từ trên' },
  { value: 'front', label: 'Nhìn vào mặt mái' },
]

const num = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 1 })

export function RoofSimulation({
  totalAreaM2,
  usableAreaM2,
  tiltDegree,
  azimuthDegree,
  hasObstruction,
}: {
  totalAreaM2?: number | null
  usableAreaM2?: number | null
  tiltDegree?: number | null
  azimuthDegree?: number | null
  hasObstruction?: boolean | null
}) {
  // Lọc loại ở backend (không phân biệt hoa thường); 100 là PageSize tối đa backend nhận.
  const catalog = useProductsQuery({ ProductType: SOLAR_PANEL_TYPE, PageSize: 100, SortBy: 'ratedPowerW', SortDirection: 'desc' })
  const panels = useMemo(() => (catalog.data?.items ?? []).filter(canSimulate), [catalog.data])
  const [panelId, setPanelId] = useState('')
  const [view, setView] = useState<RoofView>('angle')
  const [webgl] = useState(supportsWebGL)

  const panel = panels.find((p) => p.id === panelId) ?? panels[0] ?? null
  const layout = computeRoofLayout(
    { totalAreaM2: totalAreaM2 ?? Number.NaN, usableAreaM2: usableAreaM2 ?? Number.NaN, tiltDegree: tiltDegree ?? 0 },
    panel && { widthMm: panel.widthMm!, heightMm: panel.heightMm!, ratedPowerW: panel.ratedPowerW! },
  )

  if (!layout) {
    return (
      <EmptyState
        title="Nhập diện tích để xem mô phỏng"
        description="Mô phỏng dựng theo tổng diện tích và diện tích dùng được; diện tích dùng được không lớn hơn tổng."
      />
    )
  }

  const facing = azimuthDegree ?? 180
  const roofSize = `${num.format(layout.roof.length)} × ${num.format(layout.roof.slope)} m`
  const summary = panel
    ? `Mái ${roofSize}, quay về hướng ${directionLabel(facing)}, xếp được ${layout.count} tấm, tổng ${num.format(layout.kWp)} kWp.`
    : `Mái ${roofSize}, quay về hướng ${directionLabel(facing)}. Chưa có tấm pin để xếp.`

  return (
    <div className="space-y-4">
      {webgl ? (
        <div role="img" aria-label={`Mô phỏng 3D. ${summary}`} className="aspect-[4/3] w-full overflow-hidden rounded-container border border-line bg-surface-2">
          <Suspense fallback={<Skeleton className="size-full rounded-none" />}>
            <RoofScene layout={layout} azimuthDegree={facing} view={view} />
          </Suspense>
        </div>
      ) : (
        <Notice tone="warn">Trình duyệt này không hỗ trợ WebGL nên không vẽ được mô phỏng 3D. Số liệu bên dưới vẫn đúng.</Notice>
      )}

      {webgl && (
        <div className="flex flex-wrap items-center gap-2">
          {VIEWS.map((v) => (
            <Button key={v.value} size="sm" variant={view === v.value ? 'primary' : 'secondary'} aria-pressed={view === v.value} onClick={() => setView(v.value)}>
              {v.label}
            </Button>
          ))}
          <span className="text-meta text-fg-3">Kéo để xoay, cuộn để phóng to.</span>
        </div>
      )}

      {panels.length > 0 ? (
        <Field label="Loại tấm pin" htmlFor="panelProduct">
          <Select id="panelProduct" value={panel?.id ?? ''} onChange={(e) => setPanelId(e.target.value)}>
            {panels.map((p) => (
              <option key={p.id} value={p.id}>
                {[p.name, formatPower(p.ratedPowerW)].filter(Boolean).join(', ')}
              </option>
            ))}
          </Select>
        </Field>
      ) : (
        !catalog.isPending && (
          <Notice tone="warn">
            {catalog.isError ? 'Không tải được danh mục tấm pin.' : 'Danh mục chưa có tấm pin (loại SOLAR_PANEL, đủ công suất và kích thước) để xếp lên mái.'}
          </Notice>
        )
      )}

      <Facts
        items={[
          { k: 'Số tấm xếp được', v: panel ? num.format(layout.count) : '—' },
          { k: 'Tổng công suất', v: panel ? `${num.format(layout.kWp)} kWp` : '—' },
          { k: 'Mái giả định', v: roofSize },
          { k: 'Hướng mái', v: azimuthDegree == null ? 'Chưa chọn, tạm vẽ hướng Nam' : directionLabel(azimuthDegree) },
        ]}
      />
      <p className="text-meta text-fg-3">
        Giả định mái một mặt dốc, hình chữ nhật tỉ lệ {ROOF_ASPECT * 2}:2 theo diện tích khai báo, tấm cách nhau 2 cm. Kỹ sư sẽ đo lại khi khảo sát.
        {hasObstruction && ' Mặt lắp có vật cản nên số tấm thực tế có thể ít hơn.'}
      </p>
    </div>
  )
}
