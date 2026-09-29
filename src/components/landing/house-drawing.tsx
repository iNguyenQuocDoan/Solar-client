import { cx } from '@/lib/cx'

/*
  Bản vẽ mặt cắt dọc một căn nhà ống bốn tầng – hình chính của màn đầu. Vẽ theo lối bản vẽ kiến
  trúc: phần bị cắt (sàn, tường) tô đặc, phần nằm sau mặt cắt (nhà bên cạnh, cây) nét mảnh nhạt.
  Chỉ tấm pin và đường dây mang màu nhấn: đó là phần Smart Solar lắp. Không ghi số đo: đây là hình
  minh hoạ chung, không phải căn nhà mẫu của các khối dữ liệu.

  viewBox 600 × 700. Khung chứa ở mobile là 4:3 với `slice` canh giữa nên chỉ còn phần mái
  (mặt trời, mái tôn, tấm pin, tum, bồn nước) và hai tầng trên.
*/

const GROUND = 660
const FRONT = 150
const BACK = 450
const WALL = 6
const SLAB = 8
/* Mặt trên sàn tầng 2, 3, 4 và sân thượng. */
const FLOORS = [570, 480, 390, 300]
/* Lỗ thang xuyên các sàn. */
const STAIR = { from: 384, to: 436 }
/* Mái tôn một mái dốc về phía nắng, gác lên tường tum. */
const ROOF = { x1: 140, y1: 266, x2: 380 }
const roofY = (x: number) => ROOF.y1 - ((x - ROOF.x1) * 46) / 236
type Span = [number, number]

const PANELS: Span[] = [
  [166, 230],
  [234, 298],
  [302, 366],
]
const SUN = { x: 78, y: 150, r: 22 }

function stairPath() {
  // Mỗi tầng một vế thang vẽ bằng một nét xiên, đổi chiều ở mỗi sàn. Vẽ từng bậc thì ở cỡ này
  // thành răng cưa, rối hơn phần còn lại của bản vẽ.
  let d = ''
  const levels = [GROUND, ...FLOORS]
  for (const [i, from] of levels.entries()) {
    const to = levels[i + 1]
    if (to === undefined) break
    const [x1, x2] = i % 2 === 0 ? [STAIR.to - 2, STAIR.from + 4] : [STAIR.from + 4, STAIR.to - 2]
    d += `M${x1} ${from}L${x2} ${to}`
  }
  return d
}

function panelPoints([a, b]: Span) {
  const [ya, yb] = [roofY(a), roofY(b)]
  return `${a},${ya - 4} ${b},${yb - 4} ${b},${yb - 9} ${a},${ya - 9}`
}

function ray(tx: number, ty: number) {
  const dx = tx - SUN.x
  const dy = ty - SUN.y
  const len = Math.hypot(dx, dy)
  const start = SUN.r + 10
  return `M${SUN.x + (dx / len) * start} ${SUN.y + (dy / len) * start}L${tx} ${ty}`
}

export function HouseDrawing({ label, className }: { label: string; className?: string }) {
  /* Tường mặt tiền: các đoạn đặc giữa những ô cửa ra ban công. */
  const frontWall: Span[] = [
    [280, 320],
    [390, 410],
    [480, 500],
    [570, 590],
  ]
  const openings: Span[] = [
    [320, 390],
    [410, 480],
    [500, 570],
    [590, GROUND],
  ]

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 600 700"
      preserveAspectRatio="xMidYMid slice"
      className={cx('block h-full w-full', className)}
    >
      {/* Nhà cao hơn nằm sau mặt cắt. */}
      <g className="fill-none stroke-line" strokeWidth={1}>
        <rect x={420} y={150} width={170} height={GROUND - 150} />
        {[180, 240, 300, 360, 420, 480, 540].map((y) => (
          <g key={y}>
            <rect x={472} y={y} width={30} height={34} />
            <rect x={532} y={y} width={30} height={34} />
          </g>
        ))}
      </g>

      {/* Cây trên vỉa hè. */}
      <g className="fill-none stroke-line-2" strokeWidth={1.5}>
        <path d={`M70 ${GROUND}V598`} />
        <circle cx={70} cy={564} r={34} />
        <circle cx={96} cy={582} r={20} />
      </g>

      {/* Nền nhà (cả tum) che nét nhà phía sau. */}
      <path className="fill-canvas" d={`M${FRONT - 26} ${GROUND}V${ROOF.y1}H374V226H${BACK}V${GROUND}Z`} />

      {/* Mặt trời và tia nắng tới tấm pin. */}
      <circle cx={SUN.x} cy={SUN.y} r={SUN.r} className="fill-none stroke-fg-2" strokeWidth={1.5} />
      <g className="fill-none stroke-line-2" strokeWidth={1.2} strokeDasharray="2 6" strokeLinecap="round">
        {PANELS.map(([a, b]) => {
          const x = (a + b) / 2
          return <path key={a} d={ray(x, roofY(x) - 12)} />
        })}
      </g>

      {/* Phần bị cắt: sàn, tường, tum. */}
      <g className="fill-fg">
        {FLOORS.map((y) => (
          <g key={y}>
            <rect x={FRONT} y={y} width={STAIR.from - FRONT} height={SLAB} />
            <rect x={STAIR.to} y={y} width={BACK - STAIR.to} height={SLAB} />
          </g>
        ))}
        {frontWall.map(([y1, y2]) => (
          <rect key={y1} x={FRONT} y={y1} width={WALL} height={y2 - y1} />
        ))}
        <rect x={BACK - WALL} y={232} width={WALL} height={GROUND - 232} />
        {/* Tum thang và mái tum. */}
        <rect x={380} y={232} width={WALL} height={68} />
        <rect x={374} y={226} width={BACK - 374} height={6} />
        {/* Ban công tầng 2, 3, 4. */}
        {FLOORS.slice(0, 3).map((y) => (
          <rect key={y} x={FRONT - 26} y={y} width={26} height={SLAB} />
        ))}
        {/* Mái tôn. */}
        <polygon
          points={`${ROOF.x1},${ROOF.y1} ${ROOF.x2},${roofY(ROOF.x2)} ${ROOF.x2},${roofY(ROOF.x2) + 3} ${ROOF.x1},${ROOF.y1 + 3}`}
        />
      </g>

      {/* Lan can ban công, cánh cửa, cột đỡ mái, cầu thang. */}
      <g className="fill-none stroke-fg" strokeWidth={1.5}>
        {FLOORS.slice(0, 3).map((y) => (
          <path key={y} d={`M${FRONT - 25} ${y}V${y - 24}H${FRONT}`} />
        ))}
        <path d={`M160 300V${roofY(160) + 3}M270 300V${roofY(270) + 3}`} strokeWidth={2} />
        <path d={stairPath()} />
      </g>
      <g className="fill-none stroke-line-2" strokeWidth={1}>
        {FLOORS.slice(0, 3).map((y) => (
          <path key={y} d={`M${FRONT - 19} ${y}V${y - 24}M${FRONT - 13} ${y}V${y - 24}M${FRONT - 7} ${y}V${y - 24}`} />
        ))}
        {openings.map(([y1, y2]) => (
          <path key={y1} d={`M${FRONT + 3} ${y1}V${y2}`} />
        ))}
      </g>

      {/* Máy lạnh tầng 2 và 3 – thứ dùng điện ban ngày. */}
      <g className="fill-canvas stroke-fg" strokeWidth={1.2}>
        {[488, 398].map((y) => (
          <g key={y}>
            <rect x={200} y={y + 3} width={44} height={12} rx={2} />
            <path d={`M205 ${y + 11}H239`} className="stroke-line-2" />
          </g>
        ))}
      </g>

      {/* Bồn nước inox trên tum. */}
      <g className="stroke-fg" strokeWidth={1.5}>
        <path d="M400 216V226M434 216V226" />
        <rect x={392} y={190} width={50} height={26} rx={13} className="fill-canvas" />
        <path d="M405 191V215M429 191V215" className="stroke-line-2" strokeWidth={1} />
      </g>

      {/* Tấm pin, inverter, tủ điện và đường dây: phần Smart Solar lắp. */}
      <g className="fill-accent">
        {PANELS.map((p) => (
          <polygon key={p[0]} points={panelPoints(p)} />
        ))}
      </g>
      <path d="M364 224V252M370 276V606" className="fill-none stroke-accent" strokeWidth={1.5} strokeDasharray="4 3" />
      <g className="fill-canvas stroke-accent" strokeWidth={1.5}>
        <rect x={362} y={252} width={16} height={24} rx={2} />
        <rect x={362} y={606} width={16} height={22} rx={2} />
      </g>

      {/* Mặt đất. */}
      <path d={`M0 ${GROUND}H600`} className="stroke-fg" strokeWidth={1.5} />
    </svg>
  )
}
