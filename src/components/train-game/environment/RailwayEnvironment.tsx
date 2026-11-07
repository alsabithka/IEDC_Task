import React, { useMemo, useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { getGameRailwayCurve } from '../track/trackMath'
import { GAME_STATIONS } from '../../../config/trainGameConfig'

interface CottageProps {
  position: [number, number, number]
  rotationY: number
  wallColor: string
  roofColor: string
}

const CartoonCottage: React.FC<CottageProps> = ({
  position,
  rotationY,
  wallColor,
  roofColor,
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* House Main Body */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 2.2, 2.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Pitched Roof */}
      <mesh position={[0, 2.65, 0]} castShadow>
        <coneGeometry args={[2.3, 1.3, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.5} flatShading />
      </mesh>

      {/* Chimney */}
      <mesh position={[0.7, 3.1, -0.4]} castShadow>
        <boxGeometry args={[0.35, 0.9, 0.35]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.8} />
      </mesh>

      {/* Cartoon Smoke Puff */}
      <mesh position={[0.7, 3.75, -0.4]}>
        <sphereGeometry args={[0.22, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>
      <mesh position={[0.85, 4.15, -0.3]}>
        <sphereGeometry args={[0.32, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
      </mesh>

      {/* Front Door */}
      <mesh position={[0, 0.65, 1.22]}>
        <planeGeometry args={[0.65, 1.2]} />
        <meshStandardMaterial color="#78350F" roughness={0.6} />
      </mesh>

      {/* Front Window with Warm Light */}
      <mesh position={[-0.8, 1.3, 1.22]}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshStandardMaterial color="#FDE047" emissive="#FDE047" emissiveIntensity={0.6} />
      </mesh>

      {/* Side Window */}
      <mesh position={[1.42, 1.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshStandardMaterial color="#FDE047" emissive="#FDE047" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

export const RailwayEnvironment: React.FC = () => {
  const pineTreesRef = useRef<THREE.InstancedMesh>(null)
  const roundTreesRef = useRef<THREE.InstancedMesh>(null)
  const cherryTreesRef = useRef<THREE.InstancedMesh>(null)
  const rocksRef = useRef<THREE.InstancedMesh>(null)
  const redFlowersRef = useRef<THREE.InstancedMesh>(null)
  const yellowFlowersRef = useRef<THREE.InstancedMesh>(null)
  const telegraphPolesRef = useRef<THREE.InstancedMesh>(null)

  // Generate deterministic environmental scatter with GUARANTEED clearance
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

    for (let i = 0; i < samples; i++) {
      const t = i / samples
      const pt = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()

      // Pseudo-random deterministic offsets
      const seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453
      const side = i % 2 === 0 ? 1 : -1

      // 1. Check Station Proximity to guarantee platform & stopping clearance
      const isNearStation = GAME_STATIONS.some(
        (stn) => Math.abs(t - stn.trackProgress) < 0.038
      )

      // 2. Trees (Strict clearance > 6.5m from track centerline, > 9m near stations)
      if (!isNearStation) {
        const minDistance = 6.8 + Math.abs(seed % 16)
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
        // Positioned 3.4m on inland side (-normal)
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
    if (telegraphPolesRef.current) {
      telegraphMatrices.forEach((matrix, i) => telegraphPolesRef.current!.setMatrixAt(i, matrix))
      telegraphPolesRef.current.instanceMatrix.needsUpdate = true
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

  // Stylized River Curve winding across the landscape and under the Station 3 Bridge
  const riverGeometry = useMemo(() => {
    const riverPoints = [
      new THREE.Vector3(30, -0.15, -95),
      new THREE.Vector3(55, -0.15, -50),
      new THREE.Vector3(76, -0.15, 10), // Under the high elevated Station 3 Bridge (Y=2.8)
      new THREE.Vector3(68, -0.15, 45),
      new THREE.Vector3(30, -0.15, 85),
      new THREE.Vector3(-10, -0.15, 95),
    ]
    const riverCurve = new THREE.CatmullRomCurve3(riverPoints, false, 'centripetal', 0.5)
    return new THREE.TubeGeometry(riverCurve, 64, 4.5, 10, false)
  }, [])

  return (
    <group>
      {/* ==================================================================
          1. LUSH MEADOW GROUND (Vibrant Cartoon Green with Layered Patches)
          ================================================================== */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[280, 280]} />
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
          2. WINDING BLUE RIVER (Sparkling Stream under Bridge)
          ================================================================== */}
      <mesh geometry={riverGeometry} receiveShadow>
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.15}
          metalness={0.2}
          emissive="#0284C7"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* ==================================================================
          3. BEAUTIFUL MOUNTAINS & ROLLING HILLS (Snow-Capped Peaks)
          ================================================================== */}
      <group>
        {/* North Mountain Range */}
        <group position={[0, 8, -100]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[52, 24, 7]} />
            <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 8.5, 0]}>
            <coneGeometry args={[18, 8.2, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        <group position={[-68, 8, -92]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[44, 22, 6]} />
            <meshStandardMaterial color="#1E3A8A" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 7.8, 0]}>
            <coneGeometry args={[15, 7.2, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        <group position={[72, 8, -88]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[42, 20, 7]} />
            <meshStandardMaterial color="#0F766E" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 7.0, 0]}>
            <coneGeometry args={[14, 6.5, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        {/* South Mountain Range */}
        <group position={[-50, 9, 98]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[48, 22, 6]} />
            <meshStandardMaterial color="#4338CA" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 7.8, 0]}>
            <coneGeometry args={[16, 7.4, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        <group position={[58, 9, 92]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[48, 24, 7]} />
            <meshStandardMaterial color="#3B82F6" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 8.4, 0]}>
            <coneGeometry args={[16, 7.8, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>
      </group>

      {/* ==================================================================
          4. CHARMING VILLAGE COTTAGES (Carefully placed in scenic glades)
          ================================================================== */}
      {/* Northbrook Hamlet (Near North Plains) */}
      <CartoonCottage
        position={[-30, 0, -38]}
        rotationY={0.6}
        wallColor="#FFFBEB"
        roofColor="#EF4444"
      />
      <CartoonCottage
        position={[-38, 0, -42]}
        rotationY={-0.4}
        wallColor="#E0F2FE"
        roofColor="#F97316"
      />

      {/* Southfields Village (Near South Plains) */}
      <CartoonCottage
        position={[25, 0, 38]}
        rotationY={2.2}
        wallColor="#FEF3C7"
        roofColor="#2563EB"
      />
      <CartoonCottage
        position={[34, 0, 44]}
        rotationY={1.7}
        wallColor="#FFF1F2"
        roofColor="#8B5CF6"
      />

      {/* Woodcutter's Clearing (Center Glade) */}
      <CartoonCottage
        position={[-8, 0, 5]}
        rotationY={-1.2}
        wallColor="#ECFDF5"
        roofColor="#EA580C"
      />

      {/* ==================================================================
          5. INSTANCED STYLIZED PINES (Tiered Evergreen)
          ================================================================== */}
      <instancedMesh
        ref={pineTreesRef}
        args={[undefined, undefined, pineMatrices.length]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[1.3, 3.4, 5]} />
        <meshStandardMaterial color="#166534" roughness={0.7} flatShading />
      </instancedMesh>

      {/* ==================================================================
          6. INSTANCED STYLIZED ROUND OAK TREES (Lush Cartoon Green Canopy)
          ================================================================== */}
      <instancedMesh
        ref={roundTreesRef}
        args={[undefined, undefined, roundTreeMatrices.length]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#65A30D" roughness={0.75} flatShading />
      </instancedMesh>

      {/* ==================================================================
          7. INSTANCED BLOSSOMING CHERRY TREES (Soft Pink Canopies)
          ================================================================== */}
      <instancedMesh
        ref={cherryTreesRef}
        args={[undefined, undefined, cherryMatrices.length]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#FB7185" roughness={0.7} flatShading />
      </instancedMesh>

      {/* ==================================================================
          8. INSTANCED TRACKSIDE BOULDERS (Warm Slate Pebble Grey)
          ================================================================== */}
      <instancedMesh
        ref={rocksRef}
        args={[undefined, undefined, rockMatrices.length]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.7} flatShading />
      </instancedMesh>

      {/* ==================================================================
          9. WILDFLOWER BLOOMS (Red Poppies & Yellow Buttercups)
          ================================================================== */}
      <instancedMesh
        ref={redFlowersRef}
        args={[undefined, undefined, redFlowerMatrices.length]}
      >
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#EF4444" roughness={0.5} />
      </instancedMesh>

      <instancedMesh
        ref={yellowFlowersRef}
        args={[undefined, undefined, yellowFlowerMatrices.length]}
      >
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#FACC15" roughness={0.5} />
      </instancedMesh>

      {/* ==================================================================
          10. TELEGRAPH UTILITY POLES (Along Railway Embankment)
          ================================================================== */}
      <instancedMesh
        ref={telegraphPolesRef}
        args={[undefined, undefined, telegraphMatrices.length]}
        castShadow
      >
        <cylinderGeometry args={[0.07, 0.09, 3.2, 8]} />
        <meshStandardMaterial color="#78350F" roughness={0.8} />
      </instancedMesh>
    </group>
  )
}

export default RailwayEnvironment
