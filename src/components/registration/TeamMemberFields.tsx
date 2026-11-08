import React from 'react'
import { FormField } from './FormField'
import {
  YEAR_OF_STUDY_OPTIONS,
  type TeamMemberData,
  type TeamMemberErrors,
  type TeamMemberTouched,
} from './types'

interface TeamMemberFieldsProps {
  memberNumber: number // 2, 3, or 4
  totalTeamSize: number
  member: TeamMemberData
  onMemberFieldChange: (field: keyof TeamMemberData, val: string) => void
  onMemberBlur: (field: keyof TeamMemberData) => void
  errors?: TeamMemberErrors
  isTouched?: TeamMemberTouched
}

export const TeamMemberFields: React.FC<TeamMemberFieldsProps> = ({
  memberNumber,
  totalTeamSize,
  member,
  onMemberFieldChange,
  onMemberBlur,
  errors = {},
  isTouched = {},
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#222222] bg-[#0c0c0c] p-4 sm:p-6 space-y-4 shadow-lg animate-in fade-in duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c1c1c]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black font-mono text-xs font-black">
              0{memberNumber}
            </span>
            <h4 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              Team Member {memberNumber} · Personal Details
            </h4>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#777777]">
            Member {memberNumber} of {totalTeamSize}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Full Name */}
          <FormField
            id={`member-${memberNumber}-fullName`}
            label="Full Name"
            required
            error={isTouched.fullName ? errors.fullName : undefined}
            helperText="Official name for badge verification and sprint certificate"
          >
            <input
              id={`member-${memberNumber}-fullName`}
              type="text"
              autoComplete="name"
              value={member.fullName}
              onChange={(e) => onMemberFieldChange('fullName', e.target.value)}
              onBlur={() => onMemberBlur('fullName')}
              placeholder={`e.g. Member ${memberNumber} Full Name`}
              aria-invalid={isTouched.fullName && !!errors.fullName}
              aria-describedby={
                errors.fullName ? `member-${memberNumber}-fullName-error` : undefined
              }
              className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                isTouched.fullName && errors.fullName
                  ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
              }`}
            />
          </FormField>

          {/* Email Address */}
          <FormField
            id={`member-${memberNumber}-email`}
            label="Email Address"
            required
            error={isTouched.email ? errors.email : undefined}
            helperText="Used for workshop updates and verification"
          >
            <input
              id={`member-${memberNumber}-email`}
              type="email"
              autoComplete="email"
              value={member.email}
              onChange={(e) => onMemberFieldChange('email', e.target.value)}
              onBlur={() => onMemberBlur('email')}
              placeholder="e.g. teammate@college.edu"
              aria-invalid={isTouched.email && !!errors.email}
              aria-describedby={
                errors.email ? `member-${memberNumber}-email-error` : undefined
              }
              className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                isTouched.email && errors.email
                  ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
              }`}
            />
          </FormField>

          {/* Phone Number */}
          <FormField
            id={`member-${memberNumber}-phone`}
            label="Phone Number"
            required
            error={isTouched.phone ? errors.phone : undefined}
            helperText="10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210)"
          >
            <input
              id={`member-${memberNumber}-phone`}
              type="tel"
              autoComplete="tel"
              value={member.phone}
              onChange={(e) => onMemberFieldChange('phone', e.target.value)}
              onBlur={() => onMemberBlur('phone')}
              placeholder="+91 98765 43210"
              aria-invalid={isTouched.phone && !!errors.phone}
              aria-describedby={
                errors.phone ? `member-${memberNumber}-phone-error` : undefined
              }
              className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                isTouched.phone && errors.phone
                  ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
              }`}
            />
          </FormField>

          {/* College / Institution */}
          <FormField
            id={`member-${memberNumber}-college`}
            label="College / Institution Name"
            required
            error={isTouched.college ? errors.college : undefined}
          >
            <input
              id={`member-${memberNumber}-college`}
              type="text"
              value={member.college}
              onChange={(e) => onMemberFieldChange('college', e.target.value)}
              onBlur={() => onMemberBlur('college')}
              placeholder="e.g. College of Engineering Chengannur"
              aria-invalid={isTouched.college && !!errors.college}
              aria-describedby={
                errors.college ? `member-${memberNumber}-college-error` : undefined
              }
              className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                isTouched.college && errors.college
                  ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
              }`}
            />
          </FormField>

          {/* Department */}
          <FormField
            id={`member-${memberNumber}-department`}
            label="Course / Department"
            required
            error={isTouched.department ? errors.department : undefined}
            helperText="e.g. Computer Science, Electronics, Mechanical"
          >
            <input
              id={`member-${memberNumber}-department`}
              type="text"
              value={member.department}
              onChange={(e) => onMemberFieldChange('department', e.target.value)}
              onBlur={() => onMemberBlur('department')}
              placeholder="e.g. Computer Science and Engineering"
              aria-invalid={isTouched.department && !!errors.department}
              aria-describedby={
                errors.department ? `member-${memberNumber}-department-error` : undefined
              }
              className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                isTouched.department && errors.department
                  ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
              }`}
            />
          </FormField>

          {/* Year of Study */}
          <FormField
            id={`member-${memberNumber}-yearOfStudy`}
            label="Year of Study"
            required
            error={isTouched.yearOfStudy ? errors.yearOfStudy : undefined}
          >
            <select
              id={`member-${memberNumber}-yearOfStudy`}
              value={member.yearOfStudy}
              onChange={(e) => onMemberFieldChange('yearOfStudy', e.target.value)}
              onBlur={() => onMemberBlur('yearOfStudy')}
              aria-invalid={isTouched.yearOfStudy && !!errors.yearOfStudy}
              aria-describedby={
                errors.yearOfStudy ? `member-${memberNumber}-yearOfStudy-error` : undefined
              }
              className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white transition-all focus:outline-none focus:ring-1 ${
                isTouched.yearOfStudy && errors.yearOfStudy
                  ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                  : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
              }`}
            >
              <option value="" disabled className="bg-[#121212] text-[#777777]">
                Select current year of study...
              </option>
              {YEAR_OF_STUDY_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#121212] text-white">
                  {opt}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>
    </div>
  )
}

export default TeamMemberFields
