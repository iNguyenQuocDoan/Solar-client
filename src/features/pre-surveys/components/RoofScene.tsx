import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
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
/** Quá số này thì vẽ cả vùng tấm thành một mặt phẳng, tránh treo máy với tấm quá nhỏ. */
const MAX_INSTANCES = 5000
const COLORS = {
  wall: '#d5d9cf',
  roof: '#9fa79c',
  usable: '#0d5c3a',
  panel: '#1f2b40',
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

function Panels({ layout }: { layout: RoofLayout }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const { columns, rows, panel, count } = layout
  const spanX = columns * panel.along + Math.max(columns - 1, 0) * PANEL_GAP_M
  const spanZ = rows * panel.down + Math.max(rows - 1, 0) * PANEL_GAP_M
  const instanced = count > 0 && count <= MAX_INSTANCES

  useLayoutEffect(() => {
    const mesh = ref.current
    if (!mesh || !instanced) return
    const matrix = new THREE.Matrix4()
    let i = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        matrix.makeTranslation(
          -spanX / 2 + panel.along / 2 + c * (panel.along + PANEL_GAP_M),
          0.17,
          -spanZ / 2 + panel.down / 2 + r * (panel.down + PANEL_GAP_M),
        )
        mesh.setMatrixAt(i++, matrix)
      }
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [instanced, rows, columns, panel, spanX, spanZ])

  if (count === 0) return null
  if (!instanced) {
    return (
      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[spanX, spanZ]} />
        <meshStandardMaterial color={COLORS.panel} />
      </mesh>
    )
  }
  return (
    // key theo số tấm: InstancedMesh cố định số bản sao lúc tạo.
    <instancedMesh key={count} ref={ref} args={[undefined, undefined, count]}>
      <boxGeometry args={[panel.along, 0.04, panel.down]} />
      <meshStandardMaterial color={COLORS.panel} metalness={0.3} roughness={0.45} />
    </instancedMesh>
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
function Rig({ view, distance, facing }: { view: RoofView; distance: number; facing: THREE.Vector3 }) {
  const camera = useThree((s) => s.camera)
  const dom = useThree((s) => s.gl.domElement)
  const invalidate = useThree((s) => s.invalidate)
  const controlsRef = useRef<OrbitControls | null>(null)

  // Tạo trong effect (không useMemo) vì phải cấu hình và hủy đúng vòng đời của canvas.
  useEffect(() => {
    const controls = new OrbitControls(camera, dom)
    controls.maxPolarAngle = Math.PI / 2 - 0.05
    controls.minDistance = distance * 0.25
    controls.maxDistance = distance * 3
    const onChange = () => invalidate()
    controls.addEventListener('change', onChange)
    controlsRef.current = controls
    return () => {
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
    controls.target.set(0, WALL_HEIGHT / 2, 0)
    controls.update()
    invalidate()
  }, [view, distance, facing, camera, invalidate])

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
      <Rig view={view} distance={distance} facing={facing} />
    </Canvas>
  )
}
