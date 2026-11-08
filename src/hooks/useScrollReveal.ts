import { useEffect } from 'react'
import type { RefObject } from 'react'
import type { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animateReveal } from '../lib/scrollReveal'

/**
 * Reusable React hook for scroll-triggered entrance reveals within a container.
 * 
 * Automatically detects:
 * - Groups: elements with `data-reveal-group="group-id"` and child `data-reveal` items.
 * - Standalone items: elements with `data-reveal="item-id"` not inside a group.
 * 
 * Cleans up triggers on unmount and prevents replay across client-side navigation.
 */
export const useScrollReveal = (
  containerRef: RefObject<HTMLElement | null>,
  sectionPrefix: string
): void => {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const triggers: ScrollTrigger[] = []

    // 1. Process reveal groups (staggered children)
    const groups = container.querySelectorAll<HTMLElement>('[data-reveal-group]')
    groups.forEach((group) => {
      const groupId = group.getAttribute('data-reveal-group') || 'group'
      const fullId = `${sectionPrefix}-${groupId}`
      const items = group.querySelectorAll<HTMLElement>('[data-reveal]')
      const targets = items.length > 0 ? items : group

      const st = animateReveal(targets, {
        id: fullId,
        trigger: group,
        start: 'top 88%',
        y: 20,
        stagger: 0.08,
        duration: 0.65,
      })
      if (st) triggers.push(st)
    })

    // 2. Process standalone reveal items (individual cards, containers, buttons)
    const standaloneItems = container.querySelectorAll<HTMLElement>('[data-reveal]')
    standaloneItems.forEach((item, index) => {
      if (item.closest('[data-reveal-group]')) return // Handled by its parent group
      const itemId = item.getAttribute('data-reveal') || `item-${index}`
      const fullId = `${sectionPrefix}-${itemId}`

      const st = animateReveal(item, {
        id: fullId,
        trigger: item,
        start: 'top 88%',
        y: 20,
        duration: 0.65,
      })
      if (st) triggers.push(st)
    })

    return () => {
      triggers.forEach((st) => st.kill())
    }
  }, [containerRef, sectionPrefix])
}

export default useScrollReveal
