import React from 'react'

interface DriverCabinProps {
  speedKmh: number
  throttlePercent: number
  brakePercent: number
}

export const DriverCabin: React.FC<DriverCabinProps> = ({
  speedKmh,
  throttlePercent,
  brakePercent,
}) => {
  // Compute dial needle and lever angles declaratively
  const speedRatio = Math.min(1, Math.max(0, speedKmh / 70))
  const needleRotationZ = 1.5 - speedRatio * 3.0
  const throttleRotationX = -(throttlePercent / 100) * 0.65
  const brakeRotationZ = (brakePercent / 100) * 0.75

  return (
    <group position={[0, 0, 0]}>
      {/* ==================================================================
          1. FORWARD LOCOMOTIVE NOSE & BOILER (Framed below windshield sightline)
          ================================================================== */}
      <group position={[0, 0.38, 1.8]}>
        {/* Sleek Crimson Red Enamel Boiler extending forward */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 2.6, 24]} />
          <meshStandardMaterial color="#DC2626" roughness={0.25} metalness={0.15} />
        </mesh>

        {/* Polished Golden Brass Boiler Bands */}
        {[-0.7, 0.0, 0.7].map((z, idx) => (
          <mesh key={`band-${idx}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.435, 0.435, 0.05, 24]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.25} />
          </mesh>
        ))}

        {/* Royal Blue Front Cowl Nose */}
        <mesh position={[0, 0, 1.3]} castShadow>
          <sphereGeometry args={[0.42, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1D4ED8" roughness={0.3} />
        </mesh>

        {/* Compact Brass Steam Dome (Low profile to keep horizon clear) */}
        <mesh position={[0, 0.40, 0.0]} castShadow>
          <sphereGeometry args={[0.16, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Compact Smokestack with Brass Ring Collar (Kept below windshield line) */}
        <group position={[0, 0.42, 0.85]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.09, 0.28, 16]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.04, 16]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================
          2. WIDE PANORAMIC CABIN ARCHITECTURE (Framed for Landscape Mobile)
          ================================================================== */}
      {/* Front Dashboard Base Deck (Warm Rich Teak Wood Finish, low profile) */}
      <mesh position={[0, 0.65, 0.62]} receiveShadow>
        <boxGeometry args={[3.2, 0.28, 0.75]} />
        <meshStandardMaterial color="#2E180D" roughness={0.7} />
      </mesh>

      {/* Angled Upper Instrument Console (Polished Midnight Charcoal) */}
      <mesh position={[0, 0.78, 0.58]} rotation={[-0.42, 0, 0]} receiveShadow>
        <boxGeometry args={[3.1, 0.24, 0.42]} />
        <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Sleek Left Windshield Pillar (Positioned at X = -1.52m to frame the screen edge) */}
      <mesh position={[-1.52, 1.45, 0.55]} rotation={[0, 0, -0.05]}>
        <boxGeometry args={[0.08, 1.3, 0.08]} />
        <meshStandardMaterial color="#1D4ED8" roughness={0.4} />
      </mesh>

      {/* Sleek Right Windshield Pillar (Positioned at X = +1.52m to frame the screen edge) */}
      <mesh position={[1.52, 1.45, 0.55]} rotation={[0, 0, 0.05]}>
        <boxGeometry args={[0.08, 1.3, 0.08]} />
        <meshStandardMaterial color="#1D4ED8" roughness={0.4} />
      </mesh>

      {/* Left Side Window Frame */}
      <mesh position={[-1.68, 1.40, 0.15]} rotation={[0, 0.12, 0]}>
        <boxGeometry args={[0.06, 0.9, 0.8]} />
        <meshStandardMaterial color="#0F172A" roughness={0.5} />
      </mesh>

      {/* Right Side Window Frame */}
      <mesh position={[1.68, 1.40, 0.15]} rotation={[0, -0.12, 0]}>
        <boxGeometry args={[0.06, 0.9, 0.8]} />
        <meshStandardMaterial color="#0F172A" roughness={0.5} />
      </mesh>

      {/* Overhead Windshield Top Header Arch (Slim line high overhead) */}
      <mesh position={[0, 2.05, 0.55]}>
        <boxGeometry args={[3.2, 0.08, 0.10]} />
        <meshStandardMaterial color="#1D4ED8" roughness={0.4} />
      </mesh>

      {/* Cabin Roof Frame Overhead */}
      <group position={[0, 2.12, 0.1]}>
        <mesh>
          <boxGeometry args={[3.2, 0.10, 1.1]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} />
        </mesh>
      </group>

      {/* ==================================================================
          3. MECHANICAL DASHBOARD CONTROLS & GAUGES (Compact Height)
          ================================================================== */}
      <group position={[0, 0.85, 0.55]} rotation={[-0.40, 0, 0]}>
        {/* Speedometer Dial Plate (Left Console — Ivory Face & Gold Bezel) */}
        <group position={[-0.55, 0.02, 0]}>
          {/* Dial Face */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.14, 24]} />
            <meshStandardMaterial color="#FFFBEB" roughness={0.3} />
          </mesh>
          {/* Golden Brass Bezel Ring */}
          <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.13, 0.155, 24]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Red Dial Needle */}
          <mesh position={[0, 0.012, 0]} rotation={[0, 0, needleRotationZ]}>
            <boxGeometry args={[0.018, 0.12, 0.005]} />
            <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
          </mesh>
          {/* Pivot Cap */}
          <mesh position={[0, 0.016, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.01, 12]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} />
          </mesh>
        </group>

        {/* Center Illuminated Navigation Radar Screen */}
        <group position={[0, 0.02, 0]}>
          {/* Bezel */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.42, 0.18]} />
            <meshStandardMaterial color="#020617" roughness={0.2} />
          </mesh>
          {/* Gold Screen Outer Border */}
          <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.18, 0.20, 4]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.7} />
          </mesh>

          {/* Illuminated Signal Level Bars */}
          <mesh position={[0, 0.008, -0.04]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.32, 0.025]} />
            <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0, 0.008, 0.0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.28, 0.025]} />
            <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0, 0.008, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.24, 0.025]} />
            <meshStandardMaterial color="#4ADE80" emissive="#4ADE80" emissiveIntensity={1.5} />
          </mesh>
        </group>

        {/* Mechanical Throttle Lever Assembly (Right Console) */}
        <group position={[0.52, 0.02, 0]}>
          {/* Lever Base Slot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.12, 0.18, 0.02]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          {/* Throttle Lever Arm (Tilts Declaratively) */}
          <group position={[0, 0.03, 0]} rotation={[throttleRotationX, 0, 0]}>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.010, 0.010, 0.13, 12]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.8} />
            </mesh>
            {/* Cherry Red Ball Knob */}
            <mesh position={[0, 0.12, 0]}>
              <sphereGeometry args={[0.028, 16, 16]} />
              <meshStandardMaterial color="#EF4444" roughness={0.2} metalness={0.1} />
            </mesh>
          </group>
        </group>

        {/* Mechanical Brake Valve Handle (Far Right) */}
        <group position={[0.82, 0.02, 0]}>
          <group position={[0, 0.025, 0]} rotation={[0, 0, brakeRotationZ]}>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.10, 12]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.7} />
            </mesh>
            <mesh position={[0, 0.09, 0]}>
              <boxGeometry args={[0.075, 0.02, 0.02]} />
              <meshStandardMaterial
                color={brakePercent > 10 ? '#EF4444' : '#FACC15'}
                emissive={brakePercent > 10 ? '#DC2626' : '#78350F'}
                emissiveIntensity={brakePercent > 10 ? 0.8 : 0.2}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}

export default DriverCabin
