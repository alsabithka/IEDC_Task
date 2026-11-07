import React from 'react'
import { useFrame } from '@react-three/fiber'
import { DriverCamera } from '../locomotive/DriverCamera'
import { TrainLocomotive } from '../locomotive/TrainLocomotive'
import { RailwayTrack } from '../track/RailwayTrack'
import { RailwayEnvironment } from '../environment/RailwayEnvironment'
import { RailwayStation } from '../stations/RailwayStation'
import { GAME_STATIONS } from '../../../config/trainGameConfig'
import type { TrainDynamics } from '../controls/useGameProgress'

interface GameWorldProps {
  dynamics: TrainDynamics
  nextStationName: string
  distanceMeters: number
  activeStationId: string | null
  isAtStation: boolean
  onPhysicsTick: (delta: number) => void
}

export const GameWorld: React.FC<GameWorldProps> = ({
  dynamics,
  nextStationName,
  distanceMeters,
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
      {/* 1. Atmospheric Sky & Horizon Fog */}
      <color attach="background" args={['#070707']} />
      <fog attach="fog" args={['#070707', 35, 140]} />

      {/* 2. Natural Sun & Ambient Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[45, 55, 30]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={140}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-40, 20, -40]} intensity={0.6} />

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
        nextStationName={nextStationName}
        distanceMeters={distanceMeters}
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
