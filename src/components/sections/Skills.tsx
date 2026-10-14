import { useRef } from 'react'
import { skills } from '../../content/site'
import { useReveal } from '../../hooks/useReveal'
import { SectionHeading } from '../SectionHeading'

export function Skills() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section ref={ref} id="skills" aria-labelledby="skills-title" className="bg-paper py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <SectionHeading index="03" label="Skills" id="skills-title" title={<>The toolkit<span className="text-signal">.</span></>} />

        <div className="border-t border-ink">
          {skills.map((group, i) => (
            <div key={group.group} className="grid gap-4 border-b border-line py-8 sm:py-10 lg:grid-cols-12 lg:gap-12">
              <div data-reveal className="lg:col-span-4">
                <h3 className="flex items-baseline gap-4 font-display text-xl font-extrabold tracking-[-0.015em] sm:text-2xl">
                  <span className="font-mono text-xs font-normal text-signal">{String(i + 1).padStart(2, '0')}</span>
                  {group.group}
                </h3>
                {group.note && <p className="mt-2 pl-8 text-sm text-muted-strong">{group.note}</p>}
              </div>
              <ul data-reveal className="flex flex-wrap gap-2 lg:col-span-8">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="border border-line bg-paper px-3.5 py-2 text-sm font-medium transition-colors hover:border-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
