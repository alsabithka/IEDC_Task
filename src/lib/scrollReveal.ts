import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * In-memory registry of completed scroll reveals for the current page session.
 * 
 * - Cleared automatically on full browser reload (F5 / hard refresh).
 * - Persists across client-side navigation (e.g. visiting 3D train game and returning).
 * - Persists across React component remounts.
 * - Strictly DOES NOT use sessionStorage or localStorage.
 */
const completedRevealIds = new Set<string>()

export const isRevealCompleted = (id: string): boolean => {
  return completedRevealIds.has(id)
}

export const markRevealCompleted = (id: string): void => {
  completedRevealIds.add(id)
}

export const getCompletedRevealCount = (): number => {
  return completedRevealIds.size
}

export interface AnimateRevealOptions {
  id: string
  trigger?: HTMLElement | null
  start?: string
  y?: number
  duration?: number
  stagger?: number
}

/**
 * Registers a one-time scroll reveal animation on the target element(s).
 * 
 * - If already completed in the current page load, targets immediately display with full opacity.
 * - If user prefers reduced motion, animations are bypassed and elements display normally.
 * - Animates with subtle opacity and vertical translation (y: 20px -> 0px).
 * - Cleans up transform properties upon completion (clearProps: 'transform').
 */
export const animateReveal = (
  targets: gsap.TweenTarget,
  options: AnimateRevealOptions
): ScrollTrigger | null => {
  if (typeof window === 'undefined') return null

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  // 1. Reduced motion guard
  if (prefersReducedMotion) {
    completedRevealIds.add(options.id)
    gsap.set(targets, { opacity: 1, y: 0, clearProps: 'all' })
    return null
  }

  // 2. One-time-per-page-load guard
  if (completedRevealIds.has(options.id)) {
    gsap.set(targets, { opacity: 1, y: 0, clearProps: 'all' })
    return null
  }

  const triggerEl = options.trigger || (targets as HTMLElement)
  if (!triggerEl) return null

  // 3. One-time ScrollTrigger entrance
  return ScrollTrigger.create({
    trigger: triggerEl,
    start: options.start || 'top 88%',
    once: true,
    onEnter: () => {
      completedRevealIds.add(options.id)
      gsap.fromTo(
        targets,
        { opacity: 0, y: options.y ?? 20 },
        {
          opacity: 1,
          y: 0,
          duration: options.duration ?? 0.65,
          stagger: options.stagger ?? 0.08,
          ease: 'power2.out',
          clearProps: 'transform',
        }
      )
    },
  })
}
