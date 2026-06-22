import { useCallback, useEffect, useRef, useState } from 'react'
import { normalize } from '../engine/mapping'

export interface MicState {
  enabled: boolean
  level: number
  error: string | null
  toggle: () => Promise<void>
}

interface MicRuntime {
  stream: MediaStream
  context: AudioContext
  analyser: AnalyserNode
  data: Uint8Array<ArrayBuffer>
  rafId: number
}

export function useMicInput(requested: boolean, onLevel: (level: number) => void): MicState {
  const [enabled, setEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [level, setLevel] = useState(0)
  const runtimeRef = useRef<MicRuntime | null>(null)
  const onLevelRef = useRef(onLevel)

  useEffect(() => {
    onLevelRef.current = onLevel
  }, [onLevel])

  const teardownRuntime = useCallback(() => {
    const runtime = runtimeRef.current
    if (!runtime) return
    cancelAnimationFrame(runtime.rafId)
    runtime.stream.getTracks().forEach((track) => track.stop())
    void runtime.context.close()
    runtimeRef.current = null
  }, [])

  const resetLevel = useCallback(() => {
    setLevel(0)
    onLevelRef.current(0)
  }, [])

  useEffect(() => {
    if (requested) return

    teardownRuntime()
    const frame = requestAnimationFrame(() => {
      setEnabled(false)
      resetLevel()
    })

    return () => cancelAnimationFrame(frame)
  }, [requested, resetLevel, teardownRuntime])

  useEffect(() => {
    if (!requested) return

    let cancelled = false

    const boot = async () => {
      try {
        setError(null)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        const context = new AudioContext()
        const source = context.createMediaStreamSource(stream)
        const analyser = context.createAnalyser()
        analyser.fftSize = 512
        analyser.smoothingTimeConstant = 0.75
        source.connect(analyser)

        const data = new Uint8Array(analyser.frequencyBinCount)
        let rafId = 0

        const tick = () => {
          analyser.getByteTimeDomainData(data)

          let sumSquares = 0
          for (let i = 0; i < data.length; i += 1) {
            const sample = (data[i]! - 128) / 128
            sumSquares += sample * sample
          }

          const rms = Math.sqrt(sumSquares / data.length)
          const peak = normalize(rms, 0.01, 0.35)
          setLevel(peak)
          onLevelRef.current(peak)
          rafId = requestAnimationFrame(tick)
        }

        runtimeRef.current = { stream, context, analyser, data, rafId: 0 }
        rafId = requestAnimationFrame(tick)
        runtimeRef.current.rafId = rafId
        setEnabled(true)
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Microphone access denied'
        setError(message)
        setEnabled(false)
        resetLevel()
      }
    }

    void boot()

    return () => {
      cancelled = true
      teardownRuntime()
    }
  }, [requested, resetLevel, teardownRuntime])

  const toggle = useCallback(async () => {
    // Mic is config-driven; toggle is kept for API compatibility.
  }, [])

  return { enabled, level, error, toggle }
}
