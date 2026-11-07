import React from 'react'
import { useFrame } from '@react-three/fiber'
import { DriverCamera } from '../locomotive/DriverCamera'
import { TrainLocomotive } from '../locomotive/TrainLocomotive'
import { RailwayTrack } from '../track/RailwayTrack'
import { RailwayEnvironment } from '../environment/RailwayEnvironment'
import { RailwayStation } from '../stations/RailwayStation'
import { CartoonClouds } from '../environment/CartoonClouds'
import { GAME_STATIONS } from '../../../config/trainGameConfig'
import type { TrainDynamics } from '../controls/useGameProgress'
import type { TrainInputState } from '../controls/useTrainControls'
import type { GraphicsProfileConfig } from '../graphics/graphicsProfiles'

interface GameWorldProps {
  dynamics: TrainDynamics
  activeStationId: string | null
  isAtStation: boolean
  onPhysicsTick: (delta: number) => void
  profile: GraphicsProfileConfig
  inputRef: React.RefObject<TrainInputState>
  onFrameTick?: (time: number) => void
}

export const GameWorld: React.FC<GameWorldProps> = ({
  dynamics,
  activeStationId,
  isAtStation,
  onPhysicsTick,
  profile,
  inputRef,
  onFrameTick,
}) => {
  // Run physics update & performance counter on frame
  useFrame((state, delta) => {
    onPhysicsTick(delta)
    onFrameTick?.(state.clock.elapsedTime * 1000)
  })

  return (
    <>
      {/* 1. Sky & Profile-Adapted Fog Distance */}
      <color attach="background" args={['#60A5FA']} />
      <fog attach="fog" args={['#93C5FD', 45, profile.fogFar]} />

      {/* 2. Soft Floating 3D Cartoon Clouds */}
      <CartoonClouds driftEnabled={profile.enableCloudsDrift} />

      {/* 3. Sunlight & Balanced Sky Lighting */}
      <ambientLight intensity={profile.shadows ? 0.9 : 1.15} color="#FFFBEB" />
      <hemisphereLight args={['#60A5FA', '#4ADE80', profile.shadows ? 1.2 : 1.35]} />

      {profile.shadows ? (
        <directionalLight
          position={[50, 65, 35]}
          intensity={2.6}
          color="#FFFDF0"
          castShadow
          shadow-mapSize-width={profile.shadowMapSize}
          shadow-mapSize-height={profile.shadowMapSize}
          shadow-camera-far={160}
          shadow-camera-left={-65}
          shadow-camera-right={65}
          shadow-camera-top={65}
          shadow-camera-bottom={-65}
          shadow-bias={-0.0003}
        />
      ) : (
        <directionalLight position={[50, 65, 35]} intensity={2.2} color="#FFFDF0" />
      )}

      <directionalLight position={[-45, 25, -45]} intensity={0.6} color="#BFDBFE" />

      {/* 4. First-Person Camera inside Cabin with touch-look input */}
      <DriverCamera
        trackProgress={dynamics.trackProgress}
        speedKmh={dynamics.speedKmh}
        inputRef={inputRef}
      />

      {/* 5. Locomotive Cockpit */}
      <TrainLocomotive
        trackProgress={dynamics.trackProgress}
        speedKmh={dynamics.speedKmh}
        throttlePercent={dynamics.throttlePercent}
        brakePercent={dynamics.brakePercent}
      />

      {/* 6. 3D Track with Instanced Sleepers and Bridge Pillars */}
      <RailwayTrack shadowsEnabled={profile.shadows} />

      {/* 7. Scaled Vegetation & Environment */}
      <RailwayEnvironment
        vegetationDensity={profile.vegetationDensity}
        shadowsEnabled={profile.shadows}
      />

      {/* 8. Event Stations with Distance LOD Culling */}
      {GAME_STATIONS.map((station) => (
        <RailwayStation
          key={station.id}
          station={station}
          isTrainStoppedHere={isAtStation && activeStationId === station.id}
          trainTrackProgress={dynamics.trackProgress}
          lodDistanceMeters={profile.stationLodDistance}
        />
      ))}
    </>
  )
}

export default GameWorld
