import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const read = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return initialValue
      return JSON.parse(raw) as T
    } catch {
      return initialValue
    }
  }, [initialValue, key])

  const [value, setValue] = useState<T>(() => read())

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage full or unavailable — fail silently.
    }
  }, [key, value])

  return [value, setValue] as const
}
