export interface RegistrationFormData {
  fullName: string
  email: string
  phone: string
  college: string
  department: string
  yearOfStudy: string
  teamName: string
  teamSize: number
  teamLeaderName: string
  teamMembers: string[] // Members 2..N
}

export interface RegistrationFormErrors {
  fullName?: string
  email?: string
  phone?: string
  college?: string
  department?: string
  yearOfStudy?: string
  teamName?: string
  teamSize?: string
  teamLeaderName?: string
  teamMembers?: string[]
}

export type SubmissionStatus = 'idle' | 'loading' | 'success' | 'error'

export const YEAR_OF_STUDY_OPTIONS = [
  '1st Year (B.Tech / B.E / B.Sc)',
  '2nd Year (B.Tech / B.E / B.Sc)',
  '3rd Year (B.Tech / B.E / B.Sc)',
  '4th Year (B.Tech / B.E / B.Sc)',
  'Postgraduate (M.Tech / MCA / MBA / M.Sc)',
  'Other / Dual Degree',
] as const

export const DEFAULT_FORM_VALUES: RegistrationFormData = {
  fullName: '',
  email: '',
  phone: '',
  college: 'College of Engineering Chengannur',
  department: '',
  yearOfStudy: '',
  teamName: '',
  teamSize: 2,
  teamLeaderName: '',
  teamMembers: [''], // 1 extra member for teamSize 2
}
