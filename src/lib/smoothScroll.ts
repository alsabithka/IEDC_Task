import type Lenis from 'lenis'

let globalLenis: Lenis | null = null

/**
 * Sets the active global Lenis instance.
 */
export const setLenis = (instance: Lenis | null): void => {
  globalLenis = instance
}

/**
 * Returns the active global Lenis instance, or null if unmounted or inactive.
 */
export const getLenis = (): Lenis | null => {
  return globalLenis
}

/**
 * Smoothly scrolls to a target element or selector using Lenis when available,
 * falling back to native smooth scrolling.
 */
export const smoothScrollTo = (
  target: string | HTMLElement,
  options: { offset?: number; duration?: number; immediate?: boolean } = {}
): void => {
  if (typeof window === 'undefined') return
  const { offset = 0, duration = 1.2, immediate = false } = options

  if (globalLenis) {
    globalLenis.scrollTo(target, {
      offset,
      duration: immediate ? 0 : duration,
      immediate,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    return
  }

  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (el) {
    el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
  }
}
