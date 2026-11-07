export interface GameStationConfig {
  id: string
  number: number
  code: string
  name: string
  sessionTitle: string
  day: 'Day 1' | 'Day 2'
  time: string
  category: string
  description: string
  venue: string
  duration: string
  // Normalized position along the 3D track curve (t in [0, 1])
  trackProgress: number
  landmark: 'welcome_arch' | 'workshop_gear' | 'dining_depot' | 'synergy_hub' | 'morning_beacon' | 'code_lab' | 'refuel_pavilion' | 'grand_podium'
  accentColor: string
  roofColor: string
  bannerColor: string
}

export const GAME_STATIONS: GameStationConfig[] = [
  {
    id: 'stn-1',
    number: 1,
    code: 'DEP-01',
    name: 'Departure Station',
    sessionTitle: 'Registration & Inauguration',
    day: 'Day 1',
    time: '09:00 AM',
    category: 'Check-In & Kickoff',
    description:
      'Participant check-in, identity verification, workstation allotment, and the official opening ceremony hosted by IEDC BOOTCAMP CEC.',
    venue: 'Main Auditorium Foyer',
    duration: '60 Mins',
    trackProgress: 0.035,
    landmark: 'welcome_arch',
    accentColor: '#FF4757', // Cherry Red
    roofColor: '#E63946',
    bannerColor: '#FFEAA7',
  },
  {
    id: 'stn-2',
    number: 2,
    code: 'WRK-02',
    name: 'Ideation Junction',
    sessionTitle: 'Main Session / Workshop',
    day: 'Day 1',
    time: '10:00 AM',
    category: 'Core Keynote & Frameworks',
    description:
      'Keynote workshop, problem statement breakdown, design thinking frameworks, and solution framing methodologies.',
    venue: 'Seminar Hall 1',
    duration: '180 Mins',
    trackProgress: 0.160,
    landmark: 'workshop_gear',
    accentColor: '#3A86FF', // Azure Blue
    roofColor: '#1D3557',
    bannerColor: '#FFBE0B',
  },
  {
    id: 'stn-3',
    number: 3,
    code: 'DIN-03',
    name: 'Dining Depot',
    sessionTitle: 'Lunch Break',
    day: 'Day 1',
    time: '01:00 PM',
    category: 'Recharge & Rest',
    description:
      'Nutritional recharge, informal interactions, and cross-team networking across diverse engineering disciplines.',
    venue: 'Dining Pavilion',
    duration: '60 Mins',
    trackProgress: 0.285,
    landmark: 'dining_depot',
    accentColor: '#2EC4B6', // Fresh Teal / Mint
    roofColor: '#0081A7',
    bannerColor: '#FFD166',
  },
  {
    id: 'stn-4',
    number: 4,
    code: 'SYN-04',
    name: 'Synergy Hub',
    sessionTitle: 'Team Activities & Networking',
    day: 'Day 1',
    time: '02:00 PM',
    category: 'Team Collaboration & Build',
    description:
      'Interactive team sprint activities, inter-team networking, mentor consultations, and commencement of prototype building.',
    venue: 'Innovation Workspace Arena',
    duration: 'Overnight Sprint',
    trackProgress: 0.410,
    landmark: 'synergy_hub',
    accentColor: '#8338EC', // Purple Violet
    roofColor: '#560BAD',
    bannerColor: '#CCFF33',
  },
  {
    id: 'stn-5',
    number: 5,
    code: 'BCN-05',
    name: 'Morning Terminal',
    sessionTitle: 'Welcome & Recap',
    day: 'Day 2',
    time: '09:00 AM',
    category: 'Day 2 Assembly',
    description:
      'Day 2 morning sync, progress recap, evaluation criteria review, and sprint timeline checkpoint before final submission sprints.',
    venue: 'Main Auditorium',
    duration: '60 Mins',
    trackProgress: 0.535,
    landmark: 'morning_beacon',
    accentColor: '#FF7B00', // Sunrise Amber
    roofColor: '#E85D04',
    bannerColor: '#48CAE4',
  },
  {
    id: 'stn-6',
    number: 6,
    code: 'LAB-06',
    name: 'Deep Code Labs',
    sessionTitle: 'Challenges & Project Work',
    day: 'Day 2',
    time: '10:00 AM',
    category: 'Sprint Execution',
    description:
      'High-intensity building session, mentor critique integration, solution polishing, and pitch rehearsals.',
    venue: 'Project Labs & Workstations',
    duration: '180 Mins',
    trackProgress: 0.660,
    landmark: 'code_lab',
    accentColor: '#00B4D8', // Electric Cyan
    roofColor: '#03045E',
    bannerColor: '#90E0EF',
  },
  {
    id: 'stn-7',
    number: 7,
    code: 'PAV-07',
    name: 'Refuel Stop',
    sessionTitle: 'Lunch Break',
    day: 'Day 2',
    time: '01:00 PM',
    category: 'Recharge & Review',
    description:
      'Midday meal, final pitch deck checks, audiovisual equipment calibration, and pre-presentation setup.',
    venue: 'Dining Pavilion',
    duration: '60 Mins',
    trackProgress: 0.785,
    landmark: 'refuel_pavilion',
    accentColor: '#E76F51', // Terracotta Coral
    roofColor: '#F4A261',
    bannerColor: '#2A9D8F',
  },
  {
    id: 'stn-8',
    number: 8,
    code: 'TRM-08',
    name: 'Grand Terminus',
    sessionTitle: 'Presentations & Closing Ceremony',
    day: 'Day 2',
    time: '02:00 PM',
    category: 'Pitches & Valedictory',
    description:
      'Team pitch presentations before the evaluation jury, announcement of winners, awards, and valedictory address.',
    venue: 'Main Auditorium Stage',
    duration: 'Final Ceremony',
    trackProgress: 0.910,
    landmark: 'grand_podium',
    accentColor: '#FFB703', // Imperial Gold
    roofColor: '#800020', // Burgundy
    bannerColor: '#FFE066',
  },
]

// Train physics configuration constants
export const TRAIN_PHYSICS_CONFIG = {
  maxSpeedKmh: 65, // km/h
  maxReverseSpeedKmh: 18, // km/h reverse speed
  accelerationRate: 15, // km/h per second at 100% throttle
  brakeDecelerationRate: 24, // km/h per second at 100% brake
  naturalFrictionRate: 3.5, // km/h per second coasting decay
  trackLengthMeters: 451.1, // simulated total track circuit length
  stoppingZoneToleranceMeters: 8.5, // distance (meters) tolerance where train is in designated stop zone
  stoppingZoneTolerance: 0.0188, // normalized track distance where train is considered at the platform
}
