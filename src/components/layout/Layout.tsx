import React from 'react'
import { PanelHeader } from './PanelHeader'

export interface LayoutProps {
  children: React.ReactNode
}

/**
 * Unified Monochrome Layout — Hero Only
 * - Pure black background (#000000)
 * - Navigation header at top
 * - Hero content
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#000000] text-white flex flex-col justify-start selection:bg-white selection:text-black overflow-x-hidden">
      {/* Top Header */}
      <PanelHeader />

      {/* Main Content Flow: Hero Page Only */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  )
}

export default Layout
