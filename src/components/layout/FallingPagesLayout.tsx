import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { scrollToSheet } from '../../lib/scrollUtils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export interface FallingPagesLayoutProps {
  children: React.ReactNode
}

/**
 * FallingPagesLayout Component
 * 
 * Implements the GSAP ScrollTrigger Falling Page Transitions.
 * 
 * Layered Structure:
 * - All sheets are stacked in a 3D perspective viewport.
 * - The upcoming section already exists directly underneath the current section.
 * - Active section has higher stacking order (z-index 30, 29, 28, ...).
 * - As user scrolls down, the active sheet tilts backward on the X-axis around its top edge,
 *   scaling down subtly and dissolving away like a physical page falling away.
 * - The next sheet underneath smoothly emerges and settles into position as the active page.
 * - After the final section (FAQ), the sticky stage ends and scrolling flows naturally into the footer.
 * - Mobile: Unpinned, smooth native touch scrolling with zero 3D overhead.
 * - Prefers-reduced-motion: Standard scrolling.
 */
export const FallingPagesLayout: React.FC<FallingPagesLayoutProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const sheetsRef = useRef<HTMLDivElement[]>([])

  const [isDesktop, setIsDesktop] = React.useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true,
  )

  const childArray = React.Children.toArray(children)
  const totalSheets = childArray.length
  const totalTransitions = Math.max(1, totalSheets - 1)

  // Global anchor click listener and responsive resize listener
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__scrollToSheet = scrollToSheet

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault()
        scrollToSheet(href)
      }
    }

    const handleResize = () => {
      const desktop = window.innerWidth >= 768
      setIsDesktop(desktop)
      ScrollTrigger.refresh()
    }

    document.addEventListener('click', handleAnchorClick)
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useGSAP(
    () => {
      const sheets = sheetsRef.current.filter(Boolean)
      if (sheets.length <= 1 || !containerRef.current || !stageRef.current) return

      const mm = gsap.matchMedia()

      // ====================================================================
      // 1. DESKTOP EXPERIENCE (≥ 1024px)
      // ====================================================================
      mm.add(
        '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        () => {
          // Setup 3D transform properties on all sheets
          sheets.forEach((sheet, idx) => {
            gsap.set(sheet, {
              transformPerspective: 1200,
              transformOrigin: 'center top',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              scale: idx === 0 ? 1 : 0.96,
              filter: idx === 0 ? 'brightness(1)' : 'brightness(0.85)',
              autoAlpha: idx === 0 ? 1 : 1, // Next sheet already exists underneath!
            })
          })

          // Master Scrubbed Timeline tied to scroll progress of the container
          const masterTl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.8,
              anticipatePin: 1,
            },
          })

          // Sequence falling transitions
          for (let i = 0; i < totalTransitions; i++) {
            const currentSheet = sheets[i]
            const nextSheet = sheets[i + 1]
            const timeOffset = i

            // 1. Current sheet falls away: rotates X, translates up, scales down, fades out
            masterTl.to(
              currentSheet,
              {
                rotationX: -16,
                yPercent: -5,
                scale: 0.93,
                autoAlpha: 0,
                filter: 'brightness(0.55)',
                ease: 'power1.inOut',
                duration: 1,
              },
              timeOffset,
            )

            // 2. Next sheet (already resting underneath) emerges into full focus
            if (nextSheet) {
              masterTl.to(
                nextSheet,
                {
                  scale: 1,
                  filter: 'brightness(1)',
                  ease: 'power1.out',
                  duration: 1,
                },
                timeOffset,
              )

              // 3. Next sheet's heading rises gently into place
              const nextHeading = nextSheet.querySelector('h1, h2, [data-sheet-heading]')
              if (nextHeading) {
                masterTl.fromTo(
                  nextHeading,
                  { y: 28, opacity: 0.7 },
                  {
                    y: 0,
                    opacity: 1,
                    ease: 'power1.out',
                    duration: 0.75,
                  },
                  timeOffset + 0.15,
                )
              }
            }
          }

          return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill())
          }
        },
      )

      // ====================================================================
      // 2. TABLET EXPERIENCE (768px – 1023px)
      // ====================================================================
      mm.add(
        '(min-width: 768px) and (max-width: 1023px) and (prefers-reduced-motion: no-preference)',
        () => {
          sheets.forEach((sheet, idx) => {
            gsap.set(sheet, {
              transformPerspective: 1000,
              transformOrigin: 'center top',
              transformStyle: 'preserve-3d',
              scale: idx === 0 ? 1 : 0.98,
              filter: idx === 0 ? 'brightness(1)' : 'brightness(0.9)',
              autoAlpha: 1,
            })
          })

          const tabletTl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.8,
            },
          })

          for (let i = 0; i < totalTransitions; i++) {
            const currentSheet = sheets[i]
            const nextSheet = sheets[i + 1]
            const timeOffset = i

            tabletTl.to(
              currentSheet,
              {
                rotationX: -7,
                yPercent: -3,
                scale: 0.96,
                autoAlpha: 0,
                filter: 'brightness(0.75)',
                ease: 'power1.inOut',
                duration: 1,
              },
              timeOffset,
            )

            if (nextSheet) {
              tabletTl.to(
                nextSheet,
                {
                  scale: 1,
                  filter: 'brightness(1)',
                  ease: 'power1.out',
                  duration: 1,
                },
                timeOffset,
              )
            }
          }

          return () => {
            ScrollTrigger.getAll().forEach((st) => st.kill())
          }
        },
      )

      // ====================================================================
      // 3. MOBILE (< 768px) & REDUCED MOTION
      // ====================================================================
      mm.add('(max-width: 767px)', () => {
        // Natural mobile vertical scrolling. Heading reveals as sections enter viewport.
        sheets.forEach((sheet) => {
          const heading = sheet.querySelector('h2')
          if (heading) {
            gsap.from(heading, {
              y: 20,
              opacity: 0.5,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: sheet,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            })
          }
        })

        return () => {
          ScrollTrigger.getAll().forEach((st) => st.kill())
        }
      })

      ScrollTrigger.refresh()
    },
    { scope: containerRef },
  )

  return (
    <div
      ref={containerRef}
      className="falling-pages-track relative w-full"
      style={{
        height: isDesktop ? `${(totalTransitions + 1) * 100}vh` : 'auto',
      }}
    >
      {/* 
        Sticky Viewport Stage:
        - Stays pinned at top: 0 during the entire scroll distance on desktop/tablet.
        - Unsticks cleanly after the final sheet so scrolling flows directly into the footer.
        - On mobile (< 768px), reverts to a standard relative container with natural document flow.
      */}
      <div
        ref={stageRef}
        className={
          isDesktop
            ? 'sticky top-0 h-screen w-full overflow-hidden relative'
            : 'relative w-full h-auto'
        }
        style={{
          perspective: 1200,
          perspectiveOrigin: '50% 25%',
        }}
      >
        {childArray.map((child, index) => {
          // Descending z-index so current sheet is physically in front of subsequent sheets
          const zIndex = 30 - index

          return (
            <div
              key={index}
              ref={(el) => {
                if (el) sheetsRef.current[index] = el
              }}
              className={
                isDesktop
                  ? 'page-sheet absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden flex flex-col justify-center bg-[#241C1D] shadow-[0_-20px_50px_rgba(0,0,0,0.7)] border-t border-white/5 will-change-transform'
                  : 'page-sheet relative w-full h-auto bg-[#241C1D] border-t border-white/10'
              }
              style={{
                zIndex,
              }}
            >
              {child}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FallingPagesLayout
