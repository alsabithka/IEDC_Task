import React, { useMemo, useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { getGameRailwayCurve } from './trackMath'

export const RailwayTrack: React.FC = () => {
  const sleepersRef = useRef<THREE.InstancedMesh>(null)

  const {
    leftRailGeometry,
    rightRailGeometry,
    ballastGeometry,
    sleeperMatrices,
    bridgePillars,
  } = useMemo(() => {
    const curve = getGameRailwayCurve()
    const samples = 360
    const railOffset = 0.45
    const up = new THREE.Vector3(0, 1, 0)

    const leftPoints: THREE.Vector3[] = []
    const rightPoints: THREE.Vector3[] = []
    const ballastPoints: THREE.Vector3[] = []
    const pillars: { position: [number, number, number]; height: number }[] = []

    for (let i = 0; i < samples; i++) {
      const t = i / samples
      const pt = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()

      leftPoints.push(
        new THREE.Vector3().copy(pt).addScaledVector(normal, railOffset).addScaledVector(up, 0.12)
      )
      rightPoints.push(
        new THREE.Vector3().copy(pt).addScaledVector(normal, -railOffset).addScaledVector(up, 0.12)
      )
      ballastPoints.push(new THREE.Vector3().copy(pt).setY(pt.y + 0.02))

      // Check if track is elevated on a bridge
      if (pt.y > 1.2 && i % 18 === 0) {
        pillars.push({
          position: [pt.x, pt.y / 2, pt.z],
          height: pt.y,
        })
      }
    }

    const leftCurve = new THREE.CatmullRomCurve3(leftPoints, true)
    const rightCurve = new THREE.CatmullRomCurve3(rightPoints, true)
    const ballastCurve = new THREE.CatmullRomCurve3(ballastPoints, true)

    const leftGeom = new THREE.TubeGeometry(leftCurve, 320, 0.05, 8, true)
    const rightGeom = new THREE.TubeGeometry(rightCurve, 320, 0.05, 8, true)
    const ballastGeom = new THREE.TubeGeometry(ballastCurve, 320, 0.72, 8, true)

    // Calculate Sleepers (Ties) Matrices
    const sleeperCount = 200
    const dummy = new THREE.Object3D()
    const matrices: THREE.Matrix4[] = []

    for (let i = 0; i < sleeperCount; i++) {
      const t = i / sleeperCount
      const pt = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()

      dummy.position.set(pt.x, pt.y + 0.06, pt.z)
      const angle = Math.atan2(tangent.x, tangent.z)
      dummy.rotation.set(0, angle, 0)
      dummy.updateMatrix()
      matrices.push(dummy.matrix.clone())
    }

    return {
      leftRailGeometry: leftGeom,
      rightRailGeometry: rightGeom,
      ballastGeometry: ballastGeom,
      sleeperMatrices: matrices,
      bridgePillars: pillars,
    }
  }, [])

  useLayoutEffect(() => {
    if (!sleepersRef.current) return
    sleeperMatrices.forEach((matrix, i) => {
      sleepersRef.current!.setMatrixAt(i, matrix)
    })
    sleepersRef.current.instanceMatrix.needsUpdate = true
  }, [sleeperMatrices])

  return (
    <group>
      {/* 1. Ballast Bed (Dark Gravel Strip) */}
      <mesh geometry={ballastGeometry} receiveShadow>
        <meshStandardMaterial color="#0e0e0e" roughness={0.9} />
      </mesh>

      {/* 2. Instanced Sleepers / Ties */}
      <instancedMesh
        ref={sleepersRef}
        args={[undefined, undefined, sleeperMatrices.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.4, 0.08, 0.28]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.7} />
      </instancedMesh>

      {/* 3. Left Steel Rail (White metallic chrome) */}
      <mesh geometry={leftRailGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#EAEAEA" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* 4. Right Steel Rail (White metallic chrome) */}
      <mesh geometry={rightRailGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#EAEAEA" roughness={0.25} metalness={0.7} />
      </mesh>

      {/* 5. Bridge Concrete Support Pillars */}
      {bridgePillars.map((pillar, idx) => (
        <mesh key={`pillar-${idx}`} position={pillar.position} castShadow receiveShadow>
          <boxGeometry args={[1.8, pillar.height, 1.8]} />
          <meshStandardMaterial color="#222222" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

export default RailwayTrack
