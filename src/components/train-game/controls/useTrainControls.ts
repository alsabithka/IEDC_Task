import { useEffect, useRef } from 'react'

export interface TrainInputState {
  throttleUp: boolean
  throttleDown: boolean
  brake: boolean
  interact: boolean
  pause: boolean
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
          break
        case 'KeyS':
        case 'ArrowDown':
          inputRef.current.throttleDown = true
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
    if (direction === 'up') inputRef.current.throttleUp = active
    if (direction === 'down') inputRef.current.throttleDown = active
  }

  const setMobileBrake = (active: boolean) => {
    inputRef.current.brake = active
  }

  const triggerMobileInteract = () => {
    optionsRef.current?.onInteract?.()
  }

  return {
    inputRef,
    setMobileThrottle,
    setMobileBrake,
    triggerMobileInteract,
  }
}
