import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { navLinks, person } from '../content/site'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Mobile menu: Escape closes, focus moves in and back out, page can't scroll behind it.
  useEffect(() => {
    if (!open) return
    firstLink.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled || open ? 'border-b border-line bg-paper' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="container-x flex h-16 items-center justify-between">
        <a href="#top" className="font-display text-[0.95rem] font-black tracking-[-0.01em]" onClick={() => setOpen(false)}>
          {person.fullName.toUpperCase()}
          <span className="text-signal">.</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={active === link.id ? 'true' : undefined}
                className={`relative py-2 text-[0.82rem] font-medium transition-colors hover:text-signal ${
                  active === link.id ? 'text-ink' : 'text-muted-strong'
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-signal transition-transform duration-300 ${
                    active === link.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            </li>
          ))}
        </ul>

        <button
          ref={toggle}
          type="button"
          className="-mr-2 inline-flex size-10 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-line bg-paper md:hidden"
      >
        <ul className="container-x flex flex-col py-6">
          {navLinks.map((link, i) => (
            <li key={link.id} className="border-b border-line">
              <a
                ref={i === 0 ? firstLink : undefined}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className="flex items-baseline justify-between py-4 font-display text-3xl font-extrabold tracking-[-0.02em] hover:text-signal"
              >
                {link.label}
                <span className="font-mono text-xs font-normal text-muted-strong">{String(i + 1).padStart(2, '0')}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
