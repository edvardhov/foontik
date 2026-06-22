import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Logo } from './Logo'
import type { FoontikConfig } from '../state/config'
import { STARTER_PRESETS, type Preset } from '../state/presets'
import {
  buttonHover,
  buttonTap,
  listItem,
  modalPop,
  overlayFade,
  staggerList,
} from '../ui/motion'

interface OnboardingProps {
  open: boolean
  onStartCreating: () => void
  onJustExploring: () => void
  onApplyLook?: (config: FoontikConfig) => void
}

const STEPS = [
  {
    number: '01',
    title: 'Type',
    description: 'Click the word and type your phrase — a name, a quote, a vibe.',
  },
  {
    number: '02',
    title: 'Shape',
    description: 'Move your cursor to morph weight, slant, and style. Add voice for pulse.',
  },
  {
    number: '03',
    title: 'Snap',
    description: 'Export a high-res poster PNG when it feels right.',
  },
]

function PreviewMorph() {
  const ref = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const start = performance.now()
    const tick = (now: number) => {
      const t = (now - start) / 1000
      const wght = 400 + 500 * (0.5 + 0.5 * Math.sin(t * 1.8))
      const slnt = -12 * (0.5 + 0.5 * Math.sin(t * 2.4 + 1))
      const mono = 0.5 + 0.5 * Math.sin(t * 1.3)
      node.style.fontVariationSettings = `"MONO" ${mono.toFixed(2)}, "CASL" 0.4, "wght" ${Math.round(wght)}, "slnt" ${slnt.toFixed(1)}, "CRSV" 0.5`
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div className="flex h-28 items-center justify-center rounded-xl border border-foontik-border bg-black/40 px-4">
      <span
        ref={ref}
        className="text-4xl font-medium tracking-tight text-foontik-text"
        style={{ fontFamily: 'Recursive, monospace', fontStyle: 'oblique' }}
      >
        LIVE
      </span>
    </div>
  )
}

function StarterChip({
  preset,
  onSelect,
}: {
  preset: Preset
  onSelect: (config: FoontikConfig) => void
}) {
  return (
    <motion.button
      type="button"
      variants={listItem}
      whileHover={buttonHover}
      whileTap={buttonTap}
      onClick={() => onSelect(structuredClone(preset.config))}
      className="rounded-full border border-foontik-border bg-white/[0.03] px-3 py-1.5 text-xs text-foontik-muted transition-colors hover:border-foontik-accent/40 hover:text-foontik-accent"
    >
      {preset.name}
    </motion.button>
  )
}

export function Onboarding({ open, onStartCreating, onJustExploring, onApplyLook }: OnboardingProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="onboarding-backdrop"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          variants={overlayFade}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-foontik-border bg-foontik-surface/95 p-8 shadow-2xl backdrop-blur-2xl"
            variants={modalPop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
          >
            <Logo variant="dark" className="h-12 w-auto" />
            <h1 className="mt-2 text-2xl font-medium tracking-tight text-foontik-text">
              Turn a word into living type art
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-foontik-muted">
              Foontik is a kinetic type-art studio. Type a word, shape it with your cursor and voice,
              then snap it as a poster you can save or share.
            </p>

            <div className="my-6">
              <PreviewMorph />
              <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-foontik-muted/70">
                Your type moves like this
              </p>
            </div>

            <motion.ol
              className="space-y-4"
              variants={staggerList}
              initial="hidden"
              animate="visible"
            >
              {STEPS.map((step) => (
                <motion.li key={step.number} className="flex gap-4" variants={listItem}>
                  <span className="font-mono text-xs text-foontik-accent">{step.number}</span>
                  <div>
                    <p className="text-sm font-medium text-foontik-text">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-foontik-muted">{step.description}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ol>

            {onApplyLook && (
              <div className="mt-6">
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-foontik-muted">
                  Or start from a look
                </p>
                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={staggerList}
                  initial="hidden"
                  animate="visible"
                >
                  {STARTER_PRESETS.map((preset) => (
                    <StarterChip key={preset.id} preset={preset} onSelect={onApplyLook} />
                  ))}
                </motion.div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <motion.button
                type="button"
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={onStartCreating}
                className="flex-1 rounded-xl border border-foontik-accent/50 bg-foontik-accent px-4 py-3 text-sm font-medium uppercase tracking-[0.12em] text-black transition-opacity hover:opacity-90"
              >
                Start creating
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ opacity: 0.8 }}
                whileTap={buttonTap}
                onClick={onJustExploring}
                className="text-sm text-foontik-muted underline-offset-4 transition-colors hover:text-foontik-text hover:underline"
              >
                Just exploring
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
