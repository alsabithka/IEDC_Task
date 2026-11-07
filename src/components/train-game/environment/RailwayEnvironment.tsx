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
      {/* House Body */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 2.2, 2.4]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} />
      </mesh>

      {/* Pitched Roof */}
      <mesh position={[0, 2.65, 0]} rotation={[0, 0, 0]} castShadow>
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
  const rocksRef = useRef<THREE.InstancedMesh>(null)
  const redFlowersRef = useRef<THREE.InstancedMesh>(null)
  const yellowFlowersRef = useRef<THREE.InstancedMesh>(null)

  // Generate deterministic environmental scatter around track
  const {
    pineMatrices,
    roundTreeMatrices,
    rockMatrices,
    redFlowerMatrices,
    yellowFlowerMatrices,
    signalPositions,
  } = useMemo(() => {
    const curve = getGameRailwayCurve()
    const pines: THREE.Matrix4[] = []
    const roundTrees: THREE.Matrix4[] = []
    const rocks: THREE.Matrix4[] = []
    const redFlowers: THREE.Matrix4[] = []
    const yellowFlowers: THREE.Matrix4[] = []
    const signals: { position: [number, number, number]; rotation: number }[] = []

    const dummy = new THREE.Object3D()
    const samples = 160

    for (let i = 0; i < samples; i++) {
      const t = i / samples
      const pt = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()

      // Pseudo-random deterministic offsets based on index
      const seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453
      const side = (i % 2 === 0 ? 1 : -1)

      // Ensure clearance around station platforms
      const isNearStation = GAME_STATIONS.some(
        (stn) => Math.abs(t - stn.trackProgress) < 0.04
      )

      if (!isNearStation) {
        const distanceOffset = 6.2 + Math.abs(seed % 15)
        const treeX = pt.x + normal.x * distanceOffset * side
        const treeZ = pt.z + normal.z * distanceOffset * side
        const treeY = pt.y

        dummy.position.set(treeX, treeY, treeZ)
        const scale = 0.85 + Math.abs((seed * 3) % 0.65)
        dummy.scale.set(scale, scale, scale)
        dummy.rotation.y = Math.abs(seed * 5) % Math.PI
        dummy.updateMatrix()

        if (i % 2 === 0) {
          pines.push(dummy.matrix.clone())
        } else {
          roundTrees.push(dummy.matrix.clone())
        }
      }

      // Add colorful trackside boulders (outside clearance zone)
      if (i % 3 === 0 && !isNearStation) {
        const rockX = pt.x + normal.x * (3.6 + Math.abs(seed % 3.0)) * -side
        const rockZ = pt.z + normal.z * (3.6 + Math.abs(seed % 3.0)) * -side
        dummy.position.set(rockX, pt.y + 0.1, rockZ)
        const rockScale = 0.45 + Math.abs((seed * 7) % 0.5)
        dummy.scale.set(rockScale, rockScale * 0.7, rockScale)
        dummy.updateMatrix()
        rocks.push(dummy.matrix.clone())
      }

      // Add wildflower patches near track edges
      if (i % 2 === 0) {
        const flX = pt.x + normal.x * (2.1 + (Math.abs(seed) % 1.5)) * side
        const flZ = pt.z + normal.z * (2.1 + (Math.abs(seed) % 1.5)) * side
        dummy.position.set(flX, pt.y + 0.08, flZ)
        dummy.scale.set(0.25, 0.25, 0.25)
        dummy.rotation.y = Math.abs(seed * 2)
        dummy.updateMatrix()

        if (i % 4 === 0) {
          redFlowers.push(dummy.matrix.clone())
        } else {
          yellowFlowers.push(dummy.matrix.clone())
        }
      }

      // Add Railway Trackside Signals every ~18 sample points
      if (i % 16 === 0) {
        const sigX = pt.x + normal.x * 2.3
        const sigZ = pt.z + normal.z * 2.3
        const angle = Math.atan2(tangent.x, tangent.z)
        signals.push({
          position: [sigX, pt.y, sigZ],
          rotation: angle,
        })
      }
    }

    return {
      pineMatrices: pines,
      roundTreeMatrices: roundTrees,
      rockMatrices: rocks,
      redFlowerMatrices: redFlowers,
      yellowFlowerMatrices: yellowFlowers,
      signalPositions: signals,
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
  }, [pineMatrices, roundTreeMatrices, rockMatrices, redFlowerMatrices, yellowFlowerMatrices])

  // Stylized River Curve winding across the landscape
  const riverGeometry = useMemo(() => {
    const riverPoints = [
      new THREE.Vector3(20, -0.15, -90),
      new THREE.Vector3(45, -0.15, -55),
      new THREE.Vector3(72, -0.15, -15), // Under bridge
      new THREE.Vector3(78, -0.15, 15),  // Under bridge
      new THREE.Vector3(60, -0.15, 50),
      new THREE.Vector3(15, -0.15, 85),
    ]
    const riverCurve = new THREE.CatmullRomCurve3(riverPoints, false, 'centripetal', 0.5)
    return new THREE.TubeGeometry(riverCurve, 64, 4.2, 10, false)
  }, [])

  return (
    <group>
      {/* ==================================================================
          1. LUSH MEADOW GROUND (Vibrant Cartoon Green)
          ================================================================== */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[280, 280]} />
        <meshStandardMaterial color="#55B938" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* Varied Grassy Hill Patches (Adds warm green depth) */}
      <mesh position={[15, -0.03, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[42, 32]} />
        <meshStandardMaterial color="#66C844" roughness={0.9} />
      </mesh>
      <mesh position={[-35, -0.03, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[38, 32]} />
        <meshStandardMaterial color="#4CAF30" roughness={0.9} />
      </mesh>

      {/* ==================================================================
          2. WINDING BLUE RIVER (Sparkling Cartoon Stream)
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
        <group position={[0, 7, -98]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[48, 22, 7]} />
            <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
          </mesh>
          {/* Snowy Peak Top */}
          <mesh position={[0, 7.8, 0]}>
            <coneGeometry args={[16, 7.5, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        <group position={[-65, 8, -88]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[42, 20, 6]} />
            <meshStandardMaterial color="#1E3A8A" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 7.2, 0]}>
            <coneGeometry args={[14, 6.8, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        <group position={[70, 7, -85]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[40, 18, 7]} />
            <meshStandardMaterial color="#0F766E" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 6.5, 0]}>
            <coneGeometry args={[13, 6.0, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        {/* South Mountain Range */}
        <group position={[-45, 8, 95]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[45, 20, 6]} />
            <meshStandardMaterial color="#4338CA" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 7.0, 0]}>
            <coneGeometry args={[15, 6.8, 6]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>

        <group position={[55, 9, 90]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[46, 22, 7]} />
            <meshStandardMaterial color="#3B82F6" roughness={0.8} flatShading />
          </mesh>
          <mesh position={[0, 7.8, 0]}>
            <coneGeometry args={[15, 7.2, 7]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.4} flatShading />
          </mesh>
        </group>
      </group>

      {/* ==================================================================
          4. CHARMING CARTOON COTTAGES & HOUSES
          ================================================================== */}
      <CartoonCottage
        position={[-38, 0, -36]}
        rotationY={0.6}
        wallColor="#FFFBEB"
        roofColor="#EF4444"
      />
      <CartoonCottage
        position={[-46, 0, -42]}
        rotationY={-0.4}
        wallColor="#E0F2FE"
        roofColor="#F97316"
      />
      <CartoonCottage
        position={[14, 0, 42]}
        rotationY={2.2}
        wallColor="#FEF3C7"
        roofColor="#2563EB"
      />
      <CartoonCottage
        position={[22, 0, 48]}
        rotationY={1.7}
        wallColor="#FFF1F2"
        roofColor="#8B5CF6"
      />
      <CartoonCottage
        position={[-6, 0, 4]}
        rotationY={-1.2}
        wallColor="#ECFDF5"
        roofColor="#EA580C"
      />

      {/* ==================================================================
          5. INSTANCED PINE TREES (Vibrant Evergreen Emerald)
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
          6. INSTANCED ROUND OAK TREES (Lush Cartoon Canopy)
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
          7. INSTANCED TRACKSIDE BOULDERS (Warm Slate Pebble Grey)
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
          8. WILDFLOWER BLOOMS (Red Poppies & Yellow Buttercups)
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
          9. RAILWAY TRACKSIDE SIGNAL POSTS (Vibrant Yellow Posts & Jewel Lights)
          ================================================================== */}
      {signalPositions.map((sig, idx) => (
        <group key={`sig-${idx}`} position={sig.position} rotation={[0, sig.rotation, 0]}>
          {/* Post (Bright Yellow Safety Post) */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.8, 12]} />
            <meshStandardMaterial color="#FACC15" metalness={0.2} roughness={0.4} />
          </mesh>
          {/* Signal Housing Box */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <boxGeometry args={[0.28, 0.72, 0.22]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
          {/* Green Signal Lens (Glowing Emerald) */}
          <mesh position={[0, 2.68, 0.12]}>
            <circleGeometry args={[0.08, 16]} />
            <meshStandardMaterial
              color="#10B981"
              emissive="#10B981"
              emissiveIntensity={2.5}
            />
          </mesh>
          {/* Yellow/Amber Signal Lens */}
          <mesh position={[0, 2.46, 0.12]}>
            <circleGeometry args={[0.07, 16]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
          {/* Red Signal Lens */}
          <mesh position={[0, 2.24, 0.12]}>
            <circleGeometry args={[0.07, 16]} />
            <meshStandardMaterial color="#7F1D1D" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default RailwayEnvironment
