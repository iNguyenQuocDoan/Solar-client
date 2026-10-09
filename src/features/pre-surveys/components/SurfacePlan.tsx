import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { NUDGE_M, round3 } from '@/features/pre-surveys/components/surfaceForm'
import { formatTwo } from '@/features/pre-surveys/components/simulationDisplay'
import { useElementWidth } from '@/hooks/useElementWidth'
import { cx } from '@/utils/cx'

/*
  Mặt bằng mặt lắp (SVG), vẽ theo hệ toạ độ của mặt lắp chứ không xoay theo hướng Bắc: mép trên của hình là mép cao
  của mái, đi xuống là xuôi dốc (đúng quy ước editor 2D của backend). Vẽ bằng pixel – đo bề rộng khung bằng
  ResizeObserver – để chữ luôn 13px và kéo thả đổi đúng ra mét.
  Dùng ở hai nơi: editor mặt lắp (chọn, kéo thả, phím mũi tên dịch vật cản) và kết quả mô phỏng (thêm tấm pin, vùng
  lùi mép, vùng cách quanh vật cản). Màu theo token: tấm pin dùng màu vật liệu --pv-glass / --pv-frame.
*/

export type PlanObstacle = { name: string; xM: number; yM: number; widthM: number; lengthM: number }
export type PlanPanel = { centerXM: number; centerYM: number; widthM: number; depthM: number; rotationDegree: number }

const MARGIN = { top: 28, right: 12, bottom: 28, left: 36 }
const MAX_PX_PER_M = 80
/** Khoảng lưới chọn sao cho hai vạch cách nhau tối thiểu ~32px. */
const GRID_STEPS = [0.5, 1, 2, 5, 10, 20, 50]

const snap = (value: number, step: number) => round3(Math.round(value / step) * step)
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max))

export function SurfacePlan({
  widthM,
  lengthM,
  obstacles,
  panels,
  setbackM,
  clearanceM,
  selected = null,
  onSelect,
  onMove,
  label,
  maxHeight = 420,
  className,
}: {
  widthM: number
  lengthM: number
  obstacles: PlanObstacle[]
  panels?: PlanPanel[]
  /** Vùng lùi mép (kết quả mô phỏng), mét. */
  setbackM?: number
  /** Khoảng cách quanh vật cản (kết quả mô phỏng), mét. */
  clearanceM?: number
  selected?: number | null
  onSelect?: (index: number | null) => void
  /** Có thì vật cản kéo thả / dịch bằng phím được (editor). Toạ độ mới đã làm tròn bước 0,1 m và nằm trong mặt lắp. */
  onMove?: (index: number, xM: number, yM: number) => void
  /** Mô tả cho trình đọc màn hình. */
  label: string
  maxHeight?: number
  className?: string
}) {
  const [boxRef, boxWidth] = useElementWidth<HTMLDivElement>()
  const hatchId = useId()
  const hintId = useId()
  const drag = useRef<{ index: number; pointerX: number; pointerY: number; xM: number; yM: number } | null>(null)
  const interactive = Boolean(onMove)

  const plotMaxW = Math.max(0, boxWidth - MARGIN.left - MARGIN.right)
  // Trần 80 px/m: mặt lắp vài mét không bị phóng to bằng cả khung như mái hàng chục mét (người xem so được độ lớn).
  const scale = widthM > 0 && lengthM > 0 ? Math.min(plotMaxW / widthM, maxHeight / lengthM, MAX_PX_PER_M) : 0
  const plotW = widthM * scale
  const plotH = lengthM * scale
  const left = MARGIN.left + (plotMaxW - plotW) / 2
  const top = MARGIN.top
  const px = (xM: number) => left + xM * scale
  const py = (yM: number) => top + yM * scale
  const grid = GRID_STEPS.find((s) => s * scale >= 32) ?? GRID_STEPS.at(-1)!

  /** Vị trí mới vừa dịch bằng bàn phím, đọc cho trình đọc màn hình (kéo chuột thì người dùng thấy ô nhập đổi theo). */
  const [announcement, setAnnouncement] = useState('')

  /*
    Dịch vật cản đi (dx, dy) mét từ vị trí gốc: làm tròn BƯỚC DỊCH theo 0,1 m chứ không làm tròn vị trí về lưới tuyệt đối,
    nên vật cản ở 0,35 m dịch phải thành 0,45 m chứ không nhảy về 0,3 (rà code 09/10/2026). Kẹp trong mặt lắp.
  */
  function move(index: number, fromX: number, fromY: number, dx: number, dy: number) {
    const o = obstacles[index]
    if (!o || !onMove) return null
    const x = clamp(round3(fromX + snap(dx, NUDGE_M)), 0, round3(widthM - o.widthM))
    const y = clamp(round3(fromY + snap(dy, NUDGE_M)), 0, round3(lengthM - o.lengthM))
    onMove(index, x, y)
    return { x, y }
  }

  function onPointerDown(e: PointerEvent<SVGRectElement>, index: number) {
    onSelect?.(index)
    if (!onMove || e.button !== 0) return
    const o = obstacles[index]!
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { index, pointerX: e.clientX, pointerY: e.clientY, xM: o.xM, yM: o.yM }
  }

  function onPointerMove(e: PointerEvent<SVGRectElement>) {
    const d = drag.current
    if (!d || scale <= 0) return
    move(d.index, d.xM, d.yM, (e.clientX - d.pointerX) / scale, (e.clientY - d.pointerY) / scale)
  }

  function onKeyDown(e: KeyboardEvent<SVGRectElement>, index: number) {
    const o = obstacles[index]!
    const step = e.shiftKey ? 1 : NUDGE_M
    const delta: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
    const d = delta[e.key]
    if (d && onMove) {
      e.preventDefault()
      onSelect?.(index)
      const moved = move(index, o.xM, o.yM, d[0], d[1])
      if (moved) setAnnouncement(`${o.name || `Vật cản ${index + 1}`}: cách mép trái ${formatTwo(moved.x)} m, cách mép cao ${formatTwo(moved.y)} m`)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(index)
    } else if (e.key === 'Escape') onSelect?.(null)
  }

  const gridLines: number[][] = [[], []]
  if (scale > 0) {
    for (let x = grid; x < widthM - 1e-9; x += grid) gridLines[0]!.push(x)
    for (let y = grid; y < lengthM - 1e-9; y += grid) gridLines[1]!.push(y)
  }

  return (
    <div ref={boxRef} className={cx('w-full', className)}>
      {scale > 0 && (
        <svg
          width={boxWidth}
          height={top + plotH + MARGIN.bottom}
          role={interactive ? 'group' : 'img'}
          aria-label={label}
          aria-describedby={interactive ? hintId : undefined}
          className="block select-none"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) onSelect?.(null)
          }}
        >
          <defs>
            <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" className="stroke-fg-3" strokeWidth="1.5" />
            </pattern>
          </defs>

          {/* Kích thước: rộng trên mép cao, dài dọc mép trái. */}
          <text x={left + plotW / 2} y={top - 10} textAnchor="middle" className="fill-fg-2 text-meta">
            Mép cao, rộng {formatTwo(widthM)} m
          </text>
          <text
            x={left - 12}
            y={top + plotH / 2}
            textAnchor="middle"
            transform={`rotate(-90 ${left - 12} ${top + plotH / 2})`}
            className="fill-fg-2 text-meta"
          >
            Dài {formatTwo(lengthM)} m
          </text>
          <text x={left + plotW / 2} y={top + plotH + 20} textAnchor="middle" className="fill-fg-3 text-meta">
            Mép thấp
          </text>

          <rect
            x={left}
            y={top}
            width={plotW}
            height={plotH}
            className="fill-surface-2 stroke-fg-3"
            strokeWidth="1"
            onPointerDown={() => onSelect?.(null)}
          />
          <g aria-hidden className="pointer-events-none stroke-line" strokeWidth="1">
            {gridLines[0]!.map((x) => (
              <line key={`x${x}`} x1={px(x)} x2={px(x)} y1={top} y2={top + plotH} />
            ))}
            {gridLines[1]!.map((y) => (
              <line key={`y${y}`} x1={left} x2={left + plotW} y1={py(y)} y2={py(y)} />
            ))}
          </g>

          {setbackM !== undefined && setbackM > 0 && widthM > 2 * setbackM && lengthM > 2 * setbackM && (
            <rect
              aria-hidden
              x={px(setbackM)}
              y={py(setbackM)}
              width={(widthM - 2 * setbackM) * scale}
              height={(lengthM - 2 * setbackM) * scale}
              className="pointer-events-none fill-none stroke-fg-3"
              strokeDasharray="4 4"
            />
          )}

          {panels && panels.length > 0 && (
            <g aria-hidden className="pointer-events-none fill-pv-glass stroke-pv-frame">
              {panels.map((p, i) => (
                <rect
                  key={i}
                  x={-p.widthM / 2}
                  y={-p.depthM / 2}
                  width={p.widthM}
                  height={p.depthM}
                  // Vẽ theo mét rồi phóng bằng transform: xoay quanh tâm tấm đúng như footprint của backend.
                  transform={`translate(${px(p.centerXM)} ${py(p.centerYM)}) scale(${scale}) rotate(${p.rotationDegree})`}
                  strokeWidth={Math.min(1, (p.widthM * scale) / 8) / scale}
                />
              ))}
            </g>
          )}

          {obstacles.map((o, i) => {
            // Vật cản chưa nhập đủ / sai kích thước: không vẽ (nếu không sẽ thành ô 0 × 0 vẫn nhận Tab mà không thấy).
            if (!(o.widthM > 0 && o.lengthM > 0)) return null
            const isSelected = selected === i
            // Vật cản tràn ra ngoài mặt lắp (đang nhập dở hoặc sai số): viền đỏ trùng với lỗi ở ô nhập.
            const outside = o.xM < 0 || o.yM < 0 || round3(o.xM + o.widthM) > widthM || round3(o.yM + o.lengthM) > lengthM
            const x = px(o.xM)
            const y = py(o.yM)
            const w = o.widthM * scale
            const h = o.lengthM * scale
            const c = clearanceM ?? 0
            return (
              <g key={i}>
                {c > 0 && (
                  <rect
                    aria-hidden
                    x={px(Math.max(0, o.xM - c))}
                    y={py(Math.max(0, o.yM - c))}
                    width={(Math.min(widthM, o.xM + o.widthM + c) - Math.max(0, o.xM - c)) * scale}
                    height={(Math.min(lengthM, o.yM + o.lengthM + c) - Math.max(0, o.yM - c)) * scale}
                    className="pointer-events-none fill-none stroke-fg-3"
                    strokeDasharray="3 3"
                  />
                )}
                <rect x={x} y={y} width={w} height={h} fill={`url(#${hatchId})`} className="pointer-events-none" />
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  role={interactive ? 'button' : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  aria-label={
                    interactive
                      ? `${o.name || `Vật cản ${i + 1}`}: cách mép trái ${formatTwo(o.xM)} m, cách mép cao ${formatTwo(o.yM)} m`
                      : undefined
                  }
                  className={cx(
                    'fill-transparent outline-none',
                    outside ? 'stroke-danger' : isSelected ? 'stroke-accent' : 'stroke-fg-2',
                    interactive && 'cursor-grab touch-none focus-visible:stroke-ring active:cursor-grabbing',
                  )}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  onPointerDown={interactive || onSelect ? (e) => onPointerDown(e, i) : undefined}
                  onPointerMove={interactive ? onPointerMove : undefined}
                  onPointerUp={() => (drag.current = null)}
                  onPointerCancel={() => (drag.current = null)}
                  onKeyDown={interactive ? (e) => onKeyDown(e, i) : undefined}
                />
                {w > 56 && h > 22 ? (
                  <text
                    x={x + 6}
                    y={y + 16}
                    className={cx('pointer-events-none text-meta', isSelected ? 'fill-accent-fg font-semibold' : 'fill-fg')}
                    paintOrder="stroke"
                    stroke="var(--surface-2)"
                    strokeWidth="3"
                  >
                    {truncate(o.name, Math.floor((w - 12) / 7))}
                  </text>
                ) : (
                  // Không đủ chỗ ghi tên: ghi số thứ tự, khớp với "Vật cản N" ở danh sách bên dưới.
                  w > 14 &&
                  h > 14 && (
                    <text
                      aria-hidden
                      x={x + w / 2}
                      y={y + h / 2 + 4}
                      textAnchor="middle"
                      className={cx('pointer-events-none text-meta font-semibold', isSelected ? 'fill-accent-fg' : 'fill-fg')}
                      paintOrder="stroke"
                      stroke="var(--surface-2)"
                      strokeWidth="3"
                    >
                      {i + 1}
                    </text>
                  )
                )}
              </g>
            )
          })}
        </svg>
      )}
      {interactive && (
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      )}
      {interactive && (
        <p id={hintId} className="mt-2 text-meta text-fg-3">
          Kéo vật cản để đổi vị trí, hoặc chọn rồi dùng phím mũi tên (giữ Shift để dịch 1 m).
        </p>
      )}
    </div>
  )
}

function truncate(text: string, max: number) {
  if (max <= 1) return ''
  return text.length > max ? `${text.slice(0, Math.max(1, max - 1))}…` : text
}
