import { useSyncExternalStore } from 'react'
import { ignoreSystemReducedMotion } from '../content/site'

const query = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

export function prefersReducedMotion() {
  return !ignoreSystemReducedMotion && typeof window !== 'undefined' && window.matchMedia(query).matches
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false)
}
