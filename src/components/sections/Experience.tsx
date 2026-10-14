import { Award, Briefcase, GraduationCap } from 'lucide-react'
import { useRef } from 'react'
import { certifications, timeline } from '../../content/site'
import { useReveal } from '../../hooks/useReveal'
import { gsap, useGSAP } from '../../lib/gsap'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { SectionHeading } from '../SectionHeading'

const icons = { experience: Briefcase, education: GraduationCap, certification: Award }

export function Experience() {
  const ref = useRef<HTMLElement>(null)
  const rail = useRef<HTMLDivElement>(null)
  useReveal(ref)

  // The red rail draws itself as the timeline scrolls through.
  useGSAP(
    () => {
      if (prefersReducedMotion() || !rail.current) return
      gsap.fromTo(
        rail.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 70%', scrub: 0.4 },
        },
      )
    },
    { scope: ref },
  )

  return (
    <section ref={ref} id="experience" aria-labelledby="exp-title" className="bg-paper py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <SectionHeading
          index="05"
          label="Experience & achievements"
          id="exp-title"
          title={
            <>
              The record<span className="text-signal">.</span>
            </>
          }
        />

        <div className="grid gap-16 lg:grid-cols-12">
          <div data-timeline className="relative lg:col-span-8">
            <div className="absolute top-2 bottom-2 left-[7px] w-px bg-line" aria-hidden="true" />
            <div ref={rail} className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-signal" aria-hidden="true" />

            <ol className="flex flex-col gap-14">
              {timeline.map((item) => {
                const Icon = icons[item.type]
                return (
                  <li key={item.title} className="relative pl-10 sm:pl-14">
                    <span
                      className="absolute top-1.5 left-0 size-[15px] border-2 border-signal bg-paper"
                      aria-hidden="true"
                    />
                    <p data-reveal className="font-mono text-xs tracking-[0.12em] text-muted-strong uppercase">
                      {item.period}
                    </p>
                    <h3 data-reveal-chars className="mt-2 font-display text-2xl font-extrabold tracking-[-0.02em] sm:text-[1.75rem]">
                      {item.title}
                    </h3>
                    <p data-reveal className="mt-1 flex items-center gap-2 font-medium text-signal">
                      <Icon className="size-4" aria-hidden="true" />
                      {item.org}
                    </p>
                    {item.points && (
                      <ul data-reveal className="mt-4 flex flex-col gap-2 text-muted-strong">
                        {item.points.map((p) => (
                          <li key={p} className="flex gap-3">
                            <span className="mt-[0.7em] h-px w-3 shrink-0 bg-ink/40" aria-hidden="true" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ol>
          </div>

          <aside className="lg:col-span-4" aria-labelledby="cert-title">
            <div className="lg:sticky lg:top-28">
              <h3 id="cert-title" data-reveal className="eyebrow text-muted-strong">
                Certifications
              </h3>
              <ul className="mt-4 border-t border-ink">
                {certifications.map((c) => (
                  <li key={c.name} data-reveal className="border-b border-line py-5">
                    <p className="flex items-center gap-2 font-display text-xl font-extrabold">
                      <Award className="size-4 text-signal" aria-hidden="true" />
                      {c.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-strong">{c.issuer}</p>
                    {c.status && (
                      <p className="mt-2 inline-block border border-signal px-2 py-0.5 font-mono text-[0.68rem] text-signal">
                        {c.status}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
