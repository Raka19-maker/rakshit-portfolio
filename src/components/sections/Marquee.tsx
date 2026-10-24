import { useRef } from 'react'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { gsap, useGSAP } from '../../lib/gsap'

const ROLES = ['APPSEC ENGINEER', 'PENETRATION TESTER', 'BUG HUNTER', 'FOUNDER OF DARK VECTOR']

/** How far the band slides sideways for each pixel scrolled. */
const SCROLL_RATIO = 1.1

function Row({ outline = false }: { outline?: boolean }) {
  // Repeated so the band never runs out of type while it loops.
  const items = [...ROLES, ...ROLES, ...ROLES]
  return (
    <p
      className={`flex w-max items-center gap-[0.35em] font-display text-[clamp(2.25rem,min(11svh,7vw),7.5rem)] leading-[0.92] font-black tracking-[-0.04em] whitespace-nowrap ${
        outline ? 'text-outline' : 'text-ink'
      }`}
    >
      {items.map((role, i) => (
        <span key={i} data-item className="flex items-center gap-[0.35em]">
          {role}
          <span className="inline-block size-[0.16em] rounded-full bg-signal" />
        </span>
      ))}
    </p>
  )
}

/**
 * Giant roles band that rises over the bottom of the hero. It is pulled
 * sideways by the scroll: the solid row slides left as you scroll down, the
 * outlined row slides right, and both loop seamlessly so every role passes.
 */
export function Marquee() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const rows = gsap.utils.toArray<HTMLElement>('[data-row]').map((el, i) => ({
        el,
        // Row a runs left, row b runs right.
        sign: i === 0 ? -1 : 1,
        period: 0,
        offset: 0,
      }))
      // One loop is the distance from the first role to its repeat.
      const measure = () =>
        rows.forEach((r) => {
          const items = r.el.querySelectorAll<HTMLElement>('[data-item]')
          r.period = items[ROLES.length].offsetLeft - items[0].offsetLeft
          // Start row b part-way through so the two rows don't line up.
          r.offset = r.sign > 0 ? -r.period * 0.55 : 0
        })
      measure()

      // Ease toward the scroll position so the band glides rather than ticks.
      let travel = window.scrollY * SCROLL_RATIO
      const tick = () => {
        travel += (window.scrollY * SCROLL_RATIO - travel) * 0.12
        rows.forEach((r) => {
          if (!r.period) return
          gsap.set(r.el, { x: gsap.utils.wrap(-r.period, 0, r.offset + r.sign * travel) })
        })
      }
      gsap.ticker.add(tick)
      window.addEventListener('resize', measure)

      return () => {
        gsap.ticker.remove(tick)
        window.removeEventListener('resize', measure)
      }
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      aria-label="Roles"
      className="pointer-events-none relative z-20 -mt-[14svh] overflow-hidden pb-10 sm:pb-16"
    >
      <p className="sr-only">{ROLES.join(', ')}</p>
      <div aria-hidden="true" className="flex flex-col gap-1 sm:gap-3">
        <div data-row="a" className="will-change-transform">
          <Row />
        </div>
        <div data-row="b" className="will-change-transform">
          <Row outline />
        </div>
      </div>
    </section>
  )
}
