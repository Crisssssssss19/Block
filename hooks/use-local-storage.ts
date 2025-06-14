"use client"

import { useState, useEffect, useRef } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const isInitialized = useRef(false)

  // Load from localStorage on mount
  useEffect(() => {
    if (!isInitialized.current) {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          const parsedValue = JSON.parse(item)
          setStoredValue(parsedValue)
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      } finally {
        isInitialized.current = true
      }
    }
  }, [key])

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      // Only save to localStorage if we're initialized
      if (isInitialized.current) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
