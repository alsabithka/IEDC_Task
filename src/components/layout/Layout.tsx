import React from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export interface LayoutProps {
  children: React.ReactNode
}

/**
 * Clean, flexible site layout wrapper.
 * Combines navigation, flexible main content area, and minimal footer.
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-bg-primary text-text-primary antialiased">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Layout
