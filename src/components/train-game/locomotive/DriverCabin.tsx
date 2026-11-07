import React from 'react'
import { Text } from '@react-three/drei'

interface DriverCabinProps {
  speedKmh: number
  throttlePercent: number
  brakePercent: number
  nextStationName: string
  distanceMeters: number
}

export const DriverCabin: React.FC<DriverCabinProps> = ({
  speedKmh,
  throttlePercent,
  brakePercent,
  nextStationName,
  distanceMeters,
}) => {
  // Compute dial needle and lever angles declaratively
  const speedRatio = Math.min(1, Math.max(0, speedKmh / 70))
  const needleRotationZ = 1.6 - speedRatio * 3.2
  const throttleRotationX = -(throttlePercent / 100) * 0.75
  const brakeRotationZ = (brakePercent / 100) * 0.8

  return (
    <group position={[0, 0, 0]}>
      {/* ==================================================================
          1. FORWARD BOILER & HOOD (Visible through bottom of windshield)
          ================================================================== */}
      <group position={[0, 0.45, 1.8]}>
        {/* Long White Enamel Boiler extending ahead */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.55, 2.4, 24]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} metalness={0.2} />
        </mesh>
        {/* Front Nose Rounding */}
        <mesh position={[0, 0, 1.2]} castShadow>
          <sphereGeometry args={[0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Smokestack ahead */}
        <mesh position={[0, 0.65, 0.8]} castShadow>
          <cylinderGeometry args={[0.16, 0.12, 0.45, 16]} />
          <meshStandardMaterial color="#161616" roughness={0.6} />
        </mesh>
      </group>

      {/* ==================================================================
          2. CABIN ARCHITECTURE (Windshield Frame & Side Pillars)
          ================================================================== */}
      {/* Front Dashboard Base Deck */}
      <mesh position={[0, 0.75, 0.55]} receiveShadow>
        <boxGeometry args={[1.7, 0.5, 0.9]} />
        <meshStandardMaterial color="#181818" roughness={0.8} />
      </mesh>

      {/* Angled Upper Dashboard Console */}
      <mesh position={[0, 0.98, 0.52]} rotation={[-0.35, 0, 0]} receiveShadow>
        <boxGeometry args={[1.65, 0.35, 0.55]} />
        <meshStandardMaterial color="#202020" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Left Windshield Pillar */}
      <mesh position={[-0.82, 1.5, 0.5]} rotation={[0, 0, -0.06]}>
        <boxGeometry args={[0.12, 1.2, 0.12]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>

      {/* Right Windshield Pillar */}
      <mesh position={[0.82, 1.5, 0.5]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[0.12, 1.2, 0.12]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>

      {/* Center Windshield Divider */}
      <mesh position={[0, 1.5, 0.52]}>
        <boxGeometry args={[0.06, 1.15, 0.08]} />
        <meshStandardMaterial color="#141414" roughness={0.5} />
      </mesh>

      {/* Cabin Roof Frame Overhead */}
      <mesh position={[0, 2.05, 0.1]}>
        <boxGeometry args={[1.75, 0.14, 1.2]} />
        <meshStandardMaterial color="#151515" roughness={0.6} />
      </mesh>

      {/* ==================================================================
          3. MECHANICAL DASHBOARD CONTROLS & GAUGES
          ================================================================== */}
      <group position={[0, 1.05, 0.48]} rotation={[-0.35, 0, 0]}>
        {/* Speedometer Dial Plate (Left Console) */}
        <group position={[-0.45, 0.02, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.18, 24]} />
            <meshStandardMaterial color="#0c0c0c" />
          </mesh>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.18, 24]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
          {/* Dial Needle (Rotates Declaratively) */}
          <mesh position={[0, 0.015, 0]} rotation={[0, 0, needleRotationZ]}>
            <boxGeometry args={[0.02, 0.15, 0.005]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.6} />
          </mesh>
          {/* Digital Speed Sub-Display */}
          <Text
            fontSize={0.065}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.07, 0.02]}
          >
            {`${Math.round(speedKmh)} KM/H`}
          </Text>
        </group>

        {/* Center Digital Navigation & Next Station Display */}
        <group position={[0, 0.02, 0]}>
          {/* Bezel */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.48, 0.24]} />
            <meshStandardMaterial color="#080808" roughness={0.3} />
          </mesh>
          {/* Station Status Readout */}
          <Text
            fontSize={0.045}
            color="#A0A0A0"
            anchorX="center"
            anchorY="middle"
            position={[0, 0.05, 0.01]}
          >
            NEXT STATION
          </Text>
          <Text
            fontSize={0.048}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            position={[0, 0.0, 0.01]}
            maxWidth={0.46}
          >
            {nextStationName.toUpperCase()}
          </Text>
          <Text
            fontSize={0.05}
            color="#D0D0D0"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.06, 0.01]}
          >
            {`${distanceMeters} METERS`}
          </Text>
        </group>

        {/* Mechanical Throttle Lever Assembly (Right Console) */}
        <group position={[0.42, 0.02, 0]}>
          {/* Lever Base Slot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.14, 0.24, 0.02]} />
            <meshStandardMaterial color="#151515" />
          </mesh>
          {/* Throttle Lever Arm (Tilts Declaratively) */}
          <group position={[0, 0.04, 0]} rotation={[throttleRotationX, 0, 0]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.16, 12]} />
              <meshStandardMaterial color="#D0D0D0" metalness={0.8} />
            </mesh>
            {/* Knob */}
            <mesh position={[0, 0.16, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>
          </group>
          {/* Throttle Readout */}
          <Text
            fontSize={0.045}
            color="#A0A0A0"
            anchorX="center"
            anchorY="middle"
            position={[0, -0.08, 0.01]}
          >
            {`PWR ${Math.round(throttlePercent)}%`}
          </Text>
        </group>

        {/* Mechanical Brake Valve Handle (Far Right) */}
        <group position={[0.68, 0.02, 0]}>
          <group position={[0, 0.03, 0]} rotation={[0, 0, brakeRotationZ]}>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.014, 0.014, 0.12, 12]} />
              <meshStandardMaterial color="#888888" metalness={0.6} />
            </mesh>
            {/* Valve Cross Handle */}
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.08, 0.02, 0.02]} />
              <meshStandardMaterial color={brakePercent > 10 ? '#FFFFFF' : '#444444'} />
            </mesh>
          </group>
          <Text
            fontSize={0.045}
            color={brakePercent > 10 ? '#FFFFFF' : '#666666'}
            anchorX="center"
            anchorY="middle"
            position={[0, -0.08, 0.01]}
          >
            {brakePercent > 10 ? 'BRAKE ON' : 'BRAKE OFF'}
          </Text>
        </group>
      </group>
    </group>
  )
}

export default DriverCabin
