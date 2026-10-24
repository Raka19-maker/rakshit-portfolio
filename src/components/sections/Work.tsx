import { ArrowUpRight, Lock } from 'lucide-react'
import { useRef } from 'react'
import { work } from '../../content/site'
import { useReveal } from '../../hooks/useReveal'
import { EngagementVisual } from '../EngagementVisual'
import { SectionHeading } from '../SectionHeading'

export function Work() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section ref={ref} id="work" aria-labelledby="work-title" className="bg-mist py-24 sm:py-32 lg:py-40">
      <div className="container-x">
        <SectionHeading index="02" label="Selected work" id="work-title" title={<>Selected work<span className="text-signal">.</span></>} />

        <ol className="flex flex-col gap-20 lg:gap-28">
          {work.map((item, i) => (
            <li key={item.index} className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div data-reveal className={`lg:col-span-6 ${i % 2 ? 'lg:order-2' : ''}`}>
                <EngagementVisual item={item} />
              </div>

              <article className={`flex flex-col lg:col-span-6 ${i % 2 ? 'lg:order-1' : ''}`}>
                <p data-reveal className="eyebrow text-signal">{item.kind}</p>
                <h3 data-reveal-chars className="mt-4 font-display text-title font-black tracking-[-0.03em]">
                  {item.title}
                </h3>

                <dl className="mt-8 flex flex-col gap-6 text-[0.98rem] leading-relaxed">
                  <div data-reveal>
                    <dt className="eyebrow text-muted-strong">Context</dt>
                    <dd className="mt-2">{item.context}</dd>
                  </div>
                  <div data-reveal>
                    <dt className="eyebrow text-muted-strong">Contribution</dt>
                    <dd className="mt-2">
                      <ul className="flex flex-col gap-2">
                        {item.contribution.map((c) => (
                          <li key={c} className="flex gap-3">
                            <span className="mt-[0.7em] h-px w-3 shrink-0 bg-signal" aria-hidden="true" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>

                {(item.link || item.note) && (
                  <div data-reveal className="mt-8 flex flex-wrap items-center gap-4">
                    {item.link && (
                      <a
                        href={item.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 border-b border-ink pb-1 text-sm font-semibold hover:border-signal hover:text-signal"
                      >
                        {item.link.label}
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </a>
                    )}
                    {item.note && (
                      <span className="inline-flex items-center gap-2 text-sm text-muted-strong">
                        <Lock className="size-3.5" aria-hidden="true" />
                        {item.note}
                      </span>
                    )}
                  </div>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
