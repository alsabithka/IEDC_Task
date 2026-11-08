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
  const brakePressureNeedleZ = 1.2 - (brakePercent / 100) * 1.8
  const ammeterNeedleZ = -1.1 + (throttlePercent / 100) * 2.2
  const boilerPressureNeedleZ = 0.35 + Math.sin(speedKmh * 0.1) * 0.15

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

      {/* Angled Upper Instrument Console (Polished Midnight Charcoal, angled toward driver) */}
      <mesh position={[0, 0.78, 0.52]} rotation={[0.42, 0, 0]} receiveShadow>
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
          3. MECHANICAL DASHBOARD CONTROLS & BUTTONS CONSOLE (Framed for Driver View)
          ================================================================== */}
      <group position={[0, 0.86, 0.58]} rotation={[0.38, 0, 0]}>
        {/* Main Console Steel Deck Bed */}
        <mesh position={[0, -0.01, 0.01]} receiveShadow>
          <boxGeometry args={[0.96, 0.04, 0.28]} />
          <meshStandardMaterial color="#0B1120" metalness={0.65} roughness={0.35} />
        </mesh>

        {/* Polished Teak Wood Front Lip Border */}
        <mesh position={[0, 0.012, 0.145]}>
          <boxGeometry args={[0.98, 0.025, 0.02]} />
          <meshStandardMaterial color="#451A03" roughness={0.6} />
        </mesh>

        {/* Twin Horizontal Copper Pneumatic Conduit Pipes */}
        <mesh position={[0, 0.022, -0.11]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.94, 12]} />
          <meshStandardMaterial color="#B45309" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.022, -0.085]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.006, 0.006, 0.94, 12]} />
          <meshStandardMaterial color="#D97706" metalness={0.85} roughness={0.2} />
        </mesh>

        {/* Industrial Hex Fastener Bolts across top edge */}
        {[-0.44, -0.36, -0.28, -0.20, -0.12, -0.04, 0.04, 0.12, 0.20, 0.28, 0.36, 0.44].map((bx, idx) => (
          <mesh key={`bolt-${idx}`} position={[bx, 0.015, -0.128]}>
            <cylinderGeometry args={[0.005, 0.005, 0.008, 6]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} />
          </mesh>
        ))}

        {/* ── 3A. LEFT WING: DUAL AIR-BRAKE GAUGES, E-STOP & TOGGLE SWITCHES ── */}

        {/* Gauge 1: Main Speedometer & Air Pressure (x = -0.31, z = -0.02) */}
        <group position={[-0.31, 0.015, -0.02]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.065, 24]} />
            <meshStandardMaterial color="#FFFBEB" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.06, 0.076, 24]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Red Speedometer Needle (reacts to train speed!) */}
          <mesh position={[0, 0.01, 0]} rotation={[0, 0, needleRotationZ]}>
            <boxGeometry args={[0.008, 0.055, 0.004]} />
            <meshStandardMaterial color="#DC2626" emissive="#DC2626" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.006, 12]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} />
          </mesh>
        </group>

        {/* Gauge 2: Equalizing Brake Pipe Pressure (x = -0.20, z = -0.02) */}
        <group position={[-0.20, 0.015, -0.02]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.065, 24]} />
            <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.06, 0.076, 24]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Reactive Cyan Brake Pipe Needle (Drops when braking!) */}
          <mesh position={[0, 0.01, 0]} rotation={[0, 0, brakePressureNeedleZ]}>
            <boxGeometry args={[0.008, 0.055, 0.004]} />
            <meshStandardMaterial color="#0284C7" emissive="#0284C7" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.006, 12]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} />
          </mesh>
        </group>

        {/* Emergency Stop Red Mushroom Button (x = -0.32, z = 0.065) */}
        <group position={[-0.32, 0.015, 0.065]}>
          {/* Yellow Beveled Safety Base Collar */}
          <mesh position={[0, 0.005, 0]}>
            <cylinderGeometry args={[0.038, 0.044, 0.012, 16]} />
            <meshStandardMaterial color="#FACC15" roughness={0.4} />
          </mesh>
          {/* Crimson Red Mushroom Head */}
          <mesh position={[0, 0.022, 0]}>
            <sphereGeometry args={[0.028, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#DC2626" roughness={0.25} />
          </mesh>
        </group>

        {/* Bank of 4 Chrome Toggle Switches with Indicator Lamps (x = -0.20 to -0.11, z = 0.06) */}
        <group position={[-0.18, 0.015, 0.055]}>
          {/* Steel Switch Plate */}
          <mesh position={[0.03, 0.003, 0]}>
            <boxGeometry args={[0.18, 0.008, 0.07]} />
            <meshStandardMaterial color="#1E293B" metalness={0.7} roughness={0.3} />
          </mesh>
          {[-0.045, -0.015, 0.015, 0.045].map((sx, idx) => (
            <group key={`l-sw-${idx}`} position={[sx + 0.03, 0.008, 0.01]}>
              {/* Chrome Collar */}
              <mesh>
                <cylinderGeometry args={[0.007, 0.009, 0.008, 8]} />
                <meshStandardMaterial color="#94A3B8" metalness={0.9} />
              </mesh>
              {/* Toggle Lever Stem */}
              <mesh position={[0, 0.014, idx % 2 === 0 ? 0.004 : -0.004]} rotation={[idx % 2 === 0 ? 0.35 : -0.35, 0, 0]}>
                <cylinderGeometry args={[0.003, 0.0035, 0.022, 8]} />
                <meshStandardMaterial color="#F1F5F9" metalness={0.9} roughness={0.1} />
              </mesh>
              {/* Jeweled LED Status Lamp above switch */}
              <mesh position={[0, 0.005, -0.028]}>
                <sphereGeometry args={[0.0055, 10, 10]} />
                <meshStandardMaterial
                  color={['#10B981', '#F59E0B', '#38BDF8', '#EF4444'][idx]}
                  emissive={['#10B981', '#F59E0B', '#38BDF8', '#EF4444'][idx]}
                  emissiveIntensity={1.8}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* ── 3B. CENTER: NAVIGATION RADAR SCREEN, TACTILE BUTTONS & BRASS PLAQUE ── */}

        {/* Compact Navigation Radar Display (x = 0, z = -0.025) */}
        <group position={[0, 0.015, -0.025]}>
          {/* Monitor Screen Frame */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 0.10]} />
            <meshStandardMaterial color="#020617" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.095, 0.11, 4]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} />
          </mesh>
          {/* Glowing Animated Telemetry Signal Bars */}
          <mesh position={[0, 0.007, -0.022]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.16, 0.012]} />
            <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0, 0.007, 0.002]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.13, 0.012]} />
            <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[0, 0.007, 0.026]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.10, 0.012]} />
            <meshStandardMaterial color="#4ADE80" emissive="#4ADE80" emissiveIntensity={1.5} />
          </mesh>
        </group>

        {/* 4 Colorful Tactile Industrial Pushbuttons (x = [-0.075, -0.025, 0.025, 0.075], z = 0.045) */}
        <group position={[0, 0.015, 0.045]}>
          {[-0.075, -0.025, 0.025, 0.075].map((btnX, bIdx) => (
            <group key={`btn-${bIdx}`} position={[btnX, 0, 0]}>
              {/* Beveled Square Housing */}
              <mesh position={[0, 0.004, 0]}>
                <boxGeometry args={[0.036, 0.010, 0.036]} />
                <meshStandardMaterial color="#1E293B" metalness={0.7} />
              </mesh>
              {/* Backlit Tactile Center Dome */}
              <mesh position={[0, 0.011, 0]}>
                <cylinderGeometry args={[0.012, 0.013, 0.008, 14]} />
                <meshStandardMaterial
                  color={['#22C55E', '#F59E0B', '#3B82F6', '#EF4444'][bIdx]}
                  emissive={['#22C55E', '#F59E0B', '#3B82F6', '#EF4444'][bIdx]}
                  emissiveIntensity={1.2}
                  roughness={0.3}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* Polished Cast Brass Locomotive Builder Plaque (x = 0, z = 0.085) */}
        <group position={[0, 0.012, 0.085]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.20, 0.032, 0.005]} />
            <meshStandardMaterial color="#D97706" metalness={0.85} roughness={0.3} />
          </mesh>
          {/* 4 Corner Brass Rivets */}
          {[-0.085, 0.085].map((rx, rIdx) => (
            <React.Fragment key={`plaque-rivets-${rIdx}`}>
              <mesh position={[rx, 0.005, -0.01]}>
                <sphereGeometry args={[0.003, 8, 8]} />
                <meshStandardMaterial color="#FEF08A" metalness={0.9} />
              </mesh>
              <mesh position={[rx, 0.005, 0.01]}>
                <sphereGeometry args={[0.003, 8, 8]} />
                <meshStandardMaterial color="#FEF08A" metalness={0.9} />
              </mesh>
            </React.Fragment>
          ))}
        </group>

        {/* ── 3C. RIGHT WING: AMMETER, STEAM DIAL, THROTTLE & REVERSER LEVERS ── */}

        {/* Traction Motor Ammeter Gauge (x = +0.16, z = -0.02) */}
        <group position={[0.16, 0.015, -0.02]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.065, 24]} />
            <meshStandardMaterial color="#0B132B" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.06, 0.076, 24]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Load Arc (Green-to-Red) */}
          <mesh position={[0, 0.008, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
            <ringGeometry args={[0.045, 0.054, 16, 1, 0, Math.PI * 0.9]} />
            <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.8} />
          </mesh>
          {/* Reactive Ammeter Needle (Rises with throttle opening!) */}
          <mesh position={[0, 0.01, 0]} rotation={[0, 0, ammeterNeedleZ]}>
            <boxGeometry args={[0.008, 0.052, 0.004]} />
            <meshStandardMaterial color="#FACC15" emissive="#FACC15" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Boiler Steam Pressure Dial (x = +0.26, z = -0.02) */}
        <group position={[0.26, 0.015, -0.02]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.055, 20]} />
            <meshStandardMaterial color="#1E293B" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.05, 0.065, 20]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Amber Steam Needle */}
          <mesh position={[0, 0.01, 0]} rotation={[0, 0, boilerPressureNeedleZ]}>
            <boxGeometry args={[0.007, 0.045, 0.003]} />
            <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Mechanical Throttle Lever & Notched Quadrant (x = +0.16, z = 0.055) */}
        <group position={[0.16, 0.015, 0.055]}>
          {/* Slotted Guide Track Base */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.06, 0.11, 0.01]} />
            <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* Polished Brass Quadrant Notches */}
          {[-0.04, -0.02, 0, 0.02, 0.04].map((nz, nIdx) => (
            <mesh key={`notch-${nIdx}`} position={[0.022, 0.007, nz]}>
              <boxGeometry args={[0.009, 0.005, 0.003]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.8} />
            </mesh>
          ))}
          {/* Animated Throttle Lever with Red Ball Grip */}
          <group position={[0, 0.02, 0]} rotation={[throttleRotationX, 0, 0]}>
            <mesh position={[0, 0.035, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.075, 10]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.85} />
            </mesh>
            <mesh position={[0, 0.075, 0]}>
              <sphereGeometry args={[0.016, 14, 14]} />
              <meshStandardMaterial color="#EF4444" roughness={0.2} metalness={0.1} />
            </mesh>
          </group>
        </group>

        {/* Mechanical Reverser Lever & Slotted Housing (x = +0.25, z = 0.055) */}
        <group position={[0.25, 0.015, 0.055]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <boxGeometry args={[0.055, 0.11, 0.01]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Reverser Handle */}
          <group position={[0, 0.02, -0.015]} rotation={[-0.25, 0, 0]}>
            <mesh position={[0, 0.035, 0]}>
              <cylinderGeometry args={[0.0045, 0.005, 0.07, 8]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.072, 0]}>
              <cylinderGeometry args={[0.009, 0.009, 0.024, 10]} />
              <meshStandardMaterial color="#1E293B" roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* Vintage Brass Whistle / Horn Pull Valve Lever (x = +0.33, z = -0.01) */}
        <group position={[0.33, 0.015, -0.01]}>
          <mesh position={[0, 0.012, 0]}>
            <cylinderGeometry args={[0.012, 0.014, 0.02, 10]} />
            <meshStandardMaterial color="#B45309" metalness={0.85} />
          </mesh>
          <group position={[0, 0.02, -0.01]} rotation={[-0.4, 0, 0]}>
            <mesh position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.004, 0.005, 0.06, 8]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.016, 8]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
          </group>
        </group>

        {/* Secondary Switch Bank with Safety Guards (x = +0.34, z = 0.055) */}
        <group position={[0.34, 0.015, 0.055]}>
          {[-0.02, 0.02].map((gx, gIdx) => (
            <group key={`r-sw-${gIdx}`} position={[gx, 0.006, 0]}>
              <mesh>
                <cylinderGeometry args={[0.006, 0.007, 0.007, 8]} />
                <meshStandardMaterial color="#94A3B8" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0.012, 0.003]} rotation={[0.3, 0, 0]}>
                <cylinderGeometry args={[0.0025, 0.003, 0.018, 8]} />
                <meshStandardMaterial color="#F1F5F9" metalness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}

export default DriverCabin
