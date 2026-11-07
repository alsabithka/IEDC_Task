import React, { useMemo, useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { getGameRailwayCurve } from '../track/trackMath'

export const RailwayEnvironment: React.FC = () => {
  const pineTreesRef = useRef<THREE.InstancedMesh>(null)
  const roundTreesRef = useRef<THREE.InstancedMesh>(null)
  const rocksRef = useRef<THREE.InstancedMesh>(null)

  // Generate deterministic environmental scatter around track
  const { pineMatrices, roundTreeMatrices, rockMatrices, signalPositions } = useMemo(() => {
    const curve = getGameRailwayCurve()
    const pines: THREE.Matrix4[] = []
    const roundTrees: THREE.Matrix4[] = []
    const rocks: THREE.Matrix4[] = []
    const signals: { position: [number, number, number]; rotation: number }[] = []

    const dummy = new THREE.Object3D()
    const samples = 140

    for (let i = 0; i < samples; i++) {
      const t = i / samples
      const pt = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()
      const up = new THREE.Vector3(0, 1, 0)
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()

      // Pseudo-random deterministic offsets based on index
      const seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453
      const side = (i % 2 === 0 ? 1 : -1)
      const distanceOffset = 4.5 + Math.abs(seed % 14)

      const treeX = pt.x + normal.x * distanceOffset * side
      const treeZ = pt.z + normal.z * distanceOffset * side
      const treeY = pt.y // follow local terrain height

      dummy.position.set(treeX, treeY, treeZ)
      const scale = 0.8 + Math.abs((seed * 3) % 0.6)
      dummy.scale.set(scale, scale, scale)
      dummy.rotation.y = Math.abs(seed * 5) % Math.PI
      dummy.updateMatrix()

      if (i % 2 === 0) {
        pines.push(dummy.matrix.clone())
      } else {
        roundTrees.push(dummy.matrix.clone())
      }

      // Add trackside rocks
      if (i % 4 === 0) {
        const rockX = pt.x + normal.x * (2.8 + (Math.abs(seed % 3))) * -side
        const rockZ = pt.z + normal.z * (2.8 + (Math.abs(seed % 3))) * -side
        dummy.position.set(rockX, pt.y + 0.1, rockZ)
        const rockScale = 0.4 + Math.abs((seed * 7) % 0.5)
        dummy.scale.set(rockScale, rockScale * 0.7, rockScale)
        dummy.updateMatrix()
        rocks.push(dummy.matrix.clone())
      }

      // Add Railway Trackside Signals every ~18 sample points
      if (i % 16 === 0) {
        const sigX = pt.x + normal.x * 2.2
        const sigZ = pt.z + normal.z * 2.2
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
  }, [pineMatrices, roundTreeMatrices, rockMatrices])

  return (
    <group>
      {/* 1. Main Ground Plane (Obsidian / Dark Charcoal terrain) */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#080808" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* 2. Surrounding Rolling Hills (Low-poly background topography) */}
      <group>
        {/* North Ridge */}
        <mesh position={[0, 4, -95]} receiveShadow>
          <coneGeometry args={[45, 14, 7]} />
          <meshStandardMaterial color="#111111" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[-60, 5, -85]} receiveShadow>
          <coneGeometry args={[40, 16, 6]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[65, 4, -80]} receiveShadow>
          <coneGeometry args={[38, 12, 7]} />
          <meshStandardMaterial color="#131313" roughness={0.9} flatShading />
        </mesh>

        {/* South Ridge */}
        <mesh position={[-40, 4, 90]} receiveShadow>
          <coneGeometry args={[42, 13, 6]} />
          <meshStandardMaterial color="#101010" roughness={0.9} flatShading />
        </mesh>
        <mesh position={[50, 5, 85]} receiveShadow>
          <coneGeometry args={[48, 15, 7]} />
          <meshStandardMaterial color="#0c0c0c" roughness={0.9} flatShading />
        </mesh>
      </group>

      {/* 3. Instanced Pine Trees (Low-poly stylized cones) */}
      <instancedMesh
        ref={pineTreesRef}
        args={[undefined, undefined, pineMatrices.length]}
        castShadow
        receiveShadow
      >
        <coneGeometry args={[1.2, 3.2, 5]} />
        <meshStandardMaterial color="#1a2421" roughness={0.8} flatShading />
      </instancedMesh>

      {/* 4. Instanced Round Oak Trees (Low-poly dodecahedrons) */}
      <instancedMesh
        ref={roundTreesRef}
        args={[undefined, undefined, roundTreeMatrices.length]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#1e2220" roughness={0.85} flatShading />
      </instancedMesh>

      {/* 5. Instanced Trackside Boulders / Rocks */}
      <instancedMesh
        ref={rocksRef}
        args={[undefined, undefined, rockMatrices.length]}
        castShadow
        receiveShadow
      >
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} flatShading />
      </instancedMesh>

      {/* 6. Railway Trackside Signal Posts */}
      {signalPositions.map((sig, idx) => (
        <group key={`sig-${idx}`} position={sig.position} rotation={[0, sig.rotation, 0]}>
          {/* Post */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 2.8, 12]} />
            <meshStandardMaterial color="#333333" metalness={0.7} />
          </mesh>
          {/* Signal Housing Box */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <boxGeometry args={[0.26, 0.65, 0.22]} />
            <meshStandardMaterial color="#121212" />
          </mesh>
          {/* Green Signal Lens */}
          <mesh position={[0, 2.65, 0.12]}>
            <circleGeometry args={[0.07, 16]} />
            <meshStandardMaterial color="#00FF66" emissive="#00FF66" emissiveIntensity={2.0} />
          </mesh>
          {/* Yellow/Amber Signal Lens */}
          <mesh position={[0, 2.45, 0.12]}>
            <circleGeometry args={[0.06, 16]} />
            <meshStandardMaterial color="#443300" />
          </mesh>
          {/* Red Signal Lens */}
          <mesh position={[0, 2.25, 0.12]}>
            <circleGeometry args={[0.06, 16]} />
            <meshStandardMaterial color="#440000" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default RailwayEnvironment
