export type { MatchResult } from '../types/matcher'
import type {
  MatcherQuestion,
  TrackDefinition,
  MatchResult,
} from '../types/matcher'

export const DOMAIN_TRACKS: Record<string, TrackDefinition> = {
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare & Well-being',
    code: 'TRACK_01 // HEALTH',
    tagline: 'Enhance clinical accessibility, assistive devices, and patient care diagnostics.',
    badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
    description:
      'Empower health workers and patients by bridging diagnostic gaps, creating assistive tactile technologies, and streamlining emergency care response in underserved communities.',
    idealFor: ['Bio-Engineers', 'Mobile App Builders', 'Accessibility Designers'],
    recommendedTools: ['Flutter / React Native', 'CoreML / TFLite', 'FHIR Health Protocols', 'WebRTC Telehealth'],
    sampleChallenges: [
      'Low-bandwidth mobile screening tool for rural community health workers.',
      'Low-cost assistive tactile navigation interface for visually impaired students.',
      'Emergency response triage and volunteer medic coordination portal.',
    ],
  },
  education: {
    id: 'education',
    name: 'Education & Learning Access',
    code: 'TRACK_02 // EDU',
    tagline: 'Democratize quality learning tools, interactive labs, and regional literacy.',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    description:
      'Create adaptive learning companions, hands-on virtual lab environments, and accessible multilingual educational resources to bridge regional learning divides.',
    idealFor: ['UI/UX Designers', 'Fullstack Developers', 'Pedagogy Enthusiasts'],
    recommendedTools: ['Next.js / React', 'Web Speech API', 'Interactive Canvas / Three.js', 'IndexedDB Offline Cache'],
    sampleChallenges: [
      'Interactive low-data virtual physics and chemistry experiment simulator.',
      'Vernacular speech-driven reading assistant for primary school learners.',
      'Peer-to-peer textbook and study resource exchange ecosystem for colleges.',
    ],
  },
  agriculture: {
    id: 'agriculture',
    name: 'Agriculture & Rural Tech',
    code: 'TRACK_03 // AGRI',
    tagline: 'Optimize precision farming, soil intelligence, and fair farmer market linkages.',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    description:
      'Deploy smart sensors, weather predictive insights, and direct-to-consumer farm produce exchanges that protect smallholder farmers against market volatility and crop diseases.',
    idealFor: ['IoT & Embedded Hackers', 'Data Analysts', 'Agri-Tech Explorers'],
    recommendedTools: ['ESP32 / Arduino', 'MQTT / InfluxDB', 'OpenWeather APIs', 'Computer Vision (YOLO)'],
    sampleChallenges: [
      'Real-time leaf disease identification app operating completely offline on low-end phones.',
      'Smart micro-irrigation controller balancing soil moisture and electricity tariffs.',
      'Fair pricing transparency and localized produce auction platform for rural cooperatives.',
    ],
  },
  environment: {
    id: 'environment',
    name: 'Environment & Sustainability',
    code: 'TRACK_04 // ECO',
    tagline: 'Accelerate waste recycling loops, carbon tracking, and clean water preservation.',
    badgeColor: 'border-teal-500/40 text-teal-400 bg-teal-500/10',
    description:
      'Tackle climate resilience, decentralized solar monitoring, community waste audit networks, and aquatic ecosystem cleanup through measurable technological interventions.',
    idealFor: ['Environmental Strategists', 'Hardware Engineers', 'Civic Tech Builders'],
    recommendedTools: ['Sensor Fusion (LoRaWAN)', 'Grafana / Supabase', 'Mapbox GeoJSON', 'Microcontroller Telemetry'],
    sampleChallenges: [
      'Decentralized solar micro-grid peer energy exchange and monitoring dashboard.',
      'Automated campus e-waste and plastic recovery reward tracking system.',
      'Localized water quality sensor probe alerting communities of contamination risks.',
    ],
  },
  transportation: {
    id: 'transportation',
    name: 'Transportation & Smart Mobility',
    code: 'TRACK_05 // TRANS',
    tagline: 'Improve urban transit safety, route optimization, and clean electric commuting.',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    description:
      'Eliminate transit bottlenecks, enhance last-mile pedestrian safety, optimize multi-modal public bus routing, and build charging station sharing for electric vehicles.',
    idealFor: ['Spatial Data Analysts', 'System Architects', 'Mobile Developers'],
    recommendedTools: ['OpenStreetMap / GeoPandas', 'WebSockets / Socket.io', 'Google Transit GTFS', 'Routing Algorithms'],
    sampleChallenges: [
      'Real-time crowdsourced rural bus arrival tracking system for student commuters.',
      'Campus micro-mobility and bicycle sharing network with anti-theft geofencing.',
      'Accident hotspot mapping and emergency auto-dispatch beacon system.',
    ],
  },
  technology: {
    id: 'technology',
    name: 'Deep Technology & Intelligent Systems',
    code: 'TRACK_06 // TECH',
    tagline: 'Pioneer foundation models, automated workflows, and cybersecurity infrastructure.',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
    description:
      'Harness modern artificial intelligence, agentic workflows, embedded hardware, and cryptography to solve complex engineering and operational bottlenecks.',
    idealFor: ['Algorithm Developers', 'ML Engineers', 'Security Researchers'],
    recommendedTools: ['PyTorch / ONNX', 'FastAPI / Python', 'Zero-Knowledge Proofs', 'WebAssembly / Rust'],
    sampleChallenges: [
      'Autonomous edge-deployed visual inspection for small-scale local manufacturers.',
      'Agentic workflow assisting engineering students with literature synthesis and patent search.',
      'Phishing detection browser engine tailored for regional language banking portals.',
    ],
  },
  community: {
    id: 'community',
    name: 'Community Development & Civic Impact',
    code: 'TRACK_07 // CIVIC',
    tagline: 'Empower public transparency, citizen grievances, and local social safety nets.',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
    description:
      'Harness citizen participation, disaster relief coordination, localized volunteer matching, and transparent public utility reporting to build stronger grassroots resilience.',
    idealFor: ['Product Strategists', 'Community Leaders', 'Frontend Craftsmen'],
    recommendedTools: ['Next.js / Tailwind', 'Supabase / PostgreSQL', 'OpenStreetMap', 'Progressive Web Apps'],
    sampleChallenges: [
      'Crowdsourced municipal pothole and streetlight grievance tracker with photographic verification.',
      'Rapid disaster relief resource allocation and rescue coordination hub for Kerala monsoons.',
      'Local senior citizen assistance and volunteer grocery/medicine delivery registry.',
    ],
  },
}

export const TRACK_DEFINITIONS = DOMAIN_TRACKS

export const MATCHER_QUESTIONS: MatcherQuestion[] = [
  {
    id: 'interests',
    stepNumber: 1,
    title: 'Which real-world problem domain sparks your curiosity?',
    subtitle: 'Select the problem domain where you want to focus your 24 hours of ideation and exploration.',
    options: [
      {
        id: 'opt-health',
        label: 'Healthcare & Assistive Technology',
        description: 'Patient diagnostics, accessible medical tools, hospital and clinic workflows.',
        trackWeights: { healthcare: 4, technology: 1 },
      },
      {
        id: 'opt-edu',
        label: 'Education & Knowledge Access',
        description: 'Interactive learning tools, vernacular literacy, virtual laboratories.',
        trackWeights: { education: 4, community: 1 },
      },
      {
        id: 'opt-agri',
        label: 'Agriculture & Rural Innovation',
        description: 'Soil health, crop disease detection, farmer market price transparency.',
        trackWeights: { agriculture: 4, environment: 1 },
      },
      {
        id: 'opt-env',
        label: 'Environment & Climate Sustainability',
        description: 'Clean energy, water conservation, circular waste management.',
        trackWeights: { environment: 4, agriculture: 1 },
      },
      {
        id: 'opt-trans',
        label: 'Transportation & Smart Mobility',
        description: 'Commuter transit, road safety, pedestrian accessibility, electric mobility.',
        trackWeights: { transportation: 4, technology: 1 },
      },
      {
        id: 'opt-tech',
        label: 'Deep Technology & Intelligent Software',
        description: 'AI algorithms, autonomous agents, automation, security frameworks.',
        trackWeights: { technology: 4, community: 1 },
      },
      {
        id: 'opt-civic',
        label: 'Community Development & Civic Impact',
        description: 'Grassroots democracy, public grievance tracking, disaster resilience.',
        trackWeights: { community: 4, education: 1 },
      },
    ],
  },
  {
    id: 'skills',
    stepNumber: 2,
    title: 'What is your core problem-solving capability?',
    subtitle: 'Identify the primary capability your team brings to dissecting and structuring ideas.',
    options: [
      {
        id: 'opt-ai-data',
        label: 'Data Science & Machine Learning',
        description: 'Predictive analytics, computer vision, natural language understanding.',
        trackWeights: { technology: 3, healthcare: 2, agriculture: 1 },
      },
      {
        id: 'opt-iot-hard',
        label: 'Hardware, Sensors & Embedded IoT',
        description: 'Microcontrollers, sensor telemetry, automation, edge computing.',
        trackWeights: { agriculture: 3, environment: 3, transportation: 2 },
      },
      {
        id: 'opt-fullstack',
        label: 'Web & Mobile Application Craft',
        description: 'Interactive user interfaces, APIs, cloud backends, offline-first PWA.',
        trackWeights: { education: 3, community: 3, transportation: 2 },
      },
      {
        id: 'opt-ux-research',
        label: 'User Research & Human-Centered Design',
        description: 'Empathy interviews, friction removal, accessible typography, visual design.',
        trackWeights: { healthcare: 3, education: 3, community: 2 },
      },
      {
        id: 'opt-systems-strat',
        label: 'Systems Thinking & Practical Feasibility',
        description: 'Operational economics, user journey modeling, resource planning.',
        trackWeights: { transportation: 2, environment: 2, community: 2 },
      },
    ],
  },
  {
    id: 'impact',
    stepNumber: 3,
    title: 'What tangible outcome do you want to create?',
    subtitle: 'Choose the real-world difference you aim to validate during this ideathon.',
    options: [
      {
        id: 'opt-impact-health',
        label: 'Saving Lives & Clinical Inclusivity',
        description: 'Make critical diagnostics and assistive accessibility available to all.',
        trackWeights: { healthcare: 4 },
      },
      {
        id: 'opt-impact-learn',
        label: 'Unlocking Knowledge & Equal Opportunity',
        description: 'Ensure every student has equal access to quality tools and mentorship.',
        trackWeights: { education: 4 },
      },
      {
        id: 'opt-impact-farm',
        label: 'Strengthening Rural & Farmer Livelihoods',
        description: 'Empower farmers with technological insights to boost yields and incomes.',
        trackWeights: { agriculture: 4 },
      },
      {
        id: 'opt-impact-planet',
        label: 'Protecting Natural Ecosystems & Clean Air',
        description: 'Drive tangible metrics in emission reductions and zero-waste loops.',
        trackWeights: { environment: 4 },
      },
      {
        id: 'opt-impact-move',
        label: 'Safer, Smoother Daily Commuting',
        description: 'Make everyday transit seamless, accident-free, and accessible for everyone.',
        trackWeights: { transportation: 4 },
      },
      {
        id: 'opt-impact-auto',
        label: 'Advancing Scalable Digital Technology',
        description: 'Automate high-friction cognitive work using intelligent engineering.',
        trackWeights: { technology: 4 },
      },
      {
        id: 'opt-impact-comm',
        label: 'Empowering Local Communities & Civic Action',
        description: 'Give citizens effective tools to solve neighborhood bottlenecks together.',
        trackWeights: { community: 4 },
      },
    ],
  },
]

/**
 * Deterministic calculation of the best matching track based on selected option IDs.
 */
export function calculateTrackMatch(selectedOptionIds: string[]): MatchResult {
  const scores: Record<string, number> = {
    healthcare: 0,
    education: 0,
    agriculture: 0,
    environment: 0,
    transportation: 0,
    technology: 0,
    community: 0,
  }

  const allOptions = MATCHER_QUESTIONS.flatMap((q) => q.options)

  selectedOptionIds.forEach((selectedId) => {
    const option = allOptions.find((opt) => opt.id === selectedId)
    if (option) {
      Object.entries(option.trackWeights).forEach(([trackId, weight]) => {
        if (scores[trackId] !== undefined) {
          scores[trackId] += weight
        }
      })
    }
  })

  // Find track with highest score
  let bestTrackId = 'technology'
  let maxScore = -1

  Object.entries(scores).forEach(([trackId, score]) => {
    if (score > maxScore) {
      maxScore = score
      bestTrackId = trackId
    }
  })

  const track = DOMAIN_TRACKS[bestTrackId] || DOMAIN_TRACKS['technology']

  // Normalize match percentage (max realistic points is ~11)
  const matchPercentage = Math.min(99, Math.max(82, Math.round((maxScore / 11) * 100)))

  const reasonSummaries: Record<string, string> = {
    healthcare:
      'Your strong drive to address clinical bottlenecks and user accessibility directly aligns with the Healthcare & Well-being domain.',
    education:
      'Your passion for unlocking learning opportunities and human-centered design makes Education & Learning Access your natural problem arena.',
    agriculture:
      'Your interest in rural impact, sensor systems, and fair economic loops pairs perfectly with the Agriculture & Rural Tech domain.',
    environment:
      'Your focus on climate resilience, conservation, and sustainable resource loops matches the Environment & Sustainability domain.',
    transportation:
      'Your ambition to eliminate transit delays, improve safety, and optimize spatial systems points to Transportation & Smart Mobility.',
    technology:
      'Your affinity for algorithmic problem solving, automation, and intelligent systems aligns directly with Deep Technology & Intelligent Systems.',
    community:
      'Your commitment to civic empowerment, citizen action, and local community resilience makes Community Development your ideal challenge track.',
  }

  return {
    track,
    matchScore: matchPercentage,
    reasonSummary: reasonSummaries[bestTrackId] || 'Your answers highlight a high synergy with this innovation domain.',
    matchedPillars: track.idealFor,
  }
}
