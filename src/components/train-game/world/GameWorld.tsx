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

interface GameWorldProps {
  dynamics: TrainDynamics
  activeStationId: string | null
  isAtStation: boolean
  onPhysicsTick: (delta: number) => void
}

export const GameWorld: React.FC<GameWorldProps> = ({
  dynamics,
  activeStationId,
  isAtStation,
  onPhysicsTick,
}) => {
  // Run physics update on frame
  useFrame((_, delta) => {
    onPhysicsTick(delta)
  })

  return (
    <>
      {/* 1. Vibrant Cartoon Sky & Atmospheric Horizon Fog */}
      <color attach="background" args={['#60A5FA']} />
      <fog attach="fog" args={['#93C5FD', 55, 210]} />

      {/* 2. Soft Floating 3D Cartoon Clouds */}
      <CartoonClouds />

      {/* 3. Warm Sunlight & Balanced Sky Lighting */}
      <ambientLight intensity={0.9} color="#FFFBEB" />
      <hemisphereLight
        args={['#60A5FA', '#4ADE80', 1.2]}
      />
      <directionalLight
        position={[50, 65, 35]}
        intensity={2.6}
        color="#FFFDF0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={160}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-bias={-0.0003}
      />
      <directionalLight position={[-45, 25, -45]} intensity={0.7} color="#BFDBFE" />

      {/* 3. First-Person Camera inside Locomotive Cabin */}
      <DriverCamera
        trackProgress={dynamics.trackProgress}
        speedKmh={dynamics.speedKmh}
      />

      {/* 4. Locomotive & Driver's Cockpit */}
      <TrainLocomotive
        trackProgress={dynamics.trackProgress}
        speedKmh={dynamics.speedKmh}
        throttlePercent={dynamics.throttlePercent}
        brakePercent={dynamics.brakePercent}
      />

      {/* 5. 3D Railway Track with Rails, Sleepers & Bridge Pillars */}
      <RailwayTrack />

      {/* 6. Surrounding Stylized Low-Poly Terrain, Trees & Signals */}
      <RailwayEnvironment />

      {/* 7. Physical Event Stations along the Track */}
      {GAME_STATIONS.map((station) => (
        <RailwayStation
          key={station.id}
          station={station}
          isTrainStoppedHere={isAtStation && activeStationId === station.id}
        />
      ))}
    </>
  )
}

export default GameWorld
