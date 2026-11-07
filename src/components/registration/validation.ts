import type { RegistrationFormData, RegistrationFormErrors } from './types'

export const validateFullName = (value: string): string | null => {
  const trimmed = value.trim()
  if (!trimmed) return 'Full name is required.'
  if (trimmed.length < 2) return 'Full name must be at least 2 characters.'
  if (trimmed.length > 80) return 'Full name cannot exceed 80 characters.'
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
    return 'Full name should only contain letters, spaces, and hyphens.'
  }
  return null
}

export const validateEmail = (value: string): string | null => {
  const trimmed = value.trim()
  if (!trimmed) return 'Email address is required.'
  // Strict standard email format check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address (e.g. name@college.edu).'
  }
  return null
}

export const validatePhone = (value: string): string | null => {
  const trimmed = value.trim()
  if (!trimmed) return 'Phone number is required.'
  if (/[a-zA-Z]/.test(trimmed)) {
    return 'Phone number cannot contain alphabetic characters.'
  }
  // Remove formatting characters to inspect digits
  const digitsOnly = trimmed.replace(/[\s\-()+]/g, '')
  // Indian mobile validation: 10 digits starting with 6-9, optionally prefixed by 91 or 0
  const indianMobileRegex = /^(?:(?:91|0)?[6-9]\d{9})$/
  if (!indianMobileRegex.test(digitsOnly)) {
    return 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210).'
  }
  return null
}

export const validateCollege = (value: string): string | null => {
  const trimmed = value.trim()
  if (!trimmed) return 'College / Institution name is required.'
  if (trimmed.length < 3) return 'College name must be at least 3 characters.'
  return null
}

export const validateDepartment = (value: string): string | null => {
  const trimmed = value.trim()
  if (!trimmed) return 'Course / Department is required.'
  if (trimmed.length < 2) return 'Department must be at least 2 characters.'
  return null
}

export const validateYearOfStudy = (value: string): string | null => {
  if (!value || !value.trim()) return 'Please select your current year of study.'
  return null
}

export const validateTeamName = (value: string): string | null => {
  const trimmed = value.trim()
  if (!trimmed) return 'Team name is required.'
  if (trimmed.length < 2) return 'Team name must be at least 2 characters.'
  if (trimmed.length > 50) return 'Team name cannot exceed 50 characters.'
  return null
}

export const validateTeamSize = (size: number): string | null => {
  if (!Number.isInteger(size) || size < 1 || size > 4) {
    return 'Team size must be between 1 and 4 members as per event rules.'
  }
  return null
}

export const validateMemberName = (value: string, memberNumber: number): string | null => {
  const trimmed = value.trim()
  if (!trimmed) return `Member ${memberNumber} name is required.`
  if (trimmed.length < 2) return `Member ${memberNumber} name must be at least 2 characters.`
  if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
    return `Member ${memberNumber} name should only contain letters, spaces, and hyphens.`
  }
  return null
}

export const validateEntireForm = (data: RegistrationFormData): {
  isValid: boolean
  errors: RegistrationFormErrors
} => {
  const errors: RegistrationFormErrors = {}

  const nameErr = validateFullName(data.fullName)
  if (nameErr) errors.fullName = nameErr

  const emailErr = validateEmail(data.email)
  if (emailErr) errors.email = emailErr

  const phoneErr = validatePhone(data.phone)
  if (phoneErr) errors.phone = phoneErr

  const collegeErr = validateCollege(data.college)
  if (collegeErr) errors.college = collegeErr

  const deptErr = validateDepartment(data.department)
  if (deptErr) errors.department = deptErr

  const yearErr = validateYearOfStudy(data.yearOfStudy)
  if (yearErr) errors.yearOfStudy = yearErr

  const teamNameErr = validateTeamName(data.teamName)
  if (teamNameErr) errors.teamName = teamNameErr

  const teamSizeErr = validateTeamSize(data.teamSize)
  if (teamSizeErr) errors.teamSize = teamSizeErr

  // Validate team members (members 2..N)
  const memberCountNeeded = Math.max(0, data.teamSize - 1)
  const memberErrors: string[] = []
  let hasMemberError = false

  for (let i = 0; i < memberCountNeeded; i++) {
    const memberVal = data.teamMembers[i] || ''
    const err = validateMemberName(memberVal, i + 2)
    memberErrors.push(err || '')
    if (err) hasMemberError = true
  }

  if (hasMemberError) {
    errors.teamMembers = memberErrors
  }

  const isValid = Object.keys(errors).length === 0
  return { isValid, errors }
}
