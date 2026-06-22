export const spring = { type: 'spring', stiffness: 320, damping: 30 } as const

export const overlayFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const modalPop = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: spring },
  exit: { opacity: 0, scale: 0.98, y: 8, transition: { duration: 0.15 } },
}

export const staggerList = {
  visible: { transition: { staggerChildren: 0.06 } },
}

export const listItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

export const hintFade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
}

export const buttonHover = { scale: 1.02 }
export const buttonTap = { scale: 0.97 }

export const collapse = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto', transition: spring },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15 } },
}
