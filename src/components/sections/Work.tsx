import { ArrowUpRight, Lock } from 'lucide-react'
import { useRef } from 'react'
import { work, type WorkItem } from '../../content/site'
import { useReveal } from '../../hooks/useReveal'
import { SectionHeading } from '../SectionHeading'

function Preview({ item }: { item: WorkItem }) {
  // Typographic preview: no screenshots exist, and none are faked.
  return (
    <div
      className="relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden bg-panel p-6 text-ink sm:p-8 lg:aspect-auto lg:h-full lg:min-h-[420px]"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between font-mono text-[0.65rem] tracking-[0.2em] text-ink/60">
        <span>{item.kind.split('·')[0].trim().toUpperCase()}</span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-signal" />
          {item.index}
        </span>
      </div>
      <p className="font-display text-[clamp(5rem,14vw,11rem)] leading-[0.8] font-black tracking-[-0.06em] text-ink/[0.07]">
        {item.index}
      </p>
      <div className="flex flex-wrap gap-2">
        {item.stack.map((s) => (
          <span key={s} className="border border-ink/20 px-2.5 py-1 font-mono text-[0.68rem] text-ink/80">
            {s}
          </span>
        ))}
      </div>
      <div className="absolute top-0 right-0 h-full w-[3px] bg-signal" />
    </div>
  )
}

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
                <Preview item={item} />
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
                  <div data-reveal>
                    <dt className="eyebrow text-muted-strong">Stack</dt>
                    <dd className="mt-2">{item.stack.join(' · ')}</dd>
                  </div>
                  <div data-reveal>
                    <dt className="eyebrow text-muted-strong">Outcome</dt>
                    <dd className="mt-2 font-medium">{item.outcome}</dd>
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
