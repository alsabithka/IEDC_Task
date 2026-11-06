import React, { useState } from 'react'
import {
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Wrench,
  HelpCircle,
} from 'lucide-react'
import {
  MATCHER_QUESTIONS,
  calculateTrackMatch,
  type MatchResult,
} from '../../lib/matcherLogic'
import { cn } from '../../lib/utils'

export const TrackMatcherSection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<MatchResult | null>(null)

  const activeQuestion = MATCHER_QUESTIONS[currentStep]

  const handleSelectOption = (questionId: string, optionId: string) => {
    const updated = { ...selectedAnswers, [questionId]: optionId }
    setSelectedAnswers(updated)

    if (currentStep < MATCHER_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // Calculate match
      const optionIds = Object.values(updated)
      const computedResult = calculateTrackMatch(optionIds)
      setResult(computedResult)
    }
  }

  const handleReset = () => {
    setSelectedAnswers({})
    setCurrentStep(0)
    setResult(null)
  }

  const handleSelectTrackForRegistration = (trackId: string) => {
    // Scroll to registration form and pre-fill track dropdown
    const selectElem = document.getElementById('domainTrack-select') as HTMLSelectElement | null
    if (selectElem) {
      selectElem.value = trackId
      // trigger change event for react-hook-form
      selectElem.dispatchEvent(new Event('change', { bubbles: true }))
    }
    const registerSection = document.getElementById('register')
    if (registerSection) {
      registerSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="matcher" className="relative z-10 w-full border-t border-white/10 bg-[#241C1D]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#F0444D] mb-3 block">
            INTERACTIVE TOOL // SPRINT TRACK MATCHER
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            Find Your Problem Domain
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#C5C0C0] leading-relaxed">
            Answer three quick questions about your team’s curiosity, engineering strengths, and intended impact to discover your highest-synergy challenge track among the 7 official sprint domains.
          </p>
        </div>

        {/* Interactive Container */}
        <div className="rounded-3xl border border-white/10 bg-[#1D1617] p-6 sm:p-10 lg:p-12 relative overflow-hidden">
          {!result ? (
            <div>
              {/* Progress Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#F0444D]/20 text-[#F0444D] flex items-center justify-center font-mono text-xs font-bold">
                    0{currentStep + 1}
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-[#8e8989] block">
                      Step {currentStep + 1} of {MATCHER_QUESTIONS.length}
                    </span>
                    <span className="font-sans text-sm font-bold text-white">
                      {activeQuestion.title}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  {MATCHER_QUESTIONS.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'h-1.5 w-12 rounded-full transition-all duration-200',
                        idx <= currentStep ? 'bg-[#F0444D]' : 'bg-white/10',
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-[#C5C0C0] mb-6">
                {activeQuestion.subtitle}
              </p>

              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeQuestion.options.map((option) => {
                  const isSelected = selectedAnswers[activeQuestion.id] === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelectOption(activeQuestion.id, option.id)}
                      className={cn(
                        'group text-left p-5 rounded-2xl border transition-all duration-150 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0444D]',
                        isSelected
                          ? 'border-[#F0444D] bg-[#F0444D]/10'
                          : 'border-white/10 bg-[#241C1D] hover:border-white/25 hover:bg-white/[0.03]',
                      )}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-sans text-sm sm:text-base font-bold text-white group-hover:text-white">
                            {option.label}
                          </h4>
                          <div
                            className={cn(
                              'h-5 w-5 rounded-full border flex items-center justify-center transition-colors',
                              isSelected
                                ? 'border-[#F0444D] bg-[#F0444D] text-white'
                                : 'border-white/20 text-transparent group-hover:border-white/40',
                            )}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                        </div>

                        {option.description && (
                          <p className="text-xs text-[#C5C0C0] leading-relaxed">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Navigation Back (if not first step) */}
              {currentStep > 0 && (
                <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-start">
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="font-mono text-xs uppercase tracking-wider text-[#C5C0C0] hover:text-white"
                  >
                    ← Back to Previous Question
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ================================================================
               RESULT DISPLAY
               ================================================================ */
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#F0444D]/20 text-[#F0444D] flex items-center justify-center">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-[#F0444D] font-bold">
                      Domain Recommendation
                    </span>
                    <h3 className="font-sans text-xl sm:text-2xl font-black text-white">
                      {result.track.name}
                    </h3>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#F0444D]/40 bg-[#F0444D]/10 px-4 py-1.5 font-mono text-xs font-bold text-[#F0444D]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{result.matchScore}% Synergy Match</span>
                </div>
              </div>

              {/* Tagline & Reason */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <p className="font-sans text-base sm:text-lg font-medium text-white leading-relaxed">
                    {result.track.tagline}
                  </p>
                  <p className="text-sm text-[#C5C0C0] leading-relaxed">
                    {result.track.description}
                  </p>

                  <div className="p-4 rounded-xl border border-white/10 bg-[#241C1D]">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#8e8989] block mb-1">
                      Why this track fits you:
                    </span>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      {result.reasonSummary}
                    </p>
                  </div>
                </div>

                {/* Right side: Tools & Challenges */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Recommended tools */}
                  <div className="rounded-xl border border-white/10 bg-[#241C1D] p-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#F0444D] font-bold flex items-center gap-1.5 mb-2">
                      <Wrench className="h-3.5 w-3.5" />
                      Recommended Tooling
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.track.recommendedTools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-white/80"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sample challenge */}
                  <div className="rounded-xl border border-white/10 bg-[#241C1D] p-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#8e8989] font-bold flex items-center gap-1.5 mb-2">
                      <HelpCircle className="h-3.5 w-3.5" />
                      Sample Challenge Ideas
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#C5C0C0]">
                      {result.track.sampleChallenges.map((challenge, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#F0444D] font-mono">•</span>
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-[#C5C0C0] hover:text-white hover:border-white/30 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retake Matcher</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTrackForRegistration(result.track.id)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F0444D] px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#F0444D]/25 hover:bg-[#C92E39] transition-all"
                >
                  <span>Select Track for Registration</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default TrackMatcherSection
