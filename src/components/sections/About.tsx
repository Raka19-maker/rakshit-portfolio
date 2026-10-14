import { useRef } from 'react'
import { about, heroMedia } from '../../content/site'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { useReveal } from '../../hooks/useReveal'
import { gsap, useGSAP } from '../../lib/gsap'
import { SectionHeading } from '../SectionHeading'

export function About({ hasImage }: { hasImage: boolean }) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  // Stats count up once when they scroll into view.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count)
        const decimals = Number(el.dataset.decimals)
        const counter = { v: 0 }
        gsap.to(counter, {
          v: end,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = counter.v.toFixed(decimals)
          },
        })
      })
      if (hasImage) {
        gsap.fromTo(
          '[data-about-photo]',
          { yPercent: -8, scale: 1.12 },
          { yPercent: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-about-frame]', scrub: true } },
        )
      }
    },
    { scope: ref, dependencies: [hasImage] },
  )

  return (
    <section ref={ref} id="about" aria-labelledby="about-title" className="bg-paper py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <SectionHeading
          index="01"
          label="About"
          id="about-title"
          title={
            <>
              Behind the work<span className="text-signal">.</span>
            </>
          }
        />

        <p
          data-reveal-words
          className="max-w-[30ch] font-display text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.12] font-bold tracking-[-0.025em] text-balance"
        >
          {about.statement.map((part, i) => (
            <span key={i} className={part.highlight ? 'text-signal' : undefined}>
              {part.text}
            </span>
          ))}
        </p>

        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12 lg:gap-16">
          {hasImage && (
            <div data-reveal data-about-frame className="relative aspect-[4/5] overflow-hidden bg-mist lg:col-span-4">
              <img
                data-about-photo
                src={heroMedia.image}
                alt="Rakshit Tomar"
                className="absolute inset-x-0 top-0 mx-auto h-[150%] w-auto max-w-none object-contain"
                loading="lazy"
              />
            </div>
          )}

          <div className={hasImage ? 'lg:col-span-8' : 'lg:col-span-12'}>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-ink pt-8 lg:grid-cols-4">
              {about.stats.map((s) => (
                <div key={s.label} data-reveal className="flex flex-col">
                  <dt className="order-last mt-3 text-sm leading-snug text-muted-strong">{s.label}</dt>
                  <dd className="font-display text-[clamp(2.4rem,4.4vw,3.8rem)] leading-none font-black tracking-[-0.04em] whitespace-nowrap tabular-nums">
                    <span data-count={s.value} data-decimals={s.decimals}>
                      {s.value.toFixed(s.decimals)}
                    </span>
                    {s.suffix ? (
                      <span className="ml-1 text-[0.4em] tracking-normal text-signal">{s.suffix.trim()}</span>
                    ) : (
                      <span className="text-signal">.</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              <div>
                <p data-reveal className="eyebrow text-muted-strong">Focus areas</p>
                <ul className="mt-4 border-t border-line">
                  {about.focus.map((f, i) => (
                    <li key={f} data-reveal className="flex items-baseline gap-4 border-b border-line py-3.5">
                      <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p data-reveal className="eyebrow text-muted-strong">At a glance</p>
                <dl className="mt-4 border-t border-line">
                  {about.facts.map((fact) => (
                    <div key={fact.label} data-reveal className="flex items-baseline justify-between gap-4 border-b border-line py-3.5">
                      <dt className="text-sm text-muted-strong">{fact.label}</dt>
                      <dd className="text-right font-medium">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
