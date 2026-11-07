import React from 'react'

/**
 * Technical Corner Brackets (⌜ ⌝ ⌞ ⌟)
 * Renders precision corner calibration marks around an instrument frame.
 */
export const CornerBrackets: React.FC<{
  size?: number
  strokeWidth?: number
  className?: string
  offset?: number
}> = ({ size = 12, strokeWidth = 1.2, className = 'text-white/40', offset = 0 }) => {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        top: -offset,
        left: -offset,
        right: -offset,
        bottom: -offset,
      }}
      aria-hidden="true"
    >
      {/* Top Left */}
      <svg
        className="absolute top-0 left-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        <path
          d={`M0,${size} L0,0 L${size},0`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Top Right */}
      <svg
        className="absolute top-0 right-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        <path
          d={`M0,0 L${size},0 L${size},${size}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Bottom Left */}
      <svg
        className="absolute bottom-0 left-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        <path
          d={`M0,0 L0,${size} L${size},${size}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Bottom Right */}
      <svg
        className="absolute bottom-0 right-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
      >
        <path
          d={`M${size},0 L${size},${size} L0,${size}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      </svg>
    </div>
  )
}

/**
 * Precision Reticle / Crosshair (+)
 */
export const CrosshairMarker: React.FC<{
  className?: string
  size?: number
}> = ({ className = 'text-white/30', size = 8 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <line
        x1={size / 2}
        y1={0}
        x2={size / 2}
        y2={size}
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1={0}
        y1={size / 2}
        x2={size}
        y2={size / 2}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  )
}

/**
 * Vertical Measurement Calibration Ruler
 */
export const CalibrationTicks: React.FC<{
  ticks?: number
  height?: number
  className?: string
}> = ({ ticks = 10, height = 120, className = 'text-white/25' }) => {
  const step = height / (ticks - 1)
  return (
    <svg
      width="12"
      height={height}
      viewBox={`0 0 12 ${height}`}
      fill="none"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: ticks }).map((_, i) => {
        const isMajor = i % 3 === 0
        const y = i * step
        const width = isMajor ? 10 : 5
        return (
          <line
            key={i}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke="currentColor"
            strokeWidth={isMajor ? 1.2 : 0.8}
          />
        )
      })}
    </svg>
  )
}
