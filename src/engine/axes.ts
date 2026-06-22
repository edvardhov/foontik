export type AxisTag = 'wght' | 'slnt' | 'CASL' | 'MONO' | 'CRSV' | 'scale'

export type InputSource = 'mouseX' | 'mouseY' | 'mic' | 'none'

export interface FontAxis {
  tag: AxisTag
  cssVar: string
  min: number
  max: number
  default: number
  label: string
  step: number
}

export const FONT_AXES: FontAxis[] = [
  {
    tag: 'wght',
    cssVar: '--fnt-wght',
    min: 300,
    max: 1000,
    default: 650,
    label: 'Weight',
    step: 1,
  },
  {
    tag: 'slnt',
    cssVar: '--fnt-slnt',
    min: -15,
    max: 0,
    default: 0,
    label: 'Slant',
    step: 0.1,
  },
  {
    tag: 'CASL',
    cssVar: '--fnt-CASL',
    min: 0,
    max: 1,
    default: 0.3,
    label: 'Casual',
    step: 0.01,
  },
  {
    tag: 'MONO',
    cssVar: '--fnt-MONO',
    min: 0,
    max: 1,
    default: 0,
    label: 'Mono',
    step: 0.01,
  },
  {
    tag: 'CRSV',
    cssVar: '--fnt-CRSV',
    min: 0,
    max: 1,
    default: 0.5,
    label: 'Cursive',
    step: 0.01,
  },
]

export const SCALE_AXIS: FontAxis = {
  tag: 'scale',
  cssVar: '--fnt-scale',
  min: 0.85,
  max: 1.35,
  default: 1,
  label: 'Scale',
  step: 0.01,
}

export const ALL_AXES: FontAxis[] = [...FONT_AXES, SCALE_AXIS]

export const AXIS_BY_TAG = Object.fromEntries(
  ALL_AXES.map((axis) => [axis.tag, axis]),
) as Record<AxisTag, FontAxis>

export const CSS_VAR_DEFAULTS: Record<string, string> = Object.fromEntries(
  ALL_AXES.map((axis) => [axis.cssVar, String(axis.default)]),
)
