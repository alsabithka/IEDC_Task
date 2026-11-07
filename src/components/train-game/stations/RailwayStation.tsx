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

    // Platform positioned on outside of track (2.18m offset along normal)
    // In local space rotated by atan2(tangent.x, tangent.z):
    // - Local +Z points along tangent (forward driving direction)
    // - Local +X points toward the track centerline (+2.18m)
    // - Local -X points away from the track into the meadow
    const platformPos = new THREE.Vector3()
      .copy(trackPos)
      .addScaledVector(normal, 2.18)
      .setY(trackPos.y)

    const angle = Math.atan2(tangent.x, tangent.z)

    return {
      position: platformPos,
      rotation: new THREE.Euler(0, angle, 0),
    }
  }, [station.trackProgress])

  const isTerminus = station.number === 8

  return (
    <group position={position} rotation={rotation}>
      {/* ==================================================================
          1. PASSENGER PLATFORM DECK & ACCESS RAMPS
          ================================================================== */}
      {/* Main Platform Deck (14m long, 2.7m wide: X in [-1.35, +1.35]) */}
      <mesh position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.7, 0.44, 14]} />
        <meshStandardMaterial
          color={isTrainStoppedHere ? '#F8FAFC' : '#E2E8F0'}
          roughness={0.65}
        />
      </mesh>

      {/* Platform Beginning Entry Ramp (Z = -7.6) */}
      <mesh position={[0, 0.11, -7.6]} rotation={[0.22, 0, 0]} receiveShadow>
        <boxGeometry args={[2.7, 0.24, 1.4]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
      </mesh>

      {/* Platform Endpoint Exit Ramp (Z = +7.6) */}
      <mesh position={[0, 0.11, 7.6]} rotation={[-0.22, 0, 0]} receiveShadow>
        <boxGeometry args={[2.7, 0.24, 1.4]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.7} />
      </mesh>

      {/* Safety Edge Warning Strip (Canary Yellow running along trackside edge at X = +1.30) */}
      <mesh position={[1.30, 0.45, 0]}>
        <boxGeometry args={[0.10, 0.02, 14]} />
        <meshStandardMaterial
          color="#FACC15"
          emissive="#EAB308"
          emissiveIntensity={isTrainStoppedHere ? 1.0 : 0.2}
        />
      </mesh>

      {/* ==================================================================
          2. PHYSICAL STOPPING TARGET LINE & STOP MARKERS
          ================================================================== */}
      {/* Red Painted STOP Bar on Platform Deck at Target Stopping Center (Z = 0) */}
      <mesh position={[0.72, 0.46, 0]}>
        <boxGeometry args={[1.16, 0.02, 0.45]} />
        <meshStandardMaterial
          color="#DC2626"
          emissive="#DC2626"
          emissiveIntensity={isTrainStoppedHere ? 2.2 : 0.9}
        />
      </mesh>

      {/* Painted Center Track Stop Marker Bar on Railway Ballast (X = +2.18, Z = 0) */}
      <mesh position={[2.18, 0.02, 0]}>
        <boxGeometry args={[0.9, 0.02, 0.4]} />
        <meshStandardMaterial
          color="#FACC15"
          emissive="#FACC15"
          emissiveIntensity={isTrainStoppedHere ? 2.5 : 1.0}
        />
      </mesh>

      {/* Octagonal Red STOP Sign Post on Platform Trackside Edge (X = +1.15, Z = 0) */}
      <group position={[1.15, 0.44, 0]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
        {/* Octagonal STOP Sign Facing Arriving Train (Looking from -Z) */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 8]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.7, -0.025]}>
          <planeGeometry args={[0.34, 0.16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* ==================================================================
          3. PLATFORM EXIT SIGNALS & END INDICATORS
          ================================================================== */}
      {/* Departure Railway Signal Post at Platform Exit (X = +1.15, Z = +6.6, facing train) */}
      <group position={[1.15, 0.44, 6.6]}>
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 2.6, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        {/* Signal Head Box */}
        <mesh position={[0, 2.4, 0]} castShadow>
          <boxGeometry args={[0.26, 0.65, 0.22]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        {/* Signal Lenses: Emerald Green when stopped, Amber when moving */}
        <mesh position={[0, 2.55, -0.12]}>
          <circleGeometry args={[0.07, 16]} />
          <meshStandardMaterial
            color={isTrainStoppedHere ? '#10B981' : '#064E3B'}
            emissive={isTrainStoppedHere ? '#10B981' : '#000000'}
            emissiveIntensity={isTrainStoppedHere ? 2.5 : 0}
          />
        </mesh>
        <mesh position={[0, 2.38, -0.12]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial
            color={!isTrainStoppedHere ? '#F59E0B' : '#78350F'}
            emissive={!isTrainStoppedHere ? '#F59E0B' : '#000000'}
            emissiveIntensity={!isTrainStoppedHere ? 2.0 : 0}
          />
        </mesh>
      </group>

      {/* Intermediate Stations: Platform End Warning Board at Z = +7.2 */}
      {!isTerminus && (
        <group position={[1.15, 0.44, 7.2]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 12]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[0.6, 0.35, 0.05]} />
            <meshStandardMaterial color="#FACC15" roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.1, -0.03]}>
            <planeGeometry args={[0.5, 0.25]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>
      )}

      {/* Terminal Station Banner Post at Z = +7.2 */}
      {isTerminus && (
        <group position={[0, 0.44, 7.2]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[2.2, 0.5, 0.08]} />
            <meshStandardMaterial color="#DC2626" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.1, -0.05]}>
            <planeGeometry args={[2.0, 0.36]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      )}

      {/* ==================================================================
          4. PLATFORM LIGHTING LANTERN POSTS (Rear Edge at X = -1.15)
          ================================================================== */}
      {[-5.0, 0.0, 5.0].map((zPos, idx) => (
        <group key={`lamp-${idx}`} position={[-1.15, 0.44, zPos]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.06, 2.8, 12]} />
            <meshStandardMaterial color="#1E293B" metalness={0.6} />
          </mesh>
          {/* Lamp Arm towards platform center */}
          <mesh position={[0.2, 2.75, 0]} rotation={[0, 0, -0.4]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          {/* Warm Glowing Lantern */}
          <mesh position={[0.35, 2.8, 0]}>
            <cylinderGeometry args={[0.14, 0.08, 0.22, 12]} />
            <meshStandardMaterial
              color="#FEF08A"
              emissive="#FEF08A"
              emissiveIntensity={1.8}
            />
          </mesh>
        </group>
      ))}

      {/* ==================================================================
          5. COLOURFUL CANOPY, WAITING BENCHES & FLOWER PLANTERS
          ================================================================== */}
      <group position={[-0.3, 0.44, 0]}>
        {/* Support Columns along rear */}
        {[-4.0, 0, 4.0].map((z, idx) => (
          <mesh key={`col-${idx}`} position={[-0.5, 1.4, z]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 2.8, 12]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
          </mesh>
        ))}

        {/* Slanted Canopy Roof */}
        <mesh position={[0.2, 2.85, 0]} rotation={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[2.3, 0.12, 10.5]} />
          <meshStandardMaterial color={station.roofColor} roughness={0.4} />
        </mesh>

        {/* Decorative Roof Trim */}
        <mesh position={[1.35, 2.73, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.06, 0.16, 10.5]} />
          <meshStandardMaterial color={station.bannerColor} roughness={0.4} />
        </mesh>

        {/* Elevated Station Marquee Sign atop Canopy Roof for High-Angle Visibility */}
        <group position={[0.6, 3.35, 0]}>
          {/* Backing Frame */}
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.7, 4.4]} />
            <meshStandardMaterial color="#0F172A" roughness={0.3} />
          </mesh>
          {/* Accent Color Inset */}
          <mesh position={[0.06, 0, 0]}>
            <boxGeometry args={[0.02, 0.62, 4.26]} />
            <meshStandardMaterial color={station.accentColor} />
          </mesh>
          {/* Track-facing Elevated Station Name */}
          <Text
            position={[0.08, 0.08, 0]}
            rotation={[0, Math.PI / 2, 0]}
            fontSize={0.25}
            color="#0F172A"
            anchorX="center"
            anchorY="middle"
          >
            {station.name.toUpperCase()}
          </Text>
          <Text
            position={[0.08, -0.15, 0]}
            rotation={[0, Math.PI / 2, 0]}
            fontSize={0.11}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {`${station.time} · ${station.sessionTitle}`}
          </Text>
        </group>

        {/* Waiting Benches on rear deck */}
        <group position={[-0.5, 0.25, -2.0]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.4, 1.6]} />
            <meshStandardMaterial color="#78350F" roughness={0.6} />
          </mesh>
        </group>
        <group position={[-0.5, 0.25, 2.0]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.4, 1.6]} />
            <meshStandardMaterial color="#78350F" roughness={0.6} />
          </mesh>
        </group>

        {/* Flower Planter Boxes along rear edge */}
        {[-3.0, 3.0].map((zPos, bIdx) => (
          <group key={`planter-${bIdx}`} position={[-0.8, 0.2, zPos]}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.35, 1.4]} />
              <meshStandardMaterial color="#854D0E" roughness={0.7} />
            </mesh>
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
        ))}
      </group>

      {/* ==================================================================
          6. ELEVATED STATION NAMEBOARDS FOR MAXIMUM LONG & CLOSE VISIBILITY
          ================================================================== */}
      {/* 6a. Entrance Station Nameboard at Z = -6.2 (Raised to Y = 2.45m for long-distance approach visibility) */}
      <group position={[-0.4, 2.45, -6.2]}>
        {/* Sturdy Steel Mounting Posts anchored into platform deck */}
        <mesh position={[-1.1, -0.95, -0.04]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.9, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[1.1, -0.95, -0.04]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.9, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
        </mesh>

        <Billboard follow={true}>
          {/* Main Board Plate */}
          <mesh castShadow>
            <boxGeometry args={[2.9, 1.15, 0.08]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>

          {/* Color Header Banner */}
          <mesh position={[0, 0.42, 0.045]}>
            <boxGeometry args={[2.82, 0.24, 0.02]} />
            <meshStandardMaterial color={station.accentColor} />
          </mesh>

          {/* Station Number Badge */}
          <mesh position={[-1.02, 0.42, 0.06]}>
            <boxGeometry args={[0.55, 0.18, 0.02]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>

          <Text
            position={[-1.02, 0.42, 0.08]}
            fontSize={0.11}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {`STN 0${station.number}`}
          </Text>

          <Text
            position={[0.22, 0.42, 0.08]}
            fontSize={0.12}
            color="#0F172A"
            anchorX="center"
            anchorY="middle"
          >
            {`${station.time} · ${station.day}`}
          </Text>

          {/* Station Name */}
          <Text
            position={[0, 0.12, 0.05]}
            fontSize={0.24}
            color="#0F172A"
            anchorX="center"
            anchorY="middle"
          >
            {station.name.toUpperCase()}
          </Text>

          {/* Session Title */}
          <Text
            position={[0, -0.18, 0.05]}
            fontSize={0.14}
            color="#334155"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.7}
          >
            {station.sessionTitle}
          </Text>

          {/* Terminal Station Eyebrow Tag */}
          {isTerminus && (
            <mesh position={[0, -0.42, 0.045]}>
              <boxGeometry args={[2.82, 0.18, 0.02]} />
              <meshStandardMaterial color="#DC2626" />
            </mesh>
          )}
          {isTerminus && (
            <Text
              position={[0, -0.42, 0.08]}
              fontSize={0.11}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
            >
              FINAL DESTINATION · GRAND TERMINUS
            </Text>
          )}
        </Billboard>
      </group>

      {/* 6b. Platform Center Station Nameboard at Z = +2.4 (Elevated at Y = 2.15m directly framed in cab windshield) */}
      <group position={[0.15, 2.15, 2.4]}>
        {/* Sturdy Steel Mounting Posts anchored into platform deck */}
        <mesh position={[-0.8, -0.85, -0.04]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.7, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.8, -0.85, -0.04]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.7, 12]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
        </mesh>

        <Billboard follow={true}>
          {/* Main Board Plate */}
          <mesh castShadow>
            <boxGeometry args={[2.2, 0.95, 0.08]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
          </mesh>

          {/* Color Header Banner */}
          <mesh position={[0, 0.35, 0.045]}>
            <boxGeometry args={[2.14, 0.20, 0.02]} />
            <meshStandardMaterial color={station.accentColor} />
          </mesh>

          {/* Station Number Badge */}
          <mesh position={[-0.78, 0.35, 0.06]}>
            <boxGeometry args={[0.45, 0.15, 0.02]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>

          <Text
            position={[-0.78, 0.35, 0.08]}
            fontSize={0.095}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {`STN 0${station.number}`}
          </Text>

          <Text
            position={[0.2, 0.35, 0.08]}
            fontSize={0.105}
            color="#0F172A"
            anchorX="center"
            anchorY="middle"
          >
            {`${station.time} · ${station.day}`}
          </Text>

          {/* Station Name */}
          <Text
            position={[0, 0.10, 0.05]}
            fontSize={0.21}
            color="#0F172A"
            anchorX="center"
            anchorY="middle"
          >
            {station.name.toUpperCase()}
          </Text>

          {/* Session Title */}
          <Text
            position={[0, -0.15, 0.05]}
            fontSize={0.125}
            color="#334155"
            anchorX="center"
            anchorY="middle"
            maxWidth={2.05}
          >
            {station.sessionTitle}
          </Text>

          {/* Terminal Station Eyebrow Tag */}
          {isTerminus && (
            <mesh position={[0, -0.35, 0.045]}>
              <boxGeometry args={[2.14, 0.15, 0.02]} />
              <meshStandardMaterial color="#DC2626" />
            </mesh>
          )}
          {isTerminus && (
            <Text
              position={[0, -0.35, 0.08]}
              fontSize={0.095}
              color="#FFFFFF"
              anchorX="center"
              anchorY="middle"
            >
              FINAL DESTINATION · GRAND TERMINUS
            </Text>
          )}
        </Billboard>
      </group>

      {/* ==================================================================
          7. DISTINCTIVE CARTOON LANDMARKS PER STATION (Rear deck at X = -0.6)
          ================================================================== */}
      {/* Station 1: Welcome Festival Arch */}
      {station.landmark === 'welcome_arch' && (
        <group position={[-0.6, 0.44, 4.2]}>
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
        <group position={[-0.6, 0.44, 4.2]}>
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

      {/* Station 3: Dining Depot (Striped Cafe Umbrella at Platform Exit) */}
      {station.landmark === 'dining_depot' && (
        <group position={[-0.8, 0.44, 5.8]}>
          {/* Cafe Umbrella */}
          <mesh position={[0, 2.1, 0]} castShadow>
            <coneGeometry args={[1.2, 0.65, 16]} />
            <meshStandardMaterial color="#2EC4B6" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.05, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.1, 12]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
      )}

      {/* Station 4: Synergy Hub (Glowing Violet Crystal) */}
      {station.landmark === 'synergy_hub' && (
        <group position={[-0.6, 0.44, 4.2]}>
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
        <group position={[-0.6, 0.44, 4.2]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.35, 2.4, 16]} />
            <meshStandardMaterial color="#FF7B00" roughness={0.4} />
          </mesh>
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
        <group position={[-0.6, 0.44, 4.2]}>
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
        <group position={[-0.6, 0.44, 4.2]}>
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
        <group position={[-0.6, 0.44, 4.2]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.75, 1.6, 16]} />
            <meshStandardMaterial color="#800020" roughness={0.3} />
          </mesh>
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
        </group>
      )}
    </group>
  )
}

export default RailwayStation
