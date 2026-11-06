/**
 * ============================================================================
 * CENTRALIZED SITE CONFIGURATION
 * ============================================================================
 * Single source of truth for all editable website content, navigation,
 * brand parameters, organizational metadata, and contact details.
 *
 * NOTE: Contains only explicitly confirmed or provisional information
 * provided in the project. No content is invented.
 */

export interface NavItem {
  label: string
  href: string
}

export interface MetricItem {
  value: string
  label: string
  unit?: string
}

export interface PillarItem {
  id: string
  number: string
  title: string
  description: string
}

export interface SiteConfig {
  brand: {
    name: string
    edition: string
    fullName: string
    tagline: string
  }
  organizer: {
    name: string
    cell: string
    institution: string
    campusTag: string
  }
  navigation: NavItem[]
  cta: {
    label: string
    href: string
  }
  hero: {
    badge: string
    headline: string
    tagline: string
    description: string
    primaryCta: {
      label: string
      href: string
    }
    secondaryCta: {
      label: string
      href: string
    }
  }
  overview: {
    badge: string
    title: string
    description: string
    pillars: PillarItem[]
    metrics: MetricItem[]
  }
  details: {
    badge: string
    title: string
    description: string
    dateRange: string
    isDateConfirmed: boolean
    dateNotice: string
    venueName: string
    campus: string
    location: string
    mode: string
    duration: string
  }
  contact: {
    email: string
    locationNotice: string
    leadContact: string
  }
  socials: {
    linkedin?: string
    instagram?: string
    github?: string
    x?: string
  }
}

export const siteConfig: SiteConfig = {
  brand: {
    name: 'IDEA SPRINT',
    edition: '2026',
    fullName: 'IEDC IDEA SPRINT 2026',
    tagline: '24-Hour Student Ideathon & Venture Sprint',
  },

  organizer: {
    name: 'IEDC BOOTCAMP CEC',
    cell: 'Innovation & Entrepreneurship Development Centre',
    institution: 'College of Engineering Chengannur',
    campusTag: 'CEC Campus, Kerala',
  },

  navigation: [
    { label: 'Overview', href: '#overview' },
    { label: 'Details', href: '#details' },
    { label: 'Pillars', href: '#pillars' },
    { label: 'Contact', href: '#contact' },
  ],

  cta: {
    label: 'Contact Team',
    href: '#contact',
  },

  hero: {
    badge: 'IEDC BOOTCAMP CEC',
    headline: 'Transform Bold Concepts into Validated Ventures in 24 Hours',
    tagline: '24-Hour Student Ideathon & Venture Acceleration Marathon',
    description:
      'An intensive crucible uniting engineering minds, product designers, and student founders at College of Engineering Chengannur. Brainstorm, pressure-test, and pitch transformative technological solutions to industry mentors.',
    primaryCta: {
      label: 'Explore Overview',
      href: '#overview',
    },
    secondaryCta: {
      label: 'Event Details',
      href: '#details',
    },
  },

  overview: {
    badge: 'PROGRAM OVERVIEW',
    title: 'Where Creative Disruption Meets Rigorous Execution',
    description:
      'A structured 24-hour sprint engineered to challenge cross-disciplinary teams to identify urgent real-world problems, build lean prototypes, and validate viable venture roadmaps with direct mentorship from industry veterans.',
    pillars: [
      {
        id: 'ideas',
        number: '01',
        title: 'High-Impact Ideas',
        description:
          'Move past conventional hackathon projects. Focus on solving deep domain bottlenecks across healthcare, sustainability, AI, and civic tech.',
      },
      {
        id: 'collaboration',
        number: '02',
        title: 'Radical Collaboration',
        description:
          'Pair technical coders with designers, analysts, and domain thinkers. Multi-disciplinary teams create resilient, multi-dimensional prototypes.',
      },
      {
        id: 'experimentation',
        number: '03',
        title: 'Rapid Experimentation',
        description:
          'Fail fast, iterate faster. Pressure-test hypotheses within structured mentor critique checkpoints and live jury pitching rounds.',
      },
    ],
    metrics: [
      { value: '24', label: 'Continuous Hours', unit: 'HRS' },
      { value: '100+', label: 'Student Innovators', unit: 'MINDS' },
      { value: '03', label: 'Structured Review Gates', unit: 'GATES' },
      { value: 'Pool', label: 'Grant & Incubation Support', unit: 'PERKS' },
    ],
  },

  details: {
    badge: 'EVENT SPECIFICATIONS',
    title: 'Key Information & Venue Details',
    description:
      'Essential operational parameters for participants and mentors. All official schedule updates will be released through verified IEDC BOOTCAMP CEC channels.',
    dateRange: 'December 12 – 13, 2026',
    isDateConfirmed: false,
    dateNotice:
      'Tentative schedule placeholder. Official dates will be confirmed via IEDC BOOTCAMP CEC channels.',
    venueName: 'Main Auditorium & Innovation Studio',
    campus: 'College of Engineering Chengannur (CEC)',
    location: 'Chengannur, Alappuzha, Kerala',
    mode: 'In-Person',
    duration: '24-Hour Intensive Ideathon',
  },

  contact: {
    email: 'iedc@ceconline.edu',
    locationNotice: 'College of Engineering Chengannur, Kerala 689121',
    leadContact: 'IEDC Student Lead',
  },

  socials: {
    linkedin: 'https://www.linkedin.com/company/iedc-bootcamp-cec/',
    instagram: 'https://www.instagram.com/iedcbootcampcec/',
    github: 'https://github.com/iedc-ceconline',
    x: 'https://x.com/iedc_cec',
  },
}

