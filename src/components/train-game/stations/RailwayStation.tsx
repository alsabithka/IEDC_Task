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
          1. STATION PLATFORM (Warm Sandstone with Safety Yellow Edge)
          ================================================================== */}
      {/* Main Platform Deck */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.44, 9.5]} />
        <meshStandardMaterial
          color={isTrainStoppedHere ? '#F8FAFC' : '#E2E8F0'}
          roughness={0.7}
        />
      </mesh>

      {/* Safety Edge Warning Strip (Canary Yellow facing tracks) */}
      <mesh position={[-1.35, 0.45, 0]}>
        <boxGeometry args={[0.12, 0.02, 9.4]} />
        <meshStandardMaterial
          color="#FACC15"
          emissive="#EAB308"
          emissiveIntensity={isTrainStoppedHere ? 1.0 : 0.2}
        />
      </mesh>

      {/* Safe Stopping Zone Platform Marker (Station Theme Colored Stop Zone) */}
      <mesh position={[-0.8, 0.46, 0]}>
        <boxGeometry args={[0.6, 0.02, 0.5]} />
        <meshStandardMaterial
          color={station.accentColor}
          emissive={station.accentColor}
          emissiveIntensity={isTrainStoppedHere ? 2.0 : 0.6}
        />
      </mesh>

      {/* ==================================================================
          2. COLOURFUL STATION CANOPY & TICKET BOOTH
          ================================================================== */}
      <group position={[0.6, 0.44, 0]}>
        {/* Support Columns (Clean White Pillars) */}
        {[-3.5, 0, 3.5].map((z, idx) => (
          <mesh key={`col-${idx}`} position={[0, 1.4, z]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.8, 12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
        ))}

        {/* Slanted Overhead Canopy Roof (Station Signature Roof Color) */}
        <mesh position={[-0.4, 2.85, 0]} rotation={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[2.4, 0.12, 9.2]} />
          <meshStandardMaterial color={station.roofColor} roughness={0.4} />
        </mesh>

        {/* Decorative Roof Trim (Station Banner Color) */}
        <mesh position={[-1.6, 2.73, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.06, 0.16, 9.2]} />
          <meshStandardMaterial color={station.bannerColor} roughness={0.4} />
        </mesh>

        {/* Small Platform Waiting Bench */}
        <group position={[0.2, 0.25, -1.2]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.4, 1.6]} />
            <meshStandardMaterial color="#78350F" roughness={0.6} />
          </mesh>
          <mesh position={[0.28, 0.4, 0]} castShadow>
            <boxGeometry args={[0.08, 0.4, 1.6]} />
            <meshStandardMaterial color="#78350F" roughness={0.6} />
          </mesh>
        </group>

        {/* Flower Planter Box on Platform */}
        <group position={[0.5, 0.2, 1.8]}>
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.35, 1.4]} />
            <meshStandardMaterial color="#854D0E" roughness={0.7} />
          </mesh>
          {/* Flowers in Box */}
          {[-0.4, 0, 0.4].map((z, fIdx) => (
            <mesh key={`fl-${fIdx}`} position={[0, 0.22, z]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial
                color={fIdx % 2 === 0 ? '#EF4444' : '#FACC15'}
                roughness={0.4}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ==================================================================
          3. LARGE READABLE STATION NAMEBOARD (Facing Arriving Train)
          ================================================================== */}
      <group position={[0.2, 0.5, 3.8]}>
        <Billboard follow={true}>
          {/* Main Board Plate (Ivory with Station Colored Border) */}
          <mesh castShadow>
            <boxGeometry args={[3.8, 1.4, 0.08]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>

          {/* Color Header Banner */}
          <mesh position={[0, 0.52, 0.045]}>
            <boxGeometry args={[3.72, 0.28, 0.02]} />
            <meshStandardMaterial color={station.roofColor} roughness={0.3} />
          </mesh>

          {/* Time & Station Code */}
          <Text
            fontSize={0.2}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            position={[0, 0.52, 0.06]}
          >
            {`${station.time} · ${station.code}`}
          </Text>

          {/* Session Title */}
          <Text
            fontSize={0.22}
            color="#0F172A"
            anchorX="center"
            anchorY="middle"
            position={[0, 0.08, 0.05]}
            maxWidth={3.5}
          >
            {station.sessionTitle}
          </Text>

          {/* Station Subtitle */}
          <Text
            fontSize={0.16}
            color="#475569"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.36, 0.05]}
          >
            {`STATION 0${station.number} — ${station.day.toUpperCase()} (${station.name})`}
          </Text>
        </Billboard>
      </group>

      {/* ==================================================================
          4. DISTINCTIVE CARTOON LANDMARKS PER STATION
          ================================================================== */}
      {/* Station 1: Welcome Festival Arch */}
      {station.landmark === 'welcome_arch' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.2, 12]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
          <mesh position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.22, 24]} />
            <meshStandardMaterial color="#FACC15" metalness={0.4} />
          </mesh>
          <mesh position={[-0.12, 2.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <circleGeometry args={[0.36, 24]} />
            <meshStandardMaterial color="#EF4444" />
          </mesh>
        </group>
      )}

      {/* Station 2: Workshop Gears */}
      {station.landmark === 'workshop_gear' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.0, 12]} />
            <meshStandardMaterial color="#3A86FF" />
          </mesh>
          <mesh position={[0, 2.3, 0]} castShadow>
            <torusGeometry args={[0.38, 0.12, 12, 24]} />
            <meshStandardMaterial
              color="#F59E0B"
              metalness={0.8}
              roughness={0.25}
              emissive="#F59E0B"
              emissiveIntensity={isTrainStoppedHere ? 1.5 : 0.4}
            />
          </mesh>
        </group>
      )}

      {/* Station 3: Dining Depot (Striped Cafe Umbrella) */}
      {station.landmark === 'dining_depot' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[1.2, 0.65, 16]} />
            <meshStandardMaterial color="#2EC4B6" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 1.8, 12]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      )}

      {/* Station 4: Synergy Hub (Glowing Violet Crystal) */}
      {station.landmark === 'synergy_hub' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 1.3, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 2.2, 12]} />
            <meshStandardMaterial color="#8338EC" />
          </mesh>
          <mesh position={[0, 2.4, 0]} castShadow>
            <octahedronGeometry args={[0.42, 0]} />
            <meshStandardMaterial
              color="#A855F7"
              emissive="#A855F7"
              emissiveIntensity={isTrainStoppedHere ? 2.5 : 1.2}
              roughness={0.2}
            />
          </mesh>
        </group>
      )}

      {/* Station 5: Morning Beacon (Lighthouse Beacon Tower) */}
      {station.landmark === 'morning_beacon' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.35, 2.4, 16]} />
            <meshStandardMaterial color="#FF7B00" roughness={0.4} />
          </mesh>
          {/* Beacon Lantern Light */}
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color="#FEF08A"
              emissive="#FEF08A"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
      )}

      {/* Station 6: Deep Code Labs (Retro Cyber Cube) */}
      {station.landmark === 'code_lab' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.0, 12]} />
            <meshStandardMaterial color="#00B4D8" />
          </mesh>
          <mesh position={[0, 2.3, 0]} castShadow>
            <boxGeometry args={[0.55, 0.45, 0.45]} />
            <meshStandardMaterial color="#03045E" />
          </mesh>
          <mesh position={[-0.28, 2.3, 0]}>
            <planeGeometry args={[0.38, 0.32]} />
            <meshStandardMaterial
              color="#22C55E"
              emissive="#22C55E"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      )}

      {/* Station 7: Refuel Stop (Water / Steam Tower) */}
      {station.landmark === 'refuel_pavilion' && (
        <group position={[0.5, 0.44, -3.2]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 1.2, 16]} />
            <meshStandardMaterial color="#E76F51" roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.2, 0]} castShadow>
            <coneGeometry args={[0.55, 0.5, 16]} />
            <meshStandardMaterial color="#2A9D8F" roughness={0.4} />
          </mesh>
        </group>
      )}

      {/* Station 8: Grand Terminus (Golden Trophy Podium) */}
      {station.landmark === 'grand_podium' && (
        <group position={[0.5, 0.44, -3.2]}>
          {/* Winner's Column */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.75, 1.6, 16]} />
            <meshStandardMaterial color="#800020" roughness={0.3} />
          </mesh>
          {/* Golden Trophy Cup */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.15, 0.5, 16]} />
            <meshStandardMaterial
              color="#FFB703"
              metalness={0.9}
              roughness={0.15}
              emissive="#FFB703"
              emissiveIntensity={isTrainStoppedHere ? 2.0 : 0.6}
            />
          </mesh>
          <mesh position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color="#FFB703" metalness={0.9} roughness={0.15} />
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
              color={station.accentColor}
              emissive={station.accentColor}
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default RailwayStation
