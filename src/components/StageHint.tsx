import { AnimatePresence, motion } from 'motion/react'
import { hintFade } from '../ui/motion'

interface StageHintProps {
  hasEditedText: boolean
  coachActive: boolean
  textEmpty: boolean
}

export function StageHint({ hasEditedText, coachActive, textEmpty }: StageHintProps) {
  let message: string

  if (coachActive) {
    message = textEmpty
      ? 'Click the word to type yours · Then Snap to save your poster'
      : 'Move your cursor to shape it · Open controls for looks · Snap when ready'
  } else if (!hasEditedText || textEmpty) {
    message = 'Click the word to make it yours'
  } else {
    message = 'Move + speak to shape it · Snap to save your poster'
  }

  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 max-w-md -translate-x-1/2 px-4 text-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-foontik-muted/80"
          variants={hintFade}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {message}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
