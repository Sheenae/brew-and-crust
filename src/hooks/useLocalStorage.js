import { useState, useEffect, useRef } from 'react'

/**
 * Persists state to localStorage under `key`, reading the initial
 * value synchronously so there's no flash of empty state on load.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  const isFirstRun = useRef(true)

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage unavailable (e.g. private mode) — fail silently
    }
  }, [key, value])

  return [value, setValue]
}
