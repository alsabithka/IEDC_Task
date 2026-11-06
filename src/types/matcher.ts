export interface MatcherOption {
  id: string
  label: string
  description?: string
  trackWeights: Record<string, number> // trackId -> weight points (e.g. 'ai-systems': 3)
}

export interface MatcherQuestion {
  id: string
  stepNumber: number
  title: string
  subtitle: string
  multiSelect?: boolean
  maxSelections?: number
  options: MatcherOption[]
}

export interface TrackDefinition {
  id: string
  name: string
  code: string
  tagline: string
  badgeColor: string
  description: string
  idealFor: string[]
  recommendedTools: string[]
  sampleChallenges: string[]
}

export interface MatchResult {
  track: TrackDefinition
  matchScore: number // percentage (e.g. 92)
  reasonSummary: string
  matchedPillars: string[]
}

