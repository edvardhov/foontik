import { AnimatePresence, motion } from 'motion/react'
import { collapse, spring } from '../../ui/motion'

interface InputTogglesProps {
  mouseEnabled: boolean
  micEnabled: boolean
  micLevel: number
  micError: string | null
  onMouseToggle: (enabled: boolean) => void
  onMicToggle: () => void
}

export function InputToggles({
  mouseEnabled,
  micEnabled,
  micLevel,
  micError,
  onMouseToggle,
  onMicToggle,
}: InputTogglesProps) {
  return (
    <section className="space-y-3">
      <ToggleRow
        label="Mouse Tracking"
        description="Map cursor position to font axes"
        active={mouseEnabled}
        onToggle={() => onMouseToggle(!mouseEnabled)}
      />
      <ToggleRow
        label="Microphone"
        description="Drive scale and vibration from audio peaks"
        active={micEnabled}
        onToggle={() => void onMicToggle()}
      />
      <AnimatePresence initial={false}>
        {micEnabled && (
          <motion.div
            key="mic-meter"
            className="overflow-hidden"
            variants={collapse}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="rounded-lg border border-foontik-border bg-black/20 px-3 py-2">
              <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider text-foontik-muted">
                <span>Input Level</span>
                <span>{Math.round(micLevel * 100)}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-foontik-accent transition-[width] duration-75"
                  style={{ width: `${micLevel * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {micError && (
          <motion.p
            key="mic-error"
            className="overflow-hidden text-xs text-red-400"
            variants={collapse}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {micError}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}

function ToggleRow({
  label,
  description,
  active,
  onToggle,
}: {
  label: string
  description: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-foontik-border bg-white/[0.02] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-foontik-muted">{description}</p>
      </div>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
          active ? 'bg-foontik-accent/80' : 'bg-white/10'
        }`}
      >
        <motion.span
          className="absolute top-0.5 size-5 rounded-full bg-white shadow"
          animate={{ x: active ? 20 : 2 }}
          transition={spring}
        />
      </span>
    </button>
  )
}
