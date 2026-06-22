import { createDefaultConfig, type FoontikConfig } from './config'
import type { AxisTag } from '../engine/axes'

export interface Preset {
  id: string
  name: string
  config: FoontikConfig
  createdAt: number
}

export const PRESETS_KEY = 'foontik-presets-v1'

function withAxes(
  patch: Omit<Partial<FoontikConfig>, 'axes'> & {
    axes?: Partial<Record<AxisTag, Partial<FoontikConfig['axes'][AxisTag]>>>
  },
): FoontikConfig {
  const base = createDefaultConfig()
  const mergedAxes = { ...base.axes }
  const { axes: axisPatch, ...rest } = patch
  if (axisPatch) {
    for (const tag of Object.keys(axisPatch) as AxisTag[]) {
      mergedAxes[tag] = { ...mergedAxes[tag], ...axisPatch[tag] }
    }
  }
  return { ...base, ...rest, axes: mergedAxes }
}

export const STARTER_PRESETS: Preset[] = [
  {
    id: 'starter-heavy-drift',
    name: 'Heavy Drift',
    createdAt: 0,
    config: withAxes({
      text: 'DRIFT',
      fontSize: 14,
      smoothing: 0.6,
      axes: {
        wght: { source: 'mouseY', rangeMin: 0.5, rangeMax: 1, sensitivity: 1.5 },
        slnt: { source: 'mouseX', rangeMin: 0, rangeMax: 1, sensitivity: 1.4 },
        CASL: { source: 'none', defaultValue: 0.1 },
        MONO: { source: 'none', defaultValue: 0 },
        CRSV: { source: 'mouseX', rangeMin: 0.3, rangeMax: 0.8, sensitivity: 1.1 },
      },
    }),
  },
  {
    id: 'starter-whisper-italic',
    name: 'Whisper Italic',
    createdAt: 0,
    config: withAxes({
      text: 'WHISPER',
      fontSize: 11,
      smoothing: 0.7,
      axes: {
        wght: { source: 'mouseY', rangeMin: 0, rangeMax: 0.45, sensitivity: 1.3 },
        slnt: { source: 'mouseX', rangeMin: 0.4, rangeMax: 1, sensitivity: 1.6 },
        CASL: { source: 'none', defaultValue: 0.6 },
        MONO: { source: 'none', defaultValue: 0 },
        CRSV: { source: 'mouseY', rangeMin: 0.6, rangeMax: 1, sensitivity: 1.2 },
      },
    }),
  },
  {
    id: 'starter-mono-pulse',
    name: 'Mono Pulse',
    createdAt: 0,
    config: withAxes({
      text: 'PULSE',
      fontSize: 13,
      smoothing: 0.5,
      micEnabled: true,
      micInfluence: 0.75,
      axes: {
        wght: { source: 'mouseY', rangeMin: 0.3, rangeMax: 0.9, sensitivity: 1.2 },
        slnt: { source: 'none', defaultValue: 0 },
        CASL: { source: 'none', defaultValue: 0 },
        MONO: { source: 'mouseX', rangeMin: 0.6, rangeMax: 1, sensitivity: 1.4 },
        CRSV: { source: 'none', defaultValue: 0 },
        scale: { source: 'mic', rangeMin: 0.85, rangeMax: 1.25, sensitivity: 1.3 },
      },
    }),
  },
  {
    id: 'starter-casual-bounce',
    name: 'Casual Bounce',
    createdAt: 0,
    config: withAxes({
      text: 'BOUNCE',
      fontSize: 15,
      smoothing: 0.45,
      axes: {
        wght: { source: 'mouseY', rangeMin: 0.2, rangeMax: 0.85, sensitivity: 1.8 },
        slnt: { source: 'mouseX', rangeMin: 0, rangeMax: 0.6, sensitivity: 1.5 },
        CASL: { source: 'mouseX', rangeMin: 0.4, rangeMax: 1, sensitivity: 1.3 },
        MONO: { source: 'none', defaultValue: 0 },
        CRSV: { source: 'mouseY', rangeMin: 0.2, rangeMax: 0.9, sensitivity: 1.4 },
      },
    }),
  },
]

export function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Preset[]
  } catch {
    return []
  }
}

export function savePresets(presets: Preset[]): void {
  localStorage.setItem(PRESETS_KEY, JSON.stringify(presets))
}

export function createPreset(name: string, config: FoontikConfig): Preset {
  return {
    id: crypto.randomUUID(),
    name,
    config: structuredClone(config),
    createdAt: Date.now(),
  }
}
