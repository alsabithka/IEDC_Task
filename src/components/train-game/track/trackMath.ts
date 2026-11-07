import * as THREE from 'three'

// 14-Waypoint Scenic Circuit defining the 3D Railway Track
const RAW_TRACK_POINTS = [
  new THREE.Vector3(-70, 0, -45), // 0: Station 1 (Departure)
  new THREE.Vector3(-30, 0, -60), // 1: North Valley straight
  new THREE.Vector3(25, 0, -55),  // 2: Station 2 (Ideation)
  new THREE.Vector3(65, 1.8, -40),// 3: Bridge Incline
  new THREE.Vector3(80, 2.4, -5), // 4: Station 3 (Dining Depot)
  new THREE.Vector3(75, 1.2, 35), // 5: Bridge Decline
  new THREE.Vector3(40, 0, 60),   // 6: Station 4 (Synergy Hub)
  new THREE.Vector3(-10, 0, 65),  // 7: South Plains
  new THREE.Vector3(-55, 0, 50),  // 8: Station 5 (Morning Terminal)
  new THREE.Vector3(-80, 1.5, 25),// 9: West Forest Rise
  new THREE.Vector3(-82, 1.8, -5),// 10: Station 6 (Code Labs)
  new THREE.Vector3(-60, 0.8, -25),// 11: Cutting Descent
  new THREE.Vector3(-25, 0, -15), // 12: Station 7 (Refuel)
  new THREE.Vector3(-45, 0, -30), // 13: Station 8 (Grand Terminus) Approach
]

let cachedCurve: THREE.CatmullRomCurve3 | null = null

export function getGameRailwayCurve(): THREE.CatmullRomCurve3 {
  if (!cachedCurve) {
    cachedCurve = new THREE.CatmullRomCurve3(
      RAW_TRACK_POINTS,
      true, // closed loop
      'centripetal',
      0.5
    )
  }
  return cachedCurve
}

/**
 * Calculates position, tangent, and normal along the railway curve at progress t (0 to 1)
 */
export function getTrackFrameAt(t: number): {
  position: THREE.Vector3
  tangent: THREE.Vector3
  normal: THREE.Vector3
  up: THREE.Vector3
} {
  const curve = getGameRailwayCurve()
  const normalizedT = ((t % 1) + 1) % 1
  const position = curve.getPointAt(normalizedT)
  const tangent = curve.getTangentAt(normalizedT).normalize()
  const up = new THREE.Vector3(0, 1, 0)
  const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()

  return { position, tangent, normal, up }
}
