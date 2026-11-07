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
    bridgeGuardrails,
    terminusBufferStop,
    startTrackStop,
  } = useMemo(() => {
    const curve = getGameRailwayCurve()
    const samples = 480 // 1 sample per ~0.91 meters
    const railOffset = 0.48 // Standard model railway gauge
    const railHeight = 0.12 // Height above ballast
    const up = new THREE.Vector3(0, 1, 0)

    const leftPoints: THREE.Vector3[] = []
    const rightPoints: THREE.Vector3[] = []
    const ballastPoints: THREE.Vector3[] = []
    const pillars: { position: [number, number, number]; height: number }[] = []
    const guardrails: { position: [number, number, number]; rotationY: number }[] = []

    for (let i = 0; i <= samples; i++) {
      const t = i / samples
      const pt = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()

      // Left and Right parallel steel rails
      leftPoints.push(
        new THREE.Vector3().copy(pt).addScaledVector(normal, railOffset).addScaledVector(up, railHeight)
      )
      rightPoints.push(
        new THREE.Vector3().copy(pt).addScaledVector(normal, -railOffset).addScaledVector(up, railHeight)
      )

      // Continuous ballast gravel bed beneath tracks
      ballastPoints.push(new THREE.Vector3().copy(pt).setY(Math.max(0.12, pt.y - 0.04)))

      // Elevated bridge support pillars & side guardrails
      if (pt.y > 1.1) {
        if (i % 16 === 0) {
          pillars.push({
            position: [pt.x, pt.y / 2, pt.z],
            height: pt.y,
          })
        }
        if (i % 6 === 0) {
          const angle = Math.atan2(tangent.x, tangent.z)
          guardrails.push({
            position: [pt.x, pt.y + 0.35, pt.z],
            rotationY: angle,
          })
        }
      }
    }

    // Open curves (closed = false) - track physically terminates at endpoints
    const leftCurve = new THREE.CatmullRomCurve3(leftPoints, false, 'centripetal', 0.5)
    const rightCurve = new THREE.CatmullRomCurve3(rightPoints, false, 'centripetal', 0.5)
    const ballastCurve = new THREE.CatmullRomCurve3(ballastPoints, false, 'centripetal', 0.5)

    const leftGeom = new THREE.TubeGeometry(leftCurve, 440, 0.052, 10, false)
    const rightGeom = new THREE.TubeGeometry(rightCurve, 440, 0.052, 10, false)
    const ballastGeom = new THREE.TubeGeometry(ballastCurve, 380, 0.72, 8, false)

    // Calculate Sleepers (Ties) Matrices (300 sleepers along open route)
    const sleeperCount = 300
    const dummy = new THREE.Object3D()
    const matrices: THREE.Matrix4[] = []

    for (let i = 0; i <= sleeperCount; i++) {
      const t = i / sleeperCount
      const pt = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()

      dummy.position.set(pt.x, pt.y + 0.06, pt.z)
      const angle = Math.atan2(tangent.x, tangent.z)
      dummy.rotation.set(0, angle, 0)
      dummy.updateMatrix()
      matrices.push(dummy.matrix.clone())
    }

    // Terminal Buffer Stop at t = 1.0 (End of line)
    const endPt = curve.getPointAt(1.0)
    const endTangent = curve.getTangentAt(1.0).normalize()
    const endAngle = Math.atan2(endTangent.x, endTangent.z)

    // Start Track Stop at t = 0.0 (Track origin behind Station 1)
    const startPt = curve.getPointAt(0.0)
    const startTangent = curve.getTangentAt(0.0).normalize()
    const startAngle = Math.atan2(startTangent.x, startTangent.z)

    return {
      leftRailGeometry: leftGeom,
      rightRailGeometry: rightGeom,
      ballastGeometry: ballastGeom,
      sleeperMatrices: matrices,
      bridgePillars: pillars,
      bridgeGuardrails: guardrails,
      terminusBufferStop: {
        position: [endPt.x, endPt.y, endPt.z] as [number, number, number],
        rotationY: endAngle,
      },
      startTrackStop: {
        position: [startPt.x, startPt.y, startPt.z] as [number, number, number],
        rotationY: startAngle,
      },
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
      {/* 1. Continuous Ballast Gravel Bed */}
      <mesh geometry={ballastGeometry} receiveShadow>
        <meshStandardMaterial color="#78716C" roughness={0.9} />
      </mesh>

      {/* 2. Instanced Sleepers / Ties (Rich Treated Timber Wood) */}
      <instancedMesh
        ref={sleepersRef}
        args={[undefined, undefined, sleeperMatrices.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.48, 0.09, 0.28]} />
        <meshStandardMaterial color="#5C3D28" roughness={0.7} />
      </instancedMesh>

      {/* 3. Left Continuous Steel Rail */}
      <mesh geometry={leftRailGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#F8FAFC" roughness={0.18} metalness={0.85} />
      </mesh>

      {/* 4. Right Continuous Steel Rail */}
      <mesh geometry={rightRailGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#F8FAFC" roughness={0.18} metalness={0.85} />
      </mesh>

      {/* 5. Start of Track Buffer Stop (t = 0.0) */}
      <group
        position={startTrackStop.position}
        rotation={[0, startTrackStop.rotationY, 0]}
      >
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.5, 0.35, 0.2]} />
          <meshStandardMaterial color="#475569" roughness={0.6} />
        </mesh>
      </group>

      {/* 6. Grand Terminus Hydraulic Buffer Stop at End of Line (t = 1.0) */}
      <group
        position={terminusBufferStop.position}
        rotation={[0, terminusBufferStop.rotationY, 0]}
      >
        {/* Steel A-Frame Heavy Support Posts */}
        <mesh position={[-0.48, 0.55, 0]} castShadow>
          <boxGeometry args={[0.16, 1.1, 0.16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>
        <mesh position={[0.48, 0.55, 0]} castShadow>
          <boxGeometry args={[0.16, 1.1, 0.16]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} />
        </mesh>

        {/* Diagonal Steel Buttresses */}
        <mesh position={[-0.48, 0.45, 0.35]} rotation={[0.45, 0, 0]} castShadow>
          <boxGeometry args={[0.12, 0.95, 0.12]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        <mesh position={[0.48, 0.45, 0.35]} rotation={[0.45, 0, 0]} castShadow>
          <boxGeometry args={[0.12, 0.95, 0.12]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>

        {/* Hydraulic Pistons Aligned with Train Buffers */}
        <mesh position={[-0.48, 0.65, -0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.45, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.48, 0.65, -0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.45, 16]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Heavy Wooden Buffer Beam with Yellow/Black Hazard Pattern */}
        <mesh position={[0, 0.65, -0.42]} castShadow>
          <boxGeometry args={[1.56, 0.38, 0.18]} />
          <meshStandardMaterial color="#FACC15" roughness={0.4} />
        </mesh>
        <mesh position={[-0.45, 0.65, -0.52]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.12, 0.36, 0.02]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0, 0.65, -0.52]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.12, 0.36, 0.02]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0.45, 0.65, -0.52]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.12, 0.36, 0.02]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>

        {/* Red Terminal Lamp on Top */}
        <mesh position={[0, 1.25, -0.35]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={3.0}
          />
        </mesh>
      </group>

      {/* 7. Bridge Rustic Masonry Pillars with Coping Caps */}
      {bridgePillars.map((pillar, idx) => (
        <group key={`pillar-${idx}`} position={pillar.position}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.0, pillar.height, 2.0]} />
            <meshStandardMaterial color="#991B1B" roughness={0.75} />
          </mesh>
          <mesh position={[0, pillar.height / 2 + 0.06, 0]}>
            <boxGeometry args={[2.2, 0.14, 2.2]} />
            <meshStandardMaterial color="#F1F5F9" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* 8. Elevated Bridge Side Safety Guardrails */}
      {bridgeGuardrails.map((gr, idx) => (
        <group key={`guard-${idx}`} position={gr.position} rotation={[0, gr.rotationY, 0]}>
          <mesh position={[-0.95, 0, 0]} castShadow>
            <boxGeometry args={[0.08, 0.55, 0.08]} />
            <meshStandardMaterial color="#FACC15" roughness={0.4} />
          </mesh>
          <mesh position={[0.95, 0, 0]} castShadow>
            <boxGeometry args={[0.08, 0.55, 0.08]} />
            <meshStandardMaterial color="#FACC15" roughness={0.4} />
          </mesh>
          <mesh position={[-0.95, 0.25, 0]}>
            <boxGeometry args={[0.06, 0.06, 0.95]} />
            <meshStandardMaterial color="#FACC15" roughness={0.4} />
          </mesh>
          <mesh position={[0.95, 0.25, 0]}>
            <boxGeometry args={[0.06, 0.06, 0.95]} />
            <meshStandardMaterial color="#FACC15" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default RailwayTrack
