import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { darkVector, person } from '../../content/site'
import { prefersReducedMotion } from '../../hooks/useReducedMotion'
import { useReveal } from '../../hooks/useReveal'
import { gsap, useGSAP } from '../../lib/gsap'

type IconName = (typeof darkVector.offerings)[number]['icon'] | (typeof darkVector.why)[number]['icon']

/** Line icons, drawn in on scroll. Each path is normalised to pathLength 1. */
const ICONS: Record<IconName, string[]> = {
  web: ['M6 10 H42 V38 H6 Z', 'M6 17 H42', 'M10 13.5 h1 M14 13.5 h1', 'M13 25 l-4 4 4 4 M35 25 l4 4 -4 4 M27 23 l-6 12'],
  api: ['M18 8 C12 8 14 20 8 24 C14 28 12 40 18 40', 'M30 8 C36 8 34 20 40 24 C34 28 36 40 30 40', 'M20 24 h1 M24 24 h1 M28 24 h1'],
  mobile: ['M14 4 H34 V44 H14 Z', 'M14 10 H34 M14 37 H34', 'M23 40.5 h2', 'M19 18 H29 M19 23 H26 M19 28 H29'],
  report: ['M10 4 H30 L38 12 V44 H10 Z', 'M30 4 V12 H38', 'M16 20 H32 M16 26 H28', 'M17 35 l4 4 9 -9'],
  founder: ['M31 14 A7 7 0 1 0 17 14 A7 7 0 1 0 31 14', 'M10 42 C10 31 17 26 24 26 C31 26 38 31 38 42', 'M30 36 l3 3 6 -6'],
  manual: ['M32 20 A12 12 0 1 0 8 20 A12 12 0 1 0 32 20', 'M29 29 L41 41', 'M15 20 l3 3 6 -6'],
  actionable: ['M10 4 H30 L38 12 V44 H10 Z', 'M30 4 V12 H38', 'M16 19 H32 M16 25 H32 M16 31 H25', 'M29 36 l3 3 -3 3'],
  retest: ['M37 18 A14 14 0 0 0 11 17', 'M11 30 A14 14 0 0 0 37 31', 'M37 10 V18 H29', 'M11 38 V30 H19', 'M19 24 l4 4 7 -7'],
}

function LineIcon({ name }: { name: IconName }) {
  return (
    <svg data-dv-icon viewBox="0 0 48 48" className="size-11 text-signal" aria-hidden="true">
      {ICONS[name].map((d) => (
        <path key={d} d={d} pathLength={1} strokeDasharray="1" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  )
}

export function DarkVector() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // Wordmark: a lime stroke traces the letters, then they fill in.
      gsap
        .timeline({ scrollTrigger: { trigger: '[data-dv-mark]', start: 'top 85%', once: true } })
        .fromTo('[data-dv-mark] text', { strokeDashoffset: 1600, fillOpacity: 0 }, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' })
        .to('[data-dv-mark] text', { fillOpacity: 1, duration: 0.7, ease: 'power1.out' }, '-=0.5')
        .add(() => ref.current?.querySelector('[data-dv-mark]')?.classList.add('dv-glow'))

      // Icons draw in, staggered across each row.
      gsap.utils.toArray<HTMLElement>('[data-dv-icons]').forEach((row) => {
        gsap.fromTo(
          row.querySelectorAll('[data-dv-icon] path'),
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: 'power2.out',
            stagger: 0.06,
            scrollTrigger: { trigger: row, start: 'top 85%', once: true },
          },
        )
      })

      // Each reason's rule draws across before its text rises.
      gsap.fromTo(
        '[data-dv-rule]',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: 'power3.inOut', stagger: 0.12, scrollTrigger: { trigger: '[data-dv-why]', start: 'top 85%', once: true } },
      )
    },
    { scope: ref },
  )

  return (
    <section
      ref={ref}
      id="dark-vector"
      aria-labelledby="dv-title"
      className="relative overflow-hidden bg-panel py-24 text-ink sm:py-32 lg:py-40"
    >
      <div className="container-x relative">
        <p data-reveal className="eyebrow flex items-center gap-3 text-ink/70">
          <span className="text-signal">04</span>
          <span className="h-px w-8 bg-ink/30" aria-hidden="true" />
          Founder
        </p>

        {/* The name, once: a wordmark that always fits the container */}
        <h2 id="dv-title" className="mt-6">
          <span className="sr-only">{darkVector.name}</span>
          <svg data-dv-mark viewBox="0 0 1000 170" className="block w-full max-w-[960px] overflow-visible" aria-hidden="true">
            <text
              x={0}
              y={138}
              textLength={990}
              lengthAdjust="spacingAndGlyphs"
              fontSize={168}
              fontWeight={900}
              letterSpacing={-6}
              className="font-display"
              fill="var(--color-signal)"
              stroke="var(--color-signal)"
              strokeWidth={2}
              strokeDasharray={1600}
            >
              Dark Vector
              <tspan fill="var(--color-ink)" stroke="var(--color-ink)">
                .
              </tspan>
            </text>
          </svg>
        </h2>
        <p data-reveal className="mt-5 font-mono text-xs tracking-[0.2em] text-ink/60 uppercase">
          Security Solutions · {darkVector.role}: {person.fullName}
        </p>
        <p data-reveal-chars className="mt-8 max-w-[34ch] font-display text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.2] font-bold tracking-[-0.015em]">
          {darkVector.tagline}
        </p>

        {/* What Dark Vector does */}
        <div className="mt-20 lg:mt-28">
          <h3 data-reveal className="eyebrow text-ink/70">
            What Dark Vector does
          </h3>
          <ul data-dv-icons className="mt-6 grid gap-px overflow-hidden border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
            {darkVector.offerings.map((o) => (
              <li key={o.title} data-reveal className="flex flex-col gap-4 bg-panel p-6 sm:p-7">
                <LineIcon name={o.icon} />
                <p className="font-display text-lg font-bold tracking-[-0.01em]">{o.title}</p>
                <p className="text-sm leading-relaxed text-ink/70">{o.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Why choose Dark Vector */}
        <div className="mt-20 lg:mt-28">
          <h3 data-reveal className="eyebrow text-ink/70">
            Why choose Dark Vector
          </h3>
          <ul data-dv-why data-dv-icons className="mt-6 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {darkVector.why.map((w) => (
              <li key={w.title} className="relative pt-6">
                <span data-dv-rule className="absolute inset-x-0 top-0 h-px origin-left bg-signal" aria-hidden="true" />
                <LineIcon name={w.icon} />
                <p data-reveal className="mt-5 font-semibold">
                  {w.title}
                </p>
                <p data-reveal className="mt-2 text-sm leading-relaxed text-ink/70">
                  {w.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Context */}
        <div className="mt-20 grid gap-8 border-t border-ink/15 pt-10 lg:mt-28 lg:grid-cols-12">
          <h3 data-reveal className="eyebrow text-ink/70 lg:col-span-4">
            About the practice
          </h3>
          <div className="lg:col-span-8">
            {darkVector.description && (
              <p data-reveal className="max-w-[60ch] leading-relaxed text-ink/80">
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
        </div>
      </div>
    </section>
  )
}
