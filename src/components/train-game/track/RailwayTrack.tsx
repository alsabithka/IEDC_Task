import React, { useMemo, useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { getGameRailwayCurve } from './trackMath'

/**
 * ============================================================================
 * INDIAN RAILWAYS 3D TRACK INFRASTRUCTURE WITH OVERHEAD ELECTRIFICATION (OHE)
 * ============================================================================
 * Features:
 * - Two continuous parallel steel rails with reflective running surface
 * - Pre-Stressed Concrete (PSC) railway sleepers with dark Pandrol spring clips
 * - Continuous gravel-covered dark stone ballast bed
 * - Complete 25KV Overhead Electrification (OHE) infrastructure:
 *   * Heavy galvanized steel portal/cantilever masts on the field side
 *   * Cantilever horizontal tubes, stay arms, and ceramic disc insulators
 *   * Upper continuous messenger wire (catenary cable)
 *   * Lower continuous contact wire (operating at 4.4m height)
 * - Trackside electrical relay cabinets and concrete route/km markers
 * - Elevated bridge masonry piers with yellow safety guardrails
 * - Indian Railways Hydraulic Buffer Stop at Station 8 Terminus (t = 1.0)
 */

export const RailwayTrack: React.FC = () => {
  const sleepersRef = useRef<THREE.InstancedMesh>(null)
  const clipsRef = useRef<THREE.InstancedMesh>(null)
  const oheMastsRef = useRef<THREE.InstancedMesh>(null)

  const {
    leftRailGeometry,
    rightRailGeometry,
    ballastGeometry,
    messengerWireGeometry,
    contactWireGeometry,
    sleeperMatrices,
    clipMatrices,
    oheMastMatrices,
    bridgePillars,
    bridgeGuardrails,
    relayCabinets,
    routeMarkers,
    terminusBufferStop,
    startTrackStop,
  } = useMemo(() => {
    const curve = getGameRailwayCurve()
    const samples = 480 // 1 sample per ~0.91 meters
    const railOffset = 0.48 // Standard model broad gauge (0.96m gauge)
    const railHeight = 0.12 // Height above ballast
    const contactWireHeight = 4.4 // 4.4m above rail level
    const messengerWireHeight = 5.3 // 5.3m above rail level
    const up = new THREE.Vector3(0, 1, 0)

    const leftPoints: THREE.Vector3[] = []
    const rightPoints: THREE.Vector3[] = []
    const ballastPoints: THREE.Vector3[] = []
    const contactPoints: THREE.Vector3[] = []
    const messengerPoints: THREE.Vector3[] = []
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

      // Continuous dark stone ballast bed beneath tracks
      ballastPoints.push(new THREE.Vector3().copy(pt).setY(Math.max(0.12, pt.y - 0.04)))

      // OHE Contact Wire (directly above track centerline)
      contactPoints.push(new THREE.Vector3(pt.x, pt.y + contactWireHeight, pt.z))
      // OHE Messenger Wire (higher catenary cable)
      messengerPoints.push(new THREE.Vector3(pt.x, pt.y + messengerWireHeight, pt.z))

      // Elevated bridge support pillars & side guardrails on bridge spans
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

    // Open curves (closed = false)
    const leftCurve = new THREE.CatmullRomCurve3(leftPoints, false, 'centripetal', 0.5)
    const rightCurve = new THREE.CatmullRomCurve3(rightPoints, false, 'centripetal', 0.5)
    const ballastCurve = new THREE.CatmullRomCurve3(ballastPoints, false, 'centripetal', 0.5)
    const contactCurve = new THREE.CatmullRomCurve3(contactPoints, false, 'centripetal', 0.5)
    const messengerCurve = new THREE.CatmullRomCurve3(messengerPoints, false, 'centripetal', 0.5)

    const leftGeom = new THREE.TubeGeometry(leftCurve, 440, 0.052, 10, false)
    const rightGeom = new THREE.TubeGeometry(rightCurve, 440, 0.052, 10, false)
    const ballastGeom = new THREE.TubeGeometry(ballastCurve, 380, 0.74, 8, false)
    const contactGeom = new THREE.TubeGeometry(contactCurve, 240, 0.016, 6, false)
    const messengerGeom = new THREE.TubeGeometry(messengerCurve, 240, 0.018, 6, false)

    // Calculate Pre-Stressed Concrete Sleepers & Pandrol Clips (310 sleepers)
    const sleeperCount = 310
    const dummySleeper = new THREE.Object3D()
    const dummyClip = new THREE.Object3D()
    const sleeperMats: THREE.Matrix4[] = []
    const clipMats: THREE.Matrix4[] = []

    for (let i = 0; i <= sleeperCount; i++) {
      const t = i / sleeperCount
      const pt = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()
      const angle = Math.atan2(tangent.x, tangent.z)

      // 1. Concrete Sleeper Body
      dummySleeper.position.set(pt.x, pt.y + 0.06, pt.z)
      dummySleeper.rotation.set(0, angle, 0)
      dummySleeper.updateMatrix()
      sleeperMats.push(dummySleeper.matrix.clone())

      // 2. Left & Right Pandrol Spring Fastening Clips
      const leftClipPos = new THREE.Vector3().copy(pt).addScaledVector(normal, railOffset).addScaledVector(up, 0.12)
      dummyClip.position.copy(leftClipPos)
      dummyClip.rotation.set(0, angle, 0)
      dummyClip.updateMatrix()
      clipMats.push(dummyClip.matrix.clone())

      const rightClipPos = new THREE.Vector3().copy(pt).addScaledVector(normal, -railOffset).addScaledVector(up, 0.12)
      dummyClip.position.copy(rightClipPos)
      dummyClip.rotation.set(0, angle, 0)
      dummyClip.updateMatrix()
      clipMats.push(dummyClip.matrix.clone())
    }

    // Overhead Electrification (OHE) Masts & Trackside Equipment (24 masts, every ~18 meters)
    const oheCount = 24
    const dummyMast = new THREE.Object3D()
    const mastMats: THREE.Matrix4[] = []
    const cabinets: { position: [number, number, number]; rotationY: number }[] = []
    const markers: { position: [number, number, number]; rotationY: number; label: string }[] = []

    for (let i = 0; i <= oheCount; i++) {
      const t = i / oheCount
      const pt = curve.getPointAt(t)
      const tangent = curve.getTangentAt(t).normalize()
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()
      const angle = Math.atan2(tangent.x, tangent.z)

      // Mast positioned on field side (-normal * 2.5m, opposite the passenger platform)
      const mastX = pt.x - normal.x * 2.5
      const mastZ = pt.z - normal.z * 2.5
      dummyMast.position.set(mastX, pt.y, mastZ)
      dummyMast.rotation.set(0, angle, 0)
      dummyMast.updateMatrix()
      mastMats.push(dummyMast.matrix.clone())

      // Trackside electrical relay cabinets every 4th mast
      if (i % 4 === 1) {
        cabinets.push({
          position: [pt.x - normal.x * 2.1, pt.y, pt.z - normal.z * 2.1],
          rotationY: angle,
        })
      }

      // Concrete Route / KM markers every 3rd mast
      if (i % 3 === 0) {
        markers.push({
          position: [pt.x - normal.x * 1.8, pt.y, pt.z - normal.z * 1.8],
          rotationY: angle,
          label: `KM ${i * 2}`,
        })
      }
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
      messengerWireGeometry: messengerGeom,
      contactWireGeometry: contactGeom,
      sleeperMatrices: sleeperMats,
      clipMatrices: clipMats,
      oheMastMatrices: mastMats,
      bridgePillars: pillars,
      bridgeGuardrails: guardrails,
      relayCabinets: cabinets,
      routeMarkers: markers,
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
    if (sleepersRef.current) {
      sleeperMatrices.forEach((matrix, i) => sleepersRef.current!.setMatrixAt(i, matrix))
      sleepersRef.current.instanceMatrix.needsUpdate = true
    }
    if (clipsRef.current) {
      clipMatrices.forEach((matrix, i) => clipsRef.current!.setMatrixAt(i, matrix))
      clipsRef.current.instanceMatrix.needsUpdate = true
    }
    if (oheMastsRef.current) {
      oheMastMatrices.forEach((matrix, i) => oheMastsRef.current!.setMatrixAt(i, matrix))
      oheMastsRef.current.instanceMatrix.needsUpdate = true
    }
  }, [sleeperMatrices, clipMatrices, oheMastMatrices])

  return (
    <group>
      {/* 1. Continuous Dark Stone Gravel Ballast Bed */}
      <mesh geometry={ballastGeometry} receiveShadow>
        <meshStandardMaterial color="#57534E" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* 2. Pre-Stressed Concrete (PSC) Sleepers (Indian Railways Weathered Concrete) */}
      <instancedMesh
        ref={sleepersRef}
        args={[undefined, undefined, sleeperMatrices.length]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1.52, 0.12, 0.26]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.8} />
      </instancedMesh>

      {/* 3. Dark Steel Pandrol Rail Fastening Spring Clips */}
      <instancedMesh
        ref={clipsRef}
        args={[undefined, undefined, clipMatrices.length]}
      >
        <boxGeometry args={[0.08, 0.04, 0.12]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
      </instancedMesh>

      {/* 4. Left Continuous Steel Rail (Polished Steel with Reflective Head) */}
      <mesh geometry={leftRailGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#F1F5F9" roughness={0.15} metalness={0.9} />
      </mesh>

      {/* 5. Right Continuous Steel Rail */}
      <mesh geometry={rightRailGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#F1F5F9" roughness={0.15} metalness={0.9} />
      </mesh>

      {/* ==================================================================
          6. OVERHEAD ELECTRIFICATION (OHE) CATENARY SYSTEM
          ================================================================== */}
      {/* 6a. Upper Continuous Messenger Wire (Catenary Cable) */}
      <mesh geometry={messengerWireGeometry}>
        <meshStandardMaterial color="#64748B" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* 6b. Lower Continuous Contact Wire (Operating Wire at 4.4m height) */}
      <mesh geometry={contactWireGeometry}>
        <meshStandardMaterial color="#D97706" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* 6c. Instanced Steel Electrification Masts (H-Beam Steel Mast) */}
      <instancedMesh
        ref={oheMastsRef}
        args={[undefined, undefined, oheMastMatrices.length]}
        castShadow
      >
        <group>
          {/* Main Vertical H-Beam Mast Post (Height 6.4m) */}
          <mesh position={[0, 3.2, 0]}>
            <boxGeometry args={[0.18, 6.4, 0.22]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.7} roughness={0.4} />
          </mesh>
          {/* Concrete Footing Foundation at Base */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.48, 0.6, 0.48]} />
            <meshStandardMaterial color="#64748B" roughness={0.9} />
          </mesh>
          {/* Horizontal Cantilever Arm Extending 2.5m Towards Track Centerline */}
          <mesh position={[1.25, 5.3, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[2.5, 0.08, 0.08]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.7} />
          </mesh>
          {/* Diagonal Strut Tube */}
          <mesh position={[0.9, 4.8, 0]} rotation={[0, 0, -0.45]}>
            <boxGeometry args={[1.8, 0.06, 0.06]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.7} />
          </mesh>
          {/* Brown Ceramic Disc Insulator Stack */}
          <mesh position={[2.4, 5.1, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.45, 12]} />
            <meshStandardMaterial color="#9A3412" roughness={0.3} metalness={0.1} />
          </mesh>
          {/* Vertical Dropper Wire to Contact Wire */}
          <mesh position={[2.5, 4.85, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.9, 6]} />
            <meshStandardMaterial color="#D97706" metalness={0.8} />
          </mesh>
        </group>
      </instancedMesh>

      {/* ==================================================================
          7. TRACKSIDE ELECTRICAL RELAY CABINETS & ROUTE MARKERS
          ================================================================== */}
      {relayCabinets.map((cab, idx) => (
        <group key={`relay-${idx}`} position={cab.position} rotation={[0, cab.rotationY, 0]}>
          {/* Concrete Base */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.8, 0.4, 0.6]} />
            <meshStandardMaterial color="#64748B" roughness={0.9} />
          </mesh>
          {/* Galvanized Silver-Grey Relay Cabinet */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[0.65, 1.0, 0.45]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Yellow Hazard Warning Triangle Plate */}
          <mesh position={[0, 1.0, 0.23]}>
            <planeGeometry args={[0.18, 0.18]} />
            <meshStandardMaterial color="#FACC15" />
          </mesh>
        </group>
      ))}

      {routeMarkers.map((marker, idx) => (
        <group key={`marker-${idx}`} position={marker.position} rotation={[0, marker.rotationY, 0]}>
          {/* White Concrete Kilometer Post */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[0.22, 0.7, 0.15]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.7} />
          </mesh>
          {/* Yellow Top Cap */}
          <mesh position={[0, 0.72, 0]}>
            <boxGeometry args={[0.22, 0.06, 0.15]} />
            <meshStandardMaterial color="#FACC15" />
          </mesh>
        </group>
      ))}

      {/* ==================================================================
          8. START BUMPER & GRAND TERMINUS BUFFER STOP
          ================================================================== */}
      {/* 8a. Start of Track Buffer Stop (t = 0.0) */}
      <group position={startTrackStop.position} rotation={[0, startTrackStop.rotationY, 0]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.5, 0.35, 0.2]} />
          <meshStandardMaterial color="#475569" roughness={0.6} />
        </mesh>
      </group>

      {/* 8b. Grand Terminus Heavy Hydraulic Buffer Stop at End of Line (t = 1.0) */}
      <group position={terminusBufferStop.position} rotation={[0, terminusBufferStop.rotationY, 0]}>
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

        {/* Heavy Wooden Buffer Beam with Yellow/Black Hazard Stripes */}
        <mesh position={[0, 0.65, -0.42]} castShadow>
          <boxGeometry args={[1.56, 0.38, 0.18]} />
          <meshStandardMaterial color="#FACC15" roughness={0.4} />
        </mesh>
        {[-0.45, 0, 0.45].map((xOffset, i) => (
          <mesh key={`stripe-${i}`} position={[xOffset, 0.65, -0.52]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.12, 0.36, 0.02]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        ))}

        {/* Red Terminal Marker Lamp on Top */}
        <mesh position={[0, 1.25, -0.35]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={3.0}
          />
        </mesh>
      </group>

      {/* 9. Bridge Rustic Masonry Pillars with Coping Caps */}
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

      {/* 10. Elevated Bridge Side Safety Guardrails */}
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
