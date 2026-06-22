import { useEffect, useRef } from 'react'
import { normalize } from '../engine/mapping'

export interface NormalizedPointer {
  x: number
  y: number
}

export function useMouseInput(
  enabled: boolean,
  onMove: (pointer: NormalizedPointer) => void,
): void {
  const latest = useRef<NormalizedPointer>({ x: 0.5, y: 0.5 })
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) return

    // Seed center so axes respond before the first pointermove event.
    onMove({ x: 0.5, y: 0.5 })

    const flush = () => {
      rafId.current = null
      onMove(latest.current)
    }

    const handlePointerMove = (event: PointerEvent) => {
      // Map viewport pixels to 0..1. clamp is implicit via normalize().
      latest.current = {
        x: normalize(event.clientX, 0, window.innerWidth),
        y: normalize(event.clientY, 0, window.innerHeight),
      }

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(flush)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [enabled, onMove])
}
