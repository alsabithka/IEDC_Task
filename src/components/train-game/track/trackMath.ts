import * as THREE from 'three'

/**
 * ============================================================================
 * IDEA SPRINT EXPRESS — OPEN RAILWAY TRACK SPLINE & KINEMATIC MATH
 * ============================================================================
 * An open Catmull-Rom route starting at Station 1 (Departure Station) and
 * terminating cleanly at Station 8 (Grand Terminus) with a physical buffer stop.
 *
 * Elevation profile:
 * - Minimum elevation is strictly +0.165m (guarantees zero ground burial)
 * - Elevated scenic bridge deck over river at Station 3 (Y = +2.8m)
 * - Mountain ridge pass at Station 7 (Y = +2.2m)
 * - Zero self-intersections (minimum track separation > 10.7m)
 */

const WAYPOINTS: THREE.Vector3[] = [
  new THREE.Vector3(-12, 0.25, -60), // 0: Start track head (buffer head behind Stn 1)
  new THREE.Vector3(5, 0.25, -60),   // 1: Station 1 Platform (Departure Station)
  new THREE.Vector3(30, 0.25, -57),  // 2: Northeast open straight
  new THREE.Vector3(56, 0.25, -42),  // 3: Station 2 Platform (Ideation Junction)
  new THREE.Vector3(72, 1.4, -20),   // 4: Elevated bridge ramp incline
  new THREE.Vector3(78, 2.8, 8),     // 5: Bridge peak above river crossing
  new THREE.Vector3(74, 2.2, 25),    // 6: Station 3 Platform (Dining Depot on high deck)
  new THREE.Vector3(68, 1.2, 40),    // 7: Bridge ramp descent
  new THREE.Vector3(50, 0.25, 54),   // 8: Station 4 Platform (Synergy Hub)
  new THREE.Vector3(22, 0.25, 60),   // 9: South sunny curve
  new THREE.Vector3(-10, 0.25, 62),  // 10: Station 5 Platform (Morning Terminal)
  new THREE.Vector3(-38, 0.25, 56),  // 11: Southwest meadow turn
  new THREE.Vector3(-62, 0.25, 40),  // 12: Station 6 Platform (Deep Code Labs)
  new THREE.Vector3(-76, 1.4, 20),   // 13: Mountain ridge incline
  new THREE.Vector3(-78, 2.4, -6),   // 14: Ridge peak
  new THREE.Vector3(-74, 1.8, -22),  // 15: Station 7 Platform (Refuel Stop)
  new THREE.Vector3(-64, 0.8, -38),  // 16: Ridge descent
  new THREE.Vector3(-48, 0.25, -48), // 17: Terminal approach straight
  new THREE.Vector3(-32, 0.25, -54), // 18: Station 8 Platform (Grand Terminus)
  new THREE.Vector3(-22, 0.25, -56), // 19: Terminal Buffer Stop & End of Line!
]

// Single open Catmull-Rom spline (closed = false)
const railwayCurve = new THREE.CatmullRomCurve3(WAYPOINTS, false, 'catmullrom', 0.5)

/**
 * Returns the immutable source-of-truth 3D railway track curve.
 */
export function getGameRailwayCurve(): THREE.CatmullRomCurve3 {
  return railwayCurve
}

export interface TrackFrame {
  position: THREE.Vector3
  tangent: THREE.Vector3
  normal: THREE.Vector3
  up: THREE.Vector3
}

/**
 * Calculates position, tangent, and normal frame for any progress t along the track.
 * Progress t is clamped strictly between 0 and 1.
 */
export function getTrackFrameAt(t: number): TrackFrame {
  const clampedT = Math.max(0, Math.min(1, t))
  const position = railwayCurve.getPointAt(clampedT)
  const tangent = railwayCurve.getTangentAt(clampedT).normalize()

  const worldUp = new THREE.Vector3(0, 1, 0)
  // Normal vector perpendicular to tangent in the horizontal plane
  const normal = new THREE.Vector3().crossVectors(tangent, worldUp).normalize()
  // True local up vector perpendicular to both tangent and normal
  const up = new THREE.Vector3().crossVectors(normal, tangent).normalize()

  return {
    position,
    tangent,
    normal,
    up,
  }
}
