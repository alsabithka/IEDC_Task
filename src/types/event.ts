export type ScheduleCategory =
  | 'Check-in'
  | 'Keynote'
  | 'Sprint'
  | 'Mentoring'
  | 'Review'
  | 'Pitch'
  | 'Ceremony'
  | 'Break'

export interface ScheduleItem {
  id: string
  time: string
  title: string
  description: string
  category: ScheduleCategory
  speakerOrMentor?: string
  venue?: string
}

export interface ScheduleDay {
  dayNumber: number
  dayTitle: string
  dateLabel: string
  theme: string
  items: ScheduleItem[]
}

export interface ValuePillar {
  id: string
  number: string
  title: string
  description: string
  iconName: string
}

export interface NavLinkItem {
  label: string
  href: string
  index: string
}

export interface EventConfig {
  eventName: string
  edition: string
  headline: string
  tagline: string
  shortDescription: string
  durationLabel: string
  organizer: {
    name: string
    cell: string
    institution: string
    campusTag: string
  }
  dates: {
    eventDateRange: string
    isDateConfirmed: boolean
    targetCountdownISO: string
    placeholderNote: string
  }
  venue: {
    name: string
    campus: string
    city: string
    mode: 'In-Person' | 'Hybrid' | 'Virtual'
  }
  navLinks: NavLinkItem[]
  introduction: {
    badge: string
    title: string
    lead: string
    pillars: ValuePillar[]
    sprintMetrics: {
      value: string
      label: string
      unit?: string
    }[]
  }
  schedule: {
    isSampleSchedule: boolean
    day1: ScheduleDay
    day2: ScheduleDay
  }
  contact: {
    email: string
    leadContact: string
    locationNotice: string
  }
  socials: {
    linkedin: string
    instagram: string
    github: string
    x?: string
  }
}
