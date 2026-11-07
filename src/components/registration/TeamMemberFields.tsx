import React from 'react'
import { FormField } from './FormField'
import { User, Users } from 'lucide-react'

interface TeamMemberFieldsProps {
  teamSize: number
  applicantFullName: string
  teamLeaderName: string
  teamMembers: string[]
  onMemberNameChange: (index: number, val: string) => void
  onMemberBlur: (index: number) => void
  errors?: string[]
  touchedMembers?: boolean[]
}

export const TeamMemberFields: React.FC<TeamMemberFieldsProps> = ({
  teamSize,
  applicantFullName,
  teamLeaderName,
  teamMembers,
  onMemberNameChange,
  onMemberBlur,
  errors = [],
  touchedMembers = [],
}) => {
  const effectiveLeaderName = teamLeaderName || applicantFullName
  const additionalMembersCount = Math.max(0, teamSize - 1)

  return (
    <div className="space-y-4 pt-3 border-t border-[#222222]">
      {/* 1. Team Leader Display / Confirmation */}
      <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
            <User className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#A0A0A0]">
                MEMBER 1 · TEAM LEADER
              </span>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-white/10 text-white font-bold">
                Applicant
              </span>
            </div>
            <p className="font-sans text-sm font-bold text-white mt-0.5">
              {effectiveLeaderName.trim() || 'Enter your Full Name above'}
            </p>
          </div>
        </div>

        <span className="font-mono text-[11px] text-[#666666]">
          Automatically carried from Personal Information
        </span>
      </div>

      {/* 2. Dynamic Additional Members (Members 2..N) */}
      {additionalMembersCount > 0 ? (
        <div className="space-y-3.5">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#999999]">
            <Users className="h-3.5 w-3.5 text-white" />
            <span>Additional Team Members ({additionalMembersCount})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {Array.from({ length: additionalMembersCount }).map((_, index) => {
              const memberNumber = index + 2
              const fieldId = `team-member-${memberNumber}`
              const val = teamMembers[index] || ''
              const isTouched = touchedMembers[index]
              const error = isTouched && errors[index] ? errors[index] : undefined

              return (
                <FormField
                  key={fieldId}
                  id={fieldId}
                  label={`Team Member ${memberNumber} Full Name`}
                  required
                  error={error}
                  helperText={`Teammate ${memberNumber} participating in IDEA SPRINT 2026`}
                >
                  <input
                    id={fieldId}
                    type="text"
                    value={val}
                    onChange={(e) => onMemberNameChange(index, e.target.value)}
                    onBlur={() => onMemberBlur(index)}
                    placeholder={`e.g. Member ${memberNumber} Full Name`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${fieldId}-error` : `${fieldId}-desc`}
                    className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                      error
                        ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
                    }`}
                  />
                </FormField>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#222222] p-3 text-center text-xs font-mono text-[#777777]">
          Solo Registration · No additional team member names required.
        </div>
      )}
    </div>
  )
}

export default TeamMemberFields
