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
  const needleRotationZ = 1.6 - speedRatio * 3.2
  const throttleRotationX = -(throttlePercent / 100) * 0.75
  const brakeRotationZ = (brakePercent / 100) * 0.8

  return (
    <group position={[0, 0, 0]}>
      {/* ==================================================================
          1. FORWARD BOILER & HOOD (Visible through bottom of windshield)
          ================================================================== */}
      <group position={[0, 0.54, 1.8]}>
        {/* Vibrant Crimson Red Enamel Boiler extending ahead */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.56, 0.56, 2.5, 24]} />
          <meshStandardMaterial color="#DC2626" roughness={0.25} metalness={0.15} />
        </mesh>

        {/* Polished Golden Brass Boiler Bands */}
        {[-0.6, 0.1, 0.8].map((z, idx) => (
          <mesh key={`band-${idx}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.575, 0.575, 0.07, 24]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.25} />
          </mesh>
        ))}

        {/* Royal Blue Front Nose Rounding */}
        <mesh position={[0, 0, 1.25]} castShadow>
          <sphereGeometry args={[0.56, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#1D4ED8" roughness={0.3} />
        </mesh>

        {/* Golden Brass Steam Dome */}
        <mesh position={[0, 0.56, 0.1]} castShadow>
          <sphereGeometry args={[0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Charcoal Smokestack with Brass Ring Collar */}
        <group position={[0, 0.68, 0.85]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.12, 0.45, 16]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.06, 16]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* ==================================================================
          2. CABIN ARCHITECTURE (Panoramic Windshield Frame & Dark Dashboard)
          ================================================================== */}
      {/* Front Dashboard Base Deck (Warm Rich Teak Wood Finish) */}
      <mesh position={[0, 0.72, 0.55]} receiveShadow>
        <boxGeometry args={[1.7, 0.44, 0.9]} />
        <meshStandardMaterial color="#2E180D" roughness={0.7} />
      </mesh>

      {/* Angled Upper Dashboard Console (Polished Midnight Charcoal) */}
      <mesh position={[0, 0.95, 0.52]} rotation={[-0.38, 0, 0]} receiveShadow>
        <boxGeometry args={[1.65, 0.32, 0.55]} />
        <meshStandardMaterial color="#0F172A" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Left Windshield Pillar (Cobalt Blue with Gold Bevel) */}
      <mesh position={[-0.85, 1.5, 0.5]} rotation={[0, 0, -0.06]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#1D4ED8" roughness={0.4} />
      </mesh>

      {/* Right Windshield Pillar (Cobalt Blue with Gold Bevel) */}
      <mesh position={[0.85, 1.5, 0.5]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#1D4ED8" roughness={0.4} />
      </mesh>

      {/* Overhead Windshield Top Header Arch (No Center Pillar - Open Panoramic View!) */}
      <mesh position={[0, 2.05, 0.5]}>
        <boxGeometry args={[1.75, 0.08, 0.12]} />
        <meshStandardMaterial color="#1D4ED8" roughness={0.4} />
      </mesh>

      {/* Cabin Roof Frame Overhead */}
      <group position={[0, 2.12, 0.0]}>
        <mesh>
          <boxGeometry args={[1.75, 0.12, 1.1]} />
          <meshStandardMaterial color="#0F172A" roughness={0.6} />
        </mesh>
      </group>

      {/* ==================================================================
          3. MECHANICAL DASHBOARD CONTROLS & GAUGES
          ================================================================== */}
      <group position={[0, 1.05, 0.48]} rotation={[-0.35, 0, 0]}>
        {/* Speedometer Dial Plate (Left Console — Ivory Face & Gold Bezel) */}
        <group position={[-0.45, 0.02, 0]}>
          {/* Dial Face */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.18, 24]} />
            <meshStandardMaterial color="#FFFBEB" roughness={0.3} />
          </mesh>
          {/* Golden Brass Bezel Ring */}
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.19, 24]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Fiery Red Dial Needle (Rotates Declaratively with Speed) */}
          <mesh position={[0, 0.015, 0]} rotation={[0, 0, needleRotationZ]}>
            <boxGeometry args={[0.02, 0.15, 0.005]} />
            <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
          </mesh>
          {/* Dial Pivot Cap */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} />
          </mesh>
        </group>

        {/* Center Illuminated Navigation Radar Screen (High-Tech Retro Console) */}
        <group position={[0, 0.02, 0]}>
          {/* Bezel */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.48, 0.24]} />
            <meshStandardMaterial color="#020617" roughness={0.2} />
          </mesh>
          {/* Gold Screen Outer Border */}
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.22, 0.24, 4]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.7} />
          </mesh>

          {/* Illuminated Horizontal Track Signal Level Bars */}
          <mesh position={[0, 0.01, -0.06]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.38, 0.03]} />
            <meshStandardMaterial
              color="#38BDF8"
              emissive="#38BDF8"
              emissiveIntensity={1.5}
            />
          </mesh>
          <mesh position={[0, 0.01, 0.0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.34, 0.03]} />
            <meshStandardMaterial
              color="#FACC15"
              emissive="#FACC15"
              emissiveIntensity={1.5}
            />
          </mesh>
          <mesh position={[0, 0.01, 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.30, 0.03]} />
            <meshStandardMaterial
              color="#4ADE80"
              emissive="#4ADE80"
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Circular Indicator Beacon Lights */}
          <mesh position={[-0.18, 0.015, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.008, 12]} />
            <meshStandardMaterial
              color="#10B981"
              emissive="#10B981"
              emissiveIntensity={2.0}
            />
          </mesh>
          <mesh position={[0.18, 0.015, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.008, 12]} />
            <meshStandardMaterial
              color="#F59E0B"
              emissive="#F59E0B"
              emissiveIntensity={2.0}
            />
          </mesh>
        </group>

        {/* Mechanical Throttle Lever Assembly (Right Console) */}
        <group position={[0.42, 0.02, 0]}>
          {/* Lever Base Slot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.14, 0.24, 0.02]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          {/* Throttle Lever Arm (Tilts Declaratively) */}
          <group position={[0, 0.04, 0]} rotation={[throttleRotationX, 0, 0]}>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.16, 12]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.8} />
            </mesh>
            {/* Glossy Cherry Red Ball Knob */}
            <mesh position={[0, 0.16, 0]}>
              <sphereGeometry args={[0.035, 16, 16]} />
              <meshStandardMaterial color="#EF4444" roughness={0.2} metalness={0.1} />
            </mesh>
          </group>
          {/* Lever Gradation Markings */}
          <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 0.16]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.5} />
          </mesh>
        </group>

        {/* Mechanical Brake Valve Handle (Far Right) */}
        <group position={[0.68, 0.02, 0]}>
          <group position={[0, 0.03, 0]} rotation={[0, 0, brakeRotationZ]}>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.014, 0.014, 0.12, 12]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.7} />
            </mesh>
            {/* Valve Cross Handle (Vibrant Alert Ruby / Golden Yellow) */}
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.09, 0.025, 0.025]} />
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
