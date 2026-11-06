export const SECTION_IDS = [
  'home',
  'about',
  'objectives',
  'why',
  'journey',
  'schedule',
  'matcher',
  'register',
  'faq',
]

/**
 * Global helper to scroll accurately to a sheet by element ID,
 * taking into account whether the desktop falling-pages track is active.
 */
export const scrollToSheet = (targetId: string) => {
  const cleanId = targetId.replace('#', '')
  const targetEl = document.getElementById(cleanId)
  if (!targetEl) return

  // Check if we are on desktop/tablet with the falling pages track active
  const trackEl = document.querySelector('.falling-pages-track') as HTMLElement | null
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768

  if (trackEl && isDesktop) {
    const trackTop = trackEl.getBoundingClientRect().top + window.scrollY
    const vh = window.innerHeight

    if (cleanId === 'contact') {
      // Footer is after the track
      const totalTrackTransitions = SECTION_IDS.length - 1
      window.scrollTo({
        top: trackTop + totalTrackTransitions * vh + vh,
        behavior: 'smooth',
      })
      return
    }

    const sectionIndex = SECTION_IDS.indexOf(cleanId)
    if (sectionIndex !== -1) {
      window.scrollTo({
        top: trackTop + sectionIndex * vh,
        behavior: 'smooth',
      })
      return
    }
  }

  // Fallback for mobile or elements outside track
  targetEl.scrollIntoView({ behavior: 'smooth' })
}
