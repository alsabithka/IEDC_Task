import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export interface ScrollLightBulbProps {
  className?: string
}

/**
 * ScrollLightBulb Component
 * 
 * Fixed at the top-right side of the viewport across all major sections.
 * Progressively illuminates from switched OFF to fully lit tungsten warmth
 * as the user scrolls down through the Idea Sprint website, symbolizing an idea
 * sparking and coming to life.
 * 
 * - 0% Scroll: Completely OFF (dark muted glass, unlit grey filament)
 * - 25% Scroll: Filament begins glowing warm amber
 * - 50% Scroll: Bulb is partially illuminated with soft inner glow
 * - 75% Scroll: Brightly illuminated warm golden amber, outer rays emerging
 * - 100% Scroll: Reaches full luminous brightness with ambient halo
 */
export const ScrollLightBulb: React.FC<ScrollLightBulbProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const glassRef = useRef<SVGPathElement>(null)
  const glassGlowRef = useRef<SVGPathElement>(null)
  const filamentRef = useRef<SVGPathElement>(null)
  const filamentCoreRef = useRef<SVGCircleElement>(null)
  const raysGroupRef = useRef<SVGGElement>(null)

  useGSAP(
    () => {
      // Respect prefers-reduced-motion: show a soft static lit state
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        if (glassRef.current) gsap.set(glassRef.current, { fillOpacity: 0.45 })
        if (filamentRef.current) gsap.set(filamentRef.current, { stroke: '#FFFFFF' })
        if (haloRef.current) gsap.set(haloRef.current, { opacity: 0.35, scale: 0.9 })
        if (raysGroupRef.current) gsap.set(raysGroupRef.current, { opacity: 0.5, scale: 0.85 })
        return
      }

      const glass = glassRef.current
      const glassGlow = glassGlowRef.current
      const filament = filamentRef.current
      const filamentCore = filamentCoreRef.current
      const rays = raysGroupRef.current
      const halo = haloRef.current

      if (!glass || !filament || !halo || !rays) return

      // Initial OFF State
      gsap.set(glass, {
        fill: '#FFFFFF',
        fillOpacity: 0.03,
        stroke: 'rgba(255, 255, 255, 0.22)',
      })
      if (glassGlow) {
        gsap.set(glassGlow, {
          fill: '#FFFFFF',
          fillOpacity: 0,
        })
      }
      gsap.set(filament, {
        stroke: '#4A4A4A',
        strokeWidth: 2,
      })
      if (filamentCore) {
        gsap.set(filamentCore, {
          fill: '#FFFFFF',
          opacity: 0,
          scale: 0.4,
          transformOrigin: 'center center',
        })
      }
      gsap.set(rays, {
        opacity: 0,
        scale: 0.65,
        transformOrigin: '50px 72px',
      })
      gsap.set(halo, {
        opacity: 0,
        scale: 0.4,
        transformOrigin: 'center center',
      })

      // Master Timeline linked to the full page scroll progress
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      // ======================================================================
      // 0% -> 25% SCROLL: Filament begins glowing subtle grey
      // ======================================================================
      tl.to(
        filament,
        {
          stroke: '#777777',
          duration: 0.25,
          ease: 'power1.in',
        },
        0,
      )
        .to(
          glass,
          {
            fillOpacity: 0.12,
            stroke: 'rgba(255, 255, 255, 0.35)',
            duration: 0.25,
            ease: 'power1.in',
          },
          0,
        )
        .to(
          halo,
          {
            opacity: 0.18,
            scale: 0.65,
            duration: 0.25,
            ease: 'power1.in',
          },
          0,
        )

      // ======================================================================
      // 25% -> 50% SCROLL: Bulb is partially illuminated with monochrome glow
      // ======================================================================
      tl.to(
        filament,
        {
          stroke: '#A0A0A0',
          duration: 0.25,
          ease: 'none',
        },
        0.25,
      )
        .to(
          glass,
          {
            fillOpacity: 0.35,
            stroke: 'rgba(255, 255, 255, 0.55)',
            duration: 0.25,
            ease: 'none',
          },
          0.25,
        )
        .to(
          halo,
          {
            opacity: 0.42,
            scale: 0.85,
            duration: 0.25,
            ease: 'none',
          },
          0.25,
        )
        .to(
          rays,
          {
            opacity: 0.3,
            scale: 0.8,
            duration: 0.25,
            ease: 'none',
          },
          0.25,
        )

      // ======================================================================
      // 50% -> 75% SCROLL: Brightly illuminated, outer rays emerge
      // ======================================================================
      tl.to(
        filament,
        {
          stroke: '#D0D0D0',
          duration: 0.25,
          ease: 'none',
        },
        0.5,
      )
        .to(
          glass,
          {
            fillOpacity: 0.65,
            stroke: 'rgba(255, 255, 255, 0.8)',
            duration: 0.25,
            ease: 'none',
          },
          0.5,
        )
      if (glassGlow) {
        tl.to(
          glassGlow,
          {
            fillOpacity: 0.35,
            duration: 0.25,
            ease: 'none',
          },
          0.5,
        )
      }
      if (filamentCore) {
        tl.to(
          filamentCore,
          {
            opacity: 0.6,
            scale: 0.85,
            duration: 0.25,
            ease: 'none',
          },
          0.5,
        )
      }
      tl.to(
        halo,
        {
          opacity: 0.65,
          scale: 1.05,
          duration: 0.25,
          ease: 'none',
        },
        0.5,
      ).to(
        rays,
        {
          opacity: 0.7,
          scale: 0.92,
          duration: 0.25,
          ease: 'none',
        },
        0.5,
      )

      // ======================================================================
      // 75% -> 100% SCROLL: Full brilliance, white-hot filament core
      // ======================================================================
      tl.to(
        filament,
        {
          stroke: '#FFFFFF',
          duration: 0.25,
          ease: 'power1.out',
        },
        0.75,
      )
        .to(
          glass,
          {
            fillOpacity: 0.88,
            stroke: '#FFFFFF',
            duration: 0.25,
            ease: 'power1.out',
          },
          0.75,
        )
      if (glassGlow) {
        tl.to(
          glassGlow,
          {
            fillOpacity: 0.6,
            duration: 0.25,
            ease: 'power1.out',
          },
          0.75,
        )
      }
      if (filamentCore) {
        tl.to(
          filamentCore,
          {
            opacity: 1,
            scale: 1.2,
            duration: 0.25,
            ease: 'power1.out',
          },
          0.75,
        )
      }
      tl.to(
        halo,
        {
          opacity: 0.85,
          scale: 1.25,
          duration: 0.25,
          ease: 'power1.out',
        },
        0.75,
      ).to(
        rays,
        {
          opacity: 1,
          scale: 1.0,
          duration: 0.25,
          ease: 'power1.out',
        },
        0.75,
      )
    },
    { scope: containerRef },
  )

  return (
    <aside
      ref={containerRef}
      aria-label="Idea Illumination Indicator"
      className={`hidden md:flex fixed top-0 right-4 sm:right-6 lg:right-10 z-40 pointer-events-none select-none flex-col items-center ${className}`}
    >
      {/* 
        ======================================================================
        1. AMBIENT WARM LIGHT HALO (Positioned behind the bulb body)
        ======================================================================
      */}
      <div
        ref={haloRef}
        aria-hidden="true"
        className="absolute top-[28px] sm:top-[34px] w-24 h-24 sm:w-32 sm:h-32 rounded-full pointer-events-none blur-xl will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(200, 200, 200, 0.15) 42%, transparent 70%)',
        }}
      />

      {/* 
        ======================================================================
        2. INLINE SVG LIGHT BULB
        ======================================================================
      */}
      <svg
        viewBox="0 0 100 135"
        className="w-10 h-auto sm:w-12 md:w-14 shrink-0 overflow-visible drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Cord coming down from ceiling */}
        <line
          x1="50"
          y1="0"
          x2="50"
          y2="18"
          stroke="#4A4545"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Socket / Screw Base */}
        <rect
          x="42"
          y="18"
          width="16"
          height="4"
          rx="1"
          fill="#3E3839"
          stroke="#555050"
          strokeWidth="0.8"
        />
        {/* Metallic Screw Threads */}
        <path
          d="M41 22 Q50 24 59 22"
          stroke="#686061"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M41 26 Q50 28 59 26"
          stroke="#5C5556"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M42 30 Q50 32 58 30"
          stroke="#504A4B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Contact Rim */}
        <path
          d="M44 32 L56 32 L53 35 L47 35 Z"
          fill="#332D2E"
        />

        {/* 
          Outer Radial Light Rays (Animated independently)
        */}
        <g ref={raysGroupRef} stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round">
          {/* Top Left */}
          <line x1="22" y1="46" x2="13" y2="40" />
          {/* Mid Left */}
          <line x1="14" y1="72" x2="3" y2="72" />
          {/* Bottom Left */}
          <line x1="22" y1="98" x2="13" y2="105" />
          {/* Bottom */}
          <line x1="50" y1="114" x2="50" y2="126" />
          {/* Bottom Right */}
          <line x1="78" y1="98" x2="87" y2="105" />
          {/* Mid Right */}
          <line x1="86" y1="72" x2="97" y2="72" />
          {/* Top Right */}
          <line x1="78" y1="46" x2="87" y2="40" />
        </g>

        {/* 
          Glass Bulb Body Outer Shape
        */}
        <path
          ref={glassRef}
          d="M44 35 C44 46 30 52 24 66 C17 82 27 104 50 104 C73 104 83 82 76 66 C70 52 56 46 56 35 Z"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1.6"
          className="transition-colors will-change-[fill-opacity,stroke]"
        />

        {/* 
          Inner Soft Glow Core
        */}
        <path
          ref={glassGlowRef}
          d="M45 42 C45 50 34 55 30 66 C24 78 32 96 50 96 C68 96 76 78 70 66 C66 55 55 50 55 42 Z"
          className="will-change-[fill-opacity]"
        />

        {/* Glass Specular Reflection Highlight Curve */}
        <path
          d="M31 60 C27 70 29 82 36 91"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Internal Support Lead Wires */}
        <line
          x1="45"
          y1="35"
          x2="45"
          y2="58"
          stroke="#555050"
          strokeWidth="1"
        />
        <line
          x1="55"
          y1="35"
          x2="55"
          y2="58"
          stroke="#555050"
          strokeWidth="1"
        />

        {/* 
          Tungsten Filament Coil
        */}
        <path
          ref={filamentRef}
          d="M45 58 L48 50 L50 56 L52 50 L55 58"
          stroke="#4A4545"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="will-change-[stroke]"
        />

        {/* Incandescent Sparkle Core Dot */}
        <circle
          ref={filamentCoreRef}
          cx="50"
          cy="53"
          r="2.5"
          fill="#FFFFFF"
          className="will-change-[opacity,transform]"
        />
      </svg>
    </aside>
  )
}

export default ScrollLightBulb
