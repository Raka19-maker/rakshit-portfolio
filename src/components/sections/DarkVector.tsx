import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { darkVector, person } from '../../content/site'
import { useReveal } from '../../hooks/useReveal'
import { gsap, useGSAP } from '../../lib/gsap'
import { SectionHeading } from '../SectionHeading'

export function DarkVector() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  // Giant red wordmark drifts sideways as the section scrolls through.
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.fromTo(
        '[data-dv-mark]',
        { xPercent: 6 },
        {
          xPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    },
    { scope: ref },
  )

  const hasServices = darkVector.services.length > 0
  const list = hasServices ? darkVector.services : darkVector.practiceAreas

  return (
    <section
      ref={ref}
      id="dark-vector"
      aria-labelledby="dv-title"
      className="relative overflow-hidden bg-panel py-24 text-ink sm:py-32 lg:py-40"
    >
      <div className="container-x relative">
        <SectionHeading
          index="04"
          label="Founder"
          id="dv-title"
          invert
          title={
            <>
              Dark Vector<span className="text-signal">.</span>
            </>
          }
        />

        <p
          data-dv-mark
          aria-hidden="true"
          className="-mx-1 mb-16 font-display text-[clamp(4.5rem,17vw,17rem)] leading-[0.82] font-black tracking-[-0.055em] whitespace-nowrap text-signal select-none lg:mb-24"
        >
          DARK VECTOR<span className="text-ink">.</span>
        </p>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p data-reveal-chars className="font-display text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.2] font-bold tracking-[-0.015em]">
              {darkVector.legalName}
            </p>
            <p data-reveal className="mt-4 text-ink/70">
              {darkVector.role} · {person.fullName}
            </p>
            {darkVector.description && (
              <p data-reveal className="mt-8 max-w-[56ch] leading-relaxed text-ink/80">
                {darkVector.description}
              </p>
            )}
            {darkVector.website && (
              <a
                data-reveal
                href={darkVector.website}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-semibold hover:border-signal hover:text-signal"
              >
                Visit Dark Vector <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            )}
          </div>

          <div className="lg:col-span-6">
            <h3 data-reveal className="eyebrow text-ink/70">
              {hasServices ? 'Services' : 'Founder’s practice areas'}
            </h3>
            <ul className="mt-4 border-t border-ink/25">
              {list.map((item, i) => (
                <li key={item} data-reveal className="flex items-baseline gap-4 border-b border-ink/15 py-4">
                  <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
