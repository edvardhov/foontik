import {
  ALL_AXES,
  AXIS_BY_TAG,
  CSS_VAR_DEFAULTS,
  type AxisTag,
  type FontAxis,
} from './axes'
import { lerp, mapAxis, smoothingToAlpha } from './mapping'
import type { FoontikConfig } from '../state/config'

export interface InputSnapshot {
  mouseX: number
  mouseY: number
  mic: number
}

const DEFAULT_INPUT: InputSnapshot = {
  mouseX: 0.5,
  mouseY: 0.5,
  mic: 0,
}

export class FoontikEngine {
  private root: HTMLElement | null = null
  private rafId: number | null = null
  private config: FoontikConfig | null = null
  private input: InputSnapshot = { ...DEFAULT_INPUT }
  private targets = new Map<AxisTag, number>()
  private current = new Map<AxisTag, number>()
  private vibrationPhase = 0

  attach(root: HTMLElement): void {
    this.root = root
    for (const axis of ALL_AXES) {
      const value = axis.default
      this.targets.set(axis.tag, value)
      this.current.set(axis.tag, value)
      root.style.setProperty(axis.cssVar, String(value))
    }
    for (const [cssVar, value] of Object.entries(CSS_VAR_DEFAULTS)) {
      root.style.setProperty(cssVar, value)
    }
    root.style.setProperty('--fnt-vibrate-x', '0px')
    root.style.setProperty('--fnt-vibrate-y', '0px')
  }

  detach(): void {
    this.stop()
    this.root = null
  }

  setConfig(config: FoontikConfig): void {
    this.config = config
    this.recomputeTargets()
  }

  setInput(partial: Partial<InputSnapshot>): void {
    this.input = { ...this.input, ...partial }
    this.recomputeTargets()
  }

  start(): void {
    if (this.rafId !== null) return
    const tick = () => {
      this.step()
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  getCurrentValues(): Record<AxisTag, number> {
    return Object.fromEntries(this.current.entries()) as Record<AxisTag, number>
  }

  private recomputeTargets(): void {
    if (!this.config) return

    for (const axis of ALL_AXES) {
      const binding = this.config.axes[axis.tag]
      if (!binding || binding.locked) {
        this.targets.set(axis.tag, binding?.defaultValue ?? axis.default)
        continue
      }

      const sourceValue = this.resolveSource(binding.source)
      this.targets.set(axis.tag, mapAxis(sourceValue, axis, binding))
    }

    if (this.config.micEnabled && this.config.micInfluence > 0) {
      const scaleAxis = AXIS_BY_TAG.scale
      const scaleBinding = this.config.axes.scale
      const micBoost = this.input.mic * this.config.micInfluence
      const baseScale = mapAxis(this.input.mic, scaleAxis, scaleBinding)
      this.targets.set('scale', baseScale)

      this.vibrationPhase += 0.35 + this.input.mic * 0.8
      const amplitude = micBoost * 6
      const vx = Math.sin(this.vibrationPhase * 2.1) * amplitude
      const vy = Math.cos(this.vibrationPhase * 1.7) * amplitude
      this.root?.style.setProperty('--fnt-vibrate-x', `${vx.toFixed(2)}px`)
      this.root?.style.setProperty('--fnt-vibrate-y', `${vy.toFixed(2)}px`)
    } else {
      this.root?.style.setProperty('--fnt-vibrate-x', '0px')
      this.root?.style.setProperty('--fnt-vibrate-y', '0px')
    }
  }

  private resolveSource(source: FoontikConfig['axes'][AxisTag]['source']): number {
    switch (source) {
      case 'mouseX':
        return this.input.mouseX
      case 'mouseY':
        return this.input.mouseY
      case 'mic':
        return this.input.mic
      default:
        return 0.5
    }
  }

  private step(): void {
    if (!this.root || !this.config) return

    const alpha = smoothingToAlpha(this.config.smoothing)

    for (const axis of ALL_AXES) {
      const binding = this.config.axes[axis.tag]
      const target = this.targets.get(axis.tag) ?? axis.default
      const prev = this.current.get(axis.tag) ?? axis.default
      const next = binding?.locked ? binding.defaultValue : lerp(prev, target, alpha)
      this.current.set(axis.tag, next)
      this.root.style.setProperty(axis.cssVar, this.formatAxisValue(axis, next))
    }
  }

  private formatAxisValue(axis: FontAxis, value: number): string {
    if (axis.tag === 'wght') return String(Math.round(value))
    if (axis.tag === 'slnt') return value.toFixed(1)
    if (axis.tag === 'scale') return value.toFixed(3)
    return value.toFixed(2)
  }
}
