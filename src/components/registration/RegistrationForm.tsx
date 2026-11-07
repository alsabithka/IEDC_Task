import React, { useState, useRef } from 'react'
import { FormField } from './FormField'
import { TeamMemberFields } from './TeamMemberFields'
import { RegistrationSuccess } from './RegistrationSuccess'
import { RegistrationResetModal } from './RegistrationResetModal'
import {
  DEFAULT_FORM_VALUES,
  YEAR_OF_STUDY_OPTIONS,
  type RegistrationFormData,
  type RegistrationFormErrors,
  type SubmissionStatus,
} from './types'
import {
  validateFullName,
  validateEmail,
  validatePhone,
  validateCollege,
  validateDepartment,
  validateYearOfStudy,
  validateTeamName,
  validateTeamSize,
  validateMemberName,
  validateEntireForm,
} from './validation'
import {
  Send,
  RotateCcw,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react'

const REGISTRATION_API_URL =
  import.meta.env.VITE_REGISTRATION_API_URL || '/api/register'

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>(DEFAULT_FORM_VALUES)
  const [errors, setErrors] = useState<RegistrationFormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof RegistrationFormData, boolean>>>({})
  const [touchedMembers, setTouchedMembers] = useState<boolean[]>([])
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false)

  const formRef = useRef<HTMLFormElement>(null)

  // Handle text input changes
  const handleFieldChange = (field: keyof RegistrationFormData, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      // Auto-update team leader name with full name unless customized
      if (field === 'fullName') {
        next.teamLeaderName = value as string
      }
      return next
    })

    // If field was already touched, re-validate dynamically to clear error
    if (touched[field]) {
      let fieldError: string | null = null
      const strVal = String(value)

      switch (field) {
        case 'fullName':
          fieldError = validateFullName(strVal)
          break
        case 'email':
          fieldError = validateEmail(strVal)
          break
        case 'phone':
          fieldError = validatePhone(strVal)
          break
        case 'college':
          fieldError = validateCollege(strVal)
          break
        case 'department':
          fieldError = validateDepartment(strVal)
          break
        case 'yearOfStudy':
          fieldError = validateYearOfStudy(strVal)
          break
        case 'teamName':
          fieldError = validateTeamName(strVal)
          break
        case 'teamSize':
          fieldError = validateTeamSize(Number(value))
          break
      }

      setErrors((prev) => ({
        ...prev,
        [field]: fieldError || undefined,
      }))
    }
  }

  // Handle Team Size change
  const handleTeamSizeChange = (newSize: number) => {
    const validSize = Math.max(1, Math.min(4, newSize))
    setFormData((prev) => {
      const additionalCount = Math.max(0, validSize - 1)
      const currentMembers = [...prev.teamMembers]
      // Adjust array size
      while (currentMembers.length < additionalCount) {
        currentMembers.push('')
      }
      return {
        ...prev,
        teamSize: validSize,
        teamMembers: currentMembers.slice(0, additionalCount),
      }
    })

    handleFieldChange('teamSize', validSize)
  }

  // Handle Member Name change
  const handleMemberChange = (index: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.teamMembers]
      updated[index] = val
      return { ...prev, teamMembers: updated }
    })

    if (touchedMembers[index]) {
      const err = validateMemberName(val, index + 2)
      setErrors((prev) => {
        const memberErrs = [...(prev.teamMembers || [])]
        memberErrs[index] = err || ''
        return { ...prev, teamMembers: memberErrs }
      })
    }
  }

  // Handle Field Blur (validate on blur as required by Section 4)
  const handleBlur = (field: keyof RegistrationFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))

    let fieldError: string | null = null
    const strVal = String(formData[field])

    switch (field) {
      case 'fullName':
        fieldError = validateFullName(strVal)
        break
      case 'email':
        fieldError = validateEmail(strVal)
        break
      case 'phone':
        fieldError = validatePhone(strVal)
        break
      case 'college':
        fieldError = validateCollege(strVal)
        break
      case 'department':
        fieldError = validateDepartment(strVal)
        break
      case 'yearOfStudy':
        fieldError = validateYearOfStudy(strVal)
        break
      case 'teamName':
        fieldError = validateTeamName(strVal)
        break
      case 'teamSize':
        fieldError = validateTeamSize(formData.teamSize)
        break
    }

    setErrors((prev) => ({
      ...prev,
      [field]: fieldError || undefined,
    }))
  }

  const handleMemberBlur = (index: number) => {
    setTouchedMembers((prev) => {
      const next = [...prev]
      next[index] = true
      return next
    })

    const memberVal = formData.teamMembers[index] || ''
    const err = validateMemberName(memberVal, index + 2)
    setErrors((prev) => {
      const memberErrs = [...(prev.teamMembers || [])]
      memberErrs[index] = err || ''
      return { ...prev, teamMembers: memberErrs }
    })
  }

  // Submit Handler with Async API Call & Strict Success Conditions (Section 9)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      college: true,
      department: true,
      yearOfStudy: true,
      teamName: true,
      teamSize: true,
      teamLeaderName: true,
    })
    const additionalMembers = Math.max(0, formData.teamSize - 1)
    setTouchedMembers(Array(additionalMembers).fill(true))

    // 2. Validate all fields
    const { isValid, errors: validationErrors } = validateEntireForm(formData)
    setErrors(validationErrors)

    if (!isValid) {
      // Automatically scroll to first invalid field
      const firstErrorKey = Object.keys(validationErrors)[0]
      if (firstErrorKey) {
        const errorElement = document.getElementById(
          firstErrorKey === 'teamMembers' ? 'team-member-2' : firstErrorKey
        )
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          errorElement.focus()
        }
      }
      return
    }

    // 3. Initiate API Request with try/catch/finally
    setSubmissionStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch(REGISTRATION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          college: formData.college.trim(),
          department: formData.department.trim(),
          yearOfStudy: formData.yearOfStudy,
          teamName: formData.teamName.trim(),
          teamSize: formData.teamSize,
          teamLeaderName: (formData.teamLeaderName || formData.fullName).trim(),
          teamMembers: formData.teamMembers.slice(0, Math.max(0, formData.teamSize - 1)).map((m) => m.trim()),
        }),
      })

      const result = await response.json().catch(() => ({}))

      // Strict Success Condition: response.ok AND server explicit confirmation
      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || `Registration request failed with HTTP status ${response.status}.`
        )
      }

      // Success confirmed by server
      setSubmissionStatus('success')
    } catch (err: unknown) {
      setSubmissionStatus('error')
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the registration service. Please verify your connection and try again.'
      )
    }
  }

  // Confirmed Reset Form
  const handleConfirmReset = () => {
    setFormData(DEFAULT_FORM_VALUES)
    setErrors({})
    setTouched({})
    setTouchedMembers([])
    setSubmissionStatus('idle')
    setErrorMessage('')
    setIsResetModalOpen(false)
  }

  // If successfully submitted, display polished confirmation screen
  if (submissionStatus === 'success') {
    return <RegistrationSuccess data={formData} onReset={handleConfirmReset} />
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-8 animate-in fade-in duration-200"
      >
        {/* Error Alert Banner if API Failed */}
        {submissionStatus === 'error' && (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/50 bg-red-950/30 p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-sans font-bold text-sm text-red-200">
                  Submission Could Not Be Completed
                </p>
                <p className="font-sans text-xs text-red-300/90 mt-0.5">
                  {errorMessage || 'Registration submission is currently unavailable. Organizers will announce the official gateway soon.'}
                </p>
                <p className="font-mono text-[11px] text-[#A0A0A0] mt-1">
                  Your entered data has been preserved intact. You may correct fields or retry.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#EAEAEA] transition-all cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Submission</span>
            </button>
          </div>
        )}

        {/* ==================================================================
            SECTION 1: PERSONAL INFORMATION
            ================================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222222]">
            <span className="w-2 h-2 rounded-full bg-white" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              01 · Personal Information (Team Leader / Applicant)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Full Name */}
            <FormField
              id="fullName"
              label="Full Name"
              required
              error={touched.fullName ? errors.fullName : undefined}
              helperText="Official name for badge verification and sprint certificate"
            >
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={formData.fullName}
                onChange={(e) => handleFieldChange('fullName', e.target.value)}
                onBlur={() => handleBlur('fullName')}
                placeholder="e.g. Alex Johnson"
                aria-invalid={touched.fullName && !!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : 'fullName-desc'}
                className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                  touched.fullName && errors.fullName
                    ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
                }`}
              />
            </FormField>

            {/* Email Address */}
            <FormField
              id="email"
              label="Email Address"
              required
              error={touched.email ? errors.email : undefined}
              helperText="Used for workshop updates and verification"
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="e.g. alex@college.edu"
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={errors.email ? 'email-error' : 'email-desc'}
                className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                  touched.email && errors.email
                    ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
                }`}
              />
            </FormField>

            {/* Phone Number */}
            <FormField
              id="phone"
              label="Phone Number"
              required
              error={touched.phone ? errors.phone : undefined}
              helperText="10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210)"
            >
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="+91 98765 43210"
                aria-invalid={touched.phone && !!errors.phone}
                aria-describedby={errors.phone ? 'phone-error' : 'phone-desc'}
                className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                  touched.phone && errors.phone
                    ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
                }`}
              />
            </FormField>

            {/* College / Institution */}
            <FormField
              id="college"
              label="College / Institution Name"
              required
              error={touched.college ? errors.college : undefined}
            >
              <input
                id="college"
                type="text"
                value={formData.college}
                onChange={(e) => handleFieldChange('college', e.target.value)}
                onBlur={() => handleBlur('college')}
                placeholder="e.g. College of Engineering Chengannur"
                aria-invalid={touched.college && !!errors.college}
                aria-describedby={errors.college ? 'college-error' : undefined}
                className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                  touched.college && errors.college
                    ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
                }`}
              />
            </FormField>

            {/* Course / Department */}
            <FormField
              id="department"
              label="Course / Department"
              required
              error={touched.department ? errors.department : undefined}
              helperText="e.g. Computer Science, Electronics, Mechanical"
            >
              <input
                id="department"
                type="text"
                value={formData.department}
                onChange={(e) => handleFieldChange('department', e.target.value)}
                onBlur={() => handleBlur('department')}
                placeholder="e.g. Computer Science and Engineering"
                aria-invalid={touched.department && !!errors.department}
                aria-describedby={errors.department ? 'department-error' : 'department-desc'}
                className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                  touched.department && errors.department
                    ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
                }`}
              />
            </FormField>

            {/* Year of Study */}
            <FormField
              id="yearOfStudy"
              label="Year of Study"
              required
              error={touched.yearOfStudy ? errors.yearOfStudy : undefined}
            >
              <select
                id="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={(e) => handleFieldChange('yearOfStudy', e.target.value)}
                onBlur={() => handleBlur('yearOfStudy')}
                aria-invalid={touched.yearOfStudy && !!errors.yearOfStudy}
                aria-describedby={errors.yearOfStudy ? 'yearOfStudy-error' : undefined}
                className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white transition-all focus:outline-none focus:ring-1 ${
                  touched.yearOfStudy && errors.yearOfStudy
                    ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
                }`}
              >
                <option value="" disabled className="bg-[#121212] text-[#777777]">
                  Select your current year of study...
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

        {/* ==================================================================
            SECTION 2: TEAM INFORMATION
            ================================================================== */}
        <div className="space-y-4 pt-4 border-t border-[#222222]">
          <div className="flex items-center gap-2 pb-2 border-b border-[#222222]">
            <span className="w-2 h-2 rounded-full bg-white" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
              02 · Team Structure & Members (1 to 4 Members)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Team Name */}
            <FormField
              id="teamName"
              label="Team Name"
              required
              error={touched.teamName ? errors.teamName : undefined}
              helperText="Choose a distinctive team identity for presentation and awards"
            >
              <input
                id="teamName"
                type="text"
                value={formData.teamName}
                onChange={(e) => handleFieldChange('teamName', e.target.value)}
                onBlur={() => handleBlur('teamName')}
                placeholder="e.g. Circuit Crafters"
                aria-invalid={touched.teamName && !!errors.teamName}
                aria-describedby={errors.teamName ? 'teamName-error' : 'teamName-desc'}
                className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                  touched.teamName && errors.teamName
                    ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                    : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
                }`}
              />
            </FormField>

            {/* Team Size Selector */}
            <FormField
              id="teamSize"
              label="Number of Team Members"
              required
              error={touched.teamSize ? errors.teamSize : undefined}
              helperText="Official event rules allow 1 to 4 members per team"
            >
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleTeamSizeChange(size)}
                    className={`py-3 px-2 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer text-center ${
                      formData.teamSize === size
                        ? 'border-white bg-white text-black shadow-md'
                        : 'border-[#262626] bg-[#0a0a0a] text-[#888888] hover:text-white hover:border-[#444444]'
                    }`}
                  >
                    <span>{size} {size === 1 ? 'Solo' : 'Pax'}</span>
                  </button>
                ))}
              </div>
            </FormField>
          </div>

          {/* Dynamic Team Members Fields */}
          <TeamMemberFields
            teamSize={formData.teamSize}
            applicantFullName={formData.fullName}
            teamLeaderName={formData.teamLeaderName}
            teamMembers={formData.teamMembers}
            onMemberNameChange={handleMemberChange}
            onMemberBlur={handleMemberBlur}
            errors={errors.teamMembers}
            touchedMembers={touchedMembers}
          />
        </div>

        {/* ==================================================================
            ACTIONS: SUBMIT & RESET
            ================================================================== */}
        <div className="pt-6 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            disabled={submissionStatus === 'loading'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-transparent px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-white hover:border-white/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Form</span>
          </button>

          <button
            type="submit"
            disabled={submissionStatus === 'loading'}
            className="w-full sm:w-auto min-w-[220px] inline-flex items-center justify-center gap-3 rounded-full bg-white text-black px-8 py-3.5 font-sans text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg hover:bg-[#EAEAEA] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            {submissionStatus === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-black" />
                <span>Transmitting Details...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4 text-black" />
                <span>Submit Registration</span>
              </>
            )}
          </button>
        </div>

        {/* Frontend Disclaimer Pill */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#666666] pt-1">
          <Sparkles className="h-3 w-3 text-[#888888]" />
          <span>Interactive Frontend Demonstration · CEC IEDC BOOTCAMP 2026</span>
        </div>
      </form>

      {/* Confirmation Dialog on Reset */}
      <RegistrationResetModal
        isOpen={isResetModalOpen}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </>
  )
}

export default RegistrationForm
