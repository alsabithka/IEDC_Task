import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getTrackFrameAt } from '../track/trackMath'

interface DriverCameraProps {
  trackProgress: number
  speedKmh: number
}

export const DriverCamera: React.FC<DriverCameraProps> = ({
  trackProgress,
  speedKmh,
}) => {
  const { camera } = useThree()

  // Head look mouse offset (constrained normalized -1 to +1)
  const pointerLook = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      // Normalized from center of screen (-1 to +1)
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      pointerLook.current.x = THREE.MathUtils.clamp(nx, -1, 1)
      pointerLook.current.y = THREE.MathUtils.clamp(ny, -1, 1)
    }

    window.addEventListener('mousemove', handlePointerMove)
    return () => window.removeEventListener('mousemove', handlePointerMove)
  }, [])

  useFrame((state) => {
    // 1. Get locomotive world position and direction from the track curve
    const { position: trackPos, tangent, normal, up } = getTrackFrameAt(trackProgress)

    // 2. Compute Driver's Eye position inside the locomotive cabin:
    // Offset along track + up + forward
    const eyeHeight = 1.42
    const forwardOffset = 0.15
    const sideOffset = 0.0

    // Add subtle speed vibration / track joint click-clack (only when moving)
    const absSpeed = Math.abs(speedKmh)
    const speedRatio = Math.min(1.0, absSpeed / 60)
    const rumble =
      absSpeed > 0.8
        ? (Math.sin(state.clock.elapsedTime * 22) * 0.006 +
           Math.sin(state.clock.elapsedTime * 11) * 0.003) * speedRatio
        : 0

    // Subtle lateral sway on curves
    const lateralSway =
      absSpeed > 0.8
        ? Math.sin(state.clock.elapsedTime * 4.5) * 0.005 * speedRatio
        : 0

    const eyePosition = new THREE.Vector3()
      .copy(trackPos)
      .addScaledVector(up, eyeHeight + rumble)
      .addScaledVector(tangent, forwardOffset)
      .addScaledVector(normal, sideOffset + lateralSway)

    camera.position.copy(eyePosition)

    // 3. Compute Base Forward Look Direction along Track Tangent
    const forwardTarget = new THREE.Vector3()
      .copy(eyePosition)
      .addScaledVector(tangent, 16) // Look ahead on track

    // 4. Apply Natural Head-Look Angular Offsets (Constrained inside cabin)
    // Yaw: max +- 24 degrees (0.42 rad)
    const yawAngle = -pointerLook.current.x * 0.42
    // Pitch: -12 to +8 degrees (-0.21 to +0.14 rad)
    const pitchAngle = pointerLook.current.y * 0.18

    // Offset look target based on head turn
    forwardTarget.addScaledVector(normal, yawAngle * 14)
    forwardTarget.addScaledVector(up, pitchAngle * 9)

    camera.lookAt(forwardTarget)
  })

  return null
}

export default DriverCamera
