export type { MatchResult } from '../types/matcher'
import type {
  MatcherQuestion,
  TrackDefinition,
  MatchResult,
} from '../types/matcher'

export const TRACK_DEFINITIONS: Record<string, TrackDefinition> = {
  'ai-systems': {
    id: 'ai-systems',
    name: 'AI & Autonomous Systems',
    code: 'TRACK_01 // INTEL',
    tagline: 'Leverage foundation models, vision, and agentic workflows to automate high-friction processes.',
    badgeColor: 'border-accent-violet text-accent-violet bg-accent-violet/10',
    description:
      'Engineered for developers and researchers exploring computer vision, natural language reasoning, and autonomous multi-agent systems to solve complex cognitive bottlenecks.',
    idealFor: ['ML Engineers', 'Fullstack Builders', 'Automation Architects'],
    recommendedTools: ['PyTorch / TensorFlow', 'LangChain / LlamaIndex', 'FastAPI / Python', 'TensorRT / ONNX'],
    sampleChallenges: [
      'Edge-deployed visual inspection for localized manufacturing.',
      'Agentic workflow assisting doctors with medical literature synthesis.',
      'Automated disaster alert synthesis from low-bandwidth satellite feeds.',
    ],
  },
  cleantech: {
    id: 'cleantech',
    name: 'CleanTech & Circular Sustainability',
    code: 'TRACK_02 // TERRA',
    tagline: 'Address climate resilience, renewable micro-grids, and sustainable resource loops.',
    badgeColor: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
    description:
      'Focusing on smart resource management, energy tracking, carbon accounting, and hardware IoT monitoring to build sustainable ecosystems.',
    idealFor: ['Embedded/IoT Engineers', 'Hardware Hackers', 'Environmental Strategists'],
    recommendedTools: ['ESP32 / Arduino', 'MQTT / InfluxDB', 'Grafana / Next.js', 'Low-Power LoRaWAN'],
    sampleChallenges: [
      'Decentralized solar micro-grid peer energy exchange simulator.',
      'Smart agricultural sensor network optimizing water irrigation in real-time.',
      'Automated e-waste collection and lifecycle tracking system.',
    ],
  },
  fintech: {
    id: 'fintech',
    name: 'FinTech & Trust Architectures',
    code: 'TRACK_03 // VALOR',
    tagline: 'Reinvent financial inclusion, fraud detection, and verifiable transaction systems.',
    badgeColor: 'border-amber-500 text-amber-400 bg-amber-500/10',
    description:
      'Bridging unbanked populations, automated auditing, micro-insurance protocols, and programmable digital assets to democratize capital flow.',
    idealFor: ['Backend Developers', 'Smart Contract Engineers', 'Financial Analysts'],
    recommendedTools: ['Go / Node.js', 'PostgreSQL / Timescale', 'Solidity / Viem', 'Zero-Knowledge Proofs'],
    sampleChallenges: [
      'Micro-credit scoring protocol for informal workers using verifiable alternate metrics.',
      'Real-time fraud prevention scanner for digital retail payments.',
      'Transparent community grant allocation system with milestone escrow.',
    ],
  },
  healthtech: {
    id: 'healthtech',
    name: 'HealthTech & Patient Diagnostics',
    code: 'TRACK_04 // VITA',
    tagline: 'Enhance clinical accessibility, assistive robotics, and digital medical diagnostics.',
    badgeColor: 'border-rose-500 text-rose-400 bg-rose-500/10',
    description:
      'Empowering healthcare practitioners and patients with rapid symptom triaging, assistive accessibility hardware, and secure health records.',
    idealFor: ['Bio-Engineers', 'Mobile App Developers', 'UI/UX Accessibility Designers'],
    recommendedTools: ['Flutter / React Native', 'CoreML / TFLite', 'WebRTC Telehealth', 'FHIR / Health Standards'],
    sampleChallenges: [
      'Offline-first mobile screening tool for rural community health workers.',
      'Low-cost assistive tactile interface for visually impaired students.',
      'Secure, patient-owned encrypted health record ledger.',
    ],
  },
  'open-innovation': {
    id: 'open-innovation',
    name: 'Open Innovation & Civic Tech',
    code: 'TRACK_05 // NEXUS',
    tagline: 'Rapid solutions for public infrastructure, student life, and civic collaboration.',
    badgeColor: 'border-cyan-500 text-cyan-400 bg-cyan-500/10',
    description:
      'An open playground for non-traditional ideas: civic transparency platforms, campus community utilities, and creative developer tools.',
    idealFor: ['Product Designers', 'Generalist Builders', 'Community Advocates'],
    recommendedTools: ['Next.js / Tailwind', 'Supabase / Firebase', 'Mapbox / GeoJSON', 'WebSockets'],
    sampleChallenges: [
      'Crowdsourced municipal grievance reporting and verification dashboard.',
      'Student skill-sharing and campus venture co-founder matching network.',
      'Open disaster relief coordination map with live resource tracking.',
    ],
  },
}

export const MATCHER_QUESTIONS: MatcherQuestion[] = [
  {
    id: 'interests',
    stepNumber: 1,
    title: 'What core technological frontier excites you most?',
    subtitle: 'Select the primary technological domain where you want to focus your 24 hours.',
    options: [
      {
        id: 'opt-ai',
        label: 'Artificial Intelligence & Neural Models',
        description: 'Foundation models, computer vision, automated decision engines.',
        trackWeights: { 'ai-systems': 4, 'open-innovation': 1 },
      },
      {
        id: 'opt-sustain',
        label: 'Climate, Energy & Ecological Balance',
        description: 'Renewable energy, waste reduction, environmental monitoring.',
        trackWeights: { cleantech: 4, 'open-innovation': 1 },
      },
      {
        id: 'opt-finance',
        label: 'Financial Systems & Trust Verification',
        description: 'Micro-payments, fraud detection, decentralized ledger protocols.',
        trackWeights: { fintech: 4, 'ai-systems': 1 },
      },
      {
        id: 'opt-health',
        label: 'Healthcare, Well-being & Assistive Tools',
        description: 'Medical diagnostics, accessibility hardware, patient care.',
        trackWeights: { healthtech: 4, 'ai-systems': 1 },
      },
      {
        id: 'opt-civic',
        label: 'Civic Systems, Education & Public Tools',
        description: 'Open public infrastructure, governance, campus innovation.',
        trackWeights: { 'open-innovation': 4, cleantech: 1 },
      },
    ],
  },
  {
    id: 'skills',
    stepNumber: 2,
    title: 'What is your team’s dominant superpower skill?',
    subtitle: 'Identify the strength you will rely upon to build your working prototype.',
    options: [
      {
        id: 'opt-ml-data',
        label: 'Data Science & Algorithm Engineering',
        description: 'Training models, structuring datasets, statistical pipelines.',
        trackWeights: { 'ai-systems': 3, fintech: 2 },
      },
      {
        id: 'opt-iot-hard',
        label: 'Hardware, Embedded Circuits & IoT',
        description: 'Microcontrollers, sensor fusion, robotics, edge computing.',
        trackWeights: { cleantech: 3, healthtech: 2 },
      },
      {
        id: 'opt-fullstack',
        label: 'Fullstack Web & Cloud Engineering',
        description: 'High-throughput APIs, reactive interfaces, distributed backends.',
        trackWeights: { fintech: 2, 'open-innovation': 3, 'ai-systems': 1 },
      },
      {
        id: 'opt-design-ux',
        label: 'User Experience & Human-Centered Design',
        description: 'Interface friction reduction, intuitive workflows, visual design.',
        trackWeights: { healthtech: 3, 'open-innovation': 2 },
      },
      {
        id: 'opt-product-strat',
        label: 'Product Strategy & Venture Validation',
        description: 'Market problem framing, pitch storytelling, unit economics.',
        trackWeights: { 'open-innovation': 2, fintech: 2, cleantech: 1 },
      },
    ],
  },
  {
    id: 'impact',
    stepNumber: 3,
    title: 'What kind of real-world impact matters most to you?',
    subtitle: 'Choose the destination where you want your prototype to create a ripple effect.',
    options: [
      {
        id: 'opt-impact-automate',
        label: 'Autonomous Efficiency',
        description: 'Eliminating repetitive manual labor and augmenting human decisions.',
        trackWeights: { 'ai-systems': 3, 'open-innovation': 1 },
      },
      {
        id: 'opt-impact-planet',
        label: 'Planetary & Resource Preservation',
        description: 'Measurable reductions in carbon emissions, water loss, and energy waste.',
        trackWeights: { cleantech: 3 },
      },
      {
        id: 'opt-impact-capital',
        label: 'Economic Empowerment & Transparency',
        description: 'Providing fair access to financial capital and unforgeable audits.',
        trackWeights: { fintech: 3 },
      },
      {
        id: 'opt-impact-lives',
        label: 'Saving Lives & Universal Accessibility',
        description: 'Making physical and medical well-being accessible to every human.',
        trackWeights: { healthtech: 3 },
      },
      {
        id: 'opt-impact-community',
        label: 'Public Empowerment & Community Action',
        description: 'Strengthening local communities and student collaborative potential.',
        trackWeights: { 'open-innovation': 3, cleantech: 1 },
      },
    ],
  },
]

/**
 * Deterministic calculation of the best matching track based on selected option IDs.
 */
export function calculateTrackMatch(selectedOptionIds: string[]): MatchResult {
  const scores: Record<string, number> = {
    'ai-systems': 0,
    cleantech: 0,
    fintech: 0,
    healthtech: 0,
    'open-innovation': 0,
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
  let bestTrackId = 'ai-systems'
  let maxScore = -1

  Object.entries(scores).forEach(([trackId, score]) => {
    if (score > maxScore) {
      maxScore = score
      bestTrackId = trackId
    }
  })

  const track = TRACK_DEFINITIONS[bestTrackId] || TRACK_DEFINITIONS['ai-systems']

  // Normalize match percentage (max realistic points is ~10)
  const matchPercentage = Math.min(98, Math.max(76, Math.round((maxScore / 10) * 100)))

  const reasonSummaries: Record<string, string> = {
    'ai-systems':
      'Your strong preference for algorithmic thinking and automated workflows aligns directly with Track 01, where teams will deploy intelligent models to eliminate cognitive bottlenecks.',
    cleantech:
      'Your affinity for planetary impact and hardware/sensor systems makes Track 02 your ideal arena to prototype sustainable resource monitoring and climate resilience systems.',
    fintech:
      'Your focus on economic empowerment, robust backend engineering, and verification rules points to Track 03, challenging you to design fair and transparent financial protocols.',
    healthtech:
      'Your commitment to human well-being and intuitive accessible interfaces fits Track 04, where your team can bridge diagnostic gaps for patients and medical staff.',
    'open-innovation':
      'Your multidisciplinary generalist skill set and passion for public empowerment make Track 05 the perfect launchpad to tackle civic and campus bottlenecks.',
  }

  return {
    track,
    matchScore: matchPercentage,
    reasonSummary: reasonSummaries[bestTrackId] || 'Your answers highlight a high synergy with this innovation track.',
    matchedPillars: track.idealFor,
  }
}
