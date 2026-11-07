import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DriverCabin } from './DriverCabin'
import { getTrackFrameAt } from '../track/trackMath'

interface TrainLocomotiveProps {
  trackProgress: number
  speedKmh: number
  throttlePercent: number
  brakePercent: number
  nextStationName: string
  distanceMeters: number
}

export const TrainLocomotive: React.FC<TrainLocomotiveProps> = ({
  trackProgress,
  speedKmh,
  throttlePercent,
  brakePercent,
  nextStationName,
  distanceMeters,
}) => {
  const trainGroupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!trainGroupRef.current) return

    // Position locomotive on track
    const { position, tangent } = getTrackFrameAt(trackProgress)
    trainGroupRef.current.position.set(position.x, position.y + 0.15, position.z)

    // Orient forward along tangent
    const target = new THREE.Vector3().copy(position).add(tangent)
    trainGroupRef.current.lookAt(target)
  })

  return (
    <group ref={trainGroupRef}>
      {/* Driver Cabin & Dashboard Interior (Camera is inside here!) */}
      <DriverCabin
        speedKmh={speedKmh}
        throttlePercent={throttlePercent}
        brakePercent={brakePercent}
        nextStationName={nextStationName}
        distanceMeters={distanceMeters}
      />

      {/* Exterior Chassis & Wheel Details */}
      <mesh position={[0, 0.18, 0.4]} receiveShadow>
        <boxGeometry args={[1.5, 0.22, 4.2]} />
        <meshStandardMaterial color="#121212" roughness={0.7} />
      </mesh>

      {/* Front Locomotive Cowcatcher (Wedge) */}
      <mesh position={[0, 0.16, 2.7]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1.4, 0.28, 0.35]} />
        <meshStandardMaterial color="#181818" roughness={0.8} />
      </mesh>
    </group>
  )
}

export default TrainLocomotive
