import { AXIS_BY_TAG, type AxisTag, type InputSource } from '../../engine/axes'
import type { AxisBinding } from '../../state/config'
import { Slider } from './Slider'

const SOURCE_OPTIONS: { value: InputSource; label: string }[] = [
  { value: 'mouseX', label: 'Mouse X' },
  { value: 'mouseY', label: 'Mouse Y' },
  { value: 'mic', label: 'Mic' },
  { value: 'none', label: 'None' },
]

interface AxisControlProps {
  tag: AxisTag
  binding: AxisBinding
  onChange: (patch: Partial<AxisBinding>) => void
}

export function AxisControl({ tag, binding, onChange }: AxisControlProps) {
  const axis = AXIS_BY_TAG[tag]

  return (
    <section className="rounded-xl border border-foontik-border bg-white/[0.02] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foontik-text">{axis.label}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-foontik-muted">
            {tag}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ locked: !binding.locked })}
          className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider transition-colors ${
            binding.locked
              ? 'border-foontik-accent/60 bg-foontik-accent/10 text-foontik-accent'
              : 'border-foontik-border text-foontik-muted hover:text-foontik-text'
          }`}
        >
          {binding.locked ? 'Locked' : 'Live'}
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {SOURCE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={binding.locked}
            onClick={() => onChange({ source: option.value })}
            className={`rounded-md px-2 py-1 text-[10px] uppercase tracking-wide transition-colors disabled:opacity-40 ${
              binding.source === option.value
                ? 'bg-foontik-accent text-black'
                : 'bg-white/5 text-foontik-muted hover:text-foontik-text'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Slider
          label="Sensitivity"
          value={binding.sensitivity}
          min={0.3}
          max={3}
          step={0.05}
          onChange={(sensitivity) => onChange({ sensitivity })}
        />
        <Slider
          label="Range Min"
          value={binding.rangeMin}
          min={0}
          max={1}
          step={0.01}
          onChange={(rangeMin) => onChange({ rangeMin })}
        />
        <Slider
          label="Range Max"
          value={binding.rangeMax}
          min={0}
          max={1}
          step={0.01}
          onChange={(rangeMax) => onChange({ rangeMax })}
        />
        <Slider
          label="Default"
          value={binding.defaultValue}
          min={axis.min}
          max={axis.max}
          step={axis.step}
          displayValue={
            tag === 'wght'
              ? String(Math.round(binding.defaultValue))
              : binding.defaultValue.toFixed(2)
          }
          onChange={(defaultValue) => onChange({ defaultValue })}
        />
      </div>
    </section>
  )
}
