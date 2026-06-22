import { ALL_AXES, AXIS_BY_TAG, type AxisTag, type InputSource } from '../engine/axes'

export interface AxisBinding {
  source: InputSource
  rangeMin: number
  rangeMax: number
  sensitivity: number
  locked: boolean
  defaultValue: number
}

export interface FoontikConfig {
  text: string
  fontSize: number
  smoothing: number
  mouseEnabled: boolean
  micEnabled: boolean
  micInfluence: number
  showWordmark: boolean
  axes: Record<AxisTag, AxisBinding>
}

function defaultBinding(tag: AxisTag): AxisBinding {
  const axis = AXIS_BY_TAG[tag]
  const defaultSources: Partial<Record<AxisTag, InputSource>> = {
    wght: 'mouseY',
    slnt: 'mouseX',
    CASL: 'none',
    MONO: 'mouseX',
    CRSV: 'mouseY',
    scale: 'mic',
  }

  return {
    source: defaultSources[tag] ?? 'none',
    rangeMin: 0,
    rangeMax: 1,
    sensitivity: 1.2,
    locked: false,
    defaultValue: axis.default,
  }
}

export function createDefaultConfig(): FoontikConfig {
  const axes = Object.fromEntries(
    ALL_AXES.map((axis) => [axis.tag, defaultBinding(axis.tag)]),
  ) as Record<AxisTag, AxisBinding>

  return {
    text: '',
    fontSize: 12,
    smoothing: 0.55,
    mouseEnabled: true,
    micEnabled: false,
    micInfluence: 0.65,
    showWordmark: true,
    axes,
  }
}

export const STORAGE_KEY = 'foontik-config-v1'
export const ONBOARDED_KEY = 'foontik-onboarded-v1'
