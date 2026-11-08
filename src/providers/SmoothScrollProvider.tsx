import React, { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis } from '../lib/smoothScroll'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

export interface SmoothScrollProviderProps {
  children: React.ReactNode
  isPaused?: boolean
}

/**
 * SmoothScrollProvider
 * 
 * Synchronizes Lenis smooth scrolling with GSAP ScrollTrigger using the official ticker:
 * - GSAP ticker drives the RAF loop (autoRaf: false) to prevent duplicate animation loops.
 * - gsap.ticker.lagSmoothing(0) prevents frame skips during heavy loads.
 * - syncTouch: false strictly preserves native momentum touch scrolling on mobile.
 * - Responds to route switches and preloader states without replaying animations.
 */
export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({
  children,
  isPaused = false,
}) => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // If user prefers reduced motion, leave native scrolling completely untouched
    if (prefersReducedMotion) {
      return
    }

    const lenis = new Lenis({
      autoRaf: false, // GSAP ticker drives the RAF loop
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1,
      syncTouch: false, // Strictly preserve native touch scrolling on mobile
    })

    lenisRef.current = lenis
    setLenis(lenis)

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    const handleScroll = () => {
      ScrollTrigger.update()
    }
    lenis.on('scroll', handleScroll)

    // Drive Lenis RAF exclusively from GSAP ticker
    const handleTicker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(handleTicker)
    gsap.ticker.lagSmoothing(0)

    // Initial refresh to ensure ScrollTrigger positions align perfectly with Lenis
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(handleTicker)
      lenis.off('scroll', handleScroll)
      lenis.destroy()
      lenisRef.current = null
      setLenis(null)
    }
  }, [])

  // Manage pause/resume state (e.g. while preloader runs or 3D train game is active)
  useEffect(() => {
    const lenis = lenisRef.current
    if (!lenis) return

    if (isPaused) {
      lenis.stop()
    } else {
      lenis.start()
      ScrollTrigger.refresh()
    }
  }, [isPaused])

  return <>{children}</>
}

export default SmoothScrollProvider
