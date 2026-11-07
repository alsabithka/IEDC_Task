export type GraphicsQuality = 'low' | 'medium' | 'high'

export interface GraphicsProfileConfig {
  quality: GraphicsQuality
  label: string
  description: string
  dpr: number
  shadows: boolean
  shadowMapSize: number
  vegetationDensity: number // 0.35 to 1.0
  stationLodDistance: number // in meters
  enableCloudsDrift: boolean
  fogFar: number
  maxDrawDistance: number
}

export interface DeviceCapabilities {
  isMobile: boolean
  isTouch: boolean
  hardwareConcurrency: number
  deviceMemory: number // in GB, fallback 4
  devicePixelRatio: number
  gpuRenderer: string
  recommendedQuality: GraphicsQuality
}

const STORAGE_KEY = 'iedc_train_game_graphics_quality'

/**
 * Detect hardware capabilities and WebGL specifications
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
  const isTouch =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua)
  const isMobile = isMobileUA || (isTouch && typeof window !== 'undefined' && window.innerWidth < 1024)

  const hardwareConcurrency =
    typeof navigator !== 'undefined' && navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency
      : 4

  const navAny = typeof navigator !== 'undefined' ? (navigator as unknown as { deviceMemory?: number }) : {}
  const deviceMemory = navAny.deviceMemory || (isMobile ? 4 : 8)

  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

  // Extract WebGL Renderer Information
  let gpuRenderer = 'Unknown'
  try {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl) {
        const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          gpuRenderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown'
        }
      }
    }
  } catch {
    // Canvas context not supported or restricted
  }

  // Determine initial recommended profile
  let recommendedQuality: GraphicsQuality = 'high'

  if (isMobile) {
    // Check if budget/entry-level mobile
    const isBudgetMobile =
      deviceMemory <= 3 ||
      hardwareConcurrency <= 4 ||
      /Mali-4|Mali-T|Mali-G5[0-2]|Adreno (3|4|50[0-6]|61[0-2])|PowerVR/i.test(gpuRenderer)

    if (isBudgetMobile) {
      recommendedQuality = 'low'
    } else {
      // Mid-range or high-end mobile: start at medium for smooth battery & thermal efficiency
      recommendedQuality = 'medium'
    }
  } else {
    // Desktop: default to high unless very low core count
    if (hardwareConcurrency <= 2 || deviceMemory <= 2) {
      recommendedQuality = 'medium'
    } else {
      recommendedQuality = 'high'
    }
  }

  return {
    isMobile,
    isTouch,
    hardwareConcurrency,
    deviceMemory,
    devicePixelRatio,
    gpuRenderer,
    recommendedQuality,
  }
}

/**
 * Retrieve active profile settings based on quality level
 */
export function getProfileConfig(
  quality: GraphicsQuality,
  caps: DeviceCapabilities
): GraphicsProfileConfig {
  const dprRaw = caps.devicePixelRatio

  switch (quality) {
    case 'low':
      return {
        quality: 'low',
        label: 'Low',
        description: 'Maximum battery life & fluid 30-60 FPS for entry phones',
        dpr: 1.0,
        shadows: false,
        shadowMapSize: 512,
        vegetationDensity: 0.38,
        stationLodDistance: 85,
        enableCloudsDrift: false,
        fogFar: 165,
        maxDrawDistance: 170,
      }

    case 'medium':
      return {
        quality: 'medium',
        label: 'Medium',
        description: 'Optimised lighting & balance for mid-range phones',
        dpr: Math.min(1.35, dprRaw),
        shadows: true,
        shadowMapSize: 1024,
        vegetationDensity: 0.70,
        stationLodDistance: 135,
        enableCloudsDrift: true,
        fogFar: 200,
        maxDrawDistance: 215,
      }

    case 'high':
    default:
      return {
        quality: 'high',
        label: 'High',
        description: 'Full shadows, lush scenery & maximum fidelity',
        dpr: Math.min(caps.isMobile ? 1.5 : 2.0, dprRaw),
        shadows: true,
        shadowMapSize: 2048,
        vegetationDensity: 1.0,
        stationLodDistance: 220,
        enableCloudsDrift: true,
        fogFar: 240,
        maxDrawDistance: 260,
      }
  }
}

/**
 * Load persisted user preference or fallback to auto-detected quality
 */
export function getInitialQuality(caps: DeviceCapabilities): GraphicsQuality {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as GraphicsQuality | null
      if (saved && (saved === 'low' || saved === 'medium' || saved === 'high')) {
        return saved
      }
    }
  } catch {
    // LocalStorage unavailable
  }
  return caps.recommendedQuality
}

/**
 * Save user graphics quality preference
 */
export function saveQualityPreference(quality: GraphicsQuality): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, quality)
    }
  } catch {
    // LocalStorage unavailable
  }
}
