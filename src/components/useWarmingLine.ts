import { useEffect, useState } from 'react'
import { COPY } from '@/site.config'

/**
 * Rotating cold-start line. Starts with warmingLines[0] (matches the
 * prerendered HTML, so hydration never mismatches) and shuffles to a
 * different line every few seconds while the wait drags on.
 */
export const useWarmingLine = (): string => {
  const [line, setLine] = useState<string>(COPY.warmingLines[0])
  useEffect(() => {
    const timer = setInterval(() => {
      setLine((current) => {
        const others = COPY.warmingLines.filter((l) => l !== current)
        return others[Math.floor(Math.random() * others.length)]
      })
    }, 6000)
    return () => clearInterval(timer)
  }, [])
  return line
}
