import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

/**
 * Master layout wrapper establishing the technical grid,
 * dark atmosphere, and consistent viewport constraints.
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary selection:bg-accent-primary selection:text-text-inverse">
      {/* Background technical grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-grid-tech opacity-60"
        aria-hidden="true"
      />

      {/* Subtle radial ambient spotlight — Primary Electric Volt */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 z-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-primary/5 blur-[160px]"
        aria-hidden="true"
      />

      {/* Subtle radial ambient glow — Secondary Kinetic Orange */}
      <div
        className="pointer-events-none fixed bottom-0 right-0 z-0 h-[400px] w-[500px] translate-x-1/3 translate-y-1/3 rounded-full bg-accent-secondary/4 blur-[140px]"
        aria-hidden="true"
      />

      {/* Main container */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}

export default Layout
