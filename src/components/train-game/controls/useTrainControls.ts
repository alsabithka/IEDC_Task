import { useEffect, useRef } from 'react'

export interface TrainInputState {
  throttleUp: boolean
  throttleDown: boolean
  brake: boolean
  interact: boolean
  pause: boolean
  targetThrottlePercent: number | null
  cameraLookX: number
  cameraLookY: number
}

export interface UseTrainControlsOptions {
  onInteract?: () => void
  onTogglePause?: () => void
}

export function useTrainControls(options?: UseTrainControlsOptions) {
  const inputRef = useRef<TrainInputState>({
    throttleUp: false,
    throttleDown: false,
    brake: false,
    interact: false,
    pause: false,
    targetThrottlePercent: null,
    cameraLookX: 0,
    cameraLookY: 0,
  })

  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          inputRef.current.throttleUp = true
          inputRef.current.targetThrottlePercent = null
          break
        case 'KeyS':
        case 'ArrowDown':
          inputRef.current.throttleDown = true
          inputRef.current.targetThrottlePercent = null
          break
        case 'Space':
          inputRef.current.brake = true
          break
        case 'KeyE':
          inputRef.current.interact = true
          optionsRef.current?.onInteract?.()
          break
        case 'Escape':
          inputRef.current.pause = true
          optionsRef.current?.onTogglePause?.()
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          inputRef.current.throttleUp = false
          break
        case 'KeyS':
        case 'ArrowDown':
          inputRef.current.throttleDown = false
          break
        case 'Space':
          inputRef.current.brake = false
          break
        case 'KeyE':
          inputRef.current.interact = false
          break
        case 'Escape':
          inputRef.current.pause = false
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Virtual touch button callbacks for mobile
  const setMobileThrottle = (direction: 'up' | 'down', active: boolean) => {
    inputRef.current.targetThrottlePercent = null
    if (direction === 'up') inputRef.current.throttleUp = active
    if (direction === 'down') inputRef.current.throttleDown = active
  }

  // Direct vertical slider throttle (0 to 100)
  const setSliderThrottle = (percent: number) => {
    inputRef.current.targetThrottlePercent = Math.max(0, Math.min(100, percent))
    inputRef.current.throttleUp = false
    inputRef.current.throttleDown = false
  }

  const setMobileBrake = (active: boolean) => {
    inputRef.current.brake = active
  }

  const setCameraLook = (x: number, y: number) => {
    inputRef.current.cameraLookX = Math.max(-1, Math.min(1, x))
    inputRef.current.cameraLookY = Math.max(-1, Math.min(1, y))
  }

  const triggerMobileInteract = () => {
    optionsRef.current?.onInteract?.()
  }

  return {
    inputRef,
    setMobileThrottle,
    setSliderThrottle,
    setMobileBrake,
    setCameraLook,
    triggerMobileInteract,
  }
}
