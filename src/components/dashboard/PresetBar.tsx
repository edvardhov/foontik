import { useState } from 'react'
import { motion } from 'motion/react'
import type { FoontikConfig } from '../../state/config'
import { STARTER_PRESETS, createPreset, loadPresets, savePresets, type Preset } from '../../state/presets'
import { buttonHover, buttonTap } from '../../ui/motion'

interface PresetBarProps {
  config: FoontikConfig
  onApply: (config: FoontikConfig) => void
}

export function PresetBar({ config, onApply }: PresetBarProps) {
  const [presets, setPresets] = useState<Preset[]>(() => loadPresets())
  const [name, setName] = useState('')

  const persist = (next: Preset[]) => {
    setPresets(next)
    savePresets(next)
  }

  const handleSave = () => {
    const trimmed = name.trim() || `Preset ${presets.length + 1}`
    persist([createPreset(trimmed, config), ...presets])
    setName('')
  }

  const handleDelete = (id: string) => {
    persist(presets.filter((preset) => preset.id !== id))
  }

  return (
    <section className="space-y-3">
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-foontik-muted">
          Starter looks
        </p>
        <div className="flex flex-wrap gap-2">
          {STARTER_PRESETS.map((preset) => (
            <motion.button
              key={preset.id}
              type="button"
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={() => onApply(structuredClone(preset.config))}
              className="rounded-full border border-foontik-border bg-white/[0.03] px-3 py-1.5 text-xs text-foontik-muted transition-colors hover:border-foontik-accent/40 hover:text-foontik-accent"
            >
              {preset.name}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Save your look as…"
          className="min-w-0 flex-1 rounded-lg border border-foontik-border bg-black/30 px-3 py-2 text-sm outline-none placeholder:text-foontik-muted focus:border-foontik-accent/50"
        />
        <motion.button
          type="button"
          whileHover={buttonHover}
          whileTap={buttonTap}
          onClick={handleSave}
          className="rounded-lg border border-foontik-accent/40 bg-foontik-accent/10 px-3 py-2 text-xs uppercase tracking-wider text-foontik-accent transition-colors hover:bg-foontik-accent/20"
        >
          Save
        </motion.button>
      </div>

      {presets.length === 0 ? (
        <p className="text-xs text-foontik-muted">Your saved looks appear here.</p>
      ) : (
        <ul className="max-h-36 space-y-2 overflow-y-auto pr-1">
          {presets.map((preset) => (
            <li
              key={preset.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-foontik-border bg-white/[0.02] px-3 py-2"
            >
              <motion.button
                type="button"
                whileHover={{ x: 2 }}
                whileTap={buttonTap}
                onClick={() => onApply(structuredClone(preset.config))}
                className="min-w-0 flex-1 truncate text-left text-sm hover:text-foontik-accent"
              >
                {preset.name}
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={buttonTap}
                onClick={() => handleDelete(preset.id)}
                className="text-xs text-foontik-muted hover:text-red-400"
                aria-label={`Delete ${preset.name}`}
              >
                ×
              </motion.button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
