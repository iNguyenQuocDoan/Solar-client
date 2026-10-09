import { useMemo, useRef, useState } from 'react'
import { Button, IconButton } from '@/components/common/ui/button'
import { Checkbox, Field, Input } from '@/components/common/ui/field'
import { Panel, PanelBody, PanelHeader } from '@/components/common/ui/panel'
import { EmptyState } from '@/components/common/ui/states'
import { CompassPicker, WithUnit } from '@/features/pre-surveys/components/AssessmentFields'
import { Facts } from '@/features/pre-surveys/components/Facts'
import { directionLabel } from '@/features/pre-surveys/components/preSurveyDisplay'
import { formatM2 } from '@/features/pre-surveys/components/simulationDisplay'
import { SurfacePlan } from '@/features/pre-surveys/components/SurfacePlan'
import {
  SURFACE_LIMITS,
  autoDeclared,
  meterText,
  newObstacle,
  num,
  obstacleErrorKey,
  type ObstacleField,
  type ObstacleForm,
  type SurfaceErrors,
  type SurfaceForm,
} from '@/features/pre-surveys/components/surfaceForm'
import { cx } from '@/utils/cx'

/*
  Bước "Mặt lắp" của đánh giá sơ bộ: kích thước, độ dốc, hướng, vật cản. Ô nhập là nguồn chính; trên hình chọn và kéo
  thả vật cản (người dùng chốt 09/10/2026). Số liệu khai (tổng, dùng được, có vật cản) tự tính từ mặt lắp, khách vẫn
  sửa được hai ô diện tích. Trang giữ state; `onChange` nhận form mới và các khoá lỗi cần xoá.
*/

type Props = {
  value: SurfaceForm
  errors: SurfaceErrors
  onChange: (next: SurfaceForm, touched: string[]) => void
}

const OBSTACLE_FIELDS: { field: Exclude<ObstacleField, 'name'>; label: string; hint?: string }[] = [
  { field: 'xM', label: 'Cách mép trái' },
  { field: 'yM', label: 'Cách mép cao' },
  { field: 'widthM', label: 'Bề ngang' },
  { field: 'lengthM', label: 'Bề dọc' },
  { field: 'heightM', label: 'Cao', hint: 'Không bắt buộc' },
]

export function SurfaceEditor({ value, errors, onChange }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const addRef = useRef<HTMLButtonElement>(null)
  const width = num(value.widthM)
  const length = num(value.lengthM)
  const size =
    width !== null && length !== null && width > 0 && length > 0 && width <= SURFACE_LIMITS.maxSideM && length <= SURFACE_LIMITS.maxSideM
      ? { width, length }
      : null
  const auto = autoDeclared(value)

  // Hình chỉ vẽ vật cản đọc được thành số; chỉ số trong mảng này trùng chỉ số của form (ô sai vẽ thành 0 × 0 thì bỏ qua).
  const planObstacles = useMemo(
    () =>
      value.obstacles.map((o) => ({
        name: o.name.trim(),
        xM: num(o.xM) ?? 0,
        yM: num(o.yM) ?? 0,
        widthM: Math.max(0, num(o.widthM) ?? 0),
        lengthM: Math.max(0, num(o.lengthM) ?? 0),
      })),
    [value.obstacles],
  )

  const set = (patch: Partial<SurfaceForm>) => onChange({ ...value, ...patch }, Object.keys(patch))

  function setObstacle(index: number, patch: Partial<ObstacleForm>) {
    const obstacles = value.obstacles.map((o, i) => (i === index ? { ...o, ...patch } : o))
    onChange({ ...value, obstacles }, Object.keys(patch).map((f) => obstacleErrorKey(index, f as ObstacleField)))
  }

  function addObstacle() {
    onChange({ ...value, obstacles: [...value.obstacles, newObstacle(value)] }, ['obstacles'])
    setSelected(value.obstacles.length)
  }

  function removeObstacle(index: number) {
    // Lỗi gắn theo chỉ số: xoá một vật cản làm lệch chỉ số các vật cản sau, nên xoá hết lỗi vật cản.
    const touched = Object.keys(errors).filter((k) => k.startsWith('obstacles'))
    onChange({ ...value, obstacles: value.obstacles.filter((_, i) => i !== index) }, touched)
    setSelected(null)
    // Nút xoá vừa bấm biến mất cùng dòng: đưa focus về nút thêm thay vì để rơi về <body>.
    addRef.current?.focus()
  }

  const obstacleCount = value.obstacles.length
  const full = obstacleCount >= SURFACE_LIMITS.maxObstacles

  return (
    <div className="space-y-6">
      <Panel>
        <PanelHeader
          title="Kích thước và hướng"
          description="Đo trên mặt mái (theo mặt nghiêng). Mái có nhiều mặt thì nhập mặt lớn nhất định lắp."
        />
        <PanelBody className="grid gap-4 sm:grid-cols-3">
          <Field label="Chiều rộng" htmlFor="surfaceWidth" hint="Dọc theo mép cao (nóc) của mái." error={errors.widthM}>
            <WithUnit unit="m">
              <Input
                id="surfaceWidth"
                inputMode="decimal"
                value={value.widthM}
                onChange={(e) => set({ widthM: e.target.value })}
                aria-invalid={Boolean(errors.widthM)}
              />
            </WithUnit>
          </Field>
          <Field label="Chiều dài theo dốc" htmlFor="surfaceLength" hint="Từ mép cao xuống mép thấp." error={errors.lengthM}>
            <WithUnit unit="m">
              <Input
                id="surfaceLength"
                inputMode="decimal"
                value={value.lengthM}
                onChange={(e) => set({ lengthM: e.target.value })}
                aria-invalid={Boolean(errors.lengthM)}
              />
            </WithUnit>
          </Field>
          <Field label="Độ dốc mái" htmlFor="surfaceTilt" hint="Mái bằng là 0°. Không chắc thì ước lượng." error={errors.tiltDegree}>
            <WithUnit unit="độ">
              <Input
                id="surfaceTilt"
                inputMode="decimal"
                value={value.tiltDegree}
                onChange={(e) => set({ tiltDegree: e.target.value })}
                aria-invalid={Boolean(errors.tiltDegree)}
              />
            </WithUnit>
          </Field>
          <CompassPicker
            className="sm:col-span-3"
            value={value.azimuthDegree}
            error={errors.azimuthDegree}
            onChange={(azimuthDegree) => set({ azimuthDegree })}
          />
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader
          title="Vật cản trên mặt lắp"
          description="Bồn nước, ống thông gió, cửa mái, cục nóng máy lạnh, lối đi… Không có thì bỏ qua."
          action={
            <Button ref={addRef} size="sm" icon="add" onClick={addObstacle} disabled={full}>
              Thêm vật cản
            </Button>
          }
        />
        <PanelBody className="space-y-4">
          {size ? (
            <SurfacePlan
              widthM={size.width}
              lengthM={size.length}
              obstacles={planObstacles}
              selected={selected}
              onSelect={setSelected}
              onMove={(i, xM, yM) => setObstacle(i, { xM: meterText(xM), yM: meterText(yM) })}
              label={`Mặt bằng mặt lắp ${meterText(size.width)} × ${meterText(size.length)} m, ${obstacleCount} vật cản.`}
            />
          ) : (
            <EmptyState title="Nhập chiều rộng và chiều dài để vẽ mặt lắp" description="Hình vẽ giúp đặt vật cản đúng chỗ trên mái." />
          )}
          {size && value.azimuthDegree && (
            <p className="text-meta text-fg-3">
              Hình vẽ nhìn từ trên xuống theo mặt mái: mép trên là mép cao, mái dốc xuống phía dưới hình và quay về hướng{' '}
              {directionLabel(Number(value.azimuthDegree))}.
            </p>
          )}

          {errors.obstacles && (
            <p className="text-meta text-danger" role="alert">
              {errors.obstacles}
            </p>
          )}

          {obstacleCount > 0 && (
            <ol className="divide-y divide-line">
              {value.obstacles.map((o, i) => {
                const isSelected = selected === i
                const id = (field: string) => `obstacle-${o.key}-${field}`
                return (
                  <li
                    key={o.key}
                    className={cx(
                      // Lấn 12px mỗi bên như dòng bảng, để nền "đang chọn" không cắt sát chữ.
                      '-mx-3 rounded-container px-3 py-4',
                      isSelected && 'bg-accent-soft',
                    )}
                    onFocusCapture={() => setSelected(i)}
                  >
                    {/* Hai hàng: tên + nút xoá, rồi 5 ô số. Một hàng 7 ô ở 1280px bẻ nhãn thành 2 dòng và các ô lệch nhau. */}
                    <fieldset className="space-y-3">
                      <legend className="sr-only">Vật cản {i + 1}</legend>
                      <div className="flex items-end gap-3">
                        <Field label={`Tên vật cản ${i + 1}`} htmlFor={id('name')} error={errors[obstacleErrorKey(i, 'name')]} className="min-w-0 flex-1">
                          <Input
                            id={id('name')}
                            value={o.name}
                            maxLength={SURFACE_LIMITS.maxNameLength}
                            onChange={(e) => setObstacle(i, { name: e.target.value })}
                            aria-invalid={Boolean(errors[obstacleErrorKey(i, 'name')])}
                          />
                        </Field>
                        <IconButton
                          icon="delete"
                          variant="danger-quiet"
                          label={`Xoá vật cản ${o.name.trim() || i + 1}`}
                          tooltip="Xoá"
                          onClick={() => removeObstacle(i)}
                          className={errors[obstacleErrorKey(i, 'name')] ? 'mb-7' : undefined}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
                        {OBSTACLE_FIELDS.map(({ field, label, hint }) => {
                          const error = errors[obstacleErrorKey(i, field)]
                          return (
                            <Field key={field} label={`${label} (m)`} htmlFor={id(field)} hint={hint} error={error}>
                              <Input
                                id={id(field)}
                                inputMode="decimal"
                                value={o[field]}
                                onChange={(e) => setObstacle(i, { [field]: e.target.value })}
                                aria-invalid={Boolean(error)}
                              />
                            </Field>
                          )
                        })}
                      </div>
                    </fieldset>
                  </li>
                )
              })}
            </ol>
          )}
          {full && <p className="text-meta text-fg-3">Đã đủ {SURFACE_LIMITS.maxObstacles} vật cản, mức tối đa của một mặt lắp.</p>}
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader title="Số liệu khai báo" description="Tính từ mặt lắp ở trên; dùng để chuyên viên đối chiếu khi khảo sát." />
        <PanelBody className="space-y-4">
          <Facts
            items={[
              { k: 'Tổng diện tích', v: value.declaredManual ? '—' : formatM2(auto?.totalAreaM2) },
              { k: 'Diện tích dùng được', v: value.declaredManual ? '—' : formatM2(auto?.usableAreaM2) },
              { k: 'Vật cản', v: obstacleCount > 0 ? `Có (${obstacleCount})` : 'Không' },
            ]}
          />
          <Checkbox
            label="Tự khai diện tích"
            description="Khi diện tích thực tế khác hình chữ nhật đã vẽ, ví dụ mái có phần khuyết."
            checked={value.declaredManual}
            onChange={(e) =>
              set({
                declaredManual: e.target.checked,
                // Mở chế độ tự khai lần đầu: điền sẵn số đang tính để khách chỉ sửa phần khác.
                ...(e.target.checked && !value.totalAreaM2 && auto
                  ? { totalAreaM2: meterText(auto.totalAreaM2), usableAreaM2: meterText(auto.usableAreaM2) }
                  : {}),
              })
            }
          />
          {value.declaredManual && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tổng diện tích" htmlFor="declaredTotal" error={errors.totalAreaM2}>
                <WithUnit unit="m²">
                  <Input
                    id="declaredTotal"
                    inputMode="decimal"
                    value={value.totalAreaM2}
                    onChange={(e) => set({ totalAreaM2: e.target.value })}
                    aria-invalid={Boolean(errors.totalAreaM2)}
                  />
                </WithUnit>
              </Field>
              <Field label="Diện tích dùng được" htmlFor="declaredUsable" hint="Trừ lối đi, bồn nước, chỗ bị che." error={errors.usableAreaM2}>
                <WithUnit unit="m²">
                  <Input
                    id="declaredUsable"
                    inputMode="decimal"
                    value={value.usableAreaM2}
                    onChange={(e) => set({ usableAreaM2: e.target.value })}
                    aria-invalid={Boolean(errors.usableAreaM2)}
                  />
                </WithUnit>
              </Field>
            </div>
          )}
        </PanelBody>
      </Panel>
    </div>
  )
}
