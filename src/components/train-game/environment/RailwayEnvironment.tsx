import React, { useMemo, useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { getGameRailwayCurve } from '../track/trackMath'
import { GAME_STATIONS } from '../../../config/trainGameConfig'

/**
 * ============================================================================
 * VIBRANT CARTOON 3D ENVIRONMENT — SCENIC MEADOW, HORIZON MOUNTAINS & RIVER
 * ============================================================================
 * Features:
 * - Lush cartoon green ground plane with depth patches
 * - Flat sparkling blue stream flowing under the elevated bridge into a meadow pond
 * - Far horizon snow-capped cartoon mountains (guaranteed >25m clearance from all tracks)
 * - Instanced layered pines, round oaks, and cherry trees with strict clearance (>7m)
 * - Embankment telegraph utility poles, trackside boulders, and wildflowers
 * - Quaint low-poly cottages nestled in scenic interior glades
 */

interface CottageProps {
  position: [number, number, number]
  rotationY?: number
  wallColor: string
  roofColor: string
}

const CartoonCottage: React.FC<CottageProps> = ({
  position,
  rotationY = 0,
  wallColor,
  roofColor,
}) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    {/* Foundation */}
    <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
      <boxGeometry args={[4.2, 0.3, 3.4]} />
      <meshStandardMaterial color="#64748B" roughness={0.9} />
    </mesh>

    {/* Main Wall Block */}
    <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.8, 1.9, 3.0]} />
      <meshStandardMaterial color={wallColor} roughness={0.6} />
    </mesh>

    {/* Triangular/Gabled Roof */}
    <mesh position={[0, 2.7, 0]} rotation={[0, 0, 0]} castShadow>
      <coneGeometry args={[2.7, 1.5, 4]} />
      <meshStandardMaterial color={roofColor} roughness={0.4} flatShading />
    </mesh>

    {/* Brick Chimney */}
    <mesh position={[1.0, 2.8, 0.6]} castShadow>
      <boxGeometry args={[0.45, 1.2, 0.45]} />
      <meshStandardMaterial color="#B91C1C" roughness={0.8} />
    </mesh>

    {/* Cozy Wooden Door */}
    <mesh position={[0, 0.85, 1.52]}>
      <boxGeometry args={[0.75, 1.3, 0.08]} />
      <meshStandardMaterial color="#78350F" roughness={0.6} />
    </mesh>

    {/* Warm Lit Windows */}
    <mesh position={[-1.0, 1.2, 1.52]}>
      <boxGeometry args={[0.65, 0.65, 0.06]} />
      <meshStandardMaterial
        color="#FEF08A"
        emissive="#FEF08A"
        emissiveIntensity={1.2}
      />
    </mesh>
    <mesh position={[1.0, 1.2, 1.52]}>
      <boxGeometry args={[0.65, 0.65, 0.06]} />
      <meshStandardMaterial
        color="#FEF08A"
        emissive="#FEF08A"
        emissiveIntensity={1.2}
      />
    </mesh>
  </group>
)

export const RailwayEnvironment: React.FC = () => {
  const pineTreesRef = useRef<THREE.InstancedMesh>(null)
  const roundTreesRef = useRef<THREE.InstancedMesh>(null)
  const cherryTreesRef = useRef<THREE.InstancedMesh>(null)
  const rocksRef = useRef<THREE.InstancedMesh>(null)
  const redFlowersRef = useRef<THREE.InstancedMesh>(null)
  const yellowFlowersRef = useRef<THREE.InstancedMesh>(null)
  const telegraphsRef = useRef<THREE.InstancedMesh>(null)

  // Procedural environment element transforms along the track corridor
  const {
    pineMatrices,
    roundTreeMatrices,
    cherryMatrices,
    rockMatrices,
    redFlowerMatrices,
    yellowFlowerMatrices,
    telegraphMatrices,
  } = useMemo(() => {
    const curve = getGameRailwayCurve()
    const pines: THREE.Matrix4[] = []
    const roundTrees: THREE.Matrix4[] = []
    const cherryTrees: THREE.Matrix4[] = []
    const rocks: THREE.Matrix4[] = []
    const redFlowers: THREE.Matrix4[] = []
    const yellowFlowers: THREE.Matrix4[] = []
    const telegraphs: THREE.Matrix4[] = []

    const dummy = new THREE.Object3D()
    const samples = 180

    for (let i = 0; i <= samples; i++) {
      const t = i / samples
      const pt = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()

      // Pseudo-random deterministic offsets
      const seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453
      const side = i % 2 === 0 ? 1 : -1

      // 1. Check Station Proximity to guarantee platform & stopping clearance (>10m around stations)
      const isNearStation = GAME_STATIONS.some(
        (stn) => Math.abs(t - stn.trackProgress) < 0.042
      )

      // 2. Trees (Strict clearance > 7.0m from track centerline, > 11m near stations)
      if (!isNearStation) {
        const minDistance = 7.2 + Math.abs(seed % 14)
        const treeX = pt.x + normal.x * minDistance * side
        const treeZ = pt.z + normal.z * minDistance * side
        const treeY = pt.y

        dummy.position.set(treeX, treeY, treeZ)
        const scale = 0.85 + Math.abs((seed * 3) % 0.65)
        dummy.scale.set(scale, scale, scale)
        dummy.rotation.y = Math.abs(seed * 5) % Math.PI
        dummy.updateMatrix()

        if (i % 3 === 0) {
          pines.push(dummy.matrix.clone())
        } else if (i % 3 === 1) {
          roundTrees.push(dummy.matrix.clone())
        } else {
          cherryTrees.push(dummy.matrix.clone())
        }
      }

      // 3. Trackside Boulders (safely 3.8m outside rail gauge)
      if (i % 4 === 0 && !isNearStation) {
        const rockX = pt.x + normal.x * (3.8 + Math.abs(seed % 2.5)) * -side
        const rockZ = pt.z + normal.z * (3.8 + Math.abs(seed % 2.5)) * -side
        dummy.position.set(rockX, pt.y + 0.1, rockZ)
        const rockScale = 0.45 + Math.abs((seed * 7) % 0.4)
        dummy.scale.set(rockScale, rockScale * 0.7, rockScale)
        dummy.updateMatrix()
        rocks.push(dummy.matrix.clone())
      }

      // 4. Wildflower Patches along track verges
      if (i % 2 === 0 && !isNearStation) {
        const flX = pt.x + normal.x * (2.4 + (Math.abs(seed) % 1.2)) * side
        const flZ = pt.z + normal.z * (2.4 + (Math.abs(seed) % 1.2)) * side
        dummy.position.set(flX, pt.y + 0.08, flZ)
        dummy.scale.set(0.28, 0.28, 0.28)
        dummy.rotation.y = Math.abs(seed * 2)
        dummy.updateMatrix()

        if (i % 4 === 0) {
          redFlowers.push(dummy.matrix.clone())
        } else {
          yellowFlowers.push(dummy.matrix.clone())
        }
      }

      // 5. Telegraph Poles along the railway embankment (every ~7 samples on inland side)
      if (i % 7 === 0 && !isNearStation) {
        const poleX = pt.x - normal.x * 3.4
        const poleZ = pt.z - normal.z * 3.4
        dummy.position.set(poleX, pt.y, poleZ)
        const angle = Math.atan2(tangent.x, tangent.z)
        dummy.rotation.set(0, angle, 0)
        dummy.scale.set(1, 1, 1)
        dummy.updateMatrix()
        telegraphs.push(dummy.matrix.clone())
      }
    }

    return {
      pineMatrices: pines,
      roundTreeMatrices: roundTrees,
      cherryMatrices: cherryTrees,
      rockMatrices: rocks,
      redFlowerMatrices: redFlowers,
      yellowFlowerMatrices: yellowFlowers,
      telegraphMatrices: telegraphs,
    }
  }, [])

  useLayoutEffect(() => {
    if (pineTreesRef.current) {
      pineMatrices.forEach((matrix, i) => pineTreesRef.current!.setMatrixAt(i, matrix))
      pineTreesRef.current.instanceMatrix.needsUpdate = true
    }
    if (roundTreesRef.current) {
      roundTreeMatrices.forEach((matrix, i) => roundTreesRef.current!.setMatrixAt(i, matrix))
      roundTreesRef.current.instanceMatrix.needsUpdate = true
    }
    if (cherryTreesRef.current) {
      cherryMatrices.forEach((matrix, i) => cherryTreesRef.current!.setMatrixAt(i, matrix))
      cherryTreesRef.current.instanceMatrix.needsUpdate = true
    }
    if (rocksRef.current) {
      rockMatrices.forEach((matrix, i) => rocksRef.current!.setMatrixAt(i, matrix))
      rocksRef.current.instanceMatrix.needsUpdate = true
    }
    if (redFlowersRef.current) {
      redFlowerMatrices.forEach((matrix, i) => redFlowersRef.current!.setMatrixAt(i, matrix))
      redFlowersRef.current.instanceMatrix.needsUpdate = true
    }
    if (yellowFlowersRef.current) {
      yellowFlowerMatrices.forEach((matrix, i) => yellowFlowersRef.current!.setMatrixAt(i, matrix))
      yellowFlowersRef.current.instanceMatrix.needsUpdate = true
    }
    if (telegraphsRef.current) {
      telegraphMatrices.forEach((matrix, i) => telegraphsRef.current!.setMatrixAt(i, matrix))
      telegraphsRef.current.instanceMatrix.needsUpdate = true
    }
  }, [
    pineMatrices,
    roundTreeMatrices,
    cherryMatrices,
    rockMatrices,
    redFlowerMatrices,
    yellowFlowerMatrices,
    telegraphMatrices,
  ])

  // Flat 2D River Ribbon Geometry at ground level (Y = 0.02m)
  // Crosses UNDER the elevated bridge at (78, 0.02, 0) where track is elevated at Y = 2.8m!
  const riverGeometry = useMemo(() => {
    const riverPoints = [
      new THREE.Vector3(120, 0.02, -25), // Far east outside loop
      new THREE.Vector3(98, 0.02, -12),
      new THREE.Vector3(78, 0.02, 0),     // Exactly under the elevated Station 3 bridge
      new THREE.Vector3(62, 0.02, 8),
      new THREE.Vector3(45, 0.02, 6),
      new THREE.Vector3(32, 0.02, -5),    // Entering tranquil meadow pond
    ]
    const riverCurve = new THREE.CatmullRomCurve3(riverPoints, false, 'centripetal', 0.5)

    const segments = 40
    const halfWidth = 2.6
    const vertices: number[] = []
    const indices: number[] = []
    const uvs: number[] = []

    for (let i = 0; i <= segments; i++) {
      const u = i / segments
      const pt = riverCurve.getPointAt(u)
      const tangent = riverCurve.getTangentAt(u).normalize()
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize()

      // Left vertex
      vertices.push(pt.x + normal.x * halfWidth, 0.02, pt.z + normal.z * halfWidth)
      uvs.push(0, u)

      // Right vertex
      vertices.push(pt.x - normal.x * halfWidth, 0.02, pt.z - normal.z * halfWidth)
      uvs.push(1, u)

      if (i < segments) {
        const base = i * 2
        indices.push(base, base + 1, base + 2)
        indices.push(base + 1, base + 3, base + 2)
      }
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geom.setIndex(indices)
    geom.computeVertexNormals()
    return geom
  }, [])

  return (
    <group>
      {/* ==================================================================
          1. LUSH MEADOW GROUND (Vibrant Cartoon Green with Layered Patches)
          ================================================================== */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[290, 290]} />
        <meshStandardMaterial color="#55B938" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* Grassy Meadow Depth Patches */}
      <mesh position={[20, -0.03, -15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[45, 32]} />
        <meshStandardMaterial color="#66C844" roughness={0.9} />
      </mesh>
      <mesh position={[-35, -0.03, 25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[42, 32]} />
        <meshStandardMaterial color="#4CAF30" roughness={0.9} />
      </mesh>

      {/* ==================================================================
          2. FLAT SPARKLING BLUE RIVER & CENTRAL MEADOW POND
          ================================================================== */}
      {/* Flat River Stream flowing under bridge */}
      <mesh geometry={riverGeometry} receiveShadow>
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.15}
          metalness={0.3}
          emissive="#0284C7"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Central Meadow Pond */}
      <mesh position={[30, 0.02, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[11, 32]} />
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.15}
          metalness={0.3}
          emissive="#0284C7"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* ==================================================================
          3. SCENIC HORIZON MOUNTAINS (Pushed safely >25m beyond track bounds)
          ================================================================== */}
      <group>
        {/* North Mountain Range (Z = -125m) */}
        <group position={[0, 10, -125]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[28, 26, 7]} />
            <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 9.5, 0]}>
            <coneGeometry args={[11, 8.5, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        <group position={[-70, 9, -125]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[26, 24, 6]} />
            <meshStandardMaterial color="#1E3A8A" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 8.5, 0]}>
            <coneGeometry args={[10, 7.5, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        <group position={[70, 9, -125]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[26, 24, 7]} />
            <meshStandardMaterial color="#0F766E" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 8.5, 0]}>
            <coneGeometry args={[10, 7.5, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        {/* South Mountain Range (Z = +125m) */}
        <group position={[-55, 10, 125]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[28, 26, 6]} />
            <meshStandardMaterial color="#4338CA" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 9.5, 0]}>
            <coneGeometry args={[11, 8.5, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        <group position={[55, 10, 125]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[28, 26, 7]} />
            <meshStandardMaterial color="#475569" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 9.5, 0]}>
            <coneGeometry args={[11, 8.5, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        <group position={[0, 11, 130]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[30, 28, 7]} />
            <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 10.5, 0]}>
            <coneGeometry args={[12, 9.0, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        {/* West Mountain (X = -130m) */}
        <group position={[-130, 9, 0]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[28, 25, 7]} />
            <meshStandardMaterial color="#1E293B" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 9.0, 0]}>
            <coneGeometry args={[11, 8.0, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        {/* East Mountain (X = +130m) */}
        <group position={[130, 9, 0]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[28, 25, 7]} />
            <meshStandardMaterial color="#065F46" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 9.0, 0]}>
            <coneGeometry args={[11, 8.0, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>
      </group>

      {/* ==================================================================
          4. CHARMING VILLAGE COTTAGES (In central scenic glades)
          ================================================================== */}
      <CartoonCottage
        position={[-30, 0, -38]}
        rotationY={0.6}
        wallColor="#FFFBEB"
        roofColor="#EF4444"
      />
      <CartoonCottage
        position={[-36, 0, -36]}
        rotationY={-0.4}
        wallColor="#E0F2FE"
        roofColor="#F97316"
      />
      <CartoonCottage
        position={[25, 0, 38]}
        rotationY={2.2}
        wallColor="#FEF3C7"
        roofColor="#3B82F6"
      />
      <CartoonCottage
        position={[32, 0, 42]}
        rotationY={1.8}
        wallColor="#F0FDF4"
        roofColor="#8B5CF6"
      />
      <CartoonCottage
        position={[-15, 0, 35]}
        rotationY={-1.2}
        wallColor="#FFF1F2"
        roofColor="#10B981"
      />

      {/* ==================================================================
          5. INSTANCED PROCEDURAL VEGETATION & ASSETS
          ================================================================== */}
      {/* 5a. Layered Cartoon Alpine Pines */}
      <instancedMesh
        ref={pineTreesRef}
        args={[undefined, undefined, pineMatrices.length]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[1.5, 3.8, 5]} />
        <meshStandardMaterial color="#15803D" roughness={0.7} flatShading />
      </instancedMesh>

      {/* 5b. Round Deciduous Forest Oaks */}
      <instancedMesh
        ref={roundTreesRef}
        args={[undefined, undefined, roundTreeMatrices.length]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1.7, 7, 7]} />
        <meshStandardMaterial color="#22C55E" roughness={0.75} flatShading />
      </instancedMesh>

      {/* 5c. Blossoming Pink Cherry Trees */}
      <instancedMesh
        ref={cherryTreesRef}
        args={[undefined, undefined, cherryMatrices.length]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1.6, 7, 7]} />
        <meshStandardMaterial color="#F472B6" roughness={0.65} flatShading />
      </instancedMesh>

      {/* 5d. Trackside Boulders */}
      <instancedMesh
        ref={rocksRef}
        args={[undefined, undefined, rockMatrices.length]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#64748B" roughness={0.9} flatShading />
      </instancedMesh>

      {/* 5e. Wildflowers (Red) */}
      <instancedMesh
        ref={redFlowersRef}
        args={[undefined, undefined, redFlowerMatrices.length]}
      >
        <sphereGeometry args={[0.22, 6, 6]} />
        <meshStandardMaterial color="#EF4444" roughness={0.5} />
      </instancedMesh>

      {/* 5f. Wildflowers (Yellow) */}
      <instancedMesh
        ref={yellowFlowersRef}
        args={[undefined, undefined, yellowFlowerMatrices.length]}
      >
        <sphereGeometry args={[0.22, 6, 6]} />
        <meshStandardMaterial color="#FACC15" roughness={0.5} />
      </instancedMesh>

      {/* 5g. Embankment Telegraph Poles */}
      <instancedMesh
        ref={telegraphsRef}
        args={[undefined, undefined, telegraphMatrices.length]}
        castShadow
      >
        <cylinderGeometry args={[0.07, 0.09, 3.8, 8]} />
        <meshStandardMaterial color="#5C3D28" roughness={0.8} />
      </instancedMesh>
    </group>
  )
}

export default RailwayEnvironment
