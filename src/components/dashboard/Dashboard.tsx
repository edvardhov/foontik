import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Logo } from '../Logo'
import { FONT_AXES, type AxisTag } from '../../engine/axes'
import type { AxisBinding, FoontikConfig } from '../../state/config'
import { buttonHover, buttonTap, listItem, spring, staggerList } from '../../ui/motion'
import { AxisControl } from './AxisControl'
import { ExportButton } from './ExportButton'
import { InputToggles } from './InputToggles'
import { PresetBar } from './PresetBar'
import { Slider } from './Slider'

interface DashboardProps {
  config: FoontikConfig
  micLevel: number
  micError: string | null
  coachPulse?: boolean
  onConfigChange: (patch: Partial<FoontikConfig>) => void
  onAxisChange: (tag: AxisTag, patch: Partial<AxisBinding>) => void
  onExport?: () => void
  exportTargetRef: React.RefObject<HTMLElement | null>
}

export function Dashboard({
  config,
  micLevel,
  micError,
  coachPulse = false,
  onConfigChange,
  onAxisChange,
  onExport,
  exportTargetRef,
}: DashboardProps) {
  const [open, setOpen] = useState(true)

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        whileHover={buttonHover}
        whileTap={buttonTap}
        className="fixed right-4 top-4 z-50 flex size-11 items-center justify-center rounded-full border border-foontik-border bg-foontik-surface/90 text-sm backdrop-blur-xl transition-colors hover:border-foontik-accent/40"
        aria-label={open ? 'Close controls' : 'Open controls'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.15 }}
            className="inline-block"
          >
            {open ? '×' : '≡'}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <motion.aside
        className="fixed right-0 top-0 z-40 flex h-full w-[min(100vw,380px)] flex-col border-l border-foontik-border bg-foontik-surface/85 backdrop-blur-2xl"
        initial={false}
        animate={{ x: open ? 0 : '100%' }}
        transition={spring}
      >
        <header className="border-b border-foontik-border px-6 py-5">
          <Logo variant="dark" className="h-10 w-auto" />
          <h2 className="mt-2 text-xl font-medium tracking-tight">Kinetic type-art studio</h2>
          <p className="mt-1 text-xs text-foontik-muted">Type · Shape · Snap</p>
        </header>

        <motion.div
          className="flex-1 space-y-6 overflow-y-auto px-6 py-5"
          variants={staggerList}
          initial="hidden"
          animate={open ? 'visible' : 'hidden'}
        >
          <motion.section className="space-y-4" variants={listItem}>
            <h3 className="text-xs uppercase tracking-[0.18em] text-foontik-muted">Global</h3>
            <Slider
              label="Font Size"
              value={config.fontSize}
              min={4}
              max={22}
              step={0.5}
              displayValue={`${config.fontSize}vw`}
              onChange={(fontSize) => onConfigChange({ fontSize })}
            />
            <Slider
              label="Smoothing"
              value={config.smoothing}
              min={0}
              max={1}
              step={0.01}
              onChange={(smoothing) => onConfigChange({ smoothing })}
            />
            <Slider
              label="Mic Influence"
              value={config.micInfluence}
              min={0}
              max={1}
              step={0.01}
              onChange={(micInfluence) => onConfigChange({ micInfluence })}
            />
          </motion.section>

          <motion.section variants={listItem}>
            <h3 className="mb-3 text-xs uppercase tracking-[0.18em] text-foontik-muted">
              Inputs
            </h3>
            <InputToggles
              mouseEnabled={config.mouseEnabled}
              micEnabled={config.micEnabled}
              micLevel={micLevel}
              micError={micError}
              onMouseToggle={(mouseEnabled) => onConfigChange({ mouseEnabled })}
              onMicToggle={() => onConfigChange({ micEnabled: !config.micEnabled })}
            />
          </motion.section>

          <motion.section variants={listItem}>
            <h3 className="mb-3 text-xs uppercase tracking-[0.18em] text-foontik-muted">
              Looks
            </h3>
            <PresetBar
              config={config}
              onApply={(next) => onConfigChange(next)}
            />
          </motion.section>

          <motion.section className="space-y-3" variants={listItem}>
            <h3 className="text-xs uppercase tracking-[0.18em] text-foontik-muted">Axes</h3>
            {FONT_AXES.map((axis) => (
              <AxisControl
                key={axis.tag}
                tag={axis.tag}
                binding={config.axes[axis.tag]}
                onChange={(patch) => onAxisChange(axis.tag, patch)}
              />
            ))}
          </motion.section>
        </motion.div>

        <footer className="space-y-3 border-t border-foontik-border px-6 py-4">
          <label className="flex cursor-pointer items-center justify-between gap-3 text-xs text-foontik-muted">
            <span>Add &ldquo;made with Foontik&rdquo; to export</span>
            <input
              type="checkbox"
              checked={config.showWordmark}
              onChange={(event) => onConfigChange({ showWordmark: event.target.checked })}
              className="size-4 accent-foontik-accent"
            />
          </label>
          <ExportButton
            targetRef={exportTargetRef}
            showWordmark={config.showWordmark}
            coachPulse={coachPulse}
            onExport={onExport}
          />
        </footer>
      </motion.aside>
    </>
  )
}
