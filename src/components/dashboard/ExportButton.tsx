import { useState } from 'react'
import { motion } from 'motion/react'
import { exportStageSnapshot } from '../../export/snapshot'
import { buttonHover, buttonTap } from '../../ui/motion'

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLElement | null>
  showWordmark: boolean
  coachPulse?: boolean
  onExport?: () => void
}

export function ExportButton({
  targetRef,
  showWordmark,
  coachPulse = false,
  onExport,
}: ExportButtonProps) {
  const [busy, setBusy] = useState(false)

  const handleExport = async () => {
    const target = targetRef.current
    if (!target || busy) return

    onExport?.()
    setBusy(true)
    try {
      await exportStageSnapshot(target, { showWordmark })
    } catch (error) {
      console.error('Export failed', error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.button
      type="button"
      disabled={busy}
      whileHover={busy ? undefined : buttonHover}
      whileTap={busy ? undefined : buttonTap}
      onClick={() => void handleExport()}
      className={`w-full rounded-xl border border-foontik-accent/50 bg-foontik-accent px-4 py-3 text-sm font-medium uppercase tracking-[0.12em] text-black transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60 ${coachPulse ? 'coach-pulse' : ''}`}
    >
      {busy ? 'Capturing…' : 'Snap / Save Poster'}
    </motion.button>
  )
}
