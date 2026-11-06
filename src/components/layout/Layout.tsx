import React from 'react'
import { PanelHeader } from './PanelHeader'
import { PanelFooter } from './PanelFooter'

export interface LayoutProps {
  children: React.ReactNode
}

/**
 * Unified Full-Page Layout
 * - The entire background is #241C1D with zero separation or outer dual-tone borders
 * - All content runs seamlessly across the full viewport height from top to bottom
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#241C1D] text-white flex flex-col justify-start selection:bg-[#F0444D] selection:text-white">
      {/* Top Header & Navigation running seamlessly on the unified background */}
      <PanelHeader />

      {/* Main Content Flow */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Unified Footer */}
      <PanelFooter />
    </div>
  )
}

export default Layout
