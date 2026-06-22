import { useCallback, useMemo, useRef, useState } from 'react'
import { MotionConfig, motion } from 'motion/react'
import { Logo } from './components/Logo'
import { Onboarding } from './components/Onboarding'
import { StageHint } from './components/StageHint'
import { Dashboard } from './components/dashboard/Dashboard'
import { Stage } from './components/Stage'
import type { AxisTag } from './engine/axes'
import { useFoontikEngine } from './hooks/useFoontikEngine'
import { useLocalStorage } from './hooks/useLocalStorage'
import {
  ONBOARDED_KEY,
  STORAGE_KEY,
  createDefaultConfig,
  type AxisBinding,
  type FoontikConfig,
} from './state/config'
import { buttonHover, buttonTap } from './ui/motion'

function mergeConfig(stored: Partial<FoontikConfig>): FoontikConfig {
  const defaults = createDefaultConfig()
  const mergedAxes = { ...defaults.axes }
  if (stored.axes) {
    for (const tag of Object.keys(defaults.axes) as AxisTag[]) {
      mergedAxes[tag] = { ...defaults.axes[tag], ...stored.axes[tag] }
    }
  }
  return {
    ...defaults,
    ...stored,
    axes: mergedAxes,
  }
}

export default function App() {
  const [config, setConfig] = useLocalStorage<FoontikConfig>(
    STORAGE_KEY,
    createDefaultConfig(),
  )
  const [onboarded, setOnboarded] = useLocalStorage<boolean>(ONBOARDED_KEY, false)
  const [forceOnboarding, setForceOnboarding] = useState(false)
  const [coachActive, setCoachActive] = useState(false)
  const [hasEditedText, setHasEditedText] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const safeConfig = useMemo(() => mergeConfig(config), [config])
  const exportRef = useRef<HTMLHeadingElement>(null)

  const handleDemoComplete = useCallback(() => {
    setCoachActive(true)
  }, [])

  const { containerRef, mic, startDemo } = useFoontikEngine(safeConfig, {
    onDemoComplete: handleDemoComplete,
  })

  const showOnboarding = !onboarded || forceOnboarding

  const dismissOnboarding = useCallback(
    (options: { runDemo: boolean }) => {
      const isFirstRun = !onboarded
      setOnboarded(true)
      setForceOnboarding(false)
      if (isFirstRun && options.runDemo) {
        startDemo()
      }
    },
    [onboarded, setOnboarded, startDemo],
  )

  const markInteraction = useCallback(() => {
    setHasInteracted(true)
    setCoachActive(false)
  }, [])

  const updateConfig = useCallback(
    (patch: Partial<FoontikConfig>) => {
      setConfig((prev) => mergeConfig({ ...prev, ...patch }))
    },
    [setConfig],
  )

  const updateAxis = useCallback(
    (tag: AxisTag, patch: Partial<AxisBinding>) => {
      setConfig((prev) => {
        const merged = mergeConfig(prev)
        return {
          ...merged,
          axes: {
            ...merged.axes,
            [tag]: { ...merged.axes[tag], ...patch },
          },
        }
      })
    },
    [setConfig],
  )

  const handleTextChange = useCallback(
    (text: string) => {
      setHasEditedText(true)
      markInteraction()
      updateConfig({ text })
    },
    [markInteraction, updateConfig],
  )

  const handleApplyLook = useCallback(
    (next: FoontikConfig) => {
      setConfig(mergeConfig(next))
      if (next.text.trim()) setHasEditedText(true)
    },
    [setConfig],
  )

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={containerRef}
        className="foontik-root relative h-full w-full overflow-hidden bg-foontik-bg"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(232,255,71,0.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.04), transparent 35%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[48px_48px]" />

        <div className="fixed left-4 top-4 z-50 flex max-w-[min(100vw-2rem,440px)] flex-col items-start gap-3">
          <Logo variant="dark" className="h-10 max-w-full w-auto" />
          <motion.button
            type="button"
            onClick={() => setForceOnboarding(true)}
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="rounded-full border border-foontik-border bg-foontik-surface/90 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foontik-muted backdrop-blur-xl transition-colors hover:border-foontik-accent/40 hover:text-foontik-text"
          >
            How it works
          </motion.button>
        </div>

        <Stage
          ref={exportRef}
          text={safeConfig.text}
          fontSize={safeConfig.fontSize}
          coachPulse={coachActive && !hasInteracted}
          onTextChange={handleTextChange}
          onFocus={markInteraction}
        />

        <StageHint
          hasEditedText={hasEditedText}
          coachActive={coachActive}
          textEmpty={!safeConfig.text.trim()}
        />

        <Dashboard
          config={safeConfig}
          micLevel={mic.level}
          micError={mic.error}
          coachPulse={coachActive && !hasInteracted}
          onConfigChange={updateConfig}
          onAxisChange={updateAxis}
          onExport={markInteraction}
          exportTargetRef={exportRef}
        />

        <Onboarding
          open={showOnboarding}
          onStartCreating={() => dismissOnboarding({ runDemo: true })}
          onJustExploring={() => dismissOnboarding({ runDemo: false })}
          onApplyLook={handleApplyLook}
        />
      </div>
    </MotionConfig>
  )
}
