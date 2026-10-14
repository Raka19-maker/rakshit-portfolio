import { ArrowUpRight, FileText, CodeXml, UserRound, Mail, MapPin, Phone, Shield } from 'lucide-react'
import { useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { contact, heroMedia, navLinks, person } from '../../content/site'
import { useReveal } from '../../hooks/useReveal'

const year = new Date().getFullYear()

type Link = { label: string; value: string; href: string; icon: LucideIcon; external?: boolean }

export function Contact({ hasResume }: { hasResume: boolean }) {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  const links: Link[] = [
    { label: 'Email', value: contact.email, href: `mailto:${contact.email}`, icon: Mail },
    { label: 'LinkedIn', value: 'in/rakshit-tomar-7604021a', href: contact.linkedin, icon: UserRound, external: true },
  ]
  if (contact.github) links.push({ label: 'GitHub', value: 'GitHub', href: contact.github, icon: CodeXml, external: true })
  if (contact.hackTheBox)
    links.push({ label: 'Hack The Box', value: 'Hack The Box', href: contact.hackTheBox, icon: Shield, external: true })
  if (contact.showPhone && contact.phone)
    links.push({ label: 'Phone', value: contact.phone, href: `tel:${contact.phone.replace(/[^+\d]/g, '')}`, icon: Phone })
  if (hasResume) links.push({ label: 'Resume', value: 'Download PDF', href: heroMedia.resumePdf, icon: FileText, external: true })

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="bg-paper pt-24 sm:pt-32 lg:pt-40">
      <div className="container-x">
        <p data-reveal className="eyebrow flex items-center gap-3 text-muted-strong">
          <span className="text-signal">06</span>
          <span className="h-px w-8 bg-line" aria-hidden="true" />
          Contact
        </p>
        <h2 id="contact-title" className="mt-6 font-display text-mega font-black tracking-[-0.045em]">
          <span className="line-mask">
            <span data-reveal-line>Have an app</span>
          </span>
          <span className="line-mask">
            <span data-reveal-line className="text-outline">
              in mind?
            </span>
          </span>
          <span className="line-mask">
            <span data-reveal-line>
              Let’s <span className="text-signal">test it.</span>
            </span>
          </span>
        </h2>

        <a
          data-reveal
          href={`mailto:${contact.email}`}
          className="group mt-12 inline-flex max-w-full items-center gap-3 border-b-2 border-ink pb-2 font-display text-[clamp(1.1rem,3.6vw,2.4rem)] font-bold tracking-[-0.02em] break-all transition-colors hover:border-signal hover:text-signal sm:mt-16"
        >
          {contact.email}
          <ArrowUpRight className="size-[0.9em] shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
        </a>

        <ul className="mt-16 grid sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {links.map(({ label, value, href, icon: Icon, external }) => (
            <li key={label} data-reveal className="border-t border-line">
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="group flex h-full items-start justify-between gap-4 py-6 pr-4 transition-colors hover:text-signal sm:p-6"
              >
                <span>
                  <span className="eyebrow block text-muted-strong">{label}</span>
                  <span className="mt-2 block font-semibold break-all">{value}</span>
                </span>
                <Icon className="size-5 shrink-0" aria-hidden="true" />
              </a>
            </li>
          ))}
          <li data-reveal className="border-t border-line">
            <div className="flex h-full items-start justify-between gap-4 py-6 pr-4 sm:p-6">
              <span>
                <span className="eyebrow block text-muted-strong">Based in</span>
                <span className="mt-2 block font-semibold">{person.location}</span>
              </span>
              <MapPin className="size-5 shrink-0" aria-hidden="true" />
            </div>
          </li>
        </ul>
      </div>

      <footer className="mt-24 bg-panel text-ink lg:mt-32">
        <div className="container-x flex flex-col gap-10 py-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-3xl font-black tracking-[-0.03em] sm:text-4xl">
              {person.fullName.toUpperCase()}
              <span className="text-signal">.</span>
            </p>
            <p className="mt-2 text-sm text-ink/70">
              {person.headline} · Founder, Dark Vector Security Solutions
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#top" className="hover:text-ink">
                  Back to top ↑
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="border-t border-ink/10">
          <p className="container-x py-5 font-mono text-[0.68rem] tracking-[0.15em] text-ink/50">© {year} RAKSHIT TOMAR</p>
        </div>
      </footer>
    </section>
  )
}
