import React, { useMemo } from 'react'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import type { GameStationConfig } from '../../../config/trainGameConfig'
import { getTrackFrameAt } from '../track/trackMath'

/**
 * ============================================================================
 * AUTHENTIC INDIAN RAILWAYS 3D PASSENGER STATION ARCHITECTURE
 * ============================================================================
 * Believable Indian Railway Platform Environment:
 * - Raised concrete platform with black & white alternating curb blocks
 * - Tiled floor with Canary Yellow safety boundary and tactile edge
 * - Industrial corrugated steel platform shelter with engineered triangular trusses
 * - Suspended 3-blade ceiling fans, industrial fluorescent tube lights, conduits & horn speakers
 * - Large Indian Railway mustard-yellow station signboard with bold black lettering
 * - Large IDEA SPRINT EXPRESS 3D event billboard with official session schedule data
 * - Cast-iron & wooden passenger benches, stylized passengers, drinking water stall & twin waste bins
 * - Red painted platform stop line, track stop marker, and departure signal post
 */

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
    // - Local -X points away from track toward station rear
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

  // Platform curb block intervals (alternating black and white along trackside edge)
  const curbBlocks = useMemo(() => {
    const blocks: { z: number; isWhite: boolean }[] = []
    const count = 26
    for (let i = 0; i < count; i++) {
      blocks.push({
        z: -12.5 + i * 1.0,
        isWhite: i % 2 === 0,
      })
    }
    return blocks
  }, [])

  // Repeating floor tiles along platform walking deck
  const floorTiles = useMemo(() => {
    const tiles: { x: number; z: number; isDark: boolean }[] = []
    for (let z = -11; z <= 11; z += 1.2) {
      for (let x = -1.0; x <= 0.8; x += 0.9) {
        tiles.push({ x, z, isDark: ((Math.abs(z * 3) + Math.abs(x * 5)) % 2) === 0 })
      }
    }
    return tiles
  }, [])

  // Roof steel truss frame stations (every 4 meters)
  const trussZPositions = [-8.0, -4.0, 0.0, 4.0, 8.0]

  return (
    <group position={position} rotation={rotation}>
      {/* ==================================================================
          1. RAISED CONCRETE PLATFORM DECK & SLOPED ACCESS RAMPS
          ================================================================== */}
      {/* Main Concrete Foundation Block (26m long, 3.0m wide, 0.88m height) */}
      <mesh position={[-0.15, 0.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.88, 26.0]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
      </mesh>

      {/* Repeating Rectangular Tiled Passenger Floor Layer */}
      {floorTiles.map((tile, idx) => (
        <mesh
          key={`tile-${idx}`}
          position={[tile.x, 0.885, tile.z]}
          receiveShadow
        >
          <boxGeometry args={[0.85, 0.01, 1.15]} />
          <meshStandardMaterial
            color={tile.isDark ? '#CBD5E1' : '#F1F5F9'}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Platform Beginning Entry Ramp (Z = -13.7) */}
      <mesh position={[-0.15, 0.22, -13.7]} rotation={[0.2, 0, 0]} receiveShadow>
        <boxGeometry args={[3.0, 0.44, 1.6]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.85} />
      </mesh>

      {/* Platform Endpoint Exit Ramp (Z = +13.7) */}
      <mesh position={[-0.15, 0.22, 13.7]} rotation={[-0.2, 0, 0]} receiveShadow>
        <boxGeometry args={[3.0, 0.44, 1.6]} />
        <meshStandardMaterial color="#94A3B8" roughness={0.85} />
      </mesh>

      {/* Alternating Black & White Platform Curb Stones along Trackside Edge (X = +1.35) */}
      {curbBlocks.map((b, idx) => (
        <mesh
          key={`curb-${idx}`}
          position={[1.34, 0.44, b.z]}
          receiveShadow
        >
          <boxGeometry args={[0.06, 0.88, 0.98]} />
          <meshStandardMaterial
            color={b.isWhite ? '#F8FAFC' : '#0F172A'}
            roughness={0.6}
          />
        </mesh>
      ))}

      {/* Canary Yellow Passenger Safety Boundary Line (X = +1.24) */}
      <mesh position={[1.24, 0.89, 0]}>
        <boxGeometry args={[0.12, 0.015, 25.8]} />
        <meshStandardMaterial
          color="#FACC15"
          emissive="#EAB308"
          emissiveIntensity={isTrainStoppedHere ? 1.0 : 0.3}
          roughness={0.3}
        />
      </mesh>

      {/* Raised Tactile Warning Strip (Dotted pattern along safety line) */}
      <mesh position={[1.16, 0.89, 0]}>
        <boxGeometry args={[0.04, 0.018, 25.8]} />
        <meshStandardMaterial color="#CA8A04" roughness={0.4} />
      </mesh>

      {/* Drainage Gutter Trench along Station Rear Edge (X = -1.62) */}
      <mesh position={[-1.64, 0.05, 0]} receiveShadow>
        <boxGeometry args={[0.3, 0.12, 26.0]} />
        <meshStandardMaterial color="#475569" roughness={0.95} />
      </mesh>

      {/* ==================================================================
          2. LARGE INDUSTRIAL COVERED PLATFORM SHED ROOF
          ================================================================== */}
      <group position={[0, 0.88, 0]}>
        {/* Repeating Structural Steel Trusses and H-Columns */}
        {trussZPositions.map((zPos, idx) => (
          <group key={`truss-${idx}`} position={[0, 0, zPos]}>
            {/* Vertical Heavy Steel Column Post (Rear row at X = -0.7) */}
            <mesh position={[-0.7, 1.8, 0]} castShadow>
              <boxGeometry args={[0.18, 3.6, 0.2]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Column Cast Iron Base Shoe Plate */}
            <mesh position={[-0.7, 0.1, 0]} castShadow>
              <boxGeometry args={[0.38, 0.2, 0.38]} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} />
            </mesh>

            {/* Horizontal Main Roof Support Girder */}
            <mesh position={[0.1, 3.6, 0]} castShadow>
              <boxGeometry args={[2.8, 0.14, 0.14]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} />
            </mesh>

            {/* Triangular Truss Rafter (Sloping forward towards track) */}
            <mesh position={[0.7, 3.85, 0]} rotation={[0, 0, -0.18]} castShadow>
              <boxGeometry args={[1.5, 0.1, 0.1]} />
              <meshStandardMaterial color="#334155" metalness={0.7} />
            </mesh>

            {/* Triangular Truss Rafter (Sloping backward towards rear) */}
            <mesh position={[-0.7, 3.85, 0]} rotation={[0, 0, 0.18]} castShadow>
              <boxGeometry args={[1.5, 0.1, 0.1]} />
              <meshStandardMaterial color="#334155" metalness={0.7} />
            </mesh>

            {/* Diagonal Steel Webbing Struts */}
            <mesh position={[-0.3, 3.8, 0]} rotation={[0, 0, 0.4]} castShadow>
              <boxGeometry args={[0.8, 0.06, 0.06]} />
              <meshStandardMaterial color="#475569" metalness={0.6} />
            </mesh>
            <mesh position={[0.3, 3.8, 0]} rotation={[0, 0, -0.4]} castShadow>
              <boxGeometry args={[0.8, 0.06, 0.06]} />
              <meshStandardMaterial color="#475569" metalness={0.6} />
            </mesh>

            {/* Connection Gusset Plates */}
            <mesh position={[-0.7, 3.6, 0]}>
              <boxGeometry args={[0.32, 0.32, 0.16]} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Longitudinal Horizontal Steel Purlins */}
        {[-1.3, -0.7, 0.0, 0.7, 1.2].map((xPurlin, pIdx) => (
          <mesh
            key={`purlin-${pIdx}`}
            position={[xPurlin, 3.95 - Math.abs(xPurlin) * 0.12, 0]}
            castShadow
          >
            <boxGeometry args={[0.08, 0.08, 18.5]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
        ))}

        {/* Industrial Weathered Corrugated Metal Pitched Roof (19m long) */}
        {/* Trackside Roof Canopy Half */}
        <mesh
          position={[0.55, 4.02, 0]}
          rotation={[0, 0, -0.16]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.65, 0.08, 19.0]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.65}
            metalness={0.4}
          />
        </mesh>

        {/* Rear Roof Canopy Half */}
        <mesh
          position={[-0.75, 4.02, 0]}
          rotation={[0, 0, 0.16]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.65, 0.08, 19.0]} />
          <meshStandardMaterial
            color="#334155"
            roughness={0.65}
            metalness={0.4}
          />
        </mesh>

        {/* Decorative Indian Railways Eaves Fascia Board (Station Accent Color) */}
        <mesh position={[1.38, 3.86, 0]} rotation={[0, 0, -0.16]}>
          <boxGeometry args={[0.04, 0.22, 19.0]} />
          <meshStandardMaterial color={station.accentColor} roughness={0.5} />
        </mesh>

        {/* ==================================================================
            3. PLATFORM ROOF LIGHTING & STATION ELECTRICAL EQUIPMENT
            ================================================================== */}
        {/* 3a. Indian Railways 3-Blade Ceiling Fans (Suspended from trusses) */}
        {[-6.0, -2.0, 2.0, 6.0].map((zFan, fIdx) => (
          <group key={`fan-${fIdx}`} position={[0.1, 3.55, zFan]}>
            {/* Downrod pipe */}
            <mesh position={[0, -0.3, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
              <meshStandardMaterial color="#78350F" metalness={0.8} />
            </mesh>
            {/* Motor hub */}
            <mesh position={[0, -0.6, 0]}>
              <cylinderGeometry args={[0.12, 0.12, 0.08, 12]} />
              <meshStandardMaterial color="#78350F" metalness={0.8} />
            </mesh>
            {/* 3 Aerodynamic blades */}
            {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, bIdx) => (
              <mesh
                key={`blade-${bIdx}`}
                position={[
                  Math.sin(angle) * 0.35,
                  -0.6,
                  Math.cos(angle) * 0.35,
                ]}
                rotation={[0, angle, 0.05]}
              >
                <boxGeometry args={[0.12, 0.015, 0.6]} />
                <meshStandardMaterial color="#92400E" metalness={0.6} />
              </mesh>
            ))}
          </group>
        ))}

        {/* 3b. Long Industrial Fluorescent Tube Lights */}
        {[-7.0, -3.0, 1.0, 5.0, 7.0].map((zLight, lIdx) => (
          <group key={`light-${lIdx}`} position={[0.2, 3.5, zLight]}>
            {/* Fixture casing */}
            <mesh>
              <boxGeometry args={[0.14, 0.06, 1.2]} />
              <meshStandardMaterial color="#475569" metalness={0.7} />
            </mesh>
            {/* Illuminated Tube */}
            <mesh position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 1.15, 8]} />
              <meshStandardMaterial
                color="#FEF08A"
                emissive="#FEF08A"
                emissiveIntensity={1.8}
              />
            </mesh>
          </group>
        ))}

        {/* 3c. Double-Horn Public Address Announcement Speakers (Central truss) */}
        <group position={[-0.7, 3.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* North Horn */}
          <mesh position={[0, 0, -0.28]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.18, 0.35, 12]} />
            <meshStandardMaterial color="#64748B" metalness={0.7} />
          </mesh>
          {/* South Horn */}
          <mesh position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.18, 0.35, 12]} />
            <meshStandardMaterial color="#64748B" metalness={0.7} />
          </mesh>
        </group>

        {/* 3d. Double-Faced Circular Platform Station Clock (Central truss) */}
        <group position={[0.1, 3.2, 0]}>
          {/* Suspension bracket */}
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          {/* Clock drum casing */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.16, 24]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          {/* White Dial Face (Front & Back) */}
          <mesh position={[0, 0, -0.085]} rotation={[0, 0, 0]}>
            <circleGeometry args={[0.28, 24]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FEF08A" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.085]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[0.28, 24]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FEF08A" emissiveIntensity={0.4} />
          </mesh>
        </group>

        {/* 3e. Wall CCTV Dome Camera */}
        <group position={[-0.7, 3.1, -4.0]}>
          <mesh position={[0.1, 0, 0]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================
          4. PASSENGER FACILITIES: BENCHES, WATER BOOTH, TWIN BINS & PASSENGERS
          ================================================================== */}
      {/* 4a. Passenger 1: Standing by safety line with backpack (Indigo shirt, beige pants) */}
      <group position={[0.85, 0.88, 1.6]}>
        {/* Legs */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.18, 0.9, 0.2]} />
          <meshStandardMaterial color="#D97706" />
        </mesh>
        {/* Torso */}
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[0.28, 0.55, 0.24]} />
          <meshStandardMaterial color="#1D4ED8" />
        </mesh>
        {/* Backpack */}
        <mesh position={[-0.14, 1.15, 0]}>
          <boxGeometry args={[0.12, 0.4, 0.22]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.55, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#D4A373" />
        </mesh>
      </group>

      {/* 4b. Indian Railways Twin Waste Bins (Green = Wet, Blue = Dry) */}
      <group position={[-1.0, 0.88, 2.4]}>
        {/* Tubular steel frame */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.04, 0.8, 0.9]} />
          <meshStandardMaterial color="#0F172A" metalness={0.8} />
        </mesh>
        {/* Green Bin (Biodegradable) */}
        <mesh position={[0, 0.45, -0.24]} castShadow>
          <cylinderGeometry args={[0.16, 0.13, 0.55, 12]} />
          <meshStandardMaterial color="#16A34A" roughness={0.4} />
        </mesh>
        {/* Blue Bin (Recyclable) */}
        <mesh position={[0, 0.45, 0.24]} castShadow>
          <cylinderGeometry args={[0.16, 0.13, 0.55, 12]} />
          <meshStandardMaterial color="#2563EB" roughness={0.4} />
        </mesh>
      </group>

      {/* 4c. Indian Railways Drinking Water Booth ("DRINKING WATER / JAL") */}
      <group position={[-0.2, 0.88, 3.3]}>
        {/* Blue Tiled Stall Basin */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.9, 1.4]} />
          <meshStandardMaterial color="#0284C7" roughness={0.3} />
        </mesh>
        {/* Stainless Steel Basin Top */}
        <mesh position={[0, 0.91, 0]}>
          <boxGeometry args={[0.66, 0.04, 1.36]} />
          <meshStandardMaterial color="#F1F5F9" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Chrome Water Taps */}
        {[-0.35, 0, 0.35].map((zTap, tIdx) => (
          <group key={`tap-${tIdx}`} position={[0.15, 1.05, zTap]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
              <meshStandardMaterial color="#FFFFFF" metalness={0.9} />
            </mesh>
            <mesh position={[0.07, -0.05, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
              <meshStandardMaterial color="#FFFFFF" metalness={0.9} />
            </mesh>
          </group>
        ))}
        {/* "DRINKING WATER / JAL" Signboard Header */}
        <mesh position={[0, 1.35, 0]}>
          <boxGeometry args={[0.55, 0.22, 1.3]} />
          <meshStandardMaterial color="#0369A1" />
        </mesh>
        <Text
          position={[0.28, 1.35, 0]}
          rotation={[0, Math.PI / 2, 0]}
          fontSize={0.095}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          DRINKING WATER / JAL
        </Text>
      </group>

      {/* 4d. Stacked Travel Luggage & Suitcases */}
      <group position={[0.4, 0.88, 4.1]}>
        {/* Red Rolling Suitcase */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.3, 0.6, 0.45]} />
          <meshStandardMaterial color="#DC2626" roughness={0.5} />
        </mesh>
        {/* Navy Duffel Bag on top */}
        <mesh position={[0, 0.68, 0]} castShadow>
          <boxGeometry args={[0.25, 0.22, 0.4]} />
          <meshStandardMaterial color="#1E3A8A" roughness={0.6} />
        </mesh>
      </group>

      {/* 4e. Classic Indian Railway Cast-Iron & Wood Passenger Bench with Seated Passenger */}
      <group position={[-0.7, 0.88, 5.0]}>
        {/* Bench Legs (Cast Iron Dark Slate) */}
        {[-0.8, 0.8].map((zLeg, lIdx) => (
          <mesh key={`bleg-${lIdx}`} position={[0, 0.25, zLeg]} castShadow>
            <boxGeometry args={[0.55, 0.5, 0.06]} />
            <meshStandardMaterial color="#064E3B" metalness={0.8} />
          </mesh>
        ))}
        {/* Wood Slats Seat */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.52, 0.04, 1.8]} />
          <meshStandardMaterial color="#78350F" roughness={0.7} />
        </mesh>
        {/* Wood Slats Backrest */}
        <mesh position={[-0.22, 0.72, 0]} rotation={[0, 0, -0.15]} castShadow>
          <boxGeometry args={[0.04, 0.45, 1.8]} />
          <meshStandardMaterial color="#78350F" roughness={0.7} />
        </mesh>

        {/* Passenger 2: Seated on bench (Maroon Kurta) */}
        <group position={[0.05, 0, 0]}>
          <mesh position={[0, 0.45, 0]}>
            <boxGeometry args={[0.3, 0.4, 0.28]} />
            <meshStandardMaterial color="#881337" />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <boxGeometry args={[0.28, 0.45, 0.26]} />
            <meshStandardMaterial color="#9F1239" />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color="#C68B59" />
          </mesh>
        </group>
      </group>

      {/* Passenger 3: Walking with rolling suitcase (Emerald Jacket) */}
      <group position={[0.3, 0.88, 7.6]}>
        {/* Legs */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[0.18, 0.9, 0.2]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        {/* Torso */}
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[0.28, 0.55, 0.24]} />
          <meshStandardMaterial color="#059669" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 1.55, 0]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#E0AC69" />
        </mesh>
        {/* Brown Rolling Bag */}
        <mesh position={[0.22, 0.25, 0]}>
          <boxGeometry args={[0.22, 0.5, 0.35]} />
          <meshStandardMaterial color="#B45309" />
        </mesh>
      </group>

      {/* 4f. Station Master / Service Office Kiosk (Z = 8.8) */}
      <group position={[-1.1, 0.88, 8.8]}>
        <mesh position={[0, 1.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.0, 2.6, 2.6]} />
          <meshStandardMaterial color="#FEF3C7" roughness={0.7} />
        </mesh>
        {/* Terracotta Overhang Eaves */}
        <mesh position={[0, 2.65, 0]}>
          <boxGeometry args={[1.15, 0.1, 2.8]} />
          <meshStandardMaterial color="#B91C1C" />
        </mesh>
        {/* Office Window with Yellow Light */}
        <mesh position={[0.51, 1.4, -0.4]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={1.0} />
        </mesh>
        {/* Office Door */}
        <mesh position={[0.51, 0.9, 0.5]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.7, 1.8]} />
          <meshStandardMaterial color="#78350F" />
        </mesh>
      </group>

      {/* ==================================================================
          5. LARGE INDIAN RAILWAY-STYLE STATION-NAME SIGNBOARDS
          ================================================================== */}
      {/* 5a. Entrance Station Signboard at Z = -8.5m (Approaching driver view) */}
      <group position={[-0.1, 0.88, -8.5]}>
        <Billboard follow={true}>
          {/* Sturdy Twin Black Steel I-Beam Mounting Posts */}
          <mesh position={[-1.4, 0.7, -0.05]} castShadow>
            <boxGeometry args={[0.14, 2.8, 0.14]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} />
          </mesh>
          <mesh position={[1.4, 0.7, -0.05]} castShadow>
            <boxGeometry args={[0.14, 2.8, 0.14]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} />
          </mesh>

          {/* Main Rectangular Signboard Plate (Bright Mustard Yellow) */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[4.2, 1.4, 0.08]} />
            <meshStandardMaterial color="#FACC15" roughness={0.25} />
          </mesh>

          {/* Solid Bold Black Outer Border */}
          <mesh position={[0, 1.5, 0.045]}>
            <boxGeometry args={[4.08, 1.28, 0.01]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0, 1.5, 0.05]}>
            <boxGeometry args={[3.96, 1.16, 0.01]} />
            <meshStandardMaterial color="#FACC15" />
          </mesh>

          {/* Station Number & Code Header Banner */}
          <mesh position={[0, 1.9, 0.06]}>
            <boxGeometry args={[3.8, 0.22, 0.01]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <Text
            position={[0, 1.9, 0.08]}
            fontSize={0.13}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {`INDIAN RAILWAYS · STN 0${station.number} [${station.code}]`}
          </Text>

          {/* Bold Main Station Name in Prominent Indian Railway Typography */}
          <Text
            position={[0, 1.54, 0.07]}
            fontSize={0.34}
            color="#0F172A"
            anchorX="center"
            anchorY="middle"
          >
            {station.name.toUpperCase()}
          </Text>

          {/* Official Event Session Time & Day */}
          <Text
            position={[0, 1.18, 0.07]}
            fontSize={0.17}
            color="#1E293B"
            anchorX="center"
            anchorY="middle"
          >
            {`${station.time} · ${station.day} · ${station.sessionTitle}`}
          </Text>

          {/* Classic Indian Railway MSL & Depot Tag */}
          <Text
            position={[0, 0.96, 0.07]}
            fontSize={0.09}
            color="#475569"
            anchorX="center"
            anchorY="middle"
          >
            ELEVATION +14.2M MSL · IEDC BOOTCAMP CEC
          </Text>
        </Billboard>
      </group>

      {/* ==================================================================
          6. LARGE "IDEA SPRINT EXPRESS" 3D EVENT BILLBOARD POSTER
          ================================================================== */}
      {/* Prominent Physical Advertising Poster at Z = +6.4m (Visible when stopped) */}
      <group position={[-0.3, 0.88, 6.4]}>
        <Billboard follow={true}>
          {/* Heavy Metal Mounting Stand Legs */}
          <mesh position={[-1.7, 0.9, -0.06]} castShadow>
            <boxGeometry args={[0.12, 2.6, 0.12]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>
          <mesh position={[1.7, 0.9, -0.06]} castShadow>
            <boxGeometry args={[0.12, 2.6, 0.12]} />
            <meshStandardMaterial color="#1E293B" metalness={0.8} />
          </mesh>

          {/* Billboard Backboard & Colored Bevel Frame */}
          <mesh position={[0, 1.7, 0]} castShadow>
            <boxGeometry args={[4.4, 2.1, 0.1]} />
            <meshStandardMaterial color="#0F172A" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.7, 0.055]}>
            <boxGeometry args={[4.28, 1.98, 0.02]} />
            <meshStandardMaterial color={station.accentColor} />
          </mesh>
          <mesh position={[0, 1.7, 0.065]}>
            <boxGeometry args={[4.2, 1.9, 0.01]} />
            <meshStandardMaterial color="#0B1329" />
          </mesh>

          {/* Event Header Banner */}
          <Text
            position={[0, 2.45, 0.08]}
            fontSize={0.12}
            color="#38BDF8"
            anchorX="center"
            anchorY="middle"
          >
            ★ IEDC BOOTCAMP CEC PRESENTS ★
          </Text>

          {/* Event Title */}
          <Text
            position={[0, 2.16, 0.08]}
            fontSize={0.30}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            IDEA SPRINT EXPRESS 2026
          </Text>

          {/* Session Category & Timing Pill */}
          <mesh position={[0, 1.82, 0.075]}>
            <boxGeometry args={[3.6, 0.26, 0.01]} />
            <meshStandardMaterial color={station.accentColor} />
          </mesh>
          <Text
            position={[0, 1.82, 0.09]}
            fontSize={0.13}
            color="#0F172A"
            anchorX="center"
            anchorY="middle"
          >
            {`${station.time} · ${station.day} · ${station.category.toUpperCase()}`}
          </Text>

          {/* Session Headline */}
          <Text
            position={[0, 1.5, 0.08]}
            fontSize={0.24}
            color="#FACC15"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.8}
          >
            {station.sessionTitle.toUpperCase()}
          </Text>

          {/* Session Description */}
          <Text
            position={[0, 1.1, 0.08]}
            fontSize={0.11}
            color="#E2E8F0"
            anchorX="center"
            anchorY="middle"
            maxWidth={3.7}
          >
            {station.description}
          </Text>

          {/* Venue & Duration Footer */}
          <Text
            position={[0, 0.85, 0.08]}
            fontSize={0.10}
            color="#94A3B8"
            anchorX="center"
            anchorY="middle"
          >
            {`VENUE: ${station.venue.toUpperCase()} · DURATION: ${station.duration}`}
          </Text>

          {/* Top Billboard Floodlights */}
          {[-1.3, 0, 1.3].map((xLight, lIdx) => (
            <group key={`bflood-${lIdx}`} position={[xLight, 2.8, 0.25]}>
              <mesh rotation={[0.4, 0, 0]}>
                <boxGeometry args={[0.3, 0.12, 0.2]} />
                <meshStandardMaterial color="#475569" metalness={0.7} />
              </mesh>
              <mesh position={[0, -0.05, 0.05]}>
                <circleGeometry args={[0.08, 12]} />
                <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={2.0} />
              </mesh>
            </group>
          ))}
        </Billboard>
      </group>

      {/* 5b. Departure Station Signboard at Z = +10.2m (Clearly visible looking ahead when train is stopped) */}
      <group position={[-0.1, 0.88, 10.2]}>
        <Billboard follow={true}>
          {/* Sturdy Twin Black Steel I-Beam Mounting Posts */}
          <mesh position={[-1.4, 0.7, -0.05]} castShadow>
            <boxGeometry args={[0.14, 2.8, 0.14]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} />
          </mesh>
          <mesh position={[1.4, 0.7, -0.05]} castShadow>
            <boxGeometry args={[0.14, 2.8, 0.14]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} />
          </mesh>

          {/* Main Rectangular Signboard Plate (Bright Mustard Yellow) */}
          <mesh position={[0, 1.5, 0]} castShadow>
            <boxGeometry args={[4.2, 1.4, 0.08]} />
            <meshStandardMaterial color="#FACC15" roughness={0.25} />
          </mesh>

          {/* Solid Bold Black Outer Border */}
          <mesh position={[0, 1.5, 0.045]}>
            <boxGeometry args={[4.08, 1.28, 0.01]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0, 1.5, 0.05]}>
            <boxGeometry args={[3.96, 1.16, 0.01]} />
            <meshStandardMaterial color="#FACC15" />
          </mesh>

          {/* Station Number & Code Header Banner */}
          <mesh position={[0, 1.9, 0.06]}>
            <boxGeometry args={[3.8, 0.22, 0.01]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <Text
            position={[0, 1.9, 0.08]}
            fontSize={0.13}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {`INDIAN RAILWAYS · STN 0${station.number} [${station.code}]`}
          </Text>

          {/* Bold Main Station Name in Prominent Indian Railway Typography */}
          <Text
            position={[0, 1.54, 0.07]}
            fontSize={0.34}
            color="#0F172A"
            anchorX="center"
            anchorY="middle"
          >
            {station.name.toUpperCase()}
          </Text>

          {/* Official Event Session Time & Day */}
          <Text
            position={[0, 1.18, 0.07]}
            fontSize={0.17}
            color="#1E293B"
            anchorX="center"
            anchorY="middle"
          >
            {`${station.time} · ${station.day} · ${station.sessionTitle}`}
          </Text>

          {/* Classic Indian Railway MSL & Depot Tag */}
          <Text
            position={[0, 0.96, 0.07]}
            fontSize={0.09}
            color="#475569"
            anchorX="center"
            anchorY="middle"
          >
            ELEVATION +14.2M MSL · IEDC BOOTCAMP CEC
          </Text>
        </Billboard>
      </group>

      {/* ==================================================================
          7. PHYSICAL STOPPING TARGET LINE, STOP MARKERS & DEPARTURE SIGNAL
          ================================================================== */}
      {/* Red Painted STOP Bar on Platform Deck at Target Center (Z = 0) */}
      <mesh position={[0.72, 0.895, 0]}>
        <boxGeometry args={[1.16, 0.02, 0.5]} />
        <meshStandardMaterial
          color="#DC2626"
          emissive="#DC2626"
          emissiveIntensity={isTrainStoppedHere ? 2.5 : 1.0}
        />
      </mesh>

      {/* Center Track Stop Marker Bar on Ballast (X = +2.18, Z = 0) */}
      <mesh position={[2.18, 0.02, 0]}>
        <boxGeometry args={[0.92, 0.02, 0.45]} />
        <meshStandardMaterial
          color="#FACC15"
          emissive="#FACC15"
          emissiveIntensity={isTrainStoppedHere ? 2.8 : 1.2}
        />
      </mesh>

      {/* Octagonal Red STOP Sign Post on Platform Track Edge (X = +1.15, Z = 0) */}
      <group position={[1.15, 0.88, 0]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
        <mesh position={[0, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.26, 0.26, 0.04, 8]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.7, -0.025]}>
          <planeGeometry args={[0.34, 0.16]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      </group>

      {/* 3-Aspect Departure Signal at Platform Exit (X = +1.15, Z = +10.5) */}
      <group position={[1.15, 0.88, 10.5]}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.8, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        {/* Signal Head Box */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[0.28, 0.75, 0.22]} />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        {/* Green Aspect Lamp (Stopped / Cleared) */}
        <mesh position={[0, 2.7, -0.12]}>
          <circleGeometry args={[0.075, 16]} />
          <meshStandardMaterial
            color={isTrainStoppedHere ? '#10B981' : '#064E3B'}
            emissive={isTrainStoppedHere ? '#10B981' : '#000000'}
            emissiveIntensity={isTrainStoppedHere ? 2.8 : 0}
          />
        </mesh>
        {/* Amber Aspect Lamp (Moving / Caution) */}
        <mesh position={[0, 2.45, -0.12]}>
          <circleGeometry args={[0.07, 16]} />
          <meshStandardMaterial
            color={!isTrainStoppedHere ? '#F59E0B' : '#78350F'}
            emissive={!isTrainStoppedHere ? '#F59E0B' : '#000000'}
            emissiveIntensity={!isTrainStoppedHere ? 2.2 : 0}
          />
        </mesh>
      </group>

      {/* Intermediate Pass-Through Warning Board at Z = +11.8 */}
      {!isTerminus && (
        <group position={[1.15, 0.88, 11.8]}>
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

      {/* Terminal Destination Warning Banner at Station 8 */}
      {isTerminus && (
        <group position={[0, 0.88, 11.8]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[2.6, 0.55, 0.08]} />
            <meshStandardMaterial color="#DC2626" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.1, -0.05]}>
            <planeGeometry args={[2.4, 0.42]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          <Text
            position={[0, 1.1, -0.06]}
            fontSize={0.16}
            color="#DC2626"
            anchorX="center"
            anchorY="middle"
          >
            TERMINUS · ALL PASSENGERS ALIGHT
          </Text>
        </group>
      )}
    </group>
  )
}

export default RailwayStation
