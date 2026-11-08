import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getTrackFrameAt } from '../track/trackMath'
import type { TrainInputState } from '../controls/useTrainControls'

interface DriverCameraProps {
  trackProgress: number
  speedKmh: number
  inputRef?: React.RefObject<TrainInputState>
}

export const DriverCamera: React.FC<DriverCameraProps> = ({
  trackProgress,
  speedKmh,
  inputRef,
}) => {
  // Current smoothed look offsets
  const smoothedLook = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    // 1. Dynamic Responsive Aspect Ratio & FOV Adjustment
    const aspect = state.size.width / state.size.height
    const pCam = state.camera as THREE.PerspectiveCamera

    if (pCam && pCam.isPerspectiveCamera) {
      // Target a natural, cinematic horizontal field of view (~84 degrees in landscape)
      let targetFov: number
      if (aspect >= 1.2) {
        // Landscape mode: derive vertical FOV from target horizontal FOV = 84 deg
        const targetHalfHRad = (84 / 2) * (Math.PI / 180)
        const targetHalfVRad = Math.atan(Math.tan(targetHalfHRad) / aspect)
        targetFov = THREE.MathUtils.clamp((targetHalfVRad * 2 * 180) / Math.PI, 38, 56)
      } else {
        // Portrait mode
        targetFov = 58
      }

      if (Math.abs(pCam.fov - targetFov) > 0.3) {
        pCam.fov = targetFov
        pCam.updateProjectionMatrix()
      }
    }

    // 2. Get locomotive world position and direction from the track curve
    const { position: trackPos, tangent, normal, up } = getTrackFrameAt(trackProgress)

    // 3. Compute Driver's Eye position:
    // Moved forward past the enclosed cabin so there is no inside cockpit enclosure,
    // positioning the camera to just show the lower edge of the console and levers.
    const eyeHeight = 1.22
    const forwardOffset = 0.08
    const sideOffset = 0.0

    // Add subtle speed vibration / track click-clack when moving
    const absSpeed = Math.abs(speedKmh)
    const speedRatio = Math.min(1.0, absSpeed / 60)
    const rumble =
      absSpeed > 0.8
        ? (Math.sin(state.clock.elapsedTime * 22) * 0.004 +
           Math.sin(state.clock.elapsedTime * 11) * 0.002) * speedRatio
        : 0

    // Subtle lateral sway on curves
    const lateralSway =
      absSpeed > 0.8
        ? Math.sin(state.clock.elapsedTime * 4.5) * 0.0035 * speedRatio
        : 0

    const eyePosition = new THREE.Vector3()
      .copy(trackPos)
      .addScaledVector(up, eyeHeight + rumble)
      .addScaledVector(tangent, forwardOffset)
      .addScaledVector(normal, sideOffset + lateralSway)

    state.camera.position.copy(eyePosition)

    // 4. Compute Base Forward Look Direction along Track Tangent
    // Look 20m ahead with a subtle natural downward pitch to frame rails, horizon and lower levers
    const forwardTarget = new THREE.Vector3()
      .copy(eyePosition)
      .addScaledVector(tangent, 20)
      .addScaledVector(up, -1.3)

    // 5. Smooth Camera Look Interpolation (Controlled via Touch/Mouse windshield drag)
    const targetLookX = inputRef?.current?.cameraLookX ?? 0
    const targetLookY = inputRef?.current?.cameraLookY ?? 0

    smoothedLook.current.x = THREE.MathUtils.lerp(smoothedLook.current.x, targetLookX, 0.14)
    smoothedLook.current.y = THREE.MathUtils.lerp(smoothedLook.current.y, targetLookY, 0.14)

    // 6. Apply Natural Head-Look Angular Offsets (Clamped comfortably inside cabin)
    // Yaw: max +- 22 degrees
    const yawAngle = smoothedLook.current.x * 0.38
    // Pitch: -10 to +8 degrees
    const pitchAngle = smoothedLook.current.y * 0.16

    forwardTarget.addScaledVector(normal, yawAngle * 16)
    forwardTarget.addScaledVector(up, pitchAngle * 10)

    state.camera.lookAt(forwardTarget)
  })

  return null
}

export default DriverCamera
