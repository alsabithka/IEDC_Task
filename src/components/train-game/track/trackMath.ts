import * as THREE from 'three'

// 16-Waypoint Smooth Radial Circuit defining the 3D Railway Track
// Continuous, non-intersecting, zero subterranean dips, smooth curves.
const rx = 78
const rz = 62

const RAW_TRACK_POINTS: THREE.Vector3[] = []
const WAYPOINT_COUNT = 16

for (let i = 0; i < WAYPOINT_COUNT; i++) {
  // Angle around circuit starting from North (-Z) proceeding clockwise
  const angle = (i / WAYPOINT_COUNT) * Math.PI * 2 - Math.PI / 2
  const x = Math.cos(angle) * (rx + (i % 2 === 0 ? 0 : 3))
  const z = Math.sin(angle) * (rz + (i % 2 === 0 ? 0 : 2))

  // Base elevation safely above terrain (y = 0.25)
  let y = 0.25
  // East scenic bridge over river (inclines and elevated bridge deck)
  if (i === 3) y = 1.4
  if (i === 4 || i === 5) y = 2.8
  if (i === 6) y = 1.4
  // West forest mountain cutting (inclines and ridge deck)
  if (i === 11) y = 1.4
  if (i === 12) y = 2.4
  if (i === 13) y = 1.4

  RAW_TRACK_POINTS.push(
    new THREE.Vector3(Number(x.toFixed(2)), y, Number(z.toFixed(2)))
  )
}

let cachedCurve: THREE.CatmullRomCurve3 | null = null

export function getGameRailwayCurve(): THREE.CatmullRomCurve3 {
  if (!cachedCurve) {
    cachedCurve = new THREE.CatmullRomCurve3(
      RAW_TRACK_POINTS,
      true, // closed continuous loop
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
  // Perpendicular outward normal vector relative to tangent
  const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()

  return { position, tangent, normal, up }
}
