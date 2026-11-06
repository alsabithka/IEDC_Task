import React from 'react'
import { Layout } from './components/layout/Layout'
import { HeroSection } from './components/sections/HeroSection'
import { OverviewSection } from './components/sections/OverviewSection'
import { DetailsSection } from './components/sections/DetailsSection'

export const App: React.FC = () => {
  return (
    <Layout>
      {/* Simple Page Heading Area */}
      <HeroSection />

      {/* Configurable Content Area */}
      <OverviewSection />
      <DetailsSection />
    </Layout>
  )
}

export default App
