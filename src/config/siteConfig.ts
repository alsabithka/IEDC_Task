/**
 * ============================================================================
 * CENTRALIZED WEBSITE CONFIGURATION — IEDC IDEA SPRINT 2026
 * ============================================================================
 * Single source of truth for the entire IEDC Idea Sprint 2026 web application.
 * Organized by IEDC BOOTCAMP CEC at College of Engineering Chengannur.
 */

export interface NavItem {
  label: string
  href: string
}

export interface ObjectiveItem {
  number: string
  title: string
  description: string
}

export interface ExpectationItem {
  id: string
  title: string
  description: string
  iconName: string
}

export interface JourneyStage {
  stage: string
  title: string
  description: string
  duration?: string
  highlights?: string[]
}

export interface ScheduleItem {
  id: string
  time: string
  startTime: string
  endTime: string
  title: string
  category: 'Check-in' | 'Keynote' | 'Sprint' | 'Mentoring' | 'Review' | 'Presentation' | 'Ceremony' | 'Break'
  description: string
  venue?: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
  statusNotice?: string
}

export interface SiteConfig {
  brand: {
    name: string
    edition: string
    fullName: string
    tagline: string
    institution: string
  }
  organizer: {
    name: string
    cell: string
    institution: string
    campusTag: string
  }
  panelNav: NavItem[]
  hero: {
    eyebrow: string
    mainHeading: string
    eventIdentity: string
    description: string
    eventInfo: {
      type: string
      organizer: string
      year: string
    }
    ctaPrimary: {
      label: string
      href: string
    }
    ctaSecondary: {
      label: string
      href: string
    }
    dateNotice: string
    targetCountdownISO: string
    sculptureImage?: string
  }
  about: {
    badge: string
    heading: string
    whatIsTitle: string
    whatIsDescription: string
    coreConcept: string
    description: string
    expectations: ExpectationItem[]
  }
  objectives: {
    badge: string
    heading: string
    subtitle: string
    disclaimer: string
    items: ObjectiveItem[]
  }
  whyParticipate: {
    badge: string
    heading: string
    subtitle: string
    reasons: string[]
    howItWorks: {
      step: number
      title: string
      description: string
    }[]
  }
  journey: {
    badge: string
    heading: string
    subtitle: string
    disclaimer: string
    stages: JourneyStage[]
  }
  schedule: {
    badge: string
    heading: string
    subtitle: string
    disclaimer: string
    day1: {
      title: string
      dateLabel: string
      items: ScheduleItem[]
    }
    day2: {
      title: string
      dateLabel: string
      items: ScheduleItem[]
    }
  }
  registration: {
    badge: string
    heading: string
    subtitle: string
    disclaimer: string
  }
  faq: {
    badge: string
    heading: string
    subtitle: string
    disclaimer: string
    items: FaqItem[]
  }
  contact: {
    email: string
    leadContact: string
    locationNotice: string
    institution: string
    campus: string
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
    name: 'IEDC BOOTCAMP CEC',
    edition: '2026',
    fullName: 'IEDC IDEA SPRINT 2026',
    tagline: 'INNOVATION & ENTREPRENEURSHIP',
    institution: 'College of Engineering Chengannur',
  },

  organizer: {
    name: 'IEDC BOOTCAMP CEC',
    cell: 'Innovation & Entrepreneurship Development Centre',
    institution: 'College of Engineering Chengannur',
    campusTag: 'CEC Campus, Chengannur, Kerala',
  },

  panelNav: [],

  hero: {
    eyebrow: '24-HOUR STUDENT IDEATHON // IEDC BOOTCAMP CEC',
    mainHeading: 'Every great innovation begins with an idea.',
    eventIdentity: 'IEDC IDEA SPRINT 2026',
    description:
      'A 24-hour student ideathon by IEDC BOOTCAMP CEC. Bring your curiosity, explore real-world challenges and turn your ideas into possibilities.',
    eventInfo: {
      type: '24-Hour Student Ideathon',
      organizer: 'IEDC BOOTCAMP CEC',
      year: '2026',
    },
    ctaPrimary: {
      label: 'Register Now',
      href: '#register',
    },
    ctaSecondary: {
      label: 'Explore the Sprint',
      href: '#about',
    },
    dateNotice: 'Event date and campus venue will be announced upon official confirmation.',
    targetCountdownISO: '2026-12-12T09:00:00+05:30',
    sculptureImage: undefined,
  },

  about: {
    badge: 'ABOUT THE PROGRAM',
    heading: 'Think Beyond the Obvious.',
    whatIsTitle: 'What is IEDC Idea Sprint?',
    whatIsDescription:
      'IEDC Idea Sprint 2026 is a 24-hour student ideathon hosted by IEDC BOOTCAMP CEC. It aims to provide a platform for students to explore ideas, identify real-world problems, collaborate with others and develop potential solutions. The program encourages students to move beyond simply identifying problems and start exploring how meaningful solutions can be created.',
    coreConcept:
      'An environment where curiosity meets creativity, problems become opportunities, and ideas take their first steps towards becoming solutions.',
    description:
      'Idea Sprint is an opportunity for students to come together, discover meaningful problems and explore innovative solutions. Through focused ideation and collaboration, participants are encouraged to transform initial thoughts into structured concepts.',
    expectations: [
      {
        id: 'exp-1',
        title: 'Problem Discovery',
        description: 'Unpack real challenges, explore user pain points, and pinpoint high-value bottlenecks worth solving.',
        iconName: 'Search',
      },
      {
        id: 'exp-2',
        title: 'Creative Brainstorming',
        description: 'Challenge preconceived notions and explore bold, unconventional thinking beyond standard solutions.',
        iconName: 'Sparkles',
      },
      {
        id: 'exp-3',
        title: 'Collaborative Ideation',
        description: 'Bridge engineering craft, human design, and analytical perspectives in interdisciplinary teams.',
        iconName: 'Users',
      },
      {
        id: 'exp-4',
        title: 'Concept Development',
        description: 'Structure raw insights into coherent frameworks with clear user personas and feasibility roadmaps.',
        iconName: 'Layers',
      },
      {
        id: 'exp-5',
        title: 'Solution Exploration',
        description: 'Test hypotheses, iterate rapidly, and examine technical and economic viability under time constraints.',
        iconName: 'Compass',
      },
      {
        id: 'exp-6',
        title: 'Idea Presentation',
        description: 'Communicate the problem, proposed solution, and tangible impact clearly before mentors and peers.',
        iconName: 'Presentation',
      },
    ],
  },

  objectives: {
    badge: 'PROGRAM OBJECTIVES',
    heading: 'Engineered for Impact & Innovation',
    subtitle:
      'The following are proposed objectives based on the ideathon concept and should be confirmed by the organizers.',
    disclaimer: 'Proposed objectives subject to confirmation by IEDC BOOTCAMP CEC organizers.',
    items: [
      {
        number: '01',
        title: 'Problem Identification',
        description:
          'Encourage students to observe real-world challenges and identify meaningful problems worth solving.',
      },
      {
        number: '02',
        title: 'Creative Thinking',
        description:
          'Help participants explore unconventional approaches and think beyond existing solutions.',
      },
      {
        number: '03',
        title: 'Collaboration',
        description:
          'Encourage interdisciplinary teamwork, knowledge sharing and collective problem-solving.',
      },
      {
        number: '04',
        title: 'Idea Development',
        description:
          'Help students transform initial thoughts into structured concepts and explore their feasibility.',
      },
      {
        number: '05',
        title: 'Entrepreneurial Mindset',
        description:
          'Introduce students to opportunity identification, validation and communicating ideas effectively.',
      },
    ],
  },

  whyParticipate: {
    badge: 'WHY PARTICIPATE?',
    heading: 'Ideas Need Action.',
    subtitle:
      'Step into an intense, collaborative crucible designed to elevate how you perceive problems and build solutions.',
    reasons: [
      'Challenge the way you think and expand your problem-solving range.',
      'Explore real-world challenges from fresh, unconventional perspectives.',
      'Collaborate with fellow innovators, designers, and engineering thinkers.',
      'Develop, structure, and articulate your ideas with clarity and confidence.',
      'Experience an immersive, innovation-focused environment at CEC.',
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Register for the Event',
        description: 'Sign up individually or with your team to secure your workstation.',
      },
      {
        step: 2,
        title: 'Understand the Challenge',
        description: 'Attend the opening orientation and unpack key domain challenge areas.',
      },
      {
        step: 3,
        title: 'Identify a Problem',
        description: 'Observe real challenges, empathize with users, and pick a problem worth solving.',
      },
      {
        step: 4,
        title: 'Explore Solutions',
        description: 'Brainstorm multiple angles, test hypotheses, and research existing benchmarks.',
      },
      {
        step: 5,
        title: 'Develop & Refine',
        description: 'Structure your idea, validate feasibility, and integrate mentor feedback.',
      },
      {
        step: 6,
        title: 'Present the Solution',
        description: 'Pitch your concept, architecture, and real-world impact before the evaluation panel.',
      },
    ],
  },

  journey: {
    badge: 'THE 24-HOUR JOURNEY',
    heading: 'From Curiosity to Pitch in 24 Hours',
    subtitle:
      'A structured progression guiding teams from raw curiosity to validated solution concepts.',
    disclaimer:
      'Note: This is a proposed program flow based on the ideathon concept. Replace with official schedule when confirmed by organizers.',
    stages: [
      {
        stage: 'Stage 01',
        title: 'Opening and Orientation',
        description: 'Introduce the program, objectives, rules, challenge themes, and participants.',
        duration: 'Hour 01 – 02',
        highlights: ['Orientation Keynote', 'Challenge Disclosure', 'Workspace Setup'],
      },
      {
        stage: 'Stage 02',
        title: 'Problem Discovery',
        description: 'Identify challenges, analyze root causes, and select a problem to work on.',
        duration: 'Hour 02 – 05',
        highlights: ['Root-Cause Analysis', 'User Persona Mapping', 'Problem Framing'],
      },
      {
        stage: 'Stage 03',
        title: 'Ideation',
        description: 'Brainstorm, research existing approaches, and explore possible solutions.',
        duration: 'Hour 05 – 09',
        highlights: ['Divergent Brainstorming', 'Benchmarking', 'Hypothesis Mapping'],
      },
      {
        stage: 'Stage 04',
        title: 'Concept Development',
        description: 'Structure the idea, define its users, and explore practical feasibility.',
        duration: 'Hour 09 – 14',
        highlights: ['Solution Architecture', 'Feasibility Check', 'Overnight Sprint'],
      },
      {
        stage: 'Stage 05',
        title: 'Mentorship and Refinement',
        description: 'Receive feedback and improve the proposed solution, if mentorship is included.',
        duration: 'Hour 14 – 19',
        highlights: ['1-on-1 Mentor Reviews', 'Critique Integration', 'Pitch Deck Polish'],
      },
      {
        stage: 'Stage 06',
        title: 'Final Presentation',
        description: 'Communicate the problem, proposed solution, and potential impact before the panel.',
        duration: 'Hour 19 – 22',
        highlights: ['Live Concept Pitches', 'Q&A Defense', 'Peer Demonstrations'],
      },
      {
        stage: 'Stage 07',
        title: 'Evaluation and Closing',
        description: 'Complete evaluation, reflect on learnings, and announce outcomes, if applicable.',
        duration: 'Hour 22 – 24',
        highlights: ['Jury Review', 'Certificate Presentation', 'Closing Reflections'],
      },
    ],
  },

  schedule: {
    badge: 'EVENT SCHEDULE',
    heading: 'Day 1 & Day 2 Timeline',
    subtitle:
      'Interactive chronological timeline for the 24-hour ideathon. (Proposed schedule flow — official timings to be confirmed by organizers).',
    disclaimer:
      'Notice: The timings and activities shown below represent a proposed schedule flow. The official schedule will be announced by IEDC BOOTCAMP CEC.',
    day1: {
      title: 'Day 1 — Discovery & Ideation Sprint',
      dateLabel: 'Day 1 (Tentative)',
      items: [
        {
          id: 'd1-1',
          time: '09:00 AM – 10:00 AM',
          startTime: '09:00 AM',
          endTime: '10:00 AM',
          title: 'Participant Check-In & Workstation Allotment',
          category: 'Check-in',
          description: 'Registration verification, badge and sprint kit collection, and team workstation setup.',
          venue: 'Campus Foyer / Registration Desk',
        },
        {
          id: 'd1-2',
          time: '10:00 AM – 11:00 AM',
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          title: 'Stage 01 — Opening & Problem Statements Briefing',
          category: 'Keynote',
          description: 'Official welcome by IEDC BOOTCAMP CEC leads, ideathon ground rules, and domain disclosures.',
          venue: 'Main Auditorium',
        },
        {
          id: 'd1-3',
          time: '11:00 AM – 01:30 PM',
          startTime: '11:00 AM',
          endTime: '01:30 PM',
          title: 'Stage 02 — Problem Discovery & User Mapping',
          category: 'Sprint',
          description: 'Official sprint clock starts. Teams unpack bottlenecks, conduct user empathy mapping, and select their challenge focus.',
          venue: 'Ideation Workstations',
        },
        {
          id: 'd1-4',
          time: '01:30 PM – 02:30 PM',
          startTime: '01:30 PM',
          endTime: '02:30 PM',
          title: 'Lunch Break & Informal Peer Exchange',
          category: 'Break',
          description: 'Nutritional recharge and peer networking across project domains.',
          venue: 'Dining Pavilion',
        },
        {
          id: 'd1-5',
          time: '02:30 PM – 05:30 PM',
          startTime: '02:30 PM',
          endTime: '05:30 PM',
          title: 'Stage 03 — Ideation & Solution Exploration',
          category: 'Sprint',
          description: 'Brainstorming unconventional angles, market benchmarking, and initial concept synthesis.',
          venue: 'Ideation Workstations',
        },
        {
          id: 'd1-6',
          time: '05:30 PM – 08:30 PM',
          startTime: '05:30 PM',
          endTime: '08:30 PM',
          title: 'Stage 04 — Concept Development & Feasibility',
          category: 'Review',
          description: 'Structuring the core value proposition, user journey flows, and preliminary feasibility check.',
          venue: 'Ideation Workstations',
        },
        {
          id: 'd1-7',
          time: '08:30 PM – 09:30 PM',
          startTime: '08:30 PM',
          endTime: '09:30 PM',
          title: 'Dinner & Mid-Sprint Alignment',
          category: 'Break',
          description: 'Dinner break followed by overnight sprint kickoff.',
          venue: 'Dining Pavilion',
        },
        {
          id: 'd1-8',
          time: '09:30 PM – Overnight',
          startTime: '09:30 PM',
          endTime: 'Overnight',
          title: 'Overnight Collaborative Sprint',
          category: 'Sprint',
          description: 'Intensive teamwork, pitch outline drafting, and mock presentation development.',
          venue: 'Innovation Hub',
        },
      ],
    },
    day2: {
      title: 'Day 2 — Mentorship, Pitching & Finale',
      dateLabel: 'Day 2 (Tentative)',
      items: [
        {
          id: 'd2-1',
          time: '07:30 AM – 08:30 AM',
          startTime: '07:30 AM',
          endTime: '08:30 AM',
          title: 'Morning Breakfast & Standup',
          category: 'Break',
          description: 'Breakfast, refreshments, and team alignment before the review rounds.',
          venue: 'Dining Pavilion',
        },
        {
          id: 'd2-2',
          time: '08:30 AM – 11:00 AM',
          startTime: '08:30 AM',
          endTime: '11:00 AM',
          title: 'Stage 05 — Mentorship & Solution Refinement',
          category: 'Mentoring',
          description: 'Dedicated mentorship critique sessions. Receive feedback on problem clarity, feasibility, and presentation pitch.',
          venue: 'Mentoring Hub',
        },
        {
          id: 'd2-3',
          time: '11:00 AM – 11:30 AM',
          startTime: '11:00 AM',
          endTime: '11:30 AM',
          title: 'Presentation Deck Freeze & Submission',
          category: 'Review',
          description: 'Final submission lock. Teams submit presentation decks to the evaluation coordinator.',
          venue: 'Submission Portal',
        },
        {
          id: 'd2-4',
          time: '11:30 AM – 02:00 PM',
          startTime: '11:30 AM',
          endTime: '02:00 PM',
          title: 'Stage 06 — Final Pitch Presentations',
          category: 'Presentation',
          description: 'Teams present their problem, proposed solution, and anticipated impact before the evaluation committee.',
          venue: 'Main Auditorium',
        },
        {
          id: 'd2-5',
          time: '02:00 PM – 03:00 PM',
          startTime: '02:00 PM',
          endTime: '03:00 PM',
          title: 'Lunch & Jury Deliberation',
          category: 'Break',
          description: 'Evaluation committee reviews presentation scores while participants enjoy lunch.',
          venue: 'Dining Pavilion',
        },
        {
          id: 'd2-6',
          time: '03:00 PM – 04:30 PM',
          startTime: '03:00 PM',
          endTime: '04:30 PM',
          title: 'Stage 07 — Evaluation, Feedback & Closing Ceremony',
          category: 'Ceremony',
          description: 'Valedictory address, announcement of ideathon outcomes, mentor reflections, and distribution of certificates.',
          venue: 'Main Auditorium',
        },
      ],
    },
  },

  registration: {
    badge: 'REGISTER FOR THE SPRINT',
    heading: 'Have an Idea Worth Exploring?',
    subtitle:
      'Step up to explore real-world challenges, collaborate with fellow problem-solvers, and shape impactful solutions in 24 intensive hours at College of Engineering Chengannur.',
    disclaimer:
      'Frontend validation demo for assignment requirements. No external database is attached.',
  },

  faq: {
    badge: 'FREQUENTLY ASKED QUESTIONS',
    heading: 'Clear Answers for Innovators',
    subtitle:
      'Essential operational details regarding IEDC Idea Sprint 2026. Official details to be confirmed by organizers.',
    disclaimer:
      'Note: Questions reflecting unconfirmed operational details are marked accordingly.',
    items: [
      {
        id: 'faq-1',
        question: 'What is IEDC Idea Sprint?',
        answer:
          'IEDC Idea Sprint 2026 is a 24-hour student ideathon hosted by IEDC BOOTCAMP CEC at College of Engineering Chengannur. It provides a platform for students to explore ideas, identify real-world problems, collaborate with others, and develop potential solutions. The program encourages students to move beyond simply identifying problems and start exploring how meaningful solutions can be created.',
      },
      {
        id: 'faq-2',
        question: 'Who can participate?',
        answer:
          'The ideathon is designed for curious, motivated college students across all disciplines who are passionate about problem-solving, technology, design, and innovation. Specific eligibility guidelines and batch rules will be announced by the organizers.',
        statusNotice: 'Official eligibility criteria to be confirmed by organizers.',
      },
      {
        id: 'faq-3',
        question: 'Is individual registration allowed?',
        answer:
          'Both individual students and pre-formed teams can express interest. Individual participants may have the opportunity to connect with peers during initial team formation phases or work independently based on confirmed rules.',
        statusNotice: 'Final team formation format to be confirmed by organizers.',
      },
      {
        id: 'faq-4',
        question: 'What is the maximum team size?',
        answer:
          'The proposed team structure accommodates between 1 to 4 members per team. This allows for balanced multidisciplinary teams combining technical, design, and strategy skills.',
        statusNotice: 'Maximum team size to be confirmed by organizers.',
      },
      {
        id: 'faq-5',
        question: 'Where will the event take place?',
        answer:
          'The event is planned to take place at the College of Engineering Chengannur (CEC) campus in Chengannur, Alappuzha, Kerala. Specific auditorium and lab spaces will be disclosed prior to the sprint.',
        statusNotice: 'Specific venue hall to be confirmed by organizers.',
      },
      {
        id: 'faq-6',
        question: 'What should participants bring?',
        answer:
          'Participants should bring their laptops, chargers, student identification cards, notebooks, and any necessary personal essentials for the 24-hour marathon. High-speed campus Wi-Fi and workstation power will be provided.',
      },
      {
        id: 'faq-7',
        question: 'Is there a registration fee?',
        answer:
          'Registration fee details, if applicable, will be communicated by IEDC BOOTCAMP CEC upon release of the official event brochure and registration gateway.',
        statusNotice: 'Fee structure to be confirmed by organizers.',
      },
      {
        id: 'faq-8',
        question: 'What is the registration deadline?',
        answer:
          'The official registration deadline will be published alongside confirmed event dates. We encourage interested students to submit their registration early as workstation capacity may be limited.',
        statusNotice: 'Registration closing date to be confirmed by organizers.',
      },
      {
        id: 'faq-9',
        question: 'Will mentorship be provided?',
        answer:
          'Yes, proposed stages include a dedicated Mentorship and Refinement round where teams can consult experienced mentors to sharpen problem definitions, validate feasibility, and refine presentation decks.',
        statusNotice: 'Mentor panel details to be confirmed by organizers.',
      },
      {
        id: 'faq-10',
        question: 'How will ideas be evaluated?',
        answer:
          'Evaluation will focus on problem identification clarity, creativity and originality of the solution, feasibility and structural development, collaborative teamwork, and effective communication during the final pitch.',
        statusNotice: 'Detailed rubric to be published by organizers.',
      },
    ],
  },

  contact: {
    email: 'iedc@ceconline.edu',
    leadContact: 'IEDC Student Lead',
    locationNotice: 'College of Engineering Chengannur, Kerala 689121',
    institution: 'College of Engineering Chengannur',
    campus: 'CEC Campus, Chengannur',
  },

  socials: {
    linkedin: 'https://www.linkedin.com/company/iedc-bootcamp-cec/',
    instagram: 'https://www.instagram.com/iedcbootcampcec/',
    github: 'https://github.com/iedc-ceconline',
    x: 'https://x.com/iedc_cec',
  },
}
