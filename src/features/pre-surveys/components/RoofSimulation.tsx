import { Component, lazy, Suspense, useMemo, useState, type ReactNode } from 'react'
import { Field, Select } from '@/components/common/ui/field'
import { Notice } from '@/components/common/ui/lists'
import { Segmented, type SegmentedOption } from '@/components/common/ui/segmented'
import { EmptyState, Skeleton } from '@/components/common/ui/states'
import { Facts } from '@/features/pre-surveys/components/Facts'
import { directionLabel } from '@/features/pre-surveys/components/preSurveyDisplay'
import { ROOF_ASPECT, computeRoofLayout } from '@/features/pre-surveys/components/roofLayout'
import type { RoofView } from '@/features/pre-surveys/components/RoofScene'
import { SOLAR_PANEL_QUERY, formatPower, isProductActive } from '@/features/products/components/productDisplay'
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

/* three r186 chỉ tạo context WebGL2, nên máy chỉ có WebGL1 cũng coi như không vẽ được. */
function supportsWebGL() {
  try {
    return Boolean(document.createElement('canvas').getContext('webgl2'))
  } catch {
    return false
  }
}

const NO_3D = 'Không vẽ được mô phỏng 3D trên trình duyệt này. Số liệu bên dưới vẫn đúng.'

/*
  Lỗi khi tạo renderer hoặc tải chunk three.js (sau khi deploy bản mới) chỉ được thay khung 3D bằng thông báo,
  không được lan lên error boundary gốc: ở wizard, mất cả trang là mất luôn số liệu khách đang nhập dở.
*/
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? <Notice tone="warn">{NO_3D}</Notice> : this.props.children
  }
}

/* Không icon: ba nhãn chữ vừa một hàng trên điện thoại 360px. */
const VIEWS: SegmentedOption<RoofView>[] = [
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
  const catalog = useProductsQuery(SOLAR_PANEL_QUERY)
  const panels = useMemo(() => (catalog.data?.items ?? []).filter(canSimulate), [catalog.data])
  const [panelId, setPanelId] = useState('')
  const [view, setView] = useState<RoofView>('angle')
  const [webgl] = useState(supportsWebGL)

  const panel = panels.find((p) => p.id === panelId) ?? panels[0] ?? null
  // Nhớ theo số đầu vào: layout mới mỗi lần render sẽ dựng lại texture tấm pin và khối nhà trong RoofScene.
  const panelW = panel?.widthMm
  const panelH = panel?.heightMm
  const panelP = panel?.ratedPowerW
  const layout = useMemo(
    () =>
      computeRoofLayout(
        { totalAreaM2: totalAreaM2 ?? Number.NaN, usableAreaM2: usableAreaM2 ?? Number.NaN, tiltDegree: tiltDegree ?? 0 },
        panelW && panelH && panelP ? { widthMm: panelW, heightMm: panelH, ratedPowerW: panelP } : null,
      ),
    [totalAreaM2, usableAreaM2, tiltDegree, panelW, panelH, panelP],
  )

  if (!layout) {
    // Nói đúng lý do không dựng được mái, thay vì vẽ một mái sai trông như đúng.
    const areaOk = (totalAreaM2 ?? 0) > 0 && (usableAreaM2 ?? 0) > 0 && usableAreaM2! <= totalAreaM2!
    return areaOk ? (
      <EmptyState title="Độ dốc mái phải từ 0 đến 90 độ" description="Sửa ô độ dốc mái ở trên để xem mô phỏng." />
    ) : (
      <EmptyState
        title="Nhập diện tích để xem mô phỏng"
        description="Mô phỏng dựng theo tổng diện tích và diện tích dùng được; diện tích dùng được không lớn hơn tổng."
      />
    )
  }

  const facing = azimuthDegree ?? 180
  const roofSize = `${num.format(layout.roof.length)} × ${num.format(layout.roof.slope)} m`
  const arrangement = `${num.format(layout.columns)} cột × ${num.format(layout.rows)} hàng, tấm đặt ${layout.orientation === 'landscape' ? 'nằm' : 'đứng'}`
  // Phần diện tích dùng được mà mặt tấm phủ; phần còn lại là khe giữa các tấm và mép thừa.
  const coverage = usableAreaM2 ? (layout.count * layout.panel.along * layout.panel.down * 100) / usableAreaM2 : 0
  const summary = panel
    ? `Mái ${roofSize}, quay về hướng ${directionLabel(facing)}, lắp được ${layout.count} tấm (${arrangement}), tổng ${num.format(layout.kWp)} kWp.`
    : `Mái ${roofSize}, quay về hướng ${directionLabel(facing)}. Chưa có tấm pin để xếp.`

  return (
    <div className="space-y-4">
      {webgl ? (
        <div role="img" aria-label={`Mô phỏng 3D. ${summary}`} className="aspect-[4/3] w-full overflow-hidden rounded-container border border-line bg-surface-2">
          <SceneBoundary>
            <Suspense fallback={<Skeleton className="size-full rounded-none" />}>
              <RoofScene layout={layout} azimuthDegree={facing} view={view} />
            </Suspense>
          </SceneBoundary>
        </div>
      ) : (
        <Notice tone="warn">{NO_3D}</Notice>
      )}

      {webgl && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* Góc nhìn là một lựa chọn trong ba, không phải ba hành động: nhóm chọn thay cho nút đặc tranh với nút chính của trang. */}
          <Segmented label="Góc nhìn mô phỏng" options={VIEWS} value={view} onChange={setView} className="w-full sm:w-auto" />
          <span className="text-meta text-fg-3">Kéo để xoay; phóng to bằng Ctrl + lăn chuột hoặc chụm hai ngón.</span>
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
          { k: 'Số tấm lắp được', v: panel ? num.format(layout.count) : '—' },
          { k: 'Tổng công suất', v: panel ? `${num.format(layout.kWp)} kWp` : '—' },
          { k: 'Cách xếp', v: panel ? arrangement : '—' },
          { k: 'Tấm phủ diện tích dùng được', v: panel ? `${num.format(coverage)}%` : '—' },
          { k: 'Mái giả định', v: roofSize },
          { k: 'Độ dốc', v: tiltDegree == null ? 'Chưa nhập, tạm vẽ mái bằng' : `${num.format(tiltDegree)}°` },
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
