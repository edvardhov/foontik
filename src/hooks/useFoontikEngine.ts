import { useCallback, useEffect, useRef, useState } from 'react'
import { FoontikEngine } from '../engine/FoontikEngine'
import { useMouseInput } from '../inputs/useMouseInput'
import { useMicInput } from '../inputs/useMicInput'
import type { FoontikConfig } from '../state/config'

const DEMO_DURATION_MS = 2500

interface UseFoontikEngineOptions {
  onDemoComplete?: () => void
}

export function useFoontikEngine(config: FoontikConfig, options: UseFoontikEngineOptions = {}) {
  const { onDemoComplete } = options
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<FoontikEngine | null>(null)
  const demoRafRef = useRef<number | null>(null)
  const demoStartRef = useRef(0)
  const demoActiveRef = useRef(false)
  const onDemoCompleteRef = useRef(onDemoComplete)
  const [demoActive, setDemoActive] = useState(false)

  useEffect(() => {
    onDemoCompleteRef.current = onDemoComplete
  }, [onDemoComplete])

  const pushInput = useCallback((partial: { mouseX?: number; mouseY?: number; mic?: number }) => {
    engineRef.current?.setInput(partial)
  }, [])

  const stopDemo = useCallback(() => {
    if (demoRafRef.current !== null) {
      cancelAnimationFrame(demoRafRef.current)
      demoRafRef.current = null
    }
    if (demoActiveRef.current) {
      demoActiveRef.current = false
      setDemoActive(false)
    }
  }, [])

  const startDemo = useCallback(() => {
    stopDemo()
    demoActiveRef.current = true
    setDemoActive(true)
    demoStartRef.current = performance.now()

    const tick = (now: number) => {
      if (!demoActiveRef.current) return

      const elapsed = now - demoStartRef.current
      if (elapsed >= DEMO_DURATION_MS) {
        stopDemo()
        onDemoCompleteRef.current?.()
        return
      }

      const t = elapsed / 1000
      const mouseX = 0.5 + 0.42 * Math.sin(t * 2.1)
      const mouseY = 0.5 + 0.42 * Math.cos(t * 1.7)
      pushInput({ mouseX, mouseY })
      demoRafRef.current = requestAnimationFrame(tick)
    }

    demoRafRef.current = requestAnimationFrame(tick)
  }, [pushInput, stopDemo])

  const onMouseMove = useCallback(
    (pointer: { x: number; y: number }) => {
      if (demoActiveRef.current) stopDemo()
      if (!config.mouseEnabled) return
      pushInput({ mouseX: pointer.x, mouseY: pointer.y })
    },
    [config.mouseEnabled, pushInput, stopDemo],
  )

  const onMicLevel = useCallback(
    (level: number) => {
      if (!config.micEnabled) return
      pushInput({ mic: level })
    },
    [config.micEnabled, pushInput],
  )

  useMouseInput(config.mouseEnabled, onMouseMove)

  const mic = useMicInput(config.micEnabled, onMicLevel)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const engine = new FoontikEngine()
    engineRef.current = engine
    engine.attach(root)
    engine.setConfig(config)
    engine.start()

    return () => {
      stopDemo()
      engine.detach()
      engineRef.current = null
    }
    // Engine mounts once; config updates flow through the dedicated effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    engineRef.current?.setConfig(config)
  }, [config])

  return { containerRef, mic, startDemo, stopDemo, demoActive }
}
