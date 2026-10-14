import Lenis from 'lenis'
import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/**
 * Inertial smooth scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger
 * scrubs stay in step with it. Anchor links glide to their section. Off for
 * reduced motion, and paused while the preloader covers the page.
 */
export function useSmoothScroll(enabled: boolean, paused: boolean) {
  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({ duration: 1.15, anchors: { offset: -64 }, autoRaf: false })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenis
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      delete window.__lenis
    }
  }, [enabled])

  useEffect(() => {
    const lenis = window.__lenis
    if (!lenis) return
    if (paused) lenis.stop()
    else lenis.start()
  }, [paused, enabled])
}

declare global {
  interface Window {
    __lenis?: Lenis
  }
}
