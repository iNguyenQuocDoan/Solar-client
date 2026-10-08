import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PANEL_GAP_M, type RoofLayout } from '@/features/pre-surveys/components/roofLayout'

/*
  Khung cảnh 3D của mô phỏng bố trí tấm pin. Tách module để three.js chỉ tải khi màn có mô phỏng mở
  (RoofSimulation nạp bằng React.lazy). Đơn vị là mét. Trục thế giới: +X là Đông, -Z là Bắc.
  Vẽ theo yêu cầu (frameloop "demand"): chỉ vẽ lại khi kéo xoay hoặc số liệu đổi, không tốn CPU khi đứng yên.
  Màu vật liệu là hex cố định vì three.js không đọc được token oklch; nền canvas trong suốt nên theo theme trang.
*/

export type RoofView = 'angle' | 'top' | 'front'

/** Chiều cao tường phía thấp, chỉ để minh hoạ. */
const WALL_HEIGHT = 4
const COLORS = {
  wall: '#d5d9cf',
  roof: '#9fa79c',
  usable: '#0d5c3a',
  panel: '#1f2b40',
  frame: '#c4cad2',
  cell: '#33435f',
  ground: '#e3e7de',
  letter: '#2f3a2c',
}

function rise(layout: RoofLayout) {
  return layout.roof.slope * Math.sin(layout.tiltRad)
}

/* Nhà một mái dốc: mặt cắt hình thang ép dài dọc theo đỉnh mái, phía thấp quay về +Z. */
function Building({ layout }: { layout: RoofLayout }) {
  const geometry = useMemo(() => {
    const run = layout.roof.slope * Math.cos(layout.tiltRad)
    const shape = new THREE.Shape()
    shape.moveTo(-run / 2, 0)
    shape.lineTo(run / 2, 0)
    shape.lineTo(run / 2, WALL_HEIGHT)
    shape.lineTo(-run / 2, WALL_HEIGHT + rise(layout))
    shape.closePath()
    const g = new THREE.ExtrudeGeometry(shape, { depth: layout.roof.length, bevelEnabled: false })
    // Ép theo -X rồi dời về giữa: mặt cắt nằm trên trục Z, phía thấp ở +Z.
    g.rotateY(-Math.PI / 2)
    g.translate(layout.roof.length / 2, 0, 0)
    return g
  }, [layout])
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={COLORS.wall} />
    </mesh>
  )
}

/** Khung nhôm của tấm pin thật, khoảng 35 mm; vẽ sáng để mắt thấy ranh giới giữa các tấm. */
const PANEL_FRAME_M = 0.035
/** Tấm nhỏ bất thường (vài cm) thì khung không được lấn hết mặt kính: tối đa 4% cạnh ngắn của tấm. */
const FRAME_MAX_SHARE = 0.04

/*
  Một ô của lưới = một tấm + một khe 2 cm. Vẽ ô đó lên canvas (khe màu mái, khung nhôm sáng, mặt kính tối,
  vân cell) rồi lặp đúng cột × hàng lần trên một mặt phẳng: thấy rõ từng tấm và khe dù có hàng chục nghìn
  tấm, mà vẫn chỉ một mesh. Nét khe/khung tối thiểu 1px để không biến mất khi tấm rất nhỏ.
*/
function panelGridTexture(layout: RoofLayout, maxAnisotropy: number) {
  const { along, down } = layout.panel
  const pitchX = along + PANEL_GAP_M
  const pitchZ = down + PANEL_GAP_M
  const LONG = 256
  const w = pitchX >= pitchZ ? LONG : Math.max(16, Math.round((LONG * pitchX) / pitchZ))
  const h = pitchZ >= pitchX ? LONG : Math.max(16, Math.round((LONG * pitchZ) / pitchX))
  const px = (meters: number, pitch: number, size: number) => Math.max(1, Math.round((meters / pitch) * size))
  const gapX = px(PANEL_GAP_M / 2, pitchX, w)
  const gapY = px(PANEL_GAP_M / 2, pitchZ, h)
  const frame = Math.min(PANEL_FRAME_M, FRAME_MAX_SHARE * Math.min(along, down))
  const glassX = gapX + px(frame, pitchX, w)
  const glassY = gapY + px(frame, pitchZ, h)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = COLORS.roof
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = COLORS.frame
  ctx.fillRect(gapX, gapY, w - 2 * gapX, h - 2 * gapY)
  const gw = w - 2 * glassX
  const gh = h - 2 * glassY
  if (gw > 0 && gh > 0) {
    ctx.fillStyle = COLORS.panel
    ctx.fillRect(glassX, glassY, gw, gh)
    // Vân cell 6 × 10 theo cạnh dài của tấm, như tấm 60 cell phổ biến.
    const [cellsX, cellsY] = along <= down ? [6, 10] : [10, 6]
    ctx.strokeStyle = COLORS.cell
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let i = 1; i < cellsX; i++) {
      const x = Math.round(glassX + (gw * i) / cellsX) + 0.5
      ctx.moveTo(x, glassY)
      ctx.lineTo(x, glassY + gh)
    }
    for (let j = 1; j < cellsY; j++) {
      const y = Math.round(glassY + (gh * j) / cellsY) + 0.5
      ctx.moveTo(glassX, y)
      ctx.lineTo(glassX + gw, y)
    }
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(layout.columns, layout.rows)
  texture.anisotropy = maxAnisotropy
  return texture
}

function Panels({ layout }: { layout: RoofLayout }) {
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy())
  const texture = useMemo(() => (layout.count > 0 ? panelGridTexture(layout, maxAnisotropy) : null), [layout, maxAnisotropy])
  useEffect(() => () => texture?.dispose(), [texture])
  if (!texture) return null
  return (
    <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[layout.columns * (layout.panel.along + PANEL_GAP_M), layout.rows * (layout.panel.down + PANEL_GAP_M)]} />
      <meshStandardMaterial map={texture} metalness={0.2} roughness={0.55} />
    </mesh>
  )
}

/* Mặt mái nghiêng + vùng dùng được + tấm pin, cùng hệ toạ độ trên mặt mái. */
function Roof({ layout }: { layout: RoofLayout }) {
  return (
    <group position={[0, WALL_HEIGHT + rise(layout) / 2, 0]} rotation={[layout.tiltRad, 0, 0]}>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[layout.roof.length, 0.12, layout.roof.slope]} />
        <meshStandardMaterial color={COLORS.roof} />
      </mesh>
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[layout.usable.length, layout.usable.slope]} />
        <meshStandardMaterial color={COLORS.usable} transparent opacity={0.28} />
      </mesh>
      <Panels layout={layout} />
    </group>
  )
}

/* Chữ chỉ hướng trên mặt đất (B, Đ, N, T), vẽ bằng canvas để không phải tải font 3D. */
function Letter({ text, position, size }: { text: string; position: [number, number, number]; size: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = COLORS.letter
    ctx.font = '600 92px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 64, 70)
    const t = new THREE.CanvasTexture(canvas)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [text])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <sprite position={position} scale={[size, size, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  )
}

/* Chữ hướng đặt gần nhà (không theo mép đất) để vẫn nằm trong khung ở góc nhìn từ trên. */
function Ground({ radius, letterRadius }: { radius: number; letterRadius: number }) {
  const r = letterRadius
  const size = Math.max(letterRadius * 0.12, 2)
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial color={COLORS.ground} />
      </mesh>
      <Letter text="B" position={[0, size / 2, -r]} size={size} />
      <Letter text="N" position={[0, size / 2, r]} size={size} />
      <Letter text="Đ" position={[r, size / 2, 0]} size={size} />
      <Letter text="T" position={[-r, size / 2, 0]} size={size} />
    </>
  )
}

/* Điều khiển xoay/phóng to của three.js (không dùng drei) + đặt camera theo góc nhìn đã chọn. */
function Rig({ view, distance, facing, targetY }: { view: RoofView; distance: number; facing: THREE.Vector3; targetY: number }) {
  const camera = useThree((s) => s.camera)
  const dom = useThree((s) => s.gl.domElement)
  const invalidate = useThree((s) => s.invalidate)
  const controlsRef = useRef<OrbitControls | null>(null)

  // Tạo trong effect (không useMemo) vì phải cấu hình và hủy đúng vòng đời của canvas.
  useEffect(() => {
    const controls = new OrbitControls(camera, dom)
    controls.maxPolarAngle = Math.PI / 2 - 0.05
    // Cho tiến sát tới 2 m để soi từng tấm và khe 2 cm, kể cả với tấm rất nhỏ.
    controls.minDistance = 2
    controls.maxDistance = distance * 3
    /*
      Khung 3D cao gần bằng màn hình nên không được nuốt thao tác cuộn trang:
      - chuột: lăn thường thì cuộn trang, Ctrl/Cmd + lăn (cả chụm hai ngón trên touchpad, vốn gửi ctrlKey) mới phóng to;
      - cảm ứng: vuốt dọc để trình duyệt cuộn trang (touch-action: pan-y), kéo ngang để xoay, hai ngón để phóng to.
      Listener capture chạy trước listener wheel của OrbitControls trên cùng phần tử.
    */
    controls.enableZoom = false
    const onWheel = (e: WheelEvent) => {
      controls.enableZoom = e.ctrlKey || e.metaKey
    }
    dom.addEventListener('wheel', onWheel, { capture: true, passive: true })
    // Qua controls.domElement (biến của effect), không gán thẳng vào giá trị lấy từ useThree.
    if (controls.domElement) controls.domElement.style.touchAction = 'pan-y'
    const onChange = () => invalidate()
    controls.addEventListener('change', onChange)
    controlsRef.current = controls
    return () => {
      dom.removeEventListener('wheel', onWheel, { capture: true })
      controls.removeEventListener('change', onChange)
      controls.dispose()
      controlsRef.current = null
    }
  }, [camera, dom, distance, invalidate])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    if (view === 'top') camera.position.set(0, distance * 1.5, 0.01)
    else if (view === 'front') camera.position.copy(facing.clone().multiplyScalar(distance * 1.1).setY(distance * 0.35))
    else camera.position.copy(facing.clone().multiplyScalar(distance * 0.8).add(new THREE.Vector3(-facing.z, 0, facing.x).multiplyScalar(distance * 0.55)).setY(distance * 0.75))
    // Xoay quanh tâm mặt mái (không phải giữa thân nhà): phóng to hết cỡ thì camera tiến về phía tấm pin
    // thay vì chui vào trong khối nhà.
    controls.target.set(0, targetY, 0)
    controls.update()
    invalidate()
  }, [view, distance, facing, targetY, camera, invalidate])

  return null
}

export function RoofScene({ layout, azimuthDegree, view }: { layout: RoofLayout; azimuthDegree: number; view: RoofView }) {
  const theta = (azimuthDegree * Math.PI) / 180
  // Hướng mặt mái quay về trong hệ thế giới (Bắc = -Z, Đông = +X).
  const facing = useMemo(() => new THREE.Vector3(Math.sin(theta), 0, -Math.cos(theta)), [theta])
  const distance = Math.max(layout.roof.length, layout.roof.slope) * 1.3 + 10

  return (
    <Canvas frameloop="demand" dpr={[1, 2]} camera={{ fov: 40, near: 0.1, far: distance * 10 }}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[distance * 0.4, distance, distance * 0.3]} intensity={1.5} />
      {/* Mô hình dựng với mặt mái quay về +Z; xoay quanh trục đứng để +Z trùng hướng khách chọn. */}
      <group rotation={[0, Math.PI - theta, 0]}>
        <Building layout={layout} />
        <Roof layout={layout} />
      </group>
      <Ground radius={distance * 0.9} letterRadius={Math.max(layout.roof.length, layout.roof.slope) * 0.62 + 3} />
      <Rig view={view} distance={distance} facing={facing} targetY={WALL_HEIGHT + rise(layout) / 2} />
    </Canvas>
  )
}
