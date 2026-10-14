import type { ReactNode } from 'react'

type Props = {
  index: string
  label: string
  title: ReactNode
  id?: string
  invert?: boolean
}

export function SectionHeading({ index, label, title, id, invert = false }: Props) {
  return (
    <div className="mb-12 sm:mb-16 lg:mb-20">
      <p data-reveal className={`eyebrow flex items-center gap-3 ${invert ? 'text-ink/70' : 'text-muted-strong'}`}>
        <span className="text-signal">{index}</span>
        <span className={`h-px w-8 ${invert ? 'bg-ink/30' : 'bg-line'}`} aria-hidden="true" />
        {label}
      </p>
      <h2 id={id} className="mt-5 font-display text-display font-black tracking-[-0.035em]">
        <span className="line-mask">
          <span data-reveal-line>{title}</span>
        </span>
      </h2>
    </div>
  )
}
