interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  displayValue?: string
  onChange: (value: number) => void
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  displayValue,
  onChange,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <label className="group block">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foontik-muted">
          {label}
        </span>
        <span className="font-mono text-xs tabular-nums text-foontik-accent">
          {displayValue ?? value.toFixed(2)}
        </span>
      </div>
      <div className="relative h-6">
        <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-foontik-border" />
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-foontik-accent/70 transition-[width] duration-75"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
        />
        <div
          className="pointer-events-none absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foontik-accent/40 bg-foontik-accent shadow-[0_0_12px_rgba(232,255,71,0.45)] transition-[left] duration-75 group-hover:scale-110"
          style={{ left: `${pct}%` }}
        />
      </div>
    </label>
  )
}
