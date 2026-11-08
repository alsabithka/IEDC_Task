import React, { useState, useRef } from 'react'
import { FormField } from './FormField'
import { TeamMemberFields } from './TeamMemberFields'
import { RegistrationSuccess } from './RegistrationSuccess'
import { RegistrationResetModal } from './RegistrationResetModal'
import {
  DEFAULT_FORM_VALUES,
  YEAR_OF_STUDY_OPTIONS,
  createDefaultMember,
  type RegistrationFormData,
  type RegistrationFormErrors,
  type SubmissionStatus,
  type TeamMemberData,
  type TeamMemberErrors,
  type TeamMemberTouched,
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
  validateEntireForm,
} from './validation'
import {
  Send,
  RotateCcw,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'

const REGISTRATION_API_URL =
  import.meta.env.VITE_REGISTRATION_API_URL || '/api/register'

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationFormData>(DEFAULT_FORM_VALUES)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [errors, setErrors] = useState<RegistrationFormErrors>({})
  const [touched, setTouched] = useState<
    Partial<Record<keyof RegistrationFormData, boolean>>
  >({})
  const [touchedMembers, setTouchedMembers] = useState<TeamMemberTouched[]>([])
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false)

  const formRef = useRef<HTMLFormElement>(null)

  // Handle text input changes for Leader/Team fields
  const handleFieldChange = (
    field: keyof RegistrationFormData,
    value: string | number
  ) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'fullName') {
        next.teamLeaderName = value as string
      }
      return next
    })

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
      while (currentMembers.length < additionalCount) {
        currentMembers.push(createDefaultMember(prev.college))
      }
      return {
        ...prev,
        teamSize: validSize,
        teamMembers: currentMembers.slice(0, additionalCount),
      }
    })

    handleFieldChange('teamSize', validSize)
    // Clamp currentStep if new size is smaller than current step
    setCurrentStep((prev) => Math.min(prev, validSize))
  }

  // Handle Member Field change
  const handleMemberFieldChange = (
    index: number,
    field: keyof TeamMemberData,
    val: string
  ) => {
    setFormData((prev) => {
      const updated = [...prev.teamMembers]
      updated[index] = {
        ...(updated[index] || createDefaultMember(prev.college)),
        [field]: val,
      }
      return { ...prev, teamMembers: updated }
    })

    if (touchedMembers[index]?.[field]) {
      let fieldError: string | null = null
      switch (field) {
        case 'fullName':
          fieldError = validateFullName(val)
          break
        case 'email':
          fieldError = validateEmail(val)
          break
        case 'phone':
          fieldError = validatePhone(val)
          break
        case 'college':
          fieldError = validateCollege(val)
          break
        case 'department':
          fieldError = validateDepartment(val)
          break
        case 'yearOfStudy':
          fieldError = validateYearOfStudy(val)
          break
      }

      setErrors((prev) => {
        const memberErrs = [...(prev.teamMembers || [])]
        memberErrs[index] = {
          ...(memberErrs[index] || {}),
          [field]: fieldError || undefined,
        }
        return { ...prev, teamMembers: memberErrs }
      })
    }
  }

  // Handle Leader Field Blur
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

  // Handle Member Field Blur
  const handleMemberBlur = (
    index: number,
    field: keyof TeamMemberData
  ) => {
    setTouchedMembers((prev) => {
      const next = [...prev]
      next[index] = {
        ...(next[index] || {}),
        [field]: true,
      }
      return next
    })

    const member = formData.teamMembers[index] || createDefaultMember(formData.college)
    const val = member[field] || ''
    let fieldError: string | null = null

    switch (field) {
      case 'fullName':
        fieldError = validateFullName(val)
        break
      case 'email':
        fieldError = validateEmail(val)
        break
      case 'phone':
        fieldError = validatePhone(val)
        break
      case 'college':
        fieldError = validateCollege(val)
        break
      case 'department':
        fieldError = validateDepartment(val)
        break
      case 'yearOfStudy':
        fieldError = validateYearOfStudy(val)
        break
    }

    setErrors((prev) => {
      const memberErrs = [...(prev.teamMembers || [])]
      memberErrs[index] = {
        ...(memberErrs[index] || {}),
        [field]: fieldError || undefined,
      }
      return { ...prev, teamMembers: memberErrs }
    })
  }

  // Validate a specific step
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      // Step 1: Validate Leader Information + Team Information
      setTouched((prev) => ({
        ...prev,
        fullName: true,
        email: true,
        phone: true,
        college: true,
        department: true,
        yearOfStudy: true,
        teamName: true,
        teamSize: true,
      }))

      const stepErrors: RegistrationFormErrors = {}
      const nameErr = validateFullName(formData.fullName)
      if (nameErr) stepErrors.fullName = nameErr

      const emailErr = validateEmail(formData.email)
      if (emailErr) stepErrors.email = emailErr

      const phoneErr = validatePhone(formData.phone)
      if (phoneErr) stepErrors.phone = phoneErr

      const collegeErr = validateCollege(formData.college)
      if (collegeErr) stepErrors.college = collegeErr

      const deptErr = validateDepartment(formData.department)
      if (deptErr) stepErrors.department = deptErr

      const yearErr = validateYearOfStudy(formData.yearOfStudy)
      if (yearErr) stepErrors.yearOfStudy = yearErr

      const teamNameErr = validateTeamName(formData.teamName)
      if (teamNameErr) stepErrors.teamName = teamNameErr

      const teamSizeErr = validateTeamSize(formData.teamSize)
      if (teamSizeErr) stepErrors.teamSize = teamSizeErr

      setErrors((prev) => ({ ...prev, ...stepErrors }))

      if (Object.keys(stepErrors).length > 0) {
        const firstKey = Object.keys(stepErrors)[0]
        const el = document.getElementById(firstKey)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.focus()
        }
        return false
      }
      return true
    }

    // Step 2, 3, 4 corresponds to memberIndex = step - 2
    const memberIdx = step - 2
    setTouchedMembers((prev) => {
      const next = [...prev]
      next[memberIdx] = {
        fullName: true,
        email: true,
        phone: true,
        college: true,
        department: true,
        yearOfStudy: true,
      }
      return next
    })

    const member = formData.teamMembers[memberIdx] || createDefaultMember(formData.college)
    const mErr: TeamMemberErrors = {}

    const mNameErr = validateFullName(member.fullName)
    if (mNameErr) mErr.fullName = mNameErr

    const mEmailErr = validateEmail(member.email)
    if (mEmailErr) mErr.email = mEmailErr

    const mPhoneErr = validatePhone(member.phone)
    if (mPhoneErr) mErr.phone = mPhoneErr

    const mCollegeErr = validateCollege(member.college)
    if (mCollegeErr) mErr.college = mCollegeErr

    const mDeptErr = validateDepartment(member.department)
    if (mDeptErr) mErr.department = mDeptErr

    const mYearErr = validateYearOfStudy(member.yearOfStudy)
    if (mYearErr) mErr.yearOfStudy = mYearErr

    if (Object.keys(mErr).length > 0) {
      setErrors((prev) => {
        const memberErrs = [...(prev.teamMembers || [])]
        memberErrs[memberIdx] = mErr
        return { ...prev, teamMembers: memberErrs }
      })
      const firstSubKey = Object.keys(mErr)[0]
      const el = document.getElementById(`member-${step}-${firstSubKey}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.focus()
      }
      return false
    }

    return true
  }

  // Navigation handlers
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(formData.teamSize, prev + 1))
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate current step first
    if (!validateStep(currentStep)) {
      return
    }

    // Validate entire form across all steps
    const { isValid, errors: validationErrors } = validateEntireForm(formData)
    setErrors(validationErrors)

    if (!isValid) {
      // If error is in Step 1, jump to Step 1
      const step1Keys = [
        'fullName',
        'email',
        'phone',
        'college',
        'department',
        'yearOfStudy',
        'teamName',
        'teamSize',
      ]
      const step1Error = Object.keys(validationErrors).find((k) =>
        step1Keys.includes(k)
      )
      if (step1Error) {
        setCurrentStep(1)
        setTimeout(() => {
          const el = document.getElementById(step1Error)
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el?.focus()
        }, 50)
        return
      }

      // If error is in any member, jump to that member's step
      if (validationErrors.teamMembers) {
        for (let i = 0; i < validationErrors.teamMembers.length; i++) {
          const mErr = validationErrors.teamMembers[i]
          if (mErr && Object.keys(mErr).length > 0) {
            const targetStep = i + 2
            setCurrentStep(targetStep)
            setTimeout(() => {
              const subKey = Object.keys(mErr)[0]
              const el = document.getElementById(`member-${targetStep}-${subKey}`)
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              el?.focus()
            }, 50)
            return
          }
        }
      }
      return
    }

    // Initiate API Request
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
          teamMembers: formData.teamMembers
            .slice(0, Math.max(0, formData.teamSize - 1))
            .map((m) => ({
              fullName: m.fullName.trim(),
              email: m.email.trim(),
              phone: m.phone.trim(),
              college: m.college.trim(),
              department: m.department.trim(),
              yearOfStudy: m.yearOfStudy,
            })),
        }),
      })

      const result = await response.json().catch(() => ({}))

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.message || `Registration request failed with HTTP status ${response.status}.`
        )
      }

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
    setCurrentStep(1)
    setErrors({})
    setTouched({})
    setTouchedMembers([])
    setSubmissionStatus('idle')
    setErrorMessage('')
    setIsResetModalOpen(false)
  }

  // If successfully submitted, display confirmation screen
  if (submissionStatus === 'success') {
    return <RegistrationSuccess data={formData} onReset={handleConfirmReset} />
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 sm:space-y-8 animate-in fade-in duration-200"
      >
        {/* Error Alert Banner if API Failed */}
        {submissionStatus === 'error' && (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/30 bg-red-950/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-red-400"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-bold text-white">
                  Submission Unsuccessful
                </p>
                <p className="font-mono text-xs text-red-300/90 mt-0.5">
                  {errorMessage || 'A network error occurred while submitting your registration.'}
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
            STEP TRACKER (Always visible to maintain rock-solid layout height)
            ================================================================== */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#0c0c0c] border border-[#222222]">
          <div className="flex items-center justify-between gap-2">
            {Array.from({ length: formData.teamSize }).map((_, idx) => {
              const stepNum = idx + 1
              const isActive = currentStep === stepNum
              const isCompleted = currentStep > stepNum
              const label =
                stepNum === 1 ? 'Leader & Team' : `Member 0${stepNum}`

              return (
                <div key={stepNum} className="flex items-center gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (isCompleted) {
                        setCurrentStep(stepNum)
                        formRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        })
                      }
                    }}
                    disabled={!isCompleted && !isActive}
                    className={`flex items-center gap-2 text-left transition-all ${
                      isCompleted
                        ? 'cursor-pointer hover:opacity-80'
                        : isActive
                        ? 'cursor-default'
                        : 'cursor-not-allowed opacity-40'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-white text-black shadow-md ring-2 ring-white/30'
                          : isCompleted
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-[#181818] text-[#666666] border border-[#262626]'
                      }`}
                    >
                      {isCompleted ? '✓' : `0${stepNum}`}
                    </span>
                    <div className="hidden md:block">
                      <span className="block font-mono text-[9px] uppercase text-[#777777] leading-none">
                        Step 0{stepNum}
                      </span>
                      <span
                        className={`block font-sans text-xs font-bold leading-tight mt-0.5 ${
                          isActive
                            ? 'text-white'
                            : isCompleted
                            ? 'text-[#D0D0D0]'
                            : 'text-[#666666]'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  </button>

                  {idx < formData.teamSize - 1 && (
                    <div
                      className={`h-[1px] flex-1 mx-1 sm:mx-2 transition-all ${
                        isCompleted ? 'bg-white/40' : 'bg-[#222222]'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ==================================================================
            STEP 1: PERSONAL INFORMATION & TEAM STRUCTURE
            ================================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            {/* 1. Personal Information (Member 1 / Leader) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#222222]">
                <span className="w-2 h-2 rounded-full bg-white" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                  01 · Personal Information (Member 1 / Team Leader)
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
                    aria-describedby={
                      errors.fullName ? 'fullName-error' : 'fullName-desc'
                    }
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
                    aria-describedby={
                      errors.email ? 'email-error' : 'email-desc'
                    }
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
                    aria-describedby={
                      errors.phone ? 'phone-error' : 'phone-desc'
                    }
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
                    onChange={(e) =>
                      handleFieldChange('department', e.target.value)
                    }
                    onBlur={() => handleBlur('department')}
                    placeholder="e.g. Computer Science and Engineering"
                    aria-invalid={touched.department && !!errors.department}
                    aria-describedby={
                      errors.department ? 'department-error' : 'department-desc'
                    }
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
                    onChange={(e) =>
                      handleFieldChange('yearOfStudy', e.target.value)
                    }
                    onBlur={() => handleBlur('yearOfStudy')}
                    aria-invalid={touched.yearOfStudy && !!errors.yearOfStudy}
                    aria-describedby={
                      errors.yearOfStudy ? 'yearOfStudy-error' : undefined
                    }
                    className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white transition-all focus:outline-none focus:ring-1 ${
                      touched.yearOfStudy && errors.yearOfStudy
                        ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
                    }`}
                  >
                    <option
                      value=""
                      disabled
                      className="bg-[#121212] text-[#777777]"
                    >
                      Select your current year of study...
                    </option>
                    {YEAR_OF_STUDY_OPTIONS.map((opt) => (
                      <option
                        key={opt}
                        value={opt}
                        className="bg-[#121212] text-white"
                      >
                        {opt}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>

            {/* 2. Team Information */}
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
                    aria-describedby={
                      errors.teamName ? 'teamName-error' : 'teamName-desc'
                    }
                    className={`w-full rounded-xl border bg-[#0a0a0a] px-4 py-3 font-sans text-sm text-white placeholder-[#555555] transition-all focus:outline-none focus:ring-1 ${
                      touched.teamName && errors.teamName
                        ? 'border-red-500 bg-red-950/10 focus:border-red-500 focus:ring-red-500'
                        : 'border-[#262626] hover:border-[#3a3a3a] focus:border-white focus:ring-white'
                    }`}
                  />
                </FormField>

                {/* Team Size Selector with Smooth Sliding Toggle Animation */}
                <FormField
                  id="teamSize"
                  label="Number of Team Members"
                  required
                  error={touched.teamSize ? errors.teamSize : undefined}
                  helperText="Official event rules allow 1 to 4 members per team"
                >
                  <div className="relative grid grid-cols-4 gap-2 select-none">
                    {/* Background slots matching exact button boundaries */}
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={`bg-slot-${s}`}
                        className="rounded-xl border border-[#262626] bg-[#0a0a0a] transition-colors duration-200"
                        style={{
                          gridColumn: `${s} / ${s + 1}`,
                          gridRow: '1 / 2',
                        }}
                      />
                    ))}

                    {/* Smooth Sliding Active White Pill */}
                    <div
                      className="absolute top-0 bottom-0 rounded-xl bg-white shadow-lg pointer-events-none z-[1] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        left: 0,
                        width: 'calc(25% - 6px)',
                        transform:
                          formData.teamSize === 1
                            ? 'translate3d(0, 0, 0)'
                            : formData.teamSize === 2
                            ? 'translate3d(calc(100% + 8px), 0, 0)'
                            : formData.teamSize === 3
                            ? 'translate3d(calc(200% + 16px), 0, 0)'
                            : 'translate3d(calc(300% + 24px), 0, 0)',
                      }}
                    />

                    {/* Interactive Button Elements */}
                    {[1, 2, 3, 4].map((size) => {
                      const isSelected = formData.teamSize === size
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleTeamSizeChange(size)}
                          className={`relative z-10 py-3 px-2 rounded-xl font-mono text-xs font-bold transition-colors duration-200 cursor-pointer text-center ${
                            isSelected
                              ? 'text-black font-black'
                              : 'text-[#888888] hover:text-white'
                          }`}
                          style={{
                            gridColumn: `${size} / ${size + 1}`,
                            gridRow: '1 / 2',
                          }}
                        >
                          <span>
                            {size} {size === 1 ? 'Person' : 'Persons'}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </FormField>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            STEP 2, 3, 4: TEAM MEMBER PERSONAL DETAILS
            (Shown sequentially when teamSize > 1)
            ================================================================== */}
        {currentStep > 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <TeamMemberFields
              memberNumber={currentStep}
              totalTeamSize={formData.teamSize}
              member={
                formData.teamMembers[currentStep - 2] ||
                createDefaultMember(formData.college)
              }
              onMemberFieldChange={(field, val) =>
                handleMemberFieldChange(currentStep - 2, field, val)
              }
              onMemberBlur={(field) =>
                handleMemberBlur(currentStep - 2, field)
              }
              errors={errors.teamMembers?.[currentStep - 2]}
              isTouched={touchedMembers[currentStep - 2]}
            />
          </div>
        )}

        {/* ==================================================================
            ACTIONS: BACK / NEXT / SUBMIT / RESET
            - If only one person: Submit button is right there on Step 1
            - If teamSize > 1: Next button on Step 1, Member 2 on next step, etc.
            ================================================================== */}
        <div className="pt-6 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto order-2 sm:order-1">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={submissionStatus === 'loading'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              disabled={submissionStatus === 'loading'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-transparent px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-white hover:border-white/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="w-full sm:w-auto order-1 sm:order-2">
            {currentStep < formData.teamSize ? (
              /* If more members remaining: Show Next button */
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-3 rounded-full bg-white text-black px-8 py-3.5 font-sans text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg hover:bg-[#EAEAEA] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Next: Member 0{currentStep + 1} Details</span>
                <ArrowRight className="h-4 w-4 text-black" />
              </button>
            ) : (
              /* If only 1 person OR on the final member's step: Show Submit Registration button */
              <button
                type="submit"
                disabled={submissionStatus === 'loading'}
                className="w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-3 rounded-full bg-white text-black px-8 py-3.5 font-sans text-xs sm:text-sm font-black uppercase tracking-wider shadow-lg hover:bg-[#EAEAEA] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
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
            )}
          </div>
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
