import React, { useMemo } from 'react'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import type { GameStationConfig } from '../../../config/trainGameConfig'
import { getTrackFrameAt } from '../track/trackMath'

interface RailwayStationProps {
  station: GameStationConfig
  isTrainStoppedHere: boolean
}

export const RailwayStation: React.FC<RailwayStationProps> = ({
  station,
  isTrainStoppedHere,
}) => {
  const { position, rotation } = useMemo(() => {
    const { position: trackPos, tangent, normal } = getTrackFrameAt(station.trackProgress)

    // Platform positioned on outside of track (3.2 units offset)
    const platformPos = new THREE.Vector3()
      .copy(trackPos)
      .addScaledVector(normal, 3.2)
      .setY(trackPos.y)

    const angle = Math.atan2(tangent.x, tangent.z)

    return {
      position: platformPos,
      rotation: new THREE.Euler(0, angle, 0),
    }
  }, [station.trackProgress])

  return (
    <group position={position} rotation={rotation}>
      {/* ==================================================================
          1. STATION PLATFORM (Long Concrete Slab with Safety Edge)
          ================================================================== */}
      {/* Main Platform Deck */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.44, 9.5]} />
        <meshStandardMaterial
          color={isTrainStoppedHere ? '#262626' : '#181818'}
          roughness={0.7}
        />
      </mesh>

      {/* Safety Edge Strip (White warning line facing tracks) */}
      <mesh position={[-1.35, 0.45, 0]}>
        <boxGeometry args={[0.12, 0.02, 9.4]} />
        <meshStandardMaterial
          color={isTrainStoppedHere ? '#FFFFFF' : '#888888'}
          emissive={isTrainStoppedHere ? '#FFFFFF' : '#000000'}
          emissiveIntensity={isTrainStoppedHere ? 1.0 : 0}
        />
      </mesh>

      {/* Safe Stopping Zone Platform Marker (Central Stop Bar) */}
      <mesh position={[-0.8, 0.46, 0]}>
        <boxGeometry args={[0.6, 0.02, 0.4]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={isTrainStoppedHere ? 1.5 : 0.4}
        />
      </mesh>

      {/* ==================================================================
          2. STATION CANOPY / SHELTER
          ================================================================== */}
      <group position={[0.6, 0.44, 0]}>
        {/* Support Columns */}
        {[-3.5, 0, 3.5].map((z, idx) => (
          <mesh key={`col-${idx}`} position={[0, 1.4, z]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 2.8, 12]} />
            <meshStandardMaterial color="#444444" metalness={0.6} />
          </mesh>
        ))}

        {/* Slanted Overhead Canopy Roof */}
        <mesh position={[-0.4, 2.85, 0]} rotation={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[2.4, 0.1, 9.2]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
      </group>

      {/* ==================================================================
          3. LARGE READABLE STATION NAMEBOARD (Facing Arriving Train)
          ================================================================== */}
      <group position={[0.2, 0.5, 3.8]}>
        <Billboard follow={true}>
          {/* Main Board Plate */}
          <mesh castShadow>
            <boxGeometry args={[3.6, 1.3, 0.08]} />
            <meshStandardMaterial
              color={isTrainStoppedHere ? '#FFFFFF' : '#141414'}
              roughness={0.25}
            />
          </mesh>

          {/* Time & Station Code */}
          <Text
            fontSize={0.26}
            color={isTrainStoppedHere ? '#000000' : '#FFFFFF'}
            anchorX="center"
            anchorY="middle"
            position={[0, 0.32, 0.05]}
          >
            {`${station.time} · ${station.code}`}
          </Text>

          {/* Session Title */}
          <Text
            fontSize={0.22}
            color={isTrainStoppedHere ? '#111111' : '#D0D0D0'}
            anchorX="center"
            anchorY="middle"
            position={[0, -0.02, 0.05]}
            maxWidth={3.3}
          >
            {station.sessionTitle}
          </Text>

          {/* Station Subtitle */}
          <Text
            fontSize={0.15}
            color={isTrainStoppedHere ? '#444444' : '#888888'}
            anchorX="center"
            anchorY="middle"
            position={[0, -0.36, 0.05]}
          >
            {`STATION 0${station.number} — ${station.day.toUpperCase()}`}
          </Text>
        </Billboard>
      </group>

      {/* ==================================================================
          4. DISTINCTIVE CARTOON LANDMARKS PER STATION
          ================================================================== */}
      {station.landmark === 'welcome_arch' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.2, 12]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.2, 24]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[-0.11, 2.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <circleGeometry args={[0.34, 24]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      )}

      {station.landmark === 'workshop_gear' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 2.0, 12]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0, 2.3, 0]} castShadow>
            <sphereGeometry args={[0.38, 20, 20]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFFFFF"
              emissiveIntensity={isTrainStoppedHere ? 2.5 : 1.0}
            />
          </mesh>
        </group>
      )}

      {station.landmark === 'dining_depot' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[1.0, 0.65, 16]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.8, 12]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      )}

      {station.landmark === 'synergy_hub' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 2.4, 12]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.3, 2.3, 0]} castShadow>
            <boxGeometry args={[0.55, 0.36, 0.04]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      )}

      {station.landmark === 'grand_podium' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.6, 0.8, 1.2, 16]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.4} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.7, 12]} />
            <meshStandardMaterial color="#D0D0D0" />
          </mesh>
          <mesh position={[0.25, 1.65, 0]} castShadow>
            <boxGeometry args={[0.48, 0.3, 0.03]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      )}

      {/* ==================================================================
          5. ACTIVE ARRIVAL HIGHLIGHT (Glowing Platform Rim when Train Stopped)
          ================================================================== */}
      {isTrainStoppedHere && (
        <group position={[0, 0.46, 0]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[2.9, 0.03, 9.6]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#FFFFFF"
              emissiveIntensity={2.0}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default RailwayStation
