import type { RefObject } from 'react'
import { prefersReducedMotion } from './useReducedMotion'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap'

/**
 * Scroll reveals for everything inside `scope`:
 *  - [data-reveal-line]   letters rise out of their .line-mask, one after another
 *  - [data-reveal-chars]  letters fade up in sequence (headings without a mask)
 *  - [data-reveal-words]  copy "renders" word by word, tied to scroll position
 *  - [data-reveal]        fades and rises, batched for siblings
 * SplitText uses autoSplit so lines re-split after web fonts load or the
 * viewport resizes. useGSAP scopes the selectors and reverts tweens, splits
 * and ScrollTriggers on unmount, so re-renders never stack duplicates.
 * Content stays fully visible if JavaScript or GSAP never runs.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      gsap.utils.toArray<HTMLElement>('[data-reveal-line]').forEach((el) => {
        SplitText.create(el, {
          type: 'words,chars',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 115,
              rotate: 8,
              transformOrigin: '0% 100%',
              duration: 0.9,
              ease: 'expo.out',
              stagger: 0.028,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal-chars]').forEach((el) => {
        SplitText.create(el, {
          type: 'words,chars',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              opacity: 0,
              y: 18,
              duration: 0.6,
              ease: 'power3.out',
              stagger: 0.016,
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            }),
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal-words]').forEach((el) => {
        SplitText.create(el, {
          type: 'words',
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.14 },
              {
                opacity: 1,
                ease: 'none',
                stagger: 0.12,
                scrollTrigger: { trigger: el, start: 'top 88%', end: 'bottom 60%', scrub: 0.6 },
              },
            ),
        })
      })

      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      gsap.set(items, { opacity: 0, y: 36 })
      ScrollTrigger.batch(items, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, overwrite: true }),
      })
    },
    { scope },
  )
}
