import React from 'react'
import { CheckCircle2, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react'
import type { RegistrationFormData } from './types'

interface RegistrationSuccessProps {
  data: RegistrationFormData
  onReset: () => void
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  data,
  onReset,
}) => {
  return (
    <div
      role="region"
      aria-label="Registration confirmation"
      className="text-left py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300"
    >
      {/* 1. Header with Success Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#222222]">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-black shadow-lg">
            <CheckCircle2 className="h-6 w-6 text-black" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#999999]">
              FRONTEND CONFIRMATION
            </span>
            <h3 className="font-display font-normal uppercase text-white tracking-[-0.015em] text-2xl sm:text-3xl lg:text-4xl">
              REGISTRATION DETAILS SUBMITTED
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 text-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>New Submission</span>
        </button>
      </div>

      {/* 2. Official Frontend Demo Notice & Disclaimer */}
      <div className="rounded-2xl border border-white/20 bg-[#0c0c0c] p-4 sm:p-5 text-sm text-[#D0D0D0] leading-relaxed">
        <p className="font-sans font-medium text-white text-base">
          Thank you for your interest in IDEA SPRINT 2026. Your details have been captured in this demo.
        </p>
        <div className="mt-3 flex items-start gap-2.5 text-xs text-[#888888] font-mono pt-3 border-t border-[#1c1c1c]">
          <AlertTriangle className="h-4 w-4 text-white shrink-0 mt-0.5" />
          <p>
            This is a frontend demonstration. No actual registration has been transmitted to an event organiser. Official registration schedules and gateways will be released through formal IEDC BOOTCAMP CEC channels.
          </p>
        </div>
      </div>

      {/* 3. Summary of Captured Details */}
      <div className="space-y-3">
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">
          Captured Registration Summary
        </h4>

        <div className="rounded-2xl border border-[#222222] bg-[#080808] p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <span className="text-[#666666] uppercase text-[10px] block mb-0.5">Team Name</span>
            <span className="text-white font-bold text-sm">{data.teamName}</span>
          </div>

          <div>
            <span className="text-[#666666] uppercase text-[10px] block mb-0.5">Team Size</span>
            <span className="text-white font-bold text-sm">
              {data.teamSize} {data.teamSize === 1 ? 'Member (Solo)' : 'Members'}
            </span>
          </div>

          <div>
            <span className="text-[#666666] uppercase text-[10px] block mb-0.5">Team Leader / Applicant</span>
            <span className="text-white font-bold text-sm">{data.fullName}</span>
          </div>

          <div>
            <span className="text-[#666666] uppercase text-[10px] block mb-0.5">Contact Email & Phone</span>
            <span className="text-white font-bold text-sm">{data.email} · {data.phone}</span>
          </div>

          <div>
            <span className="text-[#666666] uppercase text-[10px] block mb-0.5">Institution & Department</span>
            <span className="text-white font-bold text-sm">{data.college} ({data.department})</span>
          </div>

          <div>
            <span className="text-[#666666] uppercase text-[10px] block mb-0.5">Year of Study</span>
            <span className="text-white font-bold text-sm">{data.yearOfStudy}</span>
          </div>

          {data.teamSize > 1 && data.teamMembers.length > 0 && (
            <div className="md:col-span-2 pt-2 border-t border-[#1a1a1a]">
              <span className="text-[#666666] uppercase text-[10px] block mb-1">Additional Teammates</span>
              <div className="flex flex-wrap gap-2">
                {data.teamMembers.slice(0, data.teamSize - 1).map((member, i) => (
                  <span
                    key={i}
                    className="inline-block px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-sans text-xs"
                  >
                    Member {i + 2}: <strong>{member}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-7 py-3 font-sans text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-[#EAEAEA] transition-all cursor-pointer shadow-lg"
        >
          <span>Register Another Team</span>
          <ArrowRight className="h-4 w-4" />
        </button>

        <a
          href="#schedule"
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white px-6 py-3 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-all text-center cursor-pointer"
        >
          Back to Event Schedule
        </a>
      </div>
    </div>
  )
}

export default RegistrationSuccess
