import type { FontAxis } from './axes'
import type { AxisBinding } from '../state/config'

/**
 * Clamp a value into [min, max].
 * Used as the final guard so out-of-range mouse pixels never produce invalid axis values.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/**
 * Normalize a value from an input domain [inMin, inMax] into 0..1.
 *
 * Example: mouse X at 960px on a 1920px screen:
 *   normalize(960, 0, 1920) => 0.5
 *
 * When inMin === inMax we return 0.5 to avoid division by zero.
 */
export function normalize(value: number, inMin: number, inMax: number): number {
  if (inMax === inMin) return 0.5
  return clamp((value - inMin) / (inMax - inMin), 0, 1)
}

/**
 * Apply sensitivity around the center of the normalized range.
 *
 * sensitivity = 1  -> linear response
 * sensitivity > 1  -> exaggerates deviation from center (more kinetic)
 * sensitivity < 1  -> dampens toward center (smoother, less twitchy)
 *
 * We remap 0..1 through a power curve centered at 0.5:
 *   adjusted = 0.5 + sign(t - 0.5) * |2t - 1|^sensitivity / 2
 */
export function applySensitivity(normalized: number, sensitivity: number): number {
  const t = clamp(normalized, 0, 1)
  const centered = t - 0.5
  const sign = centered >= 0 ? 1 : -1
  const magnitude = Math.pow(Math.abs(centered * 2), sensitivity) / 2
  return clamp(0.5 + sign * magnitude, 0, 1)
}

/**
 * Map a normalized 0..1 input into the user-configured sub-window of an axis.
 *
 * rangeMin/rangeMax are expressed as 0..1 fractions of the axis's physical span.
 * Example for wght (300..1000) with rangeMin=0.2, rangeMax=0.8:
 *   physical min = 300 + 0.2 * 700 = 440
 *   physical max = 300 + 0.8 * 700 = 860
 *   input 0 -> 440, input 1 -> 860
 */
export function mapToAxisRange(
  normalized: number,
  axis: FontAxis,
  rangeMin: number,
  rangeMax: number,
): number {
  const span = axis.max - axis.min
  const physicalMin = axis.min + clamp(rangeMin, 0, 1) * span
  const physicalMax = axis.min + clamp(rangeMax, 0, 1) * span
  const lo = Math.min(physicalMin, physicalMax)
  const hi = Math.max(physicalMin, physicalMax)
  return lo + clamp(normalized, 0, 1) * (hi - lo)
}

/**
 * Full pipeline: normalized input -> sensitivity -> axis physical value.
 * Locked axes always return their configured default.
 */
export function mapAxis(
  normalized: number,
  axis: FontAxis,
  binding: AxisBinding,
): number {
  if (binding.locked) return binding.defaultValue

  const adjusted = applySensitivity(normalized, binding.sensitivity)
  return mapToAxisRange(adjusted, axis, binding.rangeMin, binding.rangeMax)
}

/**
 * Linear interpolation for the rAF smoothing loop.
 */
export function lerp(current: number, target: number, alpha: number): number {
  return current + (target - current) * alpha
}

/**
 * Convert smoothing (0..1, higher = snappier) into a per-frame lerp factor.
 * At 60fps, alpha ~ 0.15 feels responsive without overshooting.
 */
export function smoothingToAlpha(smoothing: number): number {
  return clamp(0.05 + smoothing * 0.35, 0.05, 0.4)
}
