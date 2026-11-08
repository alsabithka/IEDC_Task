import type { EventConfig } from '../types/event'

/**
 * ============================================================================
 * CENTRALIZED EVENT CONFIGURATION — IEDC IDEA SPRINT 2026
 * ============================================================================
 * All official dates, copy, schedule tracks, organizer details, and contact
 * parameters are managed here.
 *
 * NOTE: For details that are not yet officially gazetted, clearly marked
 * placeholders are provided below. Do not invent official claims.
 */

// Placeholder target date set ~30 days in future from current time so countdown ticks live.
const DEFAULT_TARGET_DATE = '2026-12-12T09:00:00+05:30'

export const EVENT_CONFIG: EventConfig = {
  eventName: 'IDEA SPRINT',
  edition: '2026',
  headline: 'Transform Bold Concepts into Validated Ventures in 24 Hours',
  tagline: '24-Hour Student Ideathon & Venture Acceleration Marathon',
  shortDescription:
    'An intensive crucible uniting engineering minds, product designers, and student founders at College of Engineering Chengannur. Brainstorm, pressure-test, and pitch transformative technological solutions to industry mentors.',
  durationLabel: '24-Hour Intensive Ideathon',

  organizer: {
    name: 'IEDC BOOTCAMP CEC',
    cell: 'Innovation & Entrepreneurship Development Centre',
    institution: 'College of Engineering Chengannur',
    campusTag: 'CEC Campus, Kerala',
  },

  dates: {
    eventDateRange: 'December 12 – 13, 2026',
    isDateConfirmed: false, // Flag indicating date status is provisional/placeholder
    targetCountdownISO: DEFAULT_TARGET_DATE,
    placeholderNote:
      'Tentative schedule placeholder. Official dates will be confirmed via IEDC BOOTCAMP CEC channels.',
  },

  venue: {
    name: 'College of Engineering Chengannur',
    campus: 'College of Engineering Chengannur (CEC)',
    address:
      'Engineering College Road, opposite Federal Bank, Chengannur, Alappuzha District, Kerala – 689121',
    shortAddress: 'Engineering College Road, Chengannur, Kerala – 689121',
    city: 'Chengannur, Alappuzha, Kerala',
    plusCode: '8J88+WXQ',
    mode: 'In-Person',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=College%20of%20Engineering%20Chengannur%208J88%2BWXQ%2C%20Engineering%20College%20Road%20opp.%20FEDERALBANK%20Alapuzha%20District%2C%20SH%201%2C%20Chengannur%2C%20Kerala%20689121',
  },

  navLinks: [
    { label: 'Overview', href: '#about', index: '01' },
    { label: 'Schedule', href: '#schedule', index: '02' },
    { label: 'Track Matcher', href: '#matcher', index: '03' },
    { label: 'Register', href: '#register', index: '04' },
    { label: 'Contact', href: '#contact', index: '05' },
  ],

  introduction: {
    badge: 'ABOUT THE SPRINT',
    title: 'Where Creative Disruption Meets Rigorous Execution',
    lead:
      'IEDC IDEA SPRINT 2026 is a signature 24-hour hack-and-ideate sprint engineered by IEDC BOOTCAMP CEC. We challenge cross-disciplinary teams to identify urgent real-world problems, build lean prototypes, and validate viable venture roadmaps with direct mentorship from industry veterans.',
    pillars: [
      {
        id: 'ideas',
        number: '01',
        title: 'High-Impact Ideas',
        description:
          'Move past conventional hackathon projects. Focus on solving deep domain bottlenecks across healthcare, sustainability, AI, and civic tech.',
        iconName: 'Lightbulb',
      },
      {
        id: 'collaboration',
        number: '02',
        title: 'Radical Collaboration',
        description:
          'Pair technical coders with designers, analysts, and domain thinkers. Multi-disciplinary teams create resilient, multi-dimensional prototypes.',
        iconName: 'Users',
      },
      {
        id: 'experimentation',
        number: '03',
        title: 'Rapid Experimentation',
        description:
          'Fail fast, iterate faster. Pressure-test hypotheses within structured mentor critique checkpoints and live jury pitching rounds.',
        iconName: 'Zap',
      },
    ],
    sprintMetrics: [
      { value: '24', label: 'Continuous Hours', unit: 'HRS' },
      { value: '100+', label: 'Student Innovators', unit: 'MINDS' },
      { value: '03', label: 'Structured Review Gates', unit: 'GATES' },
      { value: '₹Pool', label: 'Grant & Incubation Support', unit: 'PERKS' },
    ],
  },

  schedule: {
    isSampleSchedule: true, // Marked as editable sample data
    day1: {
      dayNumber: 1,
      dayTitle: 'Day 01 — Ignition, Problem Framing & Mentorship',
      dateLabel: 'Saturday, Dec 12, 2026 (Sample)',
      theme: 'Ideation, Architectural Review & Rapid Prototyping',
      items: [
        {
          id: 'd1-1',
          time: '09:00 AM',
          title: 'Team Reporting & Badge Issuance',
          description:
            'Registration verification, sprint kit collection, and team workstation allocation.',
          category: 'Check-in',
          venue: 'Registration Desk & Foyer',
        },
        {
          id: 'd1-2',
          time: '10:00 AM',
          title: 'Opening Keynote & Problem Statements Briefing',
          description:
            'Welcome address by IEDC BOOTCAMP CEC leads, track overview, and disclosure of challenge problem domains.',
          category: 'Keynote',
          speakerOrMentor: 'IEDC Faculty & Industry Mentors',
          venue: 'Main Auditorium',
        },
        {
          id: 'd1-3',
          time: '11:00 AM',
          title: 'Sprint Clock Starts: Problem Deconstruction',
          description:
            'Official kickoff of the 24-hour sprint. Teams break into workstations to conduct user journey mapping and problem analysis.',
          category: 'Sprint',
          venue: 'Innovation Studio',
        },
        {
          id: 'd1-4',
          time: '01:30 PM',
          title: 'Networking Lunch & Energy Recharge',
          description:
            'Lunch break accompanied by informal peer networking across challenge domains.',
          category: 'Break',
          venue: 'Dining Pavilion',
        },
        {
          id: 'd1-5',
          time: '03:30 PM',
          title: 'Mentoring Gate 01: Concept Validation',
          description:
            '1-on-1 critique with startup mentors to evaluate problem-solution fit and business viability.',
          category: 'Mentoring',
          speakerOrMentor: 'Domain Specialist Mentors',
          venue: 'Mentoring Hub',
        },
        {
          id: 'd1-6',
          time: '08:00 PM',
          title: 'Sprint Milestone Checkpoint: Architecture Freeze',
          description:
            'Teams submit preliminary technical wireframes and value propositions for midpoint verification.',
          category: 'Review',
          venue: 'Sprint Portal',
        },
        {
          id: 'd1-7',
          time: '09:30 PM',
          title: 'Dinner & Midnight Sprint Kickoff',
          description:
            'Power meal followed by overnight design and prototyping marathon.',
          category: 'Break',
          venue: 'Dining Pavilion',
        },
      ],
    },
    day2: {
      dayNumber: 2,
      dayTitle: 'Day 02 — Prototyping, Pitching & Grand Finale',
      dateLabel: 'Sunday, Dec 13, 2026 (Sample)',
      theme: 'Venture Pitching, Jury Evaluation & Awards',
      items: [
        {
          id: 'd2-1',
          time: '07:30 AM',
          title: 'Sunrise Breakfast & Code Freeze Warning',
          description:
            'Morning breakfast and 2-hour final sprint countdown for prototype polish.',
          category: 'Break',
          venue: 'Dining Pavilion',
        },
        {
          id: 'd2-2',
          time: '09:00 AM',
          title: 'Mentoring Gate 02: Pitch Deck Rehearsal',
          description:
            'Rapid mock pitches with pitch coaches to refine story flow, metrics, and demo readiness.',
          category: 'Mentoring',
          speakerOrMentor: 'Pitch Coaches & Venture Mentors',
          venue: 'Breakout Rooms',
        },
        {
          id: 'd2-3',
          time: '11:00 AM',
          title: 'Sprint Clock Stops & Submission Lock',
          description:
            'Final commit and pitch presentation upload to the evaluation portal.',
          category: 'Sprint',
          venue: 'Workstations',
        },
        {
          id: 'd2-4',
          time: '11:30 AM',
          title: 'Grand Jury Pitching Sessions',
          description:
            'Finalist teams deliver 5-minute pitches followed by 3-minute technical Q&A before the venture evaluation panel.',
          category: 'Pitch',
          speakerOrMentor: 'Industry Jury Panel',
          venue: 'Main Auditorium',
        },
        {
          id: 'd2-5',
          time: '02:30 PM',
          title: 'Jury Deliberation & Valedictory Ceremony',
          description:
            'Announcement of track champions, incubation grant opportunities, and certificate distribution.',
          category: 'Ceremony',
          speakerOrMentor: 'College Leadership & IEDC Leads',
          venue: 'Main Auditorium',
        },
      ],
    },
  },

  contact: {
    email: 'iedc@ceconline.edu',
    leadContact: 'IEDC Student Lead',
    locationNotice: 'College of Engineering Chengannur, Kerala 689121',
  },

  socials: {
    linkedin: 'https://www.linkedin.com/company/iedc-bootcamp-cec/',
    instagram: 'https://www.instagram.com/iedcbootcampcec/',
    github: 'https://github.com/iedc-ceconline',
    x: 'https://x.com/iedc_cec',
  },
}
