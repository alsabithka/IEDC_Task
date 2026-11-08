import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export interface PreloaderProps {
  onComplete?: () => void
  onStartExit?: () => void
}

/**
 * GSAP Preloader with Physical Letter Rearrangement
 * 
 * Sequence:
 * 1. Initial State: Centered "IDEA SPRINT" appears in white.
 * 2. Physical Rearrangement:
 *    - SPRINT and the letter A naturally fade out and drift downward.
 *    - I, E, D physically travel and rearrange (E arcs over D in 2.5D space to prevent clogging).
 *    - The letter C appears from nowhere in slot 4, entering in sync with IDE.
 * 3. Seamless Handoff: Real native Flexbox slots in targetRef take over for 100% stable final IEDC hold.
 * 4. Curtain Lift Reveal: The entire full-screen overlay animates upwards (yPercent: -100)
 *    to reveal the already rendered website underneath.
 */
export const Preloader: React.FC<PreloaderProps> = ({ onComplete, onStartExit }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const initialWordRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  // Moving letter references
  const letterIRef = useRef<HTMLSpanElement>(null)
  const letterDRef = useRef<HTMLSpanElement>(null)
  const letterERef = useRef<HTMLSpanElement>(null)
  const letterARef = useRef<HTMLSpanElement>(null)
  const letterCRef = useRef<HTMLSpanElement>(null)

  // Target slots references in the final centered IEDC layout
  const targetSlotI = useRef<HTMLSpanElement>(null)
  const targetSlotE = useRef<HTMLSpanElement>(null)
  const targetSlotD = useRef<HTMLSpanElement>(null)

  // SPRINT letters array
  const sprintLettersRef = useRef<HTMLSpanElement[]>([])

  // Font loading guard to prevent measurement race condition
  const [fontsLoaded, setFontsLoaded] = useState(() => {
    if (typeof document === 'undefined' || !document.fonts) return true
    return document.fonts.status === 'loaded'
  })

  // Respect prefers-reduced-motion
  const [isRemoved, setIsRemoved] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })

  // Ensure fonts are loaded before measuring DOM rects
  useEffect(() => {
    if (typeof document === 'undefined' || !document.fonts || document.fonts.status === 'loaded') {
      return
    }

    let mounted = true
    const timer = setTimeout(() => {
      if (mounted) setFontsLoaded(true)
    }, 350)

    document.fonts.ready.then(() => {
      if (mounted) {
        clearTimeout(timer)
        setFontsLoaded(true)
      }
    })

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [])

  // Prevent background scrolling while preloader is active
  useEffect(() => {
    if (!isRemoved) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    } else {
      onComplete?.()
    }
  }, [isRemoved, onComplete])

  useGSAP(
    () => {
      if (!fontsLoaded || isRemoved || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      const letterI = letterIRef.current
      const letterD = letterDRef.current
      const letterE = letterERef.current
      const letterA = letterARef.current
      const letterC = letterCRef.current

      const slotI = targetSlotI.current
      const slotE = targetSlotE.current
      const slotD = targetSlotD.current

      if (
        !letterI ||
        !letterD ||
        !letterE ||
        !letterA ||
        !letterC ||
        !slotI ||
        !slotE ||
        !slotD
      ) {
        return
      }

      // Calculate initial and final bounding client rectangles
      const rectI_start = letterI.getBoundingClientRect()
      const rectD_start = letterD.getBoundingClientRect()
      const rectE_start = letterE.getBoundingClientRect()

      const rectI_target = slotI.getBoundingClientRect()
      const rectE_target = slotE.getBoundingClientRect()
      const rectD_target = slotD.getBoundingClientRect()

      // Calculate translation deltas based on element centers
      const deltaI = {
        x: rectI_target.left + rectI_target.width / 2 - (rectI_start.left + rectI_start.width / 2),
        y: rectI_target.top + rectI_target.height / 2 - (rectI_start.top + rectI_start.height / 2),
        scale: rectI_target.height / rectI_start.height,
      }

      const deltaE = {
        x: rectE_target.left + rectE_target.width / 2 - (rectE_start.left + rectE_start.width / 2),
        y: rectE_target.top + rectE_target.height / 2 - (rectE_start.top + rectE_start.height / 2),
        scale: rectE_target.height / rectE_start.height,
      }

      const deltaD = {
        x: rectD_target.left + rectD_target.width / 2 - (rectD_start.left + rectD_start.width / 2),
        y: rectD_target.top + rectD_target.height / 2 - (rectD_start.top + rectD_start.height / 2),
        scale: rectD_target.height / rectD_start.height,
      }

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.()
          setIsRemoved(true)
        },
      })

      // 1. Initial State: IDEA SPRINT entrance (crisp, quick settle)
      tl.fromTo(
        initialWordRef.current,
        {
          opacity: 0,
          y: 16,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power3.out',
        },
      )
        // Hold IDEA SPRINT briefly so it's clearly readable
        .to({}, { duration: 0.22 })

        // 2. SPRINT and the letter A fade out smoothly downwards
        .to(
          sprintLettersRef.current,
          {
            opacity: 0,
            y: 18,
            stagger: 0.015,
            duration: 0.22,
            ease: 'power2.in',
          },
          'rearrange',
        )
        .to(
          letterA,
          {
            opacity: 0,
            y: 14,
            duration: 0.20,
            ease: 'power2.in',
          },
          'rearrange',
        )

        // 3. PHYSICAL LETTER REARRANGEMENT (Swift, fluid, 60fps GPU transforms)
        // Letter I travels smoothly to slot 1
        .to(
          letterI,
          {
            x: deltaI.x,
            y: deltaI.y,
            scale: deltaI.scale,
            duration: 0.58,
            ease: 'power3.inOut',
            transformOrigin: 'center center',
            force3D: true,
          },
          'rearrange+=0.04',
        )

        // Letter E moves to slot 2 (fluid arc OVER D in 2.5D space)
        .to(
          letterE,
          {
            x: deltaE.x,
            scale: deltaE.scale,
            duration: 0.58,
            ease: 'power3.inOut',
            transformOrigin: 'center center',
            force3D: true,
          },
          'rearrange+=0.04',
        )
        .to(
          letterE,
          {
            keyframes: [
              { y: deltaE.y - 28, duration: 0.29, ease: 'sine.out' },
              { y: deltaE.y, duration: 0.29, ease: 'sine.in' },
            ],
          },
          'rearrange+=0.04',
        )

        // Letter D moves to slot 3 (subtle dip BEHIND E)
        .to(
          letterD,
          {
            x: deltaD.x,
            scale: deltaD.scale,
            duration: 0.58,
            ease: 'power3.inOut',
            transformOrigin: 'center center',
            force3D: true,
          },
          'rearrange+=0.04',
        )
        .to(
          letterD,
          {
            keyframes: [
              { y: deltaD.y + 14, duration: 0.29, ease: 'sine.out' },
              { y: deltaD.y, duration: 0.29, ease: 'sine.in' },
            ],
          },
          'rearrange+=0.04',
        )

        // Letter C enters slot 4 dynamically in sync
        .fromTo(
          letterC,
          {
            opacity: 0,
            scale: 0.45,
            y: 18,
            transformOrigin: 'center center',
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.58,
            ease: 'power3.inOut',
            force3D: true,
          },
          'rearrange+=0.04',
        )

        // 4. SEAMLESS HANDOFF TO NATIVE FLEXBOX SLOTS
        .set(
          [slotI, slotE, slotD],
          { opacity: 1 },
          'rearrange+=0.62',
        )
        .set(
          [letterI, letterE, letterD],
          { opacity: 0 },
          'rearrange+=0.62',
        )

        // 5. Final IEDC Hold: Clean, bold, perfectly spaced native IEDC hold
        .to({}, { duration: 0.30 })

        // 6. Trigger hero entrance as curtain begins to lift
        .call(
          () => {
            onStartExit?.()
          },
          [],
          'curtain',
        )

        // 7. Full-Screen Upward Lift: Curtain lifts away with dynamic ease
        .to(
          containerRef.current,
          {
            yPercent: -100,
            duration: 0.52,
            ease: 'power4.inOut',
            force3D: true,
          },
          'curtain',
        )
    },
    { dependencies: [fontsLoaded], scope: containerRef },
  )

  if (isRemoved) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000] text-white select-none overflow-hidden"
      aria-label="Loading Screen"
      aria-live="polite"
    >
      {/* ====================================================================
          1. TARGET REFERENCE CONTAINER (Exact final IEDC slots with clean gap spacing)
          ==================================================================== */}
      <div
        ref={targetRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <div className="font-sans font-black tracking-normal text-6xl sm:text-8xl md:text-9xl lg:text-[140px] xl:text-[170px] leading-none text-white flex items-center justify-center whitespace-nowrap gap-1 sm:gap-2.5 md:gap-3 lg:gap-4">
          <span ref={targetSlotI} className="inline-block opacity-0">
            I
          </span>
          <span ref={targetSlotE} className="inline-block opacity-0">
            E
          </span>
          <span ref={targetSlotD} className="inline-block opacity-0">
            D
          </span>
          {/* Letter C enters into slot 4 in sync with IDE */}
          <span
            ref={letterCRef}
            className="inline-block opacity-0 will-change-transform text-white"
          >
            C
          </span>
        </div>
      </div>

      {/* ====================================================================
          2. VISIBLE INTERACTIVE INITIAL TEXT: IDEA SPRINT
          ==================================================================== */}
      <div
        ref={initialWordRef}
        className="relative z-10 flex items-center justify-center font-sans font-black tracking-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-none whitespace-nowrap px-4 text-white"
      >
        {/* IDEA Word (Individually positioned characters) */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Letter I */}
          <span
            ref={letterIRef}
            className="inline-block will-change-transform z-10"
          >
            I
          </span>

          {/* Letter D (Lower z-index so E glides cleanly above it) */}
          <span
            ref={letterDRef}
            className="inline-block will-change-transform z-0"
          >
            D
          </span>

          {/* Letter E (Elevated z-index to physically glide over D during rearrangement) */}
          <span
            ref={letterERef}
            className="inline-block will-change-transform z-20"
          >
            E
          </span>

          {/* Letter A (fades out naturally during rearrangement) */}
          <span
            ref={letterARef}
            className="inline-block will-change-transform"
          >
            A
          </span>
        </div>

        {/* Space separator */}
        <span className="w-3 sm:w-5 md:w-6 inline-block" aria-hidden="true" />

        {/* SPRINT Word (Disappears naturally during rearrangement) */}
        <div className="flex items-center">
          {'SPRINT'.split('').map((char, index) => (
            <span
              key={index}
              ref={(el) => {
                if (el) sprintLettersRef.current[index] = el
              }}
              className="inline-block will-change-transform"
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Preloader
